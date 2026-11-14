// Publie les résultats du pilote (outils/resultats/voies/<voie>.json) dans site/data/voies/, pour le site.
// Terre-Feu est déjà vérifiée en jeu (docs/RESULTATS_REFERENCE.md) : on publie ses combos dans l'ordre vérifié par le
// joueur, avec le statut « vérifié en jeu », après avoir contrôlé qu'ils donnent les mêmes dégâts que ceux du pilote.
// Usage :  node outils/publier_voies.mjs
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { creerSimulateur } from '../moteur/simulateur.mjs';
import { SITUATIONS, departCombo } from '../moteur/situations.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, 'resultats', 'voies'), CIBLE = join(HERE, '..', 'site', 'data', 'voies');
mkdirSync(CIBLE, { recursive: true });

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

let erreurs = 0;
for (const f of readdirSync(SOURCE).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(join(SOURCE, f), 'utf8'));
  for (const g of ['combos', 'corpsACorps']) for (const f2 of Object.values(r[g])) f2.statut = 'simulé';
  if (r.voie === 'terre-feu') {
    r.statut = 'vérifié en jeu';
    for (const [cle, v] of Object.entries(VERIFIES_TERRE_FEU)) {
      const g = cle.startsWith('CAC') ? 'corpsACorps' : 'combos', f2 = r[g][cle];
      for (const st of ['offensif', 'equilibre']) {
        const sim = creerSimulateur({ stats: r.stuffs[st].stats, opt: { tacle: !!SITUATIONS[cle].tacle } });
        const s = sim.rejouer(departCombo(cle, v.caseMonstre), v.actions);
        if (Math.abs(s.dmg - f2.degats[st]) > 1) { erreurs++; console.log(`ÉCHEC  Terre-Feu ${cle} ${st} : ${Math.round(s.dmg)} au lieu de ${f2.degats[st]}`); }
        if (st === 'offensif') { f2.lignes = sim.lignesCombo(departCombo(cle, v.caseMonstre), v.actions); f2.paRestants = s.pa; }
      }
      Object.assign(f2, { caseMonstre: v.caseMonstre, actions: v.actions, statut: 'vérifié en jeu', journal: undefined, trouveAvec: 'vérifié en jeu par le joueur' });
    }
  }
  writeFileSync(join(CIBLE, f), JSON.stringify(r, null, 1) + '\n');
  console.log(`Publié : site/data/voies/${f}`);
}
if (erreurs) { console.log(`${erreurs} échec(s) : rien n'est garanti pour Terre-Feu`); process.exit(1); }
