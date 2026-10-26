from decimal import Decimal as D,getcontext,ROUND_HALF_UP
import json,hashlib,zipfile
from pathlib import Path
getcontext().prec=50
expr={19:'min(D(1000),max(D(25),D(".02")*1000))',20:'D(1000)+30-100',21:'D(1200)-(1100+50)',23:'D(10000)*D(".06")*30/360',32:'D(50)-(120-80)',34:'(D(100000)-20000)*D(".01")-100',35:'D(2000)+500+1000-250',36:'D(20000)-1000-7000-8000-1000',43:'D(5000)/100000*100',46:'D(250000)-150000-40000-30000',48:'D(1000)*120',49:'D(100000)*(1+D(".005"))-1000',80:'D(100)+100',81:'D(100)+12*10',82:'(D(130)-100)/10',84:'D(100)*(1+D(".1"))**2',85:'D(1000)*(1+D(".05"))-100',86:'D(250)-100-100',87:'D(100)-50-50',88:'D(40000)/D(".04")',89:'D(121)/(1+D(".1"))**2',90:'D(20000)/D(".04")',91:'D(80000)/D(".04")',92:'D(".01")*50000*30',95:'D(100000)/D("24.6")',96:'D(".5")*min(D(2000),D(".05")*30000)',97:'D(1000)*(1+D(".05"))+100',98:'D(1000)+100',468:'(D(600)-200)*60',469:'(D(11745)/48).quantize(D(".01"),rounding=ROUND_HALF_UP)+D("12.25")',470:'(D(12000)+1000)-(25000-14000)',472:'D(1100)/(1+D(".1"))-1000'}
expected={19:'25',20:'930',21:'50',23:'50',32:'10',34:'700',35:'3250',36:'3000',43:'5',46:'30000',48:'120000',49:'99500',80:'200',81:'220',82:'3',84:'121',85:'950',86:'50',87:'0',88:'1000000',89:'100',90:'500000',91:'2000000',92:'15000',95:'4065.0406504065040650406504065040650406504065040650',96:'750',97:'1150',98:'1100',468:'24000',469:'256.94',470:'2000',472:'0'}
res={}
for i,e in expr.items():
 actual=eval(e);target=D(expected[i]); assert abs(actual-target)<D('1e-40'),(i,actual,target)
 res[i]={'method':'Independent Python decimal; precision50; not production engine execution','expression':e,'actual':str(actual),'expected':str(target),'result':'PASS','exampleScope':'Published arithmetic only for95,96,469; other witnesses synthetic; not financial model validation'}
# Boundary counterexample of packet #86 definition vs existing inspected SWP semantics.
res[86]['boundaryEvidence']={'initial':'200','withdrawal':'100','rate':'0','availableAfterTwoPayments':'0','packetFirstShortfallPeriod':3,'inspectedSwpDepletionPeriod':2,'meaning':'Different depletion definitions; packet must reconcile exact-zero vs first shortfall. Not an implementation defect without approved policy.'}
res[19]['additionalActuals']={'nextBalance':str(D(1000)-D(25))};res[49]['additionalActuals']={'propertyCashFlow':str(D(1500)-300-1000)};res[86]['additionalActuals']={'thirdPeriodShortfall':str(D(100)-D(50))};res[469]['additionalActuals']={'unroundedBase':str(D(11745)/48)}
Path('specialist70-execution/finance-evidence/numerical-results.json').write_text(json.dumps(res,indent=2)+'\n')
print('32 Decimal witness checks PASS; #86 boundary discrepancy demonstrated')
