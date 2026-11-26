// Applique les stuffs recalculés le 24-26/11/2026 (Dofus Turquoise autorisé, Arcaniste banni, 5 PM autorisés) aux
// résultats des voies (outils/resultats/voies/<voie>.json), avant outils/publier_voies.mjs.
// Pour chaque voie et chaque profil, stuff retenu (règle du joueur, 24/11/2026) : le meilleur à exactement 5 PM s'il fait
// au moins +5 % sur la moyenne des 4 combos T1 / T2 par rapport au meilleur à 6 PM, sinon le meilleur à 6 PM
// (outils/resultats/voies/stuffs-pm6/ et stuffs-pm5/, écrits par outils/pilote_voies.mjs).
// Les combos ne sont pas recherchés à nouveau : le stuff reçoit le jeu de combos sur lequel l'optimiseur l'a noté
// (combos publiés de l'Offensif ou de l'Équilibré, ou combos d'avant le coup d'arme), avec le corps à corps et le jeu de
// variantes qui vont avec. Les dégâts de chaque combo sont recalculés avec le nouveau stuff, dans l'ordre des coups
// (Dofus Turquoise, outils/degats.mjs, comboOrdonne), et doivent retrouver ceux de l'optimiseur.
// Usage :  node outils/appliquer_stuffs.mjs [--essai]   (--essai : affiche sans rien écrire)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VOIES, comboOrdonne, combo } from './degats.mjs';
import { lireArme, TYPES_ARMES, comboJouableAvec } from '../moteur/armes.mjs';
import { SITUATIONS, SITUATIONS_SCORE, departCombo } from '../moteur/situations.mjs';
import { creerSimulateur } from '../moteur/simulateur.mjs';
import { SP } from '../moteur/sorts.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const R = join(HERE, 'resultats', 'voies'), SITE_VOIES = join(HERE, '..', 'site', 'data', 'voies');
const ESSAI = process.argv.includes('--essai');
const SEUIL_5PM = 0.05, PROFILS = ['offensif', 'equilibre'], NOM = { offensif: 'Offensif', equilibre: 'Équilibré' };
const lire = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null);
const ITEMS = JSON.parse(readFileSync(join(HERE, '..', 'data', 'current', 'items.json'), 'utf8')).data;
const ARMES = new Map(ITEMS.filter((i) => TYPES_ARMES.includes(i.typeId)).map((i) => [i.name.fr, lireArme(i)]));
const armeDe = (nom) => { const a = ARMES.get(nom); return a && a.utilisable ? a : null; };
// Variantes utilisées par un combo (paire de variantes → sort choisi) ; deux jeux sont compatibles s'ils ne se contredisent pas.
const variantesDe = (actions) => Object.fromEntries(actions.filter((a) => a.sort && SP[a.sort]?.p).map((a) => [SP[a.sort].p, a.sort]));
const compatibles = (a, b) => Object.entries(a).every(([P, s]) => !b[P] || b[P] === s);
const sansArme = (fs) => Object.fromEntries(Object.entries(fs || {}).map(([k, f]) => [k, { ...f, arme: null, coups: [] }]));

// Dégâts d'une fiche de combo avec un stuff : dans l'ordre des coups rejoué par le moteur (Turquoise). Le combo est rejoué
// avec l'arme qui y frappe (celle de la fiche, comme le pilote) ; les dégâts sont ceux de l'arme du stuff (A), qui doit
// pouvoir jouer ses coups (comboJouableAvec).
function degatsFiche(cle, f, stats, A) {
  const Af = (f.coups || []).length ? armeDe(f.arme) : null;
  if ((f.coups || []).length && !Af) throw new Error(`${cle} : arme du combo introuvable (${f.arme})`);
  const sim = creerSimulateur({ stats, opt: { tacle: !!SITUATIONS[cle].tacle }, arme: Af });
  const d = departCombo(cle, f.caseMonstre), l = sim.lignesCombo(d, f.actions), seq = sim.sequenceCombo(d, f.actions);
  const tri = (o) => JSON.stringify(Object.entries(o).sort());
  if (tri(l) !== tri(f.lignes)) throw new Error(`${cle} : le combo rejoué ne retrouve pas ses lignes`);
  if (Math.abs(seq.length - Object.values(l).reduce((a, b) => a + b, 0)) > 0) throw new Error(`${cle} : ordre des coups incomplet`);
  return { total: comboOrdonne(seq, stats, null, A), sansTurquoise: combo(l, stats, null, A) };
}

const bilan = [];
let erreurs = 0;
for (const voie of Object.keys(VOIES)) {
  const fr = join(R, `${voie}.json`), r = lire(fr), pub = lire(join(SITE_VOIES, `${voie}.json`));
  if (!r || !pub || r.format !== 2 || pub.format !== 2) { console.log(`${voie} : résultats introuvables ou pas au format 2`); erreurs++; continue; }
  const nouveau = { combos: {}, corpsACorps: {}, stuffs: {}, armes: {}, variantes: {}, moyenne: {} }, choix = {};
  for (const p of PROFILS) {
    const p6 = lire(join(R, 'stuffs-pm6', `${voie}.${p}.json`)), p5 = lire(join(R, 'stuffs-pm5', `${voie}.${p}.json`));
    if (!p6?.ok) { console.log(`${voie} ${NOM[p]} : pas de stuff à 6 PM`); erreurs++; continue; }
    const b6 = p6.best, b5 = p5?.ok ? p5.best : null, garde5 = !!b5 && b5.score >= b6.score * (1 + SEUIL_5PM), b = garde5 ? b5 : b6;
    // Jeu de combos sur lequel le stuff a été noté.
    const nomJeu = b.combosRetenus?.nom;
    const src = nomJeu === "combos publiés de l'Offensif" ? { combos: pub.combos.offensif, cac: pub.corpsACorps.offensif, variantes: pub.variantes.offensif }
      : nomJeu === "combos publiés de l'Équilibré" ? { combos: pub.combos.equilibre, cac: pub.corpsACorps.equilibre, variantes: pub.variantes.equilibre }
      : /avant le coup d'arme/.test(nomJeu || '') && r.avantArme ? { combos: sansArme(r.avantArme.combos), cac: sansArme(r.avantArme.corpsACorps), variantes: r.avantArme.variantes }
      : null;
    // Corps à corps (hors score) : le plus fort des corps à corps connus (celui du jeu, ceux des deux stuffs publiés, celui
    // d'avant le coup d'arme) qui soit jouable avec l'arme du stuff et compatible avec les variantes de ses combos T1 / T2.
    const candidatsCac = [src.cac, pub.corpsACorps.offensif, pub.corpsACorps.equilibre, ...(r.avantArme ? [sansArme(r.avantArme.corpsACorps)] : [])];
    if (!src) { console.log(`${voie} ${NOM[p]} : jeu de combos inconnu (${nomJeu})`); erreurs++; continue; }
    const A = armeDe(b.objets.arme), stats = b.stats;
    const fiche = (cle, f) => {
      if (!comboJouableAvec(f.coups || [], f.arme, A)) throw new Error(`${voie} ${NOM[p]} ${cle} : combo pas jouable avec ${b.objets.arme}`);
      const d = degatsFiche(cle, f, stats, A);
      const g = { caseMonstre: f.caseMonstre, actions: f.actions, lignes: f.lignes, paRestants: f.paRestants, journal: f.journal,
        arme: (f.coups || []).length ? A.nom : null, coups: f.coups || [], degats: { [p]: Math.round(d.total) }, trouveAvec: f.trouveAvec };
      return [cle, g, d];
    };
    try {
      const cs = SITUATIONS_SCORE.map((s) => fiche(s, src.combos[s]));
      const var4 = cs.reduce((v, [, g]) => ({ ...v, ...variantesDe(g.actions) }), {});
      const cac = ['CAC_T1', 'CAC_T2'].map((s) => {
        const ok = candidatsCac.map((c) => c[s]).filter((f) => f && comboJouableAvec(f.coups || [], f.arme, A) && compatibles(variantesDe(f.actions), var4))
          .map((f) => fiche(s, f));
        if (!ok.length) throw new Error(`${voie} ${NOM[p]} ${s} : aucun corps à corps connu jouable avec ${b.objets.arme}`);
        const m = ok.reduce((x, y) => (y[1].degats[p] > x[1].degats[p] ? y : x));
        if (m[1].actions !== src.cac[s].actions) console.log(`${voie} ${NOM[p]} ${s} : corps à corps d'un autre jeu (${m[1].degats[p]}${src.cac[s] && comboJouableAvec(src.cac[s].coups || [], src.cac[s].arme, A) ? '' : ', celui du jeu ne se joue pas avec cette arme'})`);
        return m;
      });
      const variantes = cac.reduce((v, [, g]) => ({ ...v, ...variantesDe(g.actions) }), { ...src.variantes, ...var4 });
      for (const [cle, g] of cs) if (Math.abs(g.degats[p] - b.combos[cle]) > 1) {
        console.log(`${voie} ${NOM[p]} ${cle} : ${g.degats[p]} au lieu de ${b.combos[cle]} (optimiseur)`); erreurs++;
      }
      const moy = Math.round(cs.reduce((a, [, g]) => a + g.degats[p], 0) / cs.length);
      if (Math.abs(moy - b.score) > 1) { console.log(`${voie} ${NOM[p]} : moyenne ${moy} au lieu de ${b.score}`); erreurs++; }
      nouveau.combos[p] = Object.fromEntries(cs.map(([k, g]) => [k, g]));
      nouveau.corpsACorps[p] = Object.fromEntries(cac.map(([k, g]) => [k, g]));
      nouveau.stuffs[p] = { ...b, score: moy, combos: Object.fromEntries(cs.map(([k, g]) => [k, g.degats[p]])) };
      nouveau.armes[p] = A;
      nouveau.variantes[p] = variantes;
      nouveau.moyenne[p] = moy;
      choix[p] = { pm: garde5 ? 5 : 6, score6: b6.score, score5: b5 ? b5.score : null, publieAvant: pub.stuffs[p].score, jeu: nomJeu,
        methode: (garde5 ? p5 : p6).methode || 'complete' };
      const bonus = cs.reduce((a, [, , d]) => a + d.total - d.sansTurquoise, 0) / cs.length;
      bilan.push(`${voie.padEnd(9)} ${NOM[p].padEnd(9)} ${String(pub.stuffs[p].score).padStart(5)} → ${String(moy).padStart(5)} (${garde5 ? 5 : 6} PM, ${b.pv} PV, jeu « ${nomJeu} », arme ${b.objets.arme} ; Turquoise ≈ +${Math.round(bonus)} par combo ; corps à corps ${cac.map(([, g]) => g.degats[p]).join(' / ')})`);
    } catch (e) { console.log(e.message); erreurs++; }
  }
  if (Object.keys(nouveau.stuffs).length !== 2) continue;
  const sortie = { ...r, date: new Date().toISOString().slice(0, 10), ...nouveau,
    stuffsTurquoise: { date: '2026-11-26', regle: '5 PM si au moins +5 % sur la moyenne des 4 combos T1 / T2 par rapport au meilleur 6 PM',
      mode: 'sans Dolmanax, Vulbis, Dofus des Glaces, Arcaniste (Turquoise autorisé)', ...choix } };
  if (!ESSAI) writeFileSync(fr, JSON.stringify(sortie, null, 1));
}
console.log(bilan.join('\n'));
console.log(erreurs ? `${erreurs} erreur(s) : rien n'est fiable, à corriger` : ESSAI ? 'essai : rien écrit' : 'stuffs appliqués dans outils/resultats/voies/ ; reste à lancer outils/publier_voies.mjs');
process.exit(erreurs ? 1 : 0);
