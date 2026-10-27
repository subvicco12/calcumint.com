export function displayFinalValue(value: number | string, unit?: string): string {
  const rendered = typeof value === "number"
    ? (value !== 0 && Math.abs(value) < 0.01
      ? value.toLocaleString("en-US", { maximumSignificantDigits: 8 })
      : value.toLocaleString("en-US", { maximumFractionDigits: 2 }))
    : value;
  return unit ? rendered + " " + unit : rendered;
}
