// Page Set-up : le tour 1 qui prépare 22 PA au tour 2 (✅ vérifié en jeu, docs/RESULTATS_REFERENCE.md).
// O = case d'origine (0,0), P = case d'arrivée (2,0), glyphes d'Instabilité posés entre les deux, en (1,0).
import { $, echap, entete } from './commun.js';
import { creerPlateau } from './plateau.js';

entete('setup.html');
const O = [0, 0], P = [2, 0], MILIEU = [1, 0];
const cercle = (c, r) => { const z = []; for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) if (Math.abs(a) + Math.abs(b) <= r) z.push([c[0] + a, c[1] + b]); return z; };
const GLYPHE = cercle(MILIEU, 3);
const COUL = { depart: ['Placement', 'var(--neutre)'], marche: ['Déplacement', 'var(--neutre)'], invoc: ['Invocation', 'var(--c)'], setup: ['Set-up', 'var(--violet)'], auto: ['Automatique', 'var(--brass)'] };

let pa = 12;
const E = [];
const ajout = (o) => { if (o.auto) { o.paAvant = null; o.paApres = null; } else { o.paAvant = pa; pa -= o.cout || 0; o.paApres = pa; } E.push(o); };
ajout({ nom: 'Départ', type: 'depart', pos: { X: O }, tf: [], banque: 12, source: 'PA de base', effet: "Case d'origine O",
  quoi: "Tu commences ton tour sur ta case d'origine O. Pas d'ennemi à portée, pas de PA de l'Ocre : 12 PA." });
ajout({ nom: 'Déplacement', type: 'marche', pos: { X: P }, tf: [], banque: 12, source: '–', mouvements: [{ e: 'X', de: O, vers: P }], origine: O, effet: 'O → P',
  quoi: "Avance jusqu'à P (2 cases ici). Le nombre de cases n'a pas d'importance : il faut juste quitter O." });
ajout({ nom: 'Cadran de Xélor', type: 'invoc', cout: 3, pos: { X: P, K: O }, tf: [], visee: O, banque: 12, source: '–', effet: 'Cadran posé sur O',
  quoi: "Invoque le Cadran sur ta case d'origine O. Il sert de partenaire d'échange, et à son tour il donne 2 PA aux alliés en Téléfrag dans un cercle de 4." });
ajout({ nom: 'Flou Temporel', type: 'setup', cout: 2, pos: { X: P, K: O }, tf: [], visee: P, banque: 14, gain: 2, source: 'Flou Temporel', effet: '+2 PA au tour 2',
  quoi: 'Le retrait de PA ne te touche pas, mais tu gagnes bien les 2 PA au tour suivant.' });
ajout({ nom: 'Rembobinage', type: 'setup', cout: 2, pos: { X: P, K: O }, tf: [], visee: P, banque: 14, source: 'en attente', effet: 'Retour sur O en fin de tour',
  quoi: "Lancé sur toi. L'effet s'applique à la fin de ton tour : tu seras renvoyé à ta position de début de tour, O, là où est le Cadran." });
ajout({ nom: 'Prémonition', type: 'setup', cout: 2, pos: { X: P, K: O }, tf: [], visee: P, premonition: P, banque: 14, source: 'en attente', effet: 'Échange sur P au tour 2',
  quoi: "Lancée sur ta propre case P (contour pointillé). Au début du tour 2, tu échangeras avec l'entité qui se trouve sur P." });
ajout({ nom: 'Instabilité', type: 'setup', cout: 3, pos: { X: P, K: O }, tf: [], visee: MILIEU, glyphe: GLYPHE, premonition: P, banque: 14, source: 'en attente', effet: 'Glyphes entre O et P',
  quoi: "Les deux glyphes (cercle de 3, zone teintée) sont posés entre O et P : toi et le Cadran êtes dedans. Ils se déclenchent à chaque Téléfrag que tu génères ou consommes, jusqu'au début de ton prochain tour." });
ajout({ auto: true, nom: 'Fin du tour · Rembobinage', type: 'auto', pos: { X: O, K: P }, tf: ['X', 'K'], mouvements: [{ e: 'X', de: P, vers: O }, { e: 'K', de: O, vers: P }], glyphe: GLYPHE, premonition: P,
  banque: 16, gain: 2, source: 'Téléfrag (Rembobinage)', effet: 'Toi → O, Cadran → P',
  quoi: 'Tu es renvoyé sur O, occupé par le Cadran : vous échangez. Téléfrag, et ses 2 PA sont gardés pour le tour 2.' });
ajout({ auto: true, nom: 'Fin du tour · Instabilité', type: 'auto', pos: { X: P, K: O }, tf: ['X', 'K'], mouvements: [{ e: 'X', de: O, vers: P }, { e: 'K', de: P, vers: O }], glyphe: GLYPHE, premonition: P,
  banque: 18, gain: 2, source: 'Téléfrag (Instabilité)', effet: 'Toi → P, Cadran → O',
  quoi: "Le Téléfrag déclenche aussitôt le glyphe : chacun retourne à sa position précédente. Toi en P, le Cadran en O, et le Cadran n'a plus de position précédente. Nouveau Téléfrag, +2 PA." });
ajout({ auto: true, nom: 'Tour du Cadran', type: 'auto', pos: { X: P, K: O }, tf: ['X', 'K'], glyphe: GLYPHE, premonition: P, banque: 20, gain: 2, source: 'Cadran', effet: '+2 PA (Cadran)',
  quoi: "Le Cadran joue après toi : il donne 2 PA aux alliés en Téléfrag dans un cercle de 4. Le glyphe ne le déplace pas, puisqu'il n'a plus de position précédente." });
ajout({ auto: true, nom: 'Début du tour 2 · Glyphe', type: 'auto', pos: { X: O, K: P }, tf: ['X', 'K'], mouvements: [{ e: 'X', de: P, vers: O }, { e: 'K', de: O, vers: P }], glyphe: GLYPHE, premonition: P,
  banque: 20, source: 'aucun', effet: 'Toi → O, Cadran → P',
  quoi: 'Le glyphe de début de tour te renvoie à ta position précédente, O, où est le Cadran : échange. Instabilité a déjà donné ses PA, donc pas de gain.' });
ajout({ auto: true, nom: 'Début du tour 2 · Prémonition', type: 'auto', pos: { X: P, K: O }, tf: ['X', 'K'], mouvements: [{ e: 'X', de: O, vers: P }, { e: 'K', de: P, vers: O }],
  banque: 22, gain: 2, source: 'Téléfrag (Prémonition)', effet: 'Toi → P, Cadran → O',
  quoi: "La Prémonition t'échange avec l'entité sur P, c'est-à-dire le Cadran. Téléfrag, +2 PA. Le glyphe disparaît." });
ajout({ auto: true, nom: 'Tour 2 : 22 PA', type: 'setup', pos: { X: P, K: O }, tf: ['X', 'K'], banque: 22, source: '12 + 5 × 2', effet: '22 PA au début du tour 2',
  quoi: "Tu démarres le tour 2 avec 22 PA (23 si l'Ocre est actif), toi en P, le Cadran en O, tous les deux en Téléfrag. Les combos à 22 et 23 PA partent d'ici : tu t'es déplacé, et le Cadran ne sert plus." });

const plateau = creerPlateau($('plateau'), { entites: ['X', 'K'] });
plateau.cadrer([...GLYPHE.filter((p) => Math.abs(p[1]) <= 1), O, P]);
let i = 0;
$('points').innerHTML = E.map((_, k) => `<button data-k="${k}" aria-label="Étape ${k}">${k}</button>`).join('');
$('points').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => aller(+b.dataset.k)));
$('lignes').innerHTML = E.slice(1).map((e, k) => `<tr data-k="${k + 1}"><td class="n">${k + 1}</td><td><button class="lien-etape" data-k="${k + 1}">${echap(e.nom)}</button></td><td>${echap(e.effet)}</td>
  <td class="n">${e.auto ? '—' : `${e.paAvant}→${e.paApres}`}</td><td class="n">${e.gain ? `+${e.gain}` : '–'}</td><td class="n">${e.banque}</td></tr>`).join('');
$('lignes').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { aller(+b.dataset.k); $('plateau').scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
$('prec').addEventListener('click', () => aller(i - 1));
$('suiv').addEventListener('click', () => aller(i === E.length - 1 ? 0 : i + 1));
document.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') $('suiv').click(); else if (e.key === 'ArrowLeft') $('prec').click(); });

function aller(k) {
  i = Math.max(0, Math.min(E.length - 1, k));
  const e = E[i];
  $('etapeNo').textContent = `Étape ${i} / ${E.length - 1}`;
  const [lab, coul] = COUL[e.type];
  $('puce').textContent = lab; $('puce').style.background = coul;
  $('sortNom').textContent = e.nom;
  $('quoi').textContent = e.quoi;
  plateau.afficher({ pos: e.pos, prec: {}, tf: e.tf, sab: null, visee: e.visee, zone: [], mouvements: e.mouvements, glyphe: e.glyphe, premonition: e.premonition, origine: e.origine });
  const avant = e.auto ? 0 : e.paAvant, apres = e.auto ? 0 : e.paApres;
  $('pips').innerHTML = Array.from({ length: 12 }, (_, k2) => `<span class="pip${k2 < apres ? ' on' : ''}"></span>`).join('');
  $('paLigne').textContent = e.auto ? (i >= 9 ? 'Début du tour 2, avant de jouer' : 'Tour 1 terminé : les gains vont au tour 2') : i === 0 ? '12 PA au départ' : `${avant} PA → ${apres} PA${e.cout ? `   (−${e.cout})` : ''}`;
  $('banque').textContent = e.banque;
  $('gain').textContent = e.gain ? `+${e.gain}` : '–';
  $('source').textContent = e.source;
  $('cumul').textContent = `${e.banque} PA`;
  $('barre').style.width = `${(e.banque / 22) * 100}%`;
  $('prec').disabled = i === 0;
  $('suiv').textContent = i === E.length - 1 ? 'Recommencer ↺' : 'Suivant →';
  $('points').querySelectorAll('button').forEach((b, k2) => b.setAttribute('aria-current', k2 === i ? 'step' : 'false'));
  $('lignes').querySelectorAll('tr').forEach((r) => r.classList.toggle('cur', +r.dataset.k === i));
}
aller(0);
