"""Offline native OOXML verifier; no formulas evaluated, no floats, no network."""
import argparse, datetime, decimal, hashlib, json, pathlib, posixpath, xml.etree.ElementTree as ET, zipfile
NS={'x':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
EXPECTED={
 'ghg-conversion-factors-2026-full-set.xlsx':'b5c4f2f86cdc74707337b2fb013b44ded189a1b528f5e29ea99856ba65ae0205',
 'ghg-conversion-factors-2026-flat-format-revised.xlsx':'a9a455ab396dae226d510c7be6233748416d490c41a5d20f3dc7a0c45feecd5e'}
class Workbook:
 def __init__(self,path):
  self.path=path;self.sha256=hashlib.sha256(path.read_bytes()).hexdigest()
  if self.sha256!=EXPECTED[path.name]:raise ValueError('Native workbook SHA256 mismatch')
  self.z=zipfile.ZipFile(path)
  if self.z.testzip() is not None:raise ValueError('Native workbook CRC failure')
  strings=ET.fromstring(self.z.read('xl/sharedStrings.xml'));self.strings=[''.join(t.text or '' for t in s.findall('.//x:t',NS)) for s in strings.findall('x:si',NS)]
  wb=ET.fromstring(self.z.read('xl/workbook.xml'));props=wb.find('x:workbookPr',NS)
  if props is not None and props.get('date1904') in ['1','true']:raise ValueError('Unsupported workbook date epoch')
  rel=ET.fromstring(self.z.read('xl/_rels/workbook.xml.rels'));targets={r.get('Id'):r.get('Target') for r in rel}
  self.sheets={s.get('name'):posixpath.normpath('xl/'+targets[s.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')]).replace('xl//xl/','xl/') for s in wb.find('x:sheets',NS)}
  self.sheets={k:v[3:] if v.startswith('xl/xl/') else v for k,v in self.sheets.items()};self.cache={}
  styles=ET.fromstring(self.z.read('xl/styles.xml'));self.formats={int(n.get('numFmtId')):n.get('formatCode') for n in styles.findall('x:numFmts/x:numFmt',NS)};self.styles=[int(s.get('numFmtId')) for s in styles.find('x:cellXfs',NS)]
 def cell(self,sheet,ref):
  path=self.sheets[sheet]
  if path not in self.cache:self.cache[path]=ET.fromstring(self.z.read(path))
  c=self.cache[path].find('.//x:c[@r="'+ref+'"]',NS)
  if c is None:return {'worksheet':sheet,'xmlPath':path,'cell':ref,'value':None,'rawValue':None,'type':'missing','numberFormat':None,'formula':None}
  v=c.find('x:v',NS);raw=v.text if v is not None else None;kind=c.get('t','n');value=self.strings[int(raw)] if kind=='s' and raw is not None else raw
  style=int(c.get('s','0'));fmt=self.formats.get(self.styles[style],{0:'General',14:'mm-dd-yy'}.get(self.styles[style],'builtin:'+str(self.styles[style])))
  return {'worksheet':sheet,'xmlPath':path,'cell':ref,'value':value,'rawValue':raw,'type':kind,'numberFormat':fmt,'styleId':style,'formula':c.findtext('x:f',None,NS)}
def published_number(c):
 if c['type']!='n' or c['rawValue'] is None or c['formula'] is not None or c['numberFormat']!='0.00000':raise ValueError('Missing/non-native-numeric/unsupported published factor')
 value=decimal.Decimal(c['rawValue'])
 if not value.is_finite():raise ValueError('Nonfinite native factor')
 # No tie-policy is inferred: these stored binary tails are strictly within
 # the published five-decimal interval, far from its rounding boundaries.
 published=value.quantize(decimal.Decimal('0.00001'))
 if abs(value-published)>=decimal.Decimal('0.000005'):raise ValueError('Ambiguous published factor')
 return format(published,'.5f')
def verify(root):
 full=Workbook(root/'ghg-conversion-factors-2026-full-set.xlsx');flat=Workbook(root/'ghg-conversion-factors-2026-flat-format-revised.xlsx')
 fc={r:full.cell('UK electricity',r) for r in ['B6','D6','F6','A8','A12','A22','A24','E24','F24','G24','H24','A25','B25','C25','D25','E25','F25','G25','H25']}
 for r,v in {'B6':'Scope 2','D6':'1','F6':'2026','A25':'Electricity generated','B25':'Electricity: UK','C25':'kWh','D25':'2026','E24':'kg CO2e'}.items():assert fc[r]['value']==v,(r,fc[r])
 row={col:flat.cell('Factors by Category',col+'3066') for col in 'ABCDEFGHIJ'}
 for col,v in {'A':'7_400_4000_5_1','B':'Scope 2','C':'UK electricity','D':'Electricity generated','E':'Electricity: UK','F':'kWh','H':'kWh','I':'kg CO2e'}.items():assert row[col]['value']==v,(col,row[col])
 assert published_number(fc['E25'])==published_number(row['J'])=='0.13096'
 gases=[published_number(fc[c+'25']) for c in 'FGH'];assert sum(map(decimal.Decimal,gases))==decimal.Decimal('0.13096')
 for offset,value in enumerate(gases,start=3067):assert published_number(flat.cell('Factors by Category','J'+str(offset)))==value
 front={r:flat.cell('Front page',r) for r in ['C5','E5','C13','C14','D14','C18']};assert front['C5']['value']==front['C13']['value']=='1.2';assert front['E5']['value']==front['C18']['value']=='2026'
 updated=(datetime.date(1899,12,30)+datetime.timedelta(days=int(front['C14']['rawValue']))).isoformat();assert updated=='2026-07-10';assert 'left blank' in front['D14']['value']
 intro={r:full.cell('Introduction',r) for r in ['B6','D6','A18','A20','A29','A34','A35','A38']};assert intro['B6']['value']=='1' and intro['D6']['value']=='2026';assert 'calendar year 2026' in intro['A38']['value'];assert 'AR5' in intro['A35']['value']
 blank=flat.cell('Factors by Category','J3070');zero=flat.cell('Factors by Category','J875');assert blank['value'] is None and zero['rawValue']=='0'
 try:published_number(blank)
 except ValueError:pass
 else:raise AssertionError('Blank factor was accepted as numeric')
 assert published_number(zero)=='0.00000'
 return {'schemaVersion':1,'provenance':'User-attached native files; publisher filenames/links and native contents corroborated. No independently fetched publisher SHA or digital signature is claimed.','publication':{'publisher':'Department for Energy Security and Net Zero','url':'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026','published':'2026-06-11','publicUpdate':'2026-07-31','fullSetVersion':'1.0 unchanged by July correction','revisedFlatVersion':'1.2','flatInternalUpdated':updated,'effectivePeriod':{'basis':'calendar-year activity data; narrower than other publisher-permitted reporting approaches','start':'2026-01-01','end':'2026-12-31'}},'files':[{'filename':w.path.name,'sha256':w.sha256,'bytes':w.path.stat().st_size,'zipCRCVerified':True} for w in [full,flat]],'factor':{'id':'7_400_4000_5_1','value':'0.13096','unit':'kgCO2e/kWh','publishedDecimalPlaces':5,'rawStoredValue':fc['E25']['rawValue'],'nativeNumberFormat':'0.00000','precisionMeaning':'Use published five-decimal value, not the binary serialization tail; exact product is not a physical accuracy claim.'},'nativeFullCells':fc,'nativeFlatCells':row,'nativeFrontCells':front,'nativeIntroductionCells':intro,'gasComponentPublishedFactors':gases,'missingValueChecks':{'missing':blank,'genuineZero':zero,'missingRejected':True,'zeroKeptDistinct':True},'canonicalImplementationClass':'CONTRACT_BLOCKED','releaseHold':True}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');a=p.parse_args();root=pathlib.Path('docs/authority485');content=json.dumps(verify(root/'native'),indent=2,ensure_ascii=False)+'\n';target=root/'native-source-binding.json'
 if a.check:
  if target.read_text()!=content:raise SystemExit('Stale native source binding')
 else:target.write_text(content)
 print('PASS native workbook SHA/CRC, revisions, native cells/units, five-decimal factor, calendar period and missing!=zero')
