import path from 'node:path';
import { defineConfig } from 'vitest/config';
export default defineConfig({resolve:{alias:{'@':path.resolve(process.cwd(),'src')}},test:{environment:'node',include:['tests/api-embed/*.postgres.ts'],fileParallelism:false,testTimeout:15000}});
