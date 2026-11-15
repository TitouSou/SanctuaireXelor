// Outils communs aux pages du site : en-tête, préférences du visiteur, résistances, formats.
import { degatsLigne } from './formule.mjs';

export const $ = (id) => document.getElementById(id);
export const nf = (x) => Math.round(x).toLocaleString('fr-FR');
export const NOM_EL = { T: 'Terre', F: 'Feu', E: 'Eau', A: 'Air', N: 'Neutre' };
export const COULEUR_EL = { T: 'var(--terre)', F: 'var(--feu)', E: 'var(--eau)', A: 'var(--air)', N: 'var(--neutre)' };
export const pastillesElements = (els) => `<span class="elements">${els.map((e) => `<span class="el el-${e}" title="${NOM_EL[e]}">${NOM_EL[e][0]}</span>`).join('')}</span>`;
export const echap = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Logo fait maison : un cadran d'horloge et un sablier.
export const LOGO = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="none" stroke="var(--brass)" stroke-width="2.4"/>
<circle cx="20" cy="20" r="13.5" fill="none" stroke="var(--brass)" stroke-width="1" stroke-dasharray="1.2 3.1"/>
<path d="M14 11h12M14 29h12M15.5 11c0 5 9 5 9 9s-9 4-9 9M24.5 11c0 5-9 5-9 9s9 4 9 9" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round"/>
<path d="M17.5 27.2c1.2-1.6 3.8-1.6 5 0z" fill="var(--brass)"/></svg>`;

const PAGES = [['index.html', 'Accueil'], ['stuffs.html', 'Stuffs'], ['setup.html', 'Set-up'], ['sorts.html', 'Dégâts des sorts'], ['mecaniques.html', 'Mécaniques']];
export function entete(actif) {
  const h = document.getElementById('entete');
  if (!h) return;
  h.className = 'entete';
  h.innerHTML = `<a class="marque" href="index.html">${LOGO}<span>Sanctuaire Xélor</span></a>
  <nav class="nav" aria-label="Navigation">${PAGES.map(([u, t]) => `<a href="${u}"${u === actif ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>`;
}

// Préférences du visiteur (dans son navigateur seulement). Le site marche sans.
export function lire(cle, defaut) { try { const v = localStorage.getItem('xelor.' + cle); return v === null ? defaut : JSON.parse(v); } catch { return defaut; } }
export function garder(cle, v) { try { localStorage.setItem('xelor.' + cle, JSON.stringify(v)); } catch { /* navigation privée */ } }

export async function charger(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Impossible de charger ${url} (${r.status})`);
  return r.json();
}

export function statutHTML(statut) {
  const v = /vérifié en jeu/.test(statut || '') && !/simulé/.test(statut || '');
  return `<span class="statut ${v ? 'verifie' : 'simule'}">${v ? 'vérifié en jeu' : 'simulé'}</span>`;
}

// ---------- Dégâts ----------
// Une ligne « Sort|bonus » de la table site/data/sorts.json, calculée avec le stuff et les résistances choisis.
export function ligne(sorts, cle, stats, resist) {
  const [nom, extra] = cle.split('|'), d = sorts[nom];
  return { nom: d.nom, el: d.el, extra: +extra || 0, ...degatsLigne(d.el, d.n, d.c, d.cb, stats, { extra: +extra || 0, resist }) };
}

// ---------- Résistances du monstre ----------
// Réglables partout (CLAUDE.md) : % et fixe par élément. Ordre validé : fixe, puis %.
const ELS = ['T', 'F', 'E', 'A', 'N'];
export const resistVide = () => Object.fromEntries(ELS.map((e) => [e, { pct: 0, fixe: 0 }]));
export function lireResist() {
  const r = lire('resist', null), v = resistVide();
  if (r) for (const e of ELS) if (r[e]) v[e] = { pct: +r[e].pct || 0, fixe: +r[e].fixe || 0 };
  return v;
}
export const resistActive = (r) => ELS.some((e) => r[e].pct || r[e].fixe);
export const texteResist = (r) => resistActive(r)
  ? ELS.filter((e) => r[e].pct || r[e].fixe).map((e) => `${NOM_EL[e]} ${r[e].pct} %${r[e].fixe ? ` / ${r[e].fixe}` : ''}`).join(' · ')
  : 'aucune';

// Panneau repliable de saisie des résistances, dans `conteneur`. surChangement(resist) à chaque saisie.
export function panneauResist(conteneur, surChangement, { elements = ELS, ouvert = false, titre = 'Résistances du monstre' } = {}) {
  let r = lireResist();
  conteneur.innerHTML = `<details class="repli resist"${ouvert ? ' open' : ''}><summary><span><span class="eyebrow">${titre}</span><br><span class="muted" data-resume></span></span></summary>
  <div class="resist-grille" style="grid-template-columns:auto repeat(${elements.length},minmax(0,1fr))">
    <span></span>${elements.map((e) => `<span class="tete"><span class="el el-${e}">${NOM_EL[e][0]}</span>${NOM_EL[e]}</span>`).join('')}
    <span class="lab">%</span>${elements.map((e) => `<input type="number" step="1" min="-100" max="100" data-e="${e}" data-k="pct" aria-label="Résistance ${NOM_EL[e]} en %">`).join('')}
    <span class="lab">Fixe</span>${elements.map((e) => `<input type="number" step="1" data-e="${e}" data-k="fixe" aria-label="Résistance ${NOM_EL[e]} fixe">`).join('')}
  </div>
  <div class="resist-pied"><span>La résistance fixe est retirée d'abord, puis le % s'applique. Un % négatif est une faiblesse.</span><button type="button" class="btn lien" data-zero>Tout remettre à 0</button></div></details>`;
  const champs = [...conteneur.querySelectorAll('input')];
  const resume = conteneur.querySelector('[data-resume]');
  const afficher = () => {
    for (const c of champs) c.value = r[c.dataset.e][c.dataset.k];
    const sous = { ...resistVide() }; for (const e of elements) sous[e] = r[e];
    resume.textContent = texteResist(sous);
  };
  champs.forEach((c) => c.addEventListener('input', () => {
    const v = c.value === '' ? 0 : Number(c.value);
    if (!Number.isFinite(v)) return;
    r[c.dataset.e][c.dataset.k] = v; garder('resist', r);
    const sous = { ...resistVide() }; for (const e of elements) sous[e] = r[e];
    resume.textContent = texteResist(sous);
    surChangement(r);
  }));
  conteneur.querySelector('[data-zero]').addEventListener('click', () => { r = resistVide(); garder('resist', r); afficher(); surChangement(r); });
  afficher();
  return () => r;
}
