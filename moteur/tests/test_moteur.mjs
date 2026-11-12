// Tests de non-régression du moteur (docs/RESULTATS_REFERENCE.md) :
//  1. rejoue pas à pas les combos Terre-Feu de référence (T1, T2 22 PA, T2 23 PA) : légalité, PA, positions,
//     et dégâts avec les stuffs Offensif et Équilibré ;
//  2. avec --recherche : relance la recherche T2 (≈ 25 s par recherche) et retrouve les combos du prototype.
// Usage :  node moteur/tests/test_moteur.mjs [--recherche]
import { creerSimulateur, etatInitial, departsT2, CASES_MONSTRE_4 } from '../simulateur.mjs';
import { STATS_PROTOTYPE } from '../formule.mjs';
import { STUFFS_REFERENCE } from '../stuffs_reference.mjs';
import { SP, BANNIS_T2_TERRE_FEU } from '../sorts.mjs';

let erreurs = 0;
const verif = (nom, ok, detail = '') => { if (!ok) erreurs++; console.log(`${ok ? 'OK ' : 'ÉCHEC'}  ${nom}${detail ? `  ${detail}` : ''}`); };
const egal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Combos de référence. pa = PA restants attendus après chaque action (docs/RESULTATS_REFERENCE.md).
const COMBOS = {
  T1: {
    depart: () => etatInitial({ pos: { X: [0, 0], M: [2, 0] }, tf: [], pa: 13, pm: 3 }),
    actions: [
      { sort: 'Sablier', cible: 'M' }, { sort: 'Engrenage', cible: [1, 0] }, { sort: 'Sables', cible: 'M' },
      { sort: 'Poussiere', cible: [1, 0] }, { sort: 'Refraction', cible: 'M' }, { sort: 'Souvenir', cible: 'M' },
      { sort: 'Refraction', cible: 'M' }, { sort: 'Souvenir', cible: 'M' },
    ],
    pa: [11, 10, 8, 6, 4, 4, 2, 0],
    attendu: { offensif: 4128, equilibre: 3854 },
  },
  // T2 retenu le 12/11/2026 : départ M à 4 cases, Rouage puis marche de 2 PM.
  T2_22: {
    depart: () => departsT2(22, [[-4, 0]])[0],
    actions: [
      { sort: 'Poussiere', cible: [-2, 0] }, { sort: 'Sablier', cible: 'M' }, { sort: 'Rayon', cible: 'M' },
      { sort: 'Sables', cible: 'M' }, { sort: 'Horloge', cible: 'M' }, { sort: 'Rouage', cible: [-2, 0] },
      { marche: [-2, 0] }, { sort: 'Engrenage', cible: [-1, 0] }, { sort: 'Souvenir', cible: 'M' },
      { sort: 'Refraction', cible: 'M' }, { sort: 'Frappe', cible: 'M' },
    ],
    pa: [20, 18, 14, 12, 8, 6, 5, 5, 3, 0],
    attendu: { offensif: 5883, equilibre: 5710 },
  },
  T2_23: {
    depart: () => departsT2(23, [[-4, 0]])[0],
    actions: [
      { sort: 'Poussiere', cible: [-2, 0] }, { sort: 'Sablier', cible: 'M' }, { sort: 'Rayon', cible: 'M' },
      { sort: 'Sables', cible: 'M' }, { sort: 'Horloge', cible: 'M' }, { sort: 'Rouage', cible: [-2, 0] },
      { marche: [-2, 0] }, { sort: 'Engrenage', cible: [-1, 0] }, { sort: 'Souvenir', cible: 'M' },
      { sort: 'Horloge', cible: 'M' }, { sort: 'Refraction', cible: 'M' },
    ],
    pa: [21, 19, 15, 13, 9, 7, 6, 6, 2, 0],
    attendu: { offensif: 6175, equilibre: 6009 },
  },
  // Ancien T2 (remplacé le 12/11/2026), gardé comme test du moteur.
  ancien_T2_22: {
    depart: () => departsT2(22, [[-2, 0]])[0],
    actions: [
      { sort: 'Engrenage', cible: [-1, 0] }, { sort: 'Sablier', cible: 'M' }, { sort: 'Horloge', cible: 'M' },
      { sort: 'Sables', cible: 'M' }, { sort: 'Horloge', cible: 'M' }, { sort: 'Poussiere', cible: [-1, 0] },
      { sort: 'Souvenir', cible: 'M' }, { sort: 'Engrenage', cible: [0, 1] }, { sort: 'Rouage', cible: [-1, 1] },
      { sort: 'Refraction', cible: 'M' },
    ],
    pa: [21, 19, 15, 13, 9, 7, 7, 4, 2, 0],
    attendu: { offensif: 5805, equilibre: 5586, prototype: 5856 },
  },
  ancien_T2_23: {
    depart: () => departsT2(23, [[-2, 0]])[0],
    actions: [
      { sort: 'Engrenage', cible: [-1, 0] }, { sort: 'Sablier', cible: 'M' }, { sort: 'Horloge', cible: 'M' },
      { sort: 'Sables', cible: 'M' }, { sort: 'Horloge', cible: 'M' }, { sort: 'Poussiere', cible: [-1, 0] },
      { sort: 'Souvenir', cible: 'M' }, { sort: 'Rayon', cible: [-1, 0] }, { sort: 'Refraction', cible: 'M' },
      { sort: 'Refraction', cible: 'M' },
    ],
    pa: [22, 20, 16, 14, 10, 8, 8, 4, 2, 0],
    attendu: { offensif: 6162, equilibre: 6002, prototype: 6080 },
  },
};

const STATS = { ...STUFFS_REFERENCE, prototype: STATS_PROTOTYPE };
console.log('Combos de référence rejoués pas à pas');
for (const [nom, c] of Object.entries(COMBOS)) {
  for (const [stuff, attendu] of Object.entries(c.attendu)) {
    const sim = creerSimulateur({ stats: STATS[stuff] });
    let s;
    try { s = sim.rejouer(c.depart(), c.actions); } catch (e) { verif(`${nom} ${stuff}`, false, e.message); continue; }
    const pas = s.log.filter((l) => l.type === 'sort').map((l) => l.pa);
    verif(`${nom.padEnd(12)} ${stuff.padEnd(10)} PA`, egal(pas, c.pa), egal(pas, c.pa) ? '' : `obtenu ${pas}`);
    verif(`${nom.padEnd(12)} ${stuff.padEnd(10)} dégâts`, Math.abs(s.dmg - attendu) <= 3, `${Math.round(s.dmg)} (attendu ${attendu})`);
  }
}
// T1 : à 12 PA, les 7 premières étapes passent et il reste 1 PA.
{
  const sim = creerSimulateur({ stats: STUFFS_REFERENCE.offensif });
  const d = COMBOS.T1.depart(); d.pa = 12;
  let s = null;
  try { s = sim.rejouer(d, COMBOS.T1.actions.slice(0, 7)); } catch { /* vérifié ci-dessous */ }
  verif('T1 à 12 PA : 7 étapes, reste 1 PA', !!s && s.pa === 1, s ? `PA restants ${s.pa}` : 'impossible');
}

// Bord de grille (bug déjà vu deux fois) : Pendule depuis X(0,0) sur M(0,-4) envoie X en (0,-8), hors de la
// grille du prototype. L'ancienne grille ignorait la téléportation, puis le « retour à la position précédente »
// renvoyait X sur M : faux échange, +2 PA. Avec la grande grille : X revient en (0,0), aucun échange.
{
  const sim = creerSimulateur({ stats: STUFFS_REFERENCE.offensif });
  const d = departsT2(23, [[0, -2]])[0];
  const avant = [
    { sort: 'Poussiere', cible: [0, -1] }, { sort: 'Sablier', cible: 'M' }, { sort: 'Rayon', cible: 'M' },
    { sort: 'Engrenage', cible: [0, -1] }, { sort: 'Refraction', cible: 'M' }, { sort: 'Poussiere', cible: 'M' },
    { sort: 'Sables', cible: 'M' }, { sort: 'Rouage', cible: [0, -2] }, { sort: 'Souvenir', cible: 'M' },
  ];
  const s = sim.rejouer(d, avant);
  const p = sim.rejouer(s, [{ sort: 'Pendule', cible: 'M' }]);
  const l = p.log[p.log.length - 1];
  verif('Pendule près du bord : pas de faux échange', egal(p.pos.X, s.pos.X) && l.echanges.length === 0 && p.pa === s.pa - 4,
    `X ${s.pos.X} → ${p.pos.X}, PA ${s.pa} → ${p.pa}`);
}

if (process.argv.includes('--recherche')) {
  console.log('\nRecherche T2 (constantes du prototype, beam 4000)');
  const sorts = Object.keys(SP).filter((k) => !BANNIS_T2_TERRE_FEU.includes(k) && k !== 'Paradoxe' && k !== 'Faille');
  for (const [pa, cle] of [[22, 'ancien_T2_22'], [23, 'ancien_T2_23']]) {
    const sim = creerSimulateur({ stats: STATS_PROTOTYPE, sorts });
    const best = sim.search(departsT2(pa, CASES_MONSTRE_4), { beam: 4000 });
    const seq = best.log.filter((l) => l.type === 'sort').map((l) => l.sort);
    const ref = COMBOS[cle].actions.map((a) => a.sort);
    verif(`Recherche ${pa} PA : même enchaînement`, egal(seq, ref), seq.join(', '));
    verif(`Recherche ${pa} PA : dégâts`, Math.abs(best.dmg - COMBOS[cle].attendu.prototype) <= 1, `${Math.round(best.dmg)}`);
  }
}

console.log(erreurs ? `\n${erreurs} échec(s)` : '\nTous les tests du moteur passent.');
process.exit(erreurs ? 1 : 0);
