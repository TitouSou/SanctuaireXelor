# Génère moteur/tests/fixture_python.json à partir du prototype Python (sim/simulateur.py).
# Usage :  py moteur/tests/generer_fixture_python.py   (ou python3)
#
# Parcours aléatoires (graine fixe) depuis trois départs : T2 sans Cadran, T1 sans Téléfrag, avec Cadran.
# Pour chaque état visité, on enregistre l'état complet et l'empreinte de TOUS ses successeurs
# (sorts sur toutes les cibles + marches). moteur/tests/test_portage.mjs doit retrouver exactement
# les mêmes successeurs avec le moteur JS.
import sys, os, json, random, hashlib
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'sim'))
import simulateur as sim

SP_COMPLET = dict(sim.SP)
P = lambda p: f"{p[0]},{p[1]}"
B = lambda b: '1' if b else '0'

def canon(s):
    ents = sorted(s.pos)
    return '#'.join([
        ';'.join(e + P(s.pos[e]) for e in ents),
        ';'.join(e + '/'.join(P(p) for p in s.hist[e]) for e in ents),
        ''.join(sorted(s.tf)), str(s.pa), str(s.pm),
        ','.join(f"{k}:{v}" for k, v in sorted(s.cnt.items())),
        ','.join(f"{k[0]}|{k[1]}:{v}" for k, v in sorted(s.ct.items())),
        ','.join(sorted(s.bonus)),
        'None' if s.sab is None else str(s.sab), B(s.aig), B(s.aigdone), str(s.flet), str(s.petr), str(s.k),
        ','.join(f"{k}:{B(v)}" for k, v in sorted(s.ready.items())),
        ','.join(f"{k}:{v}" for k, v in sorted(s.load.items())),
        B(s.indep),
    ])

def ser(s):
    return dict(pos={e: list(p) for e, p in s.pos.items()}, hist={e: [list(p) for p in h] for e, h in s.hist.items()},
                tf=sorted(s.tf), pa=s.pa, pm=s.pm, cnt=s.cnt, ct=[[k[0], k[1], v] for k, v in s.ct.items()],
                bonus=sorted(s.bonus), dmg=s.dmg, sab=s.sab, aig=s.aig, aigdone=s.aigdone, flet=s.flet, petr=s.petr,
                k=s.k, ready=s.ready, load=s.load, indep=s.indep)

def succ(s):
    out = []
    for sp in sim.SP:
        for t in sorted(set(sim.targets(s, sp))):
            if t not in sim.CS: continue
            r = sim.cast(s, sp, t)
            if r: out.append((sp, r))
    for w in sim.walks(s): out.append(('marche', w))
    return out

def base(pos, hist, tf, pa, pm):
    s = sim.S(); s.pos = pos; s.hist = hist; s.tf = set(tf); s.pa = pa; s.pm = pm; s.cnt = {}; s.ct = {}; s.bonus = set()
    s.dmg = 0.0; s.sab = None; s.aig = False; s.aigdone = False; s.flet = 0; s.petr = 0; s.k = 0; s.ready = {}; s.load = {}
    s.indep = False; s.log = []; s.horl = 0
    return s

rng = random.Random(20261112)
mps = [p for p in sim.CELLS if p != (0, 0) and sim.d(p, (0, 0)) <= 4 and abs(p[1]) <= 2]
mpsK = [p for p in mps if p != (-2, 0)]
chaines = []
CONFIGS = [('t2', 40), ('t1', 25), ('cadran', 25)]
for kind, nb in CONFIGS:
    for _ in range(nb):
        sim.SP = dict(SP_COMPLET)
        if kind == 'cadran':
            mp = rng.choice(mpsK)
            s = base({'X': (0, 0), 'K': (-2, 0), 'M': mp}, {'X': [(-2, 0)], 'K': [(-2, 0), (0, 0)], 'M': []}, ['X', 'K'], rng.choice([18, 22, 23]), 6)
        else:
            for b in ('Paradoxe', 'Faille'): sim.SP.pop(b)
            mp = rng.choice(mps)
            s = base({'X': (0, 0), 'M': mp}, {'X': [], 'M': []}, ['X'] if kind == 't2' else [], 22 if kind == 't2' else 13, 3)
        etapes = []
        for _ in range(14):
            sc = succ(s)
            items = sorted((canon(n), round(n.dmg, 6)) for _, n in sc)
            h = hashlib.sha1('\n'.join(c for c, _ in items).encode()).hexdigest()
            etapes.append(dict(etat=ser(s), n=len(items), empreinte=h, dmg=[d for _, d in items]))
            if not sc: break
            casts = [n for k, n in sc if k != 'marche']; marches = [n for k, n in sc if k == 'marche']
            pool = casts if casts and (not marches or rng.random() < 0.85) else marches
            s = rng.choice(pool)
        chaines.append(dict(type=kind, sorts=list(sim.SP), etapes=etapes))

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixture_python.json')
with open(out, 'w', encoding='utf-8') as f: json.dump(dict(source='sim/simulateur.py', graine=20261112, chaines=chaines), f, separators=(',', ':'))
print(f"{sum(len(c['etapes']) for c in chaines)} états, {sum(e['n'] for c in chaines for e in c['etapes'])} successeurs -> {out}")
