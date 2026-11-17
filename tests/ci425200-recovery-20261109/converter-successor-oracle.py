"""Independent exact native-UCUM factor derivation; no production engine import."""
from pathlib import Path
from fractions import Fraction as F
import hashlib,json,struct,sys,zipfile,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[2]
source=ROOT/'docs/first-live-closure-20261108/source/ucum-v2.2-native-source.zip'
sha=lambda b:hashlib.sha256(b).hexdigest()
assert sha(source.read_bytes())=='2b0496305b2caa4748859667519ff7ed10dc241fcdad5d2ff0a23801457a447b'
with zipfile.ZipFile(source) as z:
 raw=z.read('ucum-essence.xml')
tree=ET.fromstring(raw);ns={'u':'http://unitsofmeasure.org/ucum-essence'}
units={e.get('Code'):e for e in tree if e.tag.endswith('unit')}
def value(code,unit):
 node=units[code].find('u:value',ns);assert node.get('Unit')==unit
 return F(node.get('value'))
inch=value('[in_i]','cm')/100;foot=value('[ft_i]','[in_i]')*inch
pound=value('[lb_av]','[gr]')*value('[gr]','mg')/10**6
lbf=value('[lbf_av]','[lb_av].[g]')*pound*value('[g]','m/s2')
assert inch==F('0.0254') and foot==F('.3048') and lbf==F('4.4482216152605')
assert value('[psi]','[lbf_av]/[in_i]2')==1
tables={
 'pressure':{'pa':F(1),'kpa':F(1000),'mpa':F(10**6),'bar':value('bar','Pa'),'atm':value('atm','Pa'),'psi':lbf/inch**2},
 'density':{'kg_m3':F(1),'g_cm3':F(1000),'kg_l':F(1000),'lb_ft3':pound/foot**3},
 'torque':{'n_m':F(1),'kn_m':F(1000),'lbf_ft':lbf*foot,'lbf_in':lbf*inch}}
assert value('l','dm3')==1
bits=lambda v:struct.pack('>d',v).hex()
fraction=lambda q:{'n':str(q.numerator),'d':str(q.denominator)}
factors={name:{code:{**fraction(q),'nearest':float(q),'bits':bits(float(q))} for code,q in table.items()} for name,table in tables.items()}
pairs=[{'engine':name,'fromUnit':a,'toUnit':b,'ratio':fraction(qa/qb)} for name,table in tables.items() for a,qa in table.items() for b,qb in table.items()]
assert len(pairs)==68
samples=[2.0**-970,(2.0**-970)*(1+2.0**-52),2.0**-500,.1,1,3.141592653589793,2.0**500,(2.0**990)*(1-2.0**-53),2.0**990]
paths=[f'src/calculators/conversion/catalog-batch-{i}.ts' for i in [1,2,3]]
record={'kind':'INDEPENDENT_NATIVE_UCUM_RATIONAL_PRIVATE_FACTOR_WITNESSES','sourceArchiveSha256':sha(source.read_bytes()),'nativeEssenceSha256':sha(raw),'oracleScriptSha256':sha(Path(__file__).read_bytes()),'legacySourceSha256':{p:sha((ROOT/p).read_bytes()) for p in paths},'factors':factors,'pairs':pairs,'positiveWitnessMagnitudes':samples,'signedNonzeroCases':len(pairs)*len(samples)*2,'unitRoundoff':fraction(F(1,2**53)),'gamma4':fraction(F(4,2**53)/(1-F(4,2**53))),'retainedInternationalAcre':fraction(4840*(3*foot)**2),'approval':False,'scope':'Exact source-factor relationships and finite numerical witnesses only; supplied Number interpretation; no canonical version allocation, applicability approval or publication authority.'}
target=ROOT/'docs/converter-methodology-20261109/converter-successor-witnesses.json';text=json.dumps(record,indent=2)+'\n'
if '--check' in sys.argv:
 assert target.read_text()==text,'Witness artifact differs'
else:
 assert not target.exists(),'Refuse overwrite; use --check for retained evidence'
 target.parent.mkdir(parents=True,exist_ok=True);target.write_text(text)
print(json.dumps({'pairs':len(pairs),'signedNonzeroCases':record['signedNonzeroCases'],'output':str(target.relative_to(ROOT)),'sha256':sha(text.encode()),'approval':False}))
