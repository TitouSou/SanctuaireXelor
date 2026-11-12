// Compare data/incoming/ (dernière récupération) à data/current/ (données validées).
// Usage :  node data/diff.mjs
// Écrit aussi le détail dans data/diff-report.md. N'applique rien.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const IN = join(HERE, 'incoming');
const CUR = join(HERE, 'current');
const VOLATILE = new Set(['_id', 'createdAt', 'updatedAt', 'img', 'fetchedAt']);

const clean = (o) => JSON.stringify(o, (k, v) => (VOLATILE.has(k) ? undefined : v));
const label = (o) => (o.name && (o.name.fr || o.name)) || o.keyword || `#${o.id}`;
const load = async (p) => JSON.parse(await readFile(p, 'utf8')).data;

if (!existsSync(IN)) {
  console.log('Rien à comparer : lance d\'abord  node data/fetch_dofusdb.mjs');
  process.exit(1);
}
const lines = [`# Rapport de différences DofusDB`, ``, `Généré le ${new Date().toLocaleString('fr-FR')}`, ``];
let total = 0;
for (const f of (await readdir(IN)).filter((x) => x.endsWith('.json')).sort()) {
  const inc = await load(join(IN, f));
  if (!existsSync(join(CUR, f))) {
    lines.push(`## ${f}`, ``, `Nouveau fichier (${inc.length} entrées).`, ``);
    total += inc.length; continue;
  }
  const cur = await load(join(CUR, f));
  const A = new Map(cur.map((o) => [o.id, o])), B = new Map(inc.map((o) => [o.id, o]));
  const added = [...B.keys()].filter((k) => !A.has(k));
  const removed = [...A.keys()].filter((k) => !B.has(k));
  const changed = [...B.keys()].filter((k) => A.has(k) && clean(A.get(k)) !== clean(B.get(k)));
  const n = added.length + removed.length + changed.length;
  total += n;
  console.log(`${f.padEnd(22)} +${added.length}  -${removed.length}  ~${changed.length}`);
  if (!n) continue;
  lines.push(`## ${f}`, ``);
  if (added.length) lines.push(`Ajoutés : ${added.map((k) => label(B.get(k))).join(', ')}`, ``);
  if (removed.length) lines.push(`Retirés : ${removed.map((k) => label(A.get(k))).join(', ')}`, ``);
  if (changed.length) lines.push(`Modifiés : ${changed.map((k) => label(B.get(k))).join(', ')}`, ``);
}
await writeFile(join(HERE, 'diff-report.md'), lines.join('\n'));
console.log(total ? `\n${total} différence(s). Détail : data/diff-report.md` : '\nAucune différence.');
console.log('Si tout est correct :  node data/apply.mjs --oui');
