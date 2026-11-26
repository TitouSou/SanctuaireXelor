# Outils JS (Node 18 ou plus)

| Fichier | Rôle | État |
|---|---|---|
| `degats.mjs` | Formule de dégâts (règle 8 de `CLAUDE.md`), bases des sorts au niveau 199, combos Terre-Feu exprimés en nombre de lancers par sort | ✅ testé |
| `test_reference.mjs` | Retrouve, à partir des stats de référence, les dégâts par sort et les totaux T1 / T2 22 / T2 23 des deux stuffs | ✅ passe (écart ≤ 2 dû aux arrondis) |
| `optimiseur_stuff.mjs` | Recuit simulé (mouvements d'un objet ou d'une panoplie entière) puis descente coordonnée sur `data/current/`. Maximise la moyenne des combos de la voie, sous les contraintes 12 PA / 6 PM, PV et PO minimum (PV maximum en option), résistances % (minimum par élément et moyenne), règle des trophées à condition, arme à deux mains, conditions de caractéristiques, objets exclus. Dofus Ocre imposé. `--objets "a;b;…"` évalue un stuff donné sans recherche | ⚠️ lancé sur les vraies données (12/11/2026) : trouve mieux que les stuffs de référence, résultats à valider par le joueur |
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
node outils/optimiseur_stuff.mjs --voie terre-feu --profil equilibre          # nouveau profil (16/11/2026)
node outils/optimiseur_stuff.mjs --voie terre-feu --profil ancien-equilibre    # profil des stuffs de référence
```

Profils (16/11/2026) : `offensif` (aucune contrainte de vie) ; `equilibre` (✅ repères PvM du joueur : au moins 3 500 PV, 4 500 n'étant qu'un repère ; aucune résistance % négative sur Terre, Feu, Eau, Air, Neutre ; moyenne des cinq ≥ 20 % ; pas de condition de portée) ; `ancien-equilibre` (3 000 PV et PO ≥ 1, celui de `docs/RESULTATS_REFERENCE.md`). Options : `--pv`, `--pv-max`, `--po`, `--res-min`, `--res-moy`. Les résistances % (caractéristiques DofusDB 33 à 37) sont lues sur les objets et les panoplies, au jet max (pour un malus en plage, le plus petit malus, comme pour les autres caractéristiques : ✅ validé le 17/11/2026), et écrites dans le résultat (`resistancesPct` : les cinq éléments, `min`, `moyenne`).

Résultat écrit dans `outils/resultats/`.

## Toutes les voies (13/11/2026)

| Fichier | Rôle |
|---|---|
| `pilote_voies.mjs` | Pour chaque voie : stuff fictif → combos → stuff Offensif → combos… jusqu'à stabilité, puis recherche finale (faisceau 12 000), stuffs Offensif et Équilibré, combos cherchés aussi avec l'Équilibré, corps à corps. Un seul jeu de variantes par voie (conflits résolus paire par paire). 7 processus en parallèle, tout est mis en cache (`outils/resultats/voies/cache/`) : on peut l'interrompre et le relancer |
| `tache_recherche.mjs` | Une recherche de combo, lancée par le pilote dans un processus à part |
| `publier_voies.mjs` | Copie les résultats dans `site/data/voies/` ; pour Terre-Feu, publie les combos dans l'ordre vérifié en jeu |
| `resistances_stuffs.mjs` | Ajoute les résistances % aux stuffs calculés avant le 16/11/2026 (les Offensifs), sans rien changer d'autre : chaque stuff est réévalué sans recherche et ses PV doivent être retrouvés |
| `fiche_voies.mjs` | Rejoue pas à pas chaque combo publié sur les deux stuffs (légalité, PA, variantes, dégâts) et écrit `docs/RESULTATS_VOIES.md`. `--verifier-seulement` : sans écrire (lancé par `moteur/tests/test_moteur.mjs`) |

```
node outils/pilote_voies.mjs                 # les 10 voies hors Terre-Feu (≈ 14 h sur 8 cœurs, avec les reprises)
node outils/pilote_voies.mjs --equilibres-seulement   # seulement les Équilibrés (11 voies), sur les combos publiés
node outils/pilote_voies.mjs --offensifs-seulement    # seulement les Offensifs (11 voies), sur les combos publiés
node outils/pilote_voies.mjs --avec-arme              # coup d'arme (18/11/2026) : Offensifs recalculés, combos par stuff (11 voies)
node outils/resistances_stuffs.mjs                   # résistances % des Offensifs
node outils/appliquer_stuffs.mjs [--essai]    # stuffs retenus (6 ou 5 PM) → outils/resultats/voies/<voie>.json
node outils/publier_voies.mjs
node outils/fiche_voies.mjs
node build/construire_site.mjs               # étapes des combos pour le site (voir build/README.md)
```

**Turquoise, recalcul rapide et application (25-26/11/2026)**. Options du pilote pour un profil seul (`--offensifs-seulement` / `--equilibres-seulement`) :
- `--rapide` : pas de recuit, une descente seule (descente par coordonnées puis par paires) depuis chaque stuff connu de la voie : le stuff publié (un objet devenu exclu, comme l'Arcaniste, laisse sa place vide et la descente la remplit), l'autre profil, et les meilleurs à 6 et 5 PM déjà trouvés des deux profils. Environ 3 à 10 min par stuff, au lieu de plusieurs heures ;
- `--depistage` : une seule passe de recuit (16 essais), ou `--passes-max 2` pour une deuxième passe qui reprend la première dans le cache. À 6 PM, elle part du meilleur stuff déjà trouvé ;
- un résultat n'est jamais remplacé par un moins bon ni par un stuff qui ne tient pas ses contraintes ; la méthode est écrite dans le fichier (`methode` : complete, rapide ou depistage).

Optimiseur : `--descente-seule` (avec `--depart`) fait seulement la descente depuis le stuff donné. Le score d'un stuff qui porte le Dofus Turquoise demande l'ordre des coups de chaque combo (`sequence`, rejouée par le moteur avec `sequenceCombo`) : `comboOrdonne` dans `outils/degats.mjs`, règle `multiplicateursTurquoise` dans `moteur/formule.mjs`.

Ensuite :
- `bilan_stuffs_pm.mjs` écrit `outils/resultats/voies/bilan-stuffs-pm.md` : pour chaque stuff, publié, meilleur à 6 PM, meilleur à 5 PM, écarts, PV, résistances, place du Turquoise, objets changés, stuff retenu (5 PM seulement à +5 % ou plus) et contrôles des contraintes ;
- `appliquer_stuffs.mjs` écrit les stuffs retenus dans `outils/resultats/voies/<voie>.json` : chaque stuff reçoit le jeu de combos sur lequel il a été noté (ses dégâts, recalculés dans l'ordre des coups, doivent retrouver ceux de l'optimiseur), le corps à corps le plus fort parmi ceux connus qui se joue avec son arme et ses variantes, et le bilan dans `stuffsTurquoise`. Puis `publier_voies.mjs`, `fiche_voies.mjs` et `build/construire_site.mjs` ;
- `garder_eveille.ps1` empêche la mise en veille de Windows tant qu'un `node … pilote_voies` tourne, sans changer aucun réglage (fermer le capot met quand même en veille). Depuis le 26/11/2026 (le PC était resté allumé 12 h après un calcul, un autre programme bloquant la veille), il met ensuite lui-même le PC en veille dès que personne ne l'a touché depuis 15 min (`-Inactivite`, en secondes ; `-SansVeilleApres` pour ne pas le faire, `-Essai` pour tester sans mettre en veille). À lancer avec chaque calcul long : `powershell -NoProfile -ExecutionPolicy Bypass -File outils/garder_eveille.ps1`.

**Format 2 et 5 PM (24/11/2026)** : `--offensifs-seulement` / `--equilibres-seulement` lisent maintenant les combos au format 2 (un jeu par stuff). Le stuff est noté sur le meilleur jeu jouable avec son arme parmi les combos publiés de l'Offensif, ceux de l'Équilibré et ceux d'avant le coup d'arme (sans arme). Le résultat est écrit à part, sans toucher aux résultats ni au site : `outils/resultats/voies/stuffs-pm6/<voie>.<profil>.json` (ou `stuffs-pm5/` avec `--pm-min 5 --pm-max 5`, stuffs à exactement 5 PM ; le 1er essai part alors du meilleur stuff à 6 PM). Les descriptions des tâches « stuff » et « evaluation » contiennent la liste des objets exclus et les PM (`reglesObjets`) : changer ces règles refait les essais. Le pilote vérifie que `EXCLUS_SANS` est le même que dans l'optimiseur. Conditions d'objets : `outils/conditions.mjs` (partagé ; `empecheLesPAPM` : à 5 PM, un objet à condition `CP<12|CM<6` ou `CM<6` devient candidat, sa condition étant vérifiée sur les PA et PM totaux). Optimiseur : `--pm-min`, `--pm-max`. `test_donnees.mjs` évalue les stuffs de référence en mode « tous » (ils contiennent l'Arcaniste).

Ancienne description (avant le format 2) — **Recherche par passes** (`--equilibres-seulement`, `--offensifs-seulement`, 17-18/11/2026) : un seul profil est recalculé, sur les 4 combos T1 / T2 publiés (`site/data/voies/<voie>.json`) ; l'autre profil et les combos ne bougent pas, seuls les dégâts du profil recalculé (corps à corps compris) et sa moyenne changent. Une passe = 16 essais de l'optimiseur (graines 1 à 16, puis 17 à 32…) ; le 1er essai part du meilleur stuff connu, les 15 autres au hasard. Un essai de plus part de l'autre profil (Offensif : de l'Équilibré, qui respecte aussi ses contraintes) ou de l'ancien stuff (Équilibré). Arrêt quand le meilleur n'a pas bougé pendant 2 passes **et** a été retrouvé au moins 3 fois par des essais partis au hasard (`--passes-stables`, `--trouve-min`), ou au bout de `--passes-max` passes (10). Le bilan est écrit dans `equilibreRecalcule` / `offensifRecalcule` du fichier de la voie. Une voie dont aucun essai ne respecte les contraintes n'est pas modifiée (`<voie>.<profil>-compromis.json`). Il reste ensuite à lancer `publier_voies.mjs`, `fiche_voies.mjs` et `build/construire_site.mjs`.

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

## Coup d'arme (18/11/2026)

Décision du joueur : les combos dépendent du stuff. L'Offensif et l'Équilibré d'une voie ont chacun leurs combos, leur jeu de variantes et leur arme ; l'arme du stuff peut entrer dans ses combos. Règles : `docs/MECANIQUES.md`, « Le coup d'arme ».

- `moteur/armes.mjs` : lecture d'une arme DofusDB (`lireArme`), portée, dégâts d'un coup (`degatsCoupArme`), Maîtrise d'Arme, et `comboJouableAvec` : un combo trouvé avec une arme reste jouable avec une autre arme si elle coûte autant de PA ou moins, frappe à la même distance, a assez d'utilisations par tour, le même nombre de lignes si Espace-temps était actif, et ne déplace pas.
- Lignes de combo : `Arme|<contact par ligne>|<Maîtrise>` (par exemple `Arme|111|1`), calculées avec l'arme portée (`combo(lignes, stats, resist, arme)` dans `degats.mjs`).
- Optimiseur : `--combos` accepte des **jeux de combos** (`{ jeux: [{ nom, arme, combos: { situation: { lignes, coups } } }] }`). Le stuff est noté sur le meilleur jeu jouable avec son arme (`meilleurJeu`). Il lit aussi les % dommages d'armes (122) et les dommages de poussée (84).
- Pilote : `node outils/pilote_voies.mjs --avec-arme [--voies …] [--armes 4] [--tours 3]`. Pour chaque voie : combos cherchés avec les 4 armes qui font le plus de dégâts par PA (plus l'arme portée) ; passes de l'optimiseur sur ces jeux et sur le jeu publié sans arme (1er essai depuis l'Offensif actuel, un essai depuis l'Équilibré) ; recherche finale (12 000) avec le nouveau stuff et son arme ; on recommence si ces combos font mieux (au plus 3 tours). L'Offensif retenu est le meilleur couple (stuff d'un tour avec sa répartition, jeu de combos), pas forcément celui du dernier tour (en multi, la répartition des points est approchée et un tour peut la dégrader) ; le stuff Équilibré, qui tient aussi les contraintes de l'Offensif, est candidat lui aussi (19/11/2026). Équilibré : stuff gardé, combos cherchés avec son arme. Corps à corps pour chaque stuff. Résultat au **format 2** (`combos`, `corpsACorps`, `variantes`, `armes` par stuff ; état d'avant gardé dans `avantArme`).
- `publier_voies.mjs` (format 2, convertit le format 1), `fiche_voies.mjs`, `build/construire_site.mjs` et la page d'une voie affichent les combos du stuff choisi.
