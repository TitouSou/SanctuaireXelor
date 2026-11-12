# Moteur de combat (JS)

Portage fidèle de `sim/simulateur.py` en JavaScript (Node 18 ou plus, sans dépendance). Il tourne aussi dans le navigateur, ce qui permettra plus tard la simulation libre sur le site.

| Fichier | Rôle |
|---|---|
| `sorts.mjs` | Table des sorts (PA, PO, limites, crit, bases de dégâts), identifiants DofusDB. Copie exacte du prototype |
| `formule.mjs` | Formule des dégâts (règle 8 de `CLAUDE.md`), résistances fixe puis %. Partagée avec `outils/degats.mjs` |
| `simulateur.mjs` | Règles (téléportations, échanges, positions précédentes, Téléfrags, PA rendus…), recherche par faisceau, rejeu d'un combo |
| `stuffs_reference.mjs` | Stats des stuffs Offensif et Équilibré Terre-Feu |
| `recherche.mjs` | Équivalent de `sim/lancer_recherche.py` |

## Tests

```
node moteur/tests/test_portage.mjs           # 822 états, 32 643 successeurs : identiques au Python
node moteur/tests/test_moteur.mjs            # rejoue T1, T2 22, T2 23 avec les deux stuffs
node moteur/tests/test_moteur.mjs --recherche # + relance les recherches T2 (≈ 1 min)
```

- `test_portage` compare le JS au prototype **état par état** : pour 822 états tirés au hasard (T2, T1 et avec Cadran), tous les successeurs (chaque sort sur chaque cible, chaque marche) doivent avoir les mêmes positions, historiques, Téléfrags, PA, PM, compteurs et dégâts. La fixture `tests/fixture_python.json` se régénère avec `py moteur/tests/generer_fixture_python.py`.
- `test_moteur` vérifie les chiffres de `docs/RESULTATS_REFERENCE.md` et, avec `--recherche`, que la recherche retrouve les combos du prototype (5 856 à 22 PA, 6 080 à 23 PA avec ses constantes).

## Différences voulues avec le Python

- Les dégâts viennent des **stats d'un stuff** (paramètre `stats`), plus de constantes. `STATS_PROTOTYPE` reproduit les constantes du Python pour la comparaison.
- Résistances du monstre acceptées (`resist`).
- **Grille** de −40 à 40 dans les deux sens, et **stricte** : une téléportation hors grille lève une erreur. La grille du Python (−13 à 13 × −7 à 7) ignorait sans bruit ces téléportations ; elle a produit un faux combo à 6 304 (Pendule renvoyé sur le monstre, faux Téléfrag, +2 PA). Elle ne sert plus qu'à `test_portage` (`grille: 'prototype'`). `test_moteur` vérifie ce cas.
- Horloge se lance en ligne, Aiguille et Régulateur en ligne ou diagonale (✅ validé en jeu). Le prototype ne l'imposait pas : `ligne_dofusdb: false` (ou `--regles-prototype` pour `recherche.mjs`) retrouve ses règles, ce que fait `test_portage`.
- Les cibles d'un sort sont parcourues dans un ordre fixe : à égalité parfaite de score, l'enchaînement affiché peut différer du Python, avec les mêmes dégâts.

## Exemple

```
node moteur/recherche.mjs 22 4000 Glas,Perturbation,Permutation,Regulateur,Gelure,Ralentissement,CompteGoutte,Distorsion,Dessechement,Clepsydre
node moteur/recherche.mjs 22 4000 <mêmes sorts> --stuff offensif
```

≈ 25 s par recherche (le Python met ≈ 70 s).
