import path from 'node:path';
import { defineConfig } from 'vitest/config';
export default defineConfig({resolve:{alias:{'server-only':path.resolve(process.cwd(),'tests/unit/server-only.ts'),'@':path.resolve(process.cwd(),'src')}},test:{environment:'node',include:['tests/billing/*.postgres.ts'],fileParallelism:false,testTimeout:15000}});
