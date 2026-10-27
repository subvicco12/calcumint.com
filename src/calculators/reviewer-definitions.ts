import {privateSourceDefinitions} from './private-source-definitions';
import {privateOwnerDefinitions} from './private-owner-definitions';
import {privateScientificDefinitions} from './private-scientific-definitions';
import {calculatorRegistry} from './registry';
import {privateCatalogAdapters} from './private-catalog-adapters';
/** Reviewer-only lookup. Public routes, APIs and historical registry dispatch are unchanged. */
export function getReviewerCalculator(slug:string){return calculatorRegistry.getBySlug(slug)??[...privateCatalogAdapters,...privateScientificDefinitions,...privateOwnerDefinitions,...privateSourceDefinitions].find(x=>x.definition.slug===slug)?.definition;}
