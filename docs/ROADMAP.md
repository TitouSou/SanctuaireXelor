# Feuille de route

Chaque étape se termine par une vérification avec le joueur avant de passer à la suivante.

## Étape 1 : fondations

1. Créer le dépôt GitHub et la structure (`data/`, `moteur/`, `build/`, `site/`). Activer GitHub Pages sur `site/` (ou via une GitHub Action).
2. Récupérer les données DofusDB avec `data/fetch_dofusdb.mjs` (voir `data/README.md`). Le joueur relit le résumé, puis on fige le jeu de données.
3. Porter le moteur depuis `sim/` (Python) en JS/TS, ou garder Python pour le build : à décider avec le joueur.
4. **Tests de non-régression** : retrouver tous les chiffres de `docs/RESULTATS_REFERENCE.md`.

État (13/11/2026) : **terminée**. Dépôt https://github.com/TitouSou/SanctuaireXelor, site publié par GitHub Actions (tests avant chaque publication) ; données DofusDB figées dans `data/current/` ; moteur JS identique au Python ; tests de non-régression : `outils/test_reference.mjs`, `outils/test_donnees.mjs`, `moteur/tests/test_portage.mjs`, `moteur/tests/test_moteur.mjs`.

## Étape 2 : moteur complet

1. Ajouter les **résistances du monstre** (% et fixes par élément), dans l'ordre validé : fixe, puis % (déjà codé dans `outils/degats.mjs`).
2. Modéliser **Synchro** (explosion en cercle de 3, dégâts à demander), **Désynchronisation** (piège en cercle de 2, déclenché à la marche et à la téléportation) et **Espace-temps** (voir `docs/MECANIQUES.md`).
3. Ajouter la situation **« monstre au corps à corps au départ »**.
4. Généraliser l'optimiseur de stuff à toutes les voies : un Offensif et un Équilibré (≥ 3 000 PV) par voie, en maximisant les dégâts des combos de la voie. Prévoir les deux modes d'objets (tous / sans Turquoise, Dolmanax, Vulbis, Glaces).

État (13/11/2026) :

- Fait : résistances dans la formule ; Désynchronisation et Espace-temps dans le moteur (aucun gain sur Terre-Feu) ; contrainte d'équilibre entre éléments (10 %) dans l'optimiseur ; voie Terre-Feu complète (T1 à 13 et à 12 PA, set-up, T2 à 22 et à 23 PA, tous vérifiés en jeu ; stuffs Offensif et Équilibré équilibrés).
- **En cours** : situation « monstre au corps à corps au départ » pour Terre-Feu (définie le 14/11/2026 : T1 à 12 PA et T2 à 22 PA, monstre collé en ligne, tacle). Combos calculés et simulés : à tester en jeu.
- Reste : Synchro (dégâts à demander au joueur) ; résistances branchées dans l'optimiseur et les tests ; optimiseur pour toutes les voies (plus stable : chaque stuff n'est trouvé qu'une ou deux fois sur 16 essais).

## Étape 3 : contenu, par voie (les bi-éléments d'abord)

Ordre suggéré : Terre-Feu (déjà fait, à reprendre), puis Terre-Eau, Terre-Air, Feu-Eau, Feu-Air, Eau-Air ; ensuite les mono Terre, Feu, Eau, Air ; enfin la multi.

Pour chaque voie :

1. Calculer les stuffs Offensif et Équilibré.
2. Calculer les combos : T1 burst à 13 et à 12 PA, T2 à 22 et à 23 PA (même choix de variantes), corps à corps au départ. Le set-up est commun à toutes les voies.
3. Vérifier chaque combo pas à pas, puis le soumettre au joueur pour un test en jeu. Statut « simulé » jusqu'à sa validation, puis « vérifié en jeu ».

## Étape 4 : le site

- Une page d'accueil, une page par voie, une page « Mécaniques » (le contenu de `docs/MECANIQUES.md` mis en forme), une page « Set-up ».
- Pour chaque combo : le plateau pas à pas (vue Dofus ou plate), le choix du stuff, le choix des résistances du monstre, le statut vérifié/simulé.
- Une fiche des dégâts par sort (Synchro comprise), selon le stuff et les résistances choisis.

## Plus tard

- Niveau 200 (Glas et grades de sorts) ; exos PA/PM ; contributions de visiteurs ; saisie de son propre stuff ; placement libre du monstre avec recherche en direct ; simulateur libre des sorts Xélor ; PvP.
