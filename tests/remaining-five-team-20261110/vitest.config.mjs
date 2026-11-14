import path from 'node:path';
import {defineConfig} from 'vitest/config';
export default defineConfig({esbuild:{jsx:'automatic'},resolve:{alias:{'@':path.resolve('src')}},test:{environment:'jsdom',include:['tests/remaining-five-team-20261110/*.test.tsx']}});
