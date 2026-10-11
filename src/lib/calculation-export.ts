/** Export raw engine values; formatting and on-screen sampling do not affect CSV. */
export function serializeCalculationCsv(input: Record<string, unknown>, output: Record<string, unknown>): string {
  const text = (value: unknown): string => {
    if (typeof value === "number") {
      if (!Number.isFinite(value)) throw new Error("Non-finite export value");
      return Object.is(value, -0) ? "-0" : String(value);
    }
    if (typeof value === "string") return /^[\s]*[=+\-@]/u.test(value) ? `'${value}` : value;
    if (value === null) return "null";
    if (typeof value === "boolean") return String(value);
    const encoded = JSON.stringify(value, (_key, cell: unknown) => {
      if (typeof cell === "number" && !Number.isFinite(cell)) throw new Error("Non-finite export value");
      if (typeof cell === "undefined" || typeof cell === "bigint" || typeof cell === "function" || typeof cell === "symbol") throw new Error("Unsupported export value");
      return cell;
    });
    if (encoded === undefined) throw new Error("Unsupported export value");
    return encoded;
  };
  const rows = [["section", "field", "value"], ...Object.entries(input).map(([key, value]) => ["input", text(key), text(value)]), ...Object.entries(output).map(([key, value]) => ["output", text(key), text(value)])];
  return rows.map(row => row.map(cell => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
}
