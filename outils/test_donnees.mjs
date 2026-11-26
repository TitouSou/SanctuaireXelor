// Test de lecture des données figées (data/current/) : les stuffs de référence (docs/RESULTATS_REFERENCE.md),
// évalués par l'optimiseur sans recherche, doivent retrouver leurs stats, PV, PO, PA, PM et panoplies.
// À relancer après chaque mise à jour DofusDB appliquée.
// Mode « tous les objets » (24/11/2026) : ces stuffs contiennent l'Arcaniste, banni du mode « sans » du joueur ; ils ne
// contiennent ni Dolmanax, ni Vulbis, ni Dofus des Glaces, donc leur évaluation est la même dans les deux modes.
// Usage :  node outils/test_donnees.mjs
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const COMMUNS = ["Collier du YeCh'Ti", "Mitaine du YeCh'Ti", 'Ceinture Bine', 'Cape Peupret', 'Katana de Spiritueur',
  "Bras du YeCh'Ti", 'Sakochère', 'Dofus Ocre', 'Dofus Pourpre', 'Puissant majeur', 'Arcaniste'];
// Base commune des stuffs retenus le 13/11/2026.
const BASE = ['Coiffe de Padgref', "Collier du YeCh'Ti", "Mitaine du YeCh'Ti", 'Anneau de Padgref', 'Geta de Padgref',
  "Fût d'Aspiratueur", 'Katana de Spiritueur', "Bras du YeCh'Ti", 'Sakochère', 'Dofus Ocre', 'Dofus Pourpre',
  'Puissant majeur', 'Arcaniste', 'Savant majeur', 'Furibond majeur'];
const PANOS = ['Panoplie de Padgref 3', "Panoplie du YeCh'Ti 3", 'Panoplie des Spiritueurs 2'];
const STUFFS = {
  Offensif: {
    objets: [...BASE, 'Ceinture Hanium'], panoplies: PANOS, ecartMax: 10,
    attendu: { foStuff: 420, intStuff: 630, agi: 610, cha: 100, pui: 120, doT: 51, doF: 76, doA: 64, doE: 0, crit: 72, doCrit: 137, sorts: 6, pv: 3025, po: 0 },
  },
  Équilibré: {
    objets: [...BASE, 'Ceinture de Brouce'], panoplies: PANOS, ecartMax: 10,
    attendu: { foStuff: 460, intStuff: 570, agi: 610, cha: 100, pui: 120, doT: 57, doF: 64, doA: 64, doE: 0, crit: 72, doCrit: 137, sorts: 6, pv: 3075, po: 2 },
  },
  // Anciens stuffs (remplacés le 13/11/2026) : toujours utiles pour vérifier la lecture des données.
  'Ancien Offensif': {
    objets: [...COMMUNS, 'Coiffe de Padgref', 'Anneau de Padgref', 'Geta de Padgref', 'Forcené majeur', 'Furibond majeur'],
    panoplies: ['Panoplie de Padgref 3', "Panoplie du YeCh'Ti 3", 'Panoplie du frigostien approximatif 2'],
    // fo et int : part du stuff seule (sans parchemins ni points), soit 770 − 100 − 210 et 905 − 100 − 315.
    attendu: { foStuff: 460, intStuff: 490, agi: 590, cha: 150, pui: 200, doT: 52, doF: 77, doA: 77, doE: 22, crit: 68, doCrit: 122, sorts: 6, pv: 2625, po: 3 },
  },
  'Ancien Équilibré': {
    objets: [...COMMUNS, 'Casque de Missiz Frizz', 'Alliance de Missiz Frizz', 'Bottes de Missiz Frizz', 'Savant majeur', 'Astucieux majeur'],
    panoplies: ['Panoplie de Missiz Frizz 3', "Panoplie du YeCh'Ti 3", 'Panoplie du frigostien approximatif 2'],
    attendu: { foStuff: 460, intStuff: 640, agi: 380, cha: 330, pui: 240, doT: 82, doF: 82, doA: 52, doE: 52, crit: 50, doCrit: 75, sorts: 6, pv: 3425, po: 2 },
  },
};

let erreurs = 0;
for (const [nom, st] of Object.entries(STUFFS)) {
  const out = execFileSync(process.execPath, [join(HERE, 'optimiseur_stuff.mjs'), '--voie', 'terre-feu', '--mode', 'tous', '--objets', st.objets.join(';')], { encoding: 'utf8' });
  const j = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1));
  const obtenu = { ...j.stats, foStuff: j.stats.fo - 100 - j.points.fo, intStuff: j.stats.int - 100 - j.points.int, pv: j.pv, po: j.po };
  console.log(`\n${nom}`);
  for (const [k, v] of Object.entries(st.attendu)) {
    const ok = obtenu[k] === v;
    if (!ok) erreurs++;
    console.log(`${ok ? 'OK ' : 'ÉCHEC'}  ${k.padEnd(9)} ${String(obtenu[k]).padStart(5)}  (attendu ${v})`);
  }
  const ok = j.pa === 12 && j.pm === 6 && JSON.stringify([...j.panoplies].sort()) === JSON.stringify([...st.panoplies].sort());
  if (!ok) erreurs++;
  console.log(`${ok ? 'OK ' : 'ÉCHEC'}  12 PA / 6 PM et panoplies : ${j.pa} PA, ${j.pm} PM, ${j.panoplies.join(', ')}`);
  if (st.ecartMax !== undefined) {
    const ecart = +/(\d+) %/.exec(j.ecartElements)[1], okE = ecart <= st.ecartMax && j.contraintesRespectees;
    if (!okE) erreurs++;
    console.log(`${okE ? 'OK ' : 'ÉCHEC'}  équilibre Terre/Feu : ${j.ecartElements}`);
  }
}
// Résistances du monstre branchées dans l'optimiseur : l'Offensif évalué contre un monstre à 20 % et 10 fixes en
// Terre et en Feu doit retrouver les combos de outils/test_reference.mjs, avec la même répartition des points
// (l'équilibre Terre/Feu se mesure sans résistance). Puis, sans contrainte d'équilibre, un monstre très résistant
// au Feu doit pousser les points vers la Force.
{
  const evaluer = (...opts) => {
    const out = execFileSync(process.execPath, [join(HERE, 'optimiseur_stuff.mjs'), '--voie', 'terre-feu', '--mode', 'tous', '--objets', STUFFS.Offensif.objets.join(';'),
      '--pas-de-fichier', ...opts], { encoding: 'utf8' });
    return JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1));
  };
  console.log('\nRésistances du monstre (optimiseur)');
  const j = evaluer('--resist', 'terre:20/10,feu:20/10');
  const attendus = { T1_13: 3383, T1_12: 3078, T2_22: 4730, T2_23: 4964 };
  for (const [k, v] of Object.entries(attendus)) {
    const ok = Math.abs(j.combos[k] - v) <= 1;
    if (!ok) erreurs++;
    console.log(`${ok ? 'OK ' : 'ÉCHEC'}  ${k.padEnd(9)} ${String(j.combos[k]).padStart(5)}  (attendu ${v})`);
  }
  const okP = j.points.fo === 330 && j.points.int === 185;
  if (!okP) erreurs++;
  console.log(`${okP ? 'OK ' : 'ÉCHEC'}  points inchangés avec l'équilibre : ${j.points.fo} Force / ${j.points.int} Intelligence`);
  const libre = evaluer('--ecart', 'aucun'), feu = evaluer('--ecart', 'aucun', '--resist', 'feu:80');
  const okF = feu.points.fo > libre.points.fo;
  if (!okF) erreurs++;
  console.log(`${okF ? 'OK ' : 'ÉCHEC'}  Feu 80 % sans équilibre : Force ${libre.points.fo} → ${feu.points.fo}`);
}

console.log(erreurs ? `\n${erreurs} échec(s)` : '\nLecture des données conforme aux stuffs de référence.');
process.exit(erreurs ? 1 : 0);
