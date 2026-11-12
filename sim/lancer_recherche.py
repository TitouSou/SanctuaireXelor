# Recherche du meilleur combo T2 (sans Cadran) avec le simulateur.
# Usage : python sim/lancer_recherche.py <PA> <beam> [sorts_interdits,separes,par,virgules]
# Exemple (choix de variantes T2 actuel, voir README) :
#   python sim/lancer_recherche.py 22 4000 Glas,Perturbation,Permutation,Regulateur,Gelure,Ralentissement,CompteGoutte,Distorsion,Dessechement,Clepsydre
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import simulateur as sim
PA = int(sys.argv[1]); beam = int(sys.argv[2])
ban = sys.argv[3].split(',') if len(sys.argv) > 3 and sys.argv[3] else []
for b in ban: sim.SP.pop(b, None)
# Sans Cadran sur le plateau : Paradoxe et Faille (qui utilisent le Cadran) sont retirés d'office.
for b in ('Paradoxe', 'Faille'): sim.SP.pop(b, None)
# Toutes les cases de départ du monstre jusqu'à 4 cases du Xélor (et au plus 2 lignes d'écart).
mps = [p for p in sim.CELLS if p != (0, 0) and sim.d(p, (0, 0)) <= 4 and abs(p[1]) <= 2]
best = sim.search2(PA, mps, beam=beam, verbose=True)
print('BEST', round(best.dmg)); print('\n'.join(best.log)); print('load', best.load)
