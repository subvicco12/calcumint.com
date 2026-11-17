import {statisticsContracts,statisticsCaptureRevision,statisticsWorkflows} from '@/lib/worker1-statistics-a-20261117/cohort';
import type {FactoryContract} from '@/lib/calculator-factory/registry';

/** Private dispatch integration only. Existing registered v1 mathematics and the
 * worker's exact packet namespace are retained; no delivery allowlist is widened. */
export const statisticsFactoryContracts:readonly FactoryContract[]=Object.freeze(statisticsContracts.map(c=>Object.freeze({
 catalogId:c.catalogId,engineId:c.engineId,slug:c.slug,version:c.version,title:c.title,registered:true,
 captureRevision:statisticsCaptureRevision,primaryKey:c.primaryKey,fields:c.fields,scope:c.scope,
 sourceEvidence:['src/lib/worker1-statistics-a-20261117/cohort.ts','docs/worker1-statistics-a-20261117/source-bindings.json'],
 limitations:['Private bounded binary64 capture; canonical/source applicability and competent QA remain pending.','Exact normalized-input precision witnesses are refusal boundaries only; immutable v1 historical records retain original outputs.','Shared Business storage, native API/embed, jobs and webhooks remain denied pending separately reviewed exact-tuple adoption.'],
 execute:(raw:Readonly<Record<string,string>>)=>statisticsWorkflows(c.catalogId).execute(raw).snapshot,
})));
/** Decision-ready tuple inputs for the existing Business adoption pipeline.
 * This data is deliberately not imported by native delivery or SQL capabilities. */
export const statisticsBusinessDeliveryProposal=Object.freeze(statisticsFactoryContracts.map(c=>Object.freeze({
 catalogId:c.catalogId,engineId:c.engineId,slug:c.slug,version:c.version,
 captureSourceVersion:statisticsWorkflows(c.catalogId).identity.sourceVersion,
 activation:'HELD_NOT_ADOPTED' as const,
})));
