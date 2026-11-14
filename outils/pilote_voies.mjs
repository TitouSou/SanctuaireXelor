// Pilote des voies : calcule, pour chaque voie, les stuffs Offensif et Équilibré et les combos de toutes les
// situations (T1 à 13 et 12 PA, T2 à 22 et 23 PA, corps à corps), en faisant des allers-retours stuff ↔ combos.
//
// Usage :  node outils/pilote_voies.mjs [--voies terre-eau,feu] [--travailleurs 7] [--beam 4000] [--beam-final 12000]
//                                        [--essais 16] [--iter 100000] [--paires 12] [--tours 3] [--dossier outils/resultats/voies]
// Par défaut : toutes les voies sauf Terre-Feu (déjà vérifiée en jeu ; --voies terre-feu la relance comme contrôle).
//
// Règles (✅ choix du joueur, 13/11/2026) :
//  - un seul jeu de variantes par voie pour tous ses combos (on ne change pas de variante en plein combat) ;
//  - Glas exclu (niveau 200) ; Perturbation exclue en Terre-Feu seulement ;
//  - le score d'un stuff est la moyenne des 4 combos T1 / T2 ; le corps à corps n'y compte pas ;
//  - équilibre entre éléments : 10 % (bi-éléments), 20 % (multi) ; Équilibré : 3 000 PV et PO ≥ 1.
//
// Méthode, pour chaque voie :
//  0. stuff fictif de la voie (bonnes stats dans ses éléments) → recherche des 4 combos → un seul jeu de variantes ;
//  1. optimisation du stuff Offensif sur ces combos → nouvelle recherche des combos avec ce stuff ; on recommence
//     tant que les combos changent et progressent (--tours au plus) ;
//  2. recherche finale (--beam-final), stuff Offensif et Équilibré optimisés sur les combos retenus, recherche des
//     combos avec l'Équilibré (on garde, situation par situation, le combo le plus fort sur les deux stuffs) ;
//  3. corps à corps (T1 à 12 PA, T2 à 22 PA) avec le jeu de variantes de la voie.
// Variantes en conflit : on essaie chaque variante de la paire et on garde celle qui maximise la moyenne des combos.
// Chaque tâche (recherche ou essai d'optimiseur) est mise en cache : relancer le pilote reprend où il s'était arrêté.
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SP } from '../moteur/sorts.mjs';
import { VOIES, combo } from './degats.mjs';
import { SITUATIONS_SCORE } from '../moteur/situations.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const CFG = {
  voies: (opt('voies') || Object.keys(VOIES).filter((v) => v !== 'terre-feu').join(',')).split(','),
  travailleurs: +opt('travailleurs', 7), beam: +opt('beam', 4000), beamFinal: +opt('beam-final', 12000),
  essais: +opt('essais', 16), iter: +opt('iter', 100000), tours: +opt('tours', 3), paires: +opt('paires', 12),
  dossier: opt('dossier', join(HERE, 'resultats', 'voies')),
};
const CACHE = join(CFG.dossier, 'cache');
mkdirSync(CACHE, { recursive: true });
for (const v of CFG.voies) if (!VOIES[v]) { console.error(`Voie inconnue : ${v}`); process.exit(1); }

const t0 = Date.now();
const horo = () => { const s = Math.round((Date.now() - t0) / 1000); return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
function journal(voie, msg) {
  const l = `[${horo()}] ${voie.padEnd(9)} ${msg}`;
  console.log(l);
  appendFileSync(join(CFG.dossier, 'journal.txt'), l + '\n');
}

// ---------- File de processus ----------
let actifs = 0;
const attente = [];
const libere = () => { actifs--; if (attente.length) attente.shift()(); };
async function processus(args) {
  if (actifs >= CFG.travailleurs) await new Promise((r) => attente.push(r));
  actifs++;
  try {
    return await new Promise((res, rej) => {
      const p = spawn(process.execPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
      let err = '';
      p.stderr.on('data', (d) => { err += d; });
      p.on('close', (code) => (code === 0 ? res() : rej(new Error(`Échec (${code}) : ${args.slice(0, 3).join(' ')}\n${err.slice(-2000)}`))));
    });
  } finally { libere(); }
}
// Tâche mise en cache : clé = empreinte de la description.
async function tache(type, spec, lancer) {
  const cle = createHash('sha1').update(JSON.stringify({ type, spec })).digest('hex').slice(0, 20);
  const sortie = join(CACHE, `${type}-${cle}.json`);
  if (!existsSync(sortie)) await lancer(cle, sortie);
  return JSON.parse(readFileSync(sortie, 'utf8'));
}

// Recherche d'un combo (outils/tache_recherche.mjs).
function recherche(stats, bannis, situation, beam) {
  const spec = { situation, stats, bannis: [...new Set(bannis)].sort(), beam };
  return tache('recherche', spec, async (cle, sortie) => {
    const f = join(CACHE, `recherche-${cle}.spec.json`);
    writeFileSync(f, JSON.stringify(spec));
    await processus([join(HERE, 'tache_recherche.mjs'), f, sortie]);
  });
}
// Optimisation d'un stuff : --essais essais en parallèle (un processus par graine), on garde le meilleur.
// Le 1er essai part du stuff « depart » (objets), ce qui garantit de ne jamais faire moins bien.
async function optimiser(voie, profil, combos, depart) {
  const essais = await Promise.all(Array.from({ length: CFG.essais }, (_, i) => {
    const spec = { voie, profil, combos, depart: i === 0 ? depart || null : null, graine: i + 1, iter: CFG.iter, paires: CFG.paires, version: 2 }; // version 2 : descente par paires (les essais de la version 1 ne servent plus)
    return tache('stuff', spec, async (cle, sortie) => {
      const fc = join(CACHE, `stuff-${cle}.combos.json`);
      writeFileSync(fc, JSON.stringify(combos));
      const a = [join(HERE, 'optimiseur_stuff.mjs'), '--voie', voie, '--profil', profil, '--essais', '1', '--iter', String(CFG.iter),
        '--graine', String(i + 1), '--combos', fc, '--sortie', sortie, '--paires', String(CFG.paires)];
      if (spec.depart) { const fd = join(CACHE, `stuff-${cle}.depart.json`); writeFileSync(fd, JSON.stringify({ objets: depart })); a.push('--depart', fd); }
      await processus(a);
    });
  }));
  const ok = essais.filter((e) => e.contraintesRespectees);
  const pool = ok.length ? ok : essais;
  const best = pool.reduce((a, b) => (b.score > a.score ? b : a));
  const meme = pool.filter((e) => e.score === best.score).length;
  journal(voie, `stuff ${profil} : ${best.score} (trouvé ${meme} fois sur ${CFG.essais}${ok.length ? '' : ', CONTRAINTES NON RESPECTÉES'}) — ${best.pv} PV, PO ${best.po}, ${best.ecartElements}`);
  return best;
}

// ---------- Variantes ----------
const autresVariantes = (P, o) => Object.keys(SP).filter((k) => SP[k].p === P && k !== o);
const bannisDe = (base, fixes) => [...base, ...Object.entries(fixes).flatMap(([P, o]) => autresVariantes(P, o))];
function conflits(res) {
  const parPaire = {};
  for (const r of Object.values(res)) for (const [P, o] of Object.entries(r.load)) (parPaire[P] ||= new Set()).add(o);
  return Object.entries(parPaire).filter(([, s]) => s.size > 1).map(([P, s]) => [P, [...s]]);
}
const variantesDe = (res) => Object.fromEntries(Object.values(res).flatMap((r) => Object.entries(r.load)).sort());
const moyenneRes = (res, sits) => sits.reduce((a, s) => a + res[s].degats, 0) / sits.length;

// Recherche des combos des situations « sits », puis résolution des conflits de variantes, paire par paire.
async function resoudre(voie, stats, base, sits, beam, fixes = {}) {
  const lancer = async (fx, garder = {}) => Object.fromEntries(await Promise.all(sits.map(async (s) =>
    [s, garder[s] || await recherche(stats, bannisDe(base, fx), s, beam)])));
  let res = await lancer(fixes);
  for (let n = 0; n < 20; n++) {
    const c = conflits(res);
    if (!c.length) return { res, fixes, variantes: variantesDe(res) };
    const [P, options] = c[0];
    const essais = await Promise.all(options.map(async (o) => {
      const fx = { ...fixes, [P]: o };
      const garder = Object.fromEntries(sits.filter((s) => !res[s].load[P] || res[s].load[P] === o).map((s) => [s, res[s]]));
      const r = await lancer(fx, garder);
      return { o, fx, r, moy: moyenneRes(r, sits) };
    }));
    const best = essais.reduce((a, b) => (b.moy > a.moy ? b : a));
    journal(voie, `  variantes (paire ${P}) : ${essais.map((e) => `${e.o} ${Math.round(e.moy)}`).join(' / ')} → ${best.o}`);
    fixes = best.fx; res = best.r;
  }
  throw new Error(`${voie} : conflits de variantes non résolus`);
}

// ---------- Outils ----------
// Stuff fictif de départ : stats proches des stuffs Terre-Feu, réparties sur les éléments de la voie.
function statsFictives(elements) {
  const c = { 1: 1000, 2: 880, 4: 700 }[elements.length], d = { 1: 80, 2: 65, 4: 50 }[elements.length];
  const CAR = { T: 'fo', F: 'int', E: 'cha', A: 'agi' }, DOK = { T: 'doT', F: 'doF', E: 'doE', A: 'doA' };
  const s = { fo: 100, int: 100, cha: 100, agi: 100, pui: 120, doT: 0, doF: 0, doE: 0, doA: 0, doN: 26, crit: 72, doCrit: 137, sorts: 6 };
  for (const e of elements) { s[CAR[e]] = c; s[DOK[e]] = d; }
  return s;
}
const lignesDe = (res, sits) => Object.fromEntries(sits.map((s) => [s, res[s].lignes]));
const moyenne = (combos, stats) => { const v = Object.values(combos); return v.reduce((a, c) => a + combo(c, stats), 0) / v.length; };
const signature = (combos) => JSON.stringify(Object.entries(combos).map(([k, l]) => [k, Object.entries(l).sort()]));
const resume = (res, sits) => sits.map((s) => `${s} ${Math.round(res[s].degats)}`).join(', ');

// ---------- Une voie ----------
async function traiterVoie(voie) {
  const fichier = join(CFG.dossier, `${voie}.json`);
  const V = VOIES[voie], base = V.sansPerturbation ? ['Perturbation'] : [];
  const S = SITUATIONS_SCORE, historique = [];
  journal(voie, `début (éléments ${V.elementsPoints.join('')}, écart ${V.ecart} %, ${base.length ? 'sans Perturbation' : 'Perturbation autorisée'})`);

  // 0. Combos avec le stuff fictif.
  let R = await resoudre(voie, statsFictives(V.elementsPoints), base, S, CFG.beam);
  let combos = lignesDe(R.res, S);
  journal(voie, `tour 0 (stuff fictif) : ${resume(R.res, S)}`);
  historique.push({ tour: 0, combos: resume(R.res, S) });

  // 1. Allers-retours stuff ↔ combos.
  let off = null;
  for (let k = 1; k <= CFG.tours; k++) {
    off = await optimiser(voie, 'offensif', combos, off?.objets);
    const R2 = await resoudre(voie, off.stats, base, S, CFG.beam);
    const c2 = lignesDe(R2.res, S), avant = moyenne(combos, off.stats), apres = moyenne(c2, off.stats);
    journal(voie, `tour ${k} : stuff ${off.score} ; combos avec ce stuff ${Math.round(avant)} → ${Math.round(apres)} (${resume(R2.res, S)})`);
    historique.push({ tour: k, stuff: off.score, avant: Math.round(avant), apres: Math.round(apres), combos: resume(R2.res, S) });
    const progres = signature(c2) !== signature(combos) && apres > avant + 0.5;
    if (!progres) break; // combos stables : le stuff est optimisé sur les bons combos
    R = R2; combos = c2;
  }

  // 2. Recherche finale, puis stuffs Offensif et Équilibré.
  const Rf = await resoudre(voie, off.stats, base, S, CFG.beamFinal);
  const cf = lignesDe(Rf.res, S);
  journal(voie, `recherche finale (faisceau ${CFG.beamFinal}) : ${Math.round(moyenne(combos, off.stats))} → ${Math.round(moyenne(cf, off.stats))}`);
  if (moyenne(cf, off.stats) > moyenne(combos, off.stats)) { R = Rf; combos = cf; }
  off = await optimiser(voie, 'offensif', combos, off.objets);
  let eq = await optimiser(voie, 'equilibre', combos, off.objets);
  // L'Équilibré respecte aussi les contraintes de l'Offensif : s'il tape plus, l'Offensif repart de lui.
  const offensifAuMoinsEquilibre = async () => {
    if (eq.score > off.score) { journal(voie, 'l\'Équilibré tape plus que l\'Offensif : nouvel essai de l\'Offensif à partir de lui'); off = await optimiser(voie, 'offensif', combos, eq.objets); }
  };
  await offensifAuMoinsEquilibre();

  // Combos cherchés aussi avec l'Équilibré, dans le jeu de variantes de la voie ; on garde le plus fort sur les deux stuffs.
  const bannisVoie = bannisDe(base, R.variantes);
  const choix = { ...R.res }, trouve = Object.fromEntries(S.map((s) => [s, 'offensif']));
  for (const s of S) {
    const r = await recherche(eq.stats, bannisVoie, s, CFG.beamFinal);
    const somme = (x) => combo(x.lignes, off.stats) + combo(x.lignes, eq.stats);
    const essai = { ...choix, [s]: r };
    if (somme(r) > somme(choix[s]) + 0.5 && !conflits(essai).length) { choix[s] = r; trouve[s] = 'equilibre'; }
  }
  const cfin = lignesDe(choix, S);
  if (signature(cfin) !== signature(combos)) {
    combos = cfin;
    journal(voie, 'combos changés par la recherche avec l\'Équilibré : nouvelle optimisation des stuffs');
    off = await optimiser(voie, 'offensif', combos, off.objets);
    eq = await optimiser(voie, 'equilibre', combos, eq.objets);
    await offensifAuMoinsEquilibre();
  }
  const variantes = variantesDe(choix);

  // 3. Corps à corps, avec le jeu de variantes de la voie (les paires libres restent libres).
  const Rc = await resoudre(voie, off.stats, bannisDe(base, variantes), ['CAC_T1', 'CAC_T2'], CFG.beamFinal);

  const fiche = (r, src) => ({
    caseMonstre: r.caseMonstre, actions: r.actions, lignes: r.lignes, paRestants: r.paRestants, journal: r.journal,
    degats: { offensif: Math.round(combo(r.lignes, off.stats)), equilibre: Math.round(combo(r.lignes, eq.stats)) }, trouveAvec: src,
  });
  const sortie = {
    voie, elements: V.elementsPoints, date: new Date().toISOString().slice(0, 10), statut: 'simulé',
    reglages: { beam: CFG.beam, beamFinal: CFG.beamFinal, essais: CFG.essais, iter: CFG.iter, bannis: [...base, 'Glas'] },
    variantes: { ...variantes, ...variantesDe(Rc.res) },
    stuffs: { offensif: off, equilibre: eq },
    combos: Object.fromEntries(S.map((s) => [s, fiche(choix[s], trouve[s])])),
    corpsACorps: Object.fromEntries(['CAC_T1', 'CAC_T2'].map((s) => [s, fiche(Rc.res[s], 'offensif')])),
    moyenne: { offensif: Math.round(moyenne(combos, off.stats)), equilibre: Math.round(moyenne(combos, eq.stats)) },
    historique,
  };
  writeFileSync(fichier, JSON.stringify(sortie, null, 1));
  journal(voie, `TERMINÉ : moyenne Offensif ${sortie.moyenne.offensif}, Équilibré ${sortie.moyenne.equilibre} ; corps à corps ${resume(Rc.res, ['CAC_T1', 'CAC_T2'])}`);
}

journal('pilote', `voies : ${CFG.voies.join(', ')} ; ${CFG.travailleurs} processus ; faisceau ${CFG.beam} puis ${CFG.beamFinal} ; ${CFG.essais} essais × ${CFG.iter} itérations`);
const echecs = [];
await Promise.all(CFG.voies.map((v) => traiterVoie(v).catch((e) => { echecs.push(v); journal(v, `ERREUR : ${e.message}`); })));
journal('pilote', echecs.length ? `fini avec des erreurs : ${echecs.join(', ')}` : 'toutes les voies sont terminées');
process.exit(echecs.length ? 1 : 0);
