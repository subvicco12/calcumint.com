import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/worker2-numerical-qualification-20261118/*.test.ts'] },
});
