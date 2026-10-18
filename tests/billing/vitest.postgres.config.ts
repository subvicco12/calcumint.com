import { defineConfig } from 'vitest/config';
export default defineConfig({test:{environment:'node',include:['tests/billing/*.postgres.ts'],fileParallelism:false,testTimeout:15000}});
