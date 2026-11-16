from pathlib import Path
import subprocess,json,hashlib
root=Path('.');git=lambda *a:subprocess.check_output(['git',*a]);sha=lambda b:hashlib.sha256(b).hexdigest();code='7481cb8b5feaadd0e6ba0d43b9708e1ce47dc6e8';pre='dc8544422dbb4ebccfc96e03431e64ebcf871fc9';base='8296454dc7244205ef4cf0b6e0b41c38f90af20f';directory=Path('docs/construction-qualification-20261116')
def record(ref,p):
 raw=git('show',ref+':'+p);return {'path':p,'ref':ref,'blob':git('rev-parse',ref+':'+p).decode().strip(),'bytes':len(raw),'sha256':sha(raw)}
paths=git('diff','--name-only',pre,code,'--','src').decode().splitlines();assert len(paths)==38
ancestry=[];ref=code
while True:
 ancestry.append(ref)
 if ref==pre:break
 ref=git('rev-parse',ref+'^').decode().strip()
assert len(ancestry)==64
capture={'kind':'EXACT_FACTORY_SOURCE_SUCCESSOR','predecessorRef':pre,'codeRef':code,'ancestry':ancestry,'rows':[{'path':p,'predecessor':record(pre,p) if git('ls-tree','--name-only',pre,'--',p).strip() else None,'current':record(code,p)} for p in paths],'retainedStages':[{'capture':record(base,'docs/four-worker-integration-20261115/source-stage9.json')},{'capture':record(base,'docs/remainder226-20261115/source-stage9-revision2.json')}]}
file=directory/'source-stage9-construction.json';file.write_text(json.dumps(capture,indent=2)+'\n');policy={'captureSHA256':sha(file.read_bytes()),'predecessorRef':pre,'codeRef':code,'paths':paths,'ancestry':ancestry}
Path('tests/four-worker-integration-20261115/source-stage9-policy.mjs').write_text('/** Exact construction cumulative successor; both prior Stage9 captures remain immutable. */\nexport const sourceStage9CapturePath='+json.dumps(str(file))+';\nexport const sourceStage9Policy=Object.freeze('+json.dumps(policy,indent=2)+');\nObject.freeze(sourceStage9Policy.paths);Object.freeze(sourceStage9Policy.ancestry);\n')
p=Path('tests/four-worker-integration-20261115/source-stage9.mjs');s=p.read_text();assert s.count('policy.paths.length,23')==1;p.write_text(s.replace('policy.paths.length,23','policy.paths.length,38'))
p=Path('tests/four-worker-integration-20261115/source-stage9.test.mjs');s=p.read_text().replace('exact23live','exact38live').replace('all23current','all38current').replace('p.live.size,23','p.live.size,38');p.write_text(s)
p=Path('tests/milestone100-20261114/source-stage8-negative-current-src.mjs');s=p.read_text();tag='const currentSourceStages=Object.freeze(';start=s.index(tag)+len(tag);end=s.index('.map(row=>',start);rows=json.loads(s[start:end]);rows.append({'path':str(file),'sha256':sha(file.read_bytes()),'codeRef':code,'paths':paths});p.write_text(s[:start]+json.dumps(rows,separators=(',',':'))+s[end:])
# Add one named finite authority revision, preserving all literal predecessor records.
p=Path('tests/parallel-source-20261110/authority.mjs');s=p.read_text();tag='export const accepted=Object.freeze(';i=s.index(tag);s=s[:i]+'export const acceptedStage8V50=Object.freeze([]);\nexport const additionalStage8V50BootstrapRefs=Object.freeze([]);\n'+s[i:];s=s.replace('...acceptedStage8V49].map','...acceptedStage8V49,...acceptedStage8V50].map');p.write_text(s)
for file in ['tests/parallel-source-20261110/bootstrap.mjs','scripts/fetch-source-lineage.mjs','tests/milestone60-20261113/source-cold-preflight.test.mjs','tests/milestone100-20261114/source-preflight-stage8.mjs']:
 p=Path(file);s=p.read_text();s=s.replace('additionalStage8V49BootstrapRefs}', 'additionalStage8V49BootstrapRefs,additionalStage8V50BootstrapRefs}').replace('...additionalStage8V49BootstrapRefs]', '...additionalStage8V49BootstrapRefs,...additionalStage8V50BootstrapRefs]').replace("'additionalStage8V49BootstrapRefs']", "'additionalStage8V49BootstrapRefs','additionalStage8V50BootstrapRefs']").replace("...additionalStage8V49BootstrapRefs,'", "...additionalStage8V49BootstrapRefs,...additionalStage8V50BootstrapRefs,'")
 if file.endswith('source-preflight-stage8.mjs'):s=s.replace('capture.sourceStage8V49','capture.sourceStage8V50')
 p.write_text(s)
p=Path('tests/milestone100-20261114/source-stage8-guard-selection.mjs');s=p.read_text().replace('...(capture.sourceStage8V49?.guardPaths??[])];','...(capture.sourceStage8V49?.guardPaths??[]),...(capture.sourceStage8V50?.guardPaths??[])];');p.write_text(s)
p=Path('tests/parallel-source-20261110/core.mjs');s=p.read_text().replace("export const capturePath='docs/parallel-source-20261110/capture-revision116.json'", "export const capturePath='docs/parallel-source-20261110/capture-revision117.json'");p.write_text(s)
Path('docs/milestone100-20261114/source-qualified-authority116.mjs').write_bytes(git('show',base+':tests/parallel-source-20261110/authority.mjs'))
print({'sourcePaths':len(paths),'finiteAncestry':len(ancestry),'captureSHA256':policy['captureSHA256']})
