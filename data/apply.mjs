// Remplace data/current/ par data/incoming/, après validation explicite.
// Usage :  node data/apply.mjs --oui
import { cp, rm, appendFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
if (!process.argv.includes('--oui')) {
  console.log('Par sécurité, rien n\'a été appliqué. Relis data/diff-report.md puis lance :  node data/apply.mjs --oui');
  process.exit(1);
}
const IN = join(HERE, 'incoming'), CUR = join(HERE, 'current');
if (!existsSync(IN)) { console.log('Pas de data/incoming/ : lance d\'abord la récupération.'); process.exit(1); }
const files = (await readdir(IN)).filter((f) => f.endsWith('.json'));
await rm(CUR, { recursive: true, force: true });
await cp(IN, CUR, { recursive: true });
await appendFile(join(HERE, 'HISTORIQUE.md'), `- ${new Date().toLocaleString('fr-FR')} : données DofusDB appliquées (${files.length} fichiers)\n`);
console.log('Données appliquées. Pense à relancer le build et les tests de non-régression.');
