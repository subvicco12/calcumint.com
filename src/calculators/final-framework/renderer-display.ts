export function displayFinalValue(value: number | string, unit?: string): string {
  const rendered = typeof value === "number"
    ? (value !== 0 && Math.abs(value) < 0.01
      ? value.toLocaleString(undefined, { maximumSignificantDigits: 8 })
      : value.toLocaleString(undefined, { maximumFractionDigits: 2 }))
    : value;
  return unit ? rendered + " " + unit : rendered;
}
