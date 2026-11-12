// Tests de non-régression du moteur (docs/RESULTATS_REFERENCE.md) :
//  1. rejoue pas à pas les combos Terre-Feu de référence (T1, T2 22 PA, T2 23 PA) : légalité, PA, positions,
//     et dégâts avec les stuffs Offensif et Équilibré ;
//  2. rejoue les combos « monstre au corps à corps au départ » (vérifiés en jeu) et teste le tacle ;
//  3. avec --recherche : relance la recherche T2 (≈ 25 s par recherche) et retrouve les combos du prototype.
// Usage :  node moteur/tests/test_moteur.mjs [--recherche]
import { creerSimulateur, etatInitial, departsT2, departCorpsACorps, CASES_MONSTRE_4 } from '../simulateur.mjs';
import { STATS_PROTOTYPE } from '../formule.mjs';
import { STUFFS_REFERENCE, ANCIENS_STUFFS } from '../stuffs_reference.mjs';
import { SP, BANNIS_T2_TERRE_FEU } from '../sorts.mjs';

let erreurs = 0;
const verif = (nom, ok, detail = '') => { if (!ok) erreurs++; console.log(`${ok ? 'OK ' : 'ÉCHEC'}  ${nom}${detail ? `  ${detail}` : ''}`); };
const egal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Combos de référence. pa = PA restants attendus après chaque action (docs/RESULTATS_REFERENCE.md).
const COMBOS = {
  // T1 dissocié le 13/11/2026, les deux vérifiés en jeu.
  T1_13: {
    depart: () => etatInitial({ pos: { X: [0, 0], M: [2, 0] }, tf: [], pa: 13, pm: 3 }),
    actions: [
      { sort: 'Engrenage', cible: [1, 0] }, { sort: 'Sables', cible: 'M' }, { sort: 'Poussiere', cible: [1, 0] },
      { sort: 'Sablier', cible: 'M' }, { sort: 'Rayon', cible: 'M' }, { sort: 'Souvenir', cible: 'M' },
      { sort: 'Refraction', cible: 'M' },
    ],
    pa: [12, 10, 8, 6, 2, 2, 0],
    attendu: { offensif: 4224, equilibre: 4204, ancien_offensif: 4229, ancien_equilibre: 4109 },
  },
  T1_12: {
    depart: () => etatInitial({ pos: { X: [0, 0], M: [2, 0] }, tf: [], pa: 12, pm: 3 }),
    actions: [
      { sort: 'Sablier', cible: 'M' }, { sort: 'Engrenage', cible: [1, 0] }, { sort: 'Sables', cible: 'M' },
      { sort: 'Poussiere', cible: [1, 0] }, { sort: 'Refraction', cible: 'M' }, { sort: 'Souvenir', cible: 'M' },
      { sort: 'Refraction', cible: 'M' },
    ],
    pa: [10, 9, 7, 5, 3, 3, 1],
    attendu: { offensif: 3843, equilibre: 3813, ancien_offensif: 3828, ancien_equilibre: 3661 },
  },
  // Ancien T1 à 13 PA (le T1 à 12 PA plus un 2e Souvenir), gardé comme test du moteur.
  ancien_T1: {
    depart: () => etatInitial({ pos: { X: [0, 0], M: [2, 0] }, tf: [], pa: 13, pm: 3 }),
    actions: [
      { sort: 'Sablier', cible: 'M' }, { sort: 'Engrenage', cible: [1, 0] }, { sort: 'Sables', cible: 'M' },
      { sort: 'Poussiere', cible: [1, 0] }, { sort: 'Refraction', cible: 'M' }, { sort: 'Souvenir', cible: 'M' },
      { sort: 'Refraction', cible: 'M' }, { sort: 'Souvenir', cible: 'M' },
    ],
    pa: [11, 10, 8, 6, 4, 4, 2, 0],
    attendu: { offensif: 4140, equilibre: 4110, ancien_offensif: 4128, ancien_equilibre: 3854 },
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
    attendu: { offensif: 5938, equilibre: 5898, ancien_offensif: 5883, ancien_equilibre: 5710 },
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
    attendu: { offensif: 6230, equilibre: 6181, ancien_offensif: 6175, ancien_equilibre: 6009 },
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
    attendu: { offensif: 5896, equilibre: 5840, ancien_offensif: 5805, ancien_equilibre: 5586, prototype: 5856 },
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
    attendu: { offensif: 6202, equilibre: 6149, ancien_offensif: 6162, ancien_equilibre: 6002, prototype: 6080 },
  },
};

const STATS = { ...STUFFS_REFERENCE, ancien_offensif: ANCIENS_STUFFS.offensif, ancien_equilibre: ANCIENS_STUFFS.equilibre, prototype: STATS_PROTOTYPE };
console.log('Combos de référence rejoués pas à pas');
for (const [nom, c] of Object.entries(COMBOS)) {
  for (const [stuff, attendu] of Object.entries(c.attendu)) {
    const sim = creerSimulateur({ stats: STATS[stuff] });
    let s;
    try { s = sim.rejouer(c.depart(), c.actions); } catch (e) { verif(`${nom} ${stuff}`, false, e.message); continue; }
    const pas = s.log.filter((l) => l.type === 'sort').map((l) => l.pa);
    verif(`${nom.padEnd(12)} ${stuff.padEnd(16)} PA`, egal(pas, c.pa), egal(pas, c.pa) ? '' : `obtenu ${pas}`);
    verif(`${nom.padEnd(12)} ${stuff.padEnd(16)} dégâts`, Math.abs(s.dmg - attendu) <= 3, `${Math.round(s.dmg)} (attendu ${attendu})`);
  }
}
// Raison de la dissociation : le T1 à 13 PA ne passe pas en entier à 12 PA (il bloque après le Rayon Obscur).
{
  const sim = creerSimulateur({ stats: STUFFS_REFERENCE.offensif });
  const d = COMBOS.T1_13.depart(); d.pa = 12;
  let ok = false;
  try { sim.rejouer(d, COMBOS.T1_13.actions); } catch { ok = true; }
  verif('T1 à 13 PA impossible à 12 PA', ok);
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

// ---------- Espace-temps et Désynchronisation (règles décrites par le joueur le 13/11/2026) ----------
console.log('\nEspace-temps et Désynchronisation');
{
  const sim = creerSimulateur({ stats: STUFFS_REFERENCE.offensif });
  const nbEchanges = (s) => s.log.filter((l) => l.type === 'sort').reduce((a, l) => a + l.echanges.length, 0);
  const evts = (s, mot) => s.log.filter((l) => l.type === 'evenement' && l.texte.includes(mot)).length;

  // Test 6 du joueur : M sans position précédente, en Espace-temps. Engrenage échange X et M, puis Espace-temps
  // renvoie M sur sa case d'origine O (échange), puis X sur O (échange) : X finit sur O, +2 (Engrenage) +2 (Espace-temps).
  let s = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [2, 0] }, pa: 10, pm: 3 }),
    [{ sort: 'EspaceTemps', cible: 'M' }, { sort: 'Engrenage', cible: [1, 0] }]);
  verif('Espace-temps + Engrenage : X finit sur O', egal(s.pos.X, [2, 0]) && egal(s.pos.M, [0, 0]), `X ${s.pos.X}, M ${s.pos.M}`);
  verif('Espace-temps + Engrenage : +4 PA (10 − 2 − 3 + 4 = 9)', s.pa === 9, `PA ${s.pa}`);

  // Cas 7 du joueur : la position précédente de M est la case de X (Astrolabe). Une frappe sans échange :
  // M vient sur X, X revient sur M, rien ne bouge, et M garde son Téléfrag (consommé puis redonné).
  s = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [3, 0] }, pa: 20, pm: 3 }),
    [{ sort: 'Astrolabe', cible: 'M' }, { sort: 'EspaceTemps', cible: 'M' }]);
  const avant = { X: s.pos.X, M: s.pos.M, pa: s.pa };
  s = sim.rejouer(s, [{ sort: 'Refraction', cible: 'M' }]);
  verif('Espace-temps sans échange du sort : positions inchangées', egal(s.pos.X, avant.X) && egal(s.pos.M, avant.M), `X ${s.pos.X}, M ${s.pos.M}`);
  verif('Espace-temps : M garde son Téléfrag après Réfraction', s.tf.has('M'));
  verif('Espace-temps : +2 PA au nom d\'Espace-temps (20 − 2 − 2 + 2 − 2 + 2)', s.pa === avant.pa - 2 + 2, `PA ${avant.pa} → ${s.pa}`);
  const s2 = sim.rejouer(s, [{ sort: 'Refraction', cible: 'M' }]);
  verif('Espace-temps : les +2 PA ne comptent qu\'une fois par tour', s2.pa === s.pa - 2 && s2.tf.has('M'), `PA ${s.pa} → ${s2.pa}`);

  // Une fois par sort : Horloge qui fait exploser le Sablier (deux coups) ne déclenche Espace-temps qu'une fois.
  s = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [2, 0] }, tf: ['M'], pa: 20, pm: 3 }),
    [{ sort: 'Sablier', cible: 'M' }, { sort: 'EspaceTemps', cible: 'M' }, { sort: 'Rayon', cible: 'M' }]);
  const n0 = evts(s, 'Espace-temps');
  s = sim.rejouer(s, [{ sort: 'Engrenage', cible: [1, 0] }, { sort: 'Horloge', cible: 'M' }]);
  const dernier = s.log.findLastIndex((l) => l.type === 'sort');
  const etHorloge = s.log.slice(dernier).filter((l) => l.type === 'evenement' && l.texte.includes('Espace-temps')).length;
  verif('Espace-temps : une seule fois par sort (Horloge + explosion du Sablier)', evts(s, 'Sablier explose') === 1 && etHorloge === 1, `déclenchements sur l'Horloge : ${etHorloge}`);

  // Désynchronisation, à pied : la marche s'arrête sur le piège ; M (à 2 cases) part en symétrie ; pas d'échange
  // possible à deux entités, donc pas de PA ; le piège disparaît.
  s = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [3, 0] }, pa: 10, pm: 3 }),
    [{ sort: 'Desynchronisation', cible: [1, 0] }]);
  const marches = sim.walks(s).map((w) => w.pos.X.join(','));
  verif('Désynchronisation : on ne traverse pas le piège', !marches.includes('2,0'), `cases atteignables : ${marches.length}`);
  s = sim.rejouer(s, [{ marche: [1, 0] }]);
  verif('Désynchronisation à pied : M envoyé en symétrie, piège retiré', egal(s.pos.X, [1, 0]) && egal(s.pos.M, [-1, 0]) && s.pieges.length === 0 && s.pa === 8,
    `X ${s.pos.X}, M ${s.pos.M}, pièges ${s.pieges.length}, PA ${s.pa}`);

  // Désynchronisation par téléportation : Frappe envoie M sur le piège, X (à 1 case) part en symétrie.
  s = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [1, 0] }, pa: 10, pm: 3 }),
    [{ sort: 'Desynchronisation', cible: [-1, 0] }, { sort: 'Frappe', cible: 'M' }]);
  verif('Désynchronisation par téléportation : X envoyé en symétrie', egal(s.pos.M, [-1, 0]) && egal(s.pos.X, [-2, 0]) && nbEchanges(s) === 0,
    `X ${s.pos.X}, M ${s.pos.M}`);
}

// ---------- Monstre au corps à corps au départ (situation définie par le joueur le 13/11/2026) ----------
// X en (0,0), M collé en (1,0), position précédente de M en (2,0). Tacle actif. Les 4 combos sont vérifiés en jeu (13/11/2026).
console.log('\nCorps à corps au départ');
{
  const S = (sort, cible = 'M') => ({ sort, cible });
  const CAC = {
    T1_ET: { pa0: 12, t2: false, actions: [S('EspaceTemps'), S('Sablier'), S('Engrenage', [1, 0]), S('Sables'), S('Poussiere', [1, 0]),
      S('Souvenir'), S('Refraction'), S('Refraction')], pa: [10, 8, 9, 7, 5, 5, 3, 1], fin: { X: [2, 0], M: [0, 0] },
    attendu: { offensif: 3843, equilibre: 3813 } },
    T1_sans_ET: { pa0: 12, t2: false, actions: [S('Sablier'), S('Astrolabe'), S('Refraction'), S('Sables'), S('Rayon'), S('Souvenir'),
      S('Refraction')], pa: [10, 10, 8, 6, 2, 2, 0], fin: { X: [0, 0], M: [1, 0] }, attendu: { offensif: 3541, equilibre: 3519 } },
    T2_ET: { pa0: 22, t2: true, actions: [S('EspaceTemps'), S('Sablier'), S('Engrenage', [1, 0]), S('Rayon'), S('Horloge'), S('Sables'),
      S('Frappe'), S('Refraction'), S('Souvenir'), S('Poussiere', [1, 0]), S('Refraction')], pa: [20, 18, 19, 15, 11, 9, 6, 4, 4, 2, 0],
    fin: { X: [0, 0], M: [2, 0] }, attendu: { offensif: 5909, equilibre: 5866 } },
    T2_sans_ET: { pa0: 22, t2: true, actions: [S('Souvenir'), S('Poussiere', [1, 0]), S('Sablier'), S('Rayon'), S('Engrenage', [1, 0]),
      S('Refraction'), S('Sables'), S('Souvenir'), S('Engrenage', [0, 1]), S('Rouage', [1, 1]), S('Refraction')],
    pa: [20, 18, 16, 12, 11, 9, 7, 7, 4, 2, 0], fin: { X: [0, 2], M: [2, 0] }, attendu: { offensif: 5884, equilibre: 5851 } },
  };
  for (const [nom, c] of Object.entries(CAC)) {
    for (const [stuff, attendu] of Object.entries(c.attendu)) {
      const sim = creerSimulateur({ stats: STUFFS_REFERENCE[stuff], opt: { tacle: true } });
      let s;
      try { s = sim.rejouer(departCorpsACorps(c.pa0, { t2: c.t2 }), c.actions); } catch (e) { verif(`cac ${nom} ${stuff}`, false, e.message); continue; }
      const pas = s.log.filter((l) => l.type === 'sort').map((l) => l.pa);
      verif(`cac ${nom.padEnd(10)} ${stuff.padEnd(10)} PA`, egal(pas, c.pa), egal(pas, c.pa) ? '' : `obtenu ${pas}`);
      verif(`cac ${nom.padEnd(10)} ${stuff.padEnd(10)} positions finales`, egal(s.pos.X, c.fin.X) && egal(s.pos.M, c.fin.M), `X ${s.pos.X}, M ${s.pos.M}`);
      verif(`cac ${nom.padEnd(10)} ${stuff.padEnd(10)} dégâts`, Math.abs(s.dmg - attendu) <= 3, `${Math.round(s.dmg)} (attendu ${attendu})`);
    }
  }

  // Position précédente du monstre : Souvenir le renvoie sur (2,0), à l'opposé du Xélor.
  const simT = creerSimulateur({ stats: STUFFS_REFERENCE.offensif, opt: { tacle: true } });
  const s = simT.rejouer(departCorpsACorps(12), [S('Souvenir')]);
  verif('Corps à corps : Souvenir renvoie M sur sa case précédente (2,0)', egal(s.pos.M, [2, 0]) && s.pa === 10, `M ${s.pos.M}, PA ${s.pa}`);

  // Tacle : collé au monstre, aucune marche ; sans l'option, la marche est possible ; Intaclable après Momification.
  verif('Tacle : aucune marche quand X est collé à M', simT.walks(departCorpsACorps(12)).length === 0);
  const simSans = creerSimulateur({ stats: STUFFS_REFERENCE.offensif });
  verif('Sans tacle : marche possible même collé', simSans.walks(departCorpsACorps(12)).length > 0);
  const momi = simT.rejouer(departCorpsACorps(12), [S('Momification', 'X')]);
  verif('Tacle : Momification rend Intaclable, la marche redevient possible', simT.walks(momi).length > 0);
  // On peut s'arrêter sur une case voisine du monstre, pas en repartir : M en (2,0), 5 PM. (3,1) se rejoint en
  // 4 PM par (1,0) ou (2,1), toutes deux collées à M ; le détour par (2,2) coûte 6 PM.
  const loin = etatInitial({ pos: { X: [0, 0], M: [2, 0] }, pa: 12, pm: 5 });
  const cases = (sim) => sim.walks(loin).map((w) => w.pos.X.join(','));
  verif('Tacle : on peut s\'arrêter collé au monstre', cases(simT).includes('2,1') && cases(simT).includes('1,0'));
  verif('Tacle : on ne repart pas d\'une case collée au monstre', !cases(simT).includes('3,1') && cases(simSans).includes('3,1'));
}

// ---------- Résistances du monstre ----------
// Le moteur (combo rejoué pas à pas) doit donner les mêmes chiffres que outils/test_reference.mjs :
// monstre à 20 % et 10 fixes en Terre et en Feu, stuff Offensif. Le T1 au corps à corps a les mêmes lignes que le T1 à 12 PA.
console.log('\nRésistances du monstre (moteur)');
{
  const RT = { T: { pct: 20, fixe: 10 }, F: { pct: 20, fixe: 10 } };
  const sim = creerSimulateur({ stats: STUFFS_REFERENCE.offensif, resist: RT });
  for (const [nom, attendu] of [['T1_13', 3383], ['T1_12', 3078], ['T2_22', 4730], ['T2_23', 4964]]) {
    const s = sim.rejouer(COMBOS[nom].depart(), COMBOS[nom].actions);
    verif(`${nom.padEnd(12)} avec résistances`, Math.abs(s.dmg - attendu) <= 1, `${Math.round(s.dmg)} (attendu ${attendu})`);
  }
  const simCac = creerSimulateur({ stats: STUFFS_REFERENCE.offensif, resist: RT, opt: { tacle: true } });
  const t1 = simCac.rejouer(departCorpsACorps(12), [{ sort: 'EspaceTemps', cible: 'M' }, { sort: 'Sablier', cible: 'M' },
    { sort: 'Engrenage', cible: [1, 0] }, { sort: 'Sables', cible: 'M' }, { sort: 'Poussiere', cible: [1, 0] },
    { sort: 'Souvenir', cible: 'M' }, { sort: 'Refraction', cible: 'M' }, { sort: 'Refraction', cible: 'M' }]);
  verif('T1 corps à corps avec résistances (= T1 à 12 PA)', Math.abs(t1.dmg - 3078) <= 1, `${Math.round(t1.dmg)}`);
  const sansRes = creerSimulateur({ stats: STUFFS_REFERENCE.offensif }).rejouer(COMBOS.T1_13.depart(), COMBOS.T1_13.actions);
  const rayon = (s) => s.log.find((l) => l.type === 'sort' && l.sort === 'Rayon').gain;
  const avecRes = sim.rejouer(COMBOS.T1_13.depart(), COMBOS.T1_13.actions);
  verif('Rayon Obscur +12 : la résistance s\'applique après le bonus de base', Math.abs(rayon(avecRes) - (rayon(sansRes) - 10) * 0.8) < 1e-6,
    `${Math.round(rayon(sansRes))} → ${Math.round(rayon(avecRes))}`);
}

if (process.argv.includes('--recherche')) {
  console.log('\nRecherche T2 (constantes du prototype, beam 4000)');
  // Mêmes sorts que le prototype : sans Désynchronisation ni Espace-temps (ajoutés après lui).
  const sorts = Object.keys(SP).filter((k) => !BANNIS_T2_TERRE_FEU.includes(k) && !['Paradoxe', 'Faille', 'Desynchronisation', 'EspaceTemps'].includes(k));
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
