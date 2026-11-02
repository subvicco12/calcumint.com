import Decimal from 'decimal.js';

/** Partial geometry registry only. Non-SI reference adoption remains a release gate. */
const UnitDecimal = Decimal.clone({precision: 50, rounding: Decimal.ROUND_HALF_EVEN});
export type GeometryDimension = 'unitless' | 'length' | 'area' | 'volume' | 'time';
export interface GeometryUnit {
  readonly id: string;
  readonly dimension: GeometryDimension;
  readonly toSI: string;
  readonly provenance: string;
}
const provenance = 'six-fullscope-input/contracts/275-volume-calculator.md#units; 276-slope-calculator.md#units; existing src/calculators/units.ts (retained factors, not external reference adoption)';
const definitions: Record<string, GeometryUnit> = Object.create(null);
function add(id: string, dimension: GeometryDimension, toSI: string) {
  definitions[id] = Object.freeze({id, dimension, toSI, provenance});
}
const lengthFactors = {m:'1', cm:'0.01', mm:'0.001', km:'1000', in:'0.0254', ft:'0.3048', yd:'0.9144'};
for (const [id,factor] of Object.entries(lengthFactors)) add(id, 'length', factor);
for (const id of ['m','cm','mm','ft'] as const) add(`${id}2`, 'area', new UnitDecimal(lengthFactors[id]).pow(2).toFixed());
for (const id of ['m','cm','mm','in','ft'] as const) add(`${id}3`, 'volume', new UnitDecimal(lengthFactors[id]).pow(3).toFixed());
add('L','volume','0.001');
add('mL','volume','0.000001');
add('unitless','unitless','1');
add('s','time','1');
add('min','time','60');
add('h','time','3600');
Object.freeze(definitions);
export const supportedGeometryUnits: readonly string[] = Object.freeze(Object.keys(definitions));
export function getGeometryUnit(id: string): GeometryUnit | undefined {
  return Object.hasOwn(definitions,id) ? definitions[id] : undefined;
}
/** Decimal50 conversion; original input/unit metadata must be retained by caller. */
export function convertGeometryUnit(raw: string, from: string, to: string): string {
  if (typeof raw !== 'string' || !/^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/.test(raw)) throw new RangeError('Expected a complete decimal string');
  const source = getGeometryUnit(from), target = getGeometryUnit(to);
  if (!source || !target) throw new RangeError('Unsupported geometry unit');
  if (source.dimension !== target.dimension) throw new RangeError('Incompatible geometry dimensions');
  const value = new UnitDecimal(raw);
  if (!value.isFinite() || (value.isZero() && /[1-9]/.test(raw.split(/[eE]/)[0]))) throw new RangeError('Decimal outside conversion range');
  if (from === to) return raw;
  const result = value.times(source.toSI).div(target.toSI);
  if (!result.isFinite() || (!value.isZero() && result.isZero())) throw new RangeError('Decimal outside conversion range');
  return result.isZero() && result.isNegative() ? '-0' : result.toString();
}
