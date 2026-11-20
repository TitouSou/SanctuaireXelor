// Publie les résultats du pilote (outils/resultats/voies/<voie>.json) dans site/data/voies/, pour le site.
// Format 2 (18/11/2026, coup d'arme) : chaque stuff (Offensif, Équilibré) a ses combos, son corps à corps, son jeu de
// variantes et son arme (arme du moteur, moteur/armes.mjs). Un résultat encore au format 1 (un seul jeu de combos par
// voie) est converti : les deux stuffs reçoivent les mêmes combos.
// Terre-Feu est déjà vérifiée en jeu (docs/RESULTATS_REFERENCE.md) : pour chaque stuff et chaque situation, si le combo
// du pilote ne fait pas mieux que le combo vérifié (rejoué avec ce stuff), on publie le combo vérifié, dans l'ordre du
// joueur, avec le statut « vérifié en jeu ». S'il fait mieux, on publie le nouveau combo « simulé », et le combo
// vérifié reste à côté (verifieEnJeu), recalculé sur le même stuff.
// Usage :  node outils/publier_voies.mjs [--cible <dossier>]
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { creerSimulateur } from '../moteur/simulateur.mjs';
import { SITUATIONS, departCombo } from '../moteur/situations.mjs';
import { combo } from './degats.mjs';
import { SP } from '../moteur/sorts.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const iC = process.argv.indexOf('--cible'); // --cible <dossier> : publier ailleurs (essais)
const SOURCE = join(HERE, 'resultats', 'voies'), CIBLE = iC > 0 ? process.argv[iC + 1] : join(HERE, '..', 'site', 'data', 'voies');
mkdirSync(CIBLE, { recursive: true });
const PROFILS = ['offensif', 'equilibre'];

const S = (sort, cible = 'M') => ({ sort, cible });
// Combos Terre-Feu vérifiés en jeu (docs/RESULTATS_REFERENCE.md), dans l'ordre du joueur.
const VERIFIES_TERRE_FEU = {
  T1_13: { caseMonstre: [2, 0], actions: [S('Engrenage', [1, 0]), S('Sables'), S('Poussiere', [1, 0]), S('Sablier'), S('Rayon'), S('Souvenir'), S('Refraction')] },
  T1_12: { caseMonstre: [2, 0], actions: [S('Sablier'), S('Engrenage', [1, 0]), S('Sables'), S('Poussiere', [1, 0]), S('Refraction'), S('Souvenir'), S('Refraction')] },
  T2_22: { caseMonstre: [-4, 0], actions: [S('Poussiere', [-2, 0]), S('Sablier'), S('Rayon'), S('Sables'), S('Horloge'), S('Rouage', [-2, 0]),
    { marche: [-2, 0] }, S('Engrenage', [-1, 0]), S('Souvenir'), S('Refraction'), S('Frappe')] },
  T2_23: { caseMonstre: [-4, 0], actions: [S('Poussiere', [-2, 0]), S('Sablier'), S('Rayon'), S('Sables'), S('Horloge'), S('Rouage', [-2, 0]),
    { marche: [-2, 0] }, S('Engrenage', [-1, 0]), S('Souvenir'), S('Horloge'), S('Refraction')] },
  CAC_T1: { caseMonstre: [1, 0], actions: [S('EspaceTemps'), S('Sablier'), S('Engrenage', [1, 0]), S('Sables'), S('Poussiere', [1, 0]),
    S('Souvenir'), S('Refraction'), S('Refraction')] },
  CAC_T2: { caseMonstre: [1, 0], actions: [S('EspaceTemps'), S('Sablier'), S('Engrenage', [1, 0]), S('Rayon'), S('Horloge'), S('Sables'),
    S('Frappe'), S('Refraction'), S('Souvenir'), S('Poussiere', [1, 0]), S('Refraction')] },
};

// Format 1 → format 2 : les deux stuffs gardent les combos de la voie ; dégâts de chaque stuff sur ses combos.
function versFormat2(r) {
  if (r.format === 2) return r;
  const parStuff = (g) => Object.fromEntries(PROFILS.map((p) => [p, Object.fromEntries(Object.entries(r[g]).map(([k, f]) =>
    [k, { ...f, arme: null, coups: [], degats: { [p]: f.degats[p] } }]))]));
  return { ...r, format: 2, armes: { offensif: null, equilibre: null }, variantes: { offensif: r.variantes, equilibre: r.variantes },
    combos: parStuff('combos'), corpsACorps: parStuff('corpsACorps') };
}

for (const f of readdirSync(SOURCE).filter((x) => x.endsWith('.json'))) {
  const r = versFormat2(JSON.parse(readFileSync(join(SOURCE, f), 'utf8')));
  delete r.avantArme; // état d'avant le coup d'arme : gardé dans outils/resultats seulement
  for (const p of PROFILS) for (const g of ['combos', 'corpsACorps']) for (const f2 of Object.values(r[g][p])) { f2.statut = 'simulé'; delete f2.verifieEnJeu; }
  if (r.voie === 'terre-feu') {
    // Un seul jeu de variantes par stuff : on compare des jeux entiers. Les 4 combos T1 / T2 du pilote remplacent les
    // combos vérifiés seulement si leur moyenne fait mieux ; le corps à corps du pilote remplace le combo vérifié s'il
    // fait mieux et reste dans le jeu de variantes publié.
    let tousVerifies = true;
    const variantesDe = (actions) => Object.fromEntries(actions.filter((a) => a.sort && SP[a.sort]).map((a) => [SP[a.sort].p, a.sort]));
    const compatibles = (a, b) => Object.entries(a).every(([P, s]) => !b[P] || b[P] === s);
    for (const p of PROFILS) {
      const stats = r.stuffs[p].stats, arme = r.armes[p];
      const refs = Object.fromEntries(Object.entries(VERIFIES_TERRE_FEU).map(([cle, v]) => {
        const sim = creerSimulateur({ stats, opt: { tacle: !!SITUATIONS[cle].tacle } });
        const s = sim.rejouer(departCombo(cle, v.caseMonstre), v.actions);
        const ref = { caseMonstre: v.caseMonstre, actions: v.actions, degats: { [p]: Math.round(s.dmg) }, statut: 'vérifié en jeu',
          lignes: sim.lignesCombo(departCombo(cle, v.caseMonstre), v.actions), paRestants: s.pa, arme: null, coups: [] };
        if (Math.abs(combo(ref.lignes, stats, null, arme) - s.dmg) > 1e-6) throw new Error(`Terre-Feu ${p} ${cle} : lignes incohérentes`);
        return [cle, ref];
      }));
      const score = ['T1_13', 'T1_12', 'T2_22', 'T2_23'];
      const moy = (get) => score.reduce((a, k) => a + get(k), 0) / score.length;
      const nouveauJeu = moy((k) => r.combos[p][k].degats[p]) > moy((k) => refs[k].degats[p]) + 1;
      let variantes = {};
      for (const cle of score) {
        const f2 = r.combos[p][cle];
        if (nouveauJeu) f2.verifieEnJeu = refs[cle]; // combo vérifié gardé à côté, pour comparer
        else Object.assign(f2, refs[cle], { journal: undefined, trouveAvec: 'vérifié en jeu par le joueur' });
        variantes = { ...variantes, ...variantesDe(f2.actions) };
      }
      if (nouveauJeu) { tousVerifies = false; console.log(`Terre-Feu ${p} : nouveaux combos T1 / T2 ${Math.round(moy((k) => r.combos[p][k].degats[p]))} contre ${Math.round(moy((k) => refs[k].degats[p]))} (vérifiés en jeu)`); }
      for (const cle of ['CAC_T1', 'CAC_T2']) {
        const f2 = r.corpsACorps[p][cle], ref = refs[cle];
        if (f2.degats[p] > ref.degats[p] + 1 && compatibles(variantesDe(f2.actions), variantes)) {
          f2.verifieEnJeu = ref; tousVerifies = false;
          console.log(`Terre-Feu ${p} ${cle} : nouveau combo ${f2.degats[p]}${f2.arme ? ` (coup d'arme : ${f2.arme})` : ''} contre ${ref.degats[p]} (vérifié en jeu)`);
        } else Object.assign(f2, ref, { journal: undefined, trouveAvec: 'vérifié en jeu par le joueur' });
        variantes = { ...variantes, ...variantesDe(r.corpsACorps[p][cle].actions) };
      }
      r.variantes[p] = variantes;
    }
    r.statut = tousVerifies ? 'vérifié en jeu' : 'simulé (de nouveaux combos font mieux que ceux vérifiés en jeu, à tester)';
    // Variantes et moyennes recalculées sur les combos publiés.
    for (const p of PROFILS) {
      const sits = Object.keys(r.combos[p]);
      r.moyenne[p] = Math.round(sits.reduce((a, k) => a + r.combos[p][k].degats[p], 0) / sits.length);
      r.stuffs[p] = { ...r.stuffs[p], score: r.moyenne[p], combos: Object.fromEntries(sits.map((k) => [k, r.combos[p][k].degats[p]])) };
    }
  }
  writeFileSync(join(CIBLE, f), JSON.stringify(r, null, 1) + '\n');
  console.log(`Publié : ${join(CIBLE, f)}`);
}
