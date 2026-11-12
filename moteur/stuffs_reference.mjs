// Stats des stuffs de référence Terre-Feu (docs/RESULTATS_REFERENCE.md). Tests de non-régression.

// Stuffs retenus le 13/11/2026 (équilibre Terre/Feu ≤ 10 %, optimisés sur le T2 vérifié en jeu).
export const STUFFS_REFERENCE = {
  offensif: {
    fo: 850, int: 915, agi: 610, cha: 100, pui: 120,
    doT: 51, doF: 76, doA: 64, doE: 0, doN: 26,
    crit: 72, doCrit: 137, sorts: 6,
  },
  equilibre: {
    fo: 815, int: 945, agi: 610, cha: 100, pui: 120,
    doT: 57, doF: 64, doA: 64, doE: 0, doN: 32,
    crit: 72, doCrit: 137, sorts: 6,
  },
};

// Anciens stuffs (remplacés le 13/11/2026), gardés pour les tests.
export const ANCIENS_STUFFS = {
  offensif: {
    fo: 770, int: 905, agi: 590, cha: 150, pui: 200,
    doT: 52, doF: 77, doA: 77, doE: 22, doN: 52,
    crit: 68, doCrit: 122, sorts: 6,
  },
  equilibre: {
    fo: 770, int: 1055, agi: 380, cha: 330, pui: 240,
    doT: 82, doF: 82, doA: 52, doE: 52, doN: 82,
    crit: 50, doCrit: 75, sorts: 6,
  },
};
