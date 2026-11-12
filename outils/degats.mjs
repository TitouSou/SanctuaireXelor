// Calcul des dégâts moyens (crits compris) : formule de CLAUDE.md, règle 8.
// Utilisé par l'optimiseur de stuff et par les tests de référence.

// Bases des sorts au niveau 199 (grade le plus haut avec minPlayerLevel ≤ 199), relevées sur DofusDB.
// [élément, [normal min, max], [critique min, max], bonus de crit du sort en %]
// Les variantes « +24 » et « +12 » incluent déjà le bonus de base (Horloge sur cible en Téléfrag,
// Rayon Obscur avec une entité en Téléfrag).
export const SORTS = {
  sab1:    ['F', [10, 12], [13, 15], 5],   // Sablier, coup immédiat
  sab2:    ['F', [23, 25], [28, 30], 5],   // Sablier, explosion
  frappe:  ['T', [22, 25], [26, 30], 10],  // Frappe de Xélor
  refr:    ['F', [16, 18], [19, 22], 5],   // Réfraction
  pert:    ['F', [23, 26], [28, 31], 10],  // Perturbation
  eng:     ['T', [22, 24], [26, 29], 10],  // Engrenage
  pous:    ['F', [29, 32], [35, 38], 15],  // Poussière
  sables:  ['F', [33, 36], [40, 43], 15],  // Sables du Temps
  souv:    ['A', [10, 12], [13, 15], 5],   // Souvenir
  horl24:  ['T', [47, 49], [52, 54], 15],  // Horloge, cible en Téléfrag (+24)
  rouage:  ['T', [20, 22], [24, 26], 15],  // Rouage
  rayon12: ['F', [43, 46], [49, 53], 15],  // Rayon Obscur, 1 Téléfrag (+12)
};

// Combos par voie : nombre de lancers de chaque ligne de dégâts.
// Terre-Feu : voir docs/RESULTATS_REFERENCE.md. Les autres voies sont à ajouter (ROADMAP, étape 3).
export const VOIES = {
  'terre-feu': {
    combos: {
      T1:     { sab1: 1, eng: 1, sables: 1, pous: 1, refr: 2, souv: 2, sab2: 1 },
      // T2 retenu le 12/11/2026 (départ à 4 cases, Rouage puis marche de 2 PM).
      T2_22:  { pous: 1, sab1: 1, rayon12: 1, sables: 1, horl24: 1, sab2: 1, rouage: 1, eng: 1, souv: 1, refr: 1, frappe: 1 },
      T2_23:  { pous: 1, sab1: 1, rayon12: 1, sables: 1, horl24: 2, sab2: 1, rouage: 1, eng: 1, souv: 1, refr: 1 },
    },
    elementsPoints: ['T', 'F'], // caractéristiques où vont les 990 points
  },
};

// Anciens combos (remplacés), gardés pour les tests de non-régression. Ils ne comptent pas dans le score des stuffs.
export const ANCIENS_COMBOS = {
  'terre-feu': {
    T2_22: { eng: 2, sab1: 1, horl24: 2, sables: 1, sab2: 1, pous: 1, souv: 1, rouage: 1, refr: 1 },
    T2_23: { eng: 1, sab1: 1, horl24: 2, sables: 1, sab2: 1, pous: 1, souv: 1, rayon12: 1, refr: 2 },
  },
};

// La formule est partagée avec le moteur de combat : moteur/formule.mjs.
import { degatsLigne, CARAC, DO } from '../moteur/formule.mjs';
export { CARAC, DO };

// s : stats finales { fo, int, cha, agi, pui, doT, doF, doE, doA, doN, crit, doCrit, sorts, dist, melee }
// Les dommages d'élément doivent déjà inclure les « Dommages » génériques.
// resist (optionnel) : { T: {pct, fixe}, ... }  — ordre validé par le joueur : fixe, puis %.
export function ligne(cle, s, resist = null) {
  const [el, n, c, cb] = SORTS[cle];
  return degatsLigne(el, n, c, cb, s, { resist });
}

export function combo(comboDef, s, resist = null) {
  let total = 0;
  for (const [cle, nb] of Object.entries(comboDef)) total += nb * ligne(cle, s, resist).moyenne;
  return total;
}

// Score d'un stuff pour une voie : moyenne des combos de la voie.
export function scoreVoie(voie, s, resist = null) {
  const cs = Object.values(VOIES[voie].combos);
  return cs.reduce((a, c) => a + combo(c, s, resist), 0) / cs.length;
}
