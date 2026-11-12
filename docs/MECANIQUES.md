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
| **Synchro** | Explosion en **cercle de rayon 3**. Dégâts exacts à fournir par le joueur. |
| **Désynchronisation** | Piège à zone en **cercle de rayon 2**, sans dégâts, posé sur une case libre (sans entité ni autre piège). Se déclenche quand une entité **marche** dessus **et** quand elle y est **téléportée** ; **la marche s'arrête sur le piège** (on ne le traverse pas). L'entité qui le déclenche ne bouge pas ; **toutes les autres** entités du cercle, Xélor compris, sont téléportées en symétrie par rapport au piège. Chacune bouge une seule fois : si l'une est envoyée sur une autre, elles échangent, et l'entité échangée n'est plus téléportée. Le piège **disparaît** après s'être déclenché. Un échange donne **+2 PA** (au nom de Désynchronisation, une fois par tour) et déclenche les glyphes d'Instabilité. Conséquence : avec seulement le Xélor et le monstre sur le plateau, le piège ne peut pas créer d'échange (13/11/2026). |
| **Espace-temps** | État sur la cible, qui se déclenche **à chaque sort** qui lui inflige des dégâts tant qu'il dure, mais **une seule fois par sort**, même si le sort touche deux fois (par exemple Horloge qui fait exploser le Sablier). Il se résout **après tous les effets du sort** (téléportations, consommation du Téléfrag) : la cible retourne à sa position précédente, **puis** le Xélor retourne à la sienne. Le partenaire d'un échange enregistre sa position, comme dans un échange normal. Exemple vérifié : monstre sans position précédente, Engrenage les échange, puis le monstre revient sur sa case, puis le Xélor revient dessus, soit 3 échanges et +4 PA (+2 d'Engrenage, +2 d'Espace-temps). Si la position précédente de la cible est la case du Xélor (après une Astrolabe), une frappe sans échange les fait échanger deux fois : personne ne bouge, mais la cible **garde son Téléfrag** (consommé par le sort, puis redonné), ce qui est vérifié en jeu. Le Téléfrag est **toujours généré par Espace-temps** (+2 PA à son nom, une fois par tour), jamais par le sort qui frappe. Renvoie aussi 30 % des dégâts à l'attaquant si c'est un ennemi en Téléfrag, ce qui est sans effet en PvM (13/11/2026). |
| **Glas** | Niveau 200 : indisponible à 199. |
| **Sablier de Xélor** | L'état explose au 2e Téléfrag consommé sur la cible : vérifié avec Rayon Obscur puis Horloge (T2 Terre-Feu, 13/11/2026). |
| **PM au tour 2** | Après le set-up, il reste au moins 2 PM dans la grande majorité des cas : on le considère comme acquis. |
| **Horloge** (lancer) | Se lance **en ligne uniquement** (validé le 12/11/2026, comme DofusDB ; le prototype ne l'imposait pas). |
| **Aiguille, Régulateur** (lancer) | Se lancent **en ligne ou en diagonale** (validé le 12/11/2026, comme DofusDB). |

### Sorts modélisés d'après DofusDB 📘 (pas encore testés en jeu)

- **Frappe de Xélor / Perturbation** : la cible est téléportée symétriquement par rapport au lanceur. Perturbation se lance en ligne.
- **Horloge** : +24 dégâts de base si la cible est en Téléfrag. Consomme le Téléfrag. ❓ Le bonus est compté seulement quand la cible est en Téléfrag au moment du lancer.
- **Sablier de Xélor** : l'état explose (zone cercle de 2) quand 2 Téléfrags ont été consommés **sur la cible**.
- **Rayon Obscur** : zone en ligne de 3 cases, depuis la case ciblée et dans la direction lanceur → cible. +12 de base **par entité en Téléfrag** dans la zone (alliés compris). Consomme tous les Téléfrags de la zone.
- **Ralentissement** : vole 1 PA (+1 PA au lanceur) si la cible est en Téléfrag.
- **Pendule** : le lanceur est téléporté symétriquement par rapport à la cible, frappe, puis revient à sa position précédente.
- **Astrolabe / Téléportation** : leur relance est réinitialisée quand le lanceur génère ou consomme un Téléfrag.
- **Paradoxe / Faille** : liés au Cadran ou au Complice.
- **Aiguille, Flétrissement, Gelure, Compte-goutte, Permutation, Distorsion, Dessèchement, Pétrification, Gousset, Clepsydre, Régulateur** : effets selon DofusDB (voir `sim/simulateur.py`, fonction `cast`).

## Objets ✅ validé par le joueur

- Les **conditions de caractéristiques** d'un objet (par exemple « Intelligence > 299 ») portent sur les stats **totales** : base + objets.
- **Plus d'armes à deux mains** dans Dofus 3 : toutes les armes se portent avec un bouclier (validé le 12/11/2026). Le champ `twoHanded` de DofusDB est à faux partout, ce qui est cohérent.
- Les objets à condition non identifiée (Kroliméa, Dragouf, Ceinture Bine encrassée, Couteaux sacrés, Le Thanos rongé, Canne Hassukre Édulcorée, Boufbamu) ne sont pas accessibles au joueur : ils restent exclus.

## Stuffs ✅ choix du joueur

- Une voie bi-élément doit rester **équilibrée** : sur un même sort, l'élément le plus fort ne tape pas plus de **10 %** au-dessus de l'autre (choix du 13/11/2026 ; les stuffs de référence Terre-Feu sont à 16 % et 18 %). Raison : s'adapter facilement aux résistances des monstres.

## Variantes en T2

- ✅ Toutes les variantes sont autorisées (sauf Glas, niveau 200), à condition de garder **le même choix de variantes à 22 et à 23 PA**.

### Hypothèses encore ouvertes ❓

- **Ligne de vue** : approchée par une ligne entre les centres des cases. Les entités bloquent la vue.
- **Rebond de Sables du Temps ou de Dessèchement** quand deux entités sont à égale distance : non modélisé (cas évité).
- **Tacle** : ignoré pour les déplacements à pied.
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
