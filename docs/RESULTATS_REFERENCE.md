# Résultats de référence : voie Terre-Feu (niveau 199)

Ces résultats sont les **tests de non-régression** du moteur. Un nouveau code doit retrouver ces chiffres (à l'arrondi près) avec les mêmes hypothèses. S'il ne les retrouve pas, soit le code a un bug, soit une règle a changé : dans les deux cas, prévenir le joueur.

Les dégâts sont des **dégâts moyens, crits compris**, sur une cible **sans résistance**, avec **jets max** et **parchemins 100**.

## Stuffs (retenus le 13/11/2026)

Les deux stuffs sont en 12 PA / 6 PM, avec le mode « sans Turquoise, Dolmanax, Vulbis, Dofus des Glaces ». Ils ont été trouvés par l'optimiseur (`outils/optimiseur_stuff.mjs`) en maximisant la moyenne des trois combos ci-dessous (T1, T2 22, T2 23), sous la contrainte d'**équilibre Terre/Feu** voulue par le joueur : sur un même sort, le Feu ne tape pas plus de **10 %** au-dessus de la Terre (et inversement). Les deux sont à **9 %**.

### Offensif

| Slot | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Collier du YeCh'Ti |
| Anneaux | Mitaine du YeCh'Ti, Anneau de Padgref |
| Ceinture | **Ceinture Hanium** |
| Bottes | Geta de Padgref |
| Cape | **Fût d'Aspiratueur** (+1 PM) |
| Arme | Katana de Spiritueur |
| Bouclier | Bras du YeCh'Ti |
| Montilier | Sakochère (+1 PA, 50 Do crit) |
| Dofus et trophées | Ocre, Pourpre, Puissant majeur, Arcaniste, **Savant majeur**, Furibond majeur |

Panoplies : Padgref 3 (+1 PA), YeCh'Ti 3 (+1 PA), Spiritueurs 2 (Katana + Fût).

Points de caractéristiques : **330 Force / 185 Intelligence**.

Stats utilisées : Force 850, Intelligence 915, Agilité 610, Chance 100, Puissance 120 ; Do Terre 51, Do Feu 76, Do Air 64, Do Eau 0 (Dommages compris) ; 72 % de crit, 137 Do crit, +6 % de dommages aux sorts ; **3 025 PV**, PO 0.

### Équilibré (au moins 3 000 PV, PO ≥ 1)

Mêmes pièces que l'Offensif, sauf la ceinture : **Ceinture de Brouce** à la place de la Ceinture Hanium.

Points de caractéristiques : **255 Force / 275 Intelligence**.

Stats utilisées : Force 815, Intelligence 945, Agilité 610, Chance 100, Puissance 120 ; Do Terre 57, Do Feu 64, Do Air 64, Do Eau 0 ; 72 % de crit, 137 Do crit, +6 % de dommages aux sorts ; **3 075 PV**, PO +2.

Les deux profils sont presque confondus : l'Offensif dépasse aussi 3 000 PV, et seule la PO les distingue (0 contre +2), pour 0,7 % de dégâts d'écart.

| Stuff | T1 · 13 PA | T1 · 12 PA | T2 · 22 PA | T2 · 23 PA | Moyenne |
|---|---|---|---|---|---|
| Offensif | ≈ 4 224 | ≈ 3 843 | ≈ 5 938 | ≈ 6 230 | ≈ 5 059 |
| Équilibré | ≈ 4 204 | ≈ 3 813 | ≈ 5 898 | ≈ 6 181 | ≈ 5 024 |

Ces stuffs ont été optimisés avec l'ancien T1 (moyenne de 3 combos : ≈ 5 436 et 5 396). La moyenne compte maintenant les 4 combos.

Recherche : recuit simulé, 16 essais de 100 000 itérations. Le résultat n'est pas stable d'un essai à l'autre (chaque stuff n'est sorti qu'une ou deux fois) : ce sont les meilleurs trouvés, pas une preuve.

### Dégâts moyens par sort (moyenne, puis normal / critique)

| Sort | Offensif | Équilibré |
|---|---|---|
| Frappe de Xélor | 482 (321 / 517) | 478 (318 / 513) |
| Sablier (immédiat) | 353 (213 / 394) | 344 (204 / 386) |
| Sablier (explosion) | 527 (369 / 575) | 524 (364 / 571) |
| Réfraction | 429 (285 / 472) | 423 (278 / 466) |
| Engrenage | 476 (315 / 511) | 472 (313 / 507) |
| Poussière | 637 (448 / 665) | 635 (444 / 664) |
| Sables du Temps | 695 (496 / 725) | 695 (494 / 726) |
| Souvenir | 297 (165 / 336) | 297 (165 / 336) |
| Horloge (cible en Téléfrag, +24) | 774 (598 / 800) | 761 (587 / 787) |
| Rouage | 458 (292 / 483) | 455 (291 / 480) |
| Rayon Obscur (1 Téléfrag, +12) | 810 (616 / 839) | 814 (617 / 843) |

### Anciens stuffs (remplacés le 13/11/2026)

Gardés comme tests de non-régression (formule des dégâts, lecture des données). Ils ont été optimisés sur l'ancien T2, sans contrainte d'équilibre : écart Terre/Feu de 16 % (Offensif) et 18 % (Équilibré). Les chiffres des combos ci-dessous (≈ 4 128, 5 805…) sont calculés avec eux.


Les deux stuffs sont en 12 PA / 6 PM, avec le mode « sans Turquoise, Dolmanax, Vulbis, Dofus des Glaces ». Points de caractéristiques : **210 Force / 315 Intelligence** (cette répartition maximise les trois combos ci-dessous, majoritairement Feu).

#### Offensif

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

#### Équilibré (au moins 3 000 PV)

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

#### Dégâts moyens par sort (moyenne, puis normal / critique)

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

### T1 burst à 13 PA (Ocre actif) ✅ vérifié en jeu (ordre, positions, PA) — 13/11/2026

Trouvé par la recherche du moteur, vérifié par le joueur. Départ : X à 2 cases de M, en ligne, case libre entre eux ; X n'est pas en Téléfrag.

| # | Sort | Effet | PA |
|---|---|---|---|
| 1 | Engrenage (case entre X et M) | Échange X ↔ M, Téléfrag, +2 | 13→12 |
| 2 | Sables du Temps | Double échange (rebond sur X) : chacun garde sa case, +2 | 12→10 |
| 3 | Poussière (case entre eux) | Échange : retour aux cases de départ, +2 | 10→8 |
| 4 | Sablier | État Sablier | 8→6 |
| 5 | Rayon Obscur | M en Téléfrag : +12 de base, 1er Téléfrag consommé (Sablier 1/2) | 6→2 |
| 6 | Souvenir | M retourne sur la case de X : échange, +2 | 2→2 |
| 7 | Réfraction | 2e Téléfrag consommé : le Sablier explose | 2→0 |

Total : **Offensif ≈ 4 224**, **Équilibré ≈ 4 204** ; avec les anciens stuffs, ≈ 4 229 et ≈ 4 109.

Par rapport au T1 à 12 PA : les 4 PA de la 2e Réfraction et du 2e Souvenir (≈ 726 sur l'Offensif) servent à un Rayon Obscur sur un monstre en Téléfrag (≈ 810). Il ne vaut qu'à 13 PA : à 12 PA, il ne reste qu'1 PA après le Rayon Obscur, et il perd Souvenir, Réfraction et l'explosion du Sablier (≈ 2 971).

### T1 burst à 12 PA (Ocre inactif) ✅ vérifié en jeu (ordre, positions, PA)

Départ : X à 2 cases de M, en ligne, case libre entre eux ; X n'est pas en Téléfrag.

| # | Sort | Effet | PA |
|---|---|---|---|
| 1 | Sablier | État Sablier | 12→10 |
| 2 | Engrenage (case entre X et M) | Échange X ↔ M, Téléfrag, +2 | 10→9 |
| 3 | Sables du Temps | Double échange (rebond sur X) : chacun garde sa case, +2 | 9→7 |
| 4 | Poussière (case entre eux) | Échange, +2 | 7→5 |
| 5 | Réfraction | 1er Téléfrag consommé (Sablier 1/2) | 5→3 |
| 6 | Souvenir | M retourne sur la case de X : échange, +2 | 3→3 |
| 7 | Réfraction | 2e Téléfrag consommé : le Sablier explose | 3→1 |

Total : **Offensif ≈ 3 843**, **Équilibré ≈ 3 813** ; avec les anciens stuffs, ≈ 3 828 et ≈ 3 661. Il reste 1 PA.

La recherche à 12 PA ne fait pas vraiment mieux (≈ 3 845 sur l'Offensif, 3 822 sur l'Équilibré) et demande d'autres variantes (Gelure au lieu de Poussière, Régulateur au lieu de Réfraction) : écartée.

C'était l'ancien T1 à 13 PA, avec un 2e Souvenir en bonus (2 PA, sans PA rendu) : ≈ 4 140 sur l'Offensif, 4 110 sur l'Équilibré, ≈ 4 128 et 3 854 avec les anciens stuffs. Gardé dans les tests.

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

### T2 burst, sans Cadran ✅ vérifié en jeu (ordre, positions, PA) — retenu le 12/11/2026, testé le 13/11/2026

Hypothèse retenue par le joueur : X s'est déplacé et le Cadran ne sert plus. X est encore en Téléfrag grâce au set-up, et il lui reste 3 PM. Départ : **M à 4 cases de X, en ligne**, cases libres entre eux.

Règles appliquées : Horloge en ligne uniquement (✅ validé), toutes les variantes autorisées sauf Glas (niveau 200) et Perturbation (le joueur préfère Rouage, plus polyvalent), même choix de variantes à 22 et 23 PA. Grille de calcul de −40 à 40.

Choix de variantes commun (22 et 23 PA) : Poussière, Sablier, Rayon Obscur, Sables du Temps, Horloge, Rouage, Engrenage, Souvenir, Réfraction, Frappe de Xélor (Frappe sert seulement à 22 PA).

Positions : X en (0,0), M en (−4,0).

| # | Sort | Effet | PA (22) |
|---|---|---|---|
| 1 | Poussière, case à mi-chemin (−2,0) | X seul en Téléfrag : téléporté sur M, échange, +2. X (−4,0), M (0,0) | 22→20 |
| 2 | Sablier sur M | État Sablier | 20→18 |
| 3 | Rayon Obscur sur M | M en Téléfrag : +12 de base, Téléfrag consommé (Sablier 1/2) | 18→14 |
| 4 | Sables du Temps sur M | M revient à sa position précédente, la case de X : échange, +2. Pas de rebond : X est à 4 cases (✅ vérifié). X (0,0), M (−4,0) | 14→12 |
| 5 | Horloge sur M | +24 de base, Téléfrag consommé : le Sablier explose | 12→8 |
| 6 | Rouage, case à mi-chemin (−2,0) | Les deux sont sur l'anneau : échange, +2. X (−4,0), M (0,0) | 8→6 |
| 7 | Marche de 2 PM | X en (−2,0), à 2 cases de M | 6 |
| 8 | Engrenage, case entre eux (−1,0) | Échange, +2. X (0,0), M (−2,0) | 6→5 |
| 9 | Souvenir sur M | M retourne sur la case de X : échange, +2. X (−2,0), M (0,0) | 5→5 |

Fin à **22 PA** (5 PA restants) : Réfraction sur M (Téléfrag consommé), puis Frappe de Xélor (M repoussé en (−4,0)). 0 PA.

Fin à **23 PA** (6 PA restants) : Horloge sur M (+24, M en Téléfrag après Souvenir), puis Réfraction. 0 PA.

| Stuff | T2 · 22 PA | T2 · 23 PA |
|---|---|---|
| Offensif | ≈ 5 938 | ≈ 6 230 |
| Équilibré | ≈ 5 898 | ≈ 6 181 |
| Ancien Offensif | ≈ 5 883 | ≈ 6 175 |
| Ancien Équilibré | ≈ 5 710 | ≈ 6 009 |

Avec les nouveaux stuffs, la recherche ne trouve rien de mieux (5 932 et 6 202 sur l'Offensif, 5 893 et 6 149 sur l'Équilibré).

Vérifié en jeu par le joueur avec son stuff : pas de rebond de Sables du Temps à 4 cases, marche de 2 PM possible (cas général), Sablier qui explose sur l'Horloge, 0 PA à la fin.

Recherche : moteur JS (`moteur/`), toutes les cases de départ du monstre jusqu'à 4 cases, faisceau de 4 000 et 12 000 états. Le faisceau trouve ce combo sur l'Équilibré ; sur l'Offensif il trouve un combo voisin un peu moins fort (5 882 et 6 163, départ à 2 cases, fin en Flétrissement), et ce combo-ci a été retenu en le rejouant sur les deux stuffs. Ce n'est pas une preuve exhaustive.


### Monstre au corps à corps au départ ✅ vérifié en jeu (ordre, positions, PA) — 13/11/2026

Situation définie par le joueur (voir `docs/MECANIQUES.md`) : le monstre vient de frapper le Xélor, donc pas de PA de l'Ocre. **T1 à 12 PA** (X pas en Téléfrag) et **T2 à 22 PA** (X en Téléfrag grâce au set-up, Cadran inutilisé). M est collé en ligne. Sa position précédente est la case à l'opposé de X. Tacle actif : aucun des combos ci-dessous ne marche, il ne joue donc pas.

Les **4 combos** (T1 et T2, avec et sans Espace-temps) ont été testés en jeu par le joueur avec son stuff : tous fonctionnent. Les combos avec Espace-temps sont les plus forts ; ceux sans Espace-temps restent utiles si l'on a pris Désynchronisation (paire 22) ou si Espace-temps est en relance.

Positions : X en (0,0), M en (1,0), position précédente de M en (2,0). Les combos n'utilisent que les variantes habituelles (celles des T1 et T2 de référence), plus **Espace-temps** (paire 22) ou **Astrolabe** (paire 1), qui ne servent dans aucun autre combo.

Recherche : moteur JS, faisceau de 12 000, sans Glas ni Perturbation. Avec toutes les variantes, la recherche fait à peine mieux (T1 : 3 845 sur l'Offensif et 3 822 sur l'Équilibré, avec Gelure et Régulateur) : écarté, pour garder les mêmes variantes que les autres combos.

**Désynchronisation** n'apporte rien (même résultat qu'avec ni l'un ni l'autre). **Espace-temps** apporte **+8,5 % au T1** et +0,4 % au T2. Il dure 1 tour et ne se relance que tous les 3 tours (DofusDB).

#### T1 à 12 PA, avec Espace-temps (meilleur)

| # | Sort | Effet | Positions après | PA |
|---|---|---|---|---|
| 1 | Espace-temps sur M | État Espace-temps | X (0,0), M (1,0) | 12→10 |
| 2 | Sablier sur M | Espace-temps : M retourne à sa position précédente, la case libre (2,0). X n'a pas de position précédente : il ne bouge pas | X (0,0), M (2,0) | 10→8 |
| 3 | Engrenage, case entre eux (1,0) | Échange, +2. Espace-temps : M revient sur X (échange), puis X revient sur M (échange), +2 | X (2,0), M (0,0) | 8→9 |
| 4 | Sables du Temps sur M | Double échange (rebond sur X), +2 ; Espace-temps : deux échanges, personne ne bouge | X (2,0), M (0,0) | 9→7 |
| 5 | Poussière, case entre eux (1,0) | Échange, +2 ; Espace-temps : retour aux cases précédentes | X (0,0), M (2,0) | 7→5 |
| 6 | Souvenir sur M | Échange, +2 ; Espace-temps | X (2,0), M (0,0) | 5→5 |
| 7 | Réfraction sur M | 1er Téléfrag consommé (Sablier 1/2) ; Espace-temps le redonne | X (2,0), M (0,0) | 5→3 |
| 8 | Réfraction sur M | 2e Téléfrag consommé : le Sablier explose | X (2,0), M (0,0) | 3→1 |

Total : **Offensif ≈ 3 843**, **Équilibré ≈ 3 813**, il reste 1 PA. Ce sont exactement les dégâts du T1 à 12 PA de référence : mêmes sorts, et Espace-temps (2 PA, +2 PA) remplace la distance de 2 cases du départ.

#### T1 à 12 PA, sans Espace-temps

| # | Sort | Effet | Positions après | PA |
|---|---|---|---|---|
| 1 | Sablier sur M | État Sablier | X (0,0), M (1,0) | 12→10 |
| 2 | Astrolabe sur M | X se téléporte sur M : échange, +2 | X (1,0), M (0,0) | 10→10 |
| 3 | Réfraction sur M | 1er Téléfrag consommé (Sablier 1/2) | X (1,0), M (0,0) | 10→8 |
| 4 | Sables du Temps sur M | Double échange (rebond sur X), +2 : chacun garde sa case | X (1,0), M (0,0) | 8→6 |
| 5 | Rayon Obscur sur M | +12 de base, 2e Téléfrag consommé : le Sablier explose | X (1,0), M (0,0) | 6→2 |
| 6 | Souvenir sur M | M retourne sur la case de X : échange, +2 | X (0,0), M (1,0) | 2→2 |
| 7 | Réfraction sur M | Téléfrag consommé | X (0,0), M (1,0) | 2→0 |

Total : **Offensif ≈ 3 541**, **Équilibré ≈ 3 519**. Sur l'Équilibré, la recherche place Souvenir avant le Rayon Obscur, pour les mêmes dégâts.

#### T2 à 22 PA, avec Espace-temps (meilleur)

| # | Sort | Effet | Positions après | PA |
|---|---|---|---|---|
| 1 | Espace-temps sur M | État Espace-temps | X (0,0), M (1,0) | 22→20 |
| 2 | Sablier sur M | Espace-temps : M retourne en (2,0) | X (0,0), M (2,0) | 20→18 |
| 3 | Engrenage (1,0) | Échange, +2 ; Espace-temps : deux échanges, +2 | X (2,0), M (0,0) | 18→19 |
| 4 | Rayon Obscur sur M | +12, Téléfrag consommé (Sablier 1/2) ; Espace-temps le redonne | X (2,0), M (0,0) | 19→15 |
| 5 | Horloge sur M | +24, Téléfrag consommé : le Sablier explose | X (2,0), M (0,0) | 15→11 |
| 6 | Sables du Temps sur M | Double échange (rebond sur X), +2 | X (2,0), M (0,0) | 11→9 |
| 7 | Frappe de Xélor sur M | M repoussé en (4,0) ; Espace-temps : M revient en (0,0), puis X revient en (0,0) (échange) | X (0,0), M (2,0) | 9→6 |
| 8 | Réfraction sur M | Téléfrag consommé, redonné par Espace-temps | X (0,0), M (2,0) | 6→4 |
| 9 | Souvenir sur M | Échange, +2 | X (2,0), M (0,0) | 4→4 |
| 10 | Poussière (1,0) | Échange, +2 | X (0,0), M (2,0) | 4→2 |
| 11 | Réfraction sur M | | X (0,0), M (2,0) | 2→0 |

Total : **Offensif ≈ 5 909**, **Équilibré ≈ 5 866**.

#### T2 à 22 PA, sans Espace-temps

| # | Sort | Effet | Positions après | PA |
|---|---|---|---|---|
| 1 | Souvenir sur M | M retourne sur sa case précédente (2,0), libre | X (0,0), M (2,0) | 22→20 |
| 2 | Poussière, case entre eux (1,0) | X seul en Téléfrag : téléporté sur M, échange, +2 | X (2,0), M (0,0) | 20→18 |
| 3 | Sablier sur M | État Sablier | X (2,0), M (0,0) | 18→16 |
| 4 | Rayon Obscur sur M | +12, 1er Téléfrag consommé (Sablier 1/2) | X (2,0), M (0,0) | 16→12 |
| 5 | Engrenage (1,0) | Échange, +2 | X (0,0), M (2,0) | 12→11 |
| 6 | Réfraction sur M | 2e Téléfrag consommé : le Sablier explose | X (0,0), M (2,0) | 11→9 |
| 7 | Sables du Temps sur M | Double échange (rebond sur X), +2 | X (0,0), M (2,0) | 9→7 |
| 8 | Souvenir sur M | M retourne sur la case de X : échange, +2 | X (2,0), M (0,0) | 7→7 |
| 9 | Engrenage, case juste derrière M (0,1) | M recule en (0,2), en diagonale de X, pas d'échange | X (2,0), M (0,2) | 7→4 |
| 10 | Rouage, case diagonale entre eux (1,1) | Les deux sont sur l'anneau : échange, +2 | X (0,2), M (2,0) | 4→2 |
| 11 | Réfraction sur M | Téléfrag consommé | X (0,2), M (2,0) | 2→0 |

Total : **Offensif ≈ 5 884**, **Équilibré ≈ 5 851**.

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

- **Règles corrigées par le joueur** (14/11/2026 : Aiguille, Régulateur, Compte-goutte ; voir `docs/MECANIQUES.md`). Avec elles, le pilote des voies trouve des combos Terre-Feu **plus forts** que ceux vérifiés en jeu ci-dessus, grâce à l'Aiguille (paire 4) : T1 à 13 PA ≈ 4 495 (+6,4 %), T1 à 12 PA ≈ 3 859, T2 à 22 PA ≈ 6 241 (+5,1 %), T2 à 23 PA ≈ 6 527 (+4,8 %), corps à corps ≈ 3 859 et 6 120 ; stuff Offensif avec Ravageur Terre majeur au lieu de Savant majeur (285 Force / 245 Intelligence), Équilibré inchangé. Ils sont **simulés** (`docs/RESULTATS_VOIES.md`, à tester en jeu) ; les combos et stuffs ci-dessus restent la référence vérifiée et les tests de non-régression.

- **Désynchronisation et Espace-temps** (13/11/2026), ajoutés au moteur : aucun gain sur le T1 ni sur le T2 Terre-Feu. À deux entités, le piège ne peut pas créer d'échange. Même imposé en premier sort, Espace-temps redonne au mieux exactement les mêmes dégâts (il coûte 2 PA et en rend 2). Au corps à corps (13/11/2026), Espace-temps gagne +8,5 % au T1 et +0,4 % au T2 (vérifié en jeu) ; Désynchronisation toujours rien. À revoir avec le Cadran ou une Synchro sur le plateau.
- **T1 dissocié** (13/11/2026) : la première recherche T1 du moteur a trouvé un T1 plus fort de 2 % à 13 PA, vérifié en jeu. Il devient le T1 à 13 PA ; l'ancien T1 (sans son 2e Souvenir) devient le T1 à 12 PA.
- **T2 avec Perturbation** (12/11/2026) : ≈ 5 954 à 22 PA sur l'Offensif (départ à 2 cases, fin Réfraction ×2 puis Perturbation). Écarté : le joueur préfère garder Rouage.
- **Faux T2 à 6 304** (12/11/2026) : produit par le bord de la grille du prototype (Pendule téléporté hors de la grille, puis renvoyé sur le monstre : faux Téléfrag). Grille agrandie et rendue stricte ; un test le vérifie.
- Les **combos avec Complice** ont été retirés : le joueur joue le Cadran.
- Le **T2 avec Cadran utilisable** (environ 7 000 dégâts avec Glas) a été écarté : la situation est quasi impossible en jeu, et Glas demande le niveau 200.
- **Stuff « dégâts max sur ces combos »** : Offensif avec Savant majeur et Astucieux majeur à la place de Forcené et Furibond. Il fait environ +2 % sur la moyenne des 3 combos. Non retenu pour l'instant à la demande du joueur, mais c'est une piste.
