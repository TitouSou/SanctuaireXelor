# Sanctuaire Xélor

Site de référence pour jouer **Xélor en PvM sur Dofus 3 (Unity)** : combos optimaux par voie élémentaire, stuffs associés, simulation des dégâts. Site statique en français, hébergé sur **GitHub Pages**.

Ce fichier est le point d'entrée. Lis aussi, avant de coder :

- `docs/MECANIQUES.md` : toutes les règles de jeu modélisées. Distingue bien « validé en jeu » et « hypothèse ».
- `docs/RESULTATS_REFERENCE.md` : les stuffs et combos déjà calculés. Ton code doit les retrouver à l'identique : ce sont les tests de non-régression.
- `docs/ROADMAP.md` : l'ordre de construction.
- `sim/README.md` : le simulateur Python existant (prototype validé).
- `outils/README.md` : le calcul des dégâts en JS (déjà testé contre les résultats de référence) et l'optimiseur de stuff.
- `site/` : le site (accueil, stuffs, une page par voie, set-up, dégâts des sorts, mécaniques). `build/README.md` explique comment ses données sont construites. `site/prototype.html` est l'ancien prototype, point de départ du design.

## Le joueur

- Le propriétaire du site joue un Xélor niveau **199**, serveur Pionnier, monocompte, en PvM. Le niveau 200 sera ajouté plus tard.
- C'est lui qui **valide chaque combo en jeu**. Il teste toujours avec son propre stuff : il vérifie que l'enchaînement est réalisable et le plus fort pour la voie, pas les chiffres exacts.
- Il est sur **Windows** et connaît Claude Code.
- Écris l'interface et les messages en **français**.

## Décisions déjà prises (ne pas remettre en cause sans lui demander)

| Sujet | Décision |
|---|---|
| Nom | **Sanctuaire Xélor** |
| Public | Le propriétaire d'abord. Ouverture possible plus tard, en français pour l'instant |
| Mode de jeu | PvM uniquement |
| Voies | Les 6 bi-éléments d'abord (Terre-Feu, Terre-Eau, Terre-Air, Feu-Eau, Feu-Air, Eau-Air), puis les 4 mono, puis la multi (4 éléments) |
| Situations de combo, pour chaque voie | **T1 burst à 13 PA** (Ocre actif) et **à 12 PA** (Ocre inactif), deux combos distincts ; **Set-up** (identique pour toutes les voies, il prépare 22 PA) ; **T2 burst à 22 PA** et **à 23 PA** (avec et sans le PA de l'Ocre, **le même choix de variantes** pour les deux) ; **monstre au corps à corps au départ** (T1 à 12 PA et T2 à 22 PA : le monstre a frappé, pas de PA de l'Ocre ; défini dans `docs/MECANIQUES.md`). **Depuis le 18/11/2026, les combos dépendent du stuff** : l'Offensif et l'Équilibré d'une voie ont chacun leurs combos et leur jeu de variantes ; l'arme du stuff peut entrer dans ses combos (coup d'arme, voir `docs/MECANIQUES.md`), l'Équilibré peut garder son arme pour ses seules caractéristiques |
| Stuffs | Pour chaque voie : un **Offensif** et un **Équilibré** (repères PvM du joueur, 16/11/2026 : 12 PA / 6 PM (**5 PM autorisés depuis le 24/11/2026**, Offensif comme Équilibré, les 12 PA restent obligatoires, seulement si le gain vaut le coup : au moins **+5 %** sur la moyenne des 4 combos T1 / T2 par rapport au meilleur stuff à 6 PM du même profil, calculé avec les mêmes règles d'objets ; sinon on garde le 6 PM ; les combos gardent 3 PM disponibles, les autres servent à se placer), **au moins 3 500 PV** (4 500 est un repère, pas une limite), pas de condition de portée, **aucune résistance % négative** et **au moins 20 % de résistance moyenne** sur les cinq éléments, viser 20 à 30 % ; en perdant le moins de dégâts possible sur les combos de la voie). La page permet de choisir |
| Restriction d'objets | Deux modes globaux : **« tous les objets »** et **« sans Dolmanax, Vulbis, Dofus des Glaces, Arcaniste »**. Le joueur utilise le second. **Depuis le 24/11/2026, le joueur a le Dofus Turquoise** : il est autorisé. **Le trophée Arcaniste est banni le même jour** (il donne des dommages aux sorts mais retire de la résistance distance et mêlée : le joueur ne veut pas être plus vulnérable). Avant, le mode était « sans Turquoise, Dolmanax, Vulbis, Dofus des Glaces » ; les 22 stuffs ont été recalculés le 26/11/2026 avec le nouveau mode (combos gardés), voir `docs/ROADMAP.md`. Les stuffs de référence de `docs/RESULTATS_REFERENCE.md` restent tels quels (tests de non-régression). Pas de réglage objet par objet pour l'instant |
| Exos PA / PM | Pas pour l'instant |
| Résistances du monstre | **Réglables partout** (% et fixes par élément), y compris pour les dégâts de la Synchro |
| Statut de chaque combo | Étiquette **« vérifié en jeu »** ou **« simulé »** |
| Visuel | On garde le style du prototype : horlogerie, laiton, plateau en **vue Dofus** (losanges à 45°) avec option vue plate, pas à pas. **Aucun visuel ni icône d'Ankama** : uniquement des visuels faits maison. **Exception décidée le 20/11/2026** : la page Stuffs et la liste du stuff des pages de voie affichent les **sprites officiels des objets** (56 px sur la page Stuffs, 28 px sur les pages de voie ; case vide en pointillés laiton si l'image ne se charge pas). **Option retenue par le joueur (20/11/2026) : site public avec crédits Ankama**, comme les sites de fans existants (Dofusbook, Solomonk, Xixou). Mention en pied de **toutes les pages** (`CREDITS` dans `site/js/commun.js`) : « Sanctuaire Xélor est un site de fan non officiel, sans lien avec Ankama Games. Dofus, ses noms et ses visuels, dont les images des objets, sont la propriété d'Ankama Games. Images et données des objets : DofusDB. Site sans but commercial (ni publicité ni dons) ; les visuels seront retirés si Ankama le demande. » Aucun but commercial, pas d'imitation d'un site officiel. Les CGU de Dofus tolèrent les sites de fans à la discrétion d'Ankama, ce n'est pas un droit. Les images sont **chargées depuis DofusDB** (champ `img` des objets, par exemple `https://api.dofusdb.fr/img/items/16349.png`), jamais copiées dans le dépôt. Le plateau, les sorts et le reste du site restent faits maison |
| Hébergement | GitHub Pages, site statique. Les calculs lourds sont faits à l'avance (build) et publiés en JSON |
| Mises à jour du jeu | Un script récupère les données DofusDB, **montre les différences**, et **le joueur décide** s'il les applique (voir `data/README.md`) |
| Plus tard | Contributions de visiteurs ; saisie de son propre stuff ; placement libre du monstre avec recherche en direct ; simulateur libre des sorts Xélor ; niveau 200 (Glas) ; PvP éventuel |

## Règles de calcul (tests de non-régression : ne pas les modifier sans accord)

1. **Données** : uniquement **DofusDB** (`https://api.dofusdb.fr`). N'utilise pas dofusfashionista ni d'autres sites (ils contiennent des données de Dofus 2).
2. **Jets max** sur tous les objets ; **parchemins 100** dans les 6 caractéristiques.
3. **Points de caractéristiques** : 990 à répartir. Coût Force/Intelligence/Chance/Agilité : 1 point par point jusqu'à 100, puis 2 jusqu'à 200, 3 jusqu'à 300, 4 au-delà. Les points vont en Force et Intelligence (jamais en Vitalité). La répartition est optimisée pour maximiser les dégâts des combos de la voie.
4. **PV** = 1 045 (base au niveau 199) + 100 (parchemin) + Vitalité du stuff.
5. **PA / PM** : base 7 PA et 3 PM. L'équipement (Dofus et trophées compris) plafonne à **12 PA et 6 PM**. Le Dofus Ocre donne +1 PA, plus **+1 PA en début de tour** si le joueur n'a pas été attaqué depuis son tour précédent (d'où le T1 à 13 PA et le T2 à 23 PA).
6. **Trophées à condition** (`pk<2` sur DofusDB, par exemple Remueur, Nomade, Vigoureux) : autorisés **si une seule panoplie** a un bonus actif. Elle peut être complète. C'est la règle actuelle du jeu, DofusDB affiche encore l'ancienne.
7. **Niveau des sorts** : on prend le plus haut grade dont `minPlayerLevel` ≤ 199. **Glas** (niveau 200) est indisponible pour l'instant.
8. **Dégâts d'une ligne de sort** :
   - Coup normal : `(base moyenne) × (1 + (carac + Puissance)/100) + dommages de l'élément + Dommages`.
   - Coup critique : base critique × le même multiplicateur, + mêmes dommages, + Dommages critiques.
   - Chance de crit = crit de base du sort + crit du stuff, plafonnée à 100 %.
   - **Dégâts moyens** = (1 − chance de crit) × normal + chance de crit × critique. On compte toujours les crits : un stuff « full dégâts bruts » ne doit pas être favorisé à tort.
   - Multiplicateurs : × (1 + % dommages aux sorts) × (1 + (% dommages distance + % dommages mêlée)/2).
   - **Résistances du monstre** ✅ validé par le joueur : on retire d'abord la résistance **fixe**, puis on applique le **%** : `max(0, (dégâts − fixe) × (1 − %/100))`, sur le coup normal et sur le critique.
10. **Trophées** : deux trophées de la même famille (par exemple Puissant mineur et Puissant majeur) peuvent être portés ensemble ✅.
9. **Objets exclus** de la recherche : conditions de quête ou d'alignement, objets « MJ », objets dont la condition empêche d'avoir 12 PA / 6 PM (`CP<12|CM<6`). **Depuis le 24/11/2026** (stuffs à 5 PM autorisés), un objet dont la condition peut être remplie à 12 PA et 5 PM (par exemple `CP<12|CM<6`) peut entrer dans un stuff à 5 PM : sa condition est vérifiée sur les PA et PM totaux du stuff, comme les autres conditions de caractéristiques. Les objets qui imposent moins de 12 PA restent exclus. Objets exclus par le mode « sans » : Dolmanax, Vulbis, Dofus des Glaces, Arcaniste.

## Architecture conseillée (à confirmer avec le joueur)

- `data/` : données DofusDB brutes et figées (JSON). Scripts de récupération, de diff et d'application (voir `data/README.md`).
- `moteur/` : simulateur de combat et optimiseur de stuff. Le prototype Python est dans `sim/`. Le porter en JS/TS permettra plus tard la simulation dans le navigateur.
- `build/` : génère `site/data/*.json` (combos, stuffs, dégâts par sort) à partir de `data/` et du moteur.
- `site/` : le site statique (HTML/CSS/JS sans serveur), publié sur GitHub Pages. Le calcul des dégâts selon le stuff et les résistances choisis se fait côté navigateur, à partir de données pré-calculées. C'est léger, comme dans le prototype.

## Façon de travailler avec le joueur

- **Pose des questions** quand une mécanique n'est pas claire. Ne devine pas : il connaît le jeu et vérifie en jeu.
- Chaque fois qu'il valide une mécanique, mets à jour `docs/MECANIQUES.md` (section « validé en jeu »).
- Ne recalcule jamais un combo marqué « vérifié en jeu » sans le prévenir si le résultat change.
- Avant d'annoncer un « meilleur combo », vérifie-le étape par étape (positions, PA, Téléfrags). Le prototype a déjà produit un faux résultat à cause d'un bord de grille (Pendule téléporté hors de la carte) : la grille de calcul doit être assez grande.
