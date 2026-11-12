// Formule des dégâts d'une ligne de sort (CLAUDE.md, règle 8). Partagée par le moteur et par outils/degats.mjs.

export const CARAC = { T: 'fo', F: 'int', E: 'cha', A: 'agi', N: 'fo' };
export const DO = { T: 'doT', F: 'doF', E: 'doE', A: 'doA', N: 'doN' };

// el : élément ; n, c : [min, max] normal et critique ; cb : bonus de crit du sort (%).
// s : stats finales { fo, int, cha, agi, pui, doT, doF, doE, doA, doN, crit, doCrit, sorts, dist, melee }
//     (les dommages d'élément incluent déjà les « Dommages » génériques).
// extra : bonus de base ajouté au jet normal et au critique (Horloge +24, Rayon Obscur +12 par Téléfrag…).
// resist (optionnel) : { T: { pct, fixe }, ... }. Ordre validé par le joueur : fixe, puis %.
export function degatsLigne(el, n, c, cb, s, { extra = 0, resist = null } = {}) {
  const m = 1 + (s[CARAC[el]] + (s.pui || 0)) / 100;
  const mul = (1 + (s.sorts || 0) / 100) * (1 + ((s.dist || 0) + (s.melee || 0)) / 200);
  const d = s[DO[el]] || 0;
  let normal = (((n[0] + n[1]) / 2 + extra) * m + d) * mul;
  let crit = (((c[0] + c[1]) / 2 + extra) * m + d + (s.doCrit || 0)) * mul;
  if (resist && resist[el]) {
    const r = resist[el];
    normal = Math.max(0, (normal - (r.fixe || 0)) * (1 - (r.pct || 0) / 100));
    crit = Math.max(0, (crit - (r.fixe || 0)) * (1 - (r.pct || 0) / 100));
  }
  const cc = Math.min(100, (s.crit || 0) + cb) / 100;
  return { normal, crit, moyenne: (1 - cc) * normal + cc * crit, cc };
}

// Stats implicites des constantes du prototype Python (sim/simulateur.py : EL, CRIT, DOC, MUL).
// Elles ne servent qu'à comparer le portage au Python ; les chiffres publiés utilisent les vrais stuffs.
export const STATS_PROTOTYPE = {
  fo: 1074, int: 1001, agi: 790, cha: 350, pui: 0,
  doT: 52, doF: 77, doA: 77, doE: 22, doN: 52,
  crit: 68, doCrit: 122, sorts: 6,
};
