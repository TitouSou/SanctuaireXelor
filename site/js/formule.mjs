// Copie générée de moteur/formule.mjs par build/construire_site.mjs : ne pas modifier ici.
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

// Dofus Turquoise (24/11/2026, effet donné par le joueur, estimation acceptée) : « lorsque le porteur effectue un coup
// critique, il gagne 1 % de dommages finaux pendant 3 tours (cumulable 10 fois) ». ❓ Hypothèses (docs/MECANIQUES.md) :
// chaque coup qui peut faire un critique (une ligne de sort, ou un coup d'arme entier) donne un cumul s'il est critique ;
// le bonus s'applique aux coups SUIVANTS du combo ; il multiplie les dégâts après les résistances ; 0 cumul au début du
// combo ; les dommages de poussée ne font pas de critique et ne reçoivent pas le bonus.
// coups : dans l'ordre, [{ pc : chance de critique (0 à 1), bonus : false pour la poussée }]. Renvoie le multiplicateur
// moyen de chaque coup : 1 + 1 % × E[min(critiques avant lui, 10)] (exact : son propre critique ne dépend pas des précédents).
// Partagé par outils/degats.mjs (comboOrdonne) et par le site (site/js/voie.js, via la copie site/js/formule.mjs).
export const TURQUOISE = { parCumul: 0.01, cumulsMax: 10 };
export function multiplicateursTurquoise(coups) {
  const N = TURQUOISE.cumulsMax;
  let dist = new Float64Array(N + 1); dist[0] = 1; // loi du nombre de cumuls (plafonné à 10)
  return coups.map(({ pc, bonus = true }) => {
    let e = 0; for (let i = 1; i <= N; i++) e += i * dist[i];
    const m = bonus ? 1 + TURQUOISE.parCumul * e : 1;
    if (pc > 0) {
      const d2 = new Float64Array(N + 1);
      for (let i = 0; i <= N; i++) { d2[i] += dist[i] * (1 - pc); d2[Math.min(N, i + 1)] += dist[i] * pc; }
      dist = d2;
    }
    return m;
  });
}

// Synchro (✅ valeurs données par le joueur le 15/11/2026) : dégâts Air de l'explosion selon son niveau, pour un
// monstre à 0 % de résistance Air. Pas de crit, pas de dégressivité (cercle de rayon 3), indépendants des stats du
// lanceur. Elle gagne au plus un niveau par tour et explose au moins au niveau 1. Ordre : 366 × (2 × niveau − 1).
export const SYNCHRO_DEGATS = [366, 1098, 1830, 2562, 3294, 4026, 4758, 5490, 6222, 6954, 7686, 8418];
export const SYNCHRO_NIVEAU_MAX = SYNCHRO_DEGATS.length;
// Dégâts de l'explosion au niveau `niveau` (1 à 12), après les résistances Air du monstre (fixe, puis %).
export function degatsSynchro(niveau, resist = null) {
  if (!Number.isInteger(niveau) || niveau < 1 || niveau > SYNCHRO_NIVEAU_MAX)
    throw new Error(`Niveau de Synchro impossible : ${niveau} (de 1 à ${SYNCHRO_NIVEAU_MAX}).`);
  const d = SYNCHRO_DEGATS[niveau - 1], r = resist && resist.A;
  return r ? Math.max(0, (d - (r.fixe || 0)) * (1 - (r.pct || 0) / 100)) : d;
}

// Résistances du monstre écrites en texte (options --resist de l'optimiseur et de la recherche) :
//   "feu:20/10,terre:15"  →  Feu 20 % et 10 fixes, Terre 15 % (fixe 0). Les éléments absents sont à 0.
// Éléments : terre, feu, eau, air, neutre (ou T, F, E, A, N). Un % négatif est une faiblesse (le monstre prend plus).
const NOMS_ELEMENTS = { terre: 'T', feu: 'F', eau: 'E', air: 'A', neutre: 'N', t: 'T', f: 'F', e: 'E', a: 'A', n: 'N' };
export function lireResistances(texte) {
  if (!texte) return null;
  const r = {};
  for (const morceau of String(texte).split(',').map((x) => x.trim()).filter(Boolean)) {
    const m = /^([a-zA-Zé]+)\s*:\s*(-?\d+(?:\.\d+)?)\s*(?:\/\s*(-?\d+(?:\.\d+)?))?$/.exec(morceau);
    const el = m && NOMS_ELEMENTS[m[1].toLowerCase()];
    if (!el) throw new Error(`Résistance illisible : « ${morceau} ». Format attendu : feu:20/10,terre:15 (% puis fixe).`);
    r[el] = { pct: +m[2], fixe: m[3] === undefined ? 0 : +m[3] };
  }
  return Object.keys(r).length ? r : null;
}
// Texte lisible d'un jeu de résistances (journal, fichiers de sortie).
export function texteResistances(r) {
  if (!r) return 'aucune';
  const NOM = { T: 'Terre', F: 'Feu', E: 'Eau', A: 'Air', N: 'Neutre' };
  return Object.entries(r).map(([el, v]) => `${NOM[el]} ${v.pct} % / ${v.fixe} fixe`).join(', ');
}

// Stats implicites des constantes du prototype Python (sim/simulateur.py : EL, CRIT, DOC, MUL).
// Elles ne servent qu'à comparer le portage au Python ; les chiffres publiés utilisent les vrais stuffs.
export const STATS_PROTOTYPE = {
  fo: 1074, int: 1001, agi: 790, cha: 350, pui: 0,
  doT: 52, doF: 77, doA: 77, doE: 22, doN: 52,
  crit: 68, doCrit: 122, sorts: 6,
};
