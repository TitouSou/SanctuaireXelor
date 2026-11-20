// Une recherche de combo, lancée par outils/pilote_voies.mjs dans un processus à part (pour le parallélisme).
// Usage :  node outils/tache_recherche.mjs <spec.json> <resultat.json>
// spec : { situation: 'T1_13'|…|'CAC_T2', stats, bannis: [sorts], beam, arme? (arme du moteur, moteur/armes.mjs) }
// résultat : { situation, degats, load, caseMonstre, actions, lignes, journal, duree, arme, coups }
//   arme : nom de l'arme si le combo frappe à l'arme (sinon null) ; coups : les coups d'arme (pour l'optimiseur).
import { readFileSync, writeFileSync } from 'node:fs';
import { SP } from '../moteur/sorts.mjs';
import { creerSimulateur, formaterLog } from '../moteur/simulateur.mjs';
import { SITUATIONS, departsSituation, departCombo, actionsDuJournal } from '../moteur/situations.mjs';

const [fSpec, fSortie] = process.argv.slice(2);
const spec = JSON.parse(readFileSync(fSpec, 'utf8'));
const sit = SITUATIONS[spec.situation];
const bannis = new Set([...(spec.bannis || []), 'Paradoxe', 'Faille', 'Glas']); // sans Cadran sur le plateau ; Glas : niveau 200
const sim = creerSimulateur({ stats: spec.stats, sorts: Object.keys(SP).filter((k) => !bannis.has(k)), opt: { tacle: !!sit.tacle }, arme: spec.arme || null });
const t0 = Date.now();
const best = sim.search(departsSituation(spec.situation), { beam: spec.beam || 4000 });
const caseMonstre = best.log[0].pos.M;
const actions = actionsDuJournal(best.log);
// Contrôle : le combo se rejoue à l'identique depuis son départ.
const rejoue = sim.rejouer(departCombo(spec.situation, caseMonstre), actions);
if (Math.abs(rejoue.dmg - best.dmg) > 1e-6) throw new Error(`Rejeu différent : ${rejoue.dmg} au lieu de ${best.dmg}`);
writeFileSync(fSortie, JSON.stringify({
  situation: spec.situation, degats: best.dmg, load: best.load, caseMonstre, actions,
  lignes: sim.lignesCombo(departCombo(spec.situation, caseMonstre), actions),
  paRestants: best.pa, journal: formaterLog(best.log), duree: (Date.now() - t0) / 1000,
  arme: best.log.some((l) => l.sort === 'Arme') ? spec.arme.nom : null,
  coups: best.log.filter((l) => l.sort === 'Arme').map((l) => l.coup),
}, null, 1));
