import json,hashlib,datetime
from decimal import Decimal as D, getcontext
getcontext().prec=50
reg=json.load(open('specialist70/approval-register.json')); ids=[404,405,406,407,408,409,410,502,516,522,526,527,530]; cases={c['masterId']:c for c in reg['cases'] if c['masterId'] in ids}
checks={}
def chk(i,expression,actual,expected,kind='SYNTHETIC_ARITHMETIC_WITNESS',tol=None):
 checks[i]={'method':'Python 3 decimal precision 50 / datetime calendar arithmetic','expression':expression,'actual':actual,'registeredExpected':expected,'kind':kind,'tolerance':tol,'result':'MATCH' if actual==expected else 'MATCH_WITHIN_BINARY_FLOAT_TOLERANCE' if tol is not None and abs(D(str(actual))-D(str(expected)))<=D(tol) else 'REVIEW_DIFFERENCE'}
chk(404,'(220-40)*[.50,.70,.85]',{'estimatedMax':180,'moderate':[90,126],'vigorous':[126,153]},cases[404]['methodology']['referenceExample']['expected'])
checks[526]=dict(checks[404])
chk(405,'date(2026,1,1)+timedelta(days=280)',str(datetime.date(2026,1,1)+datetime.timedelta(days=280)),'2026-10-08')
bmi=D(60)/(D('1.65')**2)
chk(406,'60/(1.65**2)',str(bmi),str(cases[406]['methodology']['referenceExample']['expected']['BMI']),tol='1e-12');checks[406]['bandActualLb']=[25,35]
nextm=datetime.date(2026,1,1)+datetime.timedelta(days=28);o=nextm-datetime.timedelta(days=14)
chk(407,'LMP+28d; ovulation=nextMenses-14d; [o-5d,o+1d]',{'nextMenses':str(nextm),'ovulationEstimate':str(o),'possibleWindow':[str(o-datetime.timedelta(days=5)),str(o+datetime.timedelta(days=1))]},cases[407]['methodology']['referenceExample']['expected'])
chk(408,'date(2026,10,8)-timedelta(days=266)',str(datetime.date(2026,10,8)-datetime.timedelta(days=266)),'2026-01-15')
gfr=D(142)*(D('.9938')**50)
chk(409,'142*0.9938**50; Scr/k=1',str(gfr),str(cases[409]['methodology']['referenceExample']['expected']),tol='1e-12')
# Additional piecewise continuity and unit-conversion witnesses, independent of a production engine.
def egfr(scr,age,k,a,f):
 r=D(scr)/D(k);return D(142)*min(r,D(1))**D(a)*max(r,D(1))**D('-1.2')*D('.9938')**D(age)*D(f)
checks[409]['additionalChecks']={'femaleAtKAge50':str(egfr('.7',50,'.7','-.241','1.012')),'maleAt2KAge50':str(egfr('1.8',50,'.9','-.302','1')),'creatinine88_4umolLMgDl':str(D('88.4')/D('88.4')),'domainRejectRequired':['SCr<=0','age<18','unknown coefficient profile']}
wake=datetime.datetime.fromisoformat('2026-10-26T07:00:00+00:00');bed=wake-datetime.timedelta(hours=8,minutes=15)
chk(410,'07:00Z minus 8h minus 15min',bed.isoformat(),'2026-10-25T22:45:00+00:00');checks[410]['bedToWakeMinutes']=int((wake-bed).total_seconds()/60)
chk(502,'Official endpoint table lookup; Fahrenheit conversion only',{'minimumInternalF':145,'restMin':3},cases[502]['methodology']['referenceExample']['expected'],'OFFICIAL_ENDPOINT_LOOKUP_NOT_COOKING_TIME');checks[502]['conversionCExact']=str((D(145)-32)*5/9);checks[502]['thermalPredictionExecuted']=False
v=(D('2.7')*3+D('3.7')*4+D('3.3')*3)/10
chk(516,'(2.7*3+3.7*4+3.3*3)/10',str(v),'3.28','OFFICIAL_STANFORD_WORKED_EXAMPLE');checks[516]['NPExampleGpa']=str((D(4)*4+D(0)*4)/8)
r=D(25)*(D(2)**D('1.06'))
chk(522,'25*2**1.06',str(r),str(cases[522]['methodology']['referenceExample']['expected']),tol='1e-12');checks[522]['modelExponentApproved']=False
sd=D(113)/D(130)*(D(85)-D(72)-0)
chk(527,'113/130*(85-72-0)',str(sd),'11.3',tol='0');checks[527]['indexProduced']=False
v=D('6.9652')+D('.0091')*180-D('.0257')*50+D('.5955')-D('.2240')*15-D('.0115')*130
relative=1000*v/(D(180)*D('.45359237'))
chk(530,'6.9652+.0091*180-.0257*50+.5955-.2240*15-.0115*130',str(v),str(cases[530]['methodology']['referenceExample']['expected']['absoluteLMin']),tol='1e-12');checks[530]['relativeConversionActual']=str(relative);checks[530]['relativeRegisteredExpected']=cases[530]['methodology']['referenceExample']['expected']['relativeMlKgMin'];checks[530]['relativeDifference']=str(abs(relative-D(str(checks[530]['relativeRegisteredExpected']))));assert D(checks[530]['relativeDifference'])<D('1e-12')
assert all(c['result'] in ['MATCH','MATCH_WITHIN_BINARY_FLOAT_TOLERANCE'] for c in checks.values())
json.dump({'decimalPrecision':50,'checks':checks},open('specialist70-execution/clinical-numerical-results.json','w'),indent=2)
print(json.dumps({i:c['result'] for i,c in checks.items()},indent=2))
