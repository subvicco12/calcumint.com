import { defineConfig } from 'vitest/config';
export default defineConfig({
  resolve: { alias: { '@': new URL('../../src', import.meta.url).pathname } },
  test: { environment: 'node', include: ['tests/worker2-physics-20261116/*.test.ts'], maxWorkers: 1 },
});
