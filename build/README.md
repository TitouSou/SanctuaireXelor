# Build

`construire_site.mjs` prépare les données du site à partir des voies publiées (`site/data/voies/*.json`, écrites par `outils/publier_voies.mjs`) et du moteur (`moteur/`). Le navigateur ne simule rien : il lit les étapes rejouées ici et recalcule seulement les dégâts selon le stuff et les résistances choisis, avec la même formule que le moteur.

| Fichier écrit | Contenu |
|---|---|
| `site/data/index.json` | Les voies, leurs moyennes et leurs statuts (page d'accueil) |
| `site/data/sorts.json` | Dégâts de base de chaque sort (lignes « Sort\|bonus de base »), noms, PA, Synchro par niveau |
| `site/data/pas/<voie>.json` | Pour chaque combo (et le combo vérifié en jeu quand il est gardé à côté) : départ, puis chaque étape (positions, positions précédentes, Téléfrags, PA, PM, Sablier, Aiguille, Espace-temps, case visée, zone, déplacements, événements, effets différés, lignes de dégâts) |
| `site/js/formule.mjs` | Copie de `moteur/formule.mjs` |
| `site/mecaniques.html` | `docs/MECANIQUES.md` mis en page (gabarit : `gabarit_mecaniques.html`) |

```
node build/construire_site.mjs              # écrit les fichiers
node build/construire_site.mjs --verifier   # n'écrit rien : échoue si un fichier n'est pas à jour, ou si la formule du site
                                            # ne redonne pas exactement les dégâts publiés (lancé par moteur/tests/test_moteur.mjs)
```

À relancer après chaque `outils/publier_voies.mjs`, chaque modification de `moteur/formule.mjs` ou de `docs/MECANIQUES.md`.

## Voir le site en local

Les pages utilisent des modules JavaScript : il faut un petit serveur, pas un double-clic sur le fichier.

```
py -m http.server 8765 --directory site
```

Puis ouvrir http://localhost:8765.
