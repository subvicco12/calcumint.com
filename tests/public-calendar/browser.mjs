import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { startBrowser } from '../next-runtime/cdp.mjs';

const require = createRequire(import.meta.url);
const axe = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const cases = JSON.parse(await readFile(new URL('./cases.json', import.meta.url), 'utf8'));
const server = await createServer({
    configFile: false,
    esbuild: { jsx: 'automatic' },
    resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
    server: { host: '127.0.0.1', port: 0, hmr: false },
});
let browser;
const journeys = [];
try {
    await server.listen();
    browser = await startBrowser(server.resolvedUrls.local[0].replace(/\/$/, ''));
    const key = async (key, code, windowsVirtualKeyCode) => {
        for (const type of ['keyDown', 'keyUp']) await browser.send('Input.dispatchKeyEvent', {
            type, key, code, windowsVirtualKeyCode, ...(key === 'Enter' && type === 'keyDown' ? { text: '\r' } : {}),
        });
    };
    for (const width of [360, 1440]) {
        await browser.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width === 360 });
        for (const row of cases) {
            await browser.visit('/tests/public-calendar/?slug=' + row.slug);
            await browser.until('!!document.querySelector("form input")');
            await browser.js(axe);
            const enter = async fields => {
                for (const [name, value] of Object.entries(fields)) await browser.field(`input[name="${name}"]`, value);
            };
            const ready = `document.querySelector("[role=status] strong")?.textContent === ${JSON.stringify(row.result)}`;
            await enter(row.input);
            await key('Enter', 'Enter', 13);
            await browser.until(ready);
            if (row.slug === 'week-number-calculator') assert.equal(await browser.js('document.querySelector("dd").textContent'), '2020');
            await enter(row.invalid);
            assert.equal(await browser.js('!document.querySelector("[role=status]")'), true);
            await key('Enter', 'Enter', 13);
            await browser.until('!!document.querySelector("[role=alert]")');
            await enter(row.input);
            await key('Enter', 'Enter', 13);
            await browser.until(ready);
            assert.equal(await browser.js('document.documentElement.scrollWidth <= innerWidth'), true);
            const violations = await browser.js('axe.run({runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}}).then(r=>r.violations.map(v=>v.id))');
            assert.deepEqual(violations, []);
            journeys.push({ slug: row.slug, width, input: row.input, expected: row.result, observed: await browser.js('document.querySelector("[role=status] strong").textContent'), keyboardRefusalRecovery: true, axeViolations: violations });
        }
    }
    assert.deepEqual(browser.errors, []);
    assert.deepEqual(browser.network.filter(request => !request.allowed), []);
    console.log(JSON.stringify({ scope: 'Anonymous loopback component fixture', journeys }, null, 2));
} finally {
    try { await browser?.close(); } finally { await server.close(); }
}
