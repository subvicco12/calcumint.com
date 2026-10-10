import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildMixedReviewCoverageReport } from "./catalog-mixed-coverage-report";

describe("mixed review coverage report", () => {
  it("counts all registry-backed slugs and never approves exact-title collisions", () => {
    const reviews = JSON.parse(readFileSync(resolve(process.cwd(), "data/catalog/mixed-category-review-ledger.partial.json"), "utf8"));
    const master = readFileSync(resolve(process.cwd(), "data/catalog/master-catalog-2026.csv"), "utf8")
      .trim().split(/\r?\n/).slice(1).map((line) => {
        const match = /^"(\d+)","([^"]+)","([^"]+)"$/.exec(line);
        if (!match) throw new Error("Malformed master row");
        return { id: Number(match[1]), domain: match[2], title: match[3] };
      });
    expect(master).toHaveLength(540);
    const report = buildMixedReviewCoverageReport(reviews, master);
    expect(report.total).toBe(report.approved + report.held + report.missing);
    expect(report.approved).toBe(reviews.filter((entry: { decision: string }) => entry.decision === "approved").length);
    const power = report.rows.find((entry) => entry.slug === "power-calculator");
    expect(power?.exactTitleCandidates.map((entry) => entry.id)).toEqual([222, 308]);
    expect(power?.requiresAdjudication).toBe(true);
    expect(report.rows.find((entry) => entry.slug === "travel-time-calculator")?.requiresAdjudication).toBe(true);
  });
});
