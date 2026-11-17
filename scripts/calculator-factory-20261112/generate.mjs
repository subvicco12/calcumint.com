#!/usr/bin/env node
/** Generate engineering evidence from the frozen runtime, never a lifecycle ledger. */
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

if (Number(process.versions.node.split('.')[0]) !== 22) throw Error('Run with the operator Node22 runtime');
const args = process.argv.slice(2);
const check = args.includes('--check');
const suffixIndex=args.indexOf('--output-suffix');
const outputSuffix=suffixIndex<0?'':args[suffixIndex+1];
if(suffixIndex>=0&&!/^[a-z0-9][a-z0-9-]{0,40}$/.test(outputSuffix??''))throw Error('A bounded output suffix is required');
const refIndex = args.indexOf('--code-ref');
const codeRef = refIndex < 0 ? undefined : args[refIndex + 1];
if (args.some((arg, index) => arg !== '--check' && arg !== '--code-ref' && arg !== '--output-suffix' && !(suffixIndex>=0&&index===suffixIndex+1) && !(refIndex >= 0 && index === refIndex + 1)) || (refIndex >= 0 && !codeRef)) throw Error('Usage: generate.mjs --check | --code-ref <exact HEAD SHA> [--output-suffix <new-revision>]');
const executeFile = promisify(execFile);
const git = async (...command) => (await executeFile('git', command, { encoding: 'utf8' })).stdout.trim();
const root = await git('rev-parse', '--show-toplevel');
const sourceSHA = await git('rev-parse', 'HEAD');
if (!check && (!codeRef || codeRef !== sourceSHA)) throw Error('Writing requires --code-ref matching the frozen actual git HEAD');
const temporary = await mkdtemp(path.join(tmpdir(), 'calcumint-factory-evidence-'));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const status = (value, scope) => ({ status: value, scope });
const blocked = {
  canonicalMapping: 'Canonical identity, physical units, applicability and scope need competent acceptance.',
  sourceApplicability: 'Source applicability and calculator-specific interpretation require competent review; a path and hash are provenance only.',
  competentReview: 'Default execution and engineering checks do not establish competent reviewer approval.',
  pdf: 'PDF output is not implemented by the shared factory workflow.',
  persistedScenarioUI: 'Persisted scenario UI is not implemented by the shared factory workflow.',
  serverMeteredBatch: 'Local bounded batch does not establish an authenticated server-metered batch service.',
  embed: 'Factory embed delivery is not implemented by this registry/workflow.',
  webhook: 'Factory webhook delivery is not implemented by this registry/workflow.',
};
try {
  const bundle = path.join(temporary, 'runtime.mjs');
  const built = await build({
    absWorkingDir: root,
    stdin: { contents: "export { factoryContracts, getFactoryWorkflows } from './src/lib/calculator-factory/registry'; export { conversionFactoryDefinitions } from './src/lib/calculator-factory/cohorts/conversions';", resolveDir: root, sourcefile: 'factory-evidence-runtime-entry.ts', loader: 'ts' },
    outfile: bundle, bundle: true, platform: 'node', format: 'esm', target: 'node22', metafile: true,
    tsconfig: path.join(root, 'tsconfig.json'), logLevel: 'silent',
  });
  const { factoryContracts, getFactoryWorkflows, conversionFactoryDefinitions } = await import(pathToFileURL(bundle).href);
  if (factoryContracts.length !== 27) throw Error(`Expected frozen wave1 runtime of27, found${factoryContracts.length}`);
  const sourcePaths = [...new Set([...Object.keys(built.metafile.inputs).filter(file => !file.includes('node_modules/') && !file.startsWith('<') && file !== 'factory-evidence-runtime-entry.ts'), 'scripts/calculator-factory-20261112/generate.mjs', ...factoryContracts.flatMap(contract => contract.sourceEvidence)])].sort();
  const sourceFiles = [];
  for (const file of sourcePaths) {
    const absolute = path.resolve(root, file);
    const relative = path.relative(root, absolute).split(path.sep).join('/');
    if (relative.startsWith('../')) throw Error('Source input escaped repository');
    if (!check) {
      await git('ls-files', '--error-unmatch', relative);
      await git('diff', '--exit-code', 'HEAD', '--', relative);
    }
    sourceFiles.push({ path: relative, sha256: digest(await readFile(absolute)) });
  }
  const entries = [];
  for (const contract of factoryContracts) {
    const { execute, ...descriptor } = contract;
    const raw = Object.fromEntries(contract.fields.map(field => {
      if (field.defaultValue === undefined) throw Error(`Missing explicit default ${contract.catalogId}/${field.key}`);
      return [field.key, String(field.defaultValue)];
    }));
    if (!contract.fields.length) throw Error(`Missing executable input defaults for catalogId${contract.catalogId}`);
    let packet;
    try { packet = getFactoryWorkflows(contract.catalogId).execute(raw); }
    catch (error) { throw new Error(`Actual default execution failed for catalogId${contract.catalogId}`, { cause: error }); }
    if (packet.identity.catalogId !== contract.catalogId || packet.snapshot.calculatorSlug !== contract.slug || packet.snapshot.calculatorVersion !== contract.version) throw Error(`Runtime identity mismatch${contract.catalogId}`);
    const conversion = conversionFactoryDefinitions.find(row => row.catalogId === contract.catalogId);
    const unit = conversion ? conversion.outputUnit(packet.snapshot.input) : contract.unit ?? null;
    const unitEvidence = conversion ? 'Actual conversion outputUnit(snapshot.input)' : contract.unit !== undefined ? 'Explicit runtime contract unit' : 'Unresolved: no canonical unit assertion supplied';
    const evidenceFiles = [];
    for (const source of contract.sourceEvidence) {
      evidenceFiles.push({ path: source, sha256: digest(await readFile(path.resolve(root, source))) });
    }
    entries.push({ descriptor, inputDefaults: raw, observedDefault: { raw: packet.raw, identity: packet.identity, snapshot: packet.snapshot, unit, unitEvidence }, sourceEvidence: evidenceFiles,
      requirements: {
        explicitRuntimeBinding: status('VERIFIED_ENGINEERING', 'Actual registry metadata and default workflow identity agree; no canonical identity approval inferred.'),
        defaultExecutionAndCapture: status('VERIFIED_ENGINEERING', 'One actual-engine default run captures raw strings and parsed input/output; not full domain certification.'),
        ...Object.fromEntries(Object.entries(blocked).map(([key, scope]) => [key, status('BLOCKED', scope)])),
      },
    });
  }
  const common = { schemaVersion: 1, cohort: 'calculator-factory-wave1-20261112', sourceSHA, codeRef: codeRef ?? null, releaseHold: true, authority: 'Private engineering evidence only. No certification, publication, production merge, live deployment or engineering-complete promotion.', sourceFiles };
  // JSON serialization intentionally removes no metadata other than executable functions.
  const contracts = { ...common, contracts: entries.map(({descriptor,inputDefaults}) => ({...descriptor,inputDefaults})) };
  const evidence = { ...common, evidence: entries.map(({descriptor,...rest}) => ({catalogId:descriptor.catalogId,engineId:descriptor.engineId,slug:descriptor.slug,version:descriptor.version,registered:descriptor.registered,scope:descriptor.scope,limitations:descriptor.limitations,...rest})) };
  if (check) process.stdout.write(JSON.stringify({ mode:'check-only-no-output-written',sourceSHA,contracts:entries.length,sourceFiles:sourceFiles.length,releaseHold:true })+'\n');
  else {
    const directory = path.join(root,'docs/calculator-factory/wave1');
    await mkdir(directory,{recursive:true});
    const ending=outputSuffix?'-'+outputSuffix:'';
    const names=['contracts'+ending+'.json','evidence'+ending+'.json'];
    await writeFile(path.join(directory,names[0]),JSON.stringify(contracts,null,2)+'\n',{flag:'wx'});
    await writeFile(path.join(directory,names[1]),JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
    process.stdout.write(JSON.stringify({sourceSHA,contracts:entries.length,written:names.map(name=>'docs/calculator-factory/wave1/'+name)})+'\n');
  }
} finally { await rm(temporary,{recursive:true,force:true}); }
