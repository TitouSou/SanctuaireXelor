# Outils JS (Node 18 ou plus)

| Fichier | Rôle | État |
|---|---|---|
| `degats.mjs` | Formule de dégâts (règle 8 de `CLAUDE.md`), bases des sorts au niveau 199, combos Terre-Feu exprimés en nombre de lancers par sort | ✅ testé |
| `test_reference.mjs` | Retrouve, à partir des stats de référence, les dégâts par sort et les totaux T1 / T2 22 / T2 23 des deux stuffs | ✅ passe (écart ≤ 2 dû aux arrondis) |
| `optimiseur_stuff.mjs` | Recuit simulé (mouvements d'un objet ou d'une panoplie entière) puis descente coordonnée sur `data/current/`. Maximise la moyenne des combos de la voie, sous les contraintes 12 PA / 6 PM, PV et PO minimum, règle des trophées à condition, arme à deux mains, conditions de caractéristiques, objets exclus. Dofus Ocre imposé. `--objets "a;b;…"` évalue un stuff donné sans recherche | ⚠️ lancé sur les vraies données (12/11/2026) : trouve mieux que les stuffs de référence, résultats à valider par le joueur |
| `test_donnees.mjs` | Évalue les deux stuffs de référence sur `data/current/` : doit retrouver leurs stats, PV, PO, PA, PM et panoplies. À relancer après chaque mise à jour DofusDB | ✅ passe |

Règles ajoutées au premier lancement sur les vraies données :

- **Conditions de caractéristiques** (`CS>299&(CI>299|CC>299)`, `CV>3949`…) : vérifiées sur les stats **totales** du personnage (base + objets, ✅ validé par le joueur), pour chaque répartition des points.
- **Objets exclus** en plus : condition MJ `PX` (l'Annobusé de Maître Jarbo, +300 partout, n'a pas « MJ » dans son nom), nom de personnage `PN`, carte `Pm`, serveur `OS` (objets Ankarton), et les conditions `PE` (Kroliméa, Dragouf), `BI` (Ceinture Bine encrassée, Couteaux sacrés…) et `Sc` (Boufbamu) : objets inaccessibles au joueur (✅ confirmé).
- **Équilibre entre éléments** (voies bi-élément, ✅ choix du joueur le 13/11/2026) : le joueur veut un Terre-Feu qui tape autant dans les deux éléments, pour s'adapter aux résistances des monstres. Mesure : un même sort fictif (base 22-25, crit 26-30, 10 % de crit) lancé dans chaque élément ; le plus fort ne dépasse pas l'autre de plus de **10 %** (`--ecart 10`, par défaut). Les stuffs de référence ne la respectent pas (Offensif 16 %, Équilibré 18 %). `--ecart aucun` retire la contrainte. Sans elle, l'optimiseur poussait tout vers le Feu (écart de 42 % et 68 %).
- **Résistances du monstre** (13/11/2026) : `--resist "feu:20/10,terre:15"` (par élément, le % puis le fixe ; éléments terre, feu, eau, air, neutre ; un % négatif est une faiblesse). Ordre de la règle 8 : fixe, puis %. Elles changent le score des combos, donc le stuff choisi et la répartition des points ; l'équilibre entre éléments se mesure, lui, toujours sans résistance (avec la contrainte de 10 %, les points ne bougent donc presque pas). Le résultat est écrit avec le suffixe `-resist`, pour ne pas écraser les stuffs de référence. `--pas-de-fichier` n'écrit rien (tests).
- **Dofus Ocre imposé** : sans lui, le T1 à 13 PA et le T2 à 23 PA sont impossibles, mais l'optimiseur ne le savait pas et l'écartait.

```
node outils/test_reference.mjs
node outils/test_donnees.mjs
node outils/optimiseur_stuff.mjs --voie terre-feu --profil offensif
node outils/optimiseur_stuff.mjs --voie terre-feu --profil equilibre
```

Résultat écrit dans `outils/resultats/`.

## Toutes les voies (13/11/2026)

| Fichier | Rôle |
|---|---|
| `pilote_voies.mjs` | Pour chaque voie : stuff fictif → combos → stuff Offensif → combos… jusqu'à stabilité, puis recherche finale (faisceau 12 000), stuffs Offensif et Équilibré, combos cherchés aussi avec l'Équilibré, corps à corps. Un seul jeu de variantes par voie (conflits résolus paire par paire). 7 processus en parallèle, tout est mis en cache (`outils/resultats/voies/cache/`) : on peut l'interrompre et le relancer |
| `tache_recherche.mjs` | Une recherche de combo, lancée par le pilote dans un processus à part |
| `publier_voies.mjs` | Copie les résultats dans `site/data/voies/` ; pour Terre-Feu, publie les combos dans l'ordre vérifié en jeu |
| `fiche_voies.mjs` | Rejoue pas à pas chaque combo publié sur les deux stuffs (légalité, PA, variantes, dégâts) et écrit `docs/RESULTATS_VOIES.md`. `--verifier-seulement` : sans écrire (lancé par `moteur/tests/test_moteur.mjs`) |

```
node outils/pilote_voies.mjs                 # les 10 voies hors Terre-Feu (≈ 14 h sur 8 cœurs, avec les reprises)
node outils/publier_voies.mjs
node outils/fiche_voies.mjs
node build/construire_site.mjs               # étapes des combos pour le site (voir build/README.md)
```

Nouvelles options de l'optimiseur : `--combos <fichier>` (combos du moteur, lignes « Sort|bonus »), `--depart <fichier>` (repart d'un stuff), `--paires K` (descente par paires d'objets, 12 dans le pilote), `--ils n` (recherche locale itérée, peu utile), `--sortie <fichier>`. La voie multi répartit ses points de façon gloutonne (exacte sans contrainte d'équilibre, car les dégâts sont linéaires en chaque caractéristique).

## À faire en premier avec les vraies données

1. Récupérer les données (`data/README.md`), puis lancer l'optimiseur sur Terre-Feu.
2. Il doit retrouver l'Offensif et l'Équilibré de `docs/RESULTATS_REFERENCE.md` (mêmes pièces, 210 Force / 315 Intelligence, mêmes stats). Si ce n'est pas le cas, chercher d'où vient l'écart avant d'aller plus loin. Les causes probables :
   - la structure de `item-sets.json` (`effects[k]` = bonus pour k+1 pièces : à confirmer) ;
   - la lecture des malus (description qui commence par `-#1`) ;
   - une caractéristique non comptée (par exemple `% dommages distance`) ;
   - un type d'objet mal rangé (vérifier dans `item-types.json`).
3. Deux trophées de la même famille (Puissant mineur et Puissant majeur) peuvent être portés ensemble : confirmé par le joueur, l'optimiseur l'autorise.

## Limites connues

- L'optimiseur reste une recherche heuristique : un meilleur stuff peut exister. Avec la descente par paires, il retrouve les stuffs Terre-Feu de référence (Offensif 5 059 dans 4 essais sur 7, Équilibré 5 024 en partant de l'Offensif), et le pilote garde toujours le meilleur de 16 essais.
- Le score des stuffs est la moyenne des 4 combos T1 / T2 : le corps à corps n'y compte pas (choix du joueur).
