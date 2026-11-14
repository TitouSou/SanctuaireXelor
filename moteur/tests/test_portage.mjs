// Test de portage : le moteur JS doit produire exactement les mêmes successeurs que le prototype Python,
// état par état (positions, historiques, Téléfrags, PA, PM, compteurs, états), et les mêmes dégâts.
// Usage :  node moteur/tests/test_portage.mjs
// La fixture se régénère avec  py moteur/tests/generer_fixture_python.py  (Python requis seulement pour ça).
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { creerSimulateur } from '../simulateur.mjs';
import { STATS_PROTOTYPE } from '../formule.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const fx = JSON.parse(readFileSync(join(HERE, 'fixture_python.json'), 'utf8'));
const detail = process.argv.includes('--detail');

const P = (p) => `${p[0]},${p[1]}`;
const B = (b) => (b ? '1' : '0');
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const items = (o) => Object.entries(o).sort((a, b) => cmp(a[0], b[0]));
function canon(s) {
  const ents = Object.keys(s.pos).sort();
  const ct = Object.entries(s.ct).map(([k, v]) => [...k.split('|'), v]).sort((a, b) => cmp(a[0], b[0]) || cmp(a[1], b[1]));
  return [
    ents.map((e) => e + P(s.pos[e])).join(';'),
    ents.map((e) => e + s.hist[e].map(P).join('/')).join(';'),
    [...s.tf].sort().join(''), String(s.pa), String(s.pm),
    items(s.cnt).map(([k, v]) => `${k}:${v}`).join(','),
    ct.map(([sp, t, v]) => `${sp}|${t}:${v}`).join(','),
    [...s.bonus].sort().join(','),
    s.sab === null ? 'None' : String(s.sab), B(s.aig), B(s.aigdone), String(s.flet), String(s.petr), String(s.k),
    items(s.ready).map(([k, v]) => `${k}:${B(v)}`).join(','),
    items(s.load).map(([k, v]) => `${k}:${v}`).join(','),
    B(s.indep),
  ].join('#');
}
function etat(e) {
  return {
    pos: e.pos, hist: Object.fromEntries(Object.entries(e.hist).map(([k, h]) => [k, h.map((p) => [...p])])),
    tf: new Set(e.tf), pa: e.pa, pm: e.pm, cnt: { ...e.cnt }, ct: Object.fromEntries(e.ct.map(([sp, t, v]) => [`${sp}|${t}`, v])),
    bonus: new Set(e.bonus), dmg: e.dmg, sab: e.sab, aig: e.aig, aigdone: e.aigdone, flet: e.flet, petr: e.petr, k: e.k,
    ready: { ...e.ready }, load: { ...e.load }, indep: e.indep, log: [], horl: 0,
  };
}

let nEtats = 0, nSucc = 0, echecs = 0;
for (const [ic, ch] of fx.chaines.entries()) {
  // Le prototype ne connaît pas les sorts en ligne validés depuis : on compare avec ses règles.
  const sim = creerSimulateur({ stats: STATS_PROTOTYPE, sorts: ch.sorts, opt: { ligne_dofusdb: false, corrections_sorts: false }, grille: 'prototype' });
  for (const [ie, et] of ch.etapes.entries()) {
    nEtats++;
    const s = etat(et.etat);
    const succ = sim.successeurs(s).map((n) => [canon(n), n.dmg]).sort((a, b) => cmp(a[0], b[0]) || a[1] - b[1]);
    nSucc += succ.length;
    const h = createHash('sha1').update(succ.map(([c]) => c).join('\n')).digest('hex');
    let ok = h === et.empreinte && succ.length === et.n;
    let dmgKo = 0;
    if (ok) for (let i = 0; i < succ.length; i++) if (Math.abs(succ[i][1] - et.dmg[i]) > 1e-3) dmgKo++;
    if (!ok || dmgKo) {
      echecs++;
      if (echecs <= 5 || detail) {
        console.log(`ÉCHEC chaîne ${ic} (${ch.type}) étape ${ie} : ${!ok ? `successeurs différents (JS ${succ.length}, Python ${et.n})` : `${dmgKo} dégâts différents`}`);
        console.log(`  état : X ${et.etat.pos.X} M ${et.etat.pos.M}${et.etat.pos.K ? ` K ${et.etat.pos.K}` : ''} PA ${et.etat.pa} TF ${et.etat.tf}`);
      }
    }
  }
}
console.log(`${nEtats} états, ${nSucc} successeurs comparés au prototype Python.`);
console.log(echecs ? `${echecs} état(s) en échec.` : 'Portage identique au Python.');
process.exit(echecs ? 1 : 0);
