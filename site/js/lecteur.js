// Lecteur pas à pas, commun aux combos des voies (voie.js) et au set-up (setup.js) :
// le set-up est un combo comme les autres, tout réglage du lecteur vaut pour les deux pages.

// Hauteur fixe : chaque bloc du panneau d'explications (titre et texte, PA, état, détail, cumul,
// boutons) prend la hauteur qu'il a à sa plus longue étape. Chaque bloc reste donc au même endroit
// d'une étape à l'autre : le plateau ne saute pas, les boutons restent sous la souris et l'œil
// retrouve les PA et le cumul à la même place.
//   info     : le panneau d'explications (.info) ;
//   derniere : () => numéro de la dernière étape (null tant que rien n'est chargé) ;
//   remplir  : (k) => remplit le panneau avec l'étape k, sans toucher au plateau ;
//   courante : () => numéro de l'étape affichée.
// Renvoie fixer(), à appeler à chaque changement de combo, de stuff ou de résistances. Il est aussi
// rappelé quand la largeur change (le texte se replie autrement) et quand une police finit de
// charger (un titre peut tenir sur une ligne avec la vraie police et sur deux avec la police de secours).
export function hauteurFixe(info, { derniere, remplir, courante }) {
  function fixer() {
    const n = derniere();
    if (n === null || n === undefined) return;
    const blocs = [...info.children];
    blocs.forEach((b) => { b.style.minHeight = ''; });
    const max = blocs.map(() => 0);
    for (let k = 0; k <= n; k++) {
      remplir(k);
      blocs.forEach((b, j) => { max[j] = Math.max(max[j], Math.ceil(b.getBoundingClientRect().height)); });
    }
    blocs.forEach((b, j) => { b.style.minHeight = `${max[j]}px`; });
    remplir(courante());
  }
  let largeur = 0;
  new ResizeObserver(([o]) => {
    const l = Math.round(o.contentRect.width);
    if (l !== largeur) { largeur = l; fixer(); }
  }).observe(info);
  document.fonts?.ready.then(fixer);
  document.fonts?.addEventListener?.('loadingdone', fixer);
  return fixer;
}

// Flèches gauche et droite du clavier : étape précédente et suivante (sauf dans un champ de saisie).
export function clavierLecteur(prec, suiv) {
  document.addEventListener('keydown', (e) => {
    if (e.target.closest?.('input,select,textarea')) return;
    if (e.key === 'ArrowRight') suiv.click(); else if (e.key === 'ArrowLeft') prec.click();
  });
}
