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
- **Dofus Ocre imposé** : sans lui, le T1 à 13 PA et le T2 à 23 PA sont impossibles, mais l'optimiseur ne le savait pas et l'écartait.

```
node outils/test_reference.mjs
node outils/test_donnees.mjs
node outils/optimiseur_stuff.mjs --voie terre-feu --profil offensif
node outils/optimiseur_stuff.mjs --voie terre-feu --profil equilibre
```

Résultat écrit dans `outils/resultats/`.

## À faire en premier avec les vraies données

1. Récupérer les données (`data/README.md`), puis lancer l'optimiseur sur Terre-Feu.
2. Il doit retrouver l'Offensif et l'Équilibré de `docs/RESULTATS_REFERENCE.md` (mêmes pièces, 210 Force / 315 Intelligence, mêmes stats). Si ce n'est pas le cas, chercher d'où vient l'écart avant d'aller plus loin. Les causes probables :
   - la structure de `item-sets.json` (`effects[k]` = bonus pour k+1 pièces : à confirmer) ;
   - la lecture des malus (description qui commence par `-#1`) ;
   - une caractéristique non comptée (par exemple `% dommages distance`) ;
   - un type d'objet mal rangé (vérifier dans `item-types.json`).
3. Deux trophées de la même famille (Puissant mineur et Puissant majeur) peuvent être portés ensemble : confirmé par le joueur, l'optimiseur l'autorise.

## Limites connues

- Les combos sont fixes (`VOIES` dans `degats.mjs`) : un stuff peut changer le meilleur combo (PO, crit), ce que l'optimiseur ignore. À terme, le build doit boucler : stuff → combos → stuff.
- La répartition des points ne gère que 1 ou 2 caractéristiques. La voie multi demandera une répartition gloutonne.
- Résistances du monstre : la fonction les accepte, dans l'ordre « fixe puis % » (validé par le joueur). Elles ne sont pas encore branchées dans l'optimiseur ni dans les tests.
