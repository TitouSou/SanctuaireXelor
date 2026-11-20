// Coup d'arme (règles ✅ validées par le joueur le 18/11/2026, docs/MECANIQUES.md, « Le coup d'arme »).
// Partagé par le moteur de combat, l'optimiseur de stuff (outils/optimiseur_stuff.mjs) et les outils de publication.
//
// Une arme du moteur : { id, nom, pa, po: [min, max], ligne, diag, los, t (utilisations par tour), cc (crit de base, %),
//   cb (bonus de critique, ajouté à la base de chaque ligne), effets: [...], nbLignes, deplace, utilisable, raison }
// effets, dans l'ordre de DofusDB : { type: 'degats', el: 'T'|'F'|'E'|'A'|'N'|'meilleur', n: [min, max], vol }
//                                  { type: 'repousse' | 'attire' | 'avance', n: cases }
import { CARAC, DO } from './formule.mjs';

// effectId DofusDB → ligne de dégâts (élément, vol de vie).
const EFFETS_DEGATS = {
  96: ['E', false], 97: ['T', false], 98: ['A', false], 99: ['F', false], 100: ['N', false],
  91: ['E', true], 92: ['T', true], 93: ['A', true], 94: ['F', true], 95: ['N', true],
  2822: ['meilleur', false], 2828: ['meilleur', true],
};
const EFFETS_DEPLACEMENT = { 5: 'repousse', 6: 'attire', 1042: 'avance' };
// ✅ Sans intérêt pour un burst : retrait de PA (101), de PM (127), vol de PM (77), soins (108 Feu, 3001 Neutre).
const EFFETS_IGNORES = new Set([101, 127, 77, 108, 3001]);
export const TYPES_ARMES = [2, 3, 4, 5, 6, 7, 8, 19, 21, 22, 114, 271];

// Arme du moteur à partir d'un objet de data/current/items.json. Un effet inconnu rend l'arme inutilisable pour le
// coup d'arme (elle reste portable pour ses caractéristiques) : on ne devine pas ce qu'il fait.
export function lireArme(it) {
  if (!it || !('apCost' in it)) return null;
  const effets = [];
  let raison = null;
  for (const e of (it.effects || []).filter((x) => x.category === 2)) {
    // Valeur unique (from 30, to 0) : 30 fixe (✅).
    const n = [e.from, e.to || e.from];
    if (EFFETS_DEGATS[e.effectId]) { const [el, vol] = EFFETS_DEGATS[e.effectId]; effets.push({ type: 'degats', el, n, vol }); }
    else if (EFFETS_DEPLACEMENT[e.effectId]) effets.push({ type: EFFETS_DEPLACEMENT[e.effectId], n: e.from });
    else if (!EFFETS_IGNORES.has(e.effectId)) raison = `effet ${e.effectId} non modélisé`;
  }
  const nbLignes = effets.filter((e) => e.type === 'degats').length;
  if (!nbLignes && !raison) raison = 'aucune ligne de dégâts';
  return {
    id: it.id, nom: it.name?.fr ?? it.name, pa: it.apCost, po: [it.minRange, it.range], ligne: !!it.castInLine,
    diag: !!it.castInDiagonal, los: it.castTestLos !== false, t: it.maxCastPerTurn || 1,
    cc: it.criticalHitProbability || 0, cb: it.criticalHitBonus || 0, effets, nbLignes,
    deplace: effets.some((e) => e.type !== 'degats'), utilisable: !raison, raison,
  };
}

// Le coup est-il possible du lanceur X sur la case t ? (portée non modifiable ✅ ; ligne de vue vérifiée à part)
// Arme « en ligne » : même ligne ou même colonne. « En diagonale » (haches) : la diagonale collée seulement (✅ une
// seule case, à 1 case en ligne ou en diagonale ; la diagonale à 2 cases de la Hachebarde n'est pas confirmée).
export function porteeArme(arme, X, t) {
  const dx = Math.abs(X[0] - t[0]), dy = Math.abs(X[1] - t[1]), d = dx + dy;
  const dansPo = d >= arme.po[0] && d <= arme.po[1];
  if (!arme.ligne && !arme.diag) return dansPo && d > 0;
  if (arme.ligne && (dx === 0 || dy === 0) && dansPo && d > 0) return true;
  if (arme.diag && dx === 1 && dy === 1 && arme.po[0] <= 1) return true;
  return false;
}

// Puissance d'arme moyenne donnée par Maîtrise d'Arme (sort commun 3506, grade 3 : +300, +360 en critique, 5 % de
// crit de base + crit du stuff, plafonné à 100 % ; ✅ compté en moyenne).
export const MAITRISE = { id: 3506, pa: 2, normal: 300, critique: 360, cc: 5 };
export const puissanceMaitrise = (s) => {
  const p = Math.min(100, MAITRISE.cc + (s.crit || 0)) / 100;
  return (1 - p) * MAITRISE.normal + p * MAITRISE.critique;
};

// Dégâts moyens d'une ligne d'arme (✅ formule vérifiée en jeu sur le Katana de Spiritueur) :
//   normal   = (base × (1 + (carac + Puissance + Puissance d'arme)/100) + dommages de l'élément) × multiplicateurs
//   critique = ((base + bonus de crit) × le même + dommages de l'élément + Dommages critiques) × multiplicateurs
//   multiplicateurs = (1 + % dommages d'armes) × (1 + % mêlée au contact, sinon % distance)
// Chance de crit : crit de l'arme + crit du stuff, plafonnée à 100 % ; 0 % sur l'arme = jamais de crit (✅).
// Résistances du monstre : fixe, puis %, sur le coup normal et le critique (règle 8).
function ligneElement(el, n, arme, s, { melee, pArme, resist }) {
  const m = 1 + ((s[CARAC[el]] || 0) + (s.pui || 0) + pArme) / 100;
  const mul = (1 + (s.armes || 0) / 100) * (1 + (melee ? s.melee || 0 : s.dist || 0) / 100);
  const d = s[DO[el]] || 0, b = (n[0] + n[1]) / 2;
  let normal = (b * m + d) * mul, crit = ((b + arme.cb) * m + d + (s.doCrit || 0)) * mul;
  if (resist && resist[el]) {
    const r = resist[el];
    normal = Math.max(0, (normal - (r.fixe || 0)) * (1 - (r.pct || 0) / 100));
    crit = Math.max(0, (crit - (r.fixe || 0)) * (1 - (r.pct || 0) / 100));
  }
  const cc = arme.cc > 0 ? Math.min(100, arme.cc + (s.crit || 0)) / 100 : 0;
  return { el, normal, crit, moyenne: (1 - cc) * normal + cc * crit };
}
// « Meilleur élément » (2822, 2828) : l'élément qui fait le plus de dégâts (✅), résistances du monstre comprises.
export function degatsLigneArme(effet, arme, s, opts) {
  if (effet.el !== 'meilleur') return ligneElement(effet.el, effet.n, arme, s, opts);
  return ['T', 'F', 'E', 'A', 'N'].map((el) => ligneElement(el, effet.n, arme, s, opts)).reduce((a, b) => (b.moyenne > a.moyenne ? b : a));
}
// Dégâts moyens d'un coup d'arme complet (toutes ses lignes), au contact (melee) ou non, avec ou sans Maîtrise d'Arme.
export function degatsCoupArme(arme, s, { melee = false, maitrise = false, resist = null } = {}) {
  const pArme = maitrise ? puissanceMaitrise(s) : 0;
  return arme.effets.filter((e) => e.type === 'degats').reduce((a, e) => a + degatsLigneArme(e, arme, s, { melee, pArme, resist }).moyenne, 0);
}

// Dommages de poussée (❓ formule communautaire, non vérifiée en jeu ; elle ne sert pas dans nos situations, où rien ne
// bloque une poussée) : (niveau / 2 + dommages de poussée − résistance de poussée + 32) × cases restantes / 4.
export const degatsPoussee = (s, restantes, niveau = 199) => Math.max(0, (niveau / 2 + (s.doPou || 0) + 32) * restantes / 4);

// Un combo trouvé avec une arme reste-t-il jouable avec une autre arme ? « coups » : les coups d'arme du combo, tels que
// notés par le moteur ({ pa, X, M, melee, et, deplace }). Il faut : le même coût en PA ou moins (les PA en plus ne gênent
// aucun sort), assez d'utilisations par tour, la même portée sur chaque coup, et la même position finale (Espace-temps se
// déclenche une fois par ligne : même nombre de lignes s'il était actif ; déplacements : la même arme seulement).
export function comboJouableAvec(coups, armeCombo, arme) {
  if (!coups || !coups.length) return true;
  if (!arme || !arme.utilisable) return false;
  if (armeCombo === arme.nom) return true;
  if (arme.deplace || coups.some((c) => c.deplace)) return false;
  if (arme.t < coups.length) return false;
  for (const c of coups) {
    if (arme.pa > c.pa) return false;
    if (!porteeArme(arme, c.X, c.M)) return false;
    if (c.et && arme.nbLignes !== c.nbLignes) return false;
  }
  return true;
}
