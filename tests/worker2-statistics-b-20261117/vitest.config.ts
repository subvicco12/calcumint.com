import {defineConfig} from 'vitest/config';
export default defineConfig({esbuild:{jsx:'automatic'},resolve:{alias:{'@':new URL('../../src',import.meta.url).pathname}},test:{environment:'node',include:['src/lib/worker2-statistics-b-20261117/*.test.ts','src/components/worker2-statistics-b-20261117/*.test.tsx','tests/worker2-statistics-b-20261117/*.test.ts'],maxWorkers:1}});
