import sys, itertools, heapq
# ---------- stats (stuff offensif, jets max, parcho 100) ----------
EL={'T':(11.74,52),'F':(11.01,77),'A':(8.9,77),'E':(4.5,22)}
CRIT=68; DOC=122; MUL=1.06
def avg(el,n,c,cb,extra=0):
    m,do=EL[el]; cc=min(1,(CRIT+cb)/100)
    nn=((n[0]+n[1])/2+extra)*m+do; cr=((c[0]+c[1])/2+extra)*m+do+DOC
    return MUL*((1-cc)*nn+cc*cr)
# ---------- geometry ----------
W=range(-7,8); H=range(-4,5)
CELLS=[(x,y) for x in W for y in H]
CS=set(CELLS)
def d(a,b): return abs(a[0]-b[0])+abs(a[1]-b[1])
def sym(p,c): return (2*c[0]-p[0],2*c[1]-p[1])
def los(a,b,occ):
    # supercover line between cell centers; blocked by occupied cells (excluding endpoints)
    (x0,y0),(x1,y1)=a,b; dx=x1-x0; dy=y1-y0; n=max(abs(dx),abs(dy))
    if n<=1: return True
    pts=set()
    steps=n*4
    for i in range(1,steps):
        t=i/steps; x=x0+dx*t; y=y0+dy*t
        for cx in {round(x-1e-6),round(x+1e-6)}:
            for cy in {round(y-1e-6),round(y+1e-6)}:
                if (abs(cx-x)<0.5-1e-9 or abs(cy-y)<0.5-1e-9) or (abs(abs(cx-x)-0.5)<1e-9 and abs(abs(cy-y)-0.5)<1e-9):
                    pts.add((cx,cy))
    pts.discard(a); pts.discard(b)
    # only keep cells actually touched by segment interior (strict)
    for p in pts:
        if p in occ: return False
    return True
# ---------- spells ----------
# pair id -> variants ; locked pairs (setup): P5,P7,P11,P13,P21
SP={
 'Frappe':dict(p='P19',pa=3,po=(1,3),los=1,line=0,t=3,c=2,cb=10),
 'Pendule':dict(p='P19',pa=4,po=(0,4),los=0,line=0,t=2,c=1,cb=15,taken=1),
 'Perturbation':dict(p='P2',pa=3,po=(1,4),los=1,line=1,t=3,c=2,cb=10),
 'Rouage':dict(p='P2',pa=4,po=(0,2),los=1,line=0,t=2,c=99,cb=15),
 'Souvenir':dict(p='P3',pa=2,po=(1,6),los=1,line=0,t=4,c=2,cb=5),
 'Permutation':dict(p='P3',pa=4,po=(2,2),los=1,line=0,t=2,c=99,cb=15,taken=1),
 'Aiguille':dict(p='P4',pa=2,po=(1,6),los=1,line=0,t=3,c=1,cb=5),
 'Fletrissement':dict(p='P4',pa=3,po=(1,6),los=1,line=0,t=3,c=2,cb=10),
 'Refraction':dict(p='P6',pa=2,po=(1,6),los=1,line=0,t=3,c=2,cb=5),
 'Regulateur':dict(p='P6',pa=3,po=(0,6),los=1,line=0,t=1,c=1,cb=10),
 'Poussiere':dict(p='P8',pa=4,po=(0,6),los=1,line=0,t=2,c=99,cb=15),
 'Gelure':dict(p='P8',pa=2,po=(1,6),los=0,line=1,t=4,c=2,cb=5),
 'Sablier':dict(p='P9',pa=2,po=(0,6),los=0,line=1,t=2,c=1,cb=5),
 'Ralentissement':dict(p='P9',pa=2,po=(1,6),los=1,line=0,t=4,c=2,cb=5),
 'Engrenage':dict(p='P10',pa=3,po=(0,6),los=1,line=0,t=2,c=99,cb=10),
 'CompteGoutte':dict(p='P10',pa=3,po=(1,6),los=1,line=0,t=3,c=2,cb=10,taken=1),
 'Sables':dict(p='P12',pa=4,po=(1,6),los=1,line=0,t=1,c=99,cb=15,taken=1),
 'Distorsion':dict(p='P12',pa=4,po=(0,3),los=1,line=0,t=2,c=99,cb=15),
 'Rayon':dict(p='P14',pa=4,po=(1,6),los=1,line=1,t=1,c=99,cb=15),
 'Dessechement':dict(p='P14',pa=4,po=(1,6),los=1,line=1,t=1,c=99,cb=15,taken=1),
 'Paradoxe':dict(p='P15',pa=2,po=(0,0),los=0,line=0,t=1,c=99,cb=0),
 'Faille':dict(p='P15',pa=4,po=(0,0),los=0,line=0,t=1,c=99,cb=0),
 'Glas':dict(p='P16',pa=3,po=(0,3),los=1,line=1,t=1,c=99,cb=5),
 'Petrification':dict(p='P17',pa=4,po=(1,6),los=1,line=0,t=3,c=2,cb=15),
 'Gousset':dict(p='P17',pa=2,po=(0,6),los=1,line=0,t=2,c=1,cb=5),
 'Horloge':dict(p='P18',pa=4,po=(1,6),los=1,line=0,t=3,c=2,cb=15),
 'Clepsydre':dict(p='P18',pa=4,po=(1,6),los=1,line=0,t=3,c=2,cb=15),
 'Momification':dict(p='P20',pa=2,po=(0,0),los=0,line=0,t=1,c=99,cb=0),
 'Astrolabe':dict(p='P1',pa=2,po=(0,3),los=1,line=0,t=9,c=1,cb=0),
 'Teleportation':dict(p='P1',pa=2,po=(1,5),los=0,line=0,t=9,c=1,cb=0,taken=1),
}
DMG={ # (el, normal range, crit range)
 'Frappe':('T',(22,25),(26,30)),'Pendule':('A',(33,36),(40,43)),'Perturbation':('F',(23,26),(28,31)),'Rouage':('T',(20,22),(24,26)),
 'Souvenir':('A',(10,12),(13,15)),'Permutation':('E',(21,24),(25,29)),'Aiguille':('T',(9,12),(13,16)),'Fletrissement':('A',(25,28),(30,34)),
 'Refraction':('F',(16,18),(19,22)),'Regulateur':('T',(25,28),(30,34)),'Poussiere':('F',(29,32),(35,38)),'Gelure':('E',(10,12),(13,15)),
 'Sablier':('F',(10,12),(13,15)),'SablierBoom':('F',(23,25),(28,30)),'Ralentissement':('E',(15,17),(18,20)),'Engrenage':('T',(22,24),(26,29)),
 'CompteGoutte':('E',(18,21),(22,25)),'Sables':('F',(33,36),(40,43)),'Distorsion':('A',(29,32),(35,38)),'Rayon':('F',(31,34),(37,41)),
 'Dessechement':('A',(31,34),(37,41)),'Petrification':('E',(27,30),(32,36)),'Gousset':('A',(12,14),(15,17)),'Horloge':('T',(23,25),(28,30)),'Clepsydre':('E',(33,37),(40,44)),
}
def sd(name,extra=0):
    el,n,c=DMG[name]; cb=SP[name]['cb'] if name in SP else 5
    return avg(el,n,c,cb,extra)
def glas(k):
    k=min(k,6); tot=0
    for el in 'TFAE': tot+=avg(el,(3+3*k,3+3*k),(4+3*k,4+3*k),5)
    return tot
OPT={'propag':False,'momif_pa':False,'glas_cap':6}
# ---------- state ----------
ENT=('X','M','K')
class S:
    __slots__=('pos','hist','tf','pa','pm','cnt','ct','bonus','dmg','sab','aig','aigdone','flet','petr','k','ready','load','indep','log','horl')
def clone(s):
    n=S(); n.pos=dict(s.pos); n.hist={e:list(h) for e,h in s.hist.items()}; n.tf=set(s.tf); n.pa=s.pa; n.pm=s.pm
    n.cnt=dict(s.cnt); n.ct=dict(s.ct); n.bonus=set(s.bonus); n.dmg=s.dmg; n.sab=s.sab; n.aig=s.aig; n.aigdone=s.aigdone
    n.flet=s.flet; n.petr=s.petr; n.k=s.k; n.ready=dict(s.ready); n.load=dict(s.load); n.indep=s.indep; n.log=list(s.log); n.horl=s.horl
    return n
def occ(s): return {p:e for e,p in s.pos.items()}
def move(s,e,to,pop=False):
    fr=s.pos[e]; h=s.hist[e]
    if pop and h and h[-1]==to: h.pop()
    else: h.append(fr)
    if len(h)>4: del h[0]
    s.pos[e]=to
def teleport(s,e,dest,ev,by_prev=False,prev_targets=()):
    """teleport e to dest with swap semantics; returns True if moved"""
    if dest==s.pos[e] or dest not in CS: return False
    o=occ(s); f=o.get(dest)
    if e=='K' and s.indep: return False
    if f is None: move(s,e,dest,pop=by_prev); return True
    if f=='K' and s.indep: return False
    a=s.pos[e]; move(s,e,dest,pop=by_prev); move(s,f,a,pop=(f in prev_targets))
    s.tf.add(e); s.tf.add(f); ev.append(('swap',e,f)); return True
def prev(s,e): return s.hist[e][-1] if s.hist[e] else None
def gen(s,spell):
    if spell not in s.bonus: s.bonus.add(spell); s.pa+=2
    s.ready['Astrolabe']=True; s.ready['Teleportation']=True
def consume(s,e):
    if e in s.tf:
        s.tf.discard(e); s.k+=1; s.ready['Astrolabe']=True; s.ready['Teleportation']=True
        if e=='M':
            if s.sab is not None:
                s.sab+=1
                if s.sab>=2:
                    s.dmg+=sd('SablierBoom'); s.sab=None; s.log.append('  -> Sablier explose')
            if s.aig and not s.aigdone:
                s.dmg+=sd('Aiguille'); s.aigdone=True; s.log.append('  -> Aiguille')
        return True
    return False
def zone(c,shape,r,caster=None):
    if shape=='C': return [p for p in CELLS if d(p,c)<=r]
    if shape=='X': return [c]+[(c[0]+a,c[1]+b) for a,b in ((1,0),(-1,0),(0,1),(0,-1))]
    if shape=='G': return [(c[0]+a,c[1]+b) for a in (-1,0,1) for b in (-1,0,1)]
    if shape=='O': return [p for p in CELLS if d(p,c)==r]
    if shape=='R': return [p for p in CELLS if 1<=d(p,c)<=r]
def symzone(s,spell,cells,center,exclude_caster=True):
    ev=[]; done=set(); o=occ(s)
    ents=[o[p] for p in cells if p in o]
    for e in ents:
        if e in done: continue
        if exclude_caster and e=='X': continue
        if spell=='Poussiere' and e not in s.tf: continue
        dest=sym(s.pos[e],center); o2=occ(s); f=o2.get(dest)
        moved=teleport(s,e,dest,ev); done.add(e)
        if moved and f: done.add(f)
    return ev
def legal_target(s,spell,t):
    sp=SP[spell]; X=s.pos['X']; dist=d(X,t)
    if not (sp['po'][0]<=dist<=sp['po'][1]): return False
    if sp['line'] and not (X[0]==t[0] or X[1]==t[1]): return False
    o=occ(s)
    if sp.get('taken') and t not in o: return False
    if sp['los'] and dist>1:
        oc=set(o.keys())-{X,t}
        if not los(X,t,oc): return False
    return True
def cast(s,spell,t):
    sp=SP[spell]
    if s.load.get(sp['p'],spell)!=spell: return None
    cost=sp['pa']
    if spell=='Petrification': cost=max(2,4-s.petr)
    if s.pa<cost: return None
    if s.cnt.get(spell,0)>=sp['t']: return None
    if spell in ('Astrolabe','Teleportation') and not s.ready.get(spell,True): return None
    o=occ(s); tgt=o.get(t)
    key=(spell,tgt)
    if tgt and s.ct.get(key,0)>=sp['c']: return None
    if not legal_target(s,spell,t): return None
    n=clone(s); n.load[sp['p']]=spell; n.pa-=cost; n.cnt[spell]=n.cnt.get(spell,0)+1
    if tgt: n.ct[key]=n.ct.get(key,0)+1
    ev=[]; X=n.pos['X']; d0=n.dmg
    if spell in ('Frappe','Perturbation'):
        if not tgt or tgt=='X': return None
        teleport(n,tgt,sym(n.pos[tgt],X),ev)
        if tgt=='M': n.dmg+=sd(spell)
    elif spell=='Pendule':
        if not tgt or tgt=='X': return None
        teleport(n,'X',sym(X,t),ev)
        hit={'M'} if tgt=='M' else set()
        for p in zone(n.pos['X'],'R',2):
            if occ(n).get(p)=='M': hit.add('M')
        n.dmg+=sd('Pendule')*len(hit)
        pv=prev(n,'X')
        if pv: teleport(n,'X',pv,ev,by_prev=True)
    elif spell=='Rouage':
        z=zone(t,'O',2); ev+=symzone(n,spell,z,t)
        if n.pos['M'] in zone(t,'O',2): n.dmg+=sd('Rouage')
    elif spell in ('Souvenir','Gelure'):
        if not tgt: return None
        pv=prev(n,tgt)
        if pv: teleport(n,tgt,pv,ev,by_prev=True)
        if tgt=='M': n.dmg+=sd(spell)
    elif spell=='Permutation':
        if not tgt or tgt=='X': return None
        teleport(n,'X',t,ev)
        if tgt=='M': n.dmg+=sd(spell)
    elif spell=='Aiguille':
        if tgt!='M': return None
        n.aig=True
    elif spell=='Fletrissement':
        if tgt!='M': return None
        n.dmg+=sd(spell,6*n.flet)
        if 'M' in n.tf: n.flet+=1
    elif spell=='Refraction':
        if not tgt or tgt=='X' and 'X' not in n.tf: return None
        was='X' if False else (tgt in n.tf)
        if tgt=='M' and not was: n.dmg+=sd(spell)
        consume(n,tgt)
        if was:
            if d(n.pos['M'],t)<=2: n.dmg+=sd(spell)
            if OPT['propag']:
                for p in zone(t,'C',2):
                    e=occ(n).get(p)
                    if e: n.tf.add(e)
                gen(n,spell)
    elif spell=='Regulateur':
        if tgt!='M': return None
        n.dmg+=sd(spell); consume(n,'M'); n.sab=None; n.aig=False
    elif spell=='Poussiere':
        z=zone(t,'C',2); ev+=symzone(n,spell,z,t,exclude_caster=not OPT.get('pous_caster',True))
        if n.pos['M'] in zone(t,'C',2): n.dmg+=sd(spell)
    elif spell=='Sablier':
        if tgt!='M': return None
        n.dmg+=sd(spell); n.sab=0
    elif spell=='Ralentissement':
        if tgt!='M': return None
        n.dmg+=sd(spell)
        if 'M' in n.tf: n.pa+=1
    elif spell=='Engrenage':
        z=zone(t,'X',1); ev+=symzone(n,spell,z,t)
        if n.pos['M'] in zone(t,'X',1): n.dmg+=sd(spell)
    elif spell=='CompteGoutte':
        if not tgt or tgt=='X': return None
        pv=prev(n,'X')
        if pv: teleport(n,'X',pv,ev,by_prev=True,prev_targets={'X',tgt})
        pv=prev(n,tgt)
        if pv: teleport(n,tgt,pv,ev,by_prev=True,prev_targets={'X',tgt})
        if tgt=='M': n.dmg+=sd(spell)
    elif spell=='Sables':
        if not tgt or tgt=='X': return None
        init=n.pos[tgt]
        cand=sorted([(d(p,init),e) for e,p in n.pos.items() if e!=tgt and 1<=d(p,init)<=2])  # rebond choisi avant la teleportation
        if len(cand)>=2 and cand[0][0]==cand[1][0]: return None  # rebond ambigu : on évite
        pv=prev(n,tgt)
        if pv: teleport(n,tgt,pv,ev,by_prev=True)
        if tgt=='M': n.dmg+=sd(spell)
        if cand:
            e=cand[0][1]; pv=prev(n,e)
            if pv: teleport(n,e,pv,ev,by_prev=True)
            if e=='M': n.dmg+=sd(spell)
    elif spell=='Distorsion':
        z=zone(t,'G',1); o2=occ(n); tg={o2[p] for p in z if p in o2}-{'X'}
        done=set()
        for e in [o2[p] for p in z if p in o2]:
            if e=='X' or e in done: continue
            pv=prev(n,e)
            if pv:
                f=occ(n).get(pv); teleport(n,e,pv,ev,by_prev=True,prev_targets=tg); done.add(e)
                if f: done.add(f)
        if n.pos['M'] in zone(t,'G',1): n.dmg+=sd(spell)
    elif spell=='Rayon':
        dx=(t[0]>X[0])-(t[0]<X[0]); dy=(t[1]>X[1])-(t[1]<X[1])
        z=[(t[0]+dx*i,t[1]+dy*i) for i in range(3)]; o2=occ(n)
        inz=[o2[p] for p in z if p in o2]; ntf=sum(1 for e in inz if e in n.tf)
        if 'M' in inz: n.dmg+=sd('Rayon',12*ntf)
        for e in inz: consume(n,e)
    elif spell=='Dessechement':
        if not tgt: return None
        if tgt=='M': n.dmg+=sd(spell)
        if consume(n,tgt): n.pm+=1
        init=n.pos[tgt]
        cand=sorted([(d(p,init),e) for e,p in n.pos.items() if e!=tgt and 1<=d(p,init)<=2])
        if len(cand)>=2 and cand[0][0]==cand[1][0]: return None
        if cand:
            e=cand[0][1]
            if e=='M': n.dmg+=sd(spell)
            if consume(n,e): n.pm+=1
    elif spell=='Paradoxe':
        n.indep=True; K=n.pos['K']; o2=occ(n)
        for p in zone(K,'C',4):
            e=o2.get(p)
            if e in (None,'K','X'): continue
            teleport(n,e,sym(p,K),ev)
    elif spell=='Faille':
        teleport(n,'X',n.pos['K'],ev)
    elif spell=='Glas':
        if n.k<1: return None
        if n.pos['M'] in zone(t,'G',1): n.dmg+=glas(n.k)
        n.k=0
    elif spell in ('Petrification','Clepsydre','Horloge','Gousset'):
        if tgt!='M': return None
        was='M' in n.tf
        extra=24 if (spell=='Horloge' and was) else 0
        n.dmg+=sd(spell,extra); consume(n,'M')
        if spell=='Petrification' and was: n.petr=min(2,n.petr+1)
    elif spell=='Momification':
        n.tf.add('X'); n.pm+=2
        if OPT['momif_pa']: gen(n,spell)
    elif spell=='Astrolabe':
        if tgt=='X':
            pv=prev(n,'X')
            if not pv: return None
            teleport(n,'X',pv,ev,by_prev=True)
        elif tgt: teleport(n,'X',t,ev)
        else: teleport(n,'X',t,ev)
        n.ready['Astrolabe']=False
    elif spell=='Teleportation':
        if not tgt or tgt=='X': return None
        teleport(n,'X',sym(X,t),ev); n.ready['Teleportation']=False
    if any(e[0]=='swap' for e in ev): gen(n,spell)
    n.log.append(f"{spell} -> {tgt or t}  [X{n.pos['X']} M{n.pos['M']} K{n.pos['K']}] PA {n.pa} TF{sorted(n.tf)} +{n.dmg-d0:.0f}")
    return n
def walks(s):
    if s.pm<=0: return []
    o=occ(s); X=s.pos['X']; seen={X:0}; q=[X]; out=[]
    while q:
        p=q.pop(0)
        if seen[p]>=s.pm: continue
        for dd in ((1,0),(-1,0),(0,1),(0,-1)):
            n=(p[0]+dd[0],p[1]+dd[1])
            if n in CS and n not in o and n not in seen: seen[n]=seen[p]+1; q.append(n)
    for p,c in seen.items():
        if c==0: continue
        if min(d(p,s.pos['M']),d(p,s.pos['K']))<=3:
            n=clone(s); move(n,'X',p); n.pm-=c; n.log.append(f"Marche -> {p} ({c} PM) [X{p} M{n.pos['M']} K{n.pos['K']}]"); out.append(n)
    return out
def targets(s,spell):
    M=s.pos['M']; ents=list(s.pos.values())
    if spell in ('Engrenage',): return zone(M,'X',1)
    if spell in ('Poussiere',): return zone(M,'C',2)
    if spell in ('Distorsion','Glas'): return zone(M,'G',1)
    if spell=='Rouage': return zone(M,'O',2)
    if spell in ('Paradoxe','Faille','Momification'): return [s.pos['X']]
    if spell=='Rayon':
        X=s.pos['X']; out=[]
        for p in ents:
            out.append(p)
        dx=(M[0]>X[0])-(M[0]<X[0]); dy=(M[1]>X[1])-(M[1]<X[1])
        out+= [(M[0]-dx,M[1]-dy),(M[0]-2*dx,M[1]-2*dy)]
        return out
    if spell=='Astrolabe':
        return ents+[p for p in zone(M,'C',1)+zone(s.pos['K'],'C',1) if p not in ents]
    return ents
def key(s):
    return (tuple(sorted(s.pos.items())),tuple((e,tuple(h[-2:])) for e,h in sorted(s.hist.items())),frozenset(s.tf),s.pa,s.pm,
            tuple(sorted(s.cnt.items())),tuple(sorted(s.ct.items())),frozenset(s.bonus),s.sab,s.aig,s.aigdone,s.flet,s.petr,min(s.k,6),
            tuple(sorted(s.ready.items())),tuple(sorted(s.load.items())),s.indep)
def search(PA,mpos_list,beam=6000,depth=16,verbose=False):
    init=[]
    for mp in mpos_list:
        s=S(); s.pos={'X':(0,0),'K':(-2,0),'M':mp}; s.hist={'X':[(-2,0)],'K':[(-2,0),(0,0)],'M':[]}
        s.tf={'X','K'}; s.pa=PA; s.pm=6; s.cnt={}; s.ct={}; s.bonus=set(); s.dmg=0.0; s.sab=None; s.aig=False; s.aigdone=False
        s.flet=0; s.petr=0; s.k=0; s.ready={}; s.load={}; s.indep=False; s.log=[f"Depart: X(0,0) K(-2,0) M{mp}  PA {PA}"]; s.horl=0
        init.append(s)
    frontier=init; best=None
    for dep in range(depth):
        nxt={}
        for s in frontier:
            succ=[]
            for sp in SP:
                for t in set(targets(s,sp)):
                    if t not in CS: continue
                    r=cast(s,sp,t)
                    if r: succ.append(r)
            if dep<depth-1: succ+=walks(s)
            for n in succ:
                kk=key(n)
                if kk not in nxt or nxt[kk].dmg<n.dmg: nxt[kk]=n
                if best is None or n.dmg>best.dmg: best=n
        if not nxt: break
        frontier=sorted(nxt.values(),key=lambda s:-(s.dmg+140*s.pa))[:beam]
        if verbose: print(dep,len(nxt),round(best.dmg),flush=True)
    return best
if __name__=='__main__':
    PA=int(sys.argv[1]); beam=int(sys.argv[2]) if len(sys.argv)>2 else 3000
    mps=[p for p in CELLS if p not in ((0,0),(-2,0)) and d(p,(0,0))<=4 and abs(p[1])<=2]
    b=search(PA,mps,beam=beam,verbose=True)
    print('BEST',round(b.dmg)); print('\n'.join(b.log)); print('load',b.load)
