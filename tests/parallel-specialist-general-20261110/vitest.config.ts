import {defineConfig} from 'vitest/config';
export default defineConfig({esbuild:{jsx:'automatic'},test:{environment:'jsdom',include:['tests/parallel-specialist-general-20261110/*.test.tsx']}});
