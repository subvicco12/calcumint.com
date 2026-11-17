import {defineConfig} from 'vitest/config';
import path from 'node:path';
export default defineConfig({esbuild:{jsx:'automatic'},resolve:{alias:{'@':path.resolve(process.cwd(),'src')}},test:{include:['tests/parallel-converters-20261110/**/*.test.{ts,tsx}'],environment:'node'}});
