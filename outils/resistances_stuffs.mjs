// Ajoute les résistances % (Terre, Feu, Eau, Air, Neutre, minimum et moyenne) aux stuffs calculés avant le 16/11/2026,
// qui ne les avaient pas (les Offensifs, notamment). Rien d'autre ne change : chaque stuff est réévalué par
// l'optimiseur sans recherche (--objets), et ses PV doivent être retrouvés à l'identique.
// Usage :  node outils/resistances_stuffs.mjs [fichiers…]     (par défaut : outils/resultats/voies/<voie>.json)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DOSSIER = join(HERE, 'resultats', 'voies');
const fichiers = process.argv.slice(2).length ? process.argv.slice(2)
  : readdirSync(DOSSIER).filter((f) => /^[a-z-]+\.json$/.test(f)).map((f) => join(DOSSIER, f));
const TMP = mkdtempSync(join(tmpdir(), 'resistances-'));
let erreurs = 0;
for (const f of fichiers) {
  const r = JSON.parse(readFileSync(f, 'utf8'));
  let change = false;
  // Les voies autres que Terre-Feu ont besoin de leurs combos (lignes du moteur) pour être évaluées.
  const fc = join(TMP, 'combos.json');
  writeFileSync(fc, JSON.stringify(Object.fromEntries(['T1_13', 'T1_12', 'T2_22', 'T2_23'].map((k) => [k, r.combos[k].lignes]))));
  for (const [profil, st] of Object.entries(r.stuffs)) {
    if (st.resistancesPct) continue;
    const noms = Object.values(st.objets).filter(Boolean).join(';');
    const out = execFileSync(process.execPath, [join(HERE, 'optimiseur_stuff.mjs'), '--voie', r.voie, '--objets', noms, '--combos', fc, '--pas-de-fichier'], { encoding: 'utf8' });
    const j = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1));
    if (j.pv !== st.pv) { erreurs++; console.log(`ÉCHEC  ${r.voie} ${profil} : ${j.pv} PV au lieu de ${st.pv}`); continue; }
    st.resistancesPct = j.resistancesPct; change = true;
    console.log(`${r.voie.padEnd(9)} ${profil.padEnd(9)} résistances % : min ${j.resistancesPct.min}, moyenne ${j.resistancesPct.moyenne}`);
  }
  if (change) writeFileSync(f, JSON.stringify(r, null, 1));
}
rmSync(TMP, { recursive: true, force: true });
process.exit(erreurs ? 1 : 0);
