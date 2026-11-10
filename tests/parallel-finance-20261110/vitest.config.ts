import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', include: ['tests/parallel-finance-20261110/*.test.ts'] } });
