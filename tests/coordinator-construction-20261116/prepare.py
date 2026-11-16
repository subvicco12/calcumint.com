"""Prepare held shared joins. Never modifies application files or applies SQL."""
from pathlib import Path
import difflib
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[2]
HEAD = '75040e7463093c5e9094016ef91cb64987d3df63'
BASE = '8296454dc7244205ef4cf0b6e0b41c38f90af20f'
OUT = ROOT / 'docs/coordinator-construction-20261116'
IDS = [343, 344, 345, 346, 348, 349, 350, 354, 355, 356]


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args])


def replace_once(text, before, after):
    assert text.count(before) == 1, before
    return text.replace(before, after)


def changed(path):
    original = git('show', f'{BASE}:{path}').decode()
    assert (ROOT / path).read_text() == original, f'Unreconciled shared preimage: {path}'
    text = original
    if path.endswith('/registry.ts'):
        text = "import {constructionContracts,constructionWorkflows} from '@/lib/worker1-construction-20261116/cohort';\n" + text
        declaration = "const construction:FactoryContract[]=constructionContracts.map(row=>({catalogId:row.catalogId,engineId:row.engineId,slug:row.slug,version:row.version,title:row.title,registered:true,primaryKey:'value',unit:row.unit,fields:row.fields,scope:row.scope,sourceEvidence:['src/lib/worker1-construction-20261116/cohort.ts','docs/worker1-construction-20261116/retained-bindings.json'],limitations:[row.limitations],execute:(raw:FactoryRaw)=>constructionWorkflows(row.catalogId).execute(raw).snapshot}));\n"
        text = replace_once(text, 'export const factoryContracts:', declaration + 'export const factoryContracts:')
        text = replace_once(text, '...wave100Science]);', '...wave100Science,...construction]);')
        text = replace_once(text, 'export function getFactoryWorkflows(catalogId:number){', 'export function getFactoryWorkflows(catalogId:number){if(constructionContracts.some(row=>row.catalogId===catalogId))return constructionWorkflows(catalogId);')
    elif path.endswith('/business.ts'):
        text = "import {constructionContracts,verifyConstructionSnapshot} from '@/lib/worker1-construction-20261116/cohort';\n" + text
        text = replace_once(text, ' const snapshot=createCalculationSnapshot(value);', ' const snapshot=createCalculationSnapshot(value);\n if(constructionContracts.some(row=>row.slug===snapshot.calculatorSlug)){const verified=verifyConstructionSnapshot(snapshot);return Object.freeze({catalogId:verified.catalogId,snapshot:verified.snapshot});}')
    elif path.endswith('/registered-snapshot-verification.ts'):
        text = "import {constructionContracts,verifyConstructionSnapshot} from './worker1-construction-20261116/cohort';\n" + text
        text = replace_once(text, " if(slug==='cooking-measurement-converter')", " if(constructionContracts.some(row=>row.slug===slug))return verifyConstructionSnapshot(clean);\n if(slug==='cooking-measurement-converter')")
    elif path.endswith('/factory-delivery-catalog.ts'):
        text = "import {constructionContracts} from '@/lib/worker1-construction-20261116/cohort';\n" + text
        text = replace_once(text, '].map(row=>Object.freeze(row)));', '...constructionContracts.map(({catalogId,engineId,slug,version})=>({catalogId,engineId,slug,version})),\n].map(row=>Object.freeze(row)));')
    elif path.endswith('/registry.test.ts'):
        text = replace_once(text, ',328,331,332]]);', ',328,331,332],...[343,344,345,346,348,349,350,354,355,356]]);')
    elif path.endswith(('/factory-embed-contract.test.ts', '/factory-nine-sharing.test.ts')):
        text = replace_once(text, ',328,331,332]));', ',328,331,332]).concat([343,344,345,346,348,349,350,354,355,356]));')
    elif path.endswith('/factory-automation-contract.test.ts'):
        text = replace_once(text, '[322,325,327,328,331,332].includes', '[322,325,327,328,331,332,343,344,345,346,348,349,350,354,355,356].includes')
    else:
        raise AssertionError(path)
    return original, text


paths = [
    'src/lib/registered-snapshot-verification.ts',
    'src/lib/calculator-factory/registry.ts',
    'src/lib/calculator-factory/completion/business.ts',
    'src/lib/native-delivery/factory-delivery-catalog.ts',
    'src/lib/calculator-factory/registry.test.ts',
    'src/lib/native-delivery/factory-embed-contract.test.ts',
    'src/lib/native-delivery/factory-automation-contract.test.ts',
    'src/lib/business/factory-nine-sharing.test.ts',
]
OUT.mkdir(parents=True, exist_ok=True)
patch = ''
bindings = []
for path in paths:
    original, text = changed(path)
    patch += ''.join(difflib.unified_diff(original.splitlines(True), text.splitlines(True), fromfile='a/' + path, tofile='b/' + path))
    bindings.append({'path': path, 'predecessorRef': BASE, 'predecessorBlob': git('rev-parse', f'{BASE}:{path}').decode().strip(), 'predecessorSHA256': hashlib.sha256(original.encode()).hexdigest(), 'proposedSHA256': hashlib.sha256(text.encode()).hexdigest()})
(OUT / 'shared-joins.held.patch').write_text(patch)
(OUT / 'shared-joins-proposal.json').write_text(json.dumps({'state': 'HELD_NOT_ACTIVATED', 'workerHead': HEAD, 'predecessorRef': BASE, 'ids': IDS, 'patchSHA256': hashlib.sha256(patch.encode()).hexdigest(), 'bindings': bindings, 'requiresReconciliationWithWorker3': True, 'sqlAdopted': False, 'newEngineeringPromotions': 0, 'releaseHold': True}, indent=2) + '\n')
print(f'Prepared {len(paths)} exact-preimage shared joins; application source untouched.')
