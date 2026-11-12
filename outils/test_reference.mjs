// Test de non-régression : à partir des stats de référence (docs/RESULTATS_REFERENCE.md),
// on doit retrouver les dégâts par sort et les totaux des combos Terre-Feu.
// Usage :  node outils/test_reference.mjs
import { ligne, combo, VOIES, ANCIENS_COMBOS } from './degats.mjs';

const STUFFS = {
  // Stuffs retenus le 13/11/2026 (équilibre Terre/Feu ≤ 10 %).
  Offensif: {
    fo: 850, int: 915, agi: 610, cha: 100, pui: 120,
    doT: 51, doF: 76, doA: 64, doE: 0, doN: 26,
    crit: 72, doCrit: 137, sorts: 6,
    attendu: { T1_13: 4224, T1_12: 3843, T2_22: 5938, T2_23: 6230 },
    anciens: { T1: 4140, T2_22: 5896, T2_23: 6202 },
    sorts_attendus: { frappe: 482, sab1: 353, sab2: 527, refr: 429, eng: 476, pous: 637, sables: 695, souv: 297, horl24: 774, rouage: 458, rayon12: 810 },
  },
  Équilibré: {
    fo: 815, int: 945, agi: 610, cha: 100, pui: 120,
    doT: 57, doF: 64, doA: 64, doE: 0, doN: 32,
    crit: 72, doCrit: 137, sorts: 6,
    attendu: { T1_13: 4204, T1_12: 3813, T2_22: 5898, T2_23: 6181 },
    anciens: { T1: 4110, T2_22: 5840, T2_23: 6149 },
    sorts_attendus: { frappe: 478, sab1: 344, sab2: 524, refr: 423, eng: 472, pous: 635, sables: 695, souv: 297, horl24: 761, rouage: 455, rayon12: 814 },
  },
  // Anciens stuffs (remplacés le 13/11/2026).
  'Ancien Offensif': {
    fo: 770, int: 905, agi: 590, cha: 150, pui: 200,
    doT: 52, doF: 77, doA: 77, doE: 22, doN: 52,
    crit: 68, doCrit: 122, sorts: 6,
    attendu: { T1_13: 4229, T1_12: 3828, T2_22: 5883, T2_23: 6175 },
    anciens: { T1: 4128, T2_22: 5805, T2_23: 6162 },
    sorts_attendus: { frappe: 462, sab1: 344, sab2: 529, refr: 426, eng: 457, pous: 642, sables: 704, souv: 300, horl24: 754, rouage: 438, rayon12: 826 },
  },
  'Ancien Équilibré': {
    fo: 770, int: 1055, agi: 380, cha: 330, pui: 240,
    doT: 82, doF: 82, doA: 52, doE: 52, doN: 82,
    crit: 50, doCrit: 75, sorts: 6,
    attendu: { T1_13: 4109, T1_12: 3661, T2_22: 5710, T2_23: 6009 },
    anciens: { T1: 3854, T2_22: 5586, T2_23: 6002 },
    sorts_attendus: { frappe: 443, sab1: 318, sab2: 526, refr: 410, eng: 437, pous: 647, sables: 716, souv: 195, horl24: 742, rouage: 416, rayon12: 859 },
  },
};

let erreurs = 0;
const verif = (nom, obtenu, attendu, tol) => {
  const ok = Math.abs(obtenu - attendu) <= tol;
  if (!ok) erreurs++;
  console.log(`${ok ? 'OK ' : 'ÉCHEC'}  ${nom.padEnd(28)} ${Math.round(obtenu).toString().padStart(5)}  (attendu ${attendu})`);
};
for (const [nom, s] of Object.entries(STUFFS)) {
  console.log(`\n${nom}`);
  for (const [k, v] of Object.entries(s.sorts_attendus)) verif(k, ligne(k, s).moyenne, v, 1);
  for (const [k, v] of Object.entries(s.attendu)) verif(`combo ${k}`, combo(VOIES['terre-feu'].combos[k], s), v, 3);
  for (const [k, v] of Object.entries(s.anciens)) verif(`ancien combo ${k}`, combo(ANCIENS_COMBOS['terre-feu'][k], s), v, 3);
}
console.log(erreurs ? `\n${erreurs} échec(s)` : '\nTous les tests passent.');
process.exit(erreurs ? 1 : 0);
