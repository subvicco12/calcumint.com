import subprocess,json,pathlib,datetime,time,os
root=pathlib.Path('/workspace/calcumint-first-release-evidence'); out=pathlib.Path('/workspace/calcumint-first-release-package')
files=['src/calculators/conversion/catalog-batch-3.test.ts','src/calculators/conversion/catalog-batch-3-direct-validation.test.ts','src/lib/calculator-factory/completion/conversion-contracts.test.ts','src/lib/native-delivery/factory-embed-contract.test.ts','src/lib/native-delivery/contract.test.ts','src/lib/native-delivery/authorization.test.ts','src/lib/native-delivery/publication.test.ts','src/lib/native-delivery/embed-request.test.ts','src/lib/native-delivery/factory-embed-publication.test.ts','src/lib/registered-snapshot-replay.test.ts','src/lib/wave100-history-verification.test.ts','src/components/publication20-workflow-regression.test.tsx','src/components/native-frequency-embed.test.tsx','src/lib/publication20/release-preflight.test.ts','src/lib/publication20/precision-boundary.test.ts','src/lib/publication20/export-acceptance.test.ts']
commands=[('focused-unit',['node','node_modules/vitest/vitest.mjs','run',*files,'--reporter=json','--outputFile='+str(out/'receipts/focused-vitest.json')],{}),('numerics',['node','tests/frequency440-acceptance/run-numerics.mjs'],{'FREQUENCY440_ARTIFACTS':str(out/'receipts/numerics')})]
results=[]
for name,cmd,env in commands:
 start=datetime.datetime.now(datetime.timezone.utc).isoformat(); tick=time.monotonic()
 with (out/('receipts/'+name+'.log')).open('w') as log:
  r=subprocess.run(cmd,cwd=root,env={**os.environ,**env},stdout=log,stderr=subprocess.STDOUT)
 results.append(dict(name=name,command=cmd,environment=env,startedUTC=start,seconds=time.monotonic()-tick,exitCode=r.returncode)); (out/'receipts/focused-execution.json').write_text(json.dumps(results,indent=2)+'\n')
 print(name,r.returncode,flush=True)
