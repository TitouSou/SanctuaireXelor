// Moteur de combat Xélor : portage fidèle de sim/simulateur.py (règles, recherche par faisceau).
// Toute différence de comportement avec le prototype est un bug, sauf option explicite (voir OPT_DEFAUT).
// Vérifié par moteur/tests/test_portage.mjs (comparaison état par état avec le Python).
//
// Différences voulues avec le Python :
//  - les dégâts viennent des stats d'un stuff (paramètre `stats`) et non de constantes ;
//  - les résistances du monstre sont acceptées (paramètre `resist`, ordre fixe puis %) ;
//  - les cibles d'un sort sont parcourues dans un ordre fixe (le Python utilise un set) : en cas
//    d'égalité parfaite entre deux enchaînements, l'un ou l'autre peut sortir, à dégâts égaux.
import { SP, DMG } from './sorts.mjs';
import { degatsLigne } from './formule.mjs';

// Grilles de calcul. Le plateau est supposé ouvert (pas d'obstacle ni de bord).
// - GRILLE_PROTOTYPE : celle du Python. Trop petite : une téléportation hors grille y est ignorée sans bruit,
//   ce qui a déjà produit de faux combos (Pendule renvoyé sur le monstre par sa « position précédente »).
//   Elle ne sert plus qu'à comparer le portage au Python (option grille: 'prototype').
// - GRILLE : celle du moteur, bien plus grande, et stricte : une sortie de grille lève une erreur.
export const GRILLE_PROTOTYPE = { xmin: -13, xmax: 13, ymin: -7, ymax: 7, stricte: false };
export const GRILLE = { xmin: -40, xmax: 40, ymin: -40, ymax: 40, stricte: true };
let G = GRILLE; // grille du simulateur en cours d'appel (voir creerSimulateur)
export const dansGrille = (p, g = G) => p[0] >= g.xmin && p[0] <= g.xmax && p[1] >= g.ymin && p[1] <= g.ymax;
// Cases de la zone de départ des recherches (celles du prototype : les départs du monstre y sont pris).
export const CELLS = [];
for (let x = GRILLE_PROTOTYPE.xmin; x <= GRILLE_PROTOTYPE.xmax; x++) for (let y = GRILLE_PROTOTYPE.ymin; y <= GRILLE_PROTOTYPE.ymax; y++) CELLS.push([x, y]);

export const OPT_DEFAUT = {
  propag: false,       // propagation d'effet en chaîne de Réfraction (non validée)
  momif_pa: false,     // Momification ne rend pas de PA (confirmé par le joueur)
  glas_cap: 6,         // plafond de Téléfrags comptés par Glas (niveau 200, à vérifier)
  pous_caster: true,   // Poussière téléporte le lanceur même si l'ennemi n'est pas en Téléfrag (confirmé)
  ligne_dofusdb: true,  // ✅ validé en jeu : Horloge en ligne, Aiguille et Régulateur en ligne ou diagonale (faux = prototype)
};

// ---------- Géométrie ----------
export const dist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
const sym = (p, c) => [2 * c[0] - p[0], 2 * c[1] - p[1]];
const eq = (a, b) => a[0] === b[0] && a[1] === b[1];
const ck = (p) => p[0] + ',' + p[1];
const sgn = (v) => (v > 0) - (v < 0);

// round() de Python (arrondi au pair) : utilisé par la ligne de vue.
function pyRound(v) {
  const f = Math.floor(v), r = v - f;
  if (r > 0.5) return f + 1;
  if (r < 0.5) return f;
  return f % 2 === 0 ? f : f + 1;
}
// Ligne de vue approchée : segment entre les centres des cases, bloqué par les cases occupées (hors extrémités).
export function los(a, b, occSet) {
  const [x0, y0] = a, [x1, y1] = b, dx = x1 - x0, dy = y1 - y0, n = Math.max(Math.abs(dx), Math.abs(dy));
  if (n <= 1) return true;
  const steps = n * 4;
  for (let i = 1; i < steps; i++) {
    const t = i / steps, x = x0 + dx * t, y = y0 + dy * t;
    for (const cx of new Set([pyRound(x - 1e-6), pyRound(x + 1e-6)])) {
      for (const cy of new Set([pyRound(y - 1e-6), pyRound(y + 1e-6)])) {
        if ((Math.abs(cx - x) < 0.5 - 1e-9 || Math.abs(cy - y) < 0.5 - 1e-9) ||
            (Math.abs(Math.abs(cx - x) - 0.5) < 1e-9 && Math.abs(Math.abs(cy - y) - 0.5) < 1e-9)) {
          if ((cx === x0 && cy === y0) || (cx === x1 && cy === y1)) continue;
          if (occSet.has(cx + ',' + cy)) return false;
        }
      }
    }
  }
  return true;
}

const OFF = [];
for (let r = 0; r <= 6; r++) {
  OFF[r] = [];
  for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) if (Math.abs(a) + Math.abs(b) <= r) OFF[r].push([a, b]);
}
// Zones : C cercle, X croix de rayon 1, G carré 3×3, O anneau (distance exactement r), R cercle sans le centre.
export function zone(c, shape, r) {
  if (shape === 'C') return OFF[r].map(([a, b]) => [c[0] + a, c[1] + b]);
  if (shape === 'X') return [c, ...[[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, b]) => [c[0] + a, c[1] + b])];
  if (shape === 'G') { const z = []; for (const a of [-1, 0, 1]) for (const b of [-1, 0, 1]) z.push([c[0] + a, c[1] + b]); return z; }
  if (shape === 'O') return OFF[r].filter(([a, b]) => Math.abs(a) + Math.abs(b) === r).map(([a, b]) => [c[0] + a, c[1] + b]);
  if (shape === 'R') return OFF[r].filter(([a, b]) => { const d = Math.abs(a) + Math.abs(b); return d >= 1 && d <= r; }).map(([a, b]) => [c[0] + a, c[1] + b]);
  throw new Error(`Zone inconnue : ${shape}`);
}
const inZone = (p, z) => z.some((q) => eq(p, q));

// ---------- État ----------
// pos : { X, M, K? } ; hist : pile des positions précédentes par entité (4 au plus) ; tf : entités en Téléfrag ;
// cnt : lancers par sort ; ct : lancers par (sort, cible) ; bonus : sorts qui ont déjà rendu leurs +2 PA ;
// sab : Téléfrags consommés sur M depuis le Sablier (null = pas d'état) ; k : Téléfrags consommés (Glas) ;
// ready : relance d'Astrolabe / Téléportation ; load : variante choisie par paire ; indep : Cadran indéplaçable.
export function etatInitial({ pos, hist, tf = [], pa, pm, log = [] }) {
  return {
    pos: Object.fromEntries(Object.entries(pos).map(([e, p]) => [e, [...p]])),
    hist: Object.fromEntries(Object.keys(pos).map((e) => [e, (hist?.[e] || []).map((p) => [...p])])),
    tf: new Set(tf), pa, pm, cnt: {}, ct: {}, bonus: new Set(), dmg: 0, sab: null, aig: false, aigdone: false,
    flet: 0, petr: 0, k: 0, ready: {}, load: {}, indep: false, log: [...log], horl: 0,
  };
}
export function clone(s) {
  return {
    pos: { ...s.pos }, hist: Object.fromEntries(Object.entries(s.hist).map(([e, h]) => [e, h.slice()])),
    tf: new Set(s.tf), pa: s.pa, pm: s.pm, cnt: { ...s.cnt }, ct: { ...s.ct }, bonus: new Set(s.bonus), dmg: s.dmg,
    sab: s.sab, aig: s.aig, aigdone: s.aigdone, flet: s.flet, petr: s.petr, k: s.k, ready: { ...s.ready },
    load: { ...s.load }, indep: s.indep, log: s.log.slice(), horl: s.horl,
  };
}
// Case → entité.
export function occ(s) {
  const o = new Map();
  for (const [e, p] of Object.entries(s.pos)) o.set(ck(p), e);
  return o;
}
function move(s, e, to, pop = false) {
  const fr = s.pos[e], h = s.hist[e];
  if (pop && h.length && eq(h[h.length - 1], to)) h.pop();
  else h.push(fr);
  if (h.length > 4) h.shift();
  s.pos[e] = to;
}
// Téléporte e sur dest ; si dest est occupée : échange, Téléfrag sur les deux. byPrev : retour à la position
// précédente (on dépile) ; prevTargets : entités qui reviennent aussi en arrière quand elles sont échangées.
function teleport(s, e, dest, ev, byPrev = false, prevTargets = null) {
  if (eq(dest, s.pos[e])) return false;
  if (!dansGrille(dest)) {
    if (G.stricte) throw new Error(`Grille trop petite : ${e} téléporté en (${dest}). Agrandir GRILLE dans moteur/simulateur.mjs.`);
    return false;
  }
  const f = occ(s).get(ck(dest));
  if (e === 'K' && s.indep) return false;
  if (f === undefined) { move(s, e, dest, byPrev); return true; }
  if (f === 'K' && s.indep) return false;
  const a = s.pos[e];
  move(s, e, dest, byPrev);
  move(s, f, a, !!(prevTargets && prevTargets.has(f)));
  s.tf.add(e); s.tf.add(f); ev.push(['swap', e, f]);
  return true;
}
const prev = (s, e) => (s.hist[e].length ? s.hist[e][s.hist[e].length - 1] : null);

// ---------- Simulateur ----------
// stats : stats du stuff (voir moteur/formule.mjs) ; sorts : liste des sorts autorisés (ordre de SP) ;
// resist : résistances du monstre ; opt : options (OPT_DEFAUT).
// grille : 'prototype' pour retrouver exactement le Python (tests de portage), sinon GRILLE (par défaut).
export function creerSimulateur({ stats, sorts = Object.keys(SP), resist = null, opt = {}, grille = GRILLE } = {}) {
  const OPT = { ...OPT_DEFAUT, ...opt };
  const maGrille = grille === 'prototype' ? GRILLE_PROTOTYPE : grille;
  // Chaque fonction publique active la grille de ce simulateur (le moteur est synchrone).
  const avecGrille = (fn) => (...args) => { const avant = G; G = maGrille; try { return fn(...args); } finally { G = avant; } };
  const autorises = Object.keys(SP).filter((k) => sorts.includes(k));
  const memo = new Map();
  function sd(name, extra = 0) {
    const k = name + '|' + extra;
    let v = memo.get(k);
    if (v === undefined) {
      const [el, n, c] = DMG[name];
      const cb = SP[name] ? SP[name].cb : 5;
      v = degatsLigne(el, n, c, cb, stats, { extra, resist }).moyenne;
      memo.set(k, v);
    }
    return v;
  }
  function glas(k) {
    k = Math.min(k, OPT.glas_cap);
    let tot = 0;
    for (const el of 'TFAE') tot += degatsLigne(el, [3 + 3 * k, 3 + 3 * k], [4 + 3 * k, 4 + 3 * k], 5, stats, { resist }).moyenne;
    return tot;
  }
  const enLigne = (sp, nom) => sp.line || (OPT.ligne_dofusdb && ['Horloge', 'Aiguille', 'Regulateur'].includes(nom));
  const enDiag = (nom) => OPT.ligne_dofusdb && ['Aiguille', 'Regulateur'].includes(nom);

  function gen(s, spell) {
    if (!s.bonus.has(spell)) { s.bonus.add(spell); s.pa += 2; }
    s.ready.Astrolabe = true; s.ready.Teleportation = true;
  }
  function consume(s, e) {
    if (!s.tf.has(e)) return false;
    s.tf.delete(e); s.k += 1; s.ready.Astrolabe = true; s.ready.Teleportation = true;
    if (e === 'M') {
      if (s.sab !== null) {
        s.sab += 1;
        if (s.sab >= 2) { s.dmg += sd('SablierBoom'); s.sab = null; s.log.push({ type: 'evenement', texte: 'Sablier explose' }); }
      }
      if (s.aig && !s.aigdone) { s.dmg += sd('Aiguille'); s.aigdone = true; s.log.push({ type: 'evenement', texte: 'Aiguille' }); }
    }
    return true;
  }
  function symzone(s, spell, cells, center, excludeCaster = true) {
    const ev = [], done = new Set(), o = occ(s);
    const ents = cells.filter((p) => o.has(ck(p))).map((p) => o.get(ck(p)));
    for (const e of ents) {
      if (done.has(e)) continue;
      if (excludeCaster && e === 'X') continue;
      if (spell === 'Poussiere' && !s.tf.has(e)) continue;
      const dest = sym(s.pos[e], center);
      const f = occ(s).get(ck(dest));
      const moved = teleport(s, e, dest, ev);
      done.add(e);
      if (moved && f !== undefined) done.add(f);
    }
    return ev;
  }
  function legalTarget(s, spell, t) {
    const sp = SP[spell], X = s.pos.X, d = dist(X, t);
    if (!(sp.po[0] <= d && d <= sp.po[1])) return false;
    if (enLigne(sp, spell)) {
      const ligne = X[0] === t[0] || X[1] === t[1];
      const diag = enDiag(spell) && Math.abs(X[0] - t[0]) === Math.abs(X[1] - t[1]);
      if (!ligne && !diag) return false;
    }
    const o = occ(s);
    if (sp.taken && !o.has(ck(t))) return false;
    if (sp.los && d > 1) {
      const oc = new Set(o.keys()); oc.delete(ck(X)); oc.delete(ck(t));
      if (!los(X, t, oc)) return false;
    }
    return true;
  }
  // Rebond (Sables du Temps, Dessèchement) : entité la plus proche à 1 ou 2 cases de la position initiale
  // de la cible, choisie avant la téléportation. Égalité de distance : null (cas évité).
  function rebond(n, tgt) {
    const init = n.pos[tgt];
    const cand = Object.entries(n.pos).filter(([e, p]) => e !== tgt && dist(p, init) >= 1 && dist(p, init) <= 2)
      .map(([e, p]) => [dist(p, init), e]).sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
    if (cand.length >= 2 && cand[0][0] === cand[1][0]) return undefined;
    return cand.length ? cand[0][1] : null;
  }

  function cast(s, spell, t) {
    const sp = SP[spell];
    if ((s.load[sp.p] ?? spell) !== spell) return null;
    let cost = sp.pa;
    if (spell === 'Petrification') cost = Math.max(2, 4 - s.petr);
    if (s.pa < cost) return null;
    if ((s.cnt[spell] || 0) >= sp.t) return null;
    if ((spell === 'Astrolabe' || spell === 'Teleportation') && !(s.ready[spell] ?? true)) return null;
    const tgt = occ(s).get(ck(t));
    const key = spell + '|' + tgt;
    if (tgt !== undefined && (s.ct[key] || 0) >= sp.c) return null;
    if (!legalTarget(s, spell, t)) return null;
    const n = clone(s);
    n.load[sp.p] = spell; n.pa -= cost; n.cnt[spell] = (n.cnt[spell] || 0) + 1;
    if (tgt !== undefined) n.ct[key] = (n.ct[key] || 0) + 1;
    const ev = [], X = n.pos.X, d0 = n.dmg, nlog = n.log.length;
    const M = () => n.pos.M;

    switch (spell) {
      case 'Frappe': case 'Perturbation': {
        if (tgt === undefined || tgt === 'X') return null;
        teleport(n, tgt, sym(n.pos[tgt], X), ev);
        if (tgt === 'M') n.dmg += sd(spell);
        break;
      }
      case 'Pendule': {
        if (tgt === undefined || tgt === 'X') return null;
        teleport(n, 'X', sym(X, t), ev);
        let hit = tgt === 'M';
        for (const p of zone(n.pos.X, 'R', 2)) if (occ(n).get(ck(p)) === 'M') hit = true;
        n.dmg += sd('Pendule') * (hit ? 1 : 0);
        const pv = prev(n, 'X');
        if (pv) teleport(n, 'X', pv, ev, true);
        break;
      }
      case 'Rouage': {
        const z = zone(t, 'O', 2); ev.push(...symzone(n, spell, z, t));
        if (inZone(M(), zone(t, 'O', 2))) n.dmg += sd('Rouage');
        break;
      }
      case 'Souvenir': case 'Gelure': {
        if (tgt === undefined) return null;
        const pv = prev(n, tgt);
        if (pv) teleport(n, tgt, pv, ev, true);
        if (tgt === 'M') n.dmg += sd(spell);
        break;
      }
      case 'Permutation': {
        if (tgt === undefined || tgt === 'X') return null;
        teleport(n, 'X', t, ev);
        if (tgt === 'M') n.dmg += sd(spell);
        break;
      }
      case 'Aiguille': {
        if (tgt !== 'M') return null;
        n.aig = true;
        break;
      }
      case 'Fletrissement': {
        if (tgt !== 'M') return null;
        n.dmg += sd(spell, 6 * n.flet);
        if (n.tf.has('M')) n.flet += 1;
        break;
      }
      case 'Refraction': {
        if (tgt === undefined || (tgt === 'X' && !n.tf.has('X'))) return null;
        const was = n.tf.has(tgt);
        if (tgt === 'M' && !was) n.dmg += sd(spell);
        consume(n, tgt);
        if (was) {
          if (dist(M(), t) <= 2) n.dmg += sd(spell);
          if (OPT.propag) {
            for (const p of zone(t, 'C', 2)) { const e = occ(n).get(ck(p)); if (e !== undefined) n.tf.add(e); }
            gen(n, spell);
          }
        }
        break;
      }
      case 'Regulateur': {
        if (tgt !== 'M') return null;
        n.dmg += sd(spell); consume(n, 'M'); n.sab = null; n.aig = false;
        break;
      }
      case 'Poussiere': {
        const z = zone(t, 'C', 2); ev.push(...symzone(n, spell, z, t, !OPT.pous_caster));
        if (inZone(M(), zone(t, 'C', 2))) n.dmg += sd(spell);
        break;
      }
      case 'Sablier': {
        if (tgt !== 'M') return null;
        n.dmg += sd(spell); n.sab = 0;
        break;
      }
      case 'Ralentissement': {
        if (tgt !== 'M') return null;
        n.dmg += sd(spell);
        if (n.tf.has('M')) n.pa += 1;
        break;
      }
      case 'Engrenage': {
        const z = zone(t, 'X', 1); ev.push(...symzone(n, spell, z, t));
        if (inZone(M(), zone(t, 'X', 1))) n.dmg += sd(spell);
        break;
      }
      case 'CompteGoutte': {
        if (tgt === undefined || tgt === 'X') return null;
        const pt = new Set(['X', tgt]);
        let pv = prev(n, 'X');
        if (pv) teleport(n, 'X', pv, ev, true, pt);
        pv = prev(n, tgt);
        if (pv) teleport(n, tgt, pv, ev, true, pt);
        if (tgt === 'M') n.dmg += sd(spell);
        break;
      }
      case 'Sables': {
        if (tgt === undefined || tgt === 'X') return null;
        const e = rebond(n, tgt);
        if (e === undefined) return null;
        let pv = prev(n, tgt);
        if (pv) teleport(n, tgt, pv, ev, true);
        if (tgt === 'M') n.dmg += sd(spell);
        if (e !== null) {
          pv = prev(n, e);
          if (pv) teleport(n, e, pv, ev, true);
          if (e === 'M') n.dmg += sd(spell);
        }
        break;
      }
      case 'Distorsion': {
        const z = zone(t, 'G', 1), o2 = occ(n);
        const presents = z.filter((p) => o2.has(ck(p))).map((p) => o2.get(ck(p)));
        const tg = new Set(presents.filter((e) => e !== 'X'));
        const done = new Set();
        for (const e of presents) {
          if (e === 'X' || done.has(e)) continue;
          const pv = prev(n, e);
          if (pv) {
            const f = occ(n).get(ck(pv));
            teleport(n, e, pv, ev, true, tg); done.add(e);
            if (f !== undefined) done.add(f);
          }
        }
        if (inZone(M(), zone(t, 'G', 1))) n.dmg += sd(spell);
        break;
      }
      case 'Rayon': {
        const dx = sgn(t[0] - X[0]), dy = sgn(t[1] - X[1]);
        const z = [0, 1, 2].map((i) => [t[0] + dx * i, t[1] + dy * i]), o2 = occ(n);
        const inz = z.filter((p) => o2.has(ck(p))).map((p) => o2.get(ck(p)));
        const ntf = inz.filter((e) => n.tf.has(e)).length;
        if (inz.includes('M')) n.dmg += sd('Rayon', 12 * ntf);
        for (const e of inz) consume(n, e);
        break;
      }
      case 'Dessechement': {
        if (tgt === undefined) return null;
        if (tgt === 'M') n.dmg += sd(spell);
        if (consume(n, tgt)) n.pm += 1;
        const e = rebond(n, tgt);
        if (e === undefined) return null;
        if (e !== null) {
          if (e === 'M') n.dmg += sd(spell);
          if (consume(n, e)) n.pm += 1;
        }
        break;
      }
      case 'Paradoxe': {
        n.indep = true; const K = n.pos.K, o2 = occ(n);
        for (const p of zone(K, 'C', 4)) {
          const e = o2.get(ck(p));
          if (e === undefined || e === 'K' || e === 'X') continue;
          teleport(n, e, sym(p, K), ev);
        }
        break;
      }
      case 'Faille': {
        teleport(n, 'X', n.pos.K, ev);
        break;
      }
      case 'Glas': {
        if (n.k < 1) return null;
        if (inZone(M(), zone(t, 'G', 1))) n.dmg += glas(n.k);
        n.k = 0;
        break;
      }
      case 'Petrification': case 'Clepsydre': case 'Horloge': case 'Gousset': {
        if (tgt !== 'M') return null;
        const was = n.tf.has('M');
        const extra = spell === 'Horloge' && was ? 24 : 0;
        n.dmg += sd(spell, extra); consume(n, 'M');
        if (spell === 'Petrification' && was) n.petr = Math.min(2, n.petr + 1);
        break;
      }
      case 'Momification': {
        n.tf.add('X'); n.pm += 2;
        if (OPT.momif_pa) gen(n, spell);
        break;
      }
      case 'Astrolabe': {
        if (tgt === 'X') {
          const pv = prev(n, 'X');
          if (!pv) return null;
          teleport(n, 'X', pv, ev, true);
        } else teleport(n, 'X', t, ev);
        n.ready.Astrolabe = false;
        break;
      }
      case 'Teleportation': {
        if (tgt === undefined || tgt === 'X') return null;
        teleport(n, 'X', sym(X, t), ev); n.ready.Teleportation = false;
        break;
      }
      default:
        throw new Error(`Sort non modélisé : ${spell}`);
    }
    if (ev.some((e) => e[0] === 'swap')) gen(n, spell);
    // Les événements déclenchés par ce sort (explosion du Sablier…) s'affichent après lui (le Python les met avant).
    const evenements = n.log.splice(nlog);
    n.log.push({
      type: 'sort', sort: spell, cible: tgt ?? [...t], pos: { ...n.pos }, pa: n.pa,
      tf: [...n.tf].sort(), gain: n.dmg - d0, echanges: ev.map(([, a, b]) => [a, b]),
    }, ...evenements);
    return n;
  }

  // Déplacements à pied (le tacle est ignoré) vers une case à 3 cases au plus d'une autre entité.
  function walks(s) {
    if (s.pm <= 0) return [];
    const o = occ(s), X = s.pos.X, seen = new Map([[ck(X), [X, 0]]]), q = [X], out = [];
    while (q.length) {
      const p = q.shift(), c = seen.get(ck(p))[1];
      if (c >= s.pm) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nn = [p[0] + dx, p[1] + dy], k = ck(nn);
        if (dansGrille(nn) && !o.has(k) && !seen.has(k)) { seen.set(k, [nn, c + 1]); q.push(nn); }
      }
    }
    for (const [p, c] of seen.values()) {
      if (c === 0) continue;
      const dmin = Math.min(...Object.entries(s.pos).filter(([e]) => e !== 'X').map(([, qq]) => dist(p, qq)));
      if (dmin <= 3) {
        const n = clone(s); move(n, 'X', p); n.pm -= c;
        n.log.push({ type: 'marche', vers: [...p], pm: c, pos: { ...n.pos }, pa: n.pa, tf: [...n.tf].sort() });
        out.push(n);
      }
    }
    return out;
  }

  // Cases candidates pour un sort (dédoublonnées, ordre stable).
  function targets(s, spell) {
    const M = s.pos.M, ents = Object.values(s.pos);
    let out;
    if (spell === 'Engrenage') out = zone(M, 'X', 1);
    else if (spell === 'Poussiere') out = zone(M, 'C', 2);
    else if (spell === 'Distorsion' || spell === 'Glas') out = zone(M, 'G', 1);
    else if (spell === 'Rouage') out = zone(M, 'O', 2);
    else if (spell === 'Paradoxe' || spell === 'Faille' || spell === 'Momification') out = [s.pos.X];
    else if (spell === 'Rayon') {
      const X = s.pos.X, dx = sgn(M[0] - X[0]), dy = sgn(M[1] - X[1]);
      out = [...ents, [M[0] - dx, M[1] - dy], [M[0] - 2 * dx, M[1] - 2 * dy]];
    } else if (spell === 'Astrolabe') {
      const autour = Object.entries(s.pos).filter(([e]) => e !== 'X').flatMap(([, q]) => zone(q, 'C', 1));
      out = [...ents, ...autour.filter((p) => !ents.some((e) => eq(e, p)))];
    } else out = ents;
    const vus = new Set();
    return out.filter((p) => { const k = ck(p); if (vus.has(k)) return false; vus.add(k); return true; });
  }

  function successeurs(s, avecMarche = true) {
    const succ = [];
    for (const sp of autorises) {
      for (const t of targets(s, sp)) {
        if (!dansGrille(t)) continue;
        const r = cast(s, sp, t);
        if (r) succ.push(r);
      }
    }
    if (avecMarche) succ.push(...walks(s));
    return succ;
  }

  // Clé de déduplication (identique au Python : les 2 dernières positions de l'historique suffisent).
  function cle(s) {
    const ents = Object.keys(s.pos).sort();
    const tri = (o) => Object.entries(o).sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([k, v]) => k + ':' + v).join(',');
    return [
      ents.map((e) => e + ck(s.pos[e])).join(';'),
      ents.map((e) => e + s.hist[e].slice(-2).map(ck).join('/')).join(';'),
      [...s.tf].sort().join(''), s.pa, s.pm, tri(s.cnt), tri(s.ct), [...s.bonus].sort().join(','),
      s.sab, s.aig, s.aigdone, s.flet, s.petr, Math.min(s.k, 6), tri(s.ready), tri(s.load), s.indep,
    ].join('#');
  }

  // Recherche par faisceau : à chaque étape, on garde les `beam` meilleurs états selon dégâts + 140 × PA restants.
  function search(init, { beam = 4000, depth = 16, verbose = false } = {}) {
    let frontier = init, best = null;
    for (let dep = 0; dep < depth; dep++) {
      const nxt = new Map();
      for (const s of frontier) {
        for (const n of successeurs(s, dep < depth - 1)) {
          const kk = cle(n), old = nxt.get(kk);
          if (!old || old.dmg < n.dmg) nxt.set(kk, n);
          if (!best || n.dmg > best.dmg) best = n;
        }
      }
      if (!nxt.size) break;
      frontier = [...nxt.values()].sort((a, b) => (b.dmg + 140 * b.pa) - (a.dmg + 140 * a.pa)).slice(0, beam);
      if (verbose) console.log(dep, nxt.size, Math.round(best.dmg));
    }
    return best;
  }

  // Rejoue une suite d'actions : [{ sort, cible }] où cible est 'M', 'X', 'K' ou une case [x, y] ;
  // ou { marche: [x, y], pm }. Lève une erreur si une action est impossible.
  function rejouer(s, actions) {
    for (const a of actions) {
      if (a.marche) {
        const n = walks(s).find((w) => eq(w.pos.X, a.marche));
        if (!n) throw new Error(`Marche impossible vers ${a.marche}`);
        s = n; continue;
      }
      const t = typeof a.cible === 'string' ? s.pos[a.cible] : a.cible;
      const n = cast(s, a.sort, t);
      if (!n) throw new Error(`Lancer impossible : ${a.sort} sur ${a.cible} (PA ${s.pa}, X ${s.pos.X}, M ${s.pos.M})`);
      s = n;
    }
    return s;
  }

  return {
    cast: avecGrille(cast), walks: avecGrille(walks), targets, successeurs: avecGrille(successeurs), cle,
    search: avecGrille(search), rejouer: avecGrille(rejouer), sd, autorises, OPT, grille: maGrille,
  };
}

// États de départ des recherches du prototype.
// T2 sans Cadran (search2) : X en (0,0), en Téléfrag grâce au set-up, M sur une des cases données.
export function departsT2(PA, casesMonstre, pm = 3) {
  return casesMonstre.map((mp) => etatInitial({ pos: { X: [0, 0], M: mp }, tf: ['X'], pa: PA, pm,
    log: [{ type: 'depart', pos: { X: [0, 0], M: mp }, pa: PA }] }));
}
// Avec le Cadran sur le plateau (search, cas écarté) : K en (-2,0).
export function departsCadran(PA, casesMonstre) {
  return casesMonstre.map((mp) => etatInitial({
    pos: { X: [0, 0], K: [-2, 0], M: mp }, hist: { X: [[-2, 0]], K: [[-2, 0], [0, 0]], M: [] },
    tf: ['X', 'K'], pa: PA, pm: 6, log: [{ type: 'depart', pos: { X: [0, 0], K: [-2, 0], M: mp }, pa: PA }],
  }));
}
// Cases de départ du monstre utilisées par sim/lancer_recherche.py : jusqu'à 4 cases, au plus 2 lignes d'écart.
export const CASES_MONSTRE_4 = CELLS.filter((p) => !(p[0] === 0 && p[1] === 0) && dist(p, [0, 0]) <= 4 && Math.abs(p[1]) <= 2);

// Journal lisible (même format que le Python).
export function formaterLog(log) {
  const P = (p) => (p ? `(${p[0]}, ${p[1]})` : 'None');
  return log.map((l) => {
    if (l.type === 'depart') return `Départ : X${P(l.pos.X)} M${P(l.pos.M)}${l.pos.K ? ` K${P(l.pos.K)}` : ''}  PA ${l.pa}`;
    if (l.type === 'evenement') return `  -> ${l.texte}`;
    if (l.type === 'marche') return `Marche -> ${P(l.vers)} (${l.pm} PM) [X${P(l.pos.X)} M${P(l.pos.M)} K${P(l.pos.K)}]`;
    const cible = typeof l.cible === 'string' ? l.cible : P(l.cible);
    return `${l.sort} -> ${cible}  [X${P(l.pos.X)} M${P(l.pos.M)} K${P(l.pos.K)}] PA ${l.pa} TF[${l.tf.join(', ')}] +${Math.round(l.gain)}`;
  }).join('\n');
}
