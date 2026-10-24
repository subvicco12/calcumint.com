import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createServer} from 'vite';

// Exercise the standalone CI resolvers without starting a database fixture.
for (const configFile of ['tests/api-embed/vitest.postgres.config.ts', 'tests/api-batch/vitest.postgres.config.ts', 'tests/billing/vitest.postgres.config.ts', 'tests/draft-preview/vitest.history.config.ts']) {
  test(`${configFile} loads the real server policy`, async () => {
    const previous = process.env.CALCUMINT_PRODUCT_MODE;
    const server = await createServer({configFile, optimizeDeps: {noDiscovery: true, entries: []}, server: {middlewareMode: true}, appType: 'custom'});
    try {
      const {disabledProductResponse} = await server.ssrLoadModule('/src/lib/product-route-guard.ts');
      delete process.env.CALCUMINT_PRODUCT_MODE;
      assert.equal(disabledProductResponse('accounts'), null);
      process.env.CALCUMINT_PRODUCT_MODE = 'public-only';
      const response = disabledProductResponse('accounts');
      assert.equal(response.status, 503);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.deepEqual(await response.json(), {error: 'Feature unavailable in this release'});
    } finally {
      if (previous === undefined) delete process.env.CALCUMINT_PRODUCT_MODE;
      else process.env.CALCUMINT_PRODUCT_MODE = previous;
      await server.close();
    }
  });
}
