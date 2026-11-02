"""Independent Fraction statistics and Decimal sqrt oracle; Python stdlib only."""
import decimal, fractions, hashlib, json, pathlib, platform
F = fractions.Fraction
cases = [
 ('ordinary', ['2','4','4','4','5','5','7','9'], None),
 ('decimal', ['0.1','1.1'], None),
 ('tiny', ['1e-100','1.000000000000000000000000000000001e-100'], None),
 ('tiny-frequency', ['1e-100','1.000000000000000000000000000000001e-100'], [9999999,1]),
 ('large-close', ['1.000000000000000000000000000000001e100','1e100'], None),
 ('mixed-range', ['1e100','1e-100'], None),
 ('cancellation', ['1e100','1e-100','-1e100'], None),
 ('frequency', ['0.1','0.3'], [5000000,5000000]),
 ('signed', ['-7.125','0','3.456','2.222'], [3,1,4,2]),
 ('constant', ['-0.0','0e999'], [4,7]),
]
def reference(tokens, freq, mode, precision):
 decimal.getcontext().prec = precision
 vals = sorted(zip(map(F,tokens),freq))
 n = sum(freq); s = sum(x*f for x,f in vals); mean = s/n
 m2 = sum(f*(x-mean)**2 for x,f in vals); var = m2/(n if mode=='population' else n-1)
 def rank(k, data=vals):
  c = 0
  for x,f in data:
   c += f
   if k < c: return x
 def q(k):
  h = F((n-1)*k,4); j = h.numerator//h.denominator
  return rank(j)+(h-j)*(rank(min(j+1,n-1))-rank(j))
 med=q(2); dev=sorted((abs(x-med),f) for x,f in vals)
 mad=(rank((n-1)//2,dev)+rank(n//2,dev))/2
 result=dict(sum=s,mean=mean,centeredM2=m2,variance=var,minimum=vals[0][0],maximum=vals[-1][0],range=vals[-1][0]-vals[0][0],q1=q(1),median=med,q3=q(3),iqr=q(3)-q(1),rawMad=mad,meanAbsoluteDeviation=sum(f*abs(x-mean) for x,f in vals)/n)
 def dec(x): return decimal.Decimal(x.numerator)/decimal.Decimal(x.denominator)
 return {**{k:str(dec(v)) for k,v in result.items()},'standardDeviation':str(dec(var).sqrt())}
out=[]
for name,tokens,frequencies in cases:
 freq=frequencies or [1]*len(tokens)
 for mode in ['population','sample']:
  r100=reference(tokens,freq,mode,100); r200=reference(tokens,freq,mode,200)
  for key in r100:
   a,b=decimal.Decimal(r100[key]),decimal.Decimal(r200[key])
   assert a==b==0 or abs(a-b)<=abs(b)*decimal.Decimal('1e-95')
  out.append(dict(name=name,mode=mode,encoding='frequency' if frequencies else 'raw',rows=[dict(value=x,**({'frequency':str(f)} if frequencies else {})) for x,f in zip(tokens,freq)],expected=r200))
path=pathlib.Path(__file__)
print(json.dumps(dict(oracle='Python Fraction exact rationals, Decimal sqrt at 100 and 200 digits',runtime=platform.python_version(),oracleSHA256=hashlib.sha256(path.read_bytes()).hexdigest(),cases=out),indent=2))
