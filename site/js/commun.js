// Outils communs aux pages du site : en-tête, préférences du visiteur, résistances, formats.
import { degatsLigne } from './formule.mjs';
import { degatsLigneArme, puissanceMaitrise, degatsPoussee } from './armes.mjs';

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
// Mention de crédits (décidée le 20/11/2026 : site public avec crédits Ankama), en pied de toutes les pages.
export const CREDITS = "Sanctuaire Xélor est un site de fan non officiel, sans lien avec Ankama Games. Dofus, ses noms et ses visuels, dont les images des objets, sont la propriété d'Ankama Games. Images et données des objets : DofusDB. Site sans but commercial (ni publicité ni dons) ; les visuels seront retirés si Ankama le demande.";
export function entete(actif) {
  const h = document.getElementById('entete');
  if (!h) return;
  h.className = 'entete';
  h.innerHTML = `<a class="marque" href="index.html">${LOGO}<span>Sanctuaire Xélor</span></a>
  <nav class="nav" aria-label="Navigation">${PAGES.map(([u, t]) => `<a href="${u}"${u === actif ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>`;
  // Le pied de page suit l'en-tête : toutes les pages qui ont l'en-tête ont aussi les crédits.
  if (h.parentElement && !document.querySelector('footer.pied')) h.parentElement.insertAdjacentHTML('beforeend', `<footer class="pied"><p>${echap(CREDITS)}</p></footer>`);
}

// ---------- Sprites des objets ----------
// Sprite officiel d'un objet (adresse DofusDB gardée dans site/data/objets.json), en carré de `taille` px.
// Si l'adresse manque ou si l'image ne se charge pas : une case vide en pointillés laiton, de même taille.
export function spriteObjet(img, taille) {
  return img
    ? `<span class="sprite" style="--t:${taille}px"><img src="${echap(img)}" alt="" width="${taille}" height="${taille}" loading="lazy" decoding="async"></span>`
    : `<span class="sprite vide" style="--t:${taille}px"></span>`;
}
// Une image en échec est remplacée par la case vide (l'événement « error » ne remonte pas : on l'écoute en capture).
document.addEventListener('error', (e) => {
  const img = e.target;
  if (img instanceof HTMLImageElement && img.parentElement?.classList.contains('sprite')) { img.parentElement.classList.add('vide'); img.remove(); }
}, true);

// ---------- Infobulle des objets (20/11/2026) ----------
// Au survol d'un élément [data-objet="<nom>"] (ou au focus clavier, ou au toucher sur mobile) : les effets de l'objet
// au jet max, tels que site/data/objets.json les donne. `objets` = la table « objets » de ce fichier.
export function activerInfobulles(objets) {
  let bulle = document.getElementById('infobulle-objet'), cible = null;
  if (!bulle) {
    bulle = document.createElement('div');
    bulle.id = 'infobulle-objet'; bulle.className = 'infobulle'; bulle.setAttribute('role', 'tooltip'); bulle.hidden = true;
    document.body.appendChild(bulle);
  }
  const placer = () => {
    const r = cible.getBoundingClientRect(), b = bulle.getBoundingClientRect(), marge = 8;
    let x = Math.min(Math.max(marge, r.left), innerWidth - b.width - marge);
    let y = r.bottom + 6;
    if (y + b.height > innerHeight - marge && r.top - 6 - b.height > marge) y = r.top - 6 - b.height; // pas de place dessous : au-dessus
    bulle.style.left = `${Math.max(marge, x) + scrollX}px`; bulle.style.top = `${y + scrollY}px`;
  };
  const montrer = (el) => {
    const n = el.dataset.objet, o = objets[n];
    if (!o) return;
    cible = el; el.setAttribute('aria-describedby', bulle.id);
    bulle.innerHTML = `<div class="ib-tete">${spriteObjet(o.img, 40)}<div><b>${echap(n)}</b><div class="muted">niv. ${o.niveau} · ${echap(o.type)}${o.panoplie ? ` · <span class="tag-pano">${echap(o.panoplie)}</span>` : ''}</div></div></div>
      <ul>${o.effets.map((e) => `<li class="${e.startsWith('-') ? 'malus' : ''}">${echap(e)}</li>`).join('')}</ul>
      <div class="ib-pied">Effets au jet max</div>`;
    bulle.hidden = false; placer();
  };
  const cacher = () => { if (cible) cible.removeAttribute('aria-describedby'); cible = null; bulle.hidden = true; };
  const trouver = (e) => e.target instanceof Element ? e.target.closest('[data-objet]') : null;
  // Souris : survol. Le toucher (pointerType « touch ») passe par le clic ci-dessous.
  document.addEventListener('pointerover', (e) => { const el = trouver(e); if (e.pointerType === 'mouse' && el && el !== cible) montrer(el); });
  document.addEventListener('pointerout', (e) => { const el = trouver(e); if (e.pointerType === 'mouse' && el && el === cible && !el.contains(e.relatedTarget)) cacher(); });
  // Clavier : focus (seulement le focus visible : un toucher donne aussi le focus, il est traité par le clic).
  document.addEventListener('focusin', (e) => { const el = trouver(e); if (el && e.target.matches(':focus-visible')) montrer(el); });
  document.addEventListener('focusout', (e) => { const el = trouver(e); if (el && el === cible && !el.contains(e.relatedTarget)) cacher(); });
  // Toucher : un appui ouvre ou ferme l'infobulle ; un appui ailleurs la ferme.
  document.addEventListener('click', (e) => {
    const el = trouver(e);
    if (el && e.pointerType !== 'mouse' && !e.target.closest('a')) { if (el === cible) cacher(); else montrer(el); }
    else if (!el && !bulle.contains(e.target)) cacher();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cacher(); });
  addEventListener('resize', () => { if (cible) placer(); });
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
// Coup d'arme (18/11/2026) : « Arme|<contact par ligne>|<Maîtrise d'Arme> », calculé avec l'arme du stuff (js/armes.mjs,
// copie de moteur/armes.mjs) ; « Poussee|k » : dommages de poussée.
export function ligne(sorts, cle, stats, resist, arme = null) {
  const [nom, extra, m] = cle.split('|');
  if (nom === 'Arme') {
    const pArme = m === '1' ? puissanceMaitrise(stats) : 0, lignes = arme.effets.filter((e) => e.type === 'degats');
    const parLigne = lignes.map((e, i) => degatsLigneArme(e, arme, stats, { melee: (extra.length === lignes.length ? extra[i] : extra[0]) === '1', pArme, resist }));
    const somme = (k) => parLigne.reduce((a, x) => a + x[k], 0);
    const cc = arme.cc > 0 ? Math.min(100, arme.cc + (stats.crit || 0)) / 100 : 0;
    return { nom: `Coup d'arme (${arme.nom})${m === '1' ? " avec Maîtrise d'Arme" : ''}`, el: parLigne[0]?.el || 'N', extra: 0,
      normal: somme('normal'), crit: somme('crit'), moyenne: somme('moyenne'), cc };
  }
  if (nom === 'Poussee') { const v = degatsPoussee(stats, +extra); return { nom: 'Dommages de poussée', el: 'N', extra: 0, normal: v, crit: v, moyenne: v, cc: 0 }; }
  const d = sorts[nom];
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
