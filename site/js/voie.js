// Page d'une voie : combos pas à pas, choix du stuff, résistances du monstre.
// Les étapes viennent de site/data/pas/<voie>.json (rejouées par le moteur au build) ; seuls les dégâts sont
// recalculés ici, avec la formule du moteur (js/formule.mjs).
import { $, nf, echap, entete, lire, garder, charger, statutHTML, ligne, panneauResist, pastillesElements, COULEUR_EL, NOM_EL, spriteObjet, activerInfobulles } from './commun.js';
import { creerPlateau } from './plateau.js';
import { hauteurFixe, clavierLecteur } from './lecteur.js';

entete('');
const COURT = { T1_13: '13 PA', T1_12: '12 PA', T2_22: '22 PA', T2_23: '23 PA', CAC_T1: 'Corps à corps · 12 PA', CAC_T2: 'Corps à corps · 22 PA' };
const TEXTE_SITUATION = {
  T1_13: 'Ocre actif : 13 PA. Le Xélor n\'est pas en Téléfrag.',
  T1_12: 'Ocre inactif : 12 PA. Le Xélor n\'est pas en Téléfrag.',
  T2_22: 'Après le set-up : 22 PA, le Xélor est en Téléfrag et a gardé ses PM. Sans le PA de l\'Ocre.',
  T2_23: 'Après le set-up, Ocre actif : 23 PA. Le Xélor est en Téléfrag.',
  CAC_T1: 'Le monstre vient de frapper : il est collé en ligne, sa position précédente est la case opposée au Xélor. 12 PA (pas de PA de l\'Ocre). Tacle : le Xélor ne peut pas quitter sa case à pied.',
  CAC_T2: 'Même départ, après le set-up : 22 PA, le Xélor en Téléfrag. Tacle : pas de marche.',
};
const FAMILLE = { bi: 'Voie bi-élément', mono: 'Voie mono-élément', multi: 'Voie multi-élément (4 éléments)' };
const SLOT = { coiffe: 'Coiffe', amulette: 'Amulette', anneau1: 'Anneau', anneau2: 'Anneau', ceinture: 'Ceinture', bottes: 'Bottes', cape: 'Cape',
  arme: 'Arme', bouclier: 'Bouclier', familier: 'Familier', dofus1: 'Dofus', dofus2: 'Dofus', dofus3: 'Dofus', dofus4: 'Dofus', dofus5: 'Dofus', dofus6: 'Dofus' };
const CARAC = { fo: 'Force', int: 'Intelligence', cha: 'Chance', agi: 'Agilité' };
const P = (p) => (p ? `(${p[0]},${p[1]})` : '—');

const params = new URLSearchParams(location.search);
const idVoie = params.get('v') || 'terre-feu';
let etat = { situation: params.get('s') || 'T1_13', version: params.get('c') || 'principal', stuff: lire('stuff', 'offensif'), i: 0 };
let V, PAS, SORTS, AUTRES = {}, OBJETS = {}, resist, plateau, combo;

async function init() {
  try {
    let SD;
    [V, PAS, SD] = await Promise.all([charger(`data/voies/${idVoie}.json`), charger(`data/pas/${idVoie}.json`), charger('data/sorts.json')]);
    SORTS = SD.sorts; AUTRES = SD.autres;
  } catch (e) {
    $('titre').textContent = 'Voie introuvable';
    $('sousTitre').innerHTML = `${echap(e.message)}. <a href="index.html">Retour à l'accueil</a>.`;
    return;
  }
  const idx = await charger('data/index.json');
  // Sprites des objets du stuff (site/data/objets.json) : la page marche sans, avec des cases vides.
  OBJETS = (await charger('data/objets.json').catch(() => ({ objets: {} }))).objets;
  activerInfobulles(OBJETS);
  const info = idx.voies.find((v) => v.id === idVoie);
  document.title = `${info.nom} · Sanctuaire Xélor`;
  $('famille').textContent = FAMILLE[info.famille];
  $('titre').textContent = info.nom;
  $('elements').innerHTML = pastillesElements(V.elements);
  $('statutVoie').innerHTML = statutHTML(V.statut);
  $('sousTitre').textContent = `Calculé le ${V.date.split('-').reverse().join('/')}. Chaque stuff a ses propres combos. Moyenne des 4 combos (12, 13, 22 et 23 PA) : ${nf(V.moyenne.offensif)} avec le stuff Offensif, ${nf(V.moyenne.equilibre)} avec l'Équilibré, sur un monstre sans résistance.`;
  if (!['offensif', 'equilibre'].includes(etat.stuff)) etat.stuff = 'offensif';
  if (!PAS.combos[etat.stuff][etat.situation]) etat.situation = 'T1_13';
  $('situations').innerHTML = Object.keys(COURT).filter((k) => PAS.combos[etat.stuff][k]).map((k) => `<button data-s="${k}">${COURT[k]}</button>`).join('') +
    '<a class="btn lien" href="setup.html" style="align-self:center;margin-left:6px">Set-up →</a>';
  $('situations').querySelectorAll('[data-s]').forEach((b) => b.addEventListener('click', () => { etat.situation = b.dataset.s; etat.version = 'principal'; etat.i = 0; changerCombo(); }));
  document.querySelectorAll('[data-version]').forEach((b) => b.addEventListener('click', () => { etat.version = b.dataset.version; etat.i = 0; changerCombo(); }));
  // Les combos dépendent du stuff (18/11/2026) : changer de stuff change aussi les combos affichés.
  document.querySelectorAll('[data-stuff]').forEach((b) => b.addEventListener('click', () => { etat.stuff = b.dataset.stuff; garder('stuff', etat.stuff); etat.version = 'principal'; etat.i = 0; changerCombo(); majStuff(); }));
  const lireR = panneauResist($('resist'), (r) => { resist = r; majDegats(); });
  resist = lireR();
  plateau = creerPlateau($('plateau'));
  $('prec').addEventListener('click', () => aller(etat.i - 1));
  $('suiv').addEventListener('click', () => aller(etat.i >= combo.etapes.length ? 0 : etat.i + 1));
  clavierLecteur($('prec'), $('suiv'));
  changerCombo();
  majStuff();
}
const nomAutre = (s) => AUTRES[s] || s;
const nomSort = (s) => SORTS[s]?.nom || nomAutre(s);

function stats() { return V.stuffs[etat.stuff].stats; }
function arme() { return PAS.armes[etat.stuff]; }

// Dégâts d'une étape : somme de ses lignes, avec le stuff (et son arme) et les résistances choisis.
function degatsEtape(e) {
  const detail = Object.entries(e.lignes || {}).map(([k, nb]) => ({ cle: k, nb, ...ligne(SORTS, k, stats(), resist, arme()) }));
  return { total: detail.reduce((a, d) => a + d.nb * d.moyenne, 0), detail };
}

function changerCombo() {
  if (!PAS.combos[etat.stuff][etat.situation]) etat.situation = 'T1_13';
  const c = PAS.combos[etat.stuff][etat.situation];
  if (!c[etat.version]) etat.version = 'principal';
  combo = c[etat.version];
  const url = new URL(location.href);
  url.searchParams.set('v', idVoie); url.searchParams.set('s', etat.situation);
  if (etat.version === 'verifie') url.searchParams.set('c', 'verifie'); else url.searchParams.delete('c');
  history.replaceState(null, '', url);
  $('situations').querySelectorAll('[data-s]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.s === etat.situation)));
  $('choixVersion').hidden = !c.verifie;
  document.querySelectorAll('[data-version]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.version === etat.version)));
  $('situationTexte').innerHTML = `<b>${COURT[etat.situation]}</b> · ${TEXTE_SITUATION[etat.situation]} Le Xélor part de (0,0), le monstre de ${P(combo.caseMonstre)}. Combo du stuff ${etat.stuff === 'offensif' ? 'Offensif' : 'Équilibré'}${combo.arme ? `, avec coup d'arme (${echap(combo.arme)})` : ''}. ${statutHTML(combo.statut)}`;
  const tout = [combo.depart.pos.X, combo.depart.pos.M, ...Object.values(combo.depart.prec).filter(Boolean),
    ...combo.etapes.flatMap((e) => [e.pos.X, e.pos.M, e.cible, ...Object.values(e.prec).filter(Boolean)])].filter(Boolean);
  plateau.cadrer(tout);
  $('points').innerHTML = [combo.depart, ...combo.etapes].map((_, k) => `<button data-k="${k}" aria-label="Étape ${k}">${k}</button>`).join('');
  $('points').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => aller(+b.dataset.k)));
  majDegats();
}

function majStuff() {
  document.querySelectorAll('[data-stuff]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.stuff === etat.stuff)));
  const st = V.stuffs[etat.stuff], s = st.stats;
  $('resumeStuff').textContent = `${nf(st.pv)} PV · ${st.pa} PA / ${st.pm} PM · PO ${st.po >= 0 ? '+' : ''}${st.po} · ${s.crit} % crit · ${s.doCrit} Do crit`;
  $('titreStuff').textContent = `Stuff ${etat.stuff === 'offensif' ? 'Offensif' : 'Équilibré'}`;
  $('objets').innerHTML = Object.entries(st.objets).filter(([, v]) => v).map(([k, v]) => `<li style="display:contents"><span class="slot">${SLOT[k] || k}</span><span class="obj"${OBJETS[v] ? ` data-objet="${echap(v)}" tabindex="0"` : ""}>${spriteObjet(OBJETS[v]?.img, 28)}<span>${echap(v)}</span></span></li>`).join('');
  $('variantes').innerHTML = Object.entries(V.variantes[etat.stuff]).sort((a, b) => +a[0].slice(1) - +b[0].slice(1))
    .map(([p, s]) => `<li><b>${echap(SORTS[s]?.nom || nomAutre(s))}</b> <span class="muted">(paire ${p.slice(1)})</span></li>`).join('');
  const A = arme(), NOMS_L = { T: 'Terre', F: 'Feu', E: 'Eau', A: 'Air', N: 'Neutre', meilleur: 'meilleur élément' };
  const texteArme = A ? `${echap(A.nom)} : ${A.pa} PA, PO ${A.po.join('-')}${A.ligne ? ', en ligne' : ''}${A.diag ? ', en diagonale' : ''}, ${A.t} fois par tour, ${A.cc} % de crit (+${A.cb} en critique) ; `
    + A.effets.map((e) => (e.type === 'degats' ? `${e.n[0]}${e.n[1] !== e.n[0] ? ` à ${e.n[1]}` : ''} ${e.vol ? 'vol ' : ''}${NOMS_L[e.el]}` : `${{ repousse: 'repousse de', attire: 'attire de', avance: 'avance de' }[e.type]} ${e.n} case${e.n > 1 ? 's' : ''}`)).join(', ')
    : "pas de coup d'arme modélisé pour cette arme";
  const pts = Object.entries(st.points).filter(([, v]) => v).map(([k, v]) => `${v} ${CARAC[k]}`).join(' / ');
  $('statsStuff').innerHTML = [
    `<li><b>Points :</b> ${pts} (parchemins 100 partout)</li>`,
    `<li><b>Panoplies :</b> ${echap(st.panoplies.join(', ') || 'aucune')}</li>`,
    `<li><b>Caractéristiques :</b> Force ${nf(s.fo)}, Intelligence ${nf(s.int)}, Chance ${nf(s.cha)}, Agilité ${nf(s.agi)}, Puissance ${s.pui}</li>`,
    `<li><b>Dommages :</b> Terre ${s.doT}, Feu ${s.doF}, Eau ${s.doE}, Air ${s.doA}, Neutre ${s.doN} ; ${s.crit} % de crit, ${s.doCrit} Do crit, +${s.sorts} % aux sorts${s.armes ? `, +${s.armes} % aux armes` : ''}</li>`,
    `<li><b>Coup d'arme :</b> ${texteArme}</li>`,
    st.resistancesPct ? `<li><b>Résistances % :</b> Terre ${st.resistancesPct.terre}, Feu ${st.resistancesPct.feu}, Eau ${st.resistancesPct.eau}, Air ${st.resistancesPct.air}, Neutre ${st.resistancesPct.neutre} (moyenne ${String(st.resistancesPct.moyenne).replace('.', ',')} %)</li>` : '',
    st.ecartElements && st.ecartElements.includes('/') ? `<li><b>Équilibre :</b> ${echap(st.ecartElements)}</li>` : '',
    `<li><b>Contrainte :</b> ${etat.stuff === 'equilibre' ? 'au moins 3 500 PV, aucune résistance % négative et au moins 20 % de résistance moyenne sur les cinq éléments, en perdant le moins de dégâts possible' : 'le plus de dégâts possible'}</li>`,
  ].join('');
  majDegats();
}

// Texte d'une étape, en français, à partir des données rejouées par le moteur.
function texteEtape(e, avant) {
  if (e.type === 'marche') return [`Le Xélor marche de ${P(avant.pos.X)} à ${P(e.pos.X)}.`];
  const t = [];
  t.push(e.cibleEntite === 'M' ? `Lancé sur le monstre ${P(e.cible)}.` : e.cibleEntite === 'X' ? 'Lancé sur soi.' : `Lancé sur la case ${P(e.cible)}.`);
  if (e.coup) t.push(`Coup d'arme sur le monstre à ${e.coup.distance} case${e.coup.distance > 1 ? 's' : ''} : ${e.coup.contacts.every((c) => c) ? 'mêlée (au contact)' : e.coup.contacts.some((c) => c) ? 'mêlée et distance' : 'distance'}. Ne consomme pas le Téléfrag.`);
  if (e.sort === 'MaitriseArme') t.push("+300 Puissance d'arme (+360 en critique) pour les coups d'arme de ce tour.");
  for (const m of e.mouvements) t.push(`${m.e === 'X' ? 'Le Xélor' : 'Le monstre'} passe de ${P(m.de)} à ${P(m.vers)}.`);
  if (e.echanges) t.push(e.echanges > 1 ? `${e.echanges} échanges : Téléfrag généré.` : 'Échange : Téléfrag généré.');
  if (e.gainPA > 0) t.push(`+${e.gainPA} PA rendus.`);
  if (avant.tf.includes('M') && !e.tf.includes('M')) t.push('Le Téléfrag du monstre est consommé.');
  if (avant.sab === null && e.sab !== null) t.push('État Sablier sur le monstre : il explosera au 2e Téléfrag consommé.');
  else if (e.sab !== null && avant.sab !== null && e.sab > avant.sab) t.push(`Sablier : ${e.sab}/2 Téléfrag consommé.`);
  for (const ev of e.evenements) {
    if (ev === 'Sablier explose') t.push('Le Sablier explose.');
    else if (ev === 'Aiguille') t.push('L\'Aiguille s\'active : Téléfrag consommé sur un monstre en état Aiguille.');
    else if (ev.startsWith('Aiguille : poison')) t.push('Aiguille : le poison du début du tour du monstre est compté dans le burst (le monstre n\'a pas encore joué).');
    else if (ev.startsWith('Espace-temps ×')) t.push(`Espace-temps se déclenche ${e.coup ? e.coup.lignes : ''} fois, une par ligne de l'arme : à chaque fois, le monstre, puis le Xélor, retournent à leur position précédente.`);
    else if (ev.startsWith('Espace-temps')) t.push('Espace-temps : le monstre, puis le Xélor, retournent à leur position précédente.');
    else t.push(ev);
  }
  for (const d of e.differe || []) t.push(`⏳ ${d.texte} (hors du burst).`);
  return t;
}

const elementEtape = (e) => {
  const cles = Object.keys(e.lignes || {});
  if (e.type === 'marche') return ['Déplacement', 'var(--neutre)'];
  if (!cles.length) return ['Sans dégâts', 'var(--neutre)'];
  const nom = cles[0].split('|')[0];
  if (nom === 'Arme') { const el = arme().effets.find((x) => x.type === 'degats').el; return ['Arme', COULEUR_EL[el] || 'var(--neutre)']; }
  const el = SORTS[nom]?.el || 'N';
  return [NOM_EL[el], COULEUR_EL[el]];
};

let DEG = [];
function majDegats() {
  if (!combo) return;
  DEG = combo.etapes.map(degatsEtape);
  const tot = DEG.reduce((a, d) => a + d.total, 0);
  let cum = 0, avant = combo.depart;
  $('lignes').innerHTML = combo.etapes.map((e, k) => {
    cum += DEG[k].total;
    const effet = texteEtape(e, avant).filter((x) => !x.startsWith('Lancé') && !x.includes(' passe de ')).join(' ');
    avant = e;
    return `<tr data-k="${k + 1}"><td class="n">${k + 1}</td><td><button class="lien-etape" data-k="${k + 1}">${echap(e.nom)}</button>${e.type === 'sort' ? `<div class="muted" style="font-size:12.5px">${e.cibleEntite === 'M' ? 'sur le monstre' : e.cibleEntite === 'X' ? 'sur soi' : `case ${P(e.cible)}`}</div>` : ''}</td>
      <td style="font-size:13.5px">${echap(effet) || '—'}</td><td class="n">${P(e.pos.X)}</td><td class="n">${P(e.pos.M)}</td><td class="n">${(k ? combo.etapes[k - 1].pa : combo.depart.pa)}→${e.pa}</td>
      <td class="n">${DEG[k].total ? nf(DEG[k].total) : '–'}</td><td class="n">${nf(cum)}</td></tr>`;
  }).join('');
  $('lignes').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { aller(+b.dataset.k); $('plateau').scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
  $('piedDmg').textContent = nf(tot);
  const depense = combo.etapes.reduce((a, e) => a + e.cout, 0);
  $('piedPA').textContent = `${depense} PA dépensés : ${combo.depart.pa} au départ + ${depense - combo.depart.pa + combo.paRestants} rendus, ${combo.paRestants} restant${combo.paRestants > 1 ? 's' : ''}.`;
  encarts(tot);
  fixerHauteur();
  afficherEtape();
}

function encarts(tot) {
  const c = PAS.combos[etat.stuff][etat.situation], h = [];
  const totalDe = (cb) => cb.etapes.reduce((a, e) => a + degatsEtape(e).total, 0);
  if (etat.version === 'principal' && c.verifie) {
    const v = totalDe(c.verifie);
    h.push(`<div class="encart compare"><p><b>Combo vérifié en jeu</b> : ${nf(v)} avec ce stuff et ces résistances, soit ${nf(tot - v)} de moins que ce nouveau combo (${tot > v ? '+' : ''}${((tot / v - 1) * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %). Le nouveau combo ${c.principal.arme ? `utilise le coup d'arme (${c.principal.arme}) et ` : ''}reste à tester en jeu. <button class="btn lien" data-voir="verifie">Voir le combo vérifié</button></p></div>`);
  } else if (etat.version === 'verifie') {
    h.push(`<div class="encart compare"><p><b>Ce combo est vérifié en jeu</b> (ordre, positions, PA). Le nouveau combo simulé fait ${nf(totalDe(c.principal))} avec ce stuff. <button class="btn lien" data-voir="principal">Voir le nouveau combo</button></p></div>`);
  } else if (!/vérifié/.test(combo.statut || '')) {
    h.push('<div class="encart info-simule"><p><b>Combo simulé</b> : calculé par le moteur, vérifié pas à pas (positions, PA, Téléfrags), mais pas encore testé en jeu.</p></div>');
  }
  const diff = combo.etapes.flatMap((e) => e.differe || []);
  const nbG = diff.filter((d) => d.sort === 'Gousset').length, nbC = diff.filter((d) => d.sort === 'Clepsydre').length;
  if (nbG || nbC) {
    const g = ligne(SORTS, 'GoussetDiffere|0', stats(), resist, arme());
    h.push(`<div class="encart differe"><p><b>⏳ Effets différés, hors du burst</b> (non comptés dans le total)</p>
      ${nbG ? `<p>Gousset ×${nbG} sur un monstre en Téléfrag : jusqu'à <b>${nf(nbG * g.moyenne)}</b> dégâts Air à la fin du prochain tour du Xélor, si le monstre est au centre de la zone (cercle de 2, −10 % par case d'éloignement).</p>` : ''}
      ${nbC ? `<p>Clepsydre ×${Math.min(3, nbC)} sur un monstre en Téléfrag : des PA en plus au tour suivant (cumulable 3 fois).</p>` : ''}</div>`);
  }
  $('encarts').innerHTML = h.join('');
  $('encarts').querySelectorAll('[data-voir]').forEach((b) => b.addEventListener('click', () => { etat.version = b.dataset.voir; etat.i = 0; changerCombo(); }));
}

function aller(i) {
  etat.i = Math.max(0, Math.min(combo.etapes.length, i));
  afficherEtape();
}

function afficherEtape() {
  const i = etat.i, e = i === 0 ? null : combo.etapes[i - 1], cur = e || combo.depart;
  remplirInfo(i);
  plateau.afficher({ ...cur, visee: e && e.type === 'sort' ? e.cible : null, zone: e ? e.zone : [], mouvements: e ? e.mouvements : [],
    explose: !!(e && e.lignes && e.lignes['SablierBoom|0']), arme: !!(e && e.coup) });
  $('lignes').querySelectorAll('tr').forEach((r) => r.classList.toggle('cur', +r.dataset.k === i));
}

function remplirInfo(i) {
  const n = combo.etapes.length;
  const e = i === 0 ? null : combo.etapes[i - 1], avant = i <= 1 ? combo.depart : combo.etapes[i - 2], cur = e || combo.depart;
  $('etapeNo').textContent = `Étape ${i} / ${n}`;
  const [lab, coul] = e ? elementEtape(e) : ['Placement', 'var(--neutre)'];
  $('puce').textContent = lab; $('puce').style.background = coul;
  $('sortNom').textContent = e ? e.nom : 'Départ';
  const txt = e ? texteEtape(e, avant) : [`Le Xélor est en (0,0)${cur.tf.includes('X') ? ', en Téléfrag grâce au set-up' : ''}, le monstre en ${P(cur.pos.M)}${cur.prec.M ? `, sa position précédente en ${P(cur.prec.M)}` : ''}. ${cur.pa} PA, ${cur.pm} PM.`];
  $('quoi').innerHTML = txt.length > 1 ? `<ul>${txt.map((t) => `<li>${echap(t)}</li>`).join('')}</ul>` : `<p style="margin:0">${echap(txt[0])}</p>`;
  // PA
  const paAvant = avant.pa, cout = e ? e.cout : 0, gain = e ? Math.max(0, e.gainPA) : 0, garde = paAvant - cout;
  const max = Math.max(paAvant, cur.pa, combo.depart.pa);
  $('pips').innerHTML = Array.from({ length: max }, (_, k) => `<span class="pip${k < garde ? ' on' : k < garde + gain ? ' gain' : ''}"></span>`).join('');
  $('paLigne').textContent = !e ? `${cur.pa} PA au départ` : e.type === 'marche' ? `${cur.pa} PA · ${avant.pm} → ${cur.pm} PM` : `${paAvant} PA → ${cur.pa} PA   (−${cout}${gain ? ` puis +${gain}` : ''})`;
  // Dégâts
  const d = e ? DEG[i - 1] : { total: 0, detail: [] };
  $('dmg').textContent = d.total ? `+${nf(d.total)}` : '0';
  $('dmg').style.color = d.total ? coul : 'var(--muted)';
  const boom = d.detail.find((x) => x.cle === 'SablierBoom|0');
  $('dmgS').textContent = boom ? `dont ${nf(boom.moyenne)} Sablier` : ' ';
  $('tf').textContent = cur.tf.length ? cur.tf.map((x) => (x === 'X' ? 'Xélor' : x === 'M' ? 'monstre' : 'Cadran')).join(', ') : 'personne';
  $('tfS').textContent = cur.et ? 'monstre en Espace-temps' : ' ';
  const pose = [combo.depart, ...combo.etapes.slice(0, i)].some((x) => x.sab !== null);
  $('sab').textContent = cur.sab === null ? (pose ? 'explosé' : 'pas posé') : `${cur.sab}/2 consommé${cur.sab > 1 ? 's' : ''}`;
  $('sabS').textContent = cur.aig ? 'monstre en état Aiguille' : ' ';
  $('detail').innerHTML = d.detail.map((x) => `<span>${echap(x.nom)}${x.extra ? ` (+${x.extra} de base)` : ''}${x.nb > 1 ? ` ×${x.nb}` : ''} · normal ${nf(x.normal)} · critique ${nf(x.crit)} · moyenne ${nf(x.moyenne)} · ${Math.round(x.cc * 100)} % crit</span>`).join('');
  const cum = DEG.slice(0, i).reduce((a, x) => a + x.total, 0), tot = DEG.reduce((a, x) => a + x.total, 0);
  $('cumul').textContent = nf(cum);
  $('barre').style.width = `${tot ? (cum / tot) * 100 : 0}%`;
  $('prec').disabled = i === 0;
  $('suiv').textContent = i === n ? 'Recommencer ↺' : 'Suivant →';
  $('points').querySelectorAll('button').forEach((b, k) => b.setAttribute('aria-current', k === i ? 'step' : 'false'));
}

// Hauteur fixe des blocs du lecteur (js/lecteur.js, commun avec le set-up).
const fixerHauteur = hauteurFixe(document.querySelector('.combo-principal .info'),
  { derniere: () => (combo ? combo.etapes.length : null), remplir: remplirInfo, courante: () => etat.i });

init();
