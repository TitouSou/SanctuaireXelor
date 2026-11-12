// Optimiseur de stuff (recuit simulé + descente coordonnée) sur les données figées de data/current/.
// Il maximise la moyenne des combos de la voie (outils/degats.mjs), sous les contraintes de CLAUDE.md.
//
// Usage :
//   node outils/optimiseur_stuff.mjs --voie terre-feu --profil offensif
//   node outils/optimiseur_stuff.mjs --voie terre-feu --profil equilibre        (PV ≥ 3000, PO ≥ 1)
//   options : --mode sans|tous   --pv 3000   --po 1   --essais 8   --iter 60000   --graine 1
//             --data <dossier>   (par défaut data/current)
//             --resist "feu:20/10,terre:15"   résistances du monstre (% puis fixe, par élément ; aucune par défaut)
//             --pas-de-fichier   n'écrit pas le résultat dans outils/resultats/ (tests)
//
// Réécrit pour le kit à partir de l'optimiseur utilisé dans la conversation d'origine (lancé dans la
// console du navigateur). Il doit retrouver les stuffs de docs/RESULTATS_REFERENCE.md : c'est le
// premier test à faire une fois les données récupérées.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreVoie, VOIES, CARAC, combo } from './degats.mjs';
import { degatsLigne, lireResistances, texteResistances } from '../moteur/formule.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, t) => (x.startsWith('--') ? [...a, [x.slice(2), t[i + 1]?.startsWith('--') || t[i + 1] === undefined ? true : t[i + 1]]] : a), []));
const PROFILS = { offensif: { pv: 0, po: 0 }, equilibre: { pv: 3000, po: 1 } };
const prof = PROFILS[args.profil || 'offensif'] || PROFILS.offensif;
const CFG = {
  voie: args.voie || 'terre-feu',
  mode: args.mode || 'sans',
  pvMin: +(args.pv ?? prof.pv),
  poMin: +(args.po ?? prof.po),
  essais: +(args.essais || 8),
  iter: +(args.iter || 60000),
  graine: +(args.graine || 1),
  data: args.data || join(HERE, '..', 'data', 'current'),
  niveau: 199,
  // Dofus 3 : plus d'armes à deux mains, toutes se portent avec un bouclier (✅ validé par le joueur ;
  // twoHanded est à faux partout dans DofusDB). L'option --deux-mains <typeIds> reste si cela change.
  deuxMains: new Set(String(args['deux-mains'] || '').split(',').filter(Boolean).map(Number)),
  // Équilibre entre les éléments d'une voie bi-élément (✅ choix du joueur, 13/11/2026) : sur un même sort,
  // l'élément le plus fort ne tape pas plus de --ecart % au-dessus de l'autre (10 % par défaut ; les stuffs
  // de référence Terre-Feu sont à 16 % et 18 %). --ecart aucun : pas de contrainte.
  ecartMax: args.ecart === 'aucun' ? Infinity : 1 + +(args.ecart ?? 10) / 100,
  // Résistances du monstre (CLAUDE.md, règle 8 : fixe, puis %). Elles changent le score des combos, donc le stuff
  // et la répartition des points. L'équilibre entre éléments, lui, se mesure toujours sans résistance.
  resist: lireResistances(args.resist === true ? '' : args.resist),
};
if (!VOIES[CFG.voie]) { console.error(`Voie inconnue : ${CFG.voie}. Voies définies : ${Object.keys(VOIES).join(', ')}`); process.exit(1); }

// ---------- Données ----------
const load = (f) => JSON.parse(readFileSync(join(CFG.data, f), 'utf8')).data;
const ITEMS = load('items.json');
const SETS = new Map(load('item-sets.json').map((s) => [s.id, s]));
const EFFECTS = new Map(load('effects.json').map((e) => [e.id, e]));
const nom = (o) => (o?.name?.fr ?? o?.name ?? `#${o?.id}`);

// Caractéristiques DofusDB → clés internes.
const CH = { 1: 'pa', 23: 'pm', 19: 'po', 10: 'fo', 15: 'int', 13: 'cha', 14: 'agi', 11: 'vit', 12: 'sag', 25: 'pui', 18: 'crit', 16: 'do',
  88: 'doT', 89: 'doF', 90: 'doE', 91: 'doA', 92: 'doN', 86: 'doCrit', 123: 'sorts', 120: 'dist', 125: 'melee' };
const KEYS = [...new Set(Object.values(CH))];

// Valeur d'une ligne d'effet au meilleur jet. Malus : description qui commence par « -#1 ».
function valeur(e) {
  const k = CH[e.characteristic];
  if (!k) return null;
  const desc = EFFECTS.get(e.effectId)?.description;
  const neg = String(desc?.fr ?? desc ?? '').trim().startsWith('-');
  const hi = Math.max(e.from || 0, e.to || 0), lo = e.to ? Math.min(e.from, e.to) : e.from;
  return [k, neg ? -Math.abs(lo) : hi];
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
// Grammaire : expr := terme ('|' terme)* ; terme := facteur ('&' facteur)* ; facteur := '(' expr ')' | atome.
// Atome : deux lettres, un opérateur (< > = ! ~), une valeur. Exemple : CS>299&(CI>299|CC>299).
function parseCond(str) {
  let i = 0;
  const expr = () => { const t = [terme()]; while (str[i] === '|') { i++; t.push(terme()); } return t.length > 1 ? { ou: t } : t[0]; };
  const terme = () => { const f = [facteur()]; while (str[i] === '&') { i++; f.push(facteur()); } return f.length > 1 ? { et: f } : f[0]; };
  const facteur = () => {
    if (str[i] === '(') { i++; const e = expr(); i++; return e; }
    const m = /^([A-Za-z]{2})([<>=!~])([^&|()]*)/.exec(str.slice(i));
    if (!m) throw new Error(`Condition illisible : ${str}`);
    i += m[0].length;
    return { cle: m[1], op: m[2], val: m[3] };
  };
  return str ? expr() : null;
}
const atomes = (a) => (!a ? [] : a.ou ? a.ou.flatMap(atomes) : a.et ? a.et.flatMap(atomes) : [a]);
function evalCond(a, atome) {
  if (!a) return true;
  if (a.ou) return a.ou.some((x) => evalCond(x, atome));
  if (a.et) return a.et.every((x) => evalCond(x, atome));
  return atome(a);
}
const comparer = (v, op, x) => (op === '<' ? v < x : op === '>' ? v > x : op === '=' ? v === x : op === '!' ? v !== x : true);
// Conditions de caractéristiques, vérifiées sur les stats totales du personnage (❓ hypothèse : total, pas la base).
const COND_STAT = { CS: 'fo', CI: 'int', CC: 'cha', CA: 'agi', CV: 'vit', CW: 'sag', CP: 'pa', CM: 'pm' };
// Conditions jamais remplies par le joueur : MJ (PX), nom du personnage (PN), carte (Pm), quête (Qa, Qo…),
// alignement (Ps, Pa…), serveur spécial (OS), et conditions non identifiées (PE, BI, Sc) : exclues par prudence.
const COND_EXCLUES = /^(PX|PN|Pm|Q[a-zA-Z]|P[sSaA]|OS|PE|BI|Sc)$/;

const EXCLUS_SANS = /Turquoise|Dolmanax|Vulbis|Dofus des Glaces/i;
function exclu(it) {
  const c = it.criterions || '';
  if (it.level > CFG.niveau) return 'niveau';
  if (/\bMJ\b/.test(nom(it))) return 'MJ';
  const at = atomes(parseCond(c));
  const bloquant = at.find((a) => COND_EXCLUES.test(a.cle));
  if (bloquant) return `condition ${bloquant.cle}`;
  if (/C[PM]</.test(c)) return 'empêche 12 PA / 6 PM';
  if (CFG.mode === 'sans' && EXCLUS_SANS.test(nom(it))) return 'mode sans';
  return null;
}

const CAND = {};
for (const f of new Set(SLOTS.map(familleSlot))) CAND[f] = [null];
for (const it of ITEMS) {
  const f = SLOT_DE_TYPE[it.typeId];
  if (!f || exclu(it)) continue;
  const cond = parseCond(it.criterions || '');
  CAND[f].push({ id: it.id, nom: nom(it), set: it.itemSetId > 0 ? it.itemSetId : null, s: stats(it.effects),
    deuxMains: !!it.twoHanded || CFG.deuxMains.has(it.typeId), pk: /pk<\d/i.test(it.criterions || ''),
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
const REPARTS = [];
if (ELP.length === 1) REPARTS.push({ [ELP[0]]: maxAvec(990) });
else if (ELP.length === 2) for (let a = 0; COUT[a] <= 990; a += 5) REPARTS.push({ [ELP[0]]: a, [ELP[1]]: maxAvec(990 - COUT[a]) });
else throw new Error('Plus de 2 caractéristiques : ajouter une répartition gloutonne (voir ROADMAP).');

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

function evaluer(etat) {
  const { t, setsActifs, detailSets } = assembler(etat);
  let penalite = 0;
  // Contraintes de forme : arme à deux mains sans bouclier, objets uniques, trophées à condition.
  const arme = etat[SLOTS.indexOf('arme')], bouc = etat[SLOTS.indexOf('bouclier')];
  if (arme?.deuxMains && bouc) penalite += 1e6;
  const ids = etat.filter(Boolean).map((x) => x.id);
  if (new Set(ids).size !== ids.length) penalite += 1e6;
  if (etat.some((x) => x?.pk) && setsActifs > 1) penalite += 1e6;

  const pa = 7 + t.pa, pm = 3 + t.pm, pv = 1045 + 100 + t.vit, po = t.po;
  penalite += 3000 * Math.max(0, 12 - pa) + 3000 * Math.max(0, 6 - pm);
  penalite += 2 * Math.max(0, CFG.pvMin - pv) + 400 * Math.max(0, CFG.poMin - po);

  // Conditions de caractéristiques des objets portés : vérifiées pour chaque répartition des points.
  const conds = etat.filter((x) => x?.cond).map((x) => x.cond);
  // Choix de la répartition : meilleur score, moins une pénalité si l'équilibre entre éléments n'est pas tenu.
  let best = -Infinity, adjBest = -Infinity, rep = null, fin = null, penEq = 0, ecart = 1;
  let bestKo = -Infinity, adjKo = -Infinity, repKo = null, finKo = null, penEqKo = 0, ecartKo = 1;
  for (const r of REPARTS) {
    const s = { fo: t.fo + 100 + (r.fo || 0), int: t.int + 100 + (r.int || 0), cha: t.cha + 100 + (r.cha || 0), agi: t.agi + 100 + (r.agi || 0),
      pui: t.pui, doT: t.doT + t.do, doF: t.doF + t.do, doE: t.doE + t.do, doA: t.doA + t.do, doN: t.doN + t.do,
      crit: t.crit, doCrit: t.doCrit, sorts: t.sorts, dist: t.dist, melee: t.melee };
    const total = { ...s, vit: 100 + t.vit, sag: 100 + (t.sag || 0), pa, pm };
    const ok = conds.every((c) => evalCond(c, (a) => (COND_STAT[a.cle] ? comparer(total[COND_STAT[a.cle]], a.op, +a.val) : true)));
    const sc = scoreVoie(CFG.voie, s, CFG.resist);
    const e = ecartElements(s), exces = Math.max(0, e - CFG.ecartMax);
    const pe = exces > 0 ? 500 + 20000 * exces : 0, adj = sc - pe;
    if (ok && adj > adjBest) { adjBest = adj; best = sc; rep = r; fin = s; penEq = pe; ecart = e; }
    if (!ok && adj > adjKo) { adjKo = adj; bestKo = sc; repKo = r; finKo = s; penEqKo = pe; ecartKo = e; }
  }
  if (!rep) { penalite += 5000; best = bestKo; rep = repKo; fin = finKo; penEq = penEqKo; ecart = ecartKo; } // aucune répartition ne remplit les conditions
  penalite += penEq;
  return { score: best - penalite, brut: best, penalite, rep, fin, pa: Math.min(12, pa), pm: Math.min(6, pm), pv, po, detailSets, ecart };
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

function recuit(r) {
  const etat = SLOTS.map((_, i) => { const c = candidats(i); return c[Math.floor(r() * c.length)]; });
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
  return bestEtat;
}

console.log(`Voie ${CFG.voie} · mode « ${CFG.mode} » · PV ≥ ${CFG.pvMin} · PO ≥ ${CFG.poMin} · écart entre éléments ≤ ${CFG.ecartMax === Infinity ? 'aucun' : Math.round((CFG.ecartMax - 1) * 100) + ' %'} · résistances : ${texteResistances(CFG.resist)}`);
console.log(`Candidats : ${Object.entries(CAND).map(([k, v]) => `${k} ${v.length - 1}`).join(', ')}`);
let meilleur = null;
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
    const etat = recuit(r), ev = evaluer(etat);
    console.log(`  essai ${e + 1}/${CFG.essais} : ${ev.brut.toFixed(1)}${ev.penalite ? ` (pénalité ${ev.penalite.toFixed(0)})` : ''}`);
    if (!meilleur || ev.score > meilleur.ev.score) meilleur = { etat, ev };
  }
}

const { etat, ev } = meilleur;
const combos = Object.fromEntries(Object.entries(VOIES[CFG.voie].combos).map(([k, c]) => [k, Math.round(combo(c, ev.fin, CFG.resist))]));
const sortie = {
  voie: CFG.voie, mode: CFG.mode, contraintes: { pvMin: CFG.pvMin, poMin: CFG.poMin }, resistances: CFG.resist,
  objets: Object.fromEntries(SLOTS.map((s, i) => [s, etat[i]?.nom ?? null])),
  panoplies: ev.detailSets, points: ev.rep, pa: ev.pa, pm: ev.pm, pv: ev.pv, po: ev.po,
  ecartElements: `${ELEMENTS_VOIE.join('/')} : ${Math.round((ev.ecart - 1) * 100)} % d'écart (maximum ${CFG.ecartMax === Infinity ? 'aucun' : Math.round((CFG.ecartMax - 1) * 100) + ' %'})`,
  stats: Object.fromEntries(Object.entries(ev.fin).map(([k, v]) => [k, Math.round(v)])),
  combos, score: Math.round(ev.brut), contraintesRespectees: ev.penalite === 0,
};
console.log('\n' + JSON.stringify(sortie, null, 2));
if (!args['pas-de-fichier']) {
  const dossier = join(HERE, 'resultats');
  mkdirSync(dossier, { recursive: true });
  // Avec des résistances, suffixe « -resist » : on n'écrase pas les stuffs de référence (sans résistance).
  const fichier = join(dossier, `stuff-${CFG.voie}-${args.objets ? 'evaluation' : args.profil || 'offensif'}-${CFG.mode}${CFG.resist ? '-resist' : ''}.json`);
  writeFileSync(fichier, JSON.stringify(sortie, null, 2));
  console.log(`\nÉcrit : ${fichier}`);
}
if (ev.penalite) console.log('ATTENTION : contraintes non respectées (PA, PM, PV, PO ou règles d\'objets). Augmente --iter ou --essais.');
