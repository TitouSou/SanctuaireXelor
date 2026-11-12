# Simulateur Python (prototype)

C'est le simulateur qui a trouvé les combos de `docs/RESULTATS_REFERENCE.md`. Il est écrit vite, mais ses règles de déplacement ont été corrigées une à une avec le joueur. **C'est la référence des mécaniques**, pas un modèle de code propre. À porter (en JS/TS, ou en Python propre pour le build) en gardant le même comportement.

Python 3.10 ou plus, sans dépendance.

## Fichiers

| Fichier | Rôle |
|---|---|
| `simulateur.py` | **Sans Cadran** (T2 burst). Grille de −13 à 13 en x et de −7 à 7 en y. Fonction `search2(PA, cases_depart_monstre, beam, depth, pm=3)` |
| `simulateur_avec_cadran.py` | Avec le Cadran sur le plateau (cas écarté, mais les règles du Cadran, de Paradoxe et de Faille y sont). Grille plus petite : attention au bord (voir plus bas). Fonction `search(...)` |
| `lancer_recherche.py` | Lance `search2` sur toutes les cases de départ du monstre jusqu'à 4 cases. Retire d'office Paradoxe et Faille (ils ont besoin du Cadran) |
| `export.py` | Rejoue un journal de recherche pas à pas et produit les étapes du plateau pour la page (positions, Téléfrags, échanges, PA). Écrit pour la version avec Cadran : à adapter |
| `nc.py` | Dégâts normal / critique / moyen de chaque sort avec les constantes du simulateur |

## Retrouver le T2 à 22 PA

```
python sim/lancer_recherche.py 22 4000 Glas,Perturbation,Permutation,Regulateur,Gelure,Ralentissement,CompteGoutte,Distorsion,Dessechement,Clepsydre
```

Environ 40 secondes. On retrouve exactement l'enchaînement de référence : Engrenage, Sablier, Horloge, Sables du Temps, Horloge (explosion), Poussière, Souvenir, Engrenage derrière M, Rouage, Réfraction. Pour 23 PA, remplacer `22` par `23`.

Le troisième argument retire des sorts. On retire Glas (niveau 200) et, pour chaque paire de variantes, celle que le joueur n'a pas choisie. Le simulateur interdit déjà de lancer les deux sorts d'une même paire dans un combo (`s.load`). Avec un beam plus petit (300), le résultat est moins bon : il faut au moins 4 000.

## Points importants

- **Les dégâts du simulateur ne sont pas ceux du site.** Les constantes en tête de `simulateur.py` (`EL`, `CRIT`, `DOC`, `MUL`) viennent d'un ancien stuff. Elles servent seulement à classer les enchaînements. La recherche donne environ 5 856 au lieu de 5 805 pour le même combo. Les chiffres publiés sont recalculés avec `outils/degats.mjs` (testé). Dans le portage, le simulateur doit recevoir les stats du stuff au lieu de constantes.
- **Options** (`OPT`) :
  - `propag` (False) : propagation d'effet en chaîne, non validée.
  - `momif_pa` (False) : Momification ne rend pas de PA (confirmé par le joueur).
  - `glas_cap` (6) : plafond de Téléfrags comptés par Glas (niveau 200, à vérifier).
  - `pous_caster` (True par défaut, lu avec `OPT.get`) : Poussière téléporte le lanceur même si l'ennemi d'en face n'est pas en Téléfrag (confirmé par le joueur).
- **Positions précédentes** : `s.hist[entité]` est une pile. Un effet « retour à la position précédente » qui vise l'entité dépile ; être déplacé comme partenaire d'échange empile. Voir `docs/MECANIQUES.md` : c'est la règle la plus délicate, validée en jeu.
- **Bord de grille** : avant l'agrandissement de la grille, Pendule « téléportait » le monstre hors de la carte et créait un faux Téléfrag. Toute grille de calcul doit être assez grande pour qu'aucune case symétrique ne sorte.
- **Recherche par faisceau** (beam) : à chaque étape, on garde les N meilleurs états selon `dégâts + 140 × PA restants`. Ce n'est pas exhaustif. Le résultat est stable d'une relance à l'autre, mais un portage peut tenter mieux (élagage exact, mémoïsation).
- **Sorts retirés par le joueur** : Réfraction et Momification ne rendent pas de PA. Glas n'est pas disponible au niveau 199. Le code peut encore contenir des traces de ces anciennes hypothèses : vérifie les options avant de lancer.
