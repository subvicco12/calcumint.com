from decimal import Decimal as D, getcontext, ROUND_HALF_UP
import json
getcontext().prec=40
def d(v):return D(str(v))
cases={112:('40*20+5*20*1.5',lambda:d(40)*20+d(5)*20*d('1.5'),'950'),120:('20000*0.2',lambda:d(20000)*d('.2'),'4000'),121:('1000-100-50-20',lambda:d(1000)-100-50-20,'830'),122:('1000-100-50-20',lambda:d(1000)-100-50-20,'830'),123:('800/0.8',lambda:d(800)/d('.8'),'1000'),124:('1000*0.1',lambda:d(1000)*d('.1'),'100'),125:('100*0.08',lambda:d(100)*d('.08'),'8'),126:('115*3/23',lambda:d(115)*3/23,'15'),127:('100*0.2-5',lambda:d(100)*d('.2')-5,'15'),128:('150-100-10',lambda:d(150)-100-10,'40'),129:('2500*0.1075',lambda:d(2500)*d('.1075'),'268.75'),130:('10000*0.1',lambda:d(10000)*d('.1'),'1000'),131:('max(0,6000-1000)/5',lambda:max(d(0),d(6000)-1000)/5,'1000'),132:('100000*0.2',lambda:d(100000)*d('.2'),'20000'),133:('200000*0.01',lambda:d(200000)*d('.01'),'2000'),134:('100*2000/10000',lambda:d(100)*2000/10000,'20'),135:('100*(0.2*10100-0.2*10000)/100',lambda:d(100)*(d('.2')*10100-d('.2')*10000)/100,'20'),136:('720-800',lambda:d(720)-800,'-80'),137:('0.2*11000-0.2*10000',lambda:d('.2')*11000-d('.2')*10000,'200'),173:('100/(1+0)^1+100/(1+0)^2-20',lambda:d(100)+100-20,'180'),198:('100-(100*0.1+1)-40',lambda:d(100)-(100*d('.1')+1)-40,'49'),199:('100-12-40',lambda:d(100)-12-40,'48'),204:('(2000-100*0.2*35)-(2000-100*0.1*35)',lambda:(d(2000)-100*d('.2')*35)-(2000-100*d('.1')*35),'-350'),485:('100*0.2',lambda:d(100)*d('.2'),'20'),488:('12000/0.8*0.08-12000/3*0.25',lambda:d(12000)/d('.8')*d('.08')-d(12000)/3*d('.25'),'200')}
results=[]
for i,(expression,f,expected) in cases.items():
 actual=f();assert actual==d(expected)
 results.append(dict(masterId=i,expression=expression,actual=str(actual),expected=expected,pass_=True))
checks={
'overtime40':str(d(40)*20),'overtime41':str(d(40)*20+d(1)*20*d('1.5')),
'inclusive8percent':str(d(108)*d('.08')/d('1.08')),
'clvOnePeriodDiscounted':str(d(100)/d('1.1')-20),
'clvUnconditionalCostCounterexample_proposed':str(d('.5')*(100-20)),
'clvUnconditionalCostCounterexample_correct':str(d('.5')*100-20),
'etsyRefundCounterexampleOriginal':str(d(100)-12-40),
'etsyRefundCounterexampleAfterRefund':str(d(100)-20-12-40),
'returnsDuplicateFeeCounterexample_proposed':str(d(100)*(50-33)-100*d('.1')*(50+5+3-20)),
'returnsDuplicateFeeCounterexample_correct':str(d(100)*(50-33)-100*d('.1')*(50+5-20)),
'emissionUnitConversion1000g':str(d(1000)/1000),
'heatZeroLoad':str(d(0)/d('.8')*d('.08')-d(0)/3*d('.25')),
'heatAux100kWhSavings':str(d(12000)/d('.8')*d('.08')-(d(12000)/3+100)*d('.25')),
'illustrativeRoundHalfUp1_005':str(d('1.005').quantize(d('.01'),rounding=ROUND_HALF_UP))}
for label,denominator in [('effectiveRateZero',d(0)),('heatEtaZero',d(0)),('heatSCOPZero',d(0))]:
 try:d(1)/denominator;raise AssertionError('division unexpectedly supported')
 except ArithmeticError:checks[label]='DivisionByZero: must reject or return undefined; no finite result'
print(json.dumps(dict(decimalPrecision=getcontext().prec,cases=results,boundaryChecks=checks),indent=2))
