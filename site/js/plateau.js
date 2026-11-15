// Plateau de combat : vue Dofus (losanges à 45°) ou vue plate. Visuels faits maison uniquement.
// Coordonnées du moteur : x vers la droite, y vers le bas ; le Xélor part de (0,0).
import { lire, garder } from './commun.js';

const NOMS = { X: 'X', M: 'M', K: 'C' };
const ICONES = {
  sab: '<svg viewBox="0 0 20 26" aria-label="Sablier"><path d="M3 2h14M3 24h14M5 2c0 7 10 7 10 11S5 18 5 24M15 2c0 7-10 7-10 11s10 5 10 11" fill="none" stroke="var(--feu)" stroke-width="2.6" stroke-linecap="round"/></svg>',
  aig: '<svg viewBox="0 0 20 26" aria-label="Aiguille"><path d="M5 23 15 3" stroke="var(--terre)" stroke-width="2.6" stroke-linecap="round"/><circle cx="14" cy="5" r="2.2" fill="none" stroke="var(--terre)" stroke-width="1.6"/></svg>',
  et: '<svg viewBox="0 0 22 22" aria-label="Espace-temps"><circle cx="11" cy="11" r="8.5" fill="none" stroke="var(--violet)" stroke-width="2.2"/><path d="M11 6v5l3.5 2.5" fill="none" stroke="var(--violet)" stroke-width="2.2" stroke-linecap="round"/></svg>',
};

export function creerPlateau(conteneur, { entites = ['X', 'M'] } = {}) {
  conteneur.innerHTML = `<div class="plateau-haut">
      <div class="bascule petite" role="group" aria-label="Vue du plateau"><button data-vue="iso">Vue Dofus</button><button data-vue="plate">Vue plate</button></div>
      <div class="legende">
        <span><i class="pastille" style="background:var(--x)"></i>X le Xélor</span>
        ${entites.includes('M') ? '<span><i class="pastille" style="background:var(--m)"></i>M le monstre</span>' : ''}
        ${entites.includes('K') ? '<span><i class="pastille" style="background:var(--c)"></i>C le Cadran</span>' : ''}
        <span><i class="anneau"></i>Téléfrag</span>
        <span><i class="fantome"></i>Position précédente</span>
      </div>
    </div>
    <div class="arene"><div class="couche"><div class="cases"></div>
      <svg class="fleches" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="pointe-${entites.join('')}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--violet)"/></marker></defs><g></g></svg>
      ${entites.map((e) => `<div class="pion prec pion-${e}" data-prec="${e}"><div class="disque">${NOMS[e]}</div></div>`).join('')}
      ${entites.map((e) => `<div class="pion pion-${e}" data-e="${e}"><div class="disque">${NOMS[e]}<span class="etats"></span></div></div>`).join('')}
    </div></div>`;
  const arene = conteneur.querySelector('.arene'), couche = conteneur.querySelector('.couche'), cases = conteneur.querySelector('.cases');
  const svg = conteneur.querySelector('svg.fleches'), fleches = svg.querySelector('g');
  const pions = Object.fromEntries(entites.map((e) => [e, conteneur.querySelector(`[data-e="${e}"]`)]));
  const precs = Object.fromEntries(entites.map((e) => [e, conteneur.querySelector(`[data-prec="${e}"]`)]));
  const pointe = `pointe-${entites.join('')}`;
  let iso = lire('vue', 'iso') !== 'plate';
  let B = { x0: -2, y0: -1, nc: 5, nr: 3 };
  let dernier = null;

  function dimensionner() {
    arene.classList.toggle('iso', iso);
    const { nc, nr } = B;
    if (iso) { const k = Math.SQRT2 / (nc + nr); arene.style.aspectRatio = '2 / 1'; couche.style.width = `${nc * k * 100}%`; couche.style.height = `${nr * k * 200}%`; }
    else { arene.style.aspectRatio = `${nc} / ${nr}`; couche.style.width = '100%'; couche.style.height = '100%'; }
    conteneur.querySelectorAll('[data-vue]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.vue === 'iso') === iso)));
  }
  conteneur.querySelectorAll('[data-vue]').forEach((b) => b.addEventListener('click', () => { iso = b.dataset.vue === 'iso'; garder('vue', iso ? 'iso' : 'plate'); dimensionner(); }));

  // Cadre le plateau sur toutes les cases utiles d'un combo (au moins 5 × 3, une case de marge).
  function cadrer(liste) {
    const xs = liste.map((p) => p[0]), ys = liste.map((p) => p[1]);
    let x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 1, y0 = Math.min(...ys) - 1, y1 = Math.max(...ys) + 1;
    while (x1 - x0 + 1 < 5) { x0--; if (x1 - x0 + 1 < 5) x1++; }
    while (y1 - y0 + 1 < 3) { y0--; if (y1 - y0 + 1 < 3) y1++; }
    B = { x0, y0, nc: x1 - x0 + 1, nr: y1 - y0 + 1 };
    cases.style.gridTemplateColumns = `repeat(${B.nc},1fr)`; cases.style.gridTemplateRows = `repeat(${B.nr},1fr)`;
    cases.innerHTML = Array.from({ length: B.nc * B.nr }, () => '<div class="case"></div>').join('');
    svg.setAttribute('viewBox', `0 0 ${B.nc * 100} ${B.nr * 100}`);
    for (const el of [...Object.values(pions), ...Object.values(precs)]) { el.style.width = `${100 / B.nc}%`; el.style.height = `${100 / B.nr}%`; }
    dimensionner();
  }
  const col = (p) => p[0] - B.x0, lig = (p) => p[1] - B.y0;
  const placer = (el, p) => { el.style.transform = `translate(${col(p) * 100}%,${lig(p) * 100}%)`; };
  const idx = (p) => (col(p) >= 0 && col(p) < B.nc && lig(p) >= 0 && lig(p) < B.nr ? lig(p) * B.nc + col(p) : -1);
  const fleche = (a, b) => {
    const xa = col(a) * 100 + 50, ya = lig(a) * 100 + 50, xb = col(b) * 100 + 50, yb = lig(b) * 100 + 50;
    const dx = xb - xa, dy = yb - ya, L = Math.hypot(dx, dy) || 1, nx = dy / L, ny = -dx / L, h = Math.min(80, 18 + L * 0.25);
    const mx = (xa + xb) / 2, my = (ya + yb) / 2, r = 30, ux = dx / L, uy = dy / L;
    return `<path d="M${xa + ux * r + nx * 14},${ya + uy * r + ny * 14} Q${mx + nx * h},${my + ny * h} ${xb - ux * r + nx * 14},${yb - uy * r + ny * 14}" fill="none" stroke="var(--violet)" stroke-width="3" marker-end="url(#${pointe})" vector-effect="non-scaling-stroke"/>`;
  };

  // etat : { pos, prec, tf, sab, aig, et, pieges, visee, zone, mouvements, glyphe, premonition, origine, explose }
  function afficher(etat) {
    dernier = etat;
    const occupees = new Set(Object.values(etat.pos).filter(Boolean).map((p) => p.join(',')));
    for (const e of entites) {
      const p = etat.pos[e], pion = pions[e];
      pion.classList.toggle('absent', !p);
      if (p) placer(pion, p);
      pion.classList.toggle('tf', (etat.tf || []).includes(e));
      const pr = etat.prec && etat.prec[e];
      const montrer = pr && !occupees.has(pr.join(','));
      precs[e].classList.toggle('absent', !montrer);
      if (montrer) placer(precs[e], pr);
      const st = [];
      if (e === 'M') { if (etat.sab !== null && etat.sab !== undefined) st.push(ICONES.sab); if (etat.aig) st.push(ICONES.aig); if (etat.et) st.push(ICONES.et); }
      pion.querySelector('.etats').innerHTML = st.join('');
      pion.classList.remove('explose');
      if (e === 'M' && etat.explose) { void pion.offsetWidth; pion.classList.add('explose'); }
    }
    const cs = cases.children;
    for (const c of cs) c.className = 'case';
    const marquer = (liste, cls) => (liste || []).forEach((p) => { const i = idx(p); if (i >= 0) cs[i].classList.add(cls); });
    marquer(etat.glyphe, 'glyphe');
    marquer(etat.pieges, 'piege');
    marquer(etat.zone, 'zone');
    marquer(etat.visee ? [etat.visee] : [], 'visee');
    marquer(etat.premonition ? [etat.premonition] : [], 'premonition');
    marquer(etat.origine ? [etat.origine] : [], 'origine');
    fleches.innerHTML = (etat.mouvements || []).map((m) => fleche(m.de, m.vers)).join('');
  }
  dimensionner();
  return { cadrer, afficher, rafraichir: () => dernier && afficher(dernier) };
}
