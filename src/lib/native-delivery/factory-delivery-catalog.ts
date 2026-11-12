/** Closed immutable factory delivery tuples. This list grants no publication authority. */
export const factoryDeliveryCatalog=Object.freeze([
 {catalogId:218,engineId:'launch-square-calculator',slug:'square-calculator',version:1},
 {catalogId:219,engineId:'launch-cube-calculator',slug:'cube-calculator',version:1},
 {catalogId:220,engineId:'launch-square-root-calculator',slug:'square-root-calculator',version:1},
 {catalogId:423,engineId:'conversion.length',slug:'length-converter',version:1},
 {catalogId:430,engineId:'conversion.energy',slug:'energy-converter',version:1},
 {catalogId:431,engineId:'conversion.power',slug:'power-converter',version:1},
 {catalogId:432,engineId:'conversion.time',slug:'time-converter',version:1},
 {catalogId:438,engineId:'conversion.force',slug:'force-converter',version:1},
 {catalogId:440,engineId:'conversion.frequency',slug:'frequency-converter',version:1},
].map(row=>Object.freeze(row)));
export function factoryDeliveryIdentity(catalogId:number,version:number){return factoryDeliveryCatalog.find(row=>row.catalogId===catalogId&&row.version===version);}
