import simulateur as sim
def nc(name,extra=0):
    el,n,c=sim.DMG[name]; m,do=sim.EL[el]; cb=sim.SP[name]['cb'] if name in sim.SP else 5
    nn=sim.MUL*(((n[0]+n[1])/2+extra)*m+do); cr=sim.MUL*(((c[0]+c[1])/2+extra)*m+do+sim.DOC)
    return dict(n=round(nn),c=round(cr),m=round(sim.avg(el,n,c,cb,extra)),cc=min(100,sim.CRIT+cb))
def ncglas(k):
    nn=cr=0
    for el in 'TFAE':
        m,do=sim.EL[el]; nn+=sim.MUL*((3+3*k)*m+do); cr+=sim.MUL*((4+3*k)*m+do+sim.DOC)
    return dict(n=round(nn),c=round(cr),m=round(sim.glas(k)),cc=73)
if __name__=='__main__':
    import json
    out={k:nc(k) for k in ['Engrenage','Sablier','SablierBoom','Poussiere','Sables','Perturbation','Frappe','Souvenir','Refraction','Regulateur','Horloge']}
    out['Horloge24']=nc('Horloge',24); out['Rayon24']=nc('Rayon',24); out['Glas2']=ncglas(2)
    print(json.dumps(out))
