// Tests de non-régression du moteur (docs/RESULTATS_REFERENCE.md) :
//  1. rejoue pas à pas les combos Terre-Feu de référence (T1, T2 22 PA, T2 23 PA) : légalité, PA, positions,
//     et dégâts avec les stuffs Offensif et Équilibré ;
//  2. rejoue les combos « monstre au corps à corps au départ » (vérifiés en jeu) et teste le tacle ;
//  3. avec --recherche : relance la recherche T2 (≈ 25 s par recherche) et retrouve les combos du prototype.
// Usage :  node moteur/tests/test_moteur.mjs [--recherche]
import { creerSimulateur, etatInitial, departsT2, departCorpsACorps, CASES_MONSTRE_4 } from '../simulateur.mjs';
import { STATS_PROTOTYPE, SYNCHRO_DEGATS, degatsSynchro, multiplicateursTurquoise } from '../formule.mjs';
import { STUFFS_REFERENCE, ANCIENS_STUFFS } from '../stuffs_reference.mjs';
import { SP, BANNIS_T2_TERRE_FEU } from '../sorts.mjs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

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

// ---------- Corrections du joueur (14/11/2026) : Compte-goutte, Régulateur, Aiguille, Gousset, Clepsydre ----------
console.log('\nCorrections du joueur (14/11/2026)');
{
  const sim = creerSimulateur({ stats: STUFFS_REFERENCE.offensif });
  const S = (sort, cible = 'M') => ({ sort, cible });
  const evts = (s, mot) => s.log.filter((l) => l.type === 'evenement' && l.texte.includes(mot));

  // Compte-goutte, exemple du joueur : la position précédente de la cible est la case du Xélor. La cible y revient
  // (échange), puis le Xélor revient sur sa case (échange) : personne n'a bougé, Téléfrag généré, +2 PA.
  for (const histX of [[], [[5, 0]]]) {
    const s = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [2, 0] }, hist: { X: histX, M: [[0, 0]] }, pa: 10, pm: 3 }), [S('CompteGoutte')]);
    const l = s.log.filter((x) => x.type === 'sort').at(-1);
    verif(`Compte-goutte (cible sur la case du Xélor, X ${histX.length ? 'avec' : 'sans'} position précédente) : personne ne bouge, +2 PA`,
      egal(s.pos.X, [0, 0]) && egal(s.pos.M, [2, 0]) && l.echanges.length === 2 && s.pa === 9 && s.tf.has('M') && s.tf.has('X'),
      `X ${s.pos.X}, M ${s.pos.M}, ${l.echanges.length} échanges, PA ${s.pa}`);
  }
  // Compte-goutte, cas général : la cible revient d'abord (case libre), puis le Xélor.
  {
    const s = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [2, 0] }, hist: { X: [[0, 3]], M: [[4, 0]] }, pa: 10, pm: 3 }), [S('CompteGoutte')]);
    verif('Compte-goutte : la cible puis le Xélor reviennent à leur position précédente', egal(s.pos.M, [4, 0]) && egal(s.pos.X, [0, 3]), `X ${s.pos.X}, M ${s.pos.M}`);
  }
  // Régulateur ne retire pas le Sablier : Sablier, Régulateur (1er Téléfrag consommé), Horloge (2e) → explosion.
  {
    const s = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [2, 0] }, tf: ['M'], pa: 20, pm: 3 }),
      [S('Sablier'), S('Regulateur'), S('Engrenage', [1, 0]), S('Horloge')]);
    verif('Régulateur : le Sablier reste, il explose au 2e Téléfrag consommé', evts(s, 'Sablier explose').length === 1);
  }
  // Aiguille : pas de dégâts au lancer ; poison du début du tour du monstre compté dans le burst ; une activation de
  // plus par la consommation du Téléfrag, une seule fois par tour ; Régulateur ne la retire pas (elle vient d'être posée).
  {
    const a = sim.sd('Aiguille');
    const s0 = etatInitial({ pos: { X: [0, 0], M: [2, 0] }, tf: ['M'], pa: 20, pm: 3 });
    const s1 = sim.rejouer(s0, [S('Aiguille')]);
    verif('Aiguille : poison du début du tour du monstre compté (1 coup)', Math.abs(s1.dmg - a) < 1e-9, `${s1.dmg.toFixed(1)} / ${a.toFixed(1)}`);
    const s2 = sim.rejouer(s1, [S('Regulateur')]);
    verif('Aiguille : activée par la consommation du Téléfrag (Régulateur), sans être retirée', Math.abs(s2.dmg - 2 * a - sim.sd('Regulateur')) < 1e-9 && s2.aig);
    const s3 = sim.rejouer(s2, [S('Engrenage', [1, 0]), S('Horloge')]);
    verif('Aiguille : une seule activation par consommation et par tour', Math.abs(s3.dmg - s2.dmg - sim.sd('Engrenage') - sim.sd('Horloge', 24)) < 1e-9);
  }
  // Gousset et Clepsydre : consomment le Téléfrag ; effets différés signalés (pas comptés) si la cible était en Téléfrag.
  {
    const s = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [2, 0] }, tf: ['M'], pa: 20, pm: 3 }), [S('Gousset')]);
    verif('Gousset sur cible en Téléfrag : Téléfrag consommé, dégâts différés signalés, non comptés',
      !s.tf.has('M') && s.log.some((l) => l.differe?.sort === 'Gousset') && Math.abs(s.dmg - sim.sd('Gousset')) < 1e-9);
    const s2 = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [2, 0] }, pa: 20, pm: 3 }), [S('Gousset')]);
    verif('Gousset sans Téléfrag : pas de dégâts différés', !s2.log.some((l) => l.differe));
    const s3 = sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [2, 0] }, tf: ['M'], pa: 20, pm: 3 }), [S('Clepsydre')]);
    verif('Clepsydre sur cible en Téléfrag : Téléfrag consommé, PA du tour suivant signalés', !s3.tf.has('M') && s3.log.some((l) => l.differe?.sort === 'Clepsydre'));
  }
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

// ---------- Synchro (valeurs du joueur, 15/11/2026) ----------
console.log('\nSynchro');
{
  const attendu = [366, 1098, 1830, 2562, 3294, 4026, 4758, 5490, 6222, 6954, 7686, 8418];
  verif('Synchro : les 12 niveaux du joueur', attendu.every((d, i) => degatsSynchro(i + 1) === d), SYNCHRO_DEGATS.join(', '));
  verif('Synchro : 366 × (2 × niveau − 1)', SYNCHRO_DEGATS.every((d, i) => d === 366 * (2 * (i + 1) - 1)));
  verif('Synchro : seule la résistance Air compte, fixe puis %',
    degatsSynchro(5, { A: { pct: 20, fixe: 10 }, F: { pct: 50, fixe: 100 } }) === (3294 - 10) * 0.8, `${degatsSynchro(5, { A: { pct: 20, fixe: 10 } })}`);
  verif('Synchro : jamais négative', degatsSynchro(1, { A: { pct: 0, fixe: 500 } }) === 0);
  verif('Synchro : faiblesse Air (% négatif)', degatsSynchro(12, { A: { pct: -10, fixe: 0 } }) === 8418 * 1.1);
  let refus = 0;
  for (const n of [0, 13, 2.5]) { try { degatsSynchro(n); } catch { refus++; } }
  verif('Synchro : niveaux 0, 13 et 2,5 refusés', refus === 3);
}

// ---------- Dofus Turquoise (24/11/2026, estimation acceptée par le joueur : moteur/formule.mjs) ----------
console.log('\nDofus Turquoise');
{
  const m = multiplicateursTurquoise([{ pc: 0.5 }, { pc: 0.5 }, { pc: 0, bonus: false }, { pc: 1 }]);
  verif('1er coup sans bonus, puis +1 % par critique déjà porté (en moyenne), poussée sans bonus', egal(m.map((x) => +x.toFixed(9)), [1, 1.005, 1, 1.01]));
  const m2 = multiplicateursTurquoise(Array.from({ length: 13 }, () => ({ pc: 1 })));
  verif('10 cumuls au plus', Math.abs(m2[9] - 1.09) < 1e-12 && Math.abs(m2[10] - 1.1) < 1e-12 && Math.abs(m2[12] - 1.1) < 1e-12);
}

// ---------- Coup d'arme (✅ règles du joueur, 18/11/2026) ----------
console.log("\nCoup d'arme");
{
  // Katana de Spiritueur (3 lignes 10 à 16 Terre / Feu / Air, bonus de crit 7) et stats de la capture du joueur :
  // 453-611 (crit 724-882) sans Maîtrise d'Arme, 543-755 (877-1 089) avec, 561-783 (908-1 131) avec Maîtrise en critique
  // (valeurs du jeu arrondies ligne par ligne vers le bas : le moteur, sans arrondi, est au plus 3 au-dessus).
  const KATANA = { id: 23627, nom: 'Katana de Spiritueur', pa: 4, po: [1, 1], ligne: false, diag: false, los: true, t: 1, cc: 20, cb: 7,
    effets: ['T', 'F', 'A'].map((el) => ({ type: 'degats', el, n: [10, 16], vol: false })), nbLignes: 3, deplace: false, utilisable: true };
  const S = { fo: 889, int: 885, cha: 163, agi: 153, pui: 135, doT: 89, doF: 89, doE: 44, doA: 13, doN: 57, crit: 49, doCrit: 29 };
  const { degatsLigneArme, porteeArme, comboJouableAvec } = await import('../armes.mjs');
  const borne = (n, crit, pArme) => KATANA.effets.reduce((a, e) => a + degatsLigneArme({ ...e, n: [n, n] }, { ...KATANA, cc: crit ? 100 : 0 }, S, { melee: true, pArme }).moyenne, 0);
  for (const [pArme, att] of [[0, [453, 611, 724, 882]], [300, [543, 755, 877, 1089]], [360, [561, 783, 908, 1131]]]) {
    const v = [borne(10, false, pArme), borne(16, false, pArme), borne(10, true, pArme), borne(16, true, pArme)];
    verif(`Katana, Puissance d'arme ${pArme} : ${att.join(' / ')}`, v.every((x, i) => x - att[i] >= 0 && x - att[i] < 3), v.map((x) => x.toFixed(1)).join(' / '));
  }
  verif('Arme 1-1 : pas la diagonale', !porteeArme(KATANA, [0, 0], [1, 1]) && porteeArme(KATANA, [0, 0], [1, 0]));
  verif('Hache (1-1, en diagonale) : la diagonale collée', porteeArme({ ...KATANA, ligne: true, diag: true }, [0, 0], [1, 1]) && !porteeArme({ ...KATANA, ligne: true, diag: true }, [0, 0], [2, 2]));
  verif('Arme à 0 % de crit : jamais de crit', degatsLigneArme(KATANA.effets[0], { ...KATANA, cc: 0 }, { ...S, crit: 100 }, { melee: true, pArme: 0 }).moyenne
    === degatsLigneArme(KATANA.effets[0], { ...KATANA, cc: 0 }, { ...S, crit: 0 }, { melee: true, pArme: 0 }).normal);
  // Espace-temps : une fois par ligne de l'arme, après toutes les lignes. M collé, sa position précédente est la case du
  // Xélor : 3 × 2 échanges, personne ne bouge, Téléfrag sur les deux, +2 PA (une fois, au nom d'Espace-temps).
  const sim = creerSimulateur({ stats: S, arme: KATANA });
  const d0 = etatInitial({ pos: { X: [0, 0], M: [1, 0] }, hist: { M: [[0, 0]] }, pa: 12, pm: 3 });
  const s = sim.rejouer(d0, [{ sort: 'EspaceTemps', cible: 'M' }, { sort: 'MaitriseArme', cible: 'X' }, { sort: 'Arme', cible: 'M' }]);
  verif('Espace-temps × 3 lignes : personne ne bouge, Téléfrag, +2 PA', egal(s.pos, { X: [0, 0], M: [1, 0] }) && s.tf.has('M') && s.tf.has('X') && s.pa === 12 - 2 - 2 - 4 + 2, `PA ${s.pa}`);
  verif("Le coup d'arme ne consomme pas le Téléfrag", sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [1, 0] }, tf: ['M'], pa: 12, pm: 3 }), [{ sort: 'Arme', cible: 'M' }]).tf.has('M'));
  verif("Un seul coup de Katana par tour", sim.cast(sim.rejouer(etatInitial({ pos: { X: [0, 0], M: [1, 0] }, pa: 12, pm: 3 }), [{ sort: 'Arme', cible: 'M' }]), 'Arme', [1, 0]) === null);
  const coups = [{ pa: 4, X: [0, 0], M: [1, 0], et: false, nbLignes: 3, deplace: false }];
  verif('Combo jouable avec une arme moins chère, refusé avec une plus chère',
    comboJouableAvec(coups, 'Katana de Spiritueur', { ...KATANA, nom: 'Autre', pa: 3 }) && !comboJouableAvec(coups, 'Katana de Spiritueur', { ...KATANA, nom: 'Autre', pa: 5 }));
}

// ---------- Combos de toutes les voies (site/data/voies/*.json) ----------
// Chaque combo est rejoué pas à pas sur les deux stuffs de sa voie : légalité, PA, variantes de la voie, dégâts.
console.log('\nCombos des voies (outils/fiche_voies.mjs --verifier-seulement)');
try {
  const out = execFileSync(process.execPath, [fileURLToPath(new URL('../../outils/fiche_voies.mjs', import.meta.url)), '--verifier-seulement'], { encoding: 'utf8' });
  verif('Combos des voies rejoués à l\'identique', true, out.trim().split('\n').at(-1));
} catch (e) { verif('Combos des voies rejoués à l\'identique', false, (e.stdout || e.message).trim().split('\n').slice(-5).join(' | ')); }

// ---------- Données du site (build/construire_site.mjs) ----------
// Les fichiers du site sont à jour, et la formule du site redonne exactement les dégâts publiés.
console.log('\nDonnées du site (build/construire_site.mjs --verifier)');
try {
  const out = execFileSync(process.execPath, [fileURLToPath(new URL('../../build/construire_site.mjs', import.meta.url)), '--verifier'], { encoding: 'utf8' });
  verif('Site à jour, dégâts du site identiques', true, out.trim().split('\n').at(-1));
} catch (e) { verif('Site à jour, dégâts du site identiques', false, (e.stdout || e.message).trim().split('\n').slice(-5).join(' | ')); }

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
