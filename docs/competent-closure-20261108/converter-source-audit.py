"""Retained-byte source facts only. No engine execution, tolerance or approval."""
from pathlib import Path
from fractions import Fraction as F
from decimal import Decimal, localcontext
import hashlib, json, re, sys, zipfile, xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[2]
ZIP=ROOT/'docs/first-live-closure-20261108/source/ucum-v2.2-native-source.zip'
sha=lambda b:hashlib.sha256(b).hexdigest()
with zipfile.ZipFile(ZIP) as archive:
 members={name:archive.read(name) for name in archive.namelist()}
tree=ET.fromstring(members['ucum-essence.xml']);ns={'u':'http://unitsofmeasure.org/ucum-essence'}
nodes={(node.tag.split('}')[-1],node.get('Code')):node for node in tree}
def value(code,kind='unit'):
 node=nodes[(kind,code)];v=node.find('u:value',ns)
 return {'code':code,'kind':kind,'names':[e.text for e in node.findall('u:name',ns)],'value':v.get('value'),'unit':v.get('Unit'),'xml':ET.tostring(node,encoding='unicode').strip()}
def scalar(code,expected_unit):
 v=value(code);assert v['unit']==expected_unit
 return F(v['value'])
inch=scalar('[in_i]','cm')*F(value('c','prefix')['value'])
foot=scalar('[ft_i]','[in_i]')*inch
yard=scalar('[yd_i]','[ft_i]')*foot
grain=scalar('[gr]','mg')/10**6
pound=scalar('[lb_av]','[gr]')*grain
gravity=scalar('[g]','m/s2')
assert scalar('[lbf_av]','[lb_av].[g]')==1
lbf=pound*gravity
psi=lbf/inch**2
hp=scalar('[HP]','[ft_i].[lbf_av]/s')*foot*lbf
torque=lbf*foot
acre_survey=scalar('[acr_us]','[rd_us]2')*(scalar('[rd_us]','[ft_us]')*scalar('[ft_us]','m/3937')/3937)**2
acre_international=4840*yard**2
assert acre_international==F('4046.8564224')
assert scalar('[gal_us]','[in_i]3')*inch**3==F('.003785411784')
assert scalar('cal_th','J')==F('4.184')
assert scalar('By','bit')==8

sources={i:(ROOT/f'src/calculators/conversion/catalog-batch-{i}.ts').read_text() for i in (1,2,3)}
def literal(batch,code):
 pattern=r'code:"'+re.escape(code)+r'",factor:([^}]+)'
 match=re.search(pattern,sources[batch]);assert match,code
 return match.group(1)
def decimal(q):
 with localcontext() as ctx:
  ctx.prec=80
  return str(Decimal(q.numerator)/Decimal(q.denominator))
comparisons=[]
for label,batch,code,exact in [('force',3,'lbf',lbf),('pressure',2,'psi',psi),('power',2,'hp_mech',hp),('density',3,'lb_ft3',pound/foot**3),('international-acre-construction',1,'acre',acre_international),('UCUM-survey-acre-conflict',1,'acre',acre_survey)]:
 spelling=literal(batch,code);legacy=F(spelling);stored=float(spelling)
 comparisons.append({'label':label,'engineCode':code,'sourceLiteral':spelling,'sourceDerivedExactFraction':str(exact),'sourceDerivedDecimal80':decimal(exact),'literalMinusExactFraction':str(legacy-exact),'literalMinusExactDecimal80':decimal(legacy-exact),'storedNumberIsNearestBinary64ToExactSource':stored==float(exact),'storedBinary64MinusExactFraction':str(F.from_float(stored)-exact)})
torque_literal=re.search(r'const LBF_FT_TO_N_M=([^;]+);',sources[3]).group(1)
for code,stored,exact in [('lbf_ft',float(torque_literal),torque),('lbf_in',float(torque_literal)/12,lbf*inch)]:
 comparisons.append({'label':'torque','engineCode':code,'sourceExpression':literal(3,code),'constantLiteral':torque_literal,'sourceDerivedExactFraction':str(exact),'sourceDerivedDecimal80':decimal(exact),'storedNumberIsNearestBinary64ToExactSource':stored==float(exact),'storedBinary64MinusExactFraction':str(F.from_float(stored)-exact)})

facts=[
 (423,'SUPPORTED','International inch .0254 m; foot=12 inches; yard=3 feet; mile=5280 feet. All declared decimal length factors match these exact constructions and SI prefixes.','Product aliases in/ft/yd/mi correspond to international UCUM codes [in_i]/[ft_i]/[yd_i]/[mi_i], not survey variants.'),
 (424,'PARTIAL','Square international foot/yard/mile and SI area factors match; hectare derives from 100 ar, ar=100 m2. Acre4046.8564224 equals 4840 international yards squared.','UCUM [acr_us] uses survey rod/foot and differs; [acr_br] uses British historical yard. Retained bytes do not directly name the international acre used by this code; require explicit mapping/source applicability, never substitute another acre.'),
 (425,'SUPPORTED','Liter=dm3; cubic inch/foot derive from international inch/foot. UCUM [gal_us]=231[in_i]3 and [qt_us]=[gal_us]/4 exactly match declared US liquid gallon/quart decimals.','Product gal_us/qt_us are explicit aliases, not imperial gallon/quart.'),
 (427,'SUPPORTED','Native source defines Celsius xK-273.15 and inverse xC+273.15; Fahrenheit=9/5*xK-459.67 and inverse=5/9*(xF+459.67). Existing pair formulas are algebraically consistent.','Binary64 offset/multiplier error and cancellation need separate numerical review; no physical-domain applicability inferred.'),
 (428,'SUPPORTED','International mile/foot, hour=3600s and nautical mile1852m support mph=.44704, ft/s=.3048, km/h=1000/3600 and knot1852/3600 m/s.','Division expressions are binary64 approximations; exact source relationships do not establish output precision.'),
 (429,'PARTIAL','Pa SI construction, bar=100000Pa and atm=101325Pa directly supported. UCUM [psi]=[lbf_av]/[in_i]2.','Legacy psi6894.757293168 truncates source-derived6894.7572931683613367... and is not its nearest binary64. Approximation requires an explicit accepted error/domain decision.'),
 (430,'SUPPORTED','J=N.m; W=J/s; hour=3600s supports Wh/kWh. UCUM cal_th=4.184J and cal=cal_th match existing thermochemical cal/kcal.','Do not infer alternate calorie variants or nutritional applicability.'),
 (431,'SUPPORTED','UCUM [HP]=550[ft_i].[lbf_av]/s derives exact745.69987158227022W. Existing literal745.6998715822702 yields the nearest binary64 to that exact value.','Decimal spelling differs by2e-14W, but there is no additional stored-number truncation beyond nearest binary64 representation. hp_mech->[HP] mapping remains explicit.'),
 (433,'SUPPORTED','UCUM deg=2[pi].rad/360; gon=.9deg; circ=2[pi].rad. These support degree, grad=gon, and turn=circ formulas.','Math.PI is an approximation; UCUM itself stores a finite long decimal [pi]. Do not claim exact real-pi outputs or silently treat product rad/deg/grad/turn as UCUM literal codes.'),
 (434,'SUPPORTED','UCUM By=8bit; decimal k/M/G/T prefixes=1000/1e6/1e9/1e12 and binary Ki/Mi/Gi=1024/1048576/1073741824 match byte-factor ratios exactly.','Product B/KB/MB/GB/TB mean By/kBy/MBy/GBy/TBy. Case-sensitive KB is a product alias, not a UCUM unit spelling; no bit mode or reinterpretation.'),
 (437,'PARTIAL','kg/m3, g/cm3 and kg/l factors follow SI and liter. UCUM pound and international foot derive lb/ft3=16.018463373960139579...kg/m3.','Legacy16.01846337396 is not nearest binary64 to that source-derived value. Approximation approval remains pending.'),
 (438,'SUPPORTED','N=kg.m/s2; dyn=g.cm/s2=1e-5N; [lbf_av]=[lb_av].[g] with pound=.45359237kg and standard gravity9.80665m/s2 gives exact4.4482216152605N.','Standard conventional force only; no location-dependent mass/weight model or output precision approval.'),
 (439,'PARTIAL','Source-defined lbf times international foot gives exact1.3558179483314004N.m; lbf times international inch gives exact.1129848290276167N.m.','Legacy constant1.3558179483314 and its /12 inch expression are not nearest binary64 to these source values. Existing twelve-inch geometry does not erase absolute factor approximation.')
]
source_text=members['ucum-source.xml'].decode()
assert '273.15' in source_text and '459.67' in source_text
codes=['[in_i]','[ft_i]','[yd_i]','[mi_i]','[acr_us]','[rd_us]','[ft_us]','[acr_br]','[yd_br]','ar','l','[gal_us]','[qt_us]','[gr]','[lb_av]','[g]','[lbf_av]','[psi]','[HP]','cal_th','cal','[nmi_i]','[kn_i]','min','h','Cel','[degF]','deg','gon','circ','[pi]','By','bit','N','J','W','dyn','bar','atm']
out={'kind':'RETAINED_UCUM_SOURCE_FACTOR_FACTS_NOT_APPROVAL','sourceArchive':str(ZIP.relative_to(ROOT)),'sourceArchiveSha256':sha(ZIP.read_bytes()),'nativeMetadata':tree.attrib,'memberSha256':{k:sha(v) for k,v in members.items()},'engineSourceSha256':{f'src/calculators/conversion/catalog-batch-{i}.ts':sha(sources[i].encode()) for i in (1,2,3)},'classificationMeaning':'SUPPORTED means retained source relationships support the stated intended factor/formula correspondence, not competent applicability, precision or lifecycle approval. PARTIAL marks a concrete mapping/approximation decision still needed. All values remain subject to binary64 representation and operation error.','facts':[{'catalogId':i,'classification':status,'supportedCorrespondence':yes,'remainingDecision':pending} for i,status,yes,pending in facts],'exactComparisons':comparisons,'nativeExcerpts':[value(c) for c in codes]+[value(c,'prefix') for c in ['k','M','G','T','c','m','Ki','Mi','Gi']],'competentApproval':False,'canonicalAdoptionAuthorized':False,'productionChanges':False}
path=Path(__file__).with_name('converter-source-facts.json')
assert sys.argv[1:] in ([],['--check']),'Unknown audit arguments'
encoded=json.dumps(out,indent=2)+'\n'
if '--check' in sys.argv: assert path.read_text()==encoded,'Retained source facts differ; create an independently reviewed successor'
else:
 assert not path.exists(),'Refuse overwriting retained source facts; use --check'
 path.write_text(encoded)
print(json.dumps({'output':str(path.relative_to(ROOT)),'sha256':sha(path.read_bytes()),'ids':len(facts),'supported':sum(x[1]=='SUPPORTED' for x in facts),'partial':sum(x[1]=='PARTIAL' for x in facts),'approval':False}))
