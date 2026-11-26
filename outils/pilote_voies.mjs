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
import { VOIES, combo, jouable } from './degats.mjs';
import { lireArme, degatsCoupArme, TYPES_ARMES } from '../moteur/armes.mjs';
import { SITUATIONS_SCORE, SITUATIONS, departCombo } from '../moteur/situations.mjs';
import { creerSimulateur } from '../moteur/simulateur.mjs';
import { empecheLesPAPM } from './conditions.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const EQ_SEUL = argv.includes('--equilibres-seulement'), OFF_SEUL = argv.includes('--offensifs-seulement');
const AVEC_ARME = argv.includes('--avec-arme');
const PROFIL_SEUL = EQ_SEUL ? 'equilibre' : OFF_SEUL ? 'offensif' : null;
if (EQ_SEUL && OFF_SEUL) { console.error('--equilibres-seulement et --offensifs-seulement : un seul à la fois'); process.exit(1); }
const CFG = {
  voies: (opt('voies') || Object.keys(VOIES).filter((v) => PROFIL_SEUL || AVEC_ARME || v !== 'terre-feu').join(',')).split(','),
  armes: +opt('armes', 4), // --avec-arme : nombre d'armes essayées au départ (les meilleures en dégâts par PA)
  travailleurs: +opt('travailleurs', 7), beam: +opt('beam', 4000), beamFinal: +opt('beam-final', 12000),
  essais: +opt('essais', 16), iter: +opt('iter', 100000), tours: +opt('tours', 3), paires: +opt('paires', 12),
  dossier: opt('dossier', join(HERE, 'resultats', 'voies')),
  // --equilibres-seulement / --offensifs-seulement : passes jusqu'à convergence (voir recalculerProfil).
  passesMax: +opt('passes-max', 10), passesStables: +opt('passes-stables', 2), trouveMin: +opt('trouve-min', 3),
};
// PM du stuff (✅ 24/11/2026) : --pm-min 5 --pm-max 5 cherche des stuffs à exactement 5 PM (12 PA toujours obligatoires).
// --rapide (24/11/2026) : sans recuit, une descente (objet par objet, puis par paires) depuis chaque stuff de départ ; sert
// à refaire les stuffs à 6 PM en partant des stuffs publiés dont on retire l'Arcaniste (choix du joueur).
// --depistage (24/11/2026) : une seule passe (16 essais) ; sert à repérer les stuffs à 5 PM qui peuvent passer le seuil de +5 %.
const RAPIDE = argv.includes('--rapide'), DEPISTAGE = argv.includes('--depistage');
// (--depistage --passes-max 2 : une 2e passe, qui reprend la 1re depuis le cache.)
if (DEPISTAGE && opt('passes-max') === undefined) CFG.passesMax = 1;
const METHODE = RAPIDE ? 'rapide' : DEPISTAGE ? 'depistage' : 'complete';
const PM_MIN = +opt('pm-min', 6), PM_MAX = opt('pm-max') === undefined ? Infinity : +opt('pm-max');
const PM_TAG = PM_MIN === 6 && !Number.isFinite(PM_MAX) ? 'pm6' : PM_MIN === PM_MAX ? `pm${PM_MIN}` : `pm${PM_MIN}-${PM_MAX}`;
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
function recherche(stats, bannis, situation, beam, arme = null) {
  // moteur : version des règles (2 = corrections du joueur du 14/11/2026) ; une nouvelle version refait les recherches.
  // Avec une arme (coup d'arme, 18/11/2026) : version 3, l'arme fait partie de la description.
  const spec = { situation, stats, bannis: [...new Set(bannis)].sort(), beam, moteur: 2, ...(arme ? { moteur: 3, arme } : {}) };
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
// descente : sans recuit, descente objet par objet et par paires depuis « depart » (mode --rapide, 24/11/2026).
async function optimiser(voie, profil, combos, depart, { graine0 = 0, nb = CFG.essais, descente = false } = {}) {
  const essais = await Promise.all(Array.from({ length: nb }, (_, i) => {
    const spec = { voie, profil, combos, depart: i === 0 ? depart || null : null, graine: graine0 + i + 1, iter: CFG.iter, paires: CFG.paires, version: 2, malus: 2, // malus 2 : plus petit malus (17/11/2026)
      ...(combos.jeux ? { armes: 1 } : {}), // jeux de combos et coup d'arme (18/11/2026)
      // version 2 : descente par paires (les essais de la version 1 ne servent plus)
      ...(profil === 'equilibre' ? { profilEquilibre: '2026-11-16' } : {}), // nouveau profil Équilibré : les anciens essais ne servent plus
      ...(descente ? { methode: 'descente' } : {}),
      ...reglesObjets() }; // objets exclus et minimum de PM (24/11/2026) : un changement de ces règles refait les essais
    return tache('stuff', spec, async (cle, sortie) => {
      const fc = join(CACHE, `stuff-${cle}.combos.json`);
      writeFileSync(fc, JSON.stringify(combos));
      const a = [join(HERE, 'optimiseur_stuff.mjs'), '--voie', voie, '--profil', profil, '--essais', '1', '--iter', String(CFG.iter),
        '--graine', String(graine0 + i + 1), '--combos', fc, '--sortie', sortie, '--paires', String(CFG.paires), ...argsPM(), ...(descente ? ['--descente-seule'] : [])];
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
async function resoudre(voie, stats, base, sits, beam, fixes = {}, arme = null) {
  const lancer = async (fx, garder = {}) => Object.fromEntries(await Promise.all(sits.map(async (s) =>
    [s, garder[s] || await recherche(stats, bannisDe(base, fx), s, beam, arme)])));
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
// Format 2 (24/11/2026) : depuis le coup d'arme, chaque stuff a ses combos (site/data/voies/<voie>.json : combos.offensif,
// combos.equilibre). Le stuff recalculé est noté sur le meilleur jeu jouable avec son arme parmi : les combos publiés de
// l'Offensif, ceux de l'Équilibré, et les combos d'avant le coup d'arme (sans arme, toujours jouables : un stuff qui change
// d'arme n'est donc jamais à 0). Les combos ne sont pas recherchés à nouveau.
// Le résultat est écrit à part, sans toucher aux résultats ni au site : <dossier>/stuffs-<pm>/<voie>.<profil>.json
// (<pm> : pm6, ou pm5 avec --pm-min 5 --pm-max 5). Le choix entre 6 et 5 PM et la publication se font ensuite.
// Méthode des passes : voir passes() plus bas. Ce n'est pas une preuve d'optimalité : un meilleur stuff peut exister.
const SITE_VOIES = join(HERE, '..', 'site', 'data', 'voies');
const NOM = { offensif: 'Offensif', equilibre: 'Équilibré' };
const dossierPM = (tag) => join(CFG.dossier, `stuffs-${tag}`);
const lireSiExiste = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null);
function jeuxPublies(voie) {
  const pub = JSON.parse(readFileSync(join(SITE_VOIES, `${voie}.json`), 'utf8'));
  const r = JSON.parse(readFileSync(join(CFG.dossier, `${voie}.json`), 'utf8'));
  if (pub.format !== 2) throw new Error(`${voie} : site/data/voies/${voie}.json n'est pas au format 2`);
  const S = SITUATIONS_SCORE;
  // Ordre des coups (Dofus Turquoise, 24/11/2026) : chaque combo est rejoué par le moteur depuis son départ ; ses lignes
  // doivent être retrouvées à l'identique, sinon on s'arrête.
  const sequence = (s, fiche) => {
    const A = (fiche.coups || []).length ? armeDe(fiche.arme) : null;
    if ((fiche.coups || []).length && !A) throw new Error(`${voie} ${s} : arme introuvable (${fiche.arme})`);
    const sim = creerSimulateur({ stats: pub.stuffs.offensif.stats, opt: { tacle: !!SITUATIONS[s].tacle }, arme: A });
    const d = departCombo(s, fiche.caseMonstre), seq = sim.sequenceCombo(d, fiche.actions), l = sim.lignesCombo(d, fiche.actions);
    const tri = (o) => JSON.stringify(Object.entries(o).sort());
    if (tri(l) !== tri(fiche.lignes)) throw new Error(`${voie} ${s} : le combo rejoué ne retrouve pas ses lignes (${tri(l)} au lieu de ${tri(fiche.lignes)})`);
    return seq;
  };
  const jeu = (nom, fiches) => ({ nom, arme: S.map((s) => ((fiches[s].coups || []).length ? fiches[s].arme : null)).find(Boolean) || null,
    combos: Object.fromEntries(S.map((s) => [s, { lignes: fiches[s].lignes, coups: fiches[s].coups || [], sequence: sequence(s, fiches[s]) }])) });
  const jeux = [jeu("combos publiés de l'Offensif", pub.combos.offensif), jeu("combos publiés de l'Équilibré", pub.combos.equilibre)];
  if (r.avantArme) jeux.push(jeu("combos d'avant le coup d'arme (sans arme)", Object.fromEntries(S.map((s) => [s, { ...r.avantArme.combos[s], coups: [] }]))));
  if (!jeux.some((j) => !j.arme)) throw new Error(`${voie} : aucun jeu de combos sans coup d'arme`);
  const uniques = jeux.filter((j, i) => jeux.findIndex((x) => signatureJeu(x) === signatureJeu(j)) === i);
  return { pub, jeux: uniques };
}
async function recalculerProfil(voie, profil) {
  const autreProfil = profil === 'offensif' ? 'equilibre' : 'offensif', Nom = NOM[profil];
  const { pub, jeux } = jeuxPublies(voie);
  const ancien = pub.stuffs[profil], autre = pub.stuffs[autreProfil];
  // Départs. Le 1er essai de la passe 1 part du stuff publié du profil (à 5 PM : du meilleur stuff à 6 PM trouvé, s'il
  // existe) ; des essais de plus partent de l'autre stuff publié et, à 5 PM, des autres stuffs connus. Un objet devenu
  // exclu (l'Arcaniste, 24/11/2026) est retiré par l'optimiseur : son emplacement part vide et la recherche le remplit.
  const pm6 = PM_TAG === 'pm6' ? null : lireSiExiste(join(dossierPM('pm6'), `${voie}.${profil}.json`));
  const pm6Autre = PM_TAG === 'pm6' ? null : lireSiExiste(join(dossierPM('pm6'), `${voie}.${autreProfil}.json`));
  // À 6 PM avec --depistage (affinage, 25/11/2026) : une passe de recuit qui part du meilleur stuff à 6 PM déjà trouvé
  // (les descentes de --rapide sont déjà faites depuis tous les stuffs connus : pas d'autre départ).
  const actuel6 = PM_TAG === 'pm6' && DEPISTAGE ? lireSiExiste(join(dossierPM('pm6'), `${voie}.${profil}.json`)) : null;
  const depart0 = actuel6?.ok ? actuel6.best.objets : pm6?.best?.objets || ancien.objets;
  const bis = actuel6?.ok ? [] : [autre.objets, ...(pm6 ? [ancien.objets] : []), ...(pm6Autre?.best ? [pm6Autre.best.objets] : [])];
  // Mode --rapide : la descente part aussi des stuffs déjà trouvés pour cette voie (les deux profils, 6 PM et 5 PM) : un
  // stuff à 5 PM peut redevenir un bon stuff à 6 PM en changeant un ou deux objets, et inversement (25/11/2026).
  if (RAPIDE) for (const tag of ['pm6', 'pm5']) for (const pr of [profil, autreProfil]) {
    const x = lireSiExiste(join(dossierPM(tag), `${voie}.${pr}.json`));
    if (x?.ok && x.best?.objets) bis.push(x.best.objets);
  }
  journal(voie, `${Nom} seul (${PM_TAG}) : publié ${ancien.score} (${ancien.pv} PV, ${ancien.pm} PM) ; jeux : ${jeux.map((j) => j.nom).join(' / ')}${pm6 ? ` ; départ du meilleur à 6 PM (${pm6.best.score})` : ''}`);
  const P = RAPIDE ? await descentes(voie, profil, pourOptimiseur(jeux), [depart0, ...bis], `${Nom} ${PM_TAG}`)
    : await passes(voie, profil, pourOptimiseur(jeux), depart0, bis, `${Nom} ${PM_TAG}`);
  const best = P.best;
  mkdirSync(dossierPM(PM_TAG), { recursive: true });
  // Un résultat de recherche complète n'est jamais écrasé par un résultat plus rapide (rapide ou dépistage) : on compare.
  const fichierPM = join(dossierPM(PM_TAG), `${voie}.${profil}.json`), existant = lireSiExiste(fichierPM);
  // Et jamais par un résultat moins bon (25/11/2026) : le meilleur stuff trouvé reste, quelle que soit la méthode.
  if (existant?.ok && ((METHODE !== 'complete' && (existant.methode || 'complete') === 'complete' && existant.best.score >= best.score)
    || !best.contraintesRespectees || existant.best.score > best.score)) {
    journal(voie, `${Nom} (${PM_TAG}) : résultat précédent gardé (${existant.best.score}, ${existant.methode || 'complete'}) ; méthode ${METHODE} : ${best.score}${best.contraintesRespectees ? '' : ', contraintes NON respectées'}`);
    return { voie, ok: !!existant.ok, best: existant.best };
  }
  const sortie = { voie, profil, date: new Date().toISOString().slice(0, 10), methode: METHODE, regles: reglesObjets(), ok: !!best.contraintesRespectees,
    jeux: jeux.map((j) => ({ nom: j.nom, arme: j.arme })), publie: { score: ancien.score, pv: ancien.pv, pm: ancien.pm, objets: ancien.objets },
    recherche: P.bilan, converge: P.converge, passes: P.passes, best };
  writeFileSync(fichierPM, JSON.stringify(sortie, null, 1));
  if (!best.contraintesRespectees) { journal(voie, `AUCUN essai ne respecte toutes les contraintes (${Nom}, ${PM_TAG})`); return { voie, ok: false, best }; }
  journal(voie, `${Nom} seul (${PM_TAG}) TERMINÉ : publié ${ancien.score} → ${best.score} (${best.pv} PV, ${best.pm} PM, jeu « ${best.combosRetenus?.nom} »)`);
  return { voie, ok: true, best };
}

// ---------- Coup d'arme (--avec-arme, 18/11/2026) ----------
// Décision du joueur (18/11/2026) : les combos dépendent du stuff. L'Offensif et l'Équilibré d'une voie ont chacun leurs
// combos et leur jeu de variantes ; l'arme du stuff peut entrer dans ses combos (moteur/armes.mjs).
//  - Offensif : recalculé. On cherche d'abord les combos avec les --armes armes qui font le plus de dégâts par PA (stats
//    de l'Offensif actuel) ; chaque recherche donne un « jeu » de combos cohérent (mêmes variantes, une arme). Le stuff
//    est optimisé par passes (comme --offensifs-seulement) sur le meilleur jeu jouable avec son arme, le jeu publié sans
//    arme restant toujours possible. Puis recherche finale (--beam-final) avec le nouveau stuff et son arme ; si ces
//    combos font mieux que le meilleur jeu connu, on recommence (au plus --tours tours).
//  - Équilibré : stuff gardé (17-18/11/2026) ; seuls ses combos sont cherchés, avec son arme.
//  - Corps à corps : cherché pour chaque stuff, avec son jeu de variantes et son arme.
// Le résultat (format 2) a des combos, des variantes et un corps à corps par stuff. Le premier état de la voie est gardé
// dans « avantArme » : relancer le pilote repart de lui (et du cache).
const ITEMS = JSON.parse(readFileSync(join(HERE, '..', 'data', 'current', 'items.json'), 'utf8')).data;
// Mêmes exclusions que l'optimiseur (niveau, MJ, conditions bloquantes, mode « sans »).
const COND_BLOQUANTE = /(^|[&|(])(PX|PN|Pm|Q[a-zA-Z]|P[sSaA]|OS|PE|BI|Sc)[<>=!~]/;
const EXCLUS_SANS = /Dolmanax|Vulbis|Dofus des Glaces|Arcaniste/i; // 24/11/2026 : Turquoise autorisé, Arcaniste banni
// Règles d'objets écrites dans la description des tâches « stuff » et « evaluation » (24/11/2026) : la clé du cache est
// l'empreinte de cette description ; sans elles, des essais faits avec d'autres objets exclus (ou un autre minimum de PM)
// seraient réutilisés. Doit rester identique à EXCLUS_SANS de outils/optimiseur_stuff.mjs (le pilote ne passe pas --mode :
// l'optimiseur est en mode « sans »).
const reglesObjets = () => ({ mode: 'sans', exclus: EXCLUS_SANS.source, pmMin: PM_MIN, ...(Number.isFinite(PM_MAX) ? { pmMax: PM_MAX } : {}) });
// Options PM passées à l'optimiseur (rien à 6 PM : comportement d'avant).
const argsPM = () => [...(PM_MIN !== 6 ? ['--pm-min', String(PM_MIN)] : []), ...(Number.isFinite(PM_MAX) ? ['--pm-max', String(PM_MAX)] : [])];
{
  const m = /const EXCLUS_SANS = \/(.*)\/i;/.exec(readFileSync(join(HERE, 'optimiseur_stuff.mjs'), 'utf8'));
  if (!m || m[1] !== EXCLUS_SANS.source) { console.error(`EXCLUS_SANS diffère entre le pilote (${EXCLUS_SANS.source}) et l'optimiseur (${m?.[1]})`); process.exit(1); }
}
const ARMES = new Map(ITEMS.filter((i) => TYPES_ARMES.includes(i.typeId)).map((i) => [i.name.fr, {
  arme: lireArme(i),
  accessible: i.level <= 199 && !/\bMJ\b/.test(i.name.fr) && !COND_BLOQUANTE.test(i.criterions || '') && !empecheLesPAPM(i.criterions, PM_MIN, PM_MAX) && !EXCLUS_SANS.test(i.name.fr),
}]));
const armeDe = (nom) => { const a = ARMES.get(nom)?.arme; return a && a.utilisable ? a : null; };
// Armes essayées au départ : les k meilleures en dégâts moyens par PA (avec les stats du stuff), plus l'arme portée.
function armesEssayees(stats, nomActuel, k) {
  const dpa = (A) => degatsCoupArme(A, stats, { melee: A.po[0] <= 1 }) / A.pa;
  const liste = [...ARMES.values()].filter((x) => x.accessible && x.arme.utilisable).map((x) => x.arme).sort((a, b) => dpa(b) - dpa(a)).slice(0, k);
  const actuelle = armeDe(nomActuel);
  if (actuelle && !liste.some((a) => a.nom === actuelle.nom)) liste.push(actuelle);
  return liste.map((a) => ({ arme: a, dpa: Math.round(dpa(a)) }));
}
// Jeu de combos (format de l'optimiseur) à partir d'une résolution (resoudre).
const signatureJeu = (j) => JSON.stringify(SITUATIONS_SCORE.map((s) => [Object.entries(j.combos[s].lignes).sort(), j.combos[s].coups]));
function jeuDe(R, A, nom) {
  const utilise = SITUATIONS_SCORE.some((s) => (R.res[s].coups || []).length);
  return { nom, arme: utilise ? A.nom : null, variantes: R.variantes, R,
    combos: Object.fromEntries(SITUATIONS_SCORE.map((s) => [s, { lignes: R.res[s].lignes, coups: R.res[s].coups || [] }])) };
}
const pourOptimiseur = (jeux) => ({ jeux: jeux.map((j) => ({ nom: j.nom, arme: j.arme, combos: j.combos })) });
// (les combos d'un jeu peuvent porter « sequence », l'ordre des coups : nécessaire pour noter un stuff avec le Turquoise)
const moyJeu = (j, stats, A) => (jouable(j, A) ? SITUATIONS_SCORE.reduce((a, s) => a + combo(j.combos[s].lignes, stats, null, A), 0) / SITUATIONS_SCORE.length : -Infinity);
const moyenneArme = (combos, stats, A) => { const v = Object.values(combos); return v.reduce((a, c) => a + combo(c, stats, null, A), 0) / v.length; };

// Évaluation d'un stuff donné (sans recherche) sur des combos : optimiseur en mode --objets.
function evaluerStuff(voie, profil, combos, objets) {
  const spec = { voie, profil, combos, objets, malus: 2, armes: 1, ...reglesObjets() };
  return tache('evaluation', spec, async (cle, sortie) => {
    const fc = join(CACHE, `evaluation-${cle}.combos.json`);
    writeFileSync(fc, JSON.stringify(combos));
    const liste = Object.values(objets).filter(Boolean).join(';');
    await processus([join(HERE, 'optimiseur_stuff.mjs'), '--voie', voie, '--profil', profil, '--objets', liste, '--combos', fc, '--sortie', sortie, ...argsPM()]);
  });
}

// Passes de l'optimiseur jusqu'à convergence (méthode de --offensifs-seulement) : passe 1 = graines 1 à 16, le 1er essai
// part de depart0 ; un essai de plus part de departBis (l'Équilibré) ; passes suivantes : 16 nouvelles graines, le
// 1er essai part du meilleur. Arrêt : meilleur inchangé pendant --passes-stables passes ET retrouvé --trouve-min fois
// par des essais partis au hasard ; au plus --passes-max passes.
// departBis : un stuff, ou une liste de stuffs (un essai de plus pour chacun, graines 1000, 1001…).
async function passes(voie, profil, combos, depart0, departBis, etiquette) {
  let best = await optimiser(voie, profil, combos, depart0);
  const hasard = [];
  const noter = (x) => hasard.push(...x.essais.slice(1).filter((e) => e.contraintesRespectees).map((e) => e.score));
  noter(best);
  const bis = (Array.isArray(departBis) ? departBis : [departBis]).filter(Boolean);
  for (const [k, d] of bis.entries()) {
    const e1 = await optimiser(voie, profil, combos, d, { graine0: 1000 + k, nb: 1 });
    if (e1.contraintesRespectees && (!best.contraintesRespectees || e1.score > best.score)) { journal(voie, `  ${etiquette} : départ supplémentaire ${k + 1} ${best.score} → ${e1.score}`); best = e1; }
  }
  const retrouve = () => hasard.filter((x) => x === best.score).length;
  let stables = 0, passe = 1, converge = false;
  for (; passe < CFG.passesMax; passe++) {
    if (best.contraintesRespectees && stables >= CFG.passesStables && retrouve() >= CFG.trouveMin) { converge = true; break; }
    const e2 = await optimiser(voie, profil, combos, best.objets, { graine0: passe * CFG.essais });
    noter(e2);
    const mieux = e2.contraintesRespectees && (!best.contraintesRespectees || e2.score > best.score);
    journal(voie, `  ${etiquette}, passe ${passe + 1} : ${e2.score} — ${mieux ? `MIEUX (${best.score} → ${e2.score})` : `meilleur inchangé (${best.score}, retrouvé ${retrouve()} fois au hasard)`}`);
    if (mieux) { best = e2; stables = 0; } else stables++;
  }
  if (!converge && best.contraintesRespectees && stables >= CFG.passesStables && retrouve() >= CFG.trouveMin) converge = true;
  const bilan = `${passe} passe(s), ${passe * CFG.essais} essais ; meilleur retrouvé ${retrouve()} fois au hasard ; ${converge ? 'convergé' : 'ARRÊT au maximum de passes, sans convergence'}`;
  journal(voie, `  ${etiquette} : ${bilan}`);
  return { best, bilan, converge, passes: passe };
}

// Mode --rapide : une descente seule depuis chaque départ (en parallèle), on garde le meilleur.
async function descentes(voie, profil, combos, departs, etiquette) {
  const uniques = departs.filter(Boolean).filter((d, i, t) => t.findIndex((x) => JSON.stringify(x) === JSON.stringify(d)) === i);
  const res = await Promise.all(uniques.map((d, k) => optimiser(voie, profil, combos, d, { graine0: 2000 + k, nb: 1, descente: true })));
  const ok = res.filter((e) => e.contraintesRespectees), pool = ok.length ? ok : res;
  const best = pool.reduce((a, b) => (b.score > a.score ? b : a));
  const bilan = `descente seule depuis ${res.length} stuff(s) : ${res.map((e) => e.score + (e.contraintesRespectees ? '' : ' (contraintes non respectées)')).join(' / ')}`;
  journal(voie, `  ${etiquette} : ${bilan}`);
  return { best, bilan, converge: false, passes: 0 };
}

// Fiche d'un combo (format 2) : ses dégâts avec le stuff auquel il appartient.
const ficheArme = (r, profil, stats, A, src) => ({
  caseMonstre: r.caseMonstre, actions: r.actions, lignes: r.lignes, paRestants: r.paRestants, journal: r.journal,
  arme: (r.coups || []).length ? A.nom : null, coups: r.coups || [],
  degats: { [profil]: Math.round(combo(r.lignes, stats, null, A)) }, trouveAvec: src,
});

async function traiterVoieArme(voie) {
  const fichier = join(CFG.dossier, `${voie}.json`);
  const r = JSON.parse(readFileSync(fichier, 'utf8'));
  const pub = JSON.parse(readFileSync(join(SITE_VOIES, `${voie}.json`), 'utf8'));
  // État de départ : les résultats publiés avant le coup d'arme (format 1). Gardé pour les relances.
  const ancien = r.avantArme || { stuffs: r.stuffs, combos: pub.combos, corpsACorps: pub.corpsACorps, variantes: r.variantes, moyenne: r.moyenne, date: r.date };
  const V = VOIES[voie], base = V.sansPerturbation ? ['Perturbation'] : [], S = SITUATIONS_SCORE;
  const offA = ancien.stuffs.offensif, eqS = ancien.stuffs.equilibre;
  journal(voie, `coup d'arme : Offensif publié ${offA.score} (${offA.objets.arme}), Équilibré gardé ${eqS.score} (${eqS.objets.arme})`);
  // Jeu publié, sans coup d'arme : toujours jouable.
  const jeuPublie = { nom: 'combos publiés (sans arme)', arme: null, variantes: ancien.variantes, publie: true,
    combos: Object.fromEntries(S.map((s) => [s, { lignes: ancien.combos[s].lignes, coups: [] }])) };
  const reeval = await evaluerStuff(voie, 'offensif', pourOptimiseur([jeuPublie]), offA.objets);
  journal(voie, `  ancien Offensif réévalué (malus corrigés) : ${offA.score} → ${reeval.score}`);

  // 1. Combos avec les armes essayées (faisceau --beam), stats de l'Offensif actuel.
  const essayees = armesEssayees(offA.stats, offA.objets.arme, CFG.armes);
  journal(voie, `  armes essayées : ${essayees.map((x) => `${x.arme.nom} (${x.dpa}/PA)`).join(', ')}`);
  const jeuxArmes = await Promise.all(essayees.map(async ({ arme: A }) => jeuDe(await resoudre(voie, offA.stats, base, S, CFG.beam, {}, A), A, `${A.nom} (faisceau ${CFG.beam})`)));
  const jeux = [jeuPublie];
  for (const j of jeuxArmes) {
    journal(voie, `  ${j.nom} : ${S.map((s) => `${s} ${Math.round(j.R.res[s].degats)}${j.combos[s].coups.length ? ' (arme)' : ''}`).join(', ')}`);
    if (j.arme && !jeux.some((x) => signatureJeu(x) === signatureJeu(j))) jeux.push(j);
  }

  // 2. Allers-retours stuff ↔ combos.
  let off = null, depart = offA.objets, bilan = null;
  const tours = [], candidats = [];
  for (let k = 1; k <= CFG.tours; k++) {
    const P = await passes(voie, 'offensif', pourOptimiseur(jeux), depart, eqS.objets, `Offensif tour ${k}`);
    off = P.best; bilan = P; candidats.push(off);
    const A = armeDe(off.objets.arme);
    const Rf = await resoudre(voie, off.stats, base, S, CFG.beamFinal, {}, A);
    const jf = jeuDe(Rf, A ?? { nom: null }, `tour ${k} : ${off.objets.arme} (faisceau ${CFG.beamFinal})`);
    const sf = moyJeu(jf, off.stats, A);
    const nouveau = !jeux.some((x) => signatureJeu(x) === signatureJeu(jf));
    if (nouveau) jeux.push(jf);
    journal(voie, `tour ${k} : stuff ${off.score} (${off.objets.arme}, jeu ${off.combosRetenus?.nom}) ; combos cherchés avec ce stuff ${Math.round(sf)} (${S.map((s) => `${s} ${Math.round(combo(jf.combos[s].lignes, off.stats, null, A))}${jf.combos[s].coups.length ? ' arme' : ''}`).join(', ')})`);
    tours.push({ tour: k, stuff: off.score, arme: off.objets.arme, jeu: off.combosRetenus?.nom, combosTrouves: Math.round(sf), passes: P.bilan });
    if (!nouveau || sf <= off.score + 0.5) break; // les combos trouvés avec ce stuff ne font pas mieux : stable
    depart = off.objets;
  }
  const Aeq = armeDe(eqS.objets.arme);

  // 3. Équilibré : combos cherchés avec son stuff et son arme. Tout jeu jouable avec son arme peut servir.
  const Re = await resoudre(voie, eqS.stats, base, S, CFG.beamFinal, {}, Aeq);
  const je = jeuDe(Re, Aeq ?? { nom: null }, `Équilibré : ${eqS.objets.arme} (faisceau ${CFG.beamFinal})`);
  const tous = [...jeux, je];
  const choisir = (stats, Ar) => tous.map((j) => ({ j, m: moyJeu(j, stats, Ar) })).reduce((a, b) => (b.m > a.m + 1e-9 ? b : a));
  // Offensif : le meilleur couple (stuff d'un tour avec sa répartition, jeu de combos). Le stuff du dernier tour n'est pas
  // toujours le meilleur : en multi, la répartition des points est approchée (gloutonne) et un tour peut la dégrader
  // (19/11/2026 : stuff du tour 1 à 5 330 sur les combos du tour 1, stuff du tour 2 à 5 277).
  // Le stuff Équilibré tient aussi les contraintes de l'Offensif (moins strictes) : il est candidat lui aussi
  // (19/11/2026 : en Terre, l'Équilibré faisait 5 382 contre 5 381 pour l'Offensif).
  candidats.push(eqS);
  let cOff = null;
  for (const c of candidats) {
    const x = choisir(c.stats, armeDe(c.objets.arme));
    if (!cOff || x.m > cOff.m + 1e-9) { cOff = x; off = c; }
  }
  if (off === eqS) journal(voie, `  Offensif : le stuff Équilibré fait mieux que les Offensifs trouvés (${Math.round(cOff.m)}) : il est repris tel quel`);
  else if (off !== candidats.at(-2)) journal(voie, `  Offensif : le stuff du tour ${candidats.indexOf(off) + 1} fait mieux que celui du dernier tour (${Math.round(cOff.m)})`);
  const A = armeDe(off.objets.arme);
  const cEq = choisir(eqS.stats, Aeq);
  journal(voie, `  Offensif : jeu retenu « ${cOff.j.nom} » ${Math.round(cOff.m)} ; Équilibré : « ${cEq.j.nom} » ${Math.round(cEq.m)} (publié sans arme : ${Math.round(moyJeu(jeuPublie, eqS.stats, Aeq))})`);

  // 4. Fiches, corps à corps (jeu de variantes du stuff), écriture.
  const fichesDe = (c, profil, stats, Ar) => Object.fromEntries(S.map((s) => [s, c.j.publie
    ? { ...ancien.combos[s], arme: null, coups: [], degats: { [profil]: Math.round(combo(ancien.combos[s].lignes, stats, null, Ar)) }, statut: undefined, verifieEnJeu: undefined }
    : ficheArme(c.j.R.res[s], profil, stats, Ar, c.j.nom)]));
  const cac = async (c, profil, stats, Ar) => {
    const Rc = await resoudre(voie, stats, bannisDe(base, c.j.variantes), ['CAC_T1', 'CAC_T2'], CFG.beamFinal, {}, Ar);
    const out = Object.fromEntries(['CAC_T1', 'CAC_T2'].map((s) => [s, ficheArme(Rc.res[s], profil, stats, Ar, `corps à corps (${Ar ? Ar.nom : 'sans arme'})`)]));
    // Avec le jeu publié (mêmes variantes), l'ancien corps à corps reste possible : on garde le plus fort.
    if (c.j.publie) for (const s of ['CAC_T1', 'CAC_T2']) {
      const v = combo(ancien.corpsACorps[s].lignes, stats, null, Ar);
      if (v > out[s].degats[profil] + 0.5) out[s] = { ...ancien.corpsACorps[s], arme: null, coups: [], degats: { [profil]: Math.round(v) }, statut: undefined, verifieEnJeu: undefined };
    }
    return { fiches: out, variantes: Rc.variantes };
  };
  const [cacOff, cacEq] = await Promise.all([cac(cOff, 'offensif', off.stats, A), cac(cEq, 'equilibre', eqS.stats, Aeq)]);
  const combosOff = fichesDe(cOff, 'offensif', off.stats, A), combosEq = fichesDe(cEq, 'equilibre', eqS.stats, Aeq);
  const moy = (fs, p) => Math.round(S.reduce((a, s) => a + fs[s].degats[p], 0) / S.length);
  const offFinal = { ...off, score: Math.round(cOff.m), combos: Object.fromEntries(S.map((s) => [s, combosOff[s].degats.offensif])) };
  const eqFinal = { ...eqS, combos: Object.fromEntries(S.map((s) => [s, combosEq[s].degats.equilibre])), score: Math.round(cEq.m) };
  const sortie = {
    voie, elements: V.elementsPoints, date: new Date().toISOString().slice(0, 10), statut: 'simulé', format: 2,
    reglages: { beam: CFG.beam, beamFinal: CFG.beamFinal, essais: CFG.essais, iter: CFG.iter, armes: CFG.armes, bannis: [...base, 'Glas'] },
    stuffs: { offensif: offFinal, equilibre: eqFinal },
    armes: { offensif: A, equilibre: Aeq },
    variantes: { offensif: { ...cOff.j.variantes, ...cacOff.variantes }, equilibre: { ...cEq.j.variantes, ...cacEq.variantes } },
    combos: { offensif: combosOff, equilibre: combosEq },
    corpsACorps: { offensif: cacOff.fiches, equilibre: cacEq.fiches },
    moyenne: { offensif: moy(combosOff, 'offensif'), equilibre: moy(combosEq, 'equilibre') },
    offensifArme: {
      date: new Date().toISOString().slice(0, 10), ancien: { score: offA.score, reevalue: reeval.score, arme: offA.objets.arme },
      armesEssayees: essayees.map((x) => x.arme.nom), tours, recherche: bilan.bilan, converge: bilan.converge, jeuRetenu: cOff.j.nom,
    },
    equilibreArme: { jeuRetenu: cEq.j.nom, publieSansArme: Math.round(moyJeu(jeuPublie, eqS.stats, Aeq)) },
    historique: r.historique, equilibreRecalcule: r.equilibreRecalcule, avantArme: ancien,
  };
  writeFileSync(fichier, JSON.stringify(sortie, null, 1));
  journal(voie, `TERMINÉ (coup d'arme) : Offensif ${offA.score} → ${sortie.moyenne.offensif} (${off.objets.arme}), Équilibré ${sortie.moyenne.equilibre} ; corps à corps Offensif ${cacOff.fiches.CAC_T1.degats.offensif} / ${cacOff.fiches.CAC_T2.degats.offensif}`);
}

if (AVEC_ARME) {
  journal('pilote', `coup d'arme : ${CFG.voies.join(', ')} ; ${CFG.travailleurs} processus ; ${CFG.armes} armes essayées ; faisceau ${CFG.beam} puis ${CFG.beamFinal} ; `
    + `${CFG.essais} essais × ${CFG.iter} itérations ; passes : au plus ${CFG.passesMax}, ${CFG.passesStables} stables, retrouvé ${CFG.trouveMin} fois ; au plus ${CFG.tours} tours`);
  const echecs = [];
  await Promise.all(CFG.voies.map((v) => traiterVoieArme(v).catch((e) => { echecs.push(v); journal(v, `ERREUR : ${e.stack || e.message}`); })));
  journal('pilote', echecs.length ? `fini avec des erreurs : ${echecs.join(', ')}` : "toutes les voies sont terminées (coup d'arme)");
  process.exit(echecs.length ? 1 : 0);
}

if (PROFIL_SEUL) {
  journal('pilote', `${NOM[PROFIL_SEUL]}s seuls (${PM_TAG}, méthode ${METHODE}, exclus ${EXCLUS_SANS.source}) : ${CFG.voies.join(', ')} ; ${CFG.travailleurs} processus ; ${CFG.essais} essais × ${CFG.iter} itérations ; `
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
