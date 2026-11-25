import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { startBrowser } from '../next-runtime/cdp.mjs';

const require = createRequire(import.meta.url);
const axe = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const cases = [
    [490, 'Wind Chill Calculator', 'windSpeedKmh', '20', '4.7999999999999999', '-11.551404'],
    [492, 'Dew Point Calculator', 'relativeHumidity', '50', '100.000000000000001', '9.261107'],
];
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
    for (const width of [360, 1440]) {
        await browser.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width === 360 });
        await browser.visit('/tests/weather-calculators/');
        await browser.until('document.querySelectorAll("form").length === 2', 10000);
        await browser.js(axe);
        for (const [id, title, field, valid, invalid, expected] of cases) {
            const section = `section[aria-label="${title}"]`;
            const query = `document.querySelector(${JSON.stringify(section)})`;
            const enter = async () => {
                for (const type of ['keyDown', 'keyUp']) await browser.send('Input.dispatchKeyEvent', {
                    type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13,
                    ...(type === 'keyDown' ? { text: '\r' } : {}),
                });
            };
            await browser.field(`${section} input[name="${field}"]`, valid);
            await enter();
            await browser.until(`${query}.querySelector('[role=status]')?.textContent.includes('${expected} °C')`);
            await browser.field(`${section} input[name="${field}"]`, invalid);
            assert.equal(await browser.js(`!${query}.querySelector('.result-hero')`), true);
            await enter();
            await browser.until(`!!${query}.querySelector('[role=alert]')`);
            await browser.field(`${section} input[name="${field}"]`, valid);
            await enter();
            await browser.until(`${query}.querySelector('[role=status]')?.textContent.includes('${expected} °C')`);
            await browser.js(`[...${query}.querySelectorAll('button')].find(b=>b.textContent==='Capture scenario A').click()`);
            await browser.until(`!!${query}.querySelector('[aria-label="Captured scenarios"]')`);
            await browser.js(`[...${query}.querySelectorAll("button")].find(b=>b.textContent==="Export JSON").click()`);
            const packet = await browser.js(`[...${query}.querySelectorAll("textarea")].find(t=>t.readOnly).value`);
            assert.equal(JSON.parse(packet).packet.identity.catalogId, id);
            await browser.field(`${section} textarea`, packet);
            await browser.js(`[...${query}.querySelectorAll("button")].find(b=>b.textContent==="Replay packet").click()`);
            await browser.until(`${query}.querySelector(".result-hero")?.textContent.includes("${expected} °C")`);
            assert.equal(await browser.js('document.documentElement.scrollWidth <= innerWidth'), true);
            const violations = await browser.js('axe.run({runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}}).then(r=>r.violations.map(v=>v.id))');
            assert.deepEqual(violations, []);
            journeys.push({ id, width, result: expected, keyboardRefusalRecovery: true, scenarioCaptured: true, horizontalOverflow: false, axeViolations: violations });
        }
    }
    assert.deepEqual(browser.errors, []);
    assert.deepEqual(browser.network.filter(request => !request.allowed), []);
    console.log(JSON.stringify({ scope: 'loopback browser component fixture', journeys }, null, 2));
} catch (error) {
    console.error(browser?.errors);
    throw error;
} finally {
    try { await browser?.close(); } finally { await server.close(); }
}
