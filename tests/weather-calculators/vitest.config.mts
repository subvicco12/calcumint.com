import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    esbuild: { jsx: 'automatic' },
    resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
    test: {
        maxWorkers: 1,
        include: [
            "src/lib/calculator-factory/weather.test.ts",
            "src/app/admin/calculator-factory/page.test.tsx",
        ],
    },
});
