# Mécaniques Xélor modélisées

Trois niveaux de confiance :

- ✅ **Validé en jeu** par le joueur : c'est la vérité, même si DofusDB dit autre chose.
- 📘 **DofusDB** : tiré de la description ou des effets du sort, non contredit en jeu.
- ❓ **Hypothèse** : choix de modélisation à confirmer.

## Le Téléfrag

- 📘 **Comment il s'applique.** L'état Téléfrag s'applique à 2 entités quand elles échangent leur position, soit par un échange classique, soit par la téléportation d'un sort Xélor. Il dure alors 2 tours. Certains sorts l'appliquent aussi directement, pour 1 tour.
- 📘 ✅ **Les PA rendus.** Quand un Téléfrag est généré, le lanceur gagne **+2 PA, une seule fois par sort et par tour** (deux sorts différents = deux fois +2 ; deux lancers du même sort = une seule fois).
- 📘 **Les échanges.** Téléporter une entité sur une case occupée provoque un échange de positions, donc un Téléfrag. Une entité **Indéplaçable** (le Cadran après Paradoxe) ne peut pas être échangée.
- 📘 **La consommation.** « Consommer » le Téléfrag retire l'état sur la cible. Sorts concernés : Horloge, Réfraction, Régulateur, Rayon Obscur, Dessèchement, Pétrification, Clepsydre, Gousset.
- ✅ **Les PA d'un Téléfrag généré hors du tour du joueur** (en fin de tour, par exemple) sont conservés pour son tour suivant.

## La position précédente (règle validée en jeu, essentielle)

Chaque entité a un **historique de positions**.

- ✅ Quand une entité est téléportée **à sa position précédente** par un effet qui la vise, cette position est **retirée** de l'historique : elle « revient en arrière ».
- ✅ Quand une entité est déplacée **comme partenaire d'échange**, ou par un autre effet (symétrie, marche), sa position de départ est **ajoutée** à l'historique.
- ✅ Quand un même sort renvoie **plusieurs entités** à leur position précédente (Instabilité, Distorsion, Compte-goutte), chacune revient en arrière, même si c'est par un échange.
- ✅ Exemple vérifié : après le set-up, le Cadran n'a plus de position précédente, donc le glyphe d'Instabilité ne le déplace pas en début de tour.

## Sorts

Pour chaque sort : PA, portée (PO), limites par tour et par cible, éléments. Les dégâts exacts sont sur DofusDB, au grade max accessible à 199.

### Sorts validés en jeu ✅

| Sort | Ce qui est validé |
|---|---|
| **Engrenage** | Zone en croix de rayon 1. Téléporte symétriquement par rapport au centre. Ne vise pas directement le lanceur, mais si un ennemi est envoyé **sur** le lanceur, l'échange a bien lieu. |
| **Sables du Temps** | La cible retourne à sa position précédente. Le rebond **touche bien le lanceur** : la cible du rebond est choisie avec les positions **d'avant** la téléportation, depuis la position initiale de la cible. Quand monstre et Xélor s'échangent, le rebond renvoie le Xélor à sa position précédente : **chacun garde sa case de départ**, mais le Téléfrag est généré (+2 PA). **Pas de rebond** si aucune entité n'est à 2 cases ou moins de la position initiale de la cible (vérifié avec le Xélor à 4 cases, 13/11/2026). |
| **Poussière** | Téléporte symétriquement autour du centre les entités en Téléfrag dans la zone (cercle de 2). **Téléporte bien le lanceur**, même si l'ennemi n'est pas en Téléfrag. |
| **Souvenir** | La cible retourne à sa position précédente, ce qui crée un échange si elle est occupée. |
| **Réfraction** | Ne rend **pas** de PA (même quand elle propage le Téléfrag). |
| **Rouage** | Zone en **anneau de rayon 2** (cases à distance exactement 2). Échange symétrique autour du centre. |
| **Momification** | Ne rend **pas** de PA. Elle donne +2 PM, l'état Téléfrag sur le lanceur et le rend Intaclable. |
| **Rembobinage** (sur soi) | Effet en **fin de tour** : retour à la position de début de tour. Échange avec l'entité qui l'occupe. |
| **Instabilité** | Deux glyphes (cercle de 3) sur la même case. Ils se déclenchent **à chaque** Téléfrag généré ou consommé par le lanceur, jusqu'au **début de son prochain tour**, et renvoient les entités du glyphe à leur position précédente. Ils donnent leurs +2 PA une fois, au tour où ils se déclenchent. Au début du tour suivant : **d'abord le glyphe, puis la Prémonition**. |
| **Prémonition** | Lancée sur sa propre case : au **début du tour suivant**, le lanceur échange avec l'entité qui se trouve sur cette case. Téléfrag, +2 PA. |
| **Cadran de Xélor** | C'est une invocation : ses effets s'appliquent **après le tour du joueur**. Il donne **+2 PA** aux alliés en Téléfrag dans un cercle de 4 et retire 2 PA esquivables aux ennemis. Un seul par équipe. |
| **Flou Temporel** | Le lanceur ne subit pas le retrait de PA mais **gagne bien +2 PA** au tour suivant. |
| **Synchro** | Invocation statique (2 PA). Explosion Air en **cercle de rayon 3**, **sans dégressivité**, **sans crit**, **indépendante des stats du lanceur**. Dégâts par niveau, pour un monstre à 0 % Air : 366, 1 098, 1 830, 2 562, 3 294, 4 026, 4 758, 5 490, 6 222, 6 954, 7 686, 8 418 (niveaux 1 à 12, soit 366 × (2 × niveau − 1)). Résistances Air du monstre : fixe, puis %, comme les autres sorts. Elle gagne **un niveau par Téléfrag généré, au plus un par tour** ; niveau 0 à l'invocation. Elle entre en Téléfrag comme le monstre (échange, retour à sa position précédente…) et explose alors ; le Xélor gagne les +2 PA du Téléfrag, et les sorts de déplacement la ciblent normalement. Elle explose **au moins au niveau 1**, puisqu'il faut un échange pour la faire exploser. Si elle n'a pas encore gagné son niveau du tour, elle le gagne **avant** d'exploser (niveau 3 au début du tour, échangée : explose au niveau 4), sauf si le sort de l'échange a déjà servi à lui faire gagner un niveau ce tour. Exceptions : après **Faille**, la Synchro ne peut plus entrer en Téléfrag de tout le tour (même posée après), mais un échange direct avec elle lui fait gagner un niveau sans la faire exploser ; **Paradoxe** n'affecte ni la Synchro ni le lanceur (sort complexe, à détailler s'il sert un jour). **Décision du joueur** : la Synchro n'entre dans **aucun combo** (le set-up prend les 12 PA du tour 1 et elle ne gagne qu'un niveau par tour) ; le site affiche seulement ses dégâts par niveau, selon les résistances choisies (15/11/2026). |
| **Désynchronisation** | Piège à zone en **cercle de rayon 2**, sans dégâts, posé sur une case libre (sans entité ni autre piège). Se déclenche quand une entité **marche** dessus **et** quand elle y est **téléportée** ; **la marche s'arrête sur le piège** (on ne le traverse pas). L'entité qui le déclenche ne bouge pas ; **toutes les autres** entités du cercle, Xélor compris, sont téléportées en symétrie par rapport au piège. Chacune bouge une seule fois : si l'une est envoyée sur une autre, elles échangent, et l'entité échangée n'est plus téléportée. Le piège **disparaît** après s'être déclenché. Un échange donne **+2 PA** (au nom de Désynchronisation, une fois par tour) et déclenche les glyphes d'Instabilité. Conséquence : avec seulement le Xélor et le monstre sur le plateau, le piège ne peut pas créer d'échange (13/11/2026). |
| **Espace-temps** | État sur la cible, qui se déclenche **à chaque sort** qui lui inflige des dégâts tant qu'il dure, mais **une seule fois par sort**, même si le sort touche deux fois (par exemple Horloge qui fait exploser le Sablier). Il se résout **après tous les effets du sort** (téléportations, consommation du Téléfrag) : la cible retourne à sa position précédente, **puis** le Xélor retourne à la sienne. Le partenaire d'un échange enregistre sa position, comme dans un échange normal. Exemple vérifié : monstre sans position précédente, Engrenage les échange, puis le monstre revient sur sa case, puis le Xélor revient dessus, soit 3 échanges et +4 PA (+2 d'Engrenage, +2 d'Espace-temps). Si la position précédente de la cible est la case du Xélor (après une Astrolabe), une frappe sans échange les fait échanger deux fois : personne ne bouge, mais la cible **garde son Téléfrag** (consommé par le sort, puis redonné), ce qui est vérifié en jeu. Le Téléfrag est **toujours généré par Espace-temps** (+2 PA à son nom, une fois par tour), jamais par le sort qui frappe. Renvoie aussi 30 % des dégâts à l'attaquant si c'est un ennemi en Téléfrag, ce qui est sans effet en PvM (13/11/2026). ✅ Vérifié aussi dans les combos au corps à corps (13/11/2026) : si la position précédente de la cible est une case libre et que le Xélor n'en a pas, **la cible y va seule** (Sablier en 2e sort) ; et la cible frappée **garde son Téléfrag** après chaque sort qui le consomme (Rayon Obscur, Horloge, Réfraction), puisqu'Espace-temps le redonne par l'échange. |
| **Glas** | Niveau 200 : indisponible à 199. |
| **Sablier de Xélor** | L'état explose au 2e Téléfrag consommé sur la cible : vérifié avec Rayon Obscur puis Horloge (T2 Terre-Feu, 13/11/2026). |
| **PM au tour 2** | Après le set-up, il reste au moins 2 PM dans la grande majorité des cas : on le considère comme acquis. |
| **Horloge** (lancer) | Se lance **en ligne uniquement** (validé le 12/11/2026, comme DofusDB ; le prototype ne l'imposait pas). |
| **Aiguille, Régulateur** (lancer) | Se lancent **en ligne ou en diagonale** (validé le 12/11/2026, comme DofusDB). |
| **Astrolabe** | Sur une case ou une entité : le Xélor s'y téléporte (échange, Téléfrag et +2 PA si la case est occupée). Sur soi : retour à sa position précédente. Une fois par cible ; relance réinitialisée quand le lanceur génère ou consomme un Téléfrag (14/11/2026). |
| **Gelure** | Comme Souvenir : la cible revient à sa position précédente (échange si la case est occupée). En ligne, sans ligne de vue (14/11/2026). |
| **Flétrissement** | Chaque lancer sur un monstre en Téléfrag ajoute +6 de base aux Flétrissements suivants du tour. Ne consomme pas le Téléfrag (14/11/2026). |
| **Ralentissement** | Si la cible est en Téléfrag : vole 1 PA (+1 PA au lanceur). Ne consomme pas le Téléfrag (14/11/2026). |
| **Perturbation** | La cible est téléportée en symétrie par rapport au lanceur, comme Frappe de Xélor. En ligne (14/11/2026). |
| **Distorsion** | Dans un carré de 3×3, toutes les entités sauf le Xélor reviennent à leur position précédente (14/11/2026). |
| **Dessèchement** | Consomme le Téléfrag de la cible (+1 PM), puis rebondit sur une entité à 2 cases ou moins de la dernière entité touchée et pas encore touchée par ce lancer, et ainsi de suite **sans limite** (en théorie, autant de PM que d'entités). Avec le Xélor et le monstre seuls, il touche au plus les deux, comme dans le moteur (14/11/2026). |
| **Permutation** | Le Xélor échange sa place avec la cible, à exactement 2 cases : Téléfrag, +2 PA (14/11/2026). |
| **Pétrification** | Consomme le Téléfrag ; chaque lancer sur une cible en Téléfrag baisse son coût de 1 PA, jusqu'à 2 PA (14/11/2026). |
| **Pendule** | L'ennemi ciblé prend **toujours** les dégâts, même à plus de 2 cases du lanceur, et **une seule fois**, même à 2 cases ou moins. Les autres ennemis dans le cercle de 2 autour du lanceur les prennent aussi. Le retour à la position précédente a lieu **même si la téléportation symétrique est impossible** (bord de carte) : comme un Souvenir sur soi, avec échange si un ennemi occupe la case (14/11/2026). Avec un seul ennemi, le moteur fait déjà exactement cela. |
| **Compte-goutte** | **La cible revient d'abord** à sa position précédente, **puis le Xélor**. Si la position précédente de la cible est la case du Xélor : un premier échange, puis le Xélor revient sur sa case. À la fin personne n'a bougé, mais le Téléfrag est généré : +2 PA (14/11/2026 ; le prototype faisait l'inverse, corrigé dans le moteur). |
| **Régulateur** | Consomme le Téléfrag (ce qui fait avancer le Sablier, comme toute consommation), mais **ne retire pas l'état Sablier**. Il raccourcit l'Aiguille d'un tour (2 → 1 ; retirée si elle n'avait plus qu'un tour) : sans effet sur une Aiguille posée dans le même tour (14/11/2026 ; le prototype retirait le Sablier et l'Aiguille, corrigé dans le moteur). |
| **Aiguille** | Pas de dégâts au lancer. Tant qu'elle est active, elle agit comme un **poison au début du tour du monstre** : ces dégâts **comptent dans le burst**, puisque le monstre n'a pas encore joué. Elle s'active **une fois de plus par tour** quand un Xélor consomme le Téléfrag de la cible : ses dégâts s'ajoutent à ceux de l'attaque. L'activation ne retire pas l'état. Durée 2 tours (14/11/2026). |
| **Gousset** | Consomme le Téléfrag. Si la cible était en Téléfrag : à la **fin du prochain tour du Xélor**, dégâts supplémentaires en cercle de 2 autour de la case visée, 30 à 32 Air (36 à 38 en crit), **−10 % par case** d'éloignement du centre. Hors du burst : **affichés à part**, pas comptés dans le combo (14/11/2026). |
| **Clepsydre** | Consomme le Téléfrag. Si la cible était en Téléfrag : PA en plus au **tour suivant**, cumulable 3 fois. Hors du burst : **affiché à part** (14/11/2026). |

### Sorts modélisés d'après DofusDB 📘 (pas encore testés en jeu)

- **Horloge** : +24 dégâts de base si la cible est en Téléfrag. Consomme le Téléfrag. ❓ Le bonus est compté seulement quand la cible est en Téléfrag au moment du lancer (cohérent avec les combos Terre-Feu vérifiés en jeu).
- **Rayon Obscur** : zone en ligne de 3 cases, depuis la case ciblée et dans la direction lanceur → cible. +12 de base **par entité en Téléfrag** dans la zone (alliés compris). Consomme tous les Téléfrags de la zone. (Vérifié dans les combos Terre-Feu avec le monstre seul en Téléfrag dans la zone.)
- **Téléportation** : relance réinitialisée quand le lanceur génère ou consomme un Téléfrag.
- **Paradoxe / Faille** : liés au Cadran ou au Complice.

## Objets ✅ validé par le joueur

- Les **conditions de caractéristiques** d'un objet (par exemple « Intelligence > 299 ») portent sur les stats **totales** : base + objets.
- **Plus d'armes à deux mains** dans Dofus 3 : toutes les armes se portent avec un bouclier (validé le 12/11/2026). Le champ `twoHanded` de DofusDB est à faux partout, ce qui est cohérent.
- Les objets à condition non identifiée (Kroliméa, Dragouf, Ceinture Bine encrassée, Couteaux sacrés, Le Thanos rongé, Canne Hassukre Édulcorée, Boufbamu) ne sont pas accessibles au joueur : ils restent exclus.

## Stuffs ✅ choix du joueur

- Une voie bi-élément doit rester **équilibrée** : sur un même sort, l'élément le plus fort ne tape pas plus de **10 %** au-dessus de l'autre (choix du 13/11/2026 ; les stuffs de référence Terre-Feu sont à 16 % et 18 %). Raison : s'adapter facilement aux résistances des monstres.
- Toutes les voies (choix du 13/11/2026) : points dans les caractéristiques de la voie (Chance pour l'Eau, Agilité pour l'Air, les quatre pour la multi) ; équilibre à **10 %** pour les bi-éléments et à **20 %** pour la multi ; profil Équilibré : au moins **3 000 PV et PO ≥ 1**, comme Terre-Feu.
- Le score d'un stuff est la moyenne des 4 combos T1 / T2 de la voie : les combos **au corps à corps n'y comptent pas** (choix du 13/11/2026).

## Situation « monstre au corps à corps au départ » ✅ choix du joueur, combos vérifiés en jeu (13/11/2026)

- **Tours calculés** : le monstre vient de frapper le Xélor, donc l'Ocre ne donne pas son PA de début de tour. On calcule le **T1 à 12 PA** (X pas en Téléfrag) et le **T2 à 22 PA** (X en Téléfrag grâce au set-up, Cadran inutilisé). 3 PM, comme dans les autres combos.
- **Position** : M **collé en ligne** (une des 4 cases voisines, pas la diagonale). Dans le moteur : X en (0,0), M en (1,0).
- **Position précédente du monstre** : il vient de marcher jusqu'au Xélor, donc il en a une. On la place toujours **à l'opposé de X par rapport à M**, en (2,0) : Souvenir ou Sables du Temps l'y renvoient. ✅ Vérifié en jeu : le monstre qui vient de marcher jusqu'au Xélor a bien une position précédente (Souvenir et Espace-temps l'y renvoient).
- **Tacle** : le Xélor ne peut pas **quitter à pied** une case voisine du monstre (option `tacle` du moteur). Il peut s'y arrêter, mais pas en repartir. La marche redevient possible une fois décollé par un sort, ou s'il est **Intaclable** (Momification lancée ce tour). Choix de modélisation : aucun combo actuel ne marche, la règle n'a donc pas été mise à l'épreuve en jeu.

## Variantes en T2

- ✅ Toutes les variantes sont autorisées (sauf Glas, niveau 200), à condition de garder **le même choix de variantes à 22 et à 23 PA**.
- ✅ Plus largement (choix du 13/11/2026) : **un seul jeu de variantes par voie**, pour tous ses combos (T1 à 13 et 12 PA, T2 à 22 et 23 PA, corps à corps), car on ne change pas de variante en plein combat.
- ✅ **Perturbation** est exclue en Terre-Feu seulement (le joueur y garde Rouage) ; elle est autorisée dans les autres voies.

### Hypothèses encore ouvertes ❓

- **Ligne de vue** : approchée par une ligne entre les centres des cases. Les entités bloquent la vue.
- **Rebond de Sables du Temps ou de Dessèchement** quand deux entités sont à égale distance : non modélisé (cas évité).
- **Tacle** : ignoré pour les déplacements à pied, sauf dans la situation « corps à corps » (voir plus haut).
- **Glas** (pour le niveau 200) : +3 de base par Téléfrag consommé depuis son dernier lancer, plafonné à 6 d'après les états du sort. À vérifier au niveau 200.

## Paires de variantes (une seule variante par paire en combat ; on ne change pas en plein combat)

| Paire | Variante A | Variante B |
|---|---|---|
| 1 | Téléportation (13249) | Astrolabe (13282) |
| 2 | Perturbation (13288) | Rouage (13283) |
| 3 | Souvenir (13281) | Permutation (13285) |
| 4 | Flétrissement (13254) | Aiguille (13244) |
| 5 | Rembobinage (13243) | Rémanence (13255) |
| 6 | Réfraction (13286) | Régulateur (13248) |
| 7 | Complice (13287) | Cadran de Xélor (13258) |
| 8 | Gelure (13245) | Poussière (13257) |
| 9 | Ralentissement (13242) | Sablier de Xélor (13261) |
| 10 | Engrenage (13299) | Compte-goutte (13259) |
| 11 | Flou Temporel (13246) | Conservation (13291) |
| 12 | Distorsion (13289) | Sables du Temps (13292) |
| 13 | Fuite du Temps (13251) | Prémonition (13293) |
| 14 | Rayon Obscur (13253) | Dessèchement (13284) |
| 15 | Paradoxe (13250) | Faille (13295) |
| 16 | Synchro (13247) | Glas (13300, niveau 200) |
| 17 | Pétrification (13290) | Gousset (14651) |
| 18 | Horloge (13256) | Clepsydre (13298) |
| 19 | Frappe de Xélor (13252) | Pendule (13294) |
| 20 | Momification (13260) | Vingt-cinquième Heure (14650) |
| 21 | Raulebaque (13262) | Instabilité (13301) |
| 22 | Désynchronisation (13296) | Espace-temps (13297) |

Le **set-up** impose : Cadran (7), Flou Temporel (11), Rembobinage (5), Prémonition (13), Instabilité (21).

Le joueur préfère **Rouage à Perturbation** (paire 2), car Rouage est plus polyvalent pour générer des Téléfrags.

## Éléments des sorts d'attaque (pour classer par voie)

- **Terre** : Frappe de Xélor, Engrenage, Rouage (vol), Aiguille, Régulateur, Horloge.
- **Feu** : Perturbation (vol), Réfraction, Poussière, Sablier, Sables du Temps, Rayon Obscur.
- **Eau** : Ralentissement, Gelure, Compte-goutte, Permutation (vol), Pétrification, Clepsydre.
- **Air** : Souvenir (vol), Flétrissement, Distorsion, Dessèchement, Pendule, Gousset, Synchro.
- **Multi** : Glas (niveau 200).

Un sort d'un autre élément peut quand même servir dans une voie, pour ses PA rendus ou pour un échange. Souvenir est utilisé en Terre-Feu.
