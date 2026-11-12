// Test de non-régression : à partir des stats de référence (docs/RESULTATS_REFERENCE.md),
// on doit retrouver les dégâts par sort et les totaux des combos Terre-Feu.
// Usage :  node outils/test_reference.mjs
import { ligne, combo, VOIES, ANCIENS_COMBOS } from './degats.mjs';

const STUFFS = {
  Offensif: {
    fo: 770, int: 905, agi: 590, cha: 150, pui: 200,
    doT: 52, doF: 77, doA: 77, doE: 22, doN: 52,
    crit: 68, doCrit: 122, sorts: 6,
    attendu: { T1: 4128, T2_22: 5883, T2_23: 6175 },
    anciens: { T2_22: 5805, T2_23: 6162 },
    sorts_attendus: { frappe: 462, sab1: 344, sab2: 529, refr: 426, eng: 457, pous: 642, sables: 704, souv: 300, horl24: 754, rouage: 438, rayon12: 826 },
  },
  Équilibré: {
    fo: 770, int: 1055, agi: 380, cha: 330, pui: 240,
    doT: 82, doF: 82, doA: 52, doE: 52, doN: 82,
    crit: 50, doCrit: 75, sorts: 6,
    attendu: { T1: 3854, T2_22: 5710, T2_23: 6009 },
    anciens: { T2_22: 5586, T2_23: 6002 },
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
