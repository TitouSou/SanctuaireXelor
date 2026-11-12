# Données DofusDB

Toutes les données de jeu viennent de l'API **DofusDB** (`https://api.dofusdb.fr`).

## Mettre à jour (c'est toujours le joueur qui décide)

```
node data/fetch_dofusdb.mjs     # récupère dans data/incoming/ (rien n'est appliqué)
node data/diff.mjs              # compare avec data/current/, écrit data/diff-report.md
node data/apply.mjs --oui       # seulement si le rapport est correct
```

Après une mise à jour appliquée : relancer le build et les tests de non-régression (`docs/RESULTATS_REFERENCE.md`).

## Contenu

| Fichier | Contenu |
|---|---|
| `characteristics.json` | Identifiants des caractéristiques (1 = PA, 23 = PM, 10 = Force, 15 = Intelligence, 18 = % crit, 86 = Do crit, 88 à 92 = dommages Terre/Feu/Eau/Air/Neutre, 33 à 37 = % résistances…) |
| `effects.json` | Identifiants des effets, avec leur description. Une description qui commence par `-#1` signale un malus |
| `items.json` | Équipements de niveau 160 à 200, équipements de bas niveau donnant PA ou PM, familiers, montiliers, Dofus, trophées |
| `item-sets.json` | Panoplies. `effects[k]` = bonus pour k+1 pièces |
| `spell-variants.json`, `spells.json`, `spell-levels.json` | Sorts du Xélor (classe 5), toutes les variantes et tous les grades. Le grade utilisé est le plus haut dont `minPlayerLevel` ≤ 199 |
| `spells-annexes.json` | Sous-sorts utiles : Téléfrag (+2 PA), effets des Dofus Ocre et Vulbis, etc. |

## Pièges connus

- L'API limite à **50 résultats par page** : tous les scripts paginent avec `$skip`.
- Les lignes d'effet dont `characteristic` vaut −1 sont des dégâts d'arme ou des effets à l'impact : ne pas les compter comme des stats.
- Les conditions d'objet (`criterions`) : `pk<2` signale un trophée à condition (voir la règle actuelle dans `CLAUDE.md`). Les conditions de quête (`Qa`, `Qo`…) et `CP<12|CM<6` excluent l'objet.
- Les identifiants de types (`typeId`) utilisés par les scripts sont à revérifier dans `item-types.json` à la première récupération. Si un emplacement de l'optimiseur a 0 candidat, c'est qu'un type manque.
- Si l'API refuse les requêtes depuis ta machine (pare-feu, limitation), relance plus tard. En dernier recours, on peut lancer les mêmes requêtes depuis la console du navigateur, sur une page de `api.dofusdb.fr`.
