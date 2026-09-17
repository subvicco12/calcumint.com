import { describe, expect, it } from "vitest";
import { COUNTRY_PROFILES, listWaveOneCountries, resolveCountry } from "./country-intelligence";

describe("country intelligence", () => {
  it("gives explicit user selection precedence over all inferred signals", () => {
    expect(resolveCountry({ explicitCountry: "IN", storedCountry: "GB", ipCountry: "CA", browserLocale: "en-AU" }).code).toBe("IN");
  });

  it("uses a stored preference before coarse IP and browser locale", () => {
    expect(resolveCountry({ storedCountry: "GB", ipCountry: "US", browserLocale: "en-IN" }).code).toBe("GB");
  });

  it("uses coarse IP before browser locale", () => {
    expect(resolveCountry({ ipCountry: "CA", browserLocale: "en-IN" }).code).toBe("CA");
  });

  it("can infer a Wave 1 market from browser locale", () => {
    expect(resolveCountry({ browserLocale: "en-AU" }).code).toBe("AU");
    expect(resolveCountry({ browserLocale: "hi-IN" }).code).toBe("IN");
  });

  it("falls back safely when signals are unsupported", () => {
    expect(resolveCountry({ ipCountry: "ZZ", browserLocale: "xx-ZZ" }).code).toBe("US");
  });

  it("defines the five locked Wave 1 markets with currency and calculator priorities", () => {
    expect(listWaveOneCountries().map((country) => country.code).sort()).toEqual(["AU", "CA", "GB", "IN", "US"]);
    expect(COUNTRY_PROFILES.IN.currency).toBe("INR");
    expect(COUNTRY_PROFILES.US.currency).toBe("USD");
    expect(COUNTRY_PROFILES.GB.currency).toBe("GBP");
    for (const country of listWaveOneCountries()) expect(country.priorityCalculatorSlugs.length).toBeGreaterThan(0);
  });
});
