// Page « Stuffs » : le stuff Offensif ou Équilibré de chaque voie, objet par objet.
import { $, nf, echap, entete, lire, garder, charger, statutHTML, pastillesElements } from './commun.js';

entete('stuffs.html');
const SLOT = { coiffe: 'Coiffe', amulette: 'Amulette', anneau1: 'Anneau', anneau2: 'Anneau', ceinture: 'Ceinture', bottes: 'Bottes', cape: 'Cape',
  arme: 'Arme', bouclier: 'Bouclier', familier: 'Familier', dofus1: 'Dofus / trophée', dofus2: 'Dofus / trophée', dofus3: 'Dofus / trophée',
  dofus4: 'Dofus / trophée', dofus5: 'Dofus / trophée', dofus6: 'Dofus / trophée' };
const CARAC = { fo: 'Force', int: 'Intelligence', cha: 'Chance', agi: 'Agilité' };
const NOM_PROFIL = { offensif: 'Offensif', equilibre: 'Équilibré' };
const TEXTE_PROFIL = {
  offensif: 'Le plus de dégâts possible sur les combos de la voie, sans contrainte de vie.',
  equilibre: 'Au moins 3 000 PV et 1 de portée, en perdant le moins de dégâts possible.',
};
const FAMILLES = [['bi', 'Bi-éléments'], ['mono', 'Mono'], ['multi', 'Multi']];

const params = new URLSearchParams(location.search);
let IDX, OBJ, V, voie = params.get('v') || lire('voie', 'terre-feu'), profil = params.get('p') || lire('stuff', 'offensif');
const cache = new Map();

async function init() {
  [IDX, OBJ] = await Promise.all([charger('data/index.json'), charger('data/objets.json')]);
  if (!IDX.voies.some((v) => v.id === voie)) voie = 'terre-feu';
  if (!NOM_PROFIL[profil]) profil = 'offensif';
  $('voies').innerHTML = FAMILLES.map(([f, nom]) => `<div class="groupe-voies"><span class="muted">${nom}</span><div class="bascule petite" role="group" aria-label="Voies ${nom}">${
    IDX.voies.filter((v) => v.famille === f).map((v) => `<button data-voie="${v.id}">${pastillesElements(v.elements)} ${echap(v.nom)}</button>`).join('')}</div></div>`).join('');
  $('voies').querySelectorAll('[data-voie]').forEach((b) => b.addEventListener('click', () => { voie = b.dataset.voie; maj(); }));
  document.querySelectorAll('[data-profil]').forEach((b) => b.addEventListener('click', () => { profil = b.dataset.profil; maj(); }));
  await maj();
}

async function maj() {
  garder('voie', voie); garder('stuff', profil);
  const url = new URL(location.href); url.searchParams.set('v', voie); url.searchParams.set('p', profil); history.replaceState(null, '', url);
  $('voies').querySelectorAll('[data-voie]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.voie === voie)));
  document.querySelectorAll('[data-profil]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.profil === profil)));
  $('profilTexte').textContent = TEXTE_PROFIL[profil];
  if (!cache.has(voie)) cache.set(voie, await charger(`data/voies/${voie}.json`));
  V = cache.get(voie);
  const info = IDX.voies.find((v) => v.id === voie), st = V.stuffs[profil], autre = V.stuffs[profil === 'offensif' ? 'equilibre' : 'offensif'];
  document.title = `Stuff ${NOM_PROFIL[profil]} ${info.nom} · Sanctuaire Xélor`;
  $('titre').textContent = `${info.nom} · ${NOM_PROFIL[profil]}`;
  $('elements').innerHTML = pastillesElements(V.elements);
  $('statut').innerHTML = statutHTML(V.statut);
  $('lienCombos').href = `voie.html?v=${voie}`;
  $('lienCombos').onclick = () => garder('stuff', profil);
  const s = st.stats;
  const cle = (k, v, sous = '') => `<div class="cle"><div class="k">${k}</div><div class="v">${v}</div>${sous ? `<div class="s">${sous}</div>` : ''}</div>`;
  $('cles').innerHTML = [
    cle('Dégâts moyens', nf(st.score), 'moyenne des 4 combos'),
    cle('Points de vie', nf(st.pv)),
    cle('PA / PM', `${st.pa} / ${st.pm}`, 'Ocre : +1 PA en début de tour'),
    cle('Portée', `${st.po >= 0 ? '+' : ''}${st.po}`),
    cle('Critique', `${s.crit} %`, `${s.doCrit} Do crit`),
    cle('Puissance', nf(s.pui), `+${s.sorts} % aux sorts`),
  ].join('');
  const ecart = st.score - autre.score, ecartPV = st.pv - autre.pv;
  const diff = Object.keys(st.objets).filter((k) => st.objets[k] !== autre.objets[k]);
  const nomAutre = NOM_PROFIL[profil === 'offensif' ? 'equilibre' : 'offensif'];
  const memesPoints = Object.keys(CARAC).every((k) => (st.points[k] || 0) === (autre.points[k] || 0));
  $('comparaison').innerHTML = !diff.length && memesPoints
    ? `<p><b>Offensif et Équilibré sont identiques pour cette voie</b> : le stuff qui fait le plus de dégâts a déjà au moins 3 000 PV et 1 de portée.</p>
      <p class="muted" style="font-size:13.5px">Combos avec ce stuff : T1 13 PA ${nf(st.combos.T1_13)} · T1 12 PA ${nf(st.combos.T1_12)} · T2 22 PA ${nf(st.combos.T2_22)} · T2 23 PA ${nf(st.combos.T2_23)}.</p>`
    : `<p><b>Par rapport à l'${nomAutre}</b> : ${ecart >= 0 ? '+' : ''}${nf(ecart)} dégâts moyens (${ecart >= 0 ? '+' : ''}${((st.score / autre.score - 1) * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %), ${ecartPV >= 0 ? '+' : ''}${nf(ecartPV)} PV, portée ${st.po - autre.po >= 0 ? '+' : ''}${st.po - autre.po}. ${
    diff.length ? `${diff.length} emplacement${diff.length > 1 ? 's' : ''} change${diff.length > 1 ? 'nt' : ''} (marqué${diff.length > 1 ? 's' : ''} ◆ ci-dessous).` : 'Mêmes objets : seule la répartition des points change.'}</p>
    <p class="muted" style="font-size:13.5px">Combos avec ce stuff : T1 13 PA ${nf(st.combos.T1_13)} · T1 12 PA ${nf(st.combos.T1_12)} · T2 22 PA ${nf(st.combos.T2_22)} · T2 23 PA ${nf(st.combos.T2_23)}.</p>`;
  const carte = (k) => {
    const n = st.objets[k], o = OBJ.objets[n];
    if (!n) return '';
    const change = diff.includes(k);
    return `<article class="objet${change ? ' change' : ''}">
      <div class="objet-tete"><span class="slot">${SLOT[k]}${change ? ` <span class="marque-change" title="Différent dans le stuff ${nomAutre}">◆</span>` : ''}</span><span class="muted num">niv. ${o ? o.niveau : '?'}</span></div>
      <a class="objet-nom" href="https://dofusdb.fr/fr/database/item/${o ? o.id : ''}" target="_blank" rel="noopener">${echap(n)}</a>
      <span class="muted" style="font-size:12.5px">${o ? echap(o.type) : ''}${o && o.panoplie ? ` · <span class="tag-pano">${echap(o.panoplie.replace(/^Panoplie (de la |de l'|des |du |de |d')?/, ''))}</span>` : ''}</span>
      ${change ? `<span class="muted" style="font-size:12.5px">${nomAutre} : ${echap(autre.objets[k] || '—')}</span>` : ''}
      ${o ? `<details class="effets"><summary>Effets au jet max</summary><ul>${o.effets.map((e) => `<li class="${e.startsWith('-') ? 'malus' : ''}">${echap(e)}</li>`).join('')}</ul></details>` : ''}
    </article>`;
  };
  const slots = Object.keys(st.objets);
  $('equipement').innerHTML = slots.filter((k) => !k.startsWith('dofus')).map(carte).join('');
  $('dofus').innerHTML = slots.filter((k) => k.startsWith('dofus')).map(carte).join('');
  const pts = Object.entries(st.points).filter(([, v]) => v).map(([k, v]) => `${v} en ${CARAC[k]}`).join(', ');
  $('caracs').innerHTML = [
    `<li><b>Points :</b> ${pts}, plus les parchemins 100 partout</li>`,
    `<li><b>Force</b> ${nf(s.fo)} · <b>Intelligence</b> ${nf(s.int)} · <b>Chance</b> ${nf(s.cha)} · <b>Agilité</b> ${nf(s.agi)}</li>`,
    `<li><b>Dommages</b> : Terre ${s.doT}, Feu ${s.doF}, Eau ${s.doE}, Air ${s.doA}, Neutre ${s.doN}</li>`,
    `<li><b>Critique</b> ${s.crit} %, <b>Do crit</b> ${s.doCrit}, <b>dommages aux sorts</b> +${s.sorts} %</li>`,
    st.ecartElements && st.ecartElements.includes('/') ? `<li><b>Équilibre entre éléments</b> : ${echap(st.ecartElements)}</li>` : '',
  ].join('');
  $('panoplies').innerHTML = st.panoplies.length ? st.panoplies.map((p) => {
    const [, nom, nb] = /^(.*) (\d+)$/.exec(p), b = OBJ.panoplies[nom]?.bonus[nb] || [];
    return `<div><b>${echap(nom)}</b> <span class="muted">(${nb} objets)</span><div class="muted" style="font-size:13.5px">${b.map(echap).join(' · ') || 'aucun bonus'}</div></div>`;
  }).join('') : '<p class="muted" style="margin:0">Aucune panoplie active.</p>';
}

init().catch((e) => { $('titre').textContent = e.message; });
