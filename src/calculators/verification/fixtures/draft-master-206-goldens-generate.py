"""Offline independent reference: mpmath 130 digits, Decimal half-even 34.
Exact degree identities are mathematical cases, never tolerance clamps.
Run from repository root with python3; runtime has no Python dependency.
"""
import json
from decimal import Decimal, localcontext, ROUND_HALF_EVEN
from pathlib import Path
import mpmath as mp
mp.mp.dps = 130
cases = [
('sin','30','degrees'),('sin','90','degrees'),('sin','180','degrees'),('cos','90','degrees'),('tan','45','degrees'),('tan','180','degrees'),('sin','-180','degrees'),('cos','270','degrees'),('tan','225','degrees'),('sin','1000000','degrees'),
('sin','0.000000000000000000000000000000001','degrees'),('cos','89.99999999999999999999999999999999','degrees'),('sin','-90.00000000000000000000000000000001','degrees'),('cos','270.0000000000000000000000000000001','degrees'),('tan','89.99999999999999999999999999999999','degrees'),('tan','90.00000000000000000000000000000001','degrees'),('sin','0','radians'),('cos','0','radians'),('tan','0','radians'),('sin','1','radians'),('cos','1000000','radians'),('tan','1','radians'),('asin','0.5','degrees'),('acos','-1','degrees'),('atan','1','degrees'),('asin','1','radians'),('acos','0','radians'),('atan','1000000','radians'),
('sqrt','2',None),('sqrt','4',None),('sqrt','0.000000000000000000000000000000001',None),('ln','2',None),('ln','1000000',None),('log10','1000',None),('exp','1000',None),('exp','-1000',None),('exp','0.000000000000000000000000000000001',None),('pow','-2',None,'3'),('pow','1000000',None,'1000'),('pow','2',None,'-1000'),('pow','2',None,'0.5'),('pow','1.234567890123456789012345678901234',None,'1'),('pow','1.000000000000000005',None,'2'),('pow','1.000000000000000015',None,'2'),('pow','0.0000000001',None,'1000')]
vectors=[]
for c in cases:
 op,x,mode,*ys=c; a=mp.mpf(x); y=ys[0] if ys else None
 inp={'operation':op,'x':x}
 if mode:inp['angleMode']=mode
 if y is not None:inp['y']=y
 arg=a*mp.pi/180 if mode=='degrees' and op in ('sin','cos','tan') else a
 if op=='pow':r=mp.power(a,mp.mpf(y))
 elif op=='log10':r=mp.log10(a)
 else:r=getattr(mp,op)(arg)
 if op in ('asin','acos','atan') and mode=='degrees':r=r*180/mp.pi
 # Independent exact angle identities, asserted only for established lattice.
 if mode=='degrees' and op in ('sin','cos') and a%90==0:
  q=int(a/90)%4;r=mp.mpf(([0,1,0,-1] if op=='sin' else [1,0,-1,0])[q])
 if mode=='degrees' and op=='tan' and a%45==0:r=mp.mpf([0,1,None,-1][int(a/45)%4])
 with localcontext() as ctx:
  ctx.prec=34;ctx.rounding=ROUND_HALF_EVEN
  d=+Decimal(mp.nstr(r,125));s=format(d,'f')
  if '.' in s:s=s.rstrip('0').rstrip('.')
  if d==0:s='0'
 vector={'input':inp,'expected':{'result':s}}
 vectors.append(vector)
Path('src/calculators/verification/fixtures/draft-master-206-goldens.json').write_text(json.dumps({'reference':'mpmath 130 decimal digits; Python Decimal precision34 ROUND_HALF_EVEN; exact degree lattice identities','vectors':vectors},indent=2)+'\n')
