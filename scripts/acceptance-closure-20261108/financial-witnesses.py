"""Independent decimal oracle: proposal qualification, not registered-engine adoption."""
from fractions import Fraction
from decimal import Decimal,localcontext,ROUND_HALF_UP,ROUND_FLOOR,ROUND_CEILING,ROUND_DOWN
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[2]
values=['0','-0','0.004999999999999999','-0.004999999999999999','1.0049999999999992','-1.0049999999999992','1.005','-1.005','10000000000000.244','10000000000000.246','-10000000000000.246','12000000000000.25','45035996273704.96','5e-324','-5e-324','1.7976931348623157e308']
cases=[]
with localcontext() as context:
 context.prec=1000
 for value in values:
  for digits in [0,2,12]:
   amount=Decimal(value);quantum=Decimal(1).scaleb(-digits)
   cases.append({'input':value,'digits':digits,'expected':{name:str(amount.quantize(quantum,rounding=mode)) for name,mode in [('half-away-from-zero',ROUND_HALF_UP),('floor',ROUND_FLOOR),('ceil',ROUND_CEILING),('truncate',ROUND_DOWN)]}})
 for digits in range(13):
  for sign in ['', '-']:
   value=sign+'0.'+'0'*digits+'5';quantum=Decimal(1).scaleb(-digits);amount=Decimal(value)
   cases.append({'input':value,'digits':digits,'expected':{name:str(amount.quantize(quantum,rounding=mode)) for name,mode in [('half-away-from-zero',ROUND_HALF_UP),('floor',ROUND_FLOOR),('ceil',ROUND_CEILING),('truncate',ROUND_DOWN)]}})
engine_cases=[]
def cents(x):
 negative=x<0;x=abs(x)*100
 whole,remainder=divmod(x.numerator,x.denominator)
 if remainder*2>=x.denominator:whole+=1
 return -whole if negative else whole
def amount(c):
 return ('-' if c<0 else '')+str(abs(c)//100)+'.'+str(abs(c)%100).zfill(2)
for principal,rate,months in [('100000','6',360),('1000','1e-12',12),('1','0',3),('12000000000000.25','0',1),('1.0049999999999992','0',1),('0.03','200',1),('0.39','200',2),('1.17','200',2)]:
 p,r=Fraction(principal),Fraction(rate)/1200
 monthly=cents(p/months if not r else p*r/(1-(1+r)**(-months)))
 total=monthly*months;interest=cents(Fraction(total,100)-p)
 engine_cases.append({'engine':'loan','input':{'principal':principal,'annualRatePercent':rate,'termMonths':months},'expected':{'monthlyPayment':amount(monthly),'totalPayment':amount(total),'totalInterest':amount(interest)},'comparison':'exact rational cent result; exact decimal Number output'})
for principal,rate,years,n in [('10000','5',10,12),('0','1000',200,365),('1.0049999999999992','0',0,1),('1000','-12',2,12),('1e-300','1000',100,365),('233.28','100',1,6)]:
 p,r=Fraction(principal),Fraction(rate)/100/n
 future=cents(p*(1+r)**(n*years));interest=cents(Fraction(future,100)-p)
 engine_cases.append({'engine':'compound','input':{'principal':principal,'annualRatePercent':rate,'years':years,'compoundsPerYear':n},'expected':{'futureValue':amount(future),'totalInterest':amount(interest)},'comparison':'reject unrepresentable rounded decimal Number' if principal=='1e-300' else 'exact rational cent result; exact decimal Number output'})
# Independent exact-root identities, not a Decimal.pow expectation.
for principal,rate,years,exact_root in [('0.01','125','0.5','1.5'),('0.01','-75','0.5','0.5'),('0.01','-96.875','0.2','0.5')]:
 p=Fraction(principal);future=cents(p*Fraction(exact_root));interest=cents(Fraction(future,100)-p)
 exponent=Fraction(years);base=1+Fraction(rate)/100
 assert Fraction(exact_root)**exponent.denominator==base**exponent.numerator
 engine_cases.append({'engine':'compound','input':{'principal':principal,'annualRatePercent':rate,'years':years,'compoundsPerYear':1},'expected':{'futureValue':amount(future),'totalInterest':amount(interest)},'comparison':'exact rational root identity and cent result','rootIdentity':{'root':exact_root,'exponent':years}})
value={'kind':'INDEPENDENT_PYTHON_DECIMAL_SHORTEST_ROUNDTRIP_PROPOSAL_WITNESSES','inputInterpretation':'Decimal(Number.toString()) for each finite Number; shortest round-trip spelling, not exact binary rational. Proposed private contract; requires financial competent review before adoption.','oracle':'Python Decimal precision1000 for direct decimal rounding; Python Fraction integer formula evaluation/quotient-remainder cents and exact root identities; no production helper used','roundingCaseComparison':'Exact equality to the binary64 Number obtained from the independently rounded decimal literal; no epsilon or relative-tolerance waiver','cases':cases,'engineCases':engine_cases}
p=root/'docs/acceptance-closure-20261108/financial-rounding-witnesses.json';text=json.dumps(value,indent=2)+'\n'
if '--check' in sys.argv:assert p.read_text()==text,'Independent decimal witness artifact differs'
else:p.write_text(text)
print(json.dumps({'cases':len(cases),'modeChecks':len(cases)*4,'approval':False}))
