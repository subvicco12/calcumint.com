import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { loadEnvConfig } from "@next/env";
import { expect, it, vi } from "vitest";

it("loads a copied local environment template without integration credentials", async () => {
  const directory = mkdtempSync(join(tmpdir(), "calcumint-local-env-"));
  const originalEnv = process.env;
  writeFileSync(join(directory, ".env.local"), readFileSync(resolve(".env.example")));

  try {
    // Model a fresh shell; never load the developer's credentials into this test.
    process.env = { NODE_ENV: "development" };
    const { loadedEnvFiles } = loadEnvConfig(directory, true, undefined, true);
    expect(loadedEnvFiles.map((file) => file.path)).toEqual([".env.local"]);
    vi.resetModules();
    const { publicEnv, serverEnv, assertProductionEnvironment } = await import("./env");

    expect(publicEnv.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
    expect(publicEnv.NEXT_PUBLIC_PADDLE_ENV).toBe("sandbox");
    expect(publicEnv.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
    expect(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeUndefined();
    expect(serverEnv.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    expect(serverEnv.PADDLE_API_KEY).toBeUndefined();
    expect(serverEnv.AI_API_KEY).toBeUndefined();
    expect(() => assertProductionEnvironment({ ...process.env, NODE_ENV: "production" }))
      .toThrow(/Missing production environment variables/);
  } finally {
    process.env = originalEnv;
    vi.resetModules();
    rmSync(directory, { recursive: true, force: true });
  }
});
