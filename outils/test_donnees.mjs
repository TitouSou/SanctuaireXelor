// Test de lecture des données figées (data/current/) : les stuffs de référence (docs/RESULTATS_REFERENCE.md),
// évalués par l'optimiseur sans recherche, doivent retrouver leurs stats, PV, PO, PA, PM et panoplies.
// À relancer après chaque mise à jour DofusDB appliquée.
// Usage :  node outils/test_donnees.mjs
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const COMMUNS = ["Collier du YeCh'Ti", "Mitaine du YeCh'Ti", 'Ceinture Bine', 'Cape Peupret', 'Katana de Spiritueur',
  "Bras du YeCh'Ti", 'Sakochère', 'Dofus Ocre', 'Dofus Pourpre', 'Puissant majeur', 'Arcaniste'];
const STUFFS = {
  Offensif: {
    objets: [...COMMUNS, 'Coiffe de Padgref', 'Anneau de Padgref', 'Geta de Padgref', 'Forcené majeur', 'Furibond majeur'],
    panoplies: ['Panoplie de Padgref 3', "Panoplie du YeCh'Ti 3", 'Panoplie du frigostien approximatif 2'],
    // fo et int : part du stuff seule (sans parchemins ni points), soit 770 − 100 − 210 et 905 − 100 − 315.
    attendu: { foStuff: 460, intStuff: 490, agi: 590, cha: 150, pui: 200, doT: 52, doF: 77, doA: 77, doE: 22, crit: 68, doCrit: 122, sorts: 6, pv: 2625, po: 3 },
  },
  Équilibré: {
    objets: [...COMMUNS, 'Casque de Missiz Frizz', 'Alliance de Missiz Frizz', 'Bottes de Missiz Frizz', 'Savant majeur', 'Astucieux majeur'],
    panoplies: ['Panoplie de Missiz Frizz 3', "Panoplie du YeCh'Ti 3", 'Panoplie du frigostien approximatif 2'],
    attendu: { foStuff: 460, intStuff: 640, agi: 380, cha: 330, pui: 240, doT: 82, doF: 82, doA: 52, doE: 52, crit: 50, doCrit: 75, sorts: 6, pv: 3425, po: 2 },
  },
};

let erreurs = 0;
for (const [nom, st] of Object.entries(STUFFS)) {
  const out = execFileSync(process.execPath, [join(HERE, 'optimiseur_stuff.mjs'), '--voie', 'terre-feu', '--objets', st.objets.join(';')], { encoding: 'utf8' });
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
}
console.log(erreurs ? `\n${erreurs} échec(s)` : '\nLecture des données conforme aux stuffs de référence.');
process.exit(erreurs ? 1 : 0);
