// Résumé lisible d'un jeu de données DofusDB, pour que le joueur le relise avant de le figer.
// Usage :  node data/resume.mjs [incoming|current]      (par défaut : incoming)
// Écrit data/resume-donnees.md. N'applique rien.
//
// Contenu : objets par emplacement, présence des objets des stuffs de référence, et comparaison
// des sorts (grade le plus haut accessible au niveau 199) avec la table du moteur (moteur/sorts.mjs).
import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SP, DMG } from '../moteur/sorts.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const dossier = process.argv[2] || 'incoming';
const DIR = join(HERE, dossier);
const NIVEAU = 199;
const load = (f) => JSON.parse(readFileSync(join(DIR, f), 'utf8'));
const fr = (o) => o?.name?.fr ?? o?.name ?? `#${o?.id}`;

const out = [`# Résumé des données DofusDB (${dossier})`, ''];
const meta = load('items.json');
out.push(`Récupérées le ${new Date(meta.fetchedAt).toLocaleString('fr-FR')} depuis ${meta.source}.`, '');

// ---------- Fichiers ----------
out.push('## Fichiers', '', '| Fichier | Entrées | Taille |', '|---|---:|---:|');
for (const f of readdirSync(DIR).filter((x) => x.endsWith('.json')).sort()) {
  const n = load(f).count;
  out.push(`| ${f} | ${n} | ${(statSync(join(DIR, f)).size / 1e6).toFixed(1)} Mo |`);
}
out.push('');

// ---------- Objets par type ----------
const items = meta.data;
const types = new Map(load('item-types.json').data.map((t) => [t.id, fr(t)]));
const parType = new Map();
for (const it of items) parType.set(it.typeId, (parType.get(it.typeId) || 0) + 1);
out.push('## Objets par type', '', '| typeId | Type | Objets |', '|---:|---|---:|');
for (const [t, n] of [...parType].sort((a, b) => a[0] - b[0])) out.push(`| ${t} | ${types.get(t) ?? '?'} | ${n} |`);
out.push('');

// ---------- Objets des stuffs de référence ----------
const REF = ['Coiffe de Padgref', 'Collier du YeCh\'Ti', 'Mitaine du YeCh\'Ti', 'Anneau de Padgref', 'Ceinture Bine',
  'Geta de Padgref', 'Cape Peupret', 'Katana de Spiritueur', 'Bras du YeCh\'Ti', 'Sakochère', 'Dofus Ocre', 'Dofus Pourpre',
  'Casque de Missiz Frizz', 'Alliance de Missiz Frizz', 'Bottes de Missiz Frizz'];
const TROPHEES = ['Forcené', 'Furibond', 'Puissant', 'Arcaniste', 'Savant', 'Astucieux'];
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, "'").toLowerCase();
out.push('## Objets des stuffs de référence (docs/RESULTATS_REFERENCE.md)', '');
for (const nom of REF) {
  const f = items.filter((i) => norm(fr(i)) === norm(nom));
  out.push(`- ${f.length ? '✅' : '❌'} ${nom}${f.length ? ` (id ${f.map((i) => i.id).join(', ')}, niv. ${f[0].level}, ${types.get(f[0].typeId)})` : ' : introuvable'}`);
}
for (const t of TROPHEES) {
  const f = items.filter((i) => norm(fr(i)).includes(norm(t)) && i.typeId === 151);
  out.push(`- ${f.length ? '✅' : '❌'} Trophées « ${t} » : ${f.map((i) => fr(i)).join(', ') || 'aucun'}`);
}
out.push('');

// ---------- Sorts ----------
const spells = new Map(load('spells.json').data.map((s) => [s.id, s]));
const levels = new Map(load('spell-levels.json').data.map((l) => [l.id, l]));
const EL_DMG = { 97: 'T', 99: 'F', 96: 'E', 98: 'A', 100: 'N', 92: 'T', 94: 'F', 91: 'E', 93: 'A', 95: 'N' };
const VOL = new Set([91, 92, 93, 94, 95]);
const grade199 = (s) => s.spellLevels.map((id) => levels.get(id)).filter((l) => l && l.minPlayerLevel <= NIVEAU)
  .sort((a, b) => b.grade - a.grade)[0];
const lignes = (effs) => effs.filter((e) => EL_DMG[e.effectId])
  .map((e) => `${EL_DMG[e.effectId]}${VOL.has(e.effectId) ? '(vol)' : ''} ${e.diceNum}-${Math.max(e.diceNum, e.diceSide)}`);

let ecarts = 0;
out.push(`## Sorts du moteur comparés à DofusDB (grade le plus haut avec minPlayerLevel ≤ ${NIVEAU})`, '',
  '| Sort | Grade | PA | PO | Crit | /tour | /cible | Ligne | LdV | Dégâts DofusDB (normal ; crit) | Moteur | Écarts |',
  '|---|---:|---:|---|---:|---:|---:|:-:|:-:|---|---|---|');
for (const [cle, sp] of Object.entries(SP)) {
  const s = spells.get(sp.id);
  if (!s) { out.push(`| ${sp.nom} | ❌ absent | | | | | | | | | | |`); ecarts++; continue; }
  const l = grade199(s);
  if (!l) { out.push(`| ${sp.nom} | indisponible à ${NIVEAU} | | | | | | | | | | |`); continue; }
  // Un temps de relance (minCastInterval ≥ 1) revient à un lancer par tour. Astrolabe et Téléportation :
  // le moteur modélise la relance réinitialisée par les Téléfrags (limite de sécurité à 9).
  const relance = l.minCastInterval >= 1;
  const tour = relance ? (sp.t === 9 ? 9 : 1) : (l.maxCastPerTurn || 99), cible = l.maxCastPerTarget || 99;
  const diff = [];
  if (l.apCost !== sp.pa) diff.push(`PA ${sp.pa}≠${l.apCost}`);
  if (l.minRange !== sp.po[0] || l.range !== sp.po[1]) diff.push(`PO ${sp.po.join('-')}≠${l.minRange}-${l.range}`);
  if (l.criticalHitProbability !== sp.cb) diff.push(`crit ${sp.cb}≠${l.criticalHitProbability}`);
  if (tour !== sp.t) diff.push(`/tour ${sp.t}≠${tour}`);
  if (cible !== sp.c) diff.push(`/cible ${sp.c}≠${cible}`);
  if (!!l.castInLine !== !!sp.line) diff.push(`**en ligne${l.castInDiagonal ? ' ou diagonale' : ''} sur DofusDB, pas dans le moteur**`);
  if (!!l.castTestLos !== !!sp.los) diff.push(`LdV ${!!sp.los}≠${!!l.castTestLos}`);
  const n = lignes(l.effects), c = lignes(l.criticalEffect || []);
  const m = DMG[cle];
  const moteur = m ? `${m[0]} ${m[1].join('-')} ; ${m[2].join('-')}` : '—';
  if (m && !(n.some((x) => x.endsWith(` ${m[1].join('-')}`)) && c.some((x) => x.endsWith(` ${m[2].join('-')}`)))) diff.push('dégâts');
  if (diff.length) ecarts++;
  out.push(`| ${fr(s)} | ${l.grade} (niv. ${l.minPlayerLevel}) | ${l.apCost} | ${l.minRange}-${l.range}${l.rangeCanBeBoosted ? ' (modif.)' : ''} | ${l.criticalHitProbability} | ${tour}${relance ? ` (relance ${l.minCastInterval})` : ''} | ${cible} | ${l.castInLine ? (l.castInDiagonal ? 'ligne/diag.' : 'oui') : ''} | ${l.castTestLos ? 'oui' : ''} | ${n.join(', ') || '—'} ; ${c.join(', ') || '—'} | ${moteur} | ${diff.join(', ') || '✅'} |`);
}
out.push('', ecarts ? `**${ecarts} sort(s) avec un écart** entre le moteur et DofusDB : à examiner avec le joueur avant de figer.` : 'Aucun écart entre le moteur et DofusDB.', '');

writeFileSync(join(HERE, 'resume-donnees.md'), out.join('\n'));
console.log(`Résumé écrit dans data/resume-donnees.md (${ecarts} sort(s) avec écart).`);
