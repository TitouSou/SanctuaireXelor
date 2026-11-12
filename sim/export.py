import simulateur_avec_cadran as sim, re, json, sys
def parse(path):
    L=open(path).read().split('\n'); i=[k for k,l in enumerate(L) if l.startswith('BEST')][0]
    lines=[]; 
    for l in L[i+1:]:
        if l.startswith('load'): break
        lines.append(l)
    return lines
def init(PA,mp):
    s=sim.S(); s.pos={'X':(0,0),'K':(-2,0),'M':mp}; s.hist={'X':[(-2,0)],'K':[(-2,0),(0,0)],'M':[]}
    s.tf={'X','K'}; s.pa=PA; s.pm=6; s.cnt={}; s.ct={}; s.bonus=set(); s.dmg=0.0; s.sab=None; s.aig=False; s.aigdone=False
    s.flet=0; s.petr=0; s.k=0; s.ready={}; s.load={}; s.indep=False; s.log=[]; s.horl=0
    return s
def replay(path,PA):
    lines=parse(path); mp=tuple(map(int,re.search(r'M\((-?\d+), (-?\d+)\)',lines[0]).groups()))
    s=init(PA,mp); steps=[dict(kind='start',pos=dict(s.pos),tf=sorted(s.tf),pa=s.pa,dmg=0)]
    for l in lines[1:]:
        if l.startswith('  ->'): continue
        if l.startswith('Marche'):
            p=tuple(map(int,re.search(r'-> \((-?\d+), (-?\d+)\)',l).groups())); c=int(re.search(r'\((\d+) PM\)',l).group(1))
            n=sim.clone(s); sim.move(n,'X',p); n.pm-=c
            steps.append(dict(kind='walk',to=p,pm=c,pos=dict(n.pos),tf=sorted(n.tf),pa=n.pa,pa0=s.pa,dmg=0)); s=n; continue
        m=re.match(r'(\w+) -> (\S+|\(.*?\))  \[',l); sp=m.group(1); tg=m.group(2)
        t=s.pos[tg] if tg in ('M','X','K') else tuple(map(int,re.findall(r'-?\d+',tg)))
        pa0=s.pa; d0=s.dmg; b0=set(s.bonus); n=sim.cast(s,sp,t)
        assert n, (sp,t)
        sw=[]
        for a,b in (('X','M'),('X','K'),('M','K')):
            if s.pos[a]==n.pos[b] and s.pos[b]==n.pos[a]: sw.append([s.pos[a],s.pos[b]])
        extra=[x for x in n.log[len(s.log):] if x.startswith('  ->')]
        steps.append(dict(kind='cast',spell=sp,target=tg,cell=t,pos=dict(n.pos),tf=sorted(n.tf),pa0=pa0,pa=n.pa,cost=sim.SP[sp]['pa'],
            gain=2 if (n.bonus-b0) else 0,steal=(n.pa-(pa0-(sim.SP[sp]['pa'] if sp!='Petrification' else max(2,4-s.petr))-(2 if n.bonus-b0 else 0))),
            dmg=round(n.dmg-d0),swaps=sw,events=extra,sab=n.sab,k=n.k))
        s=n
    return steps,mp,round(s.dmg),s.load
if __name__=='__main__':
    st,mp,tot,load=replay(sys.argv[1],int(sys.argv[2]))
    for x in st: print(x)
    print(tot,load)
