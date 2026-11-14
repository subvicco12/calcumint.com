import { defineConfig } from 'vitest/config';
export default defineConfig({ resolve: { alias: { '@': new URL('../../src', import.meta.url).pathname } }, test: { environment: 'node', include: ['tests/milestone60-20261113/physics.test.ts', 'src/lib/calculator-factory/completion/physics.test.ts'], maxWorkers: 1 } });
