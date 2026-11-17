// Vérifie pas à pas les combos de chaque voie (site/data/voies/<voie>.json) et écrit docs/RESULTATS_VOIES.md.
// Pour chaque combo : rejeu sur les deux stuffs (légalité de chaque sort, PA jamais négatifs, grille stricte),
// mêmes dégâts que ceux enregistrés, mêmes variantes que celles de la voie. Code de sortie 1 au moindre écart.
// Usage :  node outils/fiche_voies.mjs [--verifier-seulement]
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SP } from '../moteur/sorts.mjs';
import { creerSimulateur } from '../moteur/simulateur.mjs';
import { SITUATIONS, departCombo } from '../moteur/situations.mjs';
import { VOIES, combo } from './degats.mjs';
import { degatsLigne } from '../moteur/formule.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const iD = process.argv.indexOf('--dossier');
const DOSSIER = iD > 0 ? process.argv[iD + 1] : join(HERE, '..', 'site', 'data', 'voies');
const ORDRE = Object.keys(VOIES);
const NOM_VOIE = { 'terre-feu': 'Terre-Feu', 'terre-eau': 'Terre-Eau', 'terre-air': 'Terre-Air', 'feu-eau': 'Feu-Eau', 'feu-air': 'Feu-Air',
  'eau-air': 'Eau-Air', terre: 'Terre', feu: 'Feu', eau: 'Eau', air: 'Air', multi: 'Multi (4 éléments)' };
const NOM_EL = { T: 'Terre', F: 'Feu', E: 'Eau', A: 'Air' };
const SLOT = { coiffe: 'Coiffe', amulette: 'Amulette', anneau1: 'Anneau', anneau2: 'Anneau', ceinture: 'Ceinture', bottes: 'Bottes', cape: 'Cape',
  arme: 'Arme', bouclier: 'Bouclier', familier: 'Familier / montilier', dofus1: 'Dofus', dofus2: 'Dofus', dofus3: 'Dofus', dofus4: 'Dofus', dofus5: 'Dofus', dofus6: 'Dofus' };
const CARAC = { fo: 'Force', int: 'Intelligence', cha: 'Chance', agi: 'Agilité' };
// Sorts dont l'effet est vérifié en jeu (docs/MECANIQUES.md, ou utilisés dans un combo Terre-Feu vérifié en jeu).
// Les autres sont modélisés d'après DofusDB : le joueur doit vérifier leur effet en testant le combo.
// Le 14/11/2026, le joueur a validé ou corrigé tous les autres sorts utilisés par les combos.
const EFFET_VERIFIE = new Set(['Engrenage', 'Sables', 'Poussiere', 'Souvenir', 'Refraction', 'Rouage', 'Momification',
  'Desynchronisation', 'EspaceTemps', 'Sablier', 'Horloge', 'Rayon', 'Frappe',
  'Astrolabe', 'Gelure', 'Fletrissement', 'Ralentissement', 'Perturbation', 'Distorsion', 'Dessechement', 'Permutation',
  'Petrification', 'Pendule', 'CompteGoutte', 'Regulateur', 'Aiguille', 'Gousset', 'Clepsydre']);
const aVerifier = (actions) => [...new Set(actions.filter((a) => a.sort && !EFFET_VERIFIE.has(a.sort)).map((a) => SP[a.sort].nom))];
const P = (p) => `(${p[0]},${p[1]})`;
const nf = (x) => Math.round(x).toLocaleString('fr-FR').replace(/ | /g, ' ');

let erreurs = 0;
const ko = (msg) => { erreurs++; console.log(`ÉCHEC  ${msg}`); };

// Rejoue un combo pas à pas et renvoie les lignes du tableau. Vérifie tout au passage.
function rejouer(voie, cle, f, stuffs, variantes) {
  const sit = SITUATIONS[cle];
  const sims = Object.fromEntries(Object.entries(stuffs).map(([k, st]) => [k, creerSimulateur({ stats: st.stats, opt: { tacle: !!sit.tacle } })]));
  const lignes = [];
  let s = departCombo(cle, f.caseMonstre);
  const sim = sims.offensif;
  for (const a of f.actions) {
    const avant = s;
    if (a.marche) {
      s = sim.walks(s).find((w) => w.pos.X[0] === a.marche[0] && w.pos.X[1] === a.marche[1]);
      if (!s) { ko(`${voie} ${cle} : marche impossible vers ${P(a.marche)}`); return null; }
      lignes.push({ sort: `Marche (${avant.pm - s.pm} PM)`, cible: P(a.marche), effet: '', pos: s.pos, pa: [avant.pa, s.pa] });
      continue;
    }
    if (variantes[SP[a.sort].p] && variantes[SP[a.sort].p] !== a.sort) ko(`${voie} ${cle} : ${a.sort} hors du jeu de variantes de la voie`);
    const t = typeof a.cible === 'string' ? s.pos[a.cible] : a.cible;
    s = sim.cast(s, a.sort, t);
    if (!s) { ko(`${voie} ${cle} : lancer impossible ${a.sort} sur ${a.cible}`); return null; }
    if (s.pa < 0) ko(`${voie} ${cle} : PA négatifs après ${a.sort}`);
    const l = s.log.filter((x) => x.type === 'sort').at(-1), ev = s.log.slice(s.log.lastIndexOf(l) + 1).map((e) => e.texte);
    const effet = [l.echanges.length ? `${l.echanges.length} échange${l.echanges.length > 1 ? 's' : ''}` : '', ...ev,
      s.pa - avant.pa + SP[a.sort].pa > 0 ? `+${s.pa - avant.pa + SP[a.sort].pa} PA` : ''].filter(Boolean).join(' ; ');
    lignes.push({ sort: SP[a.sort].nom, cible: typeof a.cible === 'string' ? (a.cible === 'M' ? 'M' : a.cible) : P(a.cible), effet,
      pos: s.pos, pa: [avant.pa, s.pa], tf: [...s.tf].sort().join(', ') || '—' });
  }
  for (const [k, sm] of Object.entries(sims)) {
    const fin = sm.rejouer(departCombo(cle, f.caseMonstre), f.actions);
    if (Math.abs(fin.dmg - f.degats[k]) > 1) ko(`${voie} ${cle} ${k} : ${Math.round(fin.dmg)} au lieu de ${f.degats[k]}`);
    if (Math.abs(fin.dmg - combo(f.lignes, stuffs[k].stats)) > 1e-6) ko(`${voie} ${cle} ${k} : lignes de dégâts incohérentes`);
  }
  // Effets différés (✅ règles du joueur, 14/11/2026), hors du burst : affichés à part, jamais comptés.
  // Gousset sur cible en Téléfrag : à la fin du prochain tour du Xélor, 30-32 Air (36-38 en crit) en cercle de 2
  // autour de la case visée, −10 % par case d'éloignement. Clepsydre sur cible en Téléfrag : PA au tour suivant (×3 au plus).
  const differes = s.log.filter((l) => l.differe).map((l) => l.differe);
  const nbG = differes.filter((d) => d.sort === 'Gousset').length, nbC = differes.filter((d) => d.sort === 'Clepsydre').length;
  const txt = [];
  if (nbG) {
    const parStuff = (st) => degatsLigne('A', [30, 32], [36, 38], SP.Gousset.cb, stuffs[st].stats).moyenne;
    txt.push(`Gousset ×${nbG} : jusqu'à ${nf(nbG * parStuff('offensif'))} dégâts Air (Offensif) / ${nf(nbG * parStuff('equilibre'))} (Équilibré) à la fin du prochain tour du Xélor, si le monstre est au centre de la zone (−10 % par case d'éloignement)`);
  }
  if (nbC) txt.push(`Clepsydre ×${Math.min(3, nbC)} sur cible en Téléfrag : PA en plus au tour suivant (cumulable 3 fois)`);
  return { lignes, paFin: s.pa, differes: txt };
}

function tableStuff(st) {
  const o = st.objets, l = ['| Emplacement | Objet |', '|---|---|'];
  for (const [k, v] of Object.entries(o)) if (v) l.push(`| ${SLOT[k] || k} | ${v} |`);
  const pts = Object.entries(st.points).filter(([, v]) => v).map(([k, v]) => `${v} ${CARAC[k]}`).join(' / ');
  const s = st.stats;
  return [...l, '', `Panoplies : ${st.panoplies.join(', ') || 'aucune'}. Points : **${pts}**. ${st.pa} PA / ${st.pm} PM, **${nf(st.pv)} PV**, PO ${st.po >= 0 ? '+' : ''}${st.po}.${st.resistancesPct ? ` Résistances % : Terre ${st.resistancesPct.terre}, Feu ${st.resistancesPct.feu}, Eau ${st.resistancesPct.eau}, Air ${st.resistancesPct.air}, Neutre ${st.resistancesPct.neutre} (moyenne ${String(st.resistancesPct.moyenne).replace('.', ',')} %, minimum ${st.resistancesPct.min} %).` : ''}`,
    `Stats : Force ${nf(s.fo)}, Intelligence ${nf(s.int)}, Chance ${nf(s.cha)}, Agilité ${nf(s.agi)}, Puissance ${s.pui} ; Do Terre ${s.doT}, Feu ${s.doF}, Eau ${s.doE}, Air ${s.doA} ; ${s.crit} % de crit, ${s.doCrit} Do crit, +${s.sorts} % aux sorts.${st.ecartElements.includes('/') ? ` Équilibre ${st.ecartElements}.` : ''}`].join('\n');
}

const md = ['# Résultats par voie (niveau 199)', '',
  'Généré par `node outils/fiche_voies.mjs` à partir de `site/data/voies/*.json` (calcul : `outils/pilote_voies.mjs`). Ne pas modifier à la main.', '',
  'Tous ces combos sont **simulés** tant que le joueur ne les a pas testés en jeu (Terre-Feu : voir `docs/RESULTATS_REFERENCE.md`, vérifié en jeu).', '',
  'Règles : jets max, parchemins 100, mode « sans Turquoise, Dolmanax, Vulbis, Dofus des Glaces », Ocre imposé, sans Glas (niveau 200). Un seul jeu de variantes par voie. Score d\'un stuff : moyenne des 4 combos T1 et T2 (le corps à corps n\'y compte pas). Équilibre entre éléments : 10 % (bi-éléments), 20 % (multi). Équilibré (repères PvM du 16/11/2026) : 12 PA / 6 PM, au moins 3 500 PV (4 500 est un repère), aucune résistance % négative et au moins 20 % de moyenne sur les cinq éléments (Terre, Feu, Eau, Air, Neutre). Dégâts moyens, crits compris, sur un monstre sans résistance.', '',
  'Notation : X = le Xélor, toujours en (0,0) au départ ; M = le monstre. TF = entités en Téléfrag après le sort.', ''];
const fichiers = existsSync(DOSSIER) ? readdirSync(DOSSIER).filter((f) => f.endsWith('.json')) : [];
const voies = fichiers.map((f) => f.replace(/\.json$/, '')).sort((a, b) => ORDRE.indexOf(a) - ORDRE.indexOf(b));
md.push('## Sommaire', '', "Moyenne des 4 combos T1 / T2 avec chaque stuff, puis dégâts de chaque combo avec le stuff Offensif. Dernière colonne : sorts dont l'effet vient de DofusDB et n'a pas encore été vérifié en jeu.", '',
  '| Voie | Offensif | Équilibré | T1 13 | T1 12 | T2 22 | T2 23 | CàC T1 | CàC T2 | Sorts à vérifier en jeu |', '|---|---|---|---|---|---|---|---|---|---|');
const corps = [];
for (const voie of voies) {
  const r = JSON.parse(readFileSync(join(DOSSIER, `${voie}.json`), 'utf8'));
  const tous = { ...r.combos, ...r.corpsACorps };
  md.push(`| [${NOM_VOIE[voie]}](#${NOM_VOIE[voie].toLowerCase().replace(/[^a-zà-ÿ0-9]+/g, '-').replace(/-+$/, '')}) | ${nf(r.moyenne.offensif)} | ${nf(r.moyenne.equilibre)} | ${['T1_13', 'T1_12', 'T2_22', 'T2_23', 'CAC_T1', 'CAC_T2'].map((k) => nf(tous[k].degats.offensif)).join(' | ')} | ${aVerifier(Object.values(tous).flatMap((f) => f.actions)).join(', ') || 'aucun'} |`);
  corps.push(`## ${NOM_VOIE[voie]}`, '', `Éléments : ${r.elements.map((e) => NOM_EL[e]).join(', ')}. Calculé le ${r.date.split("-").reverse().join("/")}, statut : **${r.statut}**.`, '');
  const v = Object.entries(r.variantes).sort((a, b) => +a[0].slice(1) - +b[0].slice(1)).map(([, s]) => SP[s].nom);
  corps.push(`Variantes utilisées : ${v.join(', ')}.`, '', '### Stuff Offensif', '', tableStuff(r.stuffs.offensif), '', '### Stuff Équilibré', '', tableStuff(r.stuffs.equilibre), '');
  for (const [cle, f] of Object.entries(tous)) {
    const res = rejouer(voie, cle, f, r.stuffs, r.variantes);
    if (!res) continue;
    corps.push(`### ${SITUATIONS[cle].nom}${f.statut === 'vérifié en jeu' ? ' ✅ vérifié en jeu' : ''}`, '', `Départ : X (0,0), M ${P(f.caseMonstre)}${SITUATIONS[cle].type === 'T2' || cle === 'CAC_T2' ? ', X en Téléfrag (set-up)' : ''}${cle.startsWith('CAC') ? ', position précédente de M en (2,0)' : ''}.`, '',
      '| # | Sort | Cible | Effet | X | M | PA | TF |', '|---|---|---|---|---|---|---|---|');
    res.lignes.forEach((l, i) => corps.push(`| ${i + 1} | ${l.sort} | ${l.cible} | ${l.effet} | ${P(l.pos.X)} | ${P(l.pos.M)} | ${l.pa[0]}→${l.pa[1]} | ${l.tf || ''} |`));
    const av = aVerifier(f.actions);
    corps.push('', `Total : **Offensif ≈ ${nf(f.degats.offensif)}**, **Équilibré ≈ ${nf(f.degats.equilibre)}**, ${res.paFin} PA restants. Statut : **${f.statut || r.statut}**.`,
      ...res.differes.flatMap((d) => ['', `⏳ En plus, hors du burst : ${d}.`]),
      ...(f.verifieEnJeu && rejouer(voie, cle, f.verifieEnJeu, r.stuffs, r.variantes)
        ? ['', `✅ Pour comparer, le combo **vérifié en jeu** : ${f.verifieEnJeu.actions.map((a) => (a.marche ? 'marche' : SP[a.sort].nom)).join(', ')} — Offensif ≈ ${nf(f.verifieEnJeu.degats.offensif)}, Équilibré ≈ ${nf(f.verifieEnJeu.degats.equilibre)} avec ces stuffs (départ M ${P(f.verifieEnJeu.caseMonstre)}).`] : []),
      ...(av.length && f.statut !== 'vérifié en jeu' ? ['', `📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : ${av.join(', ')}.`] : []), '');
  }
}
md.push('', ...corps);
console.log(erreurs ? `\n${erreurs} échec(s)` : `\n${voies.length} voie(s) vérifiée(s) pas à pas : tous les combos se rejouent à l'identique.`);
if (!process.argv.includes('--verifier-seulement') && !erreurs) {
  writeFileSync(join(HERE, '..', 'docs', 'RESULTATS_VOIES.md'), md.join('\n') + '\n');
  console.log('Écrit : docs/RESULTATS_VOIES.md');
}
process.exit(erreurs ? 1 : 0);
