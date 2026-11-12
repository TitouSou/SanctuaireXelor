# Sanctuaire Xélor : kit de démarrage

Le kit pour construire avec Claude Code le site **Sanctuaire Xélor** : combos, stuffs et dégâts du Xélor en PvM sur Dofus 3.

## Démarrer (Windows, appli Claude)

1. Installe **Node.js 18 ou plus** et **Python 3.10 ou plus** : Claude Code en aura besoin pour lancer les scripts et les tests du projet.
2. Décompresse ce dossier dans ton dossier utilisateur, par exemple `C:\Users\<toi>\Projets\sanctuaire-xelor`.
3. Dans l'appli Claude, ouvre l'onglet **Code**. Sous la zone de saisie, choisis l'environnement **Local**, puis **Open folder…** et sélectionne ce dossier.
4. Écris par exemple :
   > Lis CLAUDE.md et les docs, puis commence l'étape 1 de la feuille de route. Pose-moi tes questions avant de coder.

Claude Code lit `CLAUDE.md` tout seul au démarrage : tout le contexte de notre conversation y est résumé, avec les règles et les décisions. Pas besoin d'installer Claude Code en ligne de commande : il est inclus dans l'appli.

## Contenu

| Dossier | Contenu |
|---|---|
| `CLAUDE.md` | Point d'entrée : but, décisions, règles de calcul, façon de travailler |
| `docs/` | Mécaniques (validé / hypothèse), résultats de référence (tests de non-régression), feuille de route |
| `data/` | Scripts de récupération DofusDB, de comparaison et d'application (c'est toi qui valides) |
| `outils/` | Calcul des dégâts en JS (testé) et optimiseur de stuff |
| `sim/` | Simulateur de combat Python qui a trouvé les combos |
| `site/prototype.html` | La page actuelle : point de départ du design |

## Vérifications rapides

```
node outils/test_reference.mjs
python sim/lancer_recherche.py 22 4000 Glas,Perturbation,Permutation,Regulateur,Gelure,Ralentissement,CompteGoutte,Distorsion,Dessechement,Clepsydre
```

Le premier doit afficher « Tous les tests passent ». Le second doit retrouver le combo T2 à 22 PA en 40 secondes environ.
