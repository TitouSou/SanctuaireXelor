# Résultats de référence : voie Terre-Feu (niveau 199)

Ces résultats sont les **tests de non-régression** du moteur. Un nouveau code doit retrouver ces chiffres (à l'arrondi près) avec les mêmes hypothèses. S'il ne les retrouve pas, soit le code a un bug, soit une règle a changé : dans les deux cas, prévenir le joueur.

Les dégâts sont des **dégâts moyens, crits compris**, sur une cible **sans résistance**, avec **jets max** et **parchemins 100**.

## Stuffs

Les deux stuffs sont en 12 PA / 6 PM, avec le mode « sans Turquoise, Dolmanax, Vulbis, Dofus des Glaces ». Points de caractéristiques : **210 Force / 315 Intelligence** (cette répartition maximise les trois combos ci-dessous, majoritairement Feu).

### Offensif

| Slot | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Collier du YeCh'Ti |
| Anneaux | Mitaine du YeCh'Ti, Anneau de Padgref |
| Ceinture | Ceinture Bine |
| Bottes | Geta de Padgref |
| Cape | Cape Peupret |
| Arme | Katana de Spiritueur |
| Bouclier | Bras du YeCh'Ti |
| Montilier | Sakochère (+1 PA, 50 Do crit) |
| Dofus et trophées | Ocre, Pourpre, Forcené majeur, Furibond majeur, Puissant majeur, Arcaniste |

Panoplies : Padgref 3 (+1 PA), YeCh'Ti 3 (+1 PA), frigostien approximatif 2 (+1 PM).

Stats utilisées : Force 770, Intelligence 905, Agilité 590, Chance 150, Puissance 200 ; Do Terre 52, Do Feu 77, Do Air 77, Do Eau 22 (Dommages compris) ; 68 % de crit, 122 Do crit, +6 % de dommages aux sorts ; **2 625 PV**, PO +3.

### Équilibré (au moins 3 000 PV)

Mêmes pièces que l'Offensif, sauf :

| Slot | Objet |
|---|---|
| Coiffe | **Casque de Missiz Frizz** |
| Anneau | **Alliance de Missiz Frizz** (avec la Mitaine du YeCh'Ti) |
| Bottes | **Bottes de Missiz Frizz** |
| Trophées | Ocre, Pourpre, **Savant majeur, Astucieux majeur**, Puissant majeur, Arcaniste |

Panoplies : Missiz Frizz 3 (+1 PA), YeCh'Ti 3 (+1 PA), frigostien approximatif 2 (+1 PM).

Stats utilisées : Force 770, Intelligence 1 055, Agilité 380, Chance 330, Puissance 240 ; Do Terre 82, Do Feu 82, Do Air 52, Do Eau 52 ; 50 % de crit, 75 Do crit, +6 % de dommages aux sorts ; **3 425 PV**, PO +2.

L'Équilibré a été trouvé en maximisant la moyenne des dégâts des 3 combos ci-dessous, sous la contrainte PV ≥ 3 000 et PO ≥ 1 : environ −4 % de dégâts pour +800 PV. Sans contrainte de PO, on gagne 0,2 % mais on tombe à PO −1 (stuff Comte Razof), ce qui a été écarté.

### Dégâts moyens par sort (moyenne, puis normal / critique)

| Sort | Offensif | Équilibré |
|---|---|---|
| Sablier (immédiat) | 344 (222 / 390) | 318 (250 / 373) |
| Sablier (explosion) | 529 (388 / 581) | 526 (442 / 595) |
| Réfraction | 426 (299 / 473) | 410 (338 / 470) |
| Engrenage | 457 (316 / 496) | 437 (358 / 490) |
| Poussière | 642 (471 / 677) | 647 (538 / 706) |
| Sables du Temps | 704 (522 / 741) | 716 (597 / 780) |
| Souvenir | 300 (185 / 343) | 195 (139 / 241) |
| Horloge (cible en Téléfrag, +24) | 754 (600 / 786) | 742 (652 / 790) |
| Rouage | 438 (293 / 468) | 416 (334 / 461) |
| Rayon Obscur (1 Téléfrag, +12) | 826 (650 / 862) | 859 (745 / 921) |

## Combos Terre-Feu

Notation : X = le Xélor, M = le monstre. Le prototype `site/prototype.html` les montre pas à pas.

### T1 burst ✅ vérifié en jeu (ordre, positions, PA)

13 PA (Ocre actif). Départ : X à 2 cases de M, en ligne, case libre entre eux.

| # | Sort | Effet | PA |
|---|---|---|---|
| 1 | Sablier | État Sablier | 13→11 |
| 2 | Engrenage (case entre X et M) | Échange X ↔ M, Téléfrag, +2 | 11→10 |
| 3 | Sables du Temps | Double échange (rebond sur X) : chacun garde sa case, +2 | 10→8 |
| 4 | Poussière (case entre eux) | Échange, +2 | 8→6 |
| 5 | Réfraction | 1er Téléfrag consommé (Sablier 1/2) | 6→4 |
| 6 | Souvenir | M retourne sur la case de X : échange, +2 | 4→4 |
| 7 | Réfraction | 2e Téléfrag consommé : le Sablier explose | 4→2 |
| 8 | Souvenir (bonus) | Nouvel échange, sans PA rendu | 2→0 |

Total : **Offensif ≈ 4 128**, **Équilibré ≈ 3 854** (étape 8 comprise). Le combo marche aussi à 12 PA : les 7 premières étapes passent, il reste 1 PA.

### Set-up ✅ vérifié en jeu : départ du tour 2 à 22 PA

Tour 1 à 12 PA, sans ennemi et sans l'Ocre. O = case d'origine, P = case d'arrivée.

1. Se déplacer de O vers P (le nombre de cases n'a pas d'importance).
2. Cadran sur O (3 PA).
3. Flou Temporel (2 PA) : +2 PA au tour 2.
4. Rembobinage sur soi (2 PA).
5. Prémonition sur P, sa propre case (2 PA).
6. Instabilité (3 PA), glyphes entre O et P, qui contiennent X et le Cadran.
7. **Fin de tour** : Rembobinage renvoie X sur O, échange avec le Cadran (+2). Instabilité se déclenche aussitôt : retour aux positions précédentes, X en P, Cadran en O (+2).
8. **Tour du Cadran** : +2 PA à X, qui est en Téléfrag.
9. **Début du tour 2** : le glyphe renvoie X sur O, échange avec le Cadran (pas de PA). Puis la Prémonition échange X avec l'entité sur P (+2).

Décompte : 12 de base + Flou 2 + Rembobinage 2 + Instabilité 2 + Cadran 2 + Prémonition 2 = **22 PA** (23 si l'Ocre est actif).

### T2 burst, sans Cadran (simulé, retenu le 12/11/2026)

Hypothèse retenue par le joueur : X s'est déplacé et le Cadran ne sert plus. X est encore en Téléfrag grâce au set-up, et il lui reste 3 PM. Départ : **M à 4 cases de X, en ligne**, cases libres entre eux.

Règles appliquées : Horloge en ligne uniquement (✅ validé), toutes les variantes autorisées sauf Glas (niveau 200) et Perturbation (le joueur préfère Rouage, plus polyvalent), même choix de variantes à 22 et 23 PA. Grille de calcul de −40 à 40.

Choix de variantes commun (22 et 23 PA) : Poussière, Sablier, Rayon Obscur, Sables du Temps, Horloge, Rouage, Engrenage, Souvenir, Réfraction, Frappe de Xélor (Frappe sert seulement à 22 PA).

Positions : X en (0,0), M en (−4,0).

| # | Sort | Effet | PA (22) |
|---|---|---|---|
| 1 | Poussière, case à mi-chemin (−2,0) | X seul en Téléfrag : téléporté sur M, échange, +2. X (−4,0), M (0,0) | 22→20 |
| 2 | Sablier sur M | État Sablier | 20→18 |
| 3 | Rayon Obscur sur M | M en Téléfrag : +12 de base, Téléfrag consommé (Sablier 1/2) | 18→14 |
| 4 | Sables du Temps sur M | M revient à sa position précédente, la case de X : échange, +2. Pas de rebond : X est à 4 cases (❓ à vérifier en jeu). X (0,0), M (−4,0) | 14→12 |
| 5 | Horloge sur M | +24 de base, Téléfrag consommé : le Sablier explose | 12→8 |
| 6 | Rouage, case à mi-chemin (−2,0) | Les deux sont sur l'anneau : échange, +2. X (−4,0), M (0,0) | 8→6 |
| 7 | Marche de 2 PM | X en (−2,0), à 2 cases de M | 6 |
| 8 | Engrenage, case entre eux (−1,0) | Échange, +2. X (0,0), M (−2,0) | 6→5 |
| 9 | Souvenir sur M | M retourne sur la case de X : échange, +2. X (−2,0), M (0,0) | 5→5 |

Fin à **22 PA** (5 PA restants) : Réfraction sur M (Téléfrag consommé), puis Frappe de Xélor (M repoussé en (−4,0)). 0 PA.

Fin à **23 PA** (6 PA restants) : Horloge sur M (+24, M en Téléfrag après Souvenir), puis Réfraction. 0 PA.

| Stuff | T2 · 22 PA | T2 · 23 PA |
|---|---|---|
| Offensif | ≈ 5 883 | ≈ 6 175 |
| Équilibré | ≈ 5 710 | ≈ 6 009 |

Points à vérifier en jeu : Sables du Temps sans rebond quand le Xélor est à 4 cases ; la marche de 2 PM au tour 2 ; le placement à 4 cases.

Recherche : moteur JS (`moteur/`), toutes les cases de départ du monstre jusqu'à 4 cases, faisceau de 4 000 et 12 000 états. Le faisceau trouve ce combo sur l'Équilibré ; sur l'Offensif il trouve un combo voisin un peu moins fort (5 882 et 6 163, départ à 2 cases, fin en Flétrissement), et ce combo-ci a été retenu en le rejouant sur les deux stuffs. Ce n'est pas une preuve exhaustive.

⚠️ Les stuffs ci-dessus ont été optimisés sur l'ancien T2. Ils restent les stuffs de référence tant qu'ils n'ont pas été recalculés sur ce combo.

### Ancien T2 (simulé, remplacé le 12/11/2026)

Gardé comme test de non-régression du moteur. Il était le meilleur avec le choix de variantes ci-dessous, et il reste réalisable avec Horloge en ligne.

Hypothèse retenue par le joueur : X s'est déplacé et le Cadran ne sert plus. X est encore en Téléfrag grâce au set-up. Départ : M à 2 cases de X, en ligne, case libre entre eux.

Choix de variantes commun (22 et 23 PA) : Engrenage, Sablier, Horloge, Sables du Temps, Poussière, Souvenir, Rouage, Réfraction, Rayon Obscur. Pas de Glas (niveau 200), pas de Perturbation (le joueur préfère Rouage).

Tronc commun :

| # | Sort | Effet |
|---|---|---|
| 1 | Engrenage (case entre eux) | Échange, +2 |
| 2 | Sablier | État Sablier |
| 3 | Horloge | M en Téléfrag : +24 de base (Sablier 1/2) |
| 4 | Sables du Temps | Double échange, +2 |
| 5 | Horloge | +24, le Sablier explose |
| 6 | Poussière (case entre eux) | X seul en Téléfrag : il est téléporté sur M, échange, +2 |
| 7 | Souvenir | Échange, +2 |

Fin à **22 PA** (7 PA restants) :

| # | Sort | Effet |
|---|---|---|
| 8 | Engrenage, lancé sur la case juste derrière M | M recule de 2 cases, en diagonale de X (pas d'échange) |
| 9 | Rouage, sur la case diagonale entre eux | Les deux sont sur l'anneau : échange, +2 |
| 10 | Réfraction | |

Fin à **23 PA** (8 PA restants) :

| # | Sort | Effet |
|---|---|---|
| 8 | Rayon Obscur (case devant X) | M en Téléfrag dans la ligne : +12 |
| 9 et 10 | Réfraction ×2 | |

| Stuff | T2 · 22 PA | T2 · 23 PA |
|---|---|---|
| Offensif | ≈ 5 805 | ≈ 6 162 |
| Équilibré | ≈ 5 586 | ≈ 6 002 |

Recherche : simulation en grille 2D, toutes les cases de départ du monstre jusqu'à 4 cases, en gardant les 4 000 meilleurs états à chaque étape. Ce n'est pas une preuve exhaustive, mais le résultat est stable d'une relance à l'autre.

## Historique utile (ce qui a été écarté et pourquoi)

- **T2 avec Perturbation** (12/11/2026) : ≈ 5 954 à 22 PA sur l'Offensif (départ à 2 cases, fin Réfraction ×2 puis Perturbation). Écarté : le joueur préfère garder Rouage.
- **Faux T2 à 6 304** (12/11/2026) : produit par le bord de la grille du prototype (Pendule téléporté hors de la grille, puis renvoyé sur le monstre : faux Téléfrag). Grille agrandie et rendue stricte ; un test le vérifie.
- Les **combos avec Complice** ont été retirés : le joueur joue le Cadran.
- Le **T2 avec Cadran utilisable** (environ 7 000 dégâts avec Glas) a été écarté : la situation est quasi impossible en jeu, et Glas demande le niveau 200.
- **Stuff « dégâts max sur ces combos »** : Offensif avec Savant majeur et Astucieux majeur à la place de Forcené et Furibond. Il fait environ +2 % sur la moyenne des 3 combos. Non retenu pour l'instant à la demande du joueur, mais c'est une piste.
