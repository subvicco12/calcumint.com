import path from 'node:path';
import {defineConfig} from 'vitest/config';
export default defineConfig({resolve:{alias:{'@':path.resolve(process.cwd(),'src')}},test:{environment:'node',include:['tests/technology-final-two-20261111/numerical.test.ts']}});
