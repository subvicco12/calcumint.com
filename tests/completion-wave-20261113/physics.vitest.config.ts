import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', include: ['tests/completion-wave-20261113/physics.test.ts'] } });
