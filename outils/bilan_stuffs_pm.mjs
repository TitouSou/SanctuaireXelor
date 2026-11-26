// Bilan des stuffs recalculés le 24/11/2026 (Turquoise autorisé, Arcaniste banni, 5 PM autorisés).
// Pour chaque voie et profil : stuff publié, meilleur à 6 PM, meilleur à exactement 5 PM, et celui retenu par la règle
// du joueur (5 PM seulement s'il fait au moins +5 % sur la moyenne des 4 combos T1 / T2 par rapport au 6 PM).
// Lit outils/resultats/voies/stuffs-pm6/ et stuffs-pm5/ (écrits par outils/pilote_voies.mjs) ; n'écrit que le bilan.
// Usage : node outils/bilan_stuffs_pm.mjs   (écrit outils/resultats/voies/bilan-stuffs-pm.md)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VOIES } from './degats.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const R = join(HERE, 'resultats', 'voies');
const SEUIL_5PM = 0.05;
const lire = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null);
const pct = (a, b) => (a && b ? `${a >= b ? '+' : ''}${((a / b - 1) * 100).toFixed(1)} %` : '—');
const res = (s) => (s?.resistancesPct ? `${s.resistancesPct.min} / ${s.resistancesPct.moyenne}` : '—');
// Objets changés (les anneaux et les Dofus / trophées sont interchangeables entre leurs emplacements).
function changes(avant, apres) {
  const a = Object.values(avant || {}).filter(Boolean), b = Object.values(apres || {}).filter(Boolean);
  const retire = [...a], ajoute = [];
  for (const x of b) { const i = retire.indexOf(x); if (i >= 0) retire.splice(i, 1); else ajoute.push(x); }
  return retire.length || ajoute.length ? `${retire.join(', ') || '—'} → ${ajoute.join(', ') || '—'}` : 'aucun';
}
const turquoise = (o) => Object.entries(o || {}).find(([, n]) => n === 'Dofus Turquoise')?.[0] || 'absent';
const NOM = { offensif: 'Offensif', equilibre: 'Équilibré' };

const lignes = [], alertes = [];
lignes.push('# Bilan des stuffs (24/11/2026)', '',
  'Mode « sans Dolmanax, Vulbis, Dofus des Glaces, Arcaniste », Dofus Turquoise autorisé. Score = moyenne des 4 combos T1 / T2',
  '(dégâts moyens, critiques comptés, effet du Turquoise estimé). Résistances : minimum / moyenne des cinq éléments, en %.', '',
  '| Voie | Profil | Publié | 6 PM | écart | PV | Rés. | Turquoise | 5 PM | écart / 6 PM | PV | Rés. | Méthode 5 PM | Retenu |',
  '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
const details = [];
for (const voie of Object.keys(VOIES)) for (const profil of ['offensif', 'equilibre']) {
  const p6 = lire(join(R, 'stuffs-pm6', `${voie}.${profil}.json`)), p5 = lire(join(R, 'stuffs-pm5', `${voie}.${profil}.json`));
  if (!p6 && !p5) continue;
  const pub = (p6 || p5).publie, b6 = p6?.best, b5 = p5?.ok ? p5.best : null;
  const garde5 = b5 && b6 && b5.score >= b6.score * (1 + SEUIL_5PM);
  const retenu = !b6 ? '?' : garde5 ? '**5 PM**' : '6 PM';
  lignes.push(`| ${voie} | ${NOM[profil]} | ${pub.score} | ${b6 ? b6.score : '—'} | ${pct(b6?.score, pub.score)} | ${b6?.pv ?? '—'} | ${res(b6)} | ${turquoise(b6?.objets)} | `
    + `${b5 ? b5.score : p5 ? 'aucun' : '—'} | ${pct(b5?.score, b6?.score)} | ${b5?.pv ?? '—'} | ${res(b5)} | ${p5?.methode ?? '—'} | ${retenu} |`);
  details.push(`- **${voie} ${NOM[profil]}** — 6 PM : ${changes(pub.objets, b6?.objets)}${b5 ? ` ; 5 PM (par rapport au 6 PM) : ${changes(b6?.objets, b5.objets)}` : ''}`);
  // Contraintes (Équilibré : PV ≥ 3 500, aucune résistance % négative, moyenne ≥ 20 %) ; PA / PM ; contraintes de l'optimiseur.
  for (const [t, b, pm] of [['6 PM', b6, 6], ['5 PM', b5, 5]]) {
    if (!b) continue;
    const pb = [];
    if (!b.contraintesRespectees) pb.push('contraintes non respectées');
    if (b.pa !== 12 || b.pm !== pm) pb.push(`${b.pa} PA / ${b.pm} PM`);
    if (profil === 'equilibre') {
      if (b.pv < 3500) pb.push(`${b.pv} PV`);
      if (b.resistancesPct.min < 0) pb.push(`résistance minimale ${b.resistancesPct.min} %`);
      if (b.resistancesPct.moyenne < 20) pb.push(`résistance moyenne ${b.resistancesPct.moyenne} %`);
    }
    if (pb.length) alertes.push(`- ${voie} ${NOM[profil]} ${t} : ${pb.join(', ')}`);
  }
  if (p6 && !p6.ok) alertes.push(`- ${voie} ${NOM[profil]} 6 PM : aucun stuff ne respecte les contraintes`);
}
lignes.push('', '## Objets changés', '', ...details, '', '## Vérifications', '', ...(alertes.length ? alertes : ['- Toutes les contraintes sont respectées (12 PA, PM, et pour les Équilibrés : PV ≥ 3 500, aucune résistance négative, moyenne ≥ 20 %).']));
const texte = lignes.join('\n') + '\n';
writeFileSync(join(R, 'bilan-stuffs-pm.md'), texte);
console.log(texte);
