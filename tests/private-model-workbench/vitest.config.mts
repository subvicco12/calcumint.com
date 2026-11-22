import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    esbuild: { jsx: 'automatic' },
    resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
    test: {
        maxWorkers: 1,
        include: [
            'src/components/private-model-workbench.test.tsx',
            'src/app/admin/calculator-factory/page.test.tsx',
            'src/calculators/business/private-cohort-economics.test.ts',
            'src/calculators/private-supplied-forecast-models.test.ts',
        ],
    },
});
