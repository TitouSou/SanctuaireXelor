// Construit les données du site (site/data/) à partir des voies publiées (site/data/voies/*.json) et du moteur.
// Le navigateur ne simule rien : il lit, pour chaque combo, les étapes rejouées ici (positions, PA, Téléfrags,
// lignes de dégâts) et recalcule seulement les dégâts selon le stuff et les résistances choisis, avec la même
// formule que le moteur (copie de moteur/formule.mjs dans site/js/formule.mjs).
//
// Écrit :
//   site/data/index.json       les voies, leurs moyennes et leurs statuts (page d'accueil) ;
//   site/data/sorts.json       la table des dégâts de base des sorts (lignes « Sort|bonus de base ») ;
//   site/data/pas/<voie>.json  les étapes des combos de chaque stuff (et du combo vérifié en jeu quand il est gardé à
//                              côté), avec l'arme de chaque stuff (coup d'arme, 18/11/2026) ;
//   site/data/objets.json      les objets des stuffs (effets au jet max) et les bonus des panoplies actives ;
//   site/js/formule.mjs        la formule des dégâts, copiée telle quelle ;
//   site/js/armes.mjs          le coup d'arme (moteur/armes.mjs), copié tel quel ;
//   site/mecaniques.html       docs/MECANIQUES.md mis en page.
//
// Usage :  node build/construire_site.mjs              (écrit les fichiers)
//          node build/construire_site.mjs --verifier   (n'écrit rien ; échoue si un fichier n'est pas à jour
//                                                       ou si la formule du site ne redonne pas les dégâts publiés)
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SP, DMG } from '../moteur/sorts.mjs';
import { creerSimulateur, zone } from '../moteur/simulateur.mjs';
import { SITUATIONS, SITUATIONS_SCORE, departCombo } from '../moteur/situations.mjs';
import { degatsLigne, SYNCHRO_DEGATS } from '../moteur/formule.mjs';
import { VOIES, ligneMoteur } from '../outils/degats.mjs';
import { MAITRISE } from '../moteur/armes.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const RACINE = join(HERE, '..'), SITE = join(RACINE, 'site');
const VERIFIER = process.argv.includes('--verifier');
const sorties = new Map(); // chemin → contenu
const ecrire = (chemin, contenu) => sorties.set(chemin, contenu);
let erreurs = 0;
const ko = (msg) => { erreurs++; console.log(`ÉCHEC  ${msg}`); };

export const NOM_VOIE = { 'terre-feu': 'Terre-Feu', 'terre-eau': 'Terre-Eau', 'terre-air': 'Terre-Air', 'feu-eau': 'Feu-Eau', 'feu-air': 'Feu-Air',
  'eau-air': 'Eau-Air', terre: 'Terre', feu: 'Feu', eau: 'Eau', air: 'Air', multi: 'Multi' };
const ORDRE = Object.keys(VOIES);
const famille = (r) => (r.elements.length === 2 ? 'bi' : r.elements.length === 1 ? 'mono' : 'multi');

// ---------- Table des sorts ----------
// Une ligne de dégâts « Sort|bonus » se calcule avec degatsLigne(el, n, c, cb, stats, { extra: bonus, resist }).
const sorts = {};
for (const [k, [el, n, c]] of Object.entries(DMG)) sorts[k] = { nom: SP[k] ? SP[k].nom : k, el, n, c, cb: SP[k] ? SP[k].cb : 5, pa: SP[k] ? SP[k].pa : null };
sorts.SablierBoom.nom = 'Explosion du Sablier';
// Gousset sur cible en Téléfrag (✅ 14/11/2026) : dégâts différés, hors du burst, −10 % par case d'éloignement.
sorts.GoussetDiffere = { nom: 'Gousset (dégâts différés)', el: 'A', n: [30, 32], c: [36, 38], cb: SP.Gousset.cb, pa: null };
const NOMS_AUTRES = Object.fromEntries(Object.entries(SP).filter(([k]) => !DMG[k]).map(([k, v]) => [k, v.nom]));
ecrire(join(SITE, 'data', 'sorts.json'), JSON.stringify({ sorts, autres: NOMS_AUTRES, synchro: SYNCHRO_DEGATS }, null, 1) + '\n');

// ---------- Étapes d'un combo ----------
// Zone d'effet affichée sur le plateau (approximation visuelle des zones du moteur).
function zoneAffichee(sort, t, X, avant) {
  switch (sort) {
    case 'Engrenage': return zone(t, 'X', 1);
    case 'Poussiere': case 'Desynchronisation': return zone(t, 'C', 2);
    case 'Rouage': return zone(t, 'O', 2);
    case 'Distorsion': return zone(t, 'G', 1);
    case 'Pendule': return zone(X, 'R', 2);
    case 'Refraction': case 'Gousset': {
      const occ = Object.entries(avant.pos).find(([, p]) => p[0] === t[0] && p[1] === t[1]);
      return occ && avant.tf.has(occ[0]) ? zone(t, 'C', 2) : [];
    }
    case 'Rayon': {
      const dx = Math.sign(t[0] - X[0]), dy = Math.sign(t[1] - X[1]);
      return [0, 1, 2].map((i) => [t[0] + dx * i, t[1] + dy * i]);
    }
    default: return [];
  }
}
const top = (h) => (h && h.length ? [...h[h.length - 1]] : null);
const instantane = (s) => ({
  pos: Object.fromEntries(Object.entries(s.pos).map(([e, p]) => [e, [...p]])),
  prec: Object.fromEntries(Object.keys(s.pos).map((e) => [e, top(s.hist[e])])),
  tf: [...s.tf].sort(), pa: s.pa, pm: s.pm, sab: s.sab, aig: !!s.aig, et: !!s.et, pieges: (s.pieges || []).map((p) => [...p]),
});
const diffLignes = (a, b) => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v - (a[k] || 0)]).filter(([, v]) => v > 0));

const nomAction = (sort, arme) => (sort === 'Arme' ? `Coup d'arme (${arme.nom})` : sort === 'MaitriseArme' ? "Maîtrise d'Arme" : SP[sort].nom);
const coutAction = (sort, arme) => (sort === 'Arme' ? arme.pa : sort === 'MaitriseArme' ? MAITRISE.pa : SP[sort].pa);
function etapes(cle, f, stats, arme) {
  const sit = SITUATIONS[cle], sim = creerSimulateur({ stats, opt: { tacle: !!sit.tacle }, arme });
  let s = departCombo(cle, f.caseMonstre), lignesAvant = {};
  const depart = instantane(s), liste = [];
  f.actions.forEach((a, i) => {
    const avant = s;
    const lignes = sim.lignesCombo(departCombo(cle, f.caseMonstre), f.actions.slice(0, i + 1));
    if (a.marche) {
      s = sim.walks(s).find((w) => w.pos.X[0] === a.marche[0] && w.pos.X[1] === a.marche[1]);
      if (!s) throw new Error(`${cle} : marche impossible vers ${a.marche}`);
      liste.push({ type: 'marche', nom: `Marche (${avant.pm - s.pm} PM)`, cible: [...a.marche], cout: 0, gainPA: 0,
        mouvements: [{ e: 'X', de: [...avant.pos.X], vers: [...s.pos.X] }], zone: [], evenements: [], lignes: {}, ...instantane(s) });
      return;
    }
    const t = typeof a.cible === 'string' ? avant.pos[a.cible] : a.cible;
    s = sim.cast(avant, a.sort, t);
    if (!s) throw new Error(`${cle} : lancer impossible ${a.sort} sur ${a.cible}`);
    const l = s.log.filter((x) => x.type === 'sort').at(-1), ev = s.log.slice(s.log.lastIndexOf(l) + 1);
    const mouvements = Object.keys(s.pos).filter((e) => avant.pos[e] && (avant.pos[e][0] !== s.pos[e][0] || avant.pos[e][1] !== s.pos[e][1]))
      .map((e) => ({ e, de: [...avant.pos[e]], vers: [...s.pos[e]] }));
    liste.push({
      type: 'sort', sort: a.sort, nom: nomAction(a.sort, arme), cible: [...t], cibleEntite: typeof a.cible === 'string' ? a.cible : null,
      cout: coutAction(a.sort, arme), gainPA: s.pa - avant.pa + coutAction(a.sort, arme), echanges: l.echanges.length, mouvements,
      ...(l.coup ? { coup: { distance: Math.abs(l.coup.X[0] - l.coup.M[0]) + Math.abs(l.coup.X[1] - l.coup.M[1]), contacts: l.coup.contacts, lignes: arme.nbLignes } } : {}),
      zone: zoneAffichee(a.sort, t, avant.pos.X, avant),
      evenements: ev.filter((e) => !e.differe).map((e) => e.texte), differe: ev.filter((e) => e.differe).map((e) => ({ ...e.differe, texte: e.texte })),
      lignes: diffLignes(lignesAvant, lignes), ...instantane(s),
    });
    lignesAvant = lignes;
  });
  return { depart, etapes: liste, dmgFin: s.dmg };
}

// Dégâts recalculés comme le fera le navigateur (site/js/voie.js), à partir des lignes des étapes.
// Coup d'arme et poussée : même code que le site (site/js/armes.mjs est une copie de moteur/armes.mjs).
function totalSite(liste, stats, arme) {
  let tot = 0;
  for (const e of liste) for (const [k, nb] of Object.entries(e.lignes)) {
    const [nom, extra] = k.split('|'), d = sorts[nom];
    tot += nb * (nom === 'Arme' || nom === 'Poussee' ? ligneMoteur(k, stats, null, arme).moyenne : degatsLigne(d.el, d.n, d.c, d.cb, stats, { extra: +extra }).moyenne);
  }
  return tot;
}

// ---------- Voies ----------
const DOSSIER = join(SITE, 'data', 'voies');
const voies = readdirSync(DOSSIER).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
  .sort((a, b) => ORDRE.indexOf(a) - ORDRE.indexOf(b));
const index = [];
for (const voie of voies) {
  const r = JSON.parse(readFileSync(join(DOSSIER, `${voie}.json`), 'utf8'));
  if (r.format !== 2) { ko(`${voie} : format ${r.format || 1} (relancer outils/publier_voies.mjs)`); continue; }
  // Format 2 : chaque stuff a ses combos et son arme.
  const pas = { voie, armes: r.armes, combos: {} };
  for (const st of ['offensif', 'equilibre']) {
    pas.combos[st] = {};
    for (const [cle, f] of Object.entries({ ...r.combos[st], ...r.corpsACorps[st] })) {
      const variantes = [['principal', f], ...(f.verifieEnJeu ? [['verifie', f.verifieEnJeu]] : [])];
      pas.combos[st][cle] = {};
      for (const [quoi, c] of variantes) {
        const e = etapes(cle, c, r.stuffs[st].stats, r.armes[st]);
        const site = totalSite(e.etapes, r.stuffs[st].stats, r.armes[st]);
        if (Math.abs(site - c.degats[st]) > 1) ko(`${voie} ${st} ${cle} ${quoi} : le site calcule ${Math.round(site)} au lieu de ${c.degats[st]}`);
        pas.combos[st][cle][quoi] = { caseMonstre: c.caseMonstre, statut: c.statut, degats: c.degats, arme: c.arme || null, paRestants: e.etapes.at(-1).pa,
          depart: e.depart, etapes: e.etapes };
      }
    }
  }
  ecrire(join(SITE, 'data', 'pas', `${voie}.json`), JSON.stringify(pas) + '\n');
  index.push({ id: voie, nom: NOM_VOIE[voie], famille: famille(r), elements: r.elements, statut: r.statut, date: r.date, moyenne: r.moyenne,
    combos: Object.fromEntries(['offensif', 'equilibre'].map((st) => [st, Object.fromEntries(Object.entries({ ...r.combos[st], ...r.corpsACorps[st] })
      .map(([k, f]) => [k, { degats: f.degats[st], statut: f.statut, aVerifie: !!f.verifieEnJeu, arme: f.arme || null }]))])) });
}
ecrire(join(SITE, 'data', 'index.json'), JSON.stringify({
  situations: SITUATIONS, score: SITUATIONS_SCORE, voies: index,
}, null, 1) + '\n');

// ---------- Objets des stuffs (page Stuffs) ----------
// Pour chaque objet porté dans un stuff publié : niveau, type, panoplie et effets au jet max (même règle que
// outils/optimiseur_stuff.mjs : meilleur jet, c'est-à-dire le plus petit malus, ✅ validé le 17/11/2026). Bonus des panoplies actives.
const charger = (f) => JSON.parse(readFileSync(join(RACINE, 'data', 'current', f), 'utf8')).data;
const ITEMS = new Map(charger('items.json').map((o) => [o.name.fr, o]));
const EFFETS = new Map(charger('effects.json').map((e) => [e.id, e]));
const SETS = new Map(charger('item-sets.json').map((s) => [s.id, s]));
const TYPES = new Map(charger('item-types.json').map((t) => [t.id, t.name.fr]));
function texteEffet(e) {
  const d = EFFETS.get(e.effectId)?.description?.fr;
  if (!d) return null;
  const neg = d.trim().startsWith('-');
  const hi = Math.max(e.from || 0, e.to || 0), mags = [e.from, e.to].filter(Boolean).map(Math.abs);
  const v = neg ? (mags.length ? Math.min(...mags) : 0) : hi;
  const plur = (t, n) => t.replace(/\{\{~ps\}\}/g, n > 1 ? 's' : '').replace(/\{\{~zs\}\}/g, '');
  if (e.category === 2) return plur(d.replace(/#1\{\{~1~2([^}]*)\}\}#2/, `${e.from}$1${e.to}`), e.to); // dégâts d'arme : fourchette
  const txt = plur(d.replace(/#1\{\{~1~2[^}]*\}\}#2/, String(v)).replace(/#1/g, String(v)).replace(/#[23]/g, ''), v).replace(/\s+/g, ' ').trim();
  return /^\d/.test(txt) ? `+${txt}` : txt;
}
const objets = {}, panoplies = {};
for (const voie of voies) {
  const r = JSON.parse(readFileSync(join(DOSSIER, `${voie}.json`), 'utf8'));
  for (const st of Object.values(r.stuffs)) {
    for (const n of Object.values(st.objets)) {
      if (!n || objets[n]) continue;
      const o = ITEMS.get(n);
      if (!o) { ko(`Objet introuvable dans data/current/items.json : ${n}`); continue; }
      const set = o.itemSetId > 0 ? SETS.get(o.itemSetId) : null;
      objets[n] = { id: o.id, niveau: o.level, type: TYPES.get(o.typeId) || '', panoplie: set ? set.name.fr : null,
        effets: o.effects.map(texteEffet).filter(Boolean) };
      if (n === 'Dofus Ocre') objets[n].effets.push("+1 PA en début de tour si le Xélor n'a pas été attaqué depuis son tour précédent");
    }
    for (const p of st.panoplies) {
      const m = /^(.*) (\d+)$/.exec(p), set = [...SETS.values()].find((s) => s.name.fr === m[1]);
      if (!set) { ko(`Panoplie introuvable : ${p}`); continue; }
      panoplies[m[1]] ||= { bonus: {} };
      panoplies[m[1]].bonus[m[2]] = (set.effects[+m[2] - 1] || []).map(texteEffet).filter(Boolean);
    }
  }
}
ecrire(join(SITE, 'data', 'objets.json'), JSON.stringify({ objets, panoplies }, null, 1) + '\n');

// ---------- Formule ----------
const formule = readFileSync(join(RACINE, 'moteur', 'formule.mjs'), 'utf8');
ecrire(join(SITE, 'js', 'formule.mjs'), '// Copie générée de moteur/formule.mjs par build/construire_site.mjs : ne pas modifier ici.\n' + formule);
const armesJs = readFileSync(join(RACINE, 'moteur', 'armes.mjs'), 'utf8');
ecrire(join(SITE, 'js', 'armes.mjs'), '// Copie générée de moteur/armes.mjs par build/construire_site.mjs : ne pas modifier ici.\n' + armesJs);

// ---------- Page « Mécaniques » ----------
const echap = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function enLigne(t) {
  return echap(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, txt, url) => `<a href="${url}">${txt}</a>`)
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
}
const ancre = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function markdown(md) {
  const L = md.split(/\r?\n/), out = [], toc = [];
  let i = 0;
  while (i < L.length) {
    const l = L[i];
    if (!l.trim()) { i++; continue; }
    const h = /^(#{1,4})\s+(.*)$/.exec(l);
    if (h) {
      const n = h[1].length, txt = h[2], id = ancre(txt);
      if (n === 1) { i++; continue; } // le titre de la page est dans le gabarit
      if (n === 2) toc.push({ id, txt });
      out.push(`<h${n} id="${id}">${enLigne(txt)}</h${n}>`); i++; continue;
    }
    if (/^\|/.test(l)) {
      const rows = [];
      while (i < L.length && /^\|/.test(L[i])) rows.push(L[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const [tete, , ...corps] = rows;
      out.push('<div class="table"><table><thead><tr>' + cells(tete).map((c) => `<th>${enLigne(c)}</th>`).join('') + '</tr></thead><tbody>' +
        corps.map((r) => '<tr>' + cells(r).map((c) => `<td>${enLigne(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    if (/^\s*[-*]\s+/.test(l)) {
      const items = [];
      while (i < L.length && /^\s*[-*]\s+/.test(L[i])) {
        let it = L[i++].replace(/^\s*[-*]\s+/, '');
        while (i < L.length && /^\s{2,}\S/.test(L[i]) && !/^\s*[-*]\s+/.test(L[i])) it += ' ' + L[i++].trim();
        items.push(it);
      }
      out.push('<ul>' + items.map((it) => `<li>${enLigne(it)}</li>`).join('') + '</ul>');
      continue;
    }
    const par = [];
    while (i < L.length && L[i].trim() && !/^(#|\||\s*[-*]\s+)/.test(L[i])) par.push(L[i++].trim());
    out.push(`<p>${enLigne(par.join(' '))}</p>`);
  }
  return { html: out.join('\n'), toc };
}
const meca = markdown(readFileSync(join(RACINE, 'docs', 'MECANIQUES.md'), 'utf8'));
const gabarit = readFileSync(join(HERE, 'gabarit_mecaniques.html'), 'utf8');
ecrire(join(SITE, 'mecaniques.html'), gabarit
  .replace('<!--SOMMAIRE-->', meca.toc.map((t) => `<li><a href="#${t.id}">${enLigne(t.txt)}</a></li>`).join('\n'))
  .replace('<!--CONTENU-->', meca.html));

// ---------- Écriture ou vérification ----------
let perimes = 0;
for (const [chemin, contenu] of sorties) {
  const actuel = existsSync(chemin) ? readFileSync(chemin, 'utf8') : null;
  if (actuel === contenu) continue;
  if (VERIFIER) { perimes++; console.log(`PÉRIMÉ  ${chemin.slice(RACINE.length + 1)} (relancer node build/construire_site.mjs)`); }
  else { mkdirSync(dirname(chemin), { recursive: true }); writeFileSync(chemin, contenu); console.log(`Écrit : ${chemin.slice(RACINE.length + 1)}`); }
}
if (erreurs || perimes) { console.log(`\n${erreurs} écart(s) de dégâts, ${perimes} fichier(s) périmé(s).`); process.exit(1); }
console.log(`\nSite à jour : ${voies.length} voies, dégâts recalculés par le site identiques aux dégâts publiés.`);
