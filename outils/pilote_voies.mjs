// Pilote des voies : calcule, pour chaque voie, les stuffs Offensif et Équilibré et les combos de toutes les
// situations (T1 à 13 et 12 PA, T2 à 22 et 23 PA, corps à corps), en faisant des allers-retours stuff ↔ combos.
//
// Usage :  node outils/pilote_voies.mjs [--voies terre-eau,feu] [--travailleurs 7] [--beam 4000] [--beam-final 12000]
//                                        [--essais 16] [--iter 100000] [--paires 12] [--tours 3] [--dossier outils/resultats/voies]
// Par défaut : toutes les voies sauf Terre-Feu (déjà vérifiée en jeu ; --voies terre-feu la relance comme contrôle).
//
//         node outils/pilote_voies.mjs --equilibres-seulement [--voies …]
//         [--passes-max 10] [--passes-stables 2] [--trouve-min 3]
// Recalcule seulement les stuffs Équilibrés (nouveau profil du 16/11/2026), sur les combos déjà publiés
// (site/data/voies/<voie>.json, les 4 combos T1 / T2), sans toucher aux Offensifs ni aux combos. Par défaut : les
// 11 voies, Terre-Feu comprise. Le 1er essai part de l'Offensif. Les dégâts « equilibre » de chaque combo (corps à
// corps compris) et la moyenne sont recalculés avec le nouveau stuff dans outils/resultats/voies/<voie>.json ; il
// reste à lancer outils/publier_voies.mjs. Une voie dont aucun essai ne respecte toutes les contraintes n'est pas
// modifiée : son meilleur compromis est écrit à part (<voie>.equilibre-compromis.json).
//
//         node outils/pilote_voies.mjs --offensifs-seulement [--voies …] [--passes-max 10] [--passes-stables 2] [--trouve-min 3]
// Même chose pour les stuffs Offensifs (18/11/2026) : sur les combos publiés, sans toucher aux Équilibrés ni aux
// combos. Le 1er essai part de l'Offensif actuel, un essai de plus part de l'Équilibré (il respecte aussi les
// contraintes de l'Offensif : l'Offensif ne peut donc pas taper moins que lui). Les dégâts « offensif » de chaque
// combo (corps à corps compris) et la moyenne sont recalculés.
//
// Méthode des passes (les deux modes ci-dessus) : une passe = --essais essais (16) de l'optimiseur, chacun avec sa
// graine (passe 1 : graines 1 à 16, passe 2 : 17 à 32…) ; le 1er essai de chaque passe part du meilleur stuff trouvé,
// les 15 autres partent au hasard. On s'arrête quand le meilleur n'a pas bougé pendant --passes-stables passes ET a
// été retrouvé au moins --trouve-min fois par des essais partis au hasard ; au plus --passes-max passes.
//
// Règles (✅ choix du joueur, 13/11/2026) :
//  - un seul jeu de variantes par voie pour tous ses combos (on ne change pas de variante en plein combat) ;
//  - Glas exclu (niveau 200) ; Perturbation exclue en Terre-Feu seulement ;
//  - le score d'un stuff est la moyenne des 4 combos T1 / T2 ; le corps à corps n'y compte pas ;
//  - équilibre entre éléments : 10 % (bi-éléments), 20 % (multi) ;
//  - Équilibré (nouveau profil, 16/11/2026) : 12 PA / 6 PM, au moins 3 500 PV (4 500 PV n'est qu'un repère), aucune
//    résistance % négative sur les cinq éléments, moyenne des cinq ≥ 20 %, pas de condition de portée.
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
const EQ_SEUL = argv.includes('--equilibres-seulement'), OFF_SEUL = argv.includes('--offensifs-seulement');
const PROFIL_SEUL = EQ_SEUL ? 'equilibre' : OFF_SEUL ? 'offensif' : null;
if (EQ_SEUL && OFF_SEUL) { console.error('--equilibres-seulement et --offensifs-seulement : un seul à la fois'); process.exit(1); }
const CFG = {
  voies: (opt('voies') || Object.keys(VOIES).filter((v) => PROFIL_SEUL || v !== 'terre-feu').join(',')).split(','),
  travailleurs: +opt('travailleurs', 7), beam: +opt('beam', 4000), beamFinal: +opt('beam-final', 12000),
  essais: +opt('essais', 16), iter: +opt('iter', 100000), tours: +opt('tours', 3), paires: +opt('paires', 12),
  dossier: opt('dossier', join(HERE, 'resultats', 'voies')),
  // --equilibres-seulement / --offensifs-seulement : passes jusqu'à convergence (voir recalculerProfil).
  passesMax: +opt('passes-max', 10), passesStables: +opt('passes-stables', 2), trouveMin: +opt('trouve-min', 3),
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
  // moteur : version des règles (2 = corrections du joueur du 14/11/2026) ; une nouvelle version refait les recherches.
  const spec = { situation, stats, bannis: [...new Set(bannis)].sort(), beam, moteur: 2 };
  return tache('recherche', spec, async (cle, sortie) => {
    const f = join(CACHE, `recherche-${cle}.spec.json`);
    writeFileSync(f, JSON.stringify(spec));
    await processus([join(HERE, 'tache_recherche.mjs'), f, sortie]);
  });
}
// Optimisation d'un stuff : --essais essais en parallèle (un processus par graine), on garde le meilleur.
// Le 1er essai part du stuff « depart » (objets), ce qui garantit de ne jamais faire moins bien.
// graine0 : décalage des graines (passes successives de recalculerProfil : graines 17 à 32, puis 33 à 48…).
// Le résultat porte aussi la liste de tous les essais (propriété « essais », non écrite dans les fichiers).
async function optimiser(voie, profil, combos, depart, { graine0 = 0, nb = CFG.essais } = {}) {
  const essais = await Promise.all(Array.from({ length: nb }, (_, i) => {
    const spec = { voie, profil, combos, depart: i === 0 ? depart || null : null, graine: graine0 + i + 1, iter: CFG.iter, paires: CFG.paires, version: 2, malus: 2, // malus 2 : plus petit malus (17/11/2026)
      // version 2 : descente par paires (les essais de la version 1 ne servent plus)
      ...(profil === 'equilibre' ? { profilEquilibre: '2026-11-16' } : {}) }; // nouveau profil Équilibré : les anciens essais ne servent plus
    return tache('stuff', spec, async (cle, sortie) => {
      const fc = join(CACHE, `stuff-${cle}.combos.json`);
      writeFileSync(fc, JSON.stringify(combos));
      const a = [join(HERE, 'optimiseur_stuff.mjs'), '--voie', voie, '--profil', profil, '--essais', '1', '--iter', String(CFG.iter),
        '--graine', String(graine0 + i + 1), '--combos', fc, '--sortie', sortie, '--paires', String(CFG.paires)];
      if (spec.depart) { const fd = join(CACHE, `stuff-${cle}.depart.json`); writeFileSync(fd, JSON.stringify({ objets: depart })); a.push('--depart', fd); }
      await processus(a);
    });
  }));
  const ok = essais.filter((e) => e.contraintesRespectees);
  const pool = ok.length ? ok : essais;
  const best = pool.reduce((a, b) => (b.score > a.score ? b : a));
  const meme = pool.filter((e) => e.score === best.score).length;
  Object.defineProperty(best, 'essais', { value: essais, enumerable: false });
  const rp = best.resistancesPct;
  journal(voie, `stuff ${profil} : ${best.score} (trouvé ${meme} fois sur ${nb}${ok.length ? '' : ', CONTRAINTES NON RESPECTÉES'}) — ${best.pv} PV, PO ${best.po}${rp ? `, résistances % min ${rp.min} / moyenne ${rp.moyenne}` : ''}, ${best.ecartElements}`);
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

// ---------- Un seul profil (--equilibres-seulement, --offensifs-seulement) ----------
const SITE_VOIES = join(HERE, '..', 'site', 'data', 'voies');
const NOM = { offensif: 'Offensif', equilibre: 'Équilibré' };
async function recalculerProfil(voie, profil) {
  const autreProfil = profil === 'offensif' ? 'equilibre' : 'offensif', Nom = NOM[profil];
  const fichier = join(CFG.dossier, `${voie}.json`);
  const r = JSON.parse(readFileSync(fichier, 'utf8'));
  const pub = JSON.parse(readFileSync(join(SITE_VOIES, `${voie}.json`), 'utf8'));
  // Combos notés : les 4 combos T1 / T2 publiés (le corps à corps ne compte pas dans le score).
  const combosPub = Object.fromEntries(SITUATIONS_SCORE.map((s) => [s, pub.combos[s].lignes]));
  const ancien = r.stuffs[profil], autre = r.stuffs[autreProfil];
  journal(voie, `${Nom} seul : ancien ${ancien.score} (${ancien.pv} PV, PO ${ancien.po}) ; ${NOM[autreProfil]} ${autre.score}`);
  // Passe 1 : 16 essais ; le 1er part de l'Offensif (pour l'Équilibré) ou de l'Offensif actuel (pour l'Offensif).
  // Un essai de plus part de l'ancien Équilibré (pour l'Équilibré) ou de l'Équilibré (pour l'Offensif) : on ne fait
  // jamais moins bien que lui. Passes suivantes : 16 nouvelles graines, le 1er essai part du meilleur trouvé.
  // Arrêt : meilleur inchangé pendant --passes-stables passes ET retrouvé au moins --trouve-min fois par des essais
  // partis au hasard (le 1er essai de chaque passe et l'essai de plus ne comptent pas) ; au plus --passes-max passes.
  // Ce n'est pas une preuve d'optimalité : un meilleur stuff peut exister.
  const depart0 = profil === 'offensif' ? ancien.objets : r.stuffs.offensif.objets;
  const departBis = profil === 'offensif' ? autre.objets : ancien?.objets;
  let best = await optimiser(voie, profil, combosPub, depart0);
  const hasard = []; // scores des essais partis au hasard qui respectent toutes les contraintes
  const noter = (x) => hasard.push(...x.essais.slice(1).filter((e) => e.contraintesRespectees).map((e) => e.score));
  noter(best);
  if (departBis) {
    const e1 = await optimiser(voie, profil, combosPub, departBis, { graine0: 1000, nb: 1 });
    if (e1.contraintesRespectees && (!best.contraintesRespectees || e1.score > best.score)) {
      journal(voie, `  départ de l'${profil === 'offensif' ? 'Équilibré' : 'Équilibré précédent'} : ${best.score} → ${e1.score}`); best = e1;
    }
  }
  const retrouve = () => hasard.filter((x) => x === best.score).length;
  let stables = 0, passe = 1, converge = false;
  for (; passe < CFG.passesMax; passe++) {
    if (best.contraintesRespectees && stables >= CFG.passesStables && retrouve() >= CFG.trouveMin) { converge = true; break; }
    const e2 = await optimiser(voie, profil, combosPub, best.contraintesRespectees ? best.objets : depart0, { graine0: passe * CFG.essais });
    noter(e2);
    const mieux = e2.contraintesRespectees && (!best.contraintesRespectees || e2.score > best.score);
    journal(voie, `  passe ${passe + 1} : ${e2.score} — ${mieux ? `MIEUX (${best.score} → ${e2.score})` : `meilleur inchangé (${best.score}, retrouvé ${retrouve()} fois au hasard)`}`);
    if (mieux) { best = e2; stables = 0; } else stables++;
  }
  if (!converge && best.contraintesRespectees && stables >= CFG.passesStables && retrouve() >= CFG.trouveMin) converge = true;
  const bilan = `${passe} passe(s), ${passe * CFG.essais} essais ; meilleur retrouvé ${retrouve()} fois au hasard ; ${converge ? 'convergé' : 'ARRÊT au maximum de passes, sans convergence'}`;
  journal(voie, `${Nom} : ${bilan}`);
  if (!best.contraintesRespectees) {
    writeFileSync(join(CFG.dossier, `${voie}.${profil}-compromis.json`), JSON.stringify(best, null, 1));
    journal(voie, `AUCUN essai ne respecte toutes les contraintes : rien n'est changé, meilleur compromis dans ${voie}.${profil}-compromis.json`);
    return { voie, ok: false, best };
  }
  const off = profil === 'offensif' ? best : autre, eq = profil === 'offensif' ? autre : best;
  if (eq.score > off.score) journal(voie, `ATTENTION : l'Équilibré (${eq.score}) tape plus que l'Offensif (${off.score})`);
  r.stuffs[profil] = best;
  for (const g of ['combos', 'corpsACorps']) for (const f2 of Object.values(r[g])) f2.degats[profil] = Math.round(combo(f2.lignes, best.stats));
  r.moyenne[profil] = Math.round(moyenne(lignesDe(r.combos, SITUATIONS_SCORE), best.stats));
  const cleRecalc = `${profil}Recalcule`; // equilibreRecalcule, offensifRecalcule
  r[cleRecalc] = { date: new Date().toISOString().slice(0, 10), ...(best.contraintes ? { profil: best.contraintes } : {}), recherche: bilan,
    ancien: r[cleRecalc]?.ancien ?? { score: ancien.score, pv: ancien.pv, po: ancien.po } };
  writeFileSync(fichier, JSON.stringify(r, null, 1));
  journal(voie, `${Nom} seul TERMINÉ : ${ancien.score} → ${best.score} (moyenne publiée ${r.moyenne[profil]}, ${NOM[autreProfil]} ${r.moyenne[autreProfil]})`);
  return { voie, ok: true, best };
}

if (PROFIL_SEUL) {
  journal('pilote', `${NOM[PROFIL_SEUL]}s seuls : ${CFG.voies.join(', ')} ; ${CFG.travailleurs} processus ; ${CFG.essais} essais × ${CFG.iter} itérations ; `
    + `passes : au plus ${CFG.passesMax}, ${CFG.passesStables} stables, retrouvé ${CFG.trouveMin} fois`);
  const echecs = [], infaisables = [];
  await Promise.all(CFG.voies.map((v) => recalculerProfil(v, PROFIL_SEUL).then((x) => { if (!x.ok) infaisables.push(v); })
    .catch((e) => { echecs.push(v); journal(v, `ERREUR : ${e.message}`); })));
  journal('pilote', [echecs.length ? `erreurs : ${echecs.join(', ')}` : '', infaisables.length ? `contraintes impossibles à tenir : ${infaisables.join(', ')}` : '']
    .filter(Boolean).join(' ; ') || `tous les ${NOM[PROFIL_SEUL]}s sont recalculés`);
  process.exit(echecs.length || infaisables.length ? 1 : 0);
}

journal('pilote', `voies : ${CFG.voies.join(', ')} ; ${CFG.travailleurs} processus ; faisceau ${CFG.beam} puis ${CFG.beamFinal} ; ${CFG.essais} essais × ${CFG.iter} itérations`);
const echecs = [];
await Promise.all(CFG.voies.map((v) => traiterVoie(v).catch((e) => { echecs.push(v); journal(v, `ERREUR : ${e.message}`); })));
journal('pilote', echecs.length ? `fini avec des erreurs : ${echecs.join(', ')}` : 'toutes les voies sont terminées');
process.exit(echecs.length ? 1 : 0);
