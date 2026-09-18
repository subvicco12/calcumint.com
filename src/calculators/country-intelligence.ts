import type { UnitSystem } from "./types";

export type CountryCode = "IN" | "US" | "GB" | "CA" | "AU";

export type CountryProfile = {
  code: CountryCode;
  name: string;
  currency: string;
  locale: string;
  unitSystem: UnitSystem;
  priorityCalculatorSlugs: readonly string[];
};

export const COUNTRY_PROFILES: Readonly<Record<CountryCode, CountryProfile>> = {
  IN: {
    code: "IN", name: "India", currency: "INR", locale: "en-IN", unitSystem: "metric",
    priorityCalculatorSlugs: ["loan-emi-calculator", "compound-interest-calculator", "sip-calculator", "fixed-term-deposit-calculator", "income-tax-india", "gst", "salary-take-home-india"],
  },
  US: {
    code: "US", name: "United States", currency: "USD", locale: "en-US", unitSystem: "us",
    priorityCalculatorSlugs: ["mortgage-payment", "loan-emi-calculator", "compound-interest-calculator", "retirement", "income-tax-us", "salary-take-home-us", "capital-gains-us"],
  },
  GB: {
    code: "GB", name: "United Kingdom", currency: "GBP", locale: "en-GB", unitSystem: "metric",
    priorityCalculatorSlugs: ["mortgage-payment", "loan-emi-calculator", "compound-interest-calculator", "income-tax-uk", "salary-take-home-uk", "vat", "retirement"],
  },
  CA: {
    code: "CA", name: "Canada", currency: "CAD", locale: "en-CA", unitSystem: "metric",
    priorityCalculatorSlugs: ["mortgage-payment", "loan-emi-calculator", "compound-interest-calculator", "income-tax-canada", "salary-take-home-canada", "retirement"],
  },
  AU: {
    code: "AU", name: "Australia", currency: "AUD", locale: "en-AU", unitSystem: "metric",
    priorityCalculatorSlugs: ["mortgage-payment", "loan-emi-calculator", "compound-interest-calculator", "income-tax-australia", "salary-take-home-australia", "superannuation", "retirement"],
  },
};

const localeToCountry: Readonly<Record<string, CountryCode>> = {
  "en-in": "IN", "hi-in": "IN",
  "en-us": "US",
  "en-gb": "GB",
  "en-ca": "CA", "fr-ca": "CA",
  "en-au": "AU",
};

export type CountrySignals = {
  explicitCountry?: string | null;
  storedCountry?: string | null;
  ipCountry?: string | null;
  browserLocale?: string | null;
};

function normalizeCountry(value?: string | null): CountryCode | undefined {
  const code = value?.trim().toUpperCase();
  return code && code in COUNTRY_PROFILES ? (code as CountryCode) : undefined;
}

/**
 * Resolve a country suggestion without requiring precise location.
 * User intent always wins: explicit override > stored preference > coarse IP > locale > fallback.
 */
export function resolveCountry(signals: CountrySignals, fallback: CountryCode = "US"): CountryProfile {
  const explicit = normalizeCountry(signals.explicitCountry);
  if (explicit) return COUNTRY_PROFILES[explicit];

  const stored = normalizeCountry(signals.storedCountry);
  if (stored) return COUNTRY_PROFILES[stored];

  const ip = normalizeCountry(signals.ipCountry);
  if (ip) return COUNTRY_PROFILES[ip];

  const locale = signals.browserLocale?.trim().toLowerCase();
  const localeCountry = locale ? localeToCountry[locale] : undefined;
  return COUNTRY_PROFILES[localeCountry ?? fallback];
}

export function getCountryProfile(country: string): CountryProfile | undefined {
  const code = normalizeCountry(country);
  return code ? COUNTRY_PROFILES[code] : undefined;
}

export function listWaveOneCountries(): readonly CountryProfile[] {
  return Object.values(COUNTRY_PROFILES);
}
