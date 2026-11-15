import { defineConfig } from 'vitest/config';
export default defineConfig({
  resolve: { alias: { '@': new URL('../../src', import.meta.url).pathname } },
  test: { environment: 'node', include: ['tests/physics-qualification-20261115/qualification.test.ts'], maxWorkers: 1 },
});
