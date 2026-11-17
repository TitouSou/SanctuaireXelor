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
| Situations de combo, pour chaque voie | **T1 burst à 13 PA** (Ocre actif) et **à 12 PA** (Ocre inactif), deux combos distincts ; **Set-up** (identique pour toutes les voies, il prépare 22 PA) ; **T2 burst à 22 PA** et **à 23 PA** (avec et sans le PA de l'Ocre, **le même choix de variantes** pour les deux) ; **monstre au corps à corps au départ** (T1 à 12 PA et T2 à 22 PA : le monstre a frappé, pas de PA de l'Ocre ; défini dans `docs/MECANIQUES.md`) |
| Stuffs | Pour chaque voie : un **Offensif** et un **Équilibré** (repères PvM du joueur, 16/11/2026 : 12 PA / 6 PM, **au moins 3 500 PV** (4 500 est un repère, pas une limite), pas de condition de portée, **aucune résistance % négative** et **au moins 20 % de résistance moyenne** sur les cinq éléments, viser 20 à 30 % ; en perdant le moins de dégâts possible sur les combos de la voie). La page permet de choisir |
| Restriction d'objets | Deux modes globaux : **« tous les objets »** et **« sans Turquoise, Dolmanax, Vulbis, Dofus des Glaces »**. Le joueur utilise le second. Pas de réglage objet par objet pour l'instant |
| Exos PA / PM | Pas pour l'instant |
| Résistances du monstre | **Réglables partout** (% et fixes par élément), y compris pour les dégâts de la Synchro |
| Statut de chaque combo | Étiquette **« vérifié en jeu »** ou **« simulé »** |
| Visuel | On garde le style du prototype : horlogerie, laiton, plateau en **vue Dofus** (losanges à 45°) avec option vue plate, pas à pas. **Aucun visuel ni icône d'Ankama** : uniquement des visuels faits maison |
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
9. **Objets exclus** de la recherche : conditions de quête ou d'alignement, objets « MJ », objets dont la condition empêche d'avoir 12 PA / 6 PM (`CP<12|CM<6`).

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
