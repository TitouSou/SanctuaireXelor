# Résultats par voie (niveau 199)

Généré par `node outils/fiche_voies.mjs` à partir de `site/data/voies/*.json` (calcul : `outils/pilote_voies.mjs`). Ne pas modifier à la main.

Tous ces combos sont **simulés** tant que le joueur ne les a pas testés en jeu (Terre-Feu : voir `docs/RESULTATS_REFERENCE.md`, vérifié en jeu).

Règles : jets max, parchemins 100, mode « sans Turquoise, Dolmanax, Vulbis, Dofus des Glaces », Ocre imposé, sans Glas (niveau 200). Un seul jeu de variantes par voie. Score d'un stuff : moyenne des 4 combos T1 et T2 (le corps à corps n'y compte pas). Équilibre entre éléments : 10 % (bi-éléments), 20 % (multi). Équilibré : au moins 3 000 PV et PO ≥ 1. Dégâts moyens, crits compris, sur un monstre sans résistance.

Notation : X = le Xélor, toujours en (0,0) au départ ; M = le monstre. TF = entités en Téléfrag après le sort.

## Sommaire

Moyenne des 4 combos T1 / T2 avec chaque stuff, puis dégâts de chaque combo avec le stuff Offensif. Dernière colonne : sorts dont l'effet vient de DofusDB et n'a pas encore été vérifié en jeu.

| Voie | Offensif | Équilibré | T1 13 | T1 12 | T2 22 | T2 23 | CàC T1 | CàC T2 | Sorts à vérifier en jeu |
|---|---|---|---|---|---|---|---|---|---|
| [Terre-Feu](#terre-feu) | 5 059 | 5 024 | 4 224 | 3 843 | 5 938 | 6 230 | 3 843 | 5 909 | aucun |
| [Terre-Eau](#terre-eau) | 4 746 | 4 743 | 3 967 | 3 678 | 5 602 | 5 735 | 3 502 | 5 595 | Gelure, Ralentissement, Régulateur, Aiguille, Astrolabe |
| [Terre-Air](#terre-air) | 4 697 | 4 697 | 3 820 | 3 523 | 5 616 | 5 830 | 3 588 | 5 571 | Distorsion, Astrolabe, Gelure, Régulateur, Gousset, Flétrissement |
| [Feu-Eau](#feu-eau) | 5 061 | 4 987 | 4 317 | 4 055 | 5 834 | 6 039 | 4 055 | 5 925 | Astrolabe, Gelure, Compte-goutte, Perturbation, Clepsydre, Flétrissement |
| [Feu-Air](#feu-air) | 5 420 | 5 357 | 4 519 | 4 202 | 6 357 | 6 601 | 4 202 | 6 357 | Astrolabe, Compte-goutte, Flétrissement, Perturbation, Gousset |
| [Eau-Air](#eau-air) | 4 809 | 4 644 | 4 085 | 3 783 | 5 532 | 5 836 | 3 783 | 5 532 | Gelure, Distorsion, Ralentissement, Flétrissement, Gousset, Pendule, Régulateur, Dessèchement, Astrolabe |
| [Terre](#terre) | 4 943 | 4 943 | 3 861 | 3 728 | 5 983 | 6 200 | 3 728 | 5 983 | Gelure, Régulateur, Astrolabe, Ralentissement |
| [Feu](#feu) | 5 670 | 5 507 | 4 743 | 4 426 | 6 647 | 6 864 | 4 426 | 6 647 | Astrolabe, Compte-goutte, Perturbation, Gousset |
| [Eau](#eau) | 4 948 | 4 948 | 4 079 | 3 829 | 5 864 | 6 022 | 3 829 | 5 864 | Permutation, Gelure, Clepsydre, Compte-goutte, Ralentissement, Pétrification, Astrolabe |
| [Air](#air) | 5 056 | 4 987 | 4 198 | 3 899 | 5 914 | 6 212 | 3 899 | 5 914 | Distorsion, Flétrissement, Gelure, Ralentissement, Gousset, Pendule, Dessèchement, Astrolabe |
| [Multi (4 éléments)](#multi-4-éléments) | 4 865 | 4 636 | 4 053 | 3 844 | 5 686 | 5 876 | 3 844 | 5 686 | Gelure, Flétrissement, Perturbation, Gousset |

## Terre-Feu

Éléments : Terre, Feu. Calculé le 13/11/2026, statut : **vérifié en jeu**.

Variantes utilisées : Rouage, Souvenir, Réfraction, Poussière, Sablier de Xélor, Engrenage, Sables du Temps, Rayon Obscur, Horloge, Frappe de Xélor, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Collier du YeCh'Ti |
| Anneau | Mitaine du YeCh'Ti |
| Anneau | Anneau de Padgref |
| Ceinture | Ceinture Hanium |
| Bottes | Geta de Padgref |
| Cape | Fût d'Aspiratueur |
| Arme | Katana de Spiritueur |
| Bouclier | Bras du YeCh'Ti |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Arcaniste |
| Dofus | Savant majeur |
| Dofus | Dofus Pourpre |
| Dofus | Furibond majeur |
| Dofus | Puissant majeur |

Panoplies : Panoplie de Padgref 3, Panoplie du YeCh'Ti 3, Panoplie des Spiritueurs 2. Points : **330 Force / 185 Intelligence**. 12 PA / 6 PM, **3 025 PV**, PO +0.
Stats : Force 850, Intelligence 915, Chance 100, Agilité 610, Puissance 120 ; Do Terre 51, Feu 76, Eau 0, Air 64 ; 72 % de crit, 137 Do crit, +6 % aux sorts. Équilibre T/F : 9 % d'écart (maximum 10 %).

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Collier du YeCh'Ti |
| Anneau | Mitaine du YeCh'Ti |
| Anneau | Anneau de Padgref |
| Ceinture | Ceinture de Brouce |
| Bottes | Geta de Padgref |
| Cape | Fût d'Aspiratueur |
| Arme | Katana de Spiritueur |
| Bouclier | Bras du YeCh'Ti |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Arcaniste |
| Dofus | Savant majeur |
| Dofus | Dofus Pourpre |
| Dofus | Furibond majeur |
| Dofus | Puissant majeur |

Panoplies : Panoplie de Padgref 3, Panoplie du YeCh'Ti 3, Panoplie des Spiritueurs 2. Points : **255 Force / 275 Intelligence**. 12 PA / 6 PM, **3 075 PV**, PO +2.
Stats : Force 815, Intelligence 945, Chance 100, Agilité 610, Puissance 120 ; Do Terre 57, Feu 64, Eau 0, Air 64 ; 72 % de crit, 137 Do crit, +6 % aux sorts. Équilibre T/F : 9 % d'écart (maximum 10 %).

### T1 burst à 13 PA (Ocre actif) ✅ vérifié en jeu

Départ : X (0,0), M (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Engrenage | (1,0) | 1 échange ; +2 PA | (2,0) | (0,0) | 13→12 | M, X |
| 2 | Sables du Temps | M | 2 échanges ; +2 PA | (2,0) | (0,0) | 12→10 | M, X |
| 3 | Poussière | (1,0) | 1 échange ; +2 PA | (0,0) | (2,0) | 10→8 | M, X |
| 4 | Sablier de Xélor | M |  | (0,0) | (2,0) | 8→6 | M, X |
| 5 | Rayon Obscur | M |  | (0,0) | (2,0) | 6→2 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (2,0) | (0,0) | 2→2 | M, X |
| 7 | Réfraction | M | Sablier explose | (2,0) | (0,0) | 2→0 | X |

Total : **Offensif ≈ 4 224**, **Équilibré ≈ 4 204**, 0 PA restants. Statut : **vérifié en jeu**.

### T1 burst à 12 PA (Ocre inactif) ✅ vérifié en jeu

Départ : X (0,0), M (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Sablier de Xélor | M |  | (0,0) | (2,0) | 12→10 | — |
| 2 | Engrenage | (1,0) | 1 échange ; +2 PA | (2,0) | (0,0) | 10→9 | M, X |
| 3 | Sables du Temps | M | 2 échanges ; +2 PA | (2,0) | (0,0) | 9→7 | M, X |
| 4 | Poussière | (1,0) | 1 échange ; +2 PA | (0,0) | (2,0) | 7→5 | M, X |
| 5 | Réfraction | M |  | (0,0) | (2,0) | 5→3 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (2,0) | (0,0) | 3→3 | M, X |
| 7 | Réfraction | M | Sablier explose | (2,0) | (0,0) | 3→1 | X |

Total : **Offensif ≈ 3 843**, **Équilibré ≈ 3 813**, 1 PA restants. Statut : **vérifié en jeu**.

### T2 burst à 22 PA ✅ vérifié en jeu

Départ : X (0,0), M (-4,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Poussière | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 22→20 | M, X |
| 2 | Sablier de Xélor | M |  | (-4,0) | (0,0) | 20→18 | M, X |
| 3 | Rayon Obscur | M |  | (-4,0) | (0,0) | 18→14 | X |
| 4 | Sables du Temps | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 14→12 | M, X |
| 5 | Horloge | M | Sablier explose | (0,0) | (-4,0) | 12→8 | X |
| 6 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 8→6 | M, X |
| 7 | Marche (2 PM) | (-2,0) |  | (-2,0) | (0,0) | 6→6 |  |
| 8 | Engrenage | (-1,0) | 1 échange ; +2 PA | (0,0) | (-2,0) | 6→5 | M, X |
| 9 | Souvenir | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 5→5 | M, X |
| 10 | Réfraction | M |  | (-2,0) | (0,0) | 5→3 | X |
| 11 | Frappe de Xélor | M |  | (-2,0) | (-4,0) | 3→0 | X |

Total : **Offensif ≈ 5 938**, **Équilibré ≈ 5 898**, 0 PA restants. Statut : **vérifié en jeu**.

### T2 burst à 23 PA ✅ vérifié en jeu

Départ : X (0,0), M (-4,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Poussière | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 23→21 | M, X |
| 2 | Sablier de Xélor | M |  | (-4,0) | (0,0) | 21→19 | M, X |
| 3 | Rayon Obscur | M |  | (-4,0) | (0,0) | 19→15 | X |
| 4 | Sables du Temps | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 15→13 | M, X |
| 5 | Horloge | M | Sablier explose | (0,0) | (-4,0) | 13→9 | X |
| 6 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 9→7 | M, X |
| 7 | Marche (2 PM) | (-2,0) |  | (-2,0) | (0,0) | 7→7 |  |
| 8 | Engrenage | (-1,0) | 1 échange ; +2 PA | (0,0) | (-2,0) | 7→6 | M, X |
| 9 | Souvenir | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 6→6 | M, X |
| 10 | Horloge | M |  | (-2,0) | (0,0) | 6→2 | X |
| 11 | Réfraction | M |  | (-2,0) | (0,0) | 2→0 | X |

Total : **Offensif ≈ 6 230**, **Équilibré ≈ 6 181**, 0 PA restants. Statut : **vérifié en jeu**.

### Corps à corps, T1 à 12 PA ✅ vérifié en jeu

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 12→10 | — |
| 2 | Sablier de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 10→8 | — |
| 3 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 8→9 | M, X |
| 4 | Sables du Temps | M | 2 échanges ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 9→7 | M, X |
| 5 | Poussière | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +2 PA | (0,0) | (2,0) | 7→5 | M, X |
| 6 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 5→5 | M, X |
| 7 | Réfraction | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 5→3 | M, X |
| 8 | Réfraction | M | Sablier explose ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 3→1 | M, X |

Total : **Offensif ≈ 3 843**, **Équilibré ≈ 3 813**, 1 PA restants. Statut : **vérifié en jeu**.

### Corps à corps, T2 à 22 PA ✅ vérifié en jeu

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 22→20 | X |
| 2 | Sablier de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 20→18 | X |
| 3 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 18→19 | M, X |
| 4 | Rayon Obscur | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 19→15 | M, X |
| 5 | Horloge | M | Sablier explose ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 15→11 | M, X |
| 6 | Sables du Temps | M | 2 échanges ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 11→9 | M, X |
| 7 | Frappe de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 9→6 | M, X |
| 8 | Réfraction | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 6→4 | M, X |
| 9 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 4→4 | M, X |
| 10 | Poussière | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +2 PA | (0,0) | (2,0) | 4→2 | M, X |
| 11 | Réfraction | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 2→0 | M, X |

Total : **Offensif ≈ 5 909**, **Équilibré ≈ 5 866**, 0 PA restants. Statut : **vérifié en jeu**.

## Terre-Eau

Éléments : Terre, Eau. Calculé le 13/11/2026, statut : **simulé**.

Variantes utilisées : Astrolabe, Rouage, Souvenir, Aiguille, Régulateur, Gelure, Ralentissement, Engrenage, Horloge, Frappe de Xélor, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Casquipik |
| Amulette | Collier Gris |
| Anneau | Anneau de Guten Tak |
| Anneau | Pikano |
| Ceinture | Ceinture Bine |
| Bottes | Pikottes |
| Cape | Cape Peupret |
| Arme | Serpe Aigrie |
| Bouclier | Bouclier Gris |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Puissant majeur |
| Dofus | Forcené majeur |
| Dofus | Voyageur |
| Dofus | Arcaniste |
| Dofus | Dofus Pourpre |

Panoplies : Pikoplie 3, Panoplie des Marteaux-Aigris 3, Panoplie du frigostien approximatif 2. Points : **260 Force / 270 Chance**. 12 PA / 6 PM, **2 995 PV**, PO +6.
Stats : Force 900, Intelligence 150, Chance 730, Agilité 150, Puissance 255 ; Do Terre 131, Feu 22, Eau 131, Air 22 ; 47 % de crit, 72 Do crit, +6 % aux sorts. Équilibre T/E : 10 % d'écart (maximum 10 %).

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Casquipik |
| Amulette | Collier Gris |
| Anneau | Anneau de Guten Tak |
| Anneau | Pikano |
| Ceinture | Ceinture Bine |
| Bottes | Pikottes |
| Cape | Cape Peupret |
| Arme | Serpe Aigrie |
| Bouclier | Bouclier Gris |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Puissant majeur |
| Dofus | Furibond majeur |
| Dofus | Voyageur |
| Dofus | Arcaniste |
| Dofus | Dofus Pourpre |

Panoplies : Pikoplie 3, Panoplie des Marteaux-Aigris 3, Panoplie du frigostien approximatif 2. Points : **290 Force / 240 Chance**. 12 PA / 6 PM, **3 195 PV**, PO +6.
Stats : Force 870, Intelligence 150, Chance 700, Agilité 150, Puissance 255 ; Do Terre 131, Feu 22, Eau 131, Air 22 ; 53 % de crit, 72 Do crit, +6 % aux sorts. Équilibre T/E : 10 % d'écart (maximum 10 %).

### T1 burst à 13 PA (Ocre actif)

Départ : X (0,0), M (-4,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 13→11 | M, X |
| 2 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 11→11 | M, X |
| 3 | Marche (2 PM) | (-2,0) |  | (-2,0) | (-4,0) | 11→11 |  |
| 4 | Engrenage | (-3,0) | 1 échange ; +2 PA | (-4,0) | (-2,0) | 11→10 | M, X |
| 5 | Ralentissement | M | +1 PA | (-4,0) | (-2,0) | 10→9 | M, X |
| 6 | Ralentissement | M | +1 PA | (-4,0) | (-2,0) | 9→8 | M, X |
| 7 | Horloge | M |  | (-4,0) | (-2,0) | 8→4 | X |
| 8 | Souvenir | M | 1 échange ; +2 PA | (-2,0) | (-4,0) | 4→4 | M, X |
| 9 | Horloge | M |  | (-2,0) | (-4,0) | 4→0 | X |

Total : **Offensif ≈ 3 967**, **Équilibré ≈ 3 962**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Ralentissement.

### T1 burst à 12 PA (Ocre inactif)

Départ : X (0,0), M (-4,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 12→10 | M, X |
| 2 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 10→10 | M, X |
| 3 | Marche (2 PM) | (-2,0) |  | (-2,0) | (-4,0) | 10→10 |  |
| 4 | Engrenage | (-3,0) | 1 échange ; +2 PA | (-4,0) | (-2,0) | 10→9 | M, X |
| 5 | Ralentissement | M | +1 PA | (-4,0) | (-2,0) | 9→8 | M, X |
| 6 | Ralentissement | M | +1 PA | (-4,0) | (-2,0) | 8→7 | M, X |
| 7 | Horloge | M |  | (-4,0) | (-2,0) | 7→3 | X |
| 8 | Souvenir | M | 1 échange ; +2 PA | (-2,0) | (-4,0) | 3→3 | M, X |
| 9 | Régulateur | M |  | (-2,0) | (-4,0) | 3→0 | X |

Total : **Offensif ≈ 3 678**, **Équilibré ≈ 3 680**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Ralentissement, Régulateur.

### T2 burst à 22 PA

Départ : X (0,0), M (-4,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 22→20 | M, X |
| 2 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 20→20 | M, X |
| 3 | Marche (2 PM) | (-2,0) |  | (-2,0) | (-4,0) | 20→20 |  |
| 4 | Engrenage | (-3,0) | 1 échange ; +2 PA | (-4,0) | (-2,0) | 20→19 | M, X |
| 5 | Ralentissement | M | +1 PA | (-4,0) | (-2,0) | 19→18 | M, X |
| 6 | Ralentissement | M | +1 PA | (-4,0) | (-2,0) | 18→17 | M, X |
| 7 | Horloge | M |  | (-4,0) | (-2,0) | 17→13 | X |
| 8 | Souvenir | M | 1 échange ; +2 PA | (-2,0) | (-4,0) | 13→13 | M, X |
| 9 | Horloge | M |  | (-2,0) | (-4,0) | 13→9 | X |
| 10 | Régulateur | M |  | (-2,0) | (-4,0) | 9→6 | X |
| 11 | Frappe de Xélor | M |  | (-2,0) | (0,0) | 6→3 | X |
| 12 | Frappe de Xélor | M |  | (-2,0) | (-4,0) | 3→0 | X |

Total : **Offensif ≈ 5 602**, **Équilibré ≈ 5 596**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Ralentissement, Régulateur.

### T2 burst à 23 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Engrenage | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 23→22 | M, X |
| 2 | Aiguille | M |  | (-2,0) | (0,0) | 22→20 | M, X |
| 3 | Horloge | M | Aiguille | (-2,0) | (0,0) | 20→16 | X |
| 4 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 16→16 | M, X |
| 5 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 16→15 | M, X |
| 6 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 15→14 | M, X |
| 7 | Horloge | M |  | (0,0) | (-2,0) | 14→10 | X |
| 8 | Engrenage | (-2,1) |  | (0,0) | (-2,2) | 10→7 | X |
| 9 | Rouage | (-1,1) | 1 échange ; +2 PA | (-2,2) | (0,0) | 7→5 | M, X |
| 10 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,2) | 5→5 | M, X |
| 11 | Régulateur | M |  | (0,0) | (-2,2) | 5→2 | X |
| 12 | Marche (2 PM) | (-2,0) |  | (-2,0) | (-2,2) | 2→2 |  |
| 13 | Gelure | M | 1 échange | (-2,2) | (-2,0) | 2→0 | M, X |

Total : **Offensif ≈ 5 735**, **Équilibré ≈ 5 736**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Aiguille, Gelure, Ralentissement, Régulateur.

### Corps à corps, T1 à 12 PA

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Gelure | M |  | (0,0) | (2,0) | 12→10 | — |
| 2 | Engrenage | (1,0) | 1 échange ; +2 PA | (2,0) | (0,0) | 10→9 | M, X |
| 3 | Gelure | M | 1 échange ; +2 PA | (0,0) | (2,0) | 9→9 | M, X |
| 4 | Ralentissement | M | +1 PA | (0,0) | (2,0) | 9→8 | M, X |
| 5 | Ralentissement | M | +1 PA | (0,0) | (2,0) | 8→7 | M, X |
| 6 | Horloge | M |  | (0,0) | (2,0) | 7→3 | X |
| 7 | Astrolabe | X | 1 échange ; +2 PA | (2,0) | (0,0) | 3→3 | M, X |
| 8 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (2,0) | 3→3 | M, X |
| 9 | Régulateur | M |  | (0,0) | (2,0) | 3→0 | X |

Total : **Offensif ≈ 3 502**, **Équilibré ≈ 3 507**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Ralentissement, Astrolabe, Régulateur.

### Corps à corps, T2 à 22 PA

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Engrenage | (1,1) |  | (0,0) | (1,2) | 22→19 | X |
| 2 | Marche (3 PM) | (-1,2) |  | (-1,2) | (1,2) | 19→19 |  |
| 3 | Espace-temps | M |  | (-1,2) | (1,2) | 19→17 | X |
| 4 | Engrenage | (0,2) | 1 échange ; Espace-temps : retour aux positions précédentes (X 1,2, M -1,2) ; +4 PA | (1,2) | (-1,2) | 17→18 | M, X |
| 5 | Horloge | M | Espace-temps : retour aux positions précédentes (X 1,2, M -1,2) | (1,2) | (-1,2) | 18→14 | M, X |
| 6 | Horloge | M | Espace-temps : retour aux positions précédentes (X 1,2, M -1,2) | (1,2) | (-1,2) | 14→10 | M, X |
| 7 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 1,2, M -1,2) ; +1 PA | (1,2) | (-1,2) | 10→9 | M, X |
| 8 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 1,2, M -1,2) ; +1 PA | (1,2) | (-1,2) | 9→8 | M, X |
| 9 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 1,2, M 1,0) ; +2 PA | (1,2) | (1,0) | 8→8 | M, X |
| 10 | Frappe de Xélor | M | Espace-temps : retour aux positions précédentes (X -1,2, M 1,0) | (-1,2) | (1,0) | 8→5 | M, X |
| 11 | Rouage | (0,1) | 1 échange ; Espace-temps : retour aux positions précédentes (X 1,0, M -1,2) ; +2 PA | (1,0) | (-1,2) | 5→3 | M, X |
| 12 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 1,0, M 2,0) ; +2 PA | (1,0) | (2,0) | 3→3 | M, X |
| 13 | Régulateur | M | Espace-temps : retour aux positions précédentes (X -1,2, M 2,0) | (-1,2) | (2,0) | 3→0 | X |

Total : **Offensif ≈ 5 595**, **Équilibré ≈ 5 589**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Ralentissement, Gelure, Régulateur.

## Terre-Air

Éléments : Terre, Air. Calculé le 13/11/2026, statut : **simulé**.

Variantes utilisées : Astrolabe, Rouage, Souvenir, Flétrissement, Régulateur, Gelure, Sablier de Xélor, Engrenage, Distorsion, Gousset, Horloge, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Bonnet Vicieux |
| Amulette | Collier du YeCh'Ti |
| Anneau | Anneau Vicieux |
| Anneau | Mitaine du YeCh'Ti |
| Ceinture | Ceinture Bine |
| Bottes | Bottes Vicieuses |
| Cape | Cape Peupret |
| Arme | Katana de Spiritueur |
| Bouclier | Bras du YeCh'Ti |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Arcaniste |
| Dofus | Furibond majeur |
| Dofus | Puissant majeur |
| Dofus | Dofus Pourpre |
| Dofus | Forcené majeur |

Panoplies : Panoplie Vicieuse 3, Panoplie du YeCh'Ti 3, Panoplie du frigostien approximatif 2. Points : **330 Force / 185 Agilité**. 12 PA / 6 PM, **3 225 PV**, PO +4.
Stats : Force 985, Intelligence 380, Chance 150, Agilité 755, Puissance 200 ; Do Terre 71, Feu 52, Eau 22, Air 90 ; 66 % de crit, 103 Do crit, +6 % aux sorts. Équilibre T/A : 9 % d'écart (maximum 10 %).

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Bonnet Vicieux |
| Amulette | Collier du YeCh'Ti |
| Anneau | Anneau Vicieux |
| Anneau | Mitaine du YeCh'Ti |
| Ceinture | Ceinture Bine |
| Bottes | Bottes Vicieuses |
| Cape | Cape Peupret |
| Arme | Katana de Spiritueur |
| Bouclier | Bras du YeCh'Ti |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Arcaniste |
| Dofus | Furibond majeur |
| Dofus | Puissant majeur |
| Dofus | Dofus Pourpre |
| Dofus | Forcené majeur |

Panoplies : Panoplie Vicieuse 3, Panoplie du YeCh'Ti 3, Panoplie du frigostien approximatif 2. Points : **330 Force / 185 Agilité**. 12 PA / 6 PM, **3 225 PV**, PO +4.
Stats : Force 985, Intelligence 380, Chance 150, Agilité 755, Puissance 200 ; Do Terre 71, Feu 52, Eau 22, Air 90 ; 66 % de crit, 103 Do crit, +6 % aux sorts. Équilibre T/A : 9 % d'écart (maximum 10 %).

### T1 burst à 13 PA (Ocre actif)

Départ : X (0,0), M (-4,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 13→11 | M, X |
| 2 | Horloge | M |  | (-4,0) | (0,0) | 11→7 | X |
| 3 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 7→7 | M, X |
| 4 | Marche (2 PM) | (-2,0) |  | (-2,0) | (-4,0) | 7→7 |  |
| 5 | Engrenage | (-3,0) | 1 échange ; +2 PA | (-4,0) | (-2,0) | 7→6 | M, X |
| 6 | Distorsion | (-3,-1) | 1 échange ; +2 PA | (-2,0) | (-4,0) | 6→4 | M, X |
| 7 | Astrolabe | X | 1 échange ; +2 PA | (-4,0) | (-2,0) | 4→4 | M, X |
| 8 | Gelure | M | 1 échange ; +2 PA | (-2,0) | (-4,0) | 4→4 | M, X |
| 9 | Horloge | M |  | (-2,0) | (-4,0) | 4→0 | X |

Total : **Offensif ≈ 3 820**, **Équilibré ≈ 3 820**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Distorsion, Astrolabe, Gelure.

### T1 burst à 12 PA (Ocre inactif)

Départ : X (0,0), M (-4,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 12→10 | M, X |
| 2 | Horloge | M |  | (-4,0) | (0,0) | 10→6 | X |
| 3 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 6→6 | M, X |
| 4 | Marche (2 PM) | (-2,0) |  | (-2,0) | (-4,0) | 6→6 |  |
| 5 | Engrenage | (-3,0) | 1 échange ; +2 PA | (-4,0) | (-2,0) | 6→5 | M, X |
| 6 | Distorsion | (-3,-1) | 1 échange ; +2 PA | (-2,0) | (-4,0) | 5→3 | M, X |
| 7 | Astrolabe | X | 1 échange ; +2 PA | (-4,0) | (-2,0) | 3→3 | M, X |
| 8 | Gelure | M | 1 échange ; +2 PA | (-2,0) | (-4,0) | 3→3 | M, X |
| 9 | Régulateur | M |  | (-2,0) | (-4,0) | 3→0 | X |

Total : **Offensif ≈ 3 523**, **Équilibré ≈ 3 523**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Distorsion, Astrolabe, Gelure, Régulateur.

### T2 burst à 22 PA

Départ : X (0,0), M (-4,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 22→20 | M, X |
| 2 | Sablier de Xélor | M |  | (-4,0) | (0,0) | 20→18 | M, X |
| 3 | Horloge | M |  | (-4,0) | (0,0) | 18→14 | X |
| 4 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 14→14 | M, X |
| 5 | Horloge | M | Sablier explose | (0,0) | (-4,0) | 14→10 | X |
| 6 | Marche (2 PM) | (-2,0) |  | (-2,0) | (-4,0) | 10→10 |  |
| 7 | Engrenage | (-3,0) | 1 échange ; +2 PA | (-4,0) | (-2,0) | 10→9 | M, X |
| 8 | Distorsion | (-3,-1) | 1 échange ; +2 PA | (-2,0) | (-4,0) | 9→7 | M, X |
| 9 | Astrolabe | X | 1 échange ; +2 PA | (-4,0) | (-2,0) | 7→7 | M, X |
| 10 | Gelure | M | 1 échange ; +2 PA | (-2,0) | (-4,0) | 7→7 | M, X |
| 11 | Régulateur | M |  | (-2,0) | (-4,0) | 7→4 | X |
| 12 | Gousset | M |  | (-2,0) | (-4,0) | 4→2 | X |
| 13 | Souvenir | M |  | (-2,0) | (-4,0) | 2→0 | X |

Total : **Offensif ≈ 5 616**, **Équilibré ≈ 5 616**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Distorsion, Astrolabe, Gelure, Régulateur, Gousset.

### T2 burst à 23 PA

Départ : X (0,0), M (-4,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 23→21 | M, X |
| 2 | Sablier de Xélor | M |  | (-4,0) | (0,0) | 21→19 | M, X |
| 3 | Horloge | M |  | (-4,0) | (0,0) | 19→15 | X |
| 4 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 15→15 | M, X |
| 5 | Horloge | M | Sablier explose | (0,0) | (-4,0) | 15→11 | X |
| 6 | Marche (2 PM) | (-2,0) |  | (-2,0) | (-4,0) | 11→11 |  |
| 7 | Engrenage | (-3,0) | 1 échange ; +2 PA | (-4,0) | (-2,0) | 11→10 | M, X |
| 8 | Distorsion | (-3,-1) | 1 échange ; +2 PA | (-2,0) | (-4,0) | 10→8 | M, X |
| 9 | Flétrissement | M |  | (-2,0) | (-4,0) | 8→5 | M, X |
| 10 | Flétrissement | M |  | (-2,0) | (-4,0) | 5→2 | M, X |
| 11 | Astrolabe | X | 1 échange ; +2 PA | (-4,0) | (-2,0) | 2→2 | M, X |
| 12 | Gelure | M | 1 échange ; +2 PA | (-2,0) | (-4,0) | 2→2 | M, X |
| 13 | Gousset | M |  | (-2,0) | (-4,0) | 2→0 | X |

Total : **Offensif ≈ 5 830**, **Équilibré ≈ 5 830**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Distorsion, Flétrissement, Astrolabe, Gelure, Gousset.

### Corps à corps, T1 à 12 PA

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 12→10 | — |
| 2 | Sablier de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 10→8 | — |
| 3 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 8→9 | M, X |
| 4 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 9→9 | M, X |
| 5 | Horloge | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 9→5 | M, X |
| 6 | Distorsion | (1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 5→3 | M, X |
| 7 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 3→3 | M, X |
| 8 | Régulateur | M | Sablier explose ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 3→0 | M, X |

Total : **Offensif ≈ 3 588**, **Équilibré ≈ 3 588**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Distorsion, Gelure, Régulateur.

### Corps à corps, T2 à 22 PA

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 22→20 | X |
| 2 | Sablier de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 20→18 | X |
| 3 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 18→19 | M, X |
| 4 | Horloge | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 19→15 | M, X |
| 5 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 15→15 | M, X |
| 6 | Horloge | M | Sablier explose ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 15→11 | M, X |
| 7 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 11→11 | M, X |
| 8 | Distorsion | (1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 11→9 | M, X |
| 9 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 9→6 | M, X |
| 10 | Régulateur | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 6→3 | M, X |
| 11 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 3→0 | M, X |

Total : **Offensif ≈ 5 571**, **Équilibré ≈ 5 571**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Distorsion, Flétrissement, Régulateur.

## Feu-Eau

Éléments : Feu, Eau. Calculé le 13/11/2026, statut : **simulé**.

Variantes utilisées : Astrolabe, Perturbation, Souvenir, Flétrissement, Réfraction, Gelure, Sablier de Xélor, Compte-goutte, Sables du Temps, Rayon Obscur, Clepsydre, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Amulette Rangleur |
| Anneau | Bague Nostik |
| Anneau | Anneau de Padgref |
| Ceinture | Ceinture Bine |
| Bottes | Geta de Padgref |
| Cape | Cape Peupret |
| Arme | Katana de Spiritueur |
| Bouclier | Sept ans de malheur |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Puissant majeur |
| Dofus | Arcaniste |
| Dofus | Joueur majeur |
| Dofus | Ravageur Eau majeur |
| Dofus | Dofus Pourpre |

Panoplies : Panoplie de Padgref 3, Panoplie Superstitieuse 3, Panoplie du frigostien approximatif 2. Points : **205 Intelligence / 318 Chance**. 12 PA / 6 PM, **2 945 PV**, PO +2.
Stats : Force 210, Intelligence 725, Chance 628, Agilité 520, Puissance 290 ; Do Terre 27, Feu 86, Eau 68, Air 86 ; 76 % de crit, 122 Do crit, +6 % aux sorts. Équilibre F/E : 10 % d'écart (maximum 10 %).

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Amulette du Glourséleste |
| Anneau | Bague de San Jifu |
| Anneau | Anneau de Padgref |
| Ceinture | Ceinture de San Jifu |
| Bottes | Geta de Padgref |
| Cape | Cape Hiculteur |
| Arme | Faux de San Jifu |
| Bouclier | Bouclier alvéolé |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Joueur majeur |
| Dofus | Dofus Pourpre |
| Dofus | Savant majeur |
| Dofus | Puissant majeur |
| Dofus | Arcaniste |

Panoplies : Panoplie de Padgref 3, Panoplie de San Jifu 3, Panoplie de l'Apiculteur 2. Points : **190 Intelligence / 327 Chance**. 12 PA / 6 PM, **3 145 PV**, PO +4.
Stats : Force 100, Intelligence 880, Chance 807, Agilité 490, Puissance 185 ; Do Terre 0, Feu 86, Eau 61, Air 47 ; 76 % de crit, 107 Do crit, +6 % aux sorts. Équilibre F/E : 10 % d'écart (maximum 10 %).

### T1 burst à 13 PA (Ocre actif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Astrolabe | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 13→13 | M, X |
| 2 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 13→13 | M, X |
| 3 | Sables du Temps | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 13→11 | M, X |
| 4 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 11→9 | M, X |
| 5 | Rayon Obscur | M |  | (-2,0) | (0,0) | 9→5 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 5→5 | M, X |
| 7 | Réfraction | M | Sablier explose | (0,0) | (-2,0) | 5→3 | X |
| 8 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-2,0) | 3→2 | M, X |
| 9 | Réfraction | M |  | (0,0) | (-2,0) | 2→0 | X |

Total : **Offensif ≈ 4 317**, **Équilibré ≈ 4 242**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Gelure, Compte-goutte.

### T1 burst à 12 PA (Ocre inactif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Astrolabe | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 12→12 | M, X |
| 2 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 12→12 | M, X |
| 3 | Sables du Temps | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 12→10 | M, X |
| 4 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 10→8 | M, X |
| 5 | Réfraction | M |  | (-2,0) | (0,0) | 8→6 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 6→6 | M, X |
| 7 | Réfraction | M | Sablier explose | (0,0) | (-2,0) | 6→4 | X |
| 8 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-2,0) | 4→3 | M, X |
| 9 | Perturbation | M |  | (0,0) | (2,0) | 3→0 | M, X |

Total : **Offensif ≈ 4 055**, **Équilibré ≈ 3 969**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Gelure, Compte-goutte, Perturbation.

### T2 burst à 22 PA

Départ : X (0,0), M (-1,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Sablier de Xélor | M |  | (0,0) | (-1,0) | 22→20 | X |
| 2 | Astrolabe | M | 1 échange ; +2 PA | (-1,0) | (0,0) | 20→20 | M, X |
| 3 | Rayon Obscur | M |  | (-1,0) | (0,0) | 20→16 | X |
| 4 | Sables du Temps | M | 2 échanges ; +2 PA | (-1,0) | (0,0) | 16→14 | M, X |
| 5 | Réfraction | M | Sablier explose | (-1,0) | (0,0) | 14→12 | X |
| 6 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-1,0) | 12→12 | M, X |
| 7 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-1,0) | 12→11 | M, X |
| 8 | Perturbation | M |  | (0,0) | (1,0) | 11→8 | M, X |
| 9 | Marche (1 PM) | (-1,0) |  | (-1,0) | (1,0) | 8→8 |  |
| 10 | Souvenir | M | 1 échange ; +2 PA | (1,0) | (-1,0) | 8→8 | M, X |
| 11 | Réfraction | M |  | (1,0) | (-1,0) | 8→6 | X |
| 12 | Perturbation | M |  | (1,0) | (3,0) | 6→3 | X |
| 13 | Compte-goutte | M | 1 échange | (3,0) | (-1,0) | 3→0 | M, X |

Total : **Offensif ≈ 5 834**, **Équilibré ≈ 5 758**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Gelure, Compte-goutte, Perturbation.

### T2 burst à 23 PA

Départ : X (0,0), M (-1,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Sablier de Xélor | M |  | (0,0) | (-1,0) | 23→21 | X |
| 2 | Astrolabe | M | 1 échange ; +2 PA | (-1,0) | (0,0) | 21→21 | M, X |
| 3 | Rayon Obscur | M |  | (-1,0) | (0,0) | 21→17 | X |
| 4 | Sables du Temps | M | 2 échanges ; +2 PA | (-1,0) | (0,0) | 17→15 | M, X |
| 5 | Réfraction | M | Sablier explose | (-1,0) | (0,0) | 15→13 | X |
| 6 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-1,0) | 13→13 | M, X |
| 7 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-1,0) | 13→12 | M, X |
| 8 | Perturbation | M |  | (0,0) | (1,0) | 12→9 | M, X |
| 9 | Marche (1 PM) | (-1,0) |  | (-1,0) | (1,0) | 9→9 |  |
| 10 | Souvenir | M | 1 échange ; +2 PA | (1,0) | (-1,0) | 9→9 | M, X |
| 11 | Réfraction | M |  | (1,0) | (-1,0) | 9→7 | X |
| 12 | Perturbation | M |  | (1,0) | (3,0) | 7→4 | X |
| 13 | Clepsydre | M |  | (1,0) | (3,0) | 4→0 | X |

Total : **Offensif ≈ 6 039**, **Équilibré ≈ 5 977**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Gelure, Compte-goutte, Perturbation, Clepsydre.

### Corps à corps, T1 à 12 PA

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Astrolabe | M | 1 échange ; +2 PA | (1,0) | (0,0) | 12→12 | M, X |
| 2 | Perturbation | M |  | (1,0) | (2,0) | 12→9 | M, X |
| 3 | Sables du Temps | M | 1 échange ; +2 PA | (0,0) | (1,0) | 9→7 | M, X |
| 4 | Souvenir | M | 1 échange ; +2 PA | (1,0) | (0,0) | 7→7 | M, X |
| 5 | Gelure | M | 1 échange ; +2 PA | (0,0) | (1,0) | 7→7 | M, X |
| 6 | Sablier de Xélor | M |  | (0,0) | (1,0) | 7→5 | M, X |
| 7 | Réfraction | M |  | (0,0) | (1,0) | 5→3 | X |
| 8 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (1,0) | 3→2 | M, X |
| 9 | Réfraction | M | Sablier explose | (0,0) | (1,0) | 2→0 | X |

Total : **Offensif ≈ 4 055**, **Équilibré ≈ 3 969**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Perturbation, Gelure, Compte-goutte.

### Corps à corps, T2 à 22 PA

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 22→20 | X |
| 2 | Sablier de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 20→18 | X |
| 3 | Astrolabe | M | 1 échange ; +2 PA | (2,0) | (0,0) | 18→18 | M, X |
| 4 | Rayon Obscur | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 18→16 | M, X |
| 5 | Réfraction | M | Sablier explose ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 16→14 | M, X |
| 6 | Sables du Temps | M | 2 échanges ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 14→12 | M, X |
| 7 | Réfraction | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 12→10 | M, X |
| 8 | Perturbation | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 10→7 | M, X |
| 9 | Compte-goutte | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 7→6 | M, X |
| 10 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 6→6 | M, X |
| 11 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 6→6 | M, X |
| 12 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 6→3 | M, X |
| 13 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 3→0 | M, X |

Total : **Offensif ≈ 5 925**, **Équilibré ≈ 5 643**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Perturbation, Compte-goutte, Gelure, Flétrissement.

## Feu-Air

Éléments : Feu, Air. Calculé le 13/11/2026, statut : **simulé**.

Variantes utilisées : Astrolabe, Perturbation, Souvenir, Flétrissement, Réfraction, Poussière, Sablier de Xélor, Compte-goutte, Sables du Temps, Rayon Obscur, Gousset, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Amulette Rangleur |
| Anneau | Bague Nostik |
| Anneau | Anneau de Padgref |
| Ceinture | Ceinture Bine |
| Bottes | Geta de Padgref |
| Cape | Cape Peupret |
| Arme | Katana de Spiritueur |
| Bouclier | Sept ans de malheur |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Dofus Pourpre |
| Dofus | Arcaniste |
| Dofus | Puissant majeur |
| Dofus | Astucieux majeur |
| Dofus | Savant majeur |

Panoplies : Panoplie de Padgref 3, Panoplie Superstitieuse 3, Panoplie du frigostien approximatif 2. Points : **265 Intelligence / 265 Agilité**. 12 PA / 6 PM, **2 745 PV**, PO +2.
Stats : Force 210, Intelligence 965, Chance 250, Agilité 785, Puissance 290 ; Do Terre 27, Feu 86, Eau 56, Air 86 ; 70 % de crit, 122 Do crit, +6 % aux sorts. Équilibre F/A : 10 % d'écart (maximum 10 %).

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Amulette Rangleur |
| Anneau | Bague Nostik |
| Anneau | Anneau de Padgref |
| Ceinture | Ceinture du Glourséleste |
| Bottes | Geta de Padgref |
| Cape | Fût d'Aspiratueur |
| Arme | Katana de Spiritueur |
| Bouclier | Sept ans de malheur |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Ravageur Feu majeur |
| Dofus | Arcaniste |
| Dofus | Dofus Pourpre |
| Dofus | Puissant majeur |
| Dofus | Savant majeur |

Panoplies : Panoplie de Padgref 3, Panoplie Superstitieuse 3, Panoplie des Spiritueurs 2. Points : **300 Intelligence / 230 Agilité**. 12 PA / 6 PM, **3 095 PV**, PO +1.
Stats : Force 230, Intelligence 940, Chance 240, Agilité 810, Puissance 210 ; Do Terre 14, Feu 95, Eau 44, Air 83 ; 72 % de crit, 137 Do crit, +6 % aux sorts. Équilibre F/A : 9 % d'écart (maximum 10 %).

### T1 burst à 13 PA (Ocre actif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Astrolabe | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 13→13 | M, X |
| 2 | Sables du Temps | M | 2 échanges ; +2 PA | (-2,0) | (0,0) | 13→11 | M, X |
| 3 | Poussière | (-1,0) | 1 échange ; +2 PA | (0,0) | (-2,0) | 11→9 | M, X |
| 4 | Sablier de Xélor | M |  | (0,0) | (-2,0) | 9→7 | M, X |
| 5 | Rayon Obscur | M |  | (0,0) | (-2,0) | 7→3 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 3→3 | M, X |
| 7 | Compte-goutte | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 3→2 | M, X |
| 8 | Réfraction | M | Sablier explose | (0,0) | (-2,0) | 2→0 | X |

Total : **Offensif ≈ 4 519**, **Équilibré ≈ 4 457**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Compte-goutte.

### T1 burst à 12 PA (Ocre inactif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Astrolabe | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 12→12 | M, X |
| 2 | Sables du Temps | M | 2 échanges ; +2 PA | (-2,0) | (0,0) | 12→10 | M, X |
| 3 | Poussière | (-1,0) | 1 échange ; +2 PA | (0,0) | (-2,0) | 10→8 | M, X |
| 4 | Sablier de Xélor | M |  | (0,0) | (-2,0) | 8→6 | M, X |
| 5 | Rayon Obscur | M |  | (0,0) | (-2,0) | 6→2 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 2→2 | M, X |
| 7 | Réfraction | M | Sablier explose | (-2,0) | (0,0) | 2→0 | X |

Total : **Offensif ≈ 4 202**, **Équilibré ≈ 4 158**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe.

### T2 burst à 22 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Poussière | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 22→20 | M, X |
| 2 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 20→18 | M, X |
| 3 | Rayon Obscur | M |  | (-2,0) | (0,0) | 18→14 | X |
| 4 | Sables du Temps | M | 2 échanges ; +2 PA | (-2,0) | (0,0) | 14→12 | M, X |
| 5 | Réfraction | M | Sablier explose | (-2,0) | (0,0) | 12→10 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 10→10 | M, X |
| 7 | Flétrissement | M |  | (0,0) | (-2,0) | 10→7 | M, X |
| 8 | Flétrissement | M |  | (0,0) | (-2,0) | 7→4 | M, X |
| 9 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-2,0) | 4→3 | M, X |
| 10 | Perturbation | M |  | (0,0) | (2,0) | 3→0 | M, X |

Total : **Offensif ≈ 6 357**, **Équilibré ≈ 6 277**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Flétrissement, Compte-goutte, Perturbation.

### T2 burst à 23 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Poussière | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 23→21 | M, X |
| 2 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 21→19 | M, X |
| 3 | Rayon Obscur | M |  | (-2,0) | (0,0) | 19→15 | X |
| 4 | Sables du Temps | M | 2 échanges ; +2 PA | (-2,0) | (0,0) | 15→13 | M, X |
| 5 | Réfraction | M | Sablier explose | (-2,0) | (0,0) | 13→11 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 11→11 | M, X |
| 7 | Flétrissement | M |  | (0,0) | (-2,0) | 11→8 | M, X |
| 8 | Flétrissement | M |  | (0,0) | (-2,0) | 8→5 | M, X |
| 9 | Réfraction | M |  | (0,0) | (-2,0) | 5→3 | X |
| 10 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-2,0) | 3→2 | M, X |
| 11 | Gousset | M |  | (0,0) | (-2,0) | 2→0 | X |

Total : **Offensif ≈ 6 601**, **Équilibré ≈ 6 534**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Flétrissement, Compte-goutte, Gousset.

### Corps à corps, T1 à 12 PA

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 12→10 | — |
| 2 | Sablier de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 10→8 | — |
| 3 | Astrolabe | M | 1 échange ; +2 PA | (2,0) | (0,0) | 8→8 | M, X |
| 4 | Sables du Temps | M | 2 échanges ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 8→8 | M, X |
| 5 | Poussière | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +2 PA | (0,0) | (2,0) | 8→6 | M, X |
| 6 | Rayon Obscur | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 6→2 | M, X |
| 7 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 2→2 | M, X |
| 8 | Réfraction | M | Sablier explose ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 4 202**, **Équilibré ≈ 4 158**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe.

### Corps à corps, T2 à 22 PA

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Sablier de Xélor | M |  | (0,0) | (1,0) | 22→20 | X |
| 2 | Astrolabe | M | 1 échange ; +2 PA | (1,0) | (0,0) | 20→20 | M, X |
| 3 | Réfraction | M |  | (1,0) | (0,0) | 20→18 | X |
| 4 | Sables du Temps | M | 2 échanges ; +2 PA | (1,0) | (0,0) | 18→16 | M, X |
| 5 | Rayon Obscur | M | Sablier explose | (1,0) | (0,0) | 16→12 | X |
| 6 | Compte-goutte | M | 1 échange ; +2 PA | (0,0) | (2,0) | 12→11 | M, X |
| 7 | Poussière | (1,0) | 1 échange ; +2 PA | (2,0) | (0,0) | 11→9 | M, X |
| 8 | Flétrissement | M |  | (2,0) | (0,0) | 9→6 | M, X |
| 9 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (2,0) | 6→6 | M, X |
| 10 | Flétrissement | M |  | (0,0) | (2,0) | 6→3 | M, X |
| 11 | Perturbation | M |  | (0,0) | (-2,0) | 3→0 | M, X |

Total : **Offensif ≈ 6 357**, **Équilibré ≈ 6 277**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Compte-goutte, Flétrissement, Perturbation.

## Eau-Air

Éléments : Eau, Air. Calculé le 13/11/2026, statut : **simulé**.

Variantes utilisées : Astrolabe, Souvenir, Flétrissement, Régulateur, Gelure, Ralentissement, Engrenage, Distorsion, Dessèchement, Gousset, Pendule, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe d'Ogivol |
| Amulette | Amulette Rangleur |
| Anneau | Anneau de Padgref |
| Anneau | Bague Nostik |
| Ceinture | Ceinture d'Ogivol |
| Bottes | Geta de Padgref |
| Cape | Cape d'Ogivol |
| Arme | Katana de Spiritueur |
| Bouclier | Sept ans de malheur |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Puissant majeur |
| Dofus | Dofus Pourpre |
| Dofus | Voyageur |
| Dofus | Arcaniste |
| Dofus | Ravageur Eau majeur |

Panoplies : Panoplie d'Ogivol 3, Panoplie Superstitieuse 3, Panoplie de Padgref 2. Points : **300 Chance / 230 Agilité**. 12 PA / 6 PM, **3 345 PV**, PO +0.
Stats : Force 390, Intelligence 410, Chance 730, Agilité 870, Puissance 210 ; Do Terre 50, Feu 54, Eau 91, Air 99 ; 72 % de crit, 107 Do crit, +6 % aux sorts. Équilibre E/A : 10 % d'écart (maximum 10 %).

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe d'Ogivol |
| Amulette | Amulette Rangleur |
| Anneau | Anneau Vicieux |
| Anneau | Bague Nostik |
| Ceinture | Ceinture d'Ogivol |
| Bottes | Bottes Vicieuses |
| Cape | Cape d'Ogivol |
| Arme | Katana de Spiritueur |
| Bouclier | Sept ans de malheur |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Dofus Pourpre |
| Dofus | Puissant majeur |
| Dofus | Voyageur |
| Dofus | Joueur majeur |
| Dofus | Arcaniste |

Panoplies : Panoplie d'Ogivol 3, Panoplie Superstitieuse 3, Panoplie Vicieuse 2. Points : **300 Chance / 230 Agilité**. 12 PA / 6 PM, **3 695 PV**, PO +1.
Stats : Force 455, Intelligence 260, Chance 790, Agilité 850, Puissance 210 ; Do Terre 56, Feu 39, Eau 79, Air 106 ; 67 % de crit, 93 Do crit, +6 % aux sorts. Équilibre E/A : 10 % d'écart (maximum 10 %).

### T1 burst à 13 PA (Ocre actif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (-2,0) | 13→11 | — |
| 2 | Engrenage | (-1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +4 PA | (-2,0) | (0,0) | 11→12 | M, X |
| 3 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 12→12 | M, X |
| 4 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 12→12 | M, X |
| 5 | Distorsion | (-1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 12→10 | M, X |
| 6 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 10→9 | M, X |
| 7 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 9→8 | M, X |
| 8 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 8→5 | M, X |
| 9 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 5→2 | M, X |
| 10 | Gousset | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 4 085**, **Équilibré ≈ 3 941**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Distorsion, Ralentissement, Flétrissement, Gousset.

### T1 burst à 12 PA (Ocre inactif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (-2,0) | 12→10 | — |
| 2 | Engrenage | (-1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +4 PA | (-2,0) | (0,0) | 10→11 | M, X |
| 3 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 11→11 | M, X |
| 4 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 11→11 | M, X |
| 5 | Distorsion | (-1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 11→9 | M, X |
| 6 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 9→7 | M, X |
| 7 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 7→6 | M, X |
| 8 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 6→5 | M, X |
| 9 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 5→2 | M, X |
| 10 | Gousset | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 3 783**, **Équilibré ≈ 3 646**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Distorsion, Ralentissement, Flétrissement, Gousset.

### T2 burst à 22 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (-2,0) | 22→20 | X |
| 2 | Engrenage | (-1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +4 PA | (-2,0) | (0,0) | 20→21 | M, X |
| 3 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 21→21 | M, X |
| 4 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 21→21 | M, X |
| 5 | Distorsion | (-1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 21→19 | M, X |
| 6 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 19→18 | M, X |
| 7 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 18→17 | M, X |
| 8 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 17→14 | M, X |
| 9 | Pendule | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 14→10 | M, X |
| 10 | Gousset | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 10→8 | M, X |
| 11 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 8→5 | M, X |
| 12 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 5→3 | M, X |
| 13 | Régulateur | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 3→0 | M, X |

Total : **Offensif ≈ 5 532**, **Équilibré ≈ 5 358**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Distorsion, Ralentissement, Flétrissement, Pendule, Gousset, Régulateur.

### T2 burst à 23 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (-2,0) | 23→21 | X |
| 2 | Engrenage | (-1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +4 PA | (-2,0) | (0,0) | 21→22 | M, X |
| 3 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 22→22 | M, X |
| 4 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 22→22 | M, X |
| 5 | Distorsion | (-1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 22→20 | M, X |
| 6 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 20→19 | M, X |
| 7 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 19→18 | M, X |
| 8 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 18→15 | M, X |
| 9 | Pendule | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 15→11 | M, X |
| 10 | Gousset | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 11→9 | M, X |
| 11 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 9→6 | M, X |
| 12 | Dessèchement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 6→2 | M, X |
| 13 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 5 836**, **Équilibré ≈ 5 632**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Distorsion, Ralentissement, Flétrissement, Pendule, Gousset, Dessèchement.

### Corps à corps, T1 à 12 PA

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Souvenir | M |  | (0,0) | (2,0) | 12→10 | — |
| 2 | Astrolabe | M | 1 échange ; +2 PA | (2,0) | (0,0) | 10→10 | M, X |
| 3 | Espace-temps | M |  | (2,0) | (0,0) | 10→8 | M, X |
| 4 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +3 PA | (2,0) | (0,0) | 8→9 | M, X |
| 5 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 9→9 | M, X |
| 6 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 9→9 | M, X |
| 7 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +2 PA | (0,0) | (2,0) | 9→8 | M, X |
| 8 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +1 PA | (0,0) | (2,0) | 8→7 | M, X |
| 9 | Distorsion | (1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 7→5 | M, X |
| 10 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 5→2 | M, X |
| 11 | Gousset | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 3 783**, **Équilibré ≈ 3 646**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Ralentissement, Gelure, Distorsion, Flétrissement, Gousset.

### Corps à corps, T2 à 22 PA

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 22→20 | X |
| 2 | Pendule | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 20→16 | X |
| 3 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 16→17 | M, X |
| 4 | Distorsion | (1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 17→15 | M, X |
| 5 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +1 PA | (2,0) | (0,0) | 15→14 | M, X |
| 6 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +1 PA | (2,0) | (0,0) | 14→13 | M, X |
| 7 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 13→10 | M, X |
| 8 | Gousset | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 10→8 | M, X |
| 9 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 8→5 | M, X |
| 10 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 5→5 | M, X |
| 11 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 5→5 | M, X |
| 12 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 5→3 | M, X |
| 13 | Régulateur | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 3→0 | M, X |

Total : **Offensif ≈ 5 532**, **Équilibré ≈ 5 358**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Pendule, Distorsion, Ralentissement, Flétrissement, Gousset, Gelure, Régulateur.

## Terre

Éléments : Terre. Calculé le 13/11/2026, statut : **simulé**.

Variantes utilisées : Astrolabe, Rouage, Souvenir, Régulateur, Gelure, Ralentissement, Engrenage, Horloge, Frappe de Xélor, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Casque de Missiz Frizz |
| Amulette | Collier Gris |
| Anneau | Alliance de Missiz Frizz |
| Anneau | Anneau de Brouce |
| Ceinture | Ceinture de Brouce |
| Bottes | Bottes de Brouce |
| Cape | Cape au Logis |
| Arme | Serpe Aigrie |
| Bouclier | Bouclier Gris |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Arcaniste |
| Dofus | Voyageur |
| Dofus | Forcené majeur |
| Dofus | Furibond majeur |
| Dofus | Dofus Pourpre |

Panoplies : Panoplie de Missiz Frizz 2, Panoplie des Marteaux-Aigris 3, Panoplie de Brouce Boulgoure 3. Points : **397 Force**. 12 PA / 6 PM, **3 895 PV**, PO +3.
Stats : Force 1 407, Intelligence 210, Chance 360, Agilité 100, Puissance 160 ; Do Terre 121, Feu 20, Eau 52, Air 0 ; 51 % de crit, 60 Do crit, +6 % aux sorts.

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Casque de Missiz Frizz |
| Amulette | Collier Gris |
| Anneau | Alliance de Missiz Frizz |
| Anneau | Anneau de Brouce |
| Ceinture | Ceinture de Brouce |
| Bottes | Bottes de Brouce |
| Cape | Cape au Logis |
| Arme | Serpe Aigrie |
| Bouclier | Bouclier Gris |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Arcaniste |
| Dofus | Voyageur |
| Dofus | Forcené majeur |
| Dofus | Furibond majeur |
| Dofus | Dofus Pourpre |

Panoplies : Panoplie de Missiz Frizz 2, Panoplie des Marteaux-Aigris 3, Panoplie de Brouce Boulgoure 3. Points : **397 Force**. 12 PA / 6 PM, **3 895 PV**, PO +3.
Stats : Force 1 407, Intelligence 210, Chance 360, Agilité 100, Puissance 160 ; Do Terre 121, Feu 20, Eau 52, Air 0 ; 51 % de crit, 60 Do crit, +6 % aux sorts.

### T1 burst à 13 PA (Ocre actif)

Départ : X (0,0), M (-4,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 13→11 | M, X |
| 2 | Horloge | M |  | (-4,0) | (0,0) | 11→7 | X |
| 3 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 7→7 | M, X |
| 4 | Engrenage | (-3,0) |  | (0,0) | (-2,0) | 7→4 | M, X |
| 5 | Engrenage | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 4→3 | M, X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 3→3 | M, X |
| 7 | Régulateur | M |  | (0,0) | (-2,0) | 3→0 | X |

Total : **Offensif ≈ 3 861**, **Équilibré ≈ 3 861**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Régulateur.

### T1 burst à 12 PA (Ocre inactif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Engrenage | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 12→11 | M, X |
| 2 | Horloge | M |  | (-2,0) | (0,0) | 11→7 | X |
| 3 | Astrolabe | X | 1 échange ; +2 PA | (0,0) | (-2,0) | 7→7 | M, X |
| 4 | Horloge | M |  | (0,0) | (-2,0) | 7→3 | X |
| 5 | Gelure | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 3→3 | M, X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 3→3 | M, X |
| 7 | Régulateur | M |  | (0,0) | (-2,0) | 3→0 | X |

Total : **Offensif ≈ 3 728**, **Équilibré ≈ 3 728**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Gelure, Régulateur.

### T2 burst à 22 PA

Départ : X (0,0), M (-4,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 22→20 | M, X |
| 2 | Horloge | M |  | (-4,0) | (0,0) | 20→16 | X |
| 3 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 16→16 | M, X |
| 4 | Horloge | M |  | (0,0) | (-4,0) | 16→12 | X |
| 5 | Engrenage | (-3,0) |  | (0,0) | (-2,0) | 12→9 | X |
| 6 | Engrenage | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 9→8 | M, X |
| 7 | Régulateur | M |  | (-2,0) | (0,0) | 8→5 | X |
| 8 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 5→5 | M, X |
| 9 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 5→4 | M, X |
| 10 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 4→3 | M, X |
| 11 | Frappe de Xélor | M |  | (0,0) | (2,0) | 3→0 | M, X |

Total : **Offensif ≈ 5 983**, **Équilibré ≈ 5 983**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Régulateur, Ralentissement.

### T2 burst à 23 PA

Départ : X (0,0), M (-4,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Rouage | (-2,0) | 1 échange ; +2 PA | (-4,0) | (0,0) | 23→21 | M, X |
| 2 | Horloge | M |  | (-4,0) | (0,0) | 21→17 | X |
| 3 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-4,0) | 17→17 | M, X |
| 4 | Horloge | M |  | (0,0) | (-4,0) | 17→13 | X |
| 5 | Engrenage | (-3,0) |  | (0,0) | (-2,0) | 13→10 | X |
| 6 | Frappe de Xélor | M |  | (0,0) | (2,0) | 10→7 | X |
| 7 | Engrenage | (1,0) | 1 échange ; +2 PA | (2,0) | (0,0) | 7→6 | M, X |
| 8 | Régulateur | M |  | (2,0) | (0,0) | 6→3 | X |
| 9 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (2,0) | 3→3 | M, X |
| 10 | Frappe de Xélor | M |  | (0,0) | (-2,0) | 3→0 | M, X |

Total : **Offensif ≈ 6 200**, **Équilibré ≈ 6 200**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Régulateur.

### Corps à corps, T1 à 12 PA

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 12→10 | — |
| 2 | Régulateur | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 10→7 | — |
| 3 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 7→8 | M, X |
| 4 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 8→8 | M, X |
| 5 | Horloge | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 8→4 | M, X |
| 6 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 4→4 | M, X |
| 7 | Horloge | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 4→0 | M, X |

Total : **Offensif ≈ 3 728**, **Équilibré ≈ 3 728**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Régulateur, Gelure.

### Corps à corps, T2 à 22 PA

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Engrenage | (1,1) |  | (0,0) | (1,2) | 22→19 | X |
| 2 | Marche (3 PM) | (-1,2) |  | (-1,2) | (1,2) | 19→19 |  |
| 3 | Espace-temps | M |  | (-1,2) | (1,2) | 19→17 | X |
| 4 | Engrenage | (0,2) | 1 échange ; Espace-temps : retour aux positions précédentes (X 1,2, M -1,2) ; +4 PA | (1,2) | (-1,2) | 17→18 | M, X |
| 5 | Horloge | M | Espace-temps : retour aux positions précédentes (X 1,2, M -1,2) | (1,2) | (-1,2) | 18→14 | M, X |
| 6 | Horloge | M | Espace-temps : retour aux positions précédentes (X 1,2, M -1,2) | (1,2) | (-1,2) | 14→10 | M, X |
| 7 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 1,2, M 1,0) ; +2 PA | (1,2) | (1,0) | 10→10 | M, X |
| 8 | Frappe de Xélor | M | Espace-temps : retour aux positions précédentes (X -1,2, M 1,0) | (-1,2) | (1,0) | 10→7 | M, X |
| 9 | Rouage | (0,1) | 1 échange ; Espace-temps : retour aux positions précédentes (X 1,0, M -1,2) ; +2 PA | (1,0) | (-1,2) | 7→5 | M, X |
| 10 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 1,0, M 2,0) ; +2 PA | (1,0) | (2,0) | 5→5 | M, X |
| 11 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -1,2, M 2,0) ; +1 PA | (-1,2) | (2,0) | 5→4 | M, X |
| 12 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +1 PA | (0,0) | (2,0) | 4→3 | M, X |
| 13 | Régulateur | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 3→0 | X |

Total : **Offensif ≈ 5 983**, **Équilibré ≈ 5 983**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Ralentissement, Régulateur.

## Feu

Éléments : Feu. Calculé le 13/11/2026, statut : **simulé**.

Variantes utilisées : Astrolabe, Perturbation, Souvenir, Réfraction, Poussière, Sablier de Xélor, Compte-goutte, Sables du Temps, Rayon Obscur, Gousset, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Amulette Rangleur |
| Anneau | Anneau de Padgref |
| Anneau | Bague Nostik |
| Ceinture | Ceinture Bine |
| Bottes | Geta de Padgref |
| Cape | Cape Peupret |
| Arme | Katana de Spiritueur |
| Bouclier | Sept ans de malheur |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Puissant majeur |
| Dofus | Arcaniste |
| Dofus | Dofus Pourpre |
| Dofus | Astucieux majeur |
| Dofus | Savant majeur |

Panoplies : Panoplie de Padgref 3, Panoplie Superstitieuse 3, Panoplie du frigostien approximatif 2. Points : **397 Intelligence**. 12 PA / 6 PM, **2 745 PV**, PO +2.
Stats : Force 210, Intelligence 1 097, Chance 250, Agilité 520, Puissance 290 ; Do Terre 27, Feu 86, Eau 56, Air 86 ; 70 % de crit, 122 Do crit, +6 % aux sorts.

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Amulette d'Otomaï |
| Anneau | Bague de San Jifu |
| Anneau | Anneau de Padgref |
| Ceinture | Ceinture de San Jifu |
| Bottes | Geta de Padgref |
| Cape | Pèlerine d'Augilol |
| Arme | Épée d'Otomaï |
| Bouclier | Fiole d'Otomaï |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Astucieux majeur |
| Dofus | Dofus Pourpre |
| Dofus | Voyageur |
| Dofus | Savant majeur |
| Dofus | Arcaniste |

Panoplies : Panoplie de Padgref 3, Panoplie d'Otomaï 3, Panoplie de San Jifu 2. Points : **397 Intelligence**. 12 PA / 6 PM, **3 045 PV**, PO +5.
Stats : Force 100, Intelligence 1 237, Chance 180, Agilité 310, Puissance 170 ; Do Terre 0, Feu 85, Eau 24, Air 25 ; 72 % de crit, 117 Do crit, +6 % aux sorts.

### T1 burst à 13 PA (Ocre actif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Astrolabe | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 13→13 | M, X |
| 2 | Sables du Temps | M | 2 échanges ; +2 PA | (-2,0) | (0,0) | 13→11 | M, X |
| 3 | Poussière | (-1,0) | 1 échange ; +2 PA | (0,0) | (-2,0) | 11→9 | M, X |
| 4 | Souvenir | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 9→9 | M, X |
| 5 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 9→7 | M, X |
| 6 | Rayon Obscur | M |  | (-2,0) | (0,0) | 7→3 | X |
| 7 | Compte-goutte | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 3→2 | M, X |
| 8 | Réfraction | M | Sablier explose | (0,0) | (-2,0) | 2→0 | X |

Total : **Offensif ≈ 4 743**, **Équilibré ≈ 4 583**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Compte-goutte.

### T1 burst à 12 PA (Ocre inactif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Astrolabe | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 12→12 | M, X |
| 2 | Sables du Temps | M | 2 échanges ; +2 PA | (-2,0) | (0,0) | 12→10 | M, X |
| 3 | Poussière | (-1,0) | 1 échange ; +2 PA | (0,0) | (-2,0) | 10→8 | M, X |
| 4 | Sablier de Xélor | M |  | (0,0) | (-2,0) | 8→6 | M, X |
| 5 | Rayon Obscur | M |  | (0,0) | (-2,0) | 6→2 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 2→2 | M, X |
| 7 | Réfraction | M | Sablier explose | (-2,0) | (0,0) | 2→0 | X |

Total : **Offensif ≈ 4 426**, **Équilibré ≈ 4 347**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe.

### T2 burst à 22 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Poussière | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 22→20 | M, X |
| 2 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 20→18 | M, X |
| 3 | Rayon Obscur | M |  | (-2,0) | (0,0) | 18→14 | X |
| 4 | Sables du Temps | M | 2 échanges ; +2 PA | (-2,0) | (0,0) | 14→12 | M, X |
| 5 | Réfraction | M | Sablier explose | (-2,0) | (0,0) | 12→10 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 10→10 | M, X |
| 7 | Perturbation | M |  | (0,0) | (2,0) | 10→7 | M, X |
| 8 | Poussière | X |  | (0,0) | (-2,0) | 7→3 | M, X |
| 9 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-2,0) | 3→2 | M, X |
| 10 | Réfraction | M |  | (0,0) | (-2,0) | 2→0 | X |

Total : **Offensif ≈ 6 647**, **Équilibré ≈ 6 500**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Perturbation, Compte-goutte.

### T2 burst à 23 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Poussière | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 23→21 | M, X |
| 2 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 21→19 | M, X |
| 3 | Rayon Obscur | M |  | (-2,0) | (0,0) | 19→15 | X |
| 4 | Sables du Temps | M | 2 échanges ; +2 PA | (-2,0) | (0,0) | 15→13 | M, X |
| 5 | Réfraction | M | Sablier explose | (-2,0) | (0,0) | 13→11 | X |
| 6 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 11→11 | M, X |
| 7 | Perturbation | M |  | (0,0) | (2,0) | 11→8 | M, X |
| 8 | Perturbation | M |  | (0,0) | (-2,0) | 8→5 | M, X |
| 9 | Réfraction | M |  | (0,0) | (-2,0) | 5→3 | X |
| 10 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-2,0) | 3→2 | M, X |
| 11 | Gousset | M |  | (0,0) | (-2,0) | 2→0 | X |

Total : **Offensif ≈ 6 864**, **Équilibré ≈ 6 596**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Perturbation, Compte-goutte, Gousset.

### Corps à corps, T1 à 12 PA

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 12→10 | — |
| 2 | Sablier de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 10→8 | — |
| 3 | Astrolabe | M | 1 échange ; +2 PA | (2,0) | (0,0) | 8→8 | M, X |
| 4 | Poussière | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +4 PA | (0,0) | (2,0) | 8→8 | M, X |
| 5 | Rayon Obscur | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 8→4 | M, X |
| 6 | Sables du Temps | M | 2 échanges ; Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +2 PA | (0,0) | (2,0) | 4→2 | M, X |
| 7 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 2→2 | M, X |
| 8 | Réfraction | M | Sablier explose ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 4 426**, **Équilibré ≈ 4 347**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe.

### Corps à corps, T2 à 22 PA

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 22→20 | X |
| 2 | Sablier de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 20→18 | X |
| 3 | Poussière | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 18→18 | M, X |
| 4 | Rayon Obscur | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 18→14 | M, X |
| 5 | Sables du Temps | M | 2 échanges ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 14→12 | M, X |
| 6 | Réfraction | M | Sablier explose ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 12→10 | M, X |
| 7 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 10→10 | M, X |
| 8 | Perturbation | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 10→7 | M, X |
| 9 | Poussière | X | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 7→3 | M, X |
| 10 | Compte-goutte | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 3→2 | M, X |
| 11 | Réfraction | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 6 647**, **Équilibré ≈ 6 500**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Perturbation, Compte-goutte.

## Eau

Éléments : Eau. Calculé le 13/11/2026, statut : **simulé**.

Variantes utilisées : Astrolabe, Permutation, Gelure, Ralentissement, Compte-goutte, Pétrification, Clepsydre, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Le Kim |
| Amulette | Collier Gris |
| Anneau | Anneau Glacial |
| Anneau | Anneau de Guten Tak |
| Ceinture | Ceinture Glaciale |
| Bottes | Sandales Circulaires du Kimbo |
| Cape | Cape Glaciale |
| Arme | Marteau Aigri |
| Bouclier | Bouclier Gris |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Voyageur |
| Dofus | Dofus Pourpre |
| Dofus | Arcaniste |
| Dofus | Taquin majeur |
| Dofus | Joueur majeur |

Panoplies : Panoplie du Kimbo 2, Panoplie des Marteaux-Aigris 3, Panoplie Glaciale 3. Points : **397 Chance**. 12 PA / 6 PM, **3 345 PV**, PO +1.
Stats : Force 450, Intelligence 100, Chance 1 337, Agilité 100, Puissance 150 ; Do Terre 77, Feu 30, Eau 128, Air 30 ; 47 % de crit, 50 Do crit, +6 % aux sorts.

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Le Kim |
| Amulette | Collier Gris |
| Anneau | Anneau Glacial |
| Anneau | Anneau de Guten Tak |
| Ceinture | Ceinture Glaciale |
| Bottes | Sandales Circulaires du Kimbo |
| Cape | Cape Glaciale |
| Arme | Marteau Aigri |
| Bouclier | Bouclier Gris |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Voyageur |
| Dofus | Dofus Pourpre |
| Dofus | Arcaniste |
| Dofus | Taquin majeur |
| Dofus | Joueur majeur |

Panoplies : Panoplie du Kimbo 2, Panoplie des Marteaux-Aigris 3, Panoplie Glaciale 3. Points : **397 Chance**. 12 PA / 6 PM, **3 345 PV**, PO +1.
Stats : Force 450, Intelligence 100, Chance 1 337, Agilité 100, Puissance 150 ; Do Terre 77, Feu 30, Eau 128, Air 30 ; 47 % de crit, 50 Do crit, +6 % aux sorts.

### T1 burst à 13 PA (Ocre actif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Permutation | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 13→11 | M, X |
| 2 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 11→11 | M, X |
| 3 | Clepsydre | M |  | (0,0) | (-2,0) | 11→7 | X |
| 4 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-2,0) | 7→6 | M, X |
| 5 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 6→5 | M, X |
| 6 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 5→4 | M, X |
| 7 | Clepsydre | M |  | (0,0) | (-2,0) | 4→0 | X |

Total : **Offensif ≈ 4 079**, **Équilibré ≈ 4 079**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Permutation, Gelure, Clepsydre, Compte-goutte, Ralentissement.

### T1 burst à 12 PA (Ocre inactif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Permutation | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 12→10 | M, X |
| 2 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 10→10 | M, X |
| 3 | Pétrification | M |  | (0,0) | (-2,0) | 10→6 | X |
| 4 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-2,0) | 6→5 | M, X |
| 5 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 5→4 | M, X |
| 6 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 4→3 | M, X |
| 7 | Pétrification | M | +1 PA | (0,0) | (-2,0) | 3→0 | X |

Total : **Offensif ≈ 3 829**, **Équilibré ≈ 3 829**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Permutation, Gelure, Pétrification, Compte-goutte, Ralentissement.

### T2 burst à 22 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Permutation | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 22→20 | M, X |
| 2 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 20→20 | M, X |
| 3 | Pétrification | M |  | (0,0) | (-2,0) | 20→16 | X |
| 4 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-2,0) | 16→15 | M, X |
| 5 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 15→14 | M, X |
| 6 | Gelure | M |  | (0,0) | (-2,0) | 14→12 | M, X |
| 7 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 12→11 | M, X |
| 8 | Pétrification | M | +1 PA | (0,0) | (-2,0) | 11→8 | X |
| 9 | Clepsydre | M |  | (0,0) | (-2,0) | 8→4 | X |
| 10 | Clepsydre | M |  | (0,0) | (-2,0) | 4→0 | X |

Total : **Offensif ≈ 5 864**, **Équilibré ≈ 5 864**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Permutation, Gelure, Pétrification, Compte-goutte, Ralentissement, Clepsydre.

### T2 burst à 23 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Permutation | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 23→21 | M, X |
| 2 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 21→21 | M, X |
| 3 | Pétrification | M |  | (0,0) | (-2,0) | 21→17 | X |
| 4 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (-2,0) | 17→16 | M, X |
| 5 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 16→15 | M, X |
| 6 | Ralentissement | M | +1 PA | (0,0) | (-2,0) | 15→14 | M, X |
| 7 | Pétrification | M | +1 PA | (0,0) | (-2,0) | 14→11 | X |
| 8 | Clepsydre | M |  | (0,0) | (-2,0) | 11→7 | X |
| 9 | Clepsydre | M |  | (0,0) | (-2,0) | 7→3 | X |
| 10 | Compte-goutte | M |  | (0,0) | (-2,0) | 3→0 | X |

Total : **Offensif ≈ 6 022**, **Équilibré ≈ 6 022**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Permutation, Gelure, Pétrification, Compte-goutte, Ralentissement, Clepsydre.

### Corps à corps, T1 à 12 PA

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Astrolabe | M | 1 échange ; +2 PA | (1,0) | (0,0) | 12→12 | M, X |
| 2 | Espace-temps | M |  | (1,0) | (0,0) | 12→10 | M, X |
| 3 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 1,0, M 0,0) ; +3 PA | (1,0) | (0,0) | 10→11 | M, X |
| 4 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 1,0, M 2,0) ; +2 PA | (1,0) | (2,0) | 11→11 | M, X |
| 5 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +1 PA | (0,0) | (2,0) | 11→10 | M, X |
| 6 | Permutation | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 10→8 | M, X |
| 7 | Pétrification | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 8→4 | M, X |
| 8 | Compte-goutte | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +2 PA | (0,0) | (2,0) | 4→3 | M, X |
| 9 | Pétrification | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) ; +1 PA | (0,0) | (2,0) | 3→0 | X |

Total : **Offensif ≈ 3 829**, **Équilibré ≈ 3 829**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Ralentissement, Gelure, Permutation, Pétrification, Compte-goutte.

### Corps à corps, T2 à 22 PA

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Gelure | M |  | (0,0) | (2,0) | 22→20 | X |
| 2 | Permutation | M | 1 échange ; +2 PA | (2,0) | (0,0) | 20→18 | M, X |
| 3 | Gelure | M | 1 échange ; +2 PA | (0,0) | (2,0) | 18→18 | M, X |
| 4 | Pétrification | M |  | (0,0) | (2,0) | 18→14 | X |
| 5 | Pétrification | M | +1 PA | (0,0) | (2,0) | 14→11 | X |
| 6 | Clepsydre | M |  | (0,0) | (2,0) | 11→7 | X |
| 7 | Compte-goutte | M | 2 échanges ; +2 PA | (0,0) | (2,0) | 7→6 | M, X |
| 8 | Ralentissement | M | +1 PA | (0,0) | (2,0) | 6→5 | M, X |
| 9 | Ralentissement | M | +1 PA | (0,0) | (2,0) | 5→4 | M, X |
| 10 | Clepsydre | M |  | (0,0) | (2,0) | 4→0 | X |

Total : **Offensif ≈ 5 864**, **Équilibré ≈ 5 864**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Permutation, Pétrification, Clepsydre, Compte-goutte, Ralentissement.

## Air

Éléments : Air. Calculé le 13/11/2026, statut : **simulé**.

Variantes utilisées : Astrolabe, Souvenir, Flétrissement, Gelure, Ralentissement, Engrenage, Distorsion, Dessèchement, Gousset, Pendule, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe d'Ogivol |
| Amulette | Amulette Rangleur |
| Anneau | Anneau de Padgref |
| Anneau | Bague Nostik |
| Ceinture | Ceinture d'Ogivol |
| Bottes | Geta de Padgref |
| Cape | Cape d'Ogivol |
| Arme | Katana de Spiritueur |
| Bouclier | Sept ans de malheur |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Arcaniste |
| Dofus | Dofus Pourpre |
| Dofus | Acrobate majeur |
| Dofus | Voyageur |
| Dofus | Equilibriste majeur |

Panoplies : Panoplie d'Ogivol 3, Panoplie Superstitieuse 3, Panoplie de Padgref 2. Points : **397 Agilité**. 12 PA / 6 PM, **3 145 PV**, PO +0.
Stats : Force 390, Intelligence 410, Chance 430, Agilité 1 217, Puissance 170 ; Do Terre 50, Feu 54, Eau 79, Air 99 ; 66 % de crit, 107 Do crit, +6 % aux sorts.

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe d'Ogivol |
| Amulette | Amulette du Glourséleste |
| Anneau | Anneau d'Allister |
| Anneau | Anneau de Padgref |
| Ceinture | Ceinture d'Ogivol |
| Bottes | Bottes d'Allister |
| Cape | Cape d'Ogivol |
| Arme | Katana de Spiritueur |
| Bouclier | Égide d'Allister |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Puissant majeur |
| Dofus | Arcaniste |
| Dofus | Acrobate majeur |
| Dofus | Dofus Pourpre |
| Dofus | Equilibriste majeur |

Panoplies : Panoplie d'Ogivol 3, Panoplie d'Allister 3. Points : **397 Agilité**. 12 PA / 6 PM, **3 245 PV**, PO +2.
Stats : Force 390, Intelligence 270, Chance 380, Agilité 1 342, Puissance 120 ; Do Terre 50, Feu 22, Eau 55, Air 100 ; 76 % de crit, 77 Do crit, +6 % aux sorts.

### T1 burst à 13 PA (Ocre actif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (-2,0) | 13→11 | — |
| 2 | Engrenage | (-1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +4 PA | (-2,0) | (0,0) | 11→12 | M, X |
| 3 | Distorsion | (-1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 12→10 | M, X |
| 4 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 10→10 | M, X |
| 5 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 10→7 | M, X |
| 6 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 7→4 | M, X |
| 7 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 4→4 | M, X |
| 8 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 4→3 | M, X |
| 9 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 3→2 | M, X |
| 10 | Gousset | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 4 198**, **Équilibré ≈ 4 074**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Distorsion, Flétrissement, Gelure, Ralentissement, Gousset.

### T1 burst à 12 PA (Ocre inactif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (-2,0) | 12→10 | — |
| 2 | Engrenage | (-1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +4 PA | (-2,0) | (0,0) | 10→11 | M, X |
| 3 | Distorsion | (-1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 11→9 | M, X |
| 4 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 9→9 | M, X |
| 5 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 9→6 | M, X |
| 6 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 6→3 | M, X |
| 7 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 3→3 | M, X |
| 8 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 3→2 | M, X |
| 9 | Gousset | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 3 899**, **Équilibré ≈ 3 832**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Distorsion, Flétrissement, Gelure, Ralentissement, Gousset.

### T2 burst à 22 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (-2,0) | 22→20 | X |
| 2 | Engrenage | (-1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +4 PA | (-2,0) | (0,0) | 20→21 | M, X |
| 3 | Distorsion | (-1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 21→19 | M, X |
| 4 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 19→19 | M, X |
| 5 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 19→16 | M, X |
| 6 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 16→13 | M, X |
| 7 | Pendule | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 13→9 | M, X |
| 8 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 9→9 | M, X |
| 9 | Dessèchement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 9→5 | M, X |
| 10 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 5→4 | M, X |
| 11 | Gousset | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 4→2 | M, X |
| 12 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 5 914**, **Équilibré ≈ 5 900**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Distorsion, Flétrissement, Pendule, Gelure, Dessèchement, Ralentissement, Gousset.

### T2 burst à 23 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (-2,0) | 23→21 | X |
| 2 | Engrenage | (-1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +4 PA | (-2,0) | (0,0) | 21→22 | M, X |
| 3 | Distorsion | (-1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 22→20 | M, X |
| 4 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 20→20 | M, X |
| 5 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 20→17 | M, X |
| 6 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 17→14 | M, X |
| 7 | Pendule | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 14→10 | M, X |
| 8 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +2 PA | (-2,0) | (0,0) | 10→10 | M, X |
| 9 | Dessèchement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 10→6 | M, X |
| 10 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 6→5 | M, X |
| 11 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) ; +1 PA | (-2,0) | (0,0) | 5→4 | M, X |
| 12 | Gousset | M | Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 4→2 | M, X |
| 13 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X -2,0, M 0,0) | (-2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 6 212**, **Équilibré ≈ 6 141**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Distorsion, Flétrissement, Pendule, Gelure, Dessèchement, Ralentissement, Gousset.

### Corps à corps, T1 à 12 PA

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Astrolabe | M | 1 échange ; +2 PA | (1,0) | (0,0) | 12→12 | M, X |
| 2 | Espace-temps | M |  | (1,0) | (0,0) | 12→10 | M, X |
| 3 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 1,0, M 2,0) ; +2 PA | (1,0) | (2,0) | 10→10 | M, X |
| 4 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 10→7 | M, X |
| 5 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 7→8 | M, X |
| 6 | Distorsion | (1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 8→6 | M, X |
| 7 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 6→3 | M, X |
| 8 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 3→3 | M, X |
| 9 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +1 PA | (2,0) | (0,0) | 3→2 | M, X |
| 10 | Gousset | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 3 899**, **Équilibré ≈ 3 832**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Astrolabe, Flétrissement, Distorsion, Gelure, Ralentissement, Gousset.

### Corps à corps, T2 à 22 PA

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 22→20 | X |
| 2 | Pendule | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 20→16 | X |
| 3 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 16→17 | M, X |
| 4 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 17→17 | M, X |
| 5 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 17→14 | M, X |
| 6 | Distorsion | (1,-1) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 14→12 | M, X |
| 7 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 12→12 | M, X |
| 8 | Dessèchement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 12→8 | M, X |
| 9 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 8→5 | M, X |
| 10 | Ralentissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +1 PA | (2,0) | (0,0) | 5→4 | M, X |
| 11 | Gousset | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 4→2 | M, X |
| 12 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 2→0 | M, X |

Total : **Offensif ≈ 5 914**, **Équilibré ≈ 5 900**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Pendule, Gelure, Flétrissement, Distorsion, Dessèchement, Ralentissement, Gousset.

## Multi (4 éléments)

Éléments : Terre, Feu, Eau, Air. Calculé le 13/11/2026, statut : **simulé**.

Variantes utilisées : Perturbation, Souvenir, Flétrissement, Réfraction, Gelure, Sablier de Xélor, Engrenage, Sables du Temps, Rayon Obscur, Gousset, Espace-temps.

### Stuff Offensif

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Amulette Rangleur |
| Anneau | Bague Nostik |
| Anneau | Anneau de Padgref |
| Ceinture | Ceinture Bine |
| Bottes | Geta de Padgref |
| Cape | Cape Peupret |
| Arme | Katana de Spiritueur |
| Bouclier | Sept ans de malheur |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Dofus Pourpre |
| Dofus | Arcaniste |
| Dofus | Puissant majeur |
| Dofus | Joueur majeur |
| Dofus | Ravageur Eau majeur |

Panoplies : Panoplie de Padgref 3, Panoplie Superstitieuse 3, Panoplie du frigostien approximatif 2. Points : **330 Force / 85 Intelligence / 100 Chance / 85 Agilité**. 12 PA / 6 PM, **2 945 PV**, PO +2.
Stats : Force 540, Intelligence 605, Chance 410, Agilité 605, Puissance 290 ; Do Terre 27, Feu 86, Eau 68, Air 86 ; 76 % de crit, 122 Do crit, +6 % aux sorts. Équilibre T/F/E/A : 20 % d'écart (maximum 20 %).

### Stuff Équilibré

| Emplacement | Objet |
|---|---|
| Coiffe | Coiffe de Padgref |
| Amulette | Amulette Rangleur |
| Anneau | Anneau de Padgref |
| Anneau | Bague Nostik |
| Ceinture | Ceinture du Père Fwetar |
| Bottes | Geta de Padgref |
| Cape | Pèlerine d'Augilol |
| Arme | Katana de Spiritueur |
| Bouclier | Sept ans de malheur |
| Familier / montilier | Sakochère |
| Dofus | Dofus Ocre |
| Dofus | Joueur majeur |
| Dofus | Dofus Pourpre |
| Dofus | Ravageur Eau majeur |
| Dofus | Puissant majeur |
| Dofus | Arcaniste |

Panoplies : Panoplie de Padgref 3, Panoplie Superstitieuse 3. Points : **335 Force / 75 Intelligence / 100 Chance / 75 Agilité**. 12 PA / 6 PM, **3 045 PV**, PO +1.
Stats : Force 495, Intelligence 545, Chance 360, Agilité 545, Puissance 310 ; Do Terre 15, Feu 74, Eau 56, Air 74 ; 72 % de crit, 132 Do crit, +6 % aux sorts. Équilibre T/F/E/A : 20 % d'écart (maximum 20 %).

### T1 burst à 13 PA (Ocre actif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Engrenage | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 13→12 | M, X |
| 2 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 12→12 | M, X |
| 3 | Sables du Temps | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 12→10 | M, X |
| 4 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 10→8 | M, X |
| 5 | Rayon Obscur | M |  | (-2,0) | (0,0) | 8→4 | X |
| 6 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 4→4 | M, X |
| 7 | Réfraction | M | Sablier explose | (0,0) | (-2,0) | 4→2 | X |
| 8 | Réfraction | M |  | (0,0) | (-2,0) | 2→0 | X |

Total : **Offensif ≈ 4 053**, **Équilibré ≈ 3 862**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure.

### T1 burst à 12 PA (Ocre inactif)

Départ : X (0,0), M (-2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Engrenage | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 12→11 | M, X |
| 2 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 11→11 | M, X |
| 3 | Sables du Temps | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 11→9 | M, X |
| 4 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 9→7 | M, X |
| 5 | Réfraction | M |  | (-2,0) | (0,0) | 7→5 | X |
| 6 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 5→5 | M, X |
| 7 | Réfraction | M | Sablier explose | (0,0) | (-2,0) | 5→3 | X |
| 8 | Flétrissement | M |  | (0,0) | (-2,0) | 3→0 | X |

Total : **Offensif ≈ 3 844**, **Équilibré ≈ 3 662**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Flétrissement.

### T2 burst à 22 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Engrenage | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 22→21 | M, X |
| 2 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 21→19 | M, X |
| 3 | Rayon Obscur | M |  | (-2,0) | (0,0) | 19→15 | X |
| 4 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 15→15 | M, X |
| 5 | Réfraction | M | Sablier explose | (0,0) | (-2,0) | 15→13 | X |
| 6 | Sables du Temps | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 13→11 | M, X |
| 7 | Flétrissement | M |  | (-2,0) | (0,0) | 11→8 | M, X |
| 8 | Réfraction | M |  | (-2,0) | (0,0) | 8→6 | X |
| 9 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 6→6 | M, X |
| 10 | Perturbation | M |  | (0,0) | (2,0) | 6→3 | M, X |
| 11 | Flétrissement | M |  | (0,0) | (2,0) | 3→0 | M, X |

Total : **Offensif ≈ 5 686**, **Équilibré ≈ 5 420**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Flétrissement, Gelure, Perturbation.

### T2 burst à 23 PA

Départ : X (0,0), M (-2,0), X en Téléfrag (set-up).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Engrenage | (-1,0) | 1 échange ; +2 PA | (-2,0) | (0,0) | 23→22 | M, X |
| 2 | Sablier de Xélor | M |  | (-2,0) | (0,0) | 22→20 | M, X |
| 3 | Rayon Obscur | M |  | (-2,0) | (0,0) | 20→16 | X |
| 4 | Souvenir | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 16→16 | M, X |
| 5 | Gousset | M | Sablier explose | (0,0) | (-2,0) | 16→14 | X |
| 6 | Sables du Temps | M | 1 échange ; +2 PA | (-2,0) | (0,0) | 14→12 | M, X |
| 7 | Réfraction | M |  | (-2,0) | (0,0) | 12→10 | X |
| 8 | Réfraction | M |  | (-2,0) | (0,0) | 10→8 | X |
| 9 | Gelure | M | 1 échange ; +2 PA | (0,0) | (-2,0) | 8→8 | M, X |
| 10 | Souvenir | M |  | (0,0) | (-2,0) | 8→6 | M, X |
| 11 | Flétrissement | M |  | (0,0) | (-2,0) | 6→3 | M, X |
| 12 | Flétrissement | M |  | (0,0) | (-2,0) | 3→0 | M, X |

Total : **Offensif ≈ 5 876**, **Équilibré ≈ 5 599**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gousset, Gelure, Flétrissement.

### Corps à corps, T1 à 12 PA

Départ : X (0,0), M (1,0), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 12→10 | — |
| 2 | Sablier de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 10→8 | — |
| 3 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 8→9 | M, X |
| 4 | Sables du Temps | M | 2 échanges ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 9→7 | M, X |
| 5 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 7→7 | M, X |
| 6 | Réfraction | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 7→5 | M, X |
| 7 | Réfraction | M | Sablier explose ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 5→3 | M, X |
| 8 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 3→3 | M, X |
| 9 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 3→0 | M, X |

Total : **Offensif ≈ 3 844**, **Équilibré ≈ 3 662**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Gelure, Flétrissement.

### Corps à corps, T2 à 22 PA

Départ : X (0,0), M (1,0), X en Téléfrag (set-up), position précédente de M en (2,0).

| # | Sort | Cible | Effet | X | M | PA | TF |
|---|---|---|---|---|---|---|---|
| 1 | Espace-temps | M |  | (0,0) | (1,0) | 22→20 | X |
| 2 | Sablier de Xélor | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 20→18 | X |
| 3 | Engrenage | (1,0) | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +4 PA | (2,0) | (0,0) | 18→19 | M, X |
| 4 | Souvenir | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 19→19 | M, X |
| 5 | Réfraction | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 19→17 | M, X |
| 6 | Rayon Obscur | M | Sablier explose ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 17→13 | M, X |
| 7 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 13→10 | M, X |
| 8 | Flétrissement | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 10→7 | M, X |
| 9 | Gelure | M | 1 échange ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 7→7 | M, X |
| 10 | Sables du Temps | M | 2 échanges ; Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) ; +2 PA | (2,0) | (0,0) | 7→5 | M, X |
| 11 | Réfraction | M | Espace-temps : retour aux positions précédentes (X 2,0, M 0,0) | (2,0) | (0,0) | 5→3 | M, X |
| 12 | Perturbation | M | Espace-temps : retour aux positions précédentes (X 0,0, M 2,0) | (0,0) | (2,0) | 3→0 | M, X |

Total : **Offensif ≈ 5 686**, **Équilibré ≈ 5 420**, 0 PA restants. Statut : **simulé**.

📘 Effets tirés de DofusDB, pas encore vérifiés en jeu : Flétrissement, Gelure, Perturbation.

