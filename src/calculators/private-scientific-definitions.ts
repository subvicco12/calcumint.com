import {z} from 'zod';
import type {CalculatorDefinition} from './types';
import {calculateHeatIndex} from './science/heat-index';
import {solarPosition} from './science/solar-position';
import {sunEvents} from './science/sun-events';
const finite=z.number().finite();
const coordinates={latitude:finite.min(-90).max(90),longitude:finite.min(-180).max(180)};
const heatSchema=z.object({temperature:finite,temperatureUnit:z.enum(['F','C']),relativeHumidityPercent:finite.min(0).max(100)}).strict();
const positionSchema=z.object({instant:z.string(),...coordinates}).strict();
const eventsSchema=z.object({date:z.string(),...coordinates,utcOffsetMinutes:finite.int().min(-840).max(840)}).strict();
const heat=(raw:unknown)=>calculateHeatIndex(heatSchema.parse(raw));
const position=(raw:unknown)=>solarPosition(positionSchema.parse(raw));
const events=(raw:unknown)=>sunEvents(eventsSchema.parse(raw));
const heatScope='Private MetPy-pinned heat-index arithmetic, shaded/light wind only. Review guard 80–112 F is not a physiological validity domain. Unsupported inputs have no numerical result. No medical assessment or safe-exposure advice; original-source applicability and specialist approval remain required.';
const solarScope='Approximate geometric SSC solarpos, UTC years 1950–2050. North-positive latitude/east-positive longitude in degrees; azimuth clockwise from north, null where undefined. No refraction, terrain, altitude or precision-navigation claim. See source provenance for independent SPA comparison tolerances.';
function definition(masterId:number,title:string,kind:'heat'|'position'|'events'): {masterId:number;definition:CalculatorDefinition<unknown,unknown>} {
 const heatModel=kind==='heat', eventModel=kind==='events';
 return {masterId,definition:{id:`private.scientific.${masterId}`,slug:`private-scientific-${masterId}`,title,category:'private-scientific',version:1,riskClass:heatModel?'health':'standard',reviewStatus:'draft',inputSchema:heatModel?heatSchema:eventModel?eventsSchema:positionSchema,calculate:heatModel?heat:eventModel?events:position,formulas:[{id:kind,expression:heatModel?'Pinned MetPy simplified/Rothfusz heat index':eventModel?'Crossings of geometric solar-center elevation -0.833 degrees':'SSC geometric solarpos',description:heatModel?heatScope:solarScope+(eventModel?' Fixed-offset civil date, not named timezone/DST; UTC timestamps and nullable missing events. Near-grazing events require additional review.':'')}],sources:[{label:heatModel?'Pinned UCAR Unidata/MetPy implementation':'Pinned official SSC geometric solarpos; independent test-only SPA oracle',url:heatModel?'https://github.com/Unidata/MetPy/blob/d247e5dbbfd38291f4f2a9b3379d7881fc8d1c05/src/metpy/calc/basic.py':'https://github.com/NatLabRockies/ssc/blob/c92cbf05e3fc1411a91c0fb9b48827dd2104c7f8/shared/lib_irradproc.cpp',note:heatModel?'docs/evidence/heat/PROVENANCE.md':'src/calculators/science/solar/PROVENANCE.md'}],examples:heatModel?[{label:'Independent Decimal reference, Fahrenheit',input:{temperature:90,temperatureUnit:'F',relativeHumidityPercent:50},expected:{heatIndexF:94.5969412}}]:eventModel?[{label:'Polar night, missing events are null',input:{date:'2024-12-21',latitude:80,longitude:0,utcOffsetMinutes:0},expected:{status:'polar-night',sunriseUtc:null,sunsetUtc:null}}]:[{label:'Geographic pole has no unique north-reference azimuth; SPA fixtures test numerical position',input:{instant:'2024-03-20T12:00:00Z',latitude:90,longitude:0},expected:{azimuthDegrees:null}}]}};
}
/** Five catalog identities, three mathematical implementations. Never part of the public registry. */
export const privateScientificDefinitions=[definition(491,'Heat Index Calculator','heat'),definition(539,'Heat Index Calculator','heat'),definition(495,'Solar Position Calculator','position'),definition(536,'Solar Position Calculator','position'),definition(535,'Sunrise/Sunset Calculator','events')];
