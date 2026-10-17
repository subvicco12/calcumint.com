/** Missing required input must not become an authoritative zero. Schemas retain domain bounds. */
export function requiredCalculatorNumber(value: string): number {
  if (!value.trim()) return Number.NaN;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}
