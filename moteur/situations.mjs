// Situations de combo (CLAUDE.md) et leurs états de départ, partagées par la recherche et le pilote des voies.
// X est toujours en (0,0). Pour T1 et T2, le monstre part de toutes les cases à 4 cases au plus (CASES_MONSTRE_4).
import { etatInitial, departsT2, departCorpsACorps, CASES_MONSTRE_4 } from './simulateur.mjs';

export const SITUATIONS = {
  T1_13: { type: 'T1', pa: 13, nom: 'T1 burst à 13 PA (Ocre actif)' },
  T1_12: { type: 'T1', pa: 12, nom: 'T1 burst à 12 PA (Ocre inactif)' },
  T2_22: { type: 'T2', pa: 22, nom: 'T2 burst à 22 PA' },
  T2_23: { type: 'T2', pa: 23, nom: 'T2 burst à 23 PA' },
  // Monstre au corps à corps au départ (✅ défini par le joueur le 13/11/2026), avec le tacle. Hors score des stuffs.
  CAC_T1: { type: 'CAC_T1', pa: 12, nom: 'Corps à corps, T1 à 12 PA', tacle: true },
  CAC_T2: { type: 'CAC_T2', pa: 22, nom: 'Corps à corps, T2 à 22 PA', tacle: true },
};
// Combos qui comptent dans le score des stuffs (le corps à corps n'y compte pas, choix du joueur).
export const SITUATIONS_SCORE = ['T1_13', 'T1_12', 'T2_22', 'T2_23'];

const t1 = (pa, mp) => etatInitial({ pos: { X: [0, 0], M: mp }, tf: [], pa, pm: 3, log: [{ type: 'depart', pos: { X: [0, 0], M: mp }, pa }] });

// Tous les départs d'une recherche.
export function departsSituation(cle) {
  const s = SITUATIONS[cle];
  if (s.type === 'T1') return CASES_MONSTRE_4.map((mp) => t1(s.pa, mp));
  if (s.type === 'T2') return departsT2(s.pa, CASES_MONSTRE_4);
  return [departCorpsACorps(s.pa, { t2: s.type === 'CAC_T2' })];
}
// Le départ d'un combo trouvé (case du monstre donnée), pour le rejouer.
export function departCombo(cle, caseMonstre) {
  const s = SITUATIONS[cle];
  if (s.type === 'T1') return t1(s.pa, caseMonstre);
  if (s.type === 'T2') return departsT2(s.pa, [caseMonstre])[0];
  return departCorpsACorps(s.pa, { t2: s.type === 'CAC_T2' });
}
// Actions rejouables à partir du journal d'un état (sorts et marches).
export function actionsDuJournal(log) {
  return log.filter((l) => l.type === 'sort' || l.type === 'marche')
    .map((l) => (l.type === 'marche' ? { marche: [...l.vers] } : { sort: l.sort, cible: typeof l.cible === 'string' ? l.cible : [...l.cible] }));
}
