import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    esbuild: { jsx: 'automatic' },
    resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
    test: { include: ['src/components/public-calendar-tools.test.tsx', 'src/lib/worker1-calendar-20261119/cohort.test.ts'], maxWorkers: 1 },
});
