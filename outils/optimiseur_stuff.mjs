// Optimiseur de stuff (recuit simulé + descente coordonnée) sur les données figées de data/current/.
// Il maximise la moyenne des combos de la voie (outils/degats.mjs), sous les contraintes de CLAUDE.md.
//
// Usage :
//   node outils/optimiseur_stuff.mjs --voie terre-feu --profil offensif
//   node outils/optimiseur_stuff.mjs --voie terre-feu --profil equilibre
//        profil Équilibré (✅ repères PvM du joueur, 16/11/2026) : PV ≥ 3500 (4 500 n'est qu'un repère), aucune
//        résistance % négative sur les cinq éléments, moyenne des cinq ≥ 20 %, pas de condition de portée.
//   node outils/optimiseur_stuff.mjs --voie terre-feu --profil ancien-equilibre  (ancien profil : PV ≥ 3000, PO ≥ 1 ;
//        celui des stuffs de référence de docs/RESULTATS_REFERENCE.md)
//   options : --mode sans|tous   --pv 3500   --pv-max 4500   --po 1   --essais 8   --iter 60000   --graine 1
//             --pm-min 6     PM minimum du stuff (5 : stuffs à 5 PM, 24/11/2026 ; les objets à condition « CM<6 » deviennent
//                            candidats, leur condition est vérifiée sur les PA et PM totaux)   --pm-max 5   PM maximum (aucun par défaut)
//             --res-min 0    résistance % minimale sur chacun des cinq éléments (Terre, Feu, Eau, Air, Neutre)
//             --res-moy 20   résistance % moyenne minimale sur les cinq éléments
//             --data <dossier>   (par défaut data/current)
//             --resist "feu:20/10,terre:15"   résistances du monstre (% puis fixe, par élément ; aucune par défaut)
//             --pas-de-fichier   n'écrit pas le résultat dans outils/resultats/ (tests)
//             --combos <fichier.json>   combos calculés par le moteur ({ nom: { "Sort|bonus": coups } }), à la place
//                                       de ceux de VOIES (obligatoire pour les voies autres que Terre-Feu).
//                                       Format « jeux » (18/11/2026) : { jeux: [{ nom, arme, combos: { situation:
//                                       { lignes, coups } } }] } ; le stuff est noté sur le meilleur jeu jouable avec
//                                       son arme (moteur/armes.mjs, comboJouableAvec ; outils/degats.mjs, meilleurJeu).
//                                       Il faut un jeu sans coup d'arme, sinon un stuff sans arme compatible vaut 0.
//             --depart <fichier.json>   sortie d'un essai précédent : le 1er essai part de ce stuff (jamais moins bien)
//             --descente-seule   avec --depart : pas de recuit ; descente objet par objet (et par paires avec --paires)
//                                depuis ce stuff (24/11/2026 : stuffs publiés dont on retire l'Arcaniste)
//             --sortie <fichier.json>   chemin du résultat (par défaut outils/resultats/stuff-<voie>-<profil>-<mode>.json)
//
// Réécrit pour le kit à partir de l'optimiseur utilisé dans la conversation d'origine (lancé dans la
// console du navigateur). Il doit retrouver les stuffs de docs/RESULTATS_REFERENCE.md : c'est le
// premier test à faire une fois les données récupérées.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreVoie, VOIES, CARAC, combo, meilleurJeu } from './degats.mjs';
import { lireArme } from '../moteur/armes.mjs';
import { degatsLigne, lireResistances, texteResistances } from '../moteur/formule.mjs';
import { parseCond, atomes, evalCond, comparer, empecheLesPAPM } from './conditions.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, t) => (x.startsWith('--') ? [...a, [x.slice(2), t[i + 1]?.startsWith('--') || t[i + 1] === undefined ? true : t[i + 1]]] : a), []));
const PROFILS = {
  offensif: { pv: 0, po: 0 },
  // ✅ Nouveau profil Équilibré (16/11/2026, docs/MECANIQUES.md) : PV ≥ 3 500 ; 4 500 PV est un repère, pas une
  // contrainte (choix du joueur) ; plus de condition de portée ; résistances % toutes ≥ 0 et moyenne ≥ 20 %.
  equilibre: { pv: 3500, po: 0, resMin: 0, resMoy: 20 },
  // Ancien profil Équilibré (13/11/2026) : celui des stuffs de référence Terre-Feu (tests de non-régression).
  'ancien-equilibre': { pv: 3000, po: 1 },
};
const num = (x, d) => (x === undefined || x === true || x === 'aucun' ? d : +x);
const prof = PROFILS[args.profil || 'offensif'] || PROFILS.offensif;
const CFG = {
  voie: args.voie || 'terre-feu',
  mode: args.mode || 'sans',
  pvMin: +(args.pv ?? prof.pv),
  poMin: +(args.po ?? prof.po),
  pvMax: num(args['pv-max'], prof.pvMax ?? Infinity),
  resMin: num(args['res-min'], prof.resMin ?? -Infinity),
  resMoy: num(args['res-moy'], prof.resMoy ?? -Infinity),
  // PM du stuff (✅ 24/11/2026 : 5 PM autorisés ; 12 PA toujours obligatoires). Par défaut 6 PM, comme avant.
  pmMin: num(args['pm-min'], 6),
  pmMax: num(args['pm-max'], Infinity),
  essais: +(args.essais || 8),
  iter: +(args.iter || 60000),
  ils: +(args.ils || 0), // perturbations de la recherche locale itérée après le recuit (0 = sans)
  paires: +(args.paires || 0), // descente par paires d'objets après le recuit : K meilleurs objets par emplacement (0 = sans)
  graine: +(args.graine || 1),
  data: args.data || join(HERE, '..', 'data', 'current'),
  niveau: 199,
  // Dofus 3 : plus d'armes à deux mains, toutes se portent avec un bouclier (✅ validé par le joueur ;
  // twoHanded est à faux partout dans DofusDB). L'option --deux-mains <typeIds> reste si cela change.
  deuxMains: new Set(String(args['deux-mains'] || '').split(',').filter(Boolean).map(Number)),
  // Équilibre entre les éléments d'une voie bi-élément (✅ choix du joueur, 13/11/2026) : sur un même sort,
  // l'élément le plus fort ne tape pas plus de --ecart % au-dessus de l'autre (10 % par défaut ; les stuffs
  // de référence Terre-Feu sont à 16 % et 18 %). --ecart aucun : pas de contrainte.
  ecartMax: args.ecart === 'aucun' ? Infinity : 1 + +(args.ecart ?? VOIES[args.voie || 'terre-feu']?.ecart ?? 10) / 100,
  // Résistances du monstre (CLAUDE.md, règle 8 : fixe, puis %). Elles changent le score des combos, donc le stuff
  // et la répartition des points. L'équilibre entre éléments, lui, se mesure toujours sans résistance.
  resist: lireResistances(args.resist === true ? '' : args.resist),
};
if (!VOIES[CFG.voie]) { console.error(`Voie inconnue : ${CFG.voie}. Voies définies : ${Object.keys(VOIES).join(', ')}`); process.exit(1); }
// Combos notés : --combos (fichier), sinon ceux de VOIES. Format accepté : { nom: lignes } ou { nom: { lignes } }.
// Tout est ramené au format « jeux » : d'anciens combos ({ nom: lignes }) forment un seul jeu, sans coup d'arme.
const unJeu = (c) => ({ nom: 'combos', arme: null, combos: Object.fromEntries(Object.entries(c).map(([k, v]) => [k, { lignes: v.lignes || v, coups: [] }])) });
const lireCombos = (f) => {
  const j = JSON.parse(readFileSync(f, 'utf8'));
  return j.jeux || [unJeu(j.combos || j)];
};
const COMBOS = args.combos ? lireCombos(args.combos) : VOIES[CFG.voie].combos && [unJeu(VOIES[CFG.voie].combos)];
if (!COMBOS) { console.error(`Pas de combos pour la voie ${CFG.voie} : passer --combos <fichier.json>.`); process.exit(1); }

// ---------- Données ----------
const load = (f) => JSON.parse(readFileSync(join(CFG.data, f), 'utf8')).data;
const ITEMS = load('items.json');
const SETS = new Map(load('item-sets.json').map((s) => [s.id, s]));
const EFFECTS = new Map(load('effects.json').map((e) => [e.id, e]));
const nom = (o) => (o?.name?.fr ?? o?.name ?? `#${o?.id}`);

// Caractéristiques DofusDB → clés internes.
const CH = { 1: 'pa', 23: 'pm', 19: 'po', 10: 'fo', 15: 'int', 13: 'cha', 14: 'agi', 11: 'vit', 12: 'sag', 25: 'pui', 18: 'crit', 16: 'do',
  88: 'doT', 89: 'doF', 90: 'doE', 91: 'doA', 92: 'doN', 86: 'doCrit', 123: 'sorts', 120: 'dist', 125: 'melee',
  // Coup d'arme (18/11/2026) : % dommages d'armes (122, ✅ à prendre en compte), dommages de poussée (84).
  122: 'armes', 84: 'doPou',
  // Résistances % (Terre, Feu, Eau, Air, Neutre), pour le profil Équilibré. Elles ne changent pas les dégâts.
  33: 'rT', 34: 'rF', 35: 'rE', 36: 'rA', 37: 'rN' };
const RES = ['rT', 'rF', 'rE', 'rA', 'rN'];
const NOMS_RES = { rT: 'terre', rF: 'feu', rE: 'eau', rA: 'air', rN: 'neutre' };
// turquoise : 1 si le stuff porte le Dofus Turquoise (effet spécial, outils/degats.mjs, comboOrdonne ; 24/11/2026).
const KEYS = [...new Set([...Object.values(CH), 'turquoise'])];

// Valeur d'une ligne d'effet au meilleur jet. Malus : description qui commence par « -#1 ». DofusDB stocke les malus
// en négatif (« -11 à -15 » : from -11, to -15) ; le meilleur jet est le plus PETIT malus (-11) : ✅ validé par le
// joueur le 17/11/2026 (Amulette Rangleur jet parfait : -11 % Critique). Avant cette date, l'outil comptait -15.
function valeur(e) {
  const k = CH[e.characteristic];
  if (!k) return null;
  const desc = EFFECTS.get(e.effectId)?.description;
  const neg = String(desc?.fr ?? desc ?? '').trim().startsWith('-');
  const hi = Math.max(e.from || 0, e.to || 0), mags = [e.from, e.to].filter(Boolean).map(Math.abs);
  return [k, neg ? -(mags.length ? Math.min(...mags) : 0) : hi];
}
function stats(effects) {
  const s = {};
  for (const e of effects || []) { const v = valeur(e); if (v) s[v[0]] = (s[v[0]] || 0) + v[1]; }
  return s;
}

// Emplacements, par typeId DofusDB.
const ARMES = [2, 3, 4, 5, 6, 7, 8, 19, 21, 22, 114, 271];
const SLOT_DE_TYPE = { 16: 'coiffe', 1: 'amulette', 9: 'anneau', 10: 'ceinture', 11: 'bottes', 17: 'cape', 81: 'cape', 82: 'bouclier',
  18: 'familier', 121: 'familier', 23: 'dofus', 151: 'dofus', ...Object.fromEntries(ARMES.map((t) => [t, 'arme'])) };
const SLOTS = ['coiffe', 'amulette', 'anneau1', 'anneau2', 'ceinture', 'bottes', 'cape', 'arme', 'bouclier', 'familier',
  'dofus1', 'dofus2', 'dofus3', 'dofus4', 'dofus5', 'dofus6'];
const familleSlot = (s) => s.replace(/\d$/, '');

// ---------- Conditions d'objet (criterions DofusDB) ----------
// Parseur des conditions : outils/conditions.mjs (partagé avec le pilote, 24/11/2026).
// Conditions de caractéristiques, vérifiées sur les stats totales du personnage (❓ hypothèse : total, pas la base).
const COND_STAT = { CS: 'fo', CI: 'int', CC: 'cha', CA: 'agi', CV: 'vit', CW: 'sag', CP: 'pa', CM: 'pm' };
// Conditions jamais remplies par le joueur : MJ (PX), nom du personnage (PN), carte (Pm), quête (Qa, Qo…),
// alignement (Ps, Pa…), serveur spécial (OS), et conditions non identifiées (PE, BI, Sc) : exclues par prudence.
const COND_EXCLUES = /^(PX|PN|Pm|Q[a-zA-Z]|P[sSaA]|OS|PE|BI|Sc)$/;

const EXCLUS_SANS = /Dolmanax|Vulbis|Dofus des Glaces|Arcaniste/i; // 24/11/2026 : Turquoise autorisé, Arcaniste banni
function exclu(it) {
  const c = it.criterions || '';
  if (it.level > CFG.niveau) return 'niveau';
  if (/\bMJ\b/.test(nom(it))) return 'MJ';
  const at = atomes(parseCond(c));
  const bloquant = at.find((a) => COND_EXCLUES.test(a.cle));
  if (bloquant) return `condition ${bloquant.cle}`;
  if (empecheLesPAPM(c, CFG.pmMin, CFG.pmMax)) return `empêche 12 PA / ${CFG.pmMin} PM`;
  if (CFG.mode === 'sans' && EXCLUS_SANS.test(nom(it))) return 'mode sans';
  return null;
}

const CAND = {};
for (const f of new Set(SLOTS.map(familleSlot))) CAND[f] = [null];
for (const it of ITEMS) {
  const f = SLOT_DE_TYPE[it.typeId];
  if (!f || exclu(it)) continue;
  const cond = parseCond(it.criterions || '');
  CAND[f].push({ id: it.id, nom: nom(it), set: it.itemSetId > 0 ? it.itemSetId : null, s: { ...stats(it.effects), ...(it.id === 739 ? { turquoise: 1 } : {}) },
    deuxMains: !!it.twoHanded || CFG.deuxMains.has(it.typeId), pk: /pk<\d/i.test(it.criterions || ''),
    arme: f === 'arme' ? lireArme(it) : null,
    cond: atomes(cond).some((a) => COND_STAT[a.cle]) ? cond : null });
}
// Le Dofus Ocre est imposé : le T1 à 13 PA et le T2 à 23 PA supposent son PA de début de tour (CLAUDE.md, règle 5).
const OCRE = CAND.dofus.find((c) => c && c.nom === 'Dofus Ocre');
if (!OCRE) { console.error('Dofus Ocre introuvable dans les données.'); process.exit(1); }

// ---------- Points de caractéristiques ----------
const cout = (x) => { let c = 0; for (let i = 0; i < x; i++) c += i < 100 ? 1 : i < 200 ? 2 : i < 300 ? 3 : 4; return c; };
const COUT = Array.from({ length: 700 }, (_, i) => cout(i));
const maxAvec = (budget) => { let i = 0; while (i + 1 < COUT.length && COUT[i + 1] <= budget) i++; return i; };
const ELP = VOIES[CFG.voie].elementsPoints.map((e) => CARAC[e]);
// Répartitions candidates (pas de 5) : toutes les paires « au maximum » pour 2 caractéristiques.
// Plus de 2 caractéristiques (multi) : répartition gloutonne dans evaluer (GLOUTON).
const REPARTS = [];
const GLOUTON = ELP.length > 2;
if (ELP.length === 1) REPARTS.push({ [ELP[0]]: maxAvec(990) });
else if (ELP.length === 2) for (let a = 0; COUT[a] <= 990; a += 5) REPARTS.push({ [ELP[0]]: a, [ELP[1]]: maxAvec(990 - COUT[a]) });

// ---------- Évaluation ----------
function assembler(etat) {
  const t = Object.fromEntries(KEYS.map((k) => [k, 0]));
  const parSet = new Map();
  for (const it of etat) if (it) {
    for (const [k, v] of Object.entries(it.s)) t[k] += v;
    if (it.set) parSet.set(it.set, (parSet.get(it.set) || 0) + 1);
  }
  let setsActifs = 0;
  const detailSets = [];
  for (const [id, n] of parSet) {
    const bonus = SETS.get(id)?.effects?.[n - 1];
    const lignes = Array.isArray(bonus) ? bonus.filter(Boolean) : [];
    if (n >= 2 && lignes.length) {
      setsActifs++;
      detailSets.push(`${nom(SETS.get(id))} ${n}`);
      for (const [k, v] of Object.entries(stats(lignes))) t[k] += v;
    }
  }
  return { t, setsActifs, detailSets };
}

// Écart entre les éléments de la voie : même sort fictif (base 22-25, crit 26-30, 10 % de crit) dans chaque
// élément, rapport entre le plus fort et le plus faible. 1 = parfaitement équilibré. Voie mono : toujours 1.
const ELEMENTS_VOIE = VOIES[CFG.voie].elementsPoints;
function ecartElements(s) {
  if (ELEMENTS_VOIE.length < 2) return 1;
  const v = ELEMENTS_VOIE.map((el) => degatsLigne(el, [22, 25], [26, 30], 10, s).moyenne);
  return Math.max(...v) / Math.min(...v);
}

// Répartition gloutonne (voie multi) : par pas de 5 points, on donne à la caractéristique qui rapporte le plus par
// point de caractéristique dépensé (score moins pénalité d'équilibre). Les dégâts étant linéaires en chaque
// caractéristique, c'est exact sans la contrainte d'équilibre ; avec elle, c'est une bonne approximation.
function repartitionGloutonne(statsDe, penaliteEcart) {
  const r = Object.fromEntries(ELP.map((c) => [c, 0]));
  let budget = 990;
  // Sans résistance, le score est exactement linéaire en chaque caractéristique : on mesure une fois le gain d'un
  // point par caractéristique (bien plus rapide). Avec des résistances (plancher à 0), on recalcule tout.
  // Le jeu de combos retenu (selon l'arme) est choisi une fois, avec une répartition égale des points ;
  // le score exact est recalculé ensuite dans evaluer.
  const milieu = Object.fromEntries(ELP.map((c) => [c, maxAvec(Math.floor(990 / ELP.length))]));
  const ch = meilleurJeu(COMBOS, statsDe(milieu), armeCourante, null).choix;
  const fixes = ch < 0 ? {} : Object.fromEntries(Object.entries(COMBOS[ch].combos).map(([k, c]) => [k, c.lignes]));
  const sv = (st, res) => scoreVoie(CFG.voie, st, res, fixes, armeCourante);
  let score;
  if (!CFG.resist) {
    const s0 = sv(statsDe(r), null);
    const w = Object.fromEntries(ELP.map((c) => [c, sv(statsDe({ ...r, [c]: 100 }), null) - s0]));
    score = (rr) => s0 + ELP.reduce((a, c) => a + w[c] * rr[c] / 100, 0);
  } else score = (rr) => sv(statsDe(rr), CFG.resist);
  const adj = (rr) => score(rr) - penaliteEcart(statsDe(rr))[0];
  let cur = adj(r);
  for (;;) {
    let best = null;
    for (const c of ELP) {
      const dc = COUT[r[c] + 5] - COUT[r[c]];
      if (!(dc <= budget)) continue;
      const v = adj({ ...r, [c]: r[c] + 5 });
      const gain = (v - cur) / dc;
      if (!best || gain > best.gain) best = { c, dc, v, gain };
    }
    if (!best) break;
    r[best.c] += 5; budget -= best.dc; cur = best.v;
  }
  return r;
}

let armeCourante = null; // arme du moteur du stuff évalué (coup d'arme), fixée au début de evaluer
function evaluer(etat) {
  const { t, setsActifs, detailSets } = assembler(etat);
  armeCourante = etat[SLOTS.indexOf('arme')]?.arme || null;
  let penalite = 0;
  // Contraintes de forme : arme à deux mains sans bouclier, objets uniques, trophées à condition.
  const arme = etat[SLOTS.indexOf('arme')], bouc = etat[SLOTS.indexOf('bouclier')];
  if (arme?.deuxMains && bouc) penalite += 1e6;
  const ids = etat.filter(Boolean).map((x) => x.id);
  if (new Set(ids).size !== ids.length) penalite += 1e6;
  if (etat.some((x) => x?.pk) && setsActifs > 1) penalite += 1e6;

  const pa = 7 + t.pa, pm = 3 + t.pm, pv = 1045 + 100 + t.vit, po = t.po;
  penalite += 3000 * Math.max(0, 12 - pa) + 3000 * Math.max(0, CFG.pmMin - pm) + 3000 * Math.max(0, pm - CFG.pmMax);
  penalite += 2 * Math.max(0, CFG.pvMin - pv) + 400 * Math.max(0, CFG.poMin - po) + 2 * Math.max(0, pv - CFG.pvMax);
  // Résistances % (profil Équilibré) : chaque point manquant coûte 300 (élément sous le minimum) ou 300 par point
  // de moyenne manquant, plus 200 dès qu'il en manque un (le recuit garde une pente, le résultat final doit être à 0).
  const res = RES.map((k) => t[k]), resMoy = res.reduce((a, b) => a + b, 0) / RES.length;
  const manqueRes = RES.reduce((a, k) => a + Math.max(0, CFG.resMin - t[k]), 0), manqueMoy = Math.max(0, CFG.resMoy - resMoy);
  if (manqueRes > 0) penalite += 200 + 300 * manqueRes;
  if (manqueMoy > 1e-9) penalite += 200 + 300 * manqueMoy;

  // Conditions de caractéristiques des objets portés : vérifiées pour chaque répartition des points.
  const conds = etat.filter((x) => x?.cond).map((x) => x.cond);
  // Choix de la répartition : meilleur score, moins une pénalité si l'équilibre entre éléments n'est pas tenu.
  let best = -Infinity, adjBest = -Infinity, rep = null, fin = null, penEq = 0, ecart = 1;
  let bestKo = -Infinity, adjKo = -Infinity, repKo = null, finKo = null, penEqKo = 0, ecartKo = 1;
  const statsDe = (r) => ({ fo: t.fo + 100 + (r.fo || 0), int: t.int + 100 + (r.int || 0), cha: t.cha + 100 + (r.cha || 0), agi: t.agi + 100 + (r.agi || 0),
      pui: t.pui, doT: t.doT + t.do, doF: t.doF + t.do, doE: t.doE + t.do, doA: t.doA + t.do, doN: t.doN + t.do,
      crit: t.crit, doCrit: t.doCrit, sorts: t.sorts, dist: t.dist, melee: t.melee, armes: t.armes, doPou: t.doPou, ...(t.turquoise ? { turquoise: 1 } : {}) });
  const penaliteEcart = (s) => { const e = ecartElements(s), exces = Math.max(0, e - CFG.ecartMax); return [exces > 0 ? 500 + 20000 * exces : 0, e]; };
  const reparts = GLOUTON ? [repartitionGloutonne(statsDe, penaliteEcart)] : REPARTS;
  for (const r of reparts) {
    const s = statsDe(r);
    const total = { ...s, vit: 100 + t.vit, sag: 100 + (t.sag || 0), pa, pm };
    const ok = conds.every((c) => evalCond(c, (a) => (COND_STAT[a.cle] ? comparer(total[COND_STAT[a.cle]], a.op, +a.val) : true)));
    const sc = meilleurJeu(COMBOS, s, armeCourante, CFG.resist).score;
    const [pe, e] = penaliteEcart(s), adj = sc - pe;
    if (ok && adj > adjBest) { adjBest = adj; best = sc; rep = r; fin = s; penEq = pe; ecart = e; }
    if (!ok && adj > adjKo) { adjKo = adj; bestKo = sc; repKo = r; finKo = s; penEqKo = pe; ecartKo = e; }
  }
  if (!rep) { penalite += 5000; best = bestKo; rep = repKo; fin = finKo; penEq = penEqKo; ecart = ecartKo; } // aucune répartition ne remplit les conditions
  penalite += penEq;
  const resistancesPct = { ...Object.fromEntries(RES.map((k) => [NOMS_RES[k], t[k]])), min: Math.min(...res), moyenne: Math.round(resMoy * 10) / 10 };
  return { score: best - penalite, brut: best, penalite, rep, fin, pa: Math.min(12, pa), pm: Math.min(6, pm), pv, po, detailSets, ecart, resistancesPct };
}

// ---------- Recherche ----------
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const candidats = (i) => (SLOTS[i] === 'dofus1' ? [OCRE] : CAND[familleSlot(SLOTS[i])]);

function descente(etat) {
  let cur = evaluer(etat).score, amelio = true;
  while (amelio) {
    amelio = false;
    for (let i = 0; i < SLOTS.length; i++) {
      const garde = etat[i];
      let bestIt = garde;
      for (const c of candidats(i)) {
        etat[i] = c;
        const sc = evaluer(etat).score;
        if (sc > cur + 1e-9) { cur = sc; bestIt = c; amelio = true; }
      }
      etat[i] = bestIt;
    }
  }
  return cur;
}

// Objets de chaque panoplie, avec les emplacements qu'ils peuvent occuper (pour les mouvements « panoplie »).
const PANOS = new Map();
for (let i = 0; i < SLOTS.length; i++) for (const c of candidats(i)) {
  if (!c?.set) continue;
  if (!PANOS.has(c.set)) PANOS.set(c.set, new Map());
  const m = PANOS.get(c.set);
  if (!m.has(c)) m.set(c, []);
  m.get(c).push(i);
}
const LISTE_PANOS = [...PANOS.values()].filter((m) => m.size >= 2).map((m) => [...m]);

// Mouvement « panoplie » : place d'un coup 2 objets ou plus d'une même panoplie (un seul objet à la fois
// n'atteint presque jamais les bonus de panoplie, comme le +1 PA du YeCh'Ti 3). Renvoie l'annulation.
function mouvementPanoplie(etat, r) {
  const pano = LISTE_PANOS[Math.floor(r() * LISTE_PANOS.length)];
  const choisis = pano.filter(() => r() < 0.75);
  if (choisis.length < 2) return null;
  const avant = etat.slice(), pris = new Set();
  for (const [it, slots] of choisis) {
    const libres = slots.filter((i) => !pris.has(i));
    if (!libres.length) continue;
    const i = libres[Math.floor(r() * libres.length)];
    etat[i] = it; pris.add(i);
  }
  return avant;
}

function recuit(r, depart = null) {
  const etat = depart ? depart.slice() : SLOTS.map((_, i) => { const c = candidats(i); return c[Math.floor(r() * c.length)]; });
  let cur = evaluer(etat).score, best = cur, bestEtat = etat.slice();
  const T0 = 300, T1 = 0.5;
  for (let k = 0; k < CFG.iter; k++) {
    const T = T0 * Math.pow(T1 / T0, k / CFG.iter);
    let annuler;
    if (r() < 0.15 && LISTE_PANOS.length) {
      const avant = mouvementPanoplie(etat, r);
      if (!avant) continue;
      annuler = () => { for (let i = 0; i < etat.length; i++) etat[i] = avant[i]; };
    } else {
      const i = Math.floor(r() * SLOTS.length), c = candidats(i), garde = etat[i];
      etat[i] = c[Math.floor(r() * c.length)];
      annuler = () => { etat[i] = garde; };
    }
    const sc = evaluer(etat).score;
    if (sc >= cur || r() < Math.exp((sc - cur) / T)) { cur = sc; if (sc > best) { best = sc; bestEtat = etat.slice(); } }
    else annuler();
  }
  descente(bestEtat);
  if (CFG.paires) descentePaires(bestEtat, CFG.paires);
  return CFG.ils ? rechercheLocaleIteree(bestEtat, r, CFG.ils) : bestEtat;
}

// Descente par paires (--paires K, ajoutée le 13/11/2026) : change deux objets à la fois. Pour chaque emplacement,
// on garde les K objets les plus forts dans le stuff courant, comptés SANS la pénalité de PA / PM (un objet qui fait
// perdre un PM peut redevenir bon si l'autre objet le rend), puis on essaie toutes les paires. Exemple : passer de
// Ceinture Bine + Cape Peupret (frigostien, +1 PM) à Ceinture Hanium + Fût d'Aspiratueur (Spiritueurs, +1 PM).
function descentePaires(etat, K) {
  let cur = descente(etat);
  for (let tour = 0; tour < 20; tour++) {
    const tops = SLOTS.map((_, i) => {
      const garde = etat[i];
      const notes = candidats(i).filter((c) => c !== garde).map((c) => { etat[i] = c; const ev = evaluer(etat); return [c, ev.brut - (ev.penalite >= 1e6 ? 1e9 : 0)]; });
      etat[i] = garde;
      return notes.sort((a, b) => b[1] - a[1]).slice(0, K).map(([c]) => c);
    });
    let amelio = false;
    for (let i = 0; i < SLOTS.length; i++) for (let j = i + 1; j < SLOTS.length; j++) {
      const gi = etat[i], gj = etat[j];
      let bi = gi, bj = gj;
      for (const a of tops[i]) for (const b of tops[j]) {
        etat[i] = a; etat[j] = b;
        const sc = evaluer(etat).score;
        if (sc > cur + 1e-9) { cur = sc; bi = a; bj = b; amelio = true; }
      }
      etat[i] = bi; etat[j] = bj;
    }
    if (!amelio) break;
    cur = descente(etat);
  }
  return cur;
}

// Recherche locale itérée (--ils n, ajoutée le 13/11/2026) : à partir du meilleur stuff, on le perturbe (1 à 3
// changements : un objet au hasard ou une panoplie entière), on le redescend objet par objet, et on garde le résultat
// s'il est meilleur. Corrige l'instabilité du recuit seul, qui ratait des stuffs voisins (la descente ne change
// qu'un objet à la fois, et les bonus de panoplie demandent d'en changer plusieurs ensemble).
function rechercheLocaleIteree(etat, r, n) {
  let best = etat.slice(), bestSc = evaluer(best).score;
  for (let k = 0; k < n; k++) {
    const e = best.slice();
    const nb = 1 + Math.floor(r() * 3);
    for (let j = 0; j < nb; j++) {
      if (r() < 0.4 && LISTE_PANOS.length) mouvementPanoplie(e, r);
      else { const i = Math.floor(r() * SLOTS.length), c = candidats(i); e[i] = c[Math.floor(r() * c.length)]; }
    }
    const sc = descente(e);
    if (sc > bestSc + 1e-9) { best = e; bestSc = sc; }
  }
  return best;
}

const borne = (x) => (Number.isFinite(x) ? x : 'aucun');
console.log(`Voie ${CFG.voie} · mode « ${CFG.mode} » · 12 PA, PM ${Number.isFinite(CFG.pmMax) ? (CFG.pmMax === CFG.pmMin ? `= ${CFG.pmMin}` : `${CFG.pmMin} à ${CFG.pmMax}`) : `≥ ${CFG.pmMin}`} · PV ≥ ${CFG.pvMin}${Number.isFinite(CFG.pvMax) ? ` et ≤ ${CFG.pvMax}` : ''} · PO ≥ ${CFG.poMin} · résistances % ≥ ${borne(CFG.resMin)}, moyenne ≥ ${borne(CFG.resMoy)} · écart entre éléments ≤ ${CFG.ecartMax === Infinity ? 'aucun' : Math.round((CFG.ecartMax - 1) * 100) + ' %'} · résistances : ${texteResistances(CFG.resist)}`);
console.log(`Candidats : ${Object.entries(CAND).map(([k, v]) => `${k} ${v.length - 1}`).join(', ')}`);
let meilleur = null;
// --depart : stuff d'un résultat précédent (champ « objets » : emplacement → nom). Un objet devenu introuvable est retiré.
let DEPART = null;
if (args.depart) {
  const o = JSON.parse(readFileSync(args.depart, 'utf8')).objets;
  DEPART = SLOTS.map((sl, i) => (o?.[sl] ? candidats(i).find((c) => c && c.nom === o[sl]) || null : null));
  if (!DEPART[SLOTS.indexOf('dofus1')]) DEPART[SLOTS.indexOf('dofus1')] = OCRE;
  console.log(`Départ : ${args.depart} (score ${evaluer(DEPART).brut.toFixed(1)})`);
}
if (args.objets) {
  // Mode évaluation : --objets "Coiffe de Padgref;Collier du YeCh'Ti;…" (aucune recherche). Chaque objet va
  // dans le premier emplacement libre de son type. Sert à vérifier la lecture des données sur un stuff connu.
  const etat = SLOTS.map(() => null);
  for (const n of String(args.objets).split(';').map((x) => x.trim()).filter(Boolean)) {
    const it = Object.values(CAND).flat().find((c) => c && c.nom === n);
    if (!it) { console.error(`Objet introuvable ou exclu : ${n}`); process.exit(1); }
    const i = SLOTS.findIndex((s, k) => !etat[k] && CAND[familleSlot(s)].includes(it));
    if (i < 0) { console.error(`Plus d'emplacement libre pour : ${n}`); process.exit(1); }
    etat[i] = it;
  }
  meilleur = { etat, ev: evaluer(etat) };
} else {
  const r = rng(CFG.graine);
  for (let e = 0; e < CFG.essais; e++) {
    let etat;
    if (args['descente-seule']) {
      if (!DEPART) { console.error('--descente-seule demande --depart'); process.exit(1); }
      etat = DEPART.slice();
      descente(etat);
      if (CFG.paires) descentePaires(etat, CFG.paires);
    } else etat = recuit(r, e === 0 ? DEPART : null);
    const ev = evaluer(etat);
    console.log(`  essai ${e + 1}/${CFG.essais} : ${ev.brut.toFixed(1)}${ev.penalite ? ` (pénalité ${ev.penalite.toFixed(0)})` : ''}`);
    if (!meilleur || ev.score > meilleur.ev.score) meilleur = { etat, ev };
  }
}

const { etat, ev } = meilleur;
const armeFinale = etat[SLOTS.indexOf('arme')]?.arme || null;
const mc = meilleurJeu(COMBOS, ev.fin, armeFinale, CFG.resist);
const combos = Object.fromEntries(Object.entries(mc.degats).map(([k, v]) => [k, Math.round(v)]));
// Jeu de combos retenu : son indice et son nom, et l'arme qui frappe dans ses combos.
const combosRetenus = { indice: mc.choix, nom: COMBOS[mc.choix]?.nom ?? null, arme: COMBOS[mc.choix]?.arme ?? null };
const sortie = {
  voie: CFG.voie, mode: CFG.mode, contraintes: { pvMin: CFG.pvMin, poMin: CFG.poMin, ...(CFG.pmMin !== 6 || Number.isFinite(CFG.pmMax) ? { pmMin: CFG.pmMin, ...(Number.isFinite(CFG.pmMax) ? { pmMax: CFG.pmMax } : {}) } : {}), ...(Number.isFinite(CFG.pvMax) ? { pvMax: CFG.pvMax } : {}),
    ...(Number.isFinite(CFG.resMin) ? { resMin: CFG.resMin } : {}), ...(Number.isFinite(CFG.resMoy) ? { resMoy: CFG.resMoy } : {}) }, resistances: CFG.resist,
  objets: Object.fromEntries(SLOTS.map((s, i) => [s, etat[i]?.nom ?? null])),
  panoplies: ev.detailSets, points: ev.rep, pa: ev.pa, pm: ev.pm, pv: ev.pv, po: ev.po, resistancesPct: ev.resistancesPct,
  ecartElements: `${ELEMENTS_VOIE.join('/')} : ${Math.round((ev.ecart - 1) * 100)} % d'écart (maximum ${CFG.ecartMax === Infinity ? 'aucun' : Math.round((CFG.ecartMax - 1) * 100) + ' %'})`,
  stats: Object.fromEntries(Object.entries(ev.fin).map(([k, v]) => [k, Math.round(v)])),
  combos, combosRetenus, score: Math.round(ev.brut), contraintesRespectees: ev.penalite === 0,
};
console.log('\n' + JSON.stringify(sortie, null, 2));
if (!args['pas-de-fichier']) {
  const dossier = join(HERE, 'resultats');
  mkdirSync(dossier, { recursive: true });
  // Avec des résistances, suffixe « -resist » : on n'écrase pas les stuffs de référence (sans résistance).
  const fichier = args.sortie || join(dossier, `stuff-${CFG.voie}-${args.objets ? 'evaluation' : args.profil || 'offensif'}-${CFG.mode}${CFG.resist ? '-resist' : ''}.json`);
  writeFileSync(fichier, JSON.stringify(sortie, null, 2));
  console.log(`\nÉcrit : ${fichier}`);
}
if (ev.penalite) console.log('ATTENTION : contraintes non respectées (PA, PM, PV, PO, résistances ou règles d\'objets). Augmente --iter ou --essais.');
