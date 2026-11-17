import assert from 'node:assert/strict';
import {workflowJobs,requiredVerificationJobs} from './verification-jobs-contract.mjs';

export const sourceLineageBootstrapStep = '      - name: Fetch exact financial and caller source revisions\n        run: node scripts/fetch-source-lineage.mjs\n';
/** Admit only the exact additive source prerequisite, leaving historical checks byte-identical. */
export function historicalWorkflowWithoutSourceLineageBootstrap(source) {
  const jobs=workflowJobs(source),required=requiredVerificationJobs(source);
  for(const name of required) {
    const job=jobs[name];
    assert.equal(job.split(sourceLineageBootstrapStep).length-1,1,'Exactly one immutable source bootstrap required for '+name);
    const before=job.slice(0,job.indexOf(sourceLineageBootstrapStep));
    assert.match(before,/      - name: Use Node\.js 22\n        uses: actions\/setup-node@v5\n        with:\n          node-version: 22\n(?:          cache: npm\n          cache-dependency-path: package-lock\.json\n)?$/,'Source bootstrap must immediately follow Node setup');
    assert(job.includes(sourceLineageBootstrapStep+'      - name: Install dependencies\n        run: npm ci --no-audit --no-fund\n'),'Source bootstrap must precede clean lockfile installation');
  }
  assert.equal(source.split(sourceLineageBootstrapStep).length-1,required.length,'No unaccounted source bootstrap');
  return source.replaceAll(sourceLineageBootstrapStep,'');
}
