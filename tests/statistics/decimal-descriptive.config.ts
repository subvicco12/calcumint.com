import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', include: ['tests/statistics/decimal-descriptive.test.ts'] } });
