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
4. Généraliser l'optimiseur de stuff à toutes les voies : un Offensif et un Équilibré (≥ 3 000 PV à l'origine, nouveau profil le 16/11/2026) par voie, en maximisant les dégâts des combos de la voie. Prévoir les deux modes d'objets (tous / sans Turquoise, Dolmanax, Vulbis, Glaces).

État (15/11/2026) :

- Fait : résistances dans la formule, branchées dans l'optimiseur (`--resist`), la recherche de combos et les tests (13/11/2026) ; Désynchronisation et Espace-temps dans le moteur (aucun gain sur Terre-Feu) ; contrainte d'équilibre entre éléments (10 %) dans l'optimiseur ; voie Terre-Feu complète (T1 à 13 et à 12 PA, set-up, T2 à 22 et à 23 PA, tous vérifiés en jeu ; stuffs Offensif et Équilibré équilibrés).
- Fait aussi : situation « monstre au corps à corps au départ » pour Terre-Feu (définie le 13/11/2026 : T1 à 12 PA et T2 à 22 PA, monstre collé en ligne, tacle) ; 4 combos vérifiés en jeu (avec et sans Espace-temps).
- Fait aussi (13-14/11/2026) : optimiseur et pilote pour toutes les voies (`outils/pilote_voies.mjs`) : stuffs Offensif et Équilibré et combos de toutes les situations pour les 11 voies, dans `site/data/voies/` et `docs/RESULTATS_VOIES.md` (statut « simulé », sauf Terre-Feu). Optimiseur plus stable grâce à la descente par paires d'objets : il retrouve seul les stuffs Terre-Feu de référence.
- Fait aussi (14/11/2026) : le joueur a validé ou corrigé tous les sorts utilisés par les combos (Régulateur, Compte-goutte, Aiguille corrigés dans le moteur ; effets différés de Gousset et Clepsydre affichés à part). Les 11 voies ont été recalculées ; en Terre-Feu, de nouveaux combos avec l'Aiguille font mieux que ceux vérifiés en jeu (+5 % environ, à tester).
- Fait aussi (15/11/2026) : **Synchro**. Dégâts par niveau donnés par le joueur (`SYNCHRO_DEGATS` et `degatsSynchro` dans `moteur/formule.mjs`, résistances Air comprises). Décision du joueur : elle n'entre dans aucun combo, le site affichera seulement ses dégâts par niveau.
- Fait (17/11/2026) : **stuffs Équilibrés recalculés** pour les 11 voies avec le nouveau profil (au moins 3 500 PV, 4 500 n'étant qu'un repère ; aucune résistance % négative ; moyenne ≥ 20 % ; plus de condition de portée ; voir `docs/MECANIQUES.md`), sur les combos déjà publiés (`node outils/pilote_voies.mjs --equilibres-seulement`). Les 11 voies tiennent toutes les contraintes. Recherche par passes de 16 essais jusqu'à convergence (18/11/2026) : 8 voies convergées, Terre-Eau et Feu-Eau arrêtées au maximum de 10 passes (meilleur stable mais retrouvé 2 fois au hasard) ; Eau-Air relancée seule le 18/11/2026 : convergée en 25 passes (400 essais), même stuff (4 400). Lecture des malus corrigée (plus petit malus, validé le 17/11/2026) : les Offensifs avec l'Amulette Rangleur restent à recalculer. Offensifs et combos inchangés ; la page Stuffs affiche les résistances % des deux profils.
- Fait (18/11/2026) : **coup d'arme**. Données d'arme récupérées (coût, portée, critique, utilisations par tour…) et sort commun Maîtrise d'Arme ; règles données par le joueur (formule vérifiée sur ses captures, Espace-temps une fois par ligne, mêlée au contact, déplacements d'arme). Le moteur lance le coup d'arme, l'optimiseur note un stuff sur le meilleur jeu de combos jouable avec son arme, et le pilote (`--avec-arme`) recalcule les Offensifs des 11 voies avec leurs combos ; les Équilibrés gardent leur stuff, leurs combos sont cherchés avec leur arme. Décision du joueur : **chaque stuff a ses combos et son jeu de variantes**. Site, fiche et build affichent les combos du stuff choisi ; le plateau montre le coup d'arme (icône faite maison).
- Fait (19/11/2026) : **calcul complet avec le coup d'arme** (30 h). Offensifs des 11 voies recalculés avec leurs combos : de +0,8 % (Terre) à +8,3 % (Multi) ; 10 Offensifs sur 11 tapent avec l'arme (Katana de Spiritueur sauf Terre et Terre-Eau : Serpe Aigrie, Eau : Tonfas de Barbéryl). Équilibrés : stuffs gardés, combos cherchés avec leur arme (jusqu'à +2,5 %). 143 combos vérifiés pas à pas, dont 74 coups d'arme (PA, portée et alignement, ligne de vue, une utilisation par tour). Terre, Terre-Eau et Terre-Air, non convergés en 10 passes, ont été relancés le 20/11/2026 avec 30 passes au plus : tous convergés (Terre-Air en 11 passes, Terre en 25, Terre-Eau en 24 puis 12 au tour 2), sur les mêmes stuffs et les mêmes combos. En Terre, l'Offensif reprend le stuff Équilibré, qui fait mieux.
- **Étape 2 terminée.** Reste pour l'étape 3 : tests en jeu des combos des 10 nouvelles voies et des nouveaux combos Terre-Feu (statut « simulé » en attendant).

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

État (15/11/2026) : **première version faite**, à relire par le joueur. Pages `index.html` (accueil), `voie.html?v=<voie>` (combos pas à pas, stuff Offensif ou Équilibré, résistances, combo vérifié en jeu à côté du nouveau combo), `stuffs.html` (ajoutée à la demande du joueur le 15/11/2026 : choix de la voie et du profil Offensif ou Équilibré, objets avec leurs effets au jet max, panoplies, écart avec l'autre profil), `setup.html`, `sorts.html` (avec la Synchro), `mecaniques.html` (générée). Les étapes sont rejouées au build (`build/construire_site.mjs`) ; le navigateur ne recalcule que les dégâts, avec la formule du moteur, et retrouve exactement les dégâts publiés (testé). L'ancien `prototype.html` reste en ligne mais n'est plus lié.

Fait (20/11/2026) : **sprites officiels des objets** dans les stuffs : 56 px sur la page Stuffs, 28 px dans la liste du stuff des pages de voie, case vide en pointillés laiton si l'image ne se charge pas. Choix du joueur : **site public avec crédits Ankama** (mention de site de fan non officiel en pied de toutes les pages ; « sans visuel d'Ankama » remplacé sur l'accueil) et images **chargées depuis DofusDB**, pas copiées dans le dépôt. Les champs `iconId` et `img` des objets ont été ajoutés à `data/fetch_dofusdb.mjs` ; seul `data/current/items.json` a changé (aucune autre différence). Voir la ligne « Visuel » de `CLAUDE.md`.

Fait (26/11/2026) : **Dofus Turquoise autorisé, Arcaniste banni, stuffs à 5 PM autorisés** (trois décisions du joueur du 24/11/2026, voir `CLAUDE.md` : « Restriction d'objets », « Stuffs », règle 9). Mode d'objets du joueur : « sans Dolmanax, Vulbis, Dofus des Glaces, Arcaniste ».

- `EXCLUS_SANS` (optimiseur et pilote) : Turquoise retiré, Arcaniste ajouté. Les règles d'objets et les PM sont dans la clé du cache du pilote (`reglesObjets`) ; les objets à condition `CM<6` peuvent entrer dans un stuff à 5 PM (`outils/conditions.mjs`) ;
- **effet du Dofus Turquoise** modélisé en moyenne, dans l'ordre des coups (hypothèses ❓ dans `docs/MECANIQUES.md`) : règle unique `multiplicateursTurquoise` dans `moteur/formule.mjs`, utilisée par l'optimiseur (`comboOrdonne`), la publication, le contrôle pas à pas et le site (ordre des coups écrit dans `site/data/pas/`, dégâts recalculés selon les résistances). Environ +150 à +250 par combo ;
- **22 stuffs recalculés sans toucher aux combos** (idée du joueur) : à 6 PM, descente depuis les stuffs publiés (l'Arcaniste retiré, sa place remplie), puis une passe de recuit d'affinage ; à 5 PM, dépistage (une passe de recuit, une deuxième pour les 13 stuffs proches du seuil, qui n'a rien changé). Bilan : `outils/resultats/voies/bilan-stuffs-pm.md` (`outils/bilan_stuffs_pm.mjs`) ; application : `outils/appliquer_stuffs.mjs` ;
- **règle des +5 %** : 5 stuffs passent à 5 PM (Terre-Air Offensif et Équilibré, Eau-Air Équilibré, Eau Offensif et Équilibré), les 17 autres restent à 6 PM. Le Turquoise est dans les 22 stuffs ; tous les Équilibrés tiennent leurs contraintes ;
- les combos ne sont pas recherchés à nouveau : chaque stuff reçoit le jeu de combos sur lequel il a été noté (souvent celui de l'Offensif) ; le corps à corps est le plus fort des corps à corps connus jouable avec son arme. La recherche des combos (moteur) ne connaît pas le Turquoise : une recherche complète des combos avec les nouveaux stuffs reste possible (environ 30 h, au choix du joueur) ;
- Terre-Feu : les combos vérifiés en jeu restent affichés à côté des combos simulés ; l'Équilibré prend maintenant les combos de l'Offensif, et son corps à corps T1 vérifié (3 476 avec l'ancien stuff) est remplacé par un combo simulé plus fort (3 527 contre 3 485 avec le nouveau stuff) ;
- textes mis à jour (`site/index.html`, `site/stuffs.html`, `outils/fiche_voies.mjs` donc `docs/RESULTATS_VOIES.md`) ; la page Stuffs marque les stuffs à 5 PM (pastille dans la liste des voies, chiffre clé PA / PM, encart avec le gain par rapport au meilleur 6 PM) ; `docs/RESULTATS_REFERENCE.md` inchangé.

## Plus tard

- Niveau 200 (Glas et grades de sorts) ; exos PA/PM ; contributions de visiteurs ; saisie de son propre stuff ; placement libre du monstre avec recherche en direct ; simulateur libre des sorts Xélor ; PvP.
