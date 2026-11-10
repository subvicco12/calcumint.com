import {z} from 'zod';import {technologyFiveIdentity} from './technology-five-catalog';
/** Closed original-five plus approved-eight identifiers. Version2 is allowed only for383. */
export const technologyNativeTupleShape={catalogId:z.union([z.literal(370),z.literal(371),z.literal(372),z.literal(373),z.literal(374),z.literal(377),z.literal(378),z.literal(379),z.literal(382),z.literal(383),z.literal(384),z.literal(385),z.literal(386)]),version:z.union([z.literal(1),z.literal(2)])};
export function isTechnologyNativeTuple(value:{catalogId:number;version:number}){return Boolean(technologyFiveIdentity(value.catalogId,value.version));}
