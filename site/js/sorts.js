// Page « Dégâts des sorts » : chaque sort avec le stuff et les résistances choisis, et la Synchro par niveau.
import { $, nf, echap, entete, lire, garder, charger, ligne, panneauResist, NOM_EL, COULEUR_EL } from './commun.js';
import { degatsSynchro } from './formule.mjs';

entete('sorts.html');
// Lignes affichées : chaque sort, puis ses bonus de base (Horloge sur cible en Téléfrag, Rayon Obscur par Téléfrag touché).
const LIGNES = [
  ...['Frappe', 'Pendule', 'Perturbation', 'Rouage', 'Souvenir', 'Permutation', 'Aiguille', 'Fletrissement', 'Refraction', 'Regulateur',
    'Poussiere', 'Gelure', 'Sablier', 'Ralentissement', 'Engrenage', 'CompteGoutte', 'Sables', 'Distorsion', 'Rayon', 'Dessechement',
    'Petrification', 'Gousset', 'Horloge', 'Clepsydre'].map((k) => [k, 0]),
  ['Horloge', 24, 'Horloge, cible en Téléfrag (+24 de base)'],
  ['Rayon', 12, 'Rayon Obscur, 1 Téléfrag dans la ligne (+12)'],
  ['Rayon', 24, 'Rayon Obscur, 2 Téléfrags dans la ligne (+24)'],
  ['SablierBoom', 0, 'Explosion du Sablier (2e Téléfrag consommé)'],
  ['GoussetDiffere', 0, 'Gousset, dégâts différés au centre (hors burst)'],
];
const ORDRE_EL = { T: 0, F: 1, E: 2, A: 3 };

let SORTS, SYN, idx, V, resist, stuff = lire('stuff', 'offensif');
const voieChoisie = () => $('voie').value;

async function init() {
  const [sd, ix] = await Promise.all([charger('data/sorts.json'), charger('data/index.json')]);
  SORTS = sd.sorts; SYN = sd.synchro; idx = ix;
  $('voie').innerHTML = idx.voies.map((v) => `<option value="${v.id}">${echap(v.nom)}</option>`).join('');
  $('voie').value = lire('voieSorts', 'terre-feu');
  if (!$('voie').value) $('voie').value = idx.voies[0].id;
  $('voie').addEventListener('change', async () => { garder('voieSorts', voieChoisie()); await chargerVoie(); });
  document.querySelectorAll('[data-stuff]').forEach((b) => b.addEventListener('click', () => { stuff = b.dataset.stuff; garder('stuff', stuff); maj(); }));
  resist = panneauResist($('resist'), (r) => { resist = r; maj(); }, { ouvert: false })();
  await chargerVoie();
}
async function chargerVoie() { V = await charger(`data/voies/${voieChoisie()}.json`); maj(); }

function maj() {
  if (!['offensif', 'equilibre'].includes(stuff)) stuff = 'offensif';
  document.querySelectorAll('[data-stuff]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.stuff === stuff)));
  const st = V.stuffs[stuff], s = st.stats;
  $('resumeStuff').textContent = `${nf(st.pv)} PV · ${s.crit} % crit · ${s.doCrit} Do crit · +${s.sorts} % aux sorts`;
  const lignes = LIGNES.map(([k, extra, nom]) => ({ k, extra, nomAff: nom, ...ligne(SORTS, `${k}|${extra}`, s, resist), d: SORTS[k] }))
    .sort((a, b) => (ORDRE_EL[a.el] - ORDRE_EL[b.el]) || (a.extra ? 1 : 0) - (b.extra ? 1 : 0) || a.nom.localeCompare(b.nom, 'fr'));
  $('lignes').innerHTML = lignes.map((l) => `<tr><td><b>${echap(l.nomAff || l.nom)}</b></td>
    <td><span style="display:inline-flex;align-items:center;gap:6px"><span class="el el-${l.el}">${NOM_EL[l.el][0]}</span>${NOM_EL[l.el]}</span></td>
    <td class="n">${l.d.pa || '–'}</td><td class="n">${((l.d.n[0] + l.d.n[1]) / 2 + l.extra).toLocaleString('fr-FR')}</td>
    <td class="n">${nf(l.normal)}</td><td class="n">${nf(l.crit)}</td><td class="n">${Math.round(l.cc * 100)} %</td>
    <td class="n"><b style="color:${COULEUR_EL[l.el]}">${nf(l.moyenne)}</b></td></tr>`).join('');
  $('synchroLignes').innerHTML = SYN.map((d, k) => `<tr><td>Niveau ${k + 1}</td><td class="n">${nf(d)}</td><td class="n"><b style="color:var(--air)">${nf(degatsSynchro(k + 1, resist))}</b></td></tr>`).join('');
}

init().catch((e) => { $('lignes').innerHTML = `<tr><td colspan="8">${echap(e.message)}</td></tr>`; });
