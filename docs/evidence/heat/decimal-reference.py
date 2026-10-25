"""Independent Decimal transcription, not an invocation of the TypeScript kernel."""
from decimal import Decimal as D, getcontext
getcontext().prec = 40
for ts, rs in [('95','10'),('80','90'),('80','0'),('90','50'),('112','13')]:
    t,r=D(ts),D(rs)
    a=-D('10.3')+D('1.1')*t+D('.047')*r
    b=sum([D('-42.379'),D('2.04901523')*t,D('10.14333127')*r,-D('.22475541')*t*r,-D('.00683783')*t*t,-D('.05481717')*r*r,D('.00122874')*t*t*r,D('.00085282')*t*r*r,-D('.00000199')*t*t*r*r])
    result=a if a<D(79) else b
    if r<=13 and 80<=t<=112: result-=(13-r)/4*((17-abs(t-95))/17).sqrt()
    if r>85 and 80<=t<=87: result+=D('.02')*(r-85)*(87-t)
    print(ts,rs,result)
