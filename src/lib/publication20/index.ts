import {conversionPublicationDefinitions} from './conversions';
import {networkPublicationDefinitions} from './network';
export const publication20Definitions=Object.freeze([...conversionPublicationDefinitions,...networkPublicationDefinitions]);
if(publication20Definitions.length!==20||new Set(publication20Definitions.map(x=>x.catalogId)).size!==20||new Set(publication20Definitions.map(x=>x.definition.slug)).size!==20)throw Error('Publication cohort identity mismatch');
export function getPublication20Definition(slug:string){return publication20Definitions.find(row=>row.definition.slug===slug);}
