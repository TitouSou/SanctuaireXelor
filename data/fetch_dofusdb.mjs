// Récupère les données utiles depuis l'API DofusDB et les écrit dans data/incoming/.
// Usage (Node 18 ou plus) :  node data/fetch_dofusdb.mjs
// Rien n'est appliqué : lance ensuite  node data/diff.mjs  pour voir les différences,
// puis  node data/apply.mjs --oui  si tu valides.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://api.dofusdb.fr';
const OUT = join(dirname(fileURLToPath(import.meta.url)), 'incoming');
const LIMIT = 50; // maximum accepté par l'API

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      return await r.json();
    } catch (e) {
      if (i === tries - 1) throw new Error(`Échec sur ${url} : ${e.message}`);
      await sleep(800 * (i + 1));
    }
  }
}
// Parcourt toutes les pages d'une requête ($skip / $limit).
async function getAll(path) {
  const sep = path.includes('?') ? '&' : '?';
  let all = [];
  for (let skip = 0; ; skip += LIMIT) {
    const j = await get(`${API}${path}${sep}$limit=${LIMIT}&$skip=${skip}`);
    all = all.concat(j.data);
    if (j.data.length < LIMIT) break;
  }
  return all;
}
const inIds = (field, ids) => ids.map((x) => `${field}[$in][]=${x}`).join('&');
async function byIds(path, ids) {
  let out = [];
  for (let i = 0; i < ids.length; i += 40) {
    const j = await get(`${API}${path}?${inIds('id', ids.slice(i, i + 40))}&$limit=${LIMIT}`);
    out = out.concat(j.data);
  }
  return out;
}

const ITEM_FIELDS = ['id', 'name', 'level', 'itemSetId', 'effects', 'criterions', 'typeId', 'twoHanded', 'possibleEffects']
  .map((f) => `$select[]=${f}`).join('&');
const GEAR_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 17, 19, 21, 22, 81, 82, 114, 271]; // équipements et armes
const OTHER_TYPES = [18, 121, 23, 151]; // familiers, montiliers, Dofus, trophées
const XELOR = 5;

// L'API ignore $select et renvoie les objets complets (panoplie et type embarqués : 70 Mo au total).
// On ne garde que les champs utiles, sans rien changer à leur contenu.
const pick = (o, keys) => Object.fromEntries(keys.filter((k) => k in o).map((k) => [k, o[k]]));
const ITEM_KEEP = ['id', 'name', 'level', 'itemSetId', 'effects', 'criterions', 'typeId', 'twoHanded'];
const SET_KEEP = ['id', 'name', 'level', 'effects', 'bonusIsSecret', 'isCosmetic'];
const allegerObjet = (i) => pick(i, ITEM_KEEP);
const allegerPanoplie = (s) => ({ ...pick(s, SET_KEEP), items: (s.items || []).map((x) => (typeof x === 'object' ? x.id : x)) });

async function save(name, data) {
  await writeFile(join(OUT, `${name}.json`), JSON.stringify({ fetchedAt: new Date().toISOString(), source: API, count: data.length, data }, null, 1));
  console.log(`  ${name}.json : ${data.length} entrées`);
}

await mkdir(OUT, { recursive: true });
console.log('Récupération DofusDB…');

await save('characteristics', await getAll('/characteristics'));
await save('effects', await getAll('/effects?$select[]=id&$select[]=characteristic&$select[]=description&$select[]=bonusType&$select[]=operator'));
await save('item-types', await getAll('/item-types'));

// Équipements niveau 160 à 200, plus tous les familiers, montiliers, Dofus et trophées.
let items = [];
for (const t of GEAR_TYPES) items = items.concat(await getAll(`/items?typeId=${t}&level[$gte]=160&level[$lte]=200&${ITEM_FIELDS}`));
for (const t of OTHER_TYPES) items = items.concat(await getAll(`/items?typeId=${t}&level[$gte]=1&level[$lte]=200&${ITEM_FIELDS}`));
// Équipements de bas niveau qui donnent des PA ou des PM (Gelano, etc.).
const typeFilter = inIds('typeId', GEAR_TYPES);
for (const ch of [1, 23]) items = items.concat(await getAll(`/items?${typeFilter}&level[$lt]=160&effects.characteristic=${ch}&${ITEM_FIELDS}`));
const seen = new Set();
items = items.filter((i) => !seen.has(i.id) && seen.add(i.id)).map(allegerObjet);
await save('items', items);

const setIds = [...new Set(items.map((i) => i.itemSetId).filter((x) => x > 0))];
await save('item-sets', (await byIds('/item-sets', setIds)).map(allegerPanoplie));

// Sorts du Xélor : variantes, sorts, tous les grades.
const breed = (await get(`${API}/breeds?id=${XELOR}`)).data[0];
await save('breed-xelor', [breed]);
const variants = await getAll(`/spell-variants?breedId=${XELOR}`);
await save('spell-variants', variants);
const spellIds = [...new Set(variants.flatMap((v) => v.spellIds))];
const spells = await byIds('/spells', spellIds);
await save('spells', spells);
const levelIds = spells.flatMap((s) => s.spellLevels);
await save('spell-levels', await byIds('/spell-levels', levelIds));
// Sous-sorts utiles (Téléfrag, effets des Dofus Ocre, etc.).
await save('spells-annexes', await byIds('/spells', [24510, 13265, 13263, 13326, 13325, 30861, 8394, 8396]));

console.log(`\nTerminé. Fichiers dans ${OUT}`);
console.log('Étape suivante : node data/diff.mjs');
