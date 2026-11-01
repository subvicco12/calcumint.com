import {defineConfig} from 'vitest/config';
export default defineConfig({test:{environment:'node',include:['tests/owner-p0/calculus/**/*.test.ts']}});
