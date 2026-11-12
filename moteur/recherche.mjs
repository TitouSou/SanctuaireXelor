// Recherche du meilleur combo T2 (sans Cadran), équivalent JS de sim/lancer_recherche.py.
// Usage :  node moteur/recherche.mjs <PA> [beam] [sorts,interdits] [--stuff prototype|offensif|equilibre] [--regles-prototype]
// --regles-prototype : sans les lancers en ligne validés en jeu (Horloge, Aiguille, Régulateur), comme le Python.
// --t1 : situation du T1 (le Xélor n'est pas en Téléfrag au départ ; PA = 13 avec l'Ocre). Sinon : T2.
// Exemple :  node moteur/recherche.mjs 22 4000 Glas,Perturbation,Permutation,Regulateur,Gelure,Ralentissement,CompteGoutte,Distorsion,Dessechement,Clepsydre
import { readFileSync } from 'node:fs';
import { SP } from './sorts.mjs';
import { STATS_PROTOTYPE } from './formule.mjs';
import { STUFFS_REFERENCE } from './stuffs_reference.mjs';
import { creerSimulateur, departsT2, etatInitial, CASES_MONSTRE_4, formaterLog } from './simulateur.mjs';

const args = process.argv.slice(2);
const pos = args.filter((a) => !a.startsWith('--'));
const opt = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const PA = +pos[0] || 22, beam = +pos[1] || 4000;
const ban = new Set([...(pos[2] ? pos[2].split(',') : []), 'Paradoxe', 'Faille']); // sans Cadran sur le plateau
// --stats fichier.json : stats d'un stuff (champ « stats » d'une sortie de l'optimiseur, ou l'objet seul).
const fichierStats = opt('stats');
const nomStuff = opt('stuff') || 'prototype';
const lu = fichierStats ? JSON.parse(readFileSync(fichierStats, 'utf8')) : null;
const stats = lu ? (lu.stats || lu) : nomStuff === 'prototype' ? STATS_PROTOTYPE : STUFFS_REFERENCE[nomStuff];
if (!stats) { console.error(`Stuff inconnu : ${nomStuff}`); process.exit(1); }

const sim = creerSimulateur({ stats, sorts: Object.keys(SP).filter((k) => !ban.has(k)), opt: { ligne_dofusdb: !args.includes('--regles-prototype') } });
const t0 = Date.now();
const departs = args.includes('--t1')
  ? CASES_MONSTRE_4.map((mp) => etatInitial({ pos: { X: [0, 0], M: mp }, tf: [], pa: PA, pm: 3, log: [{ type: 'depart', pos: { X: [0, 0], M: mp }, pa: PA }] }))
  : departsT2(PA, CASES_MONSTRE_4);
const best = sim.search(departs, { beam, verbose: true });
console.log('BEST', Math.round(best.dmg));
console.log(formaterLog(best.log));
console.log('load', best.load, `(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
