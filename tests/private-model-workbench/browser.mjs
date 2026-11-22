import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import { startBrowser } from '../next-runtime/cdp.mjs';

const require = createRequire(import.meta.url);
const axe = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const cases = [
    [173, 'private.business.customer-lifetime-value@1', {
        currency: 'USD', acquisitionCost: '20', discountPerPeriod: '0.25',
        'periods.0.activityProbability': '0.5', 'periods.0.revenueIfActive': '100',
        'periods.0.costIfActive': '20', 'periods.0.unconditionalCost': '5',
    }, 'discountPerPeriod', '-1', '8 USD'],
    [204, 'private.business.return-rate-impact@1', {
        currency: 'USD', sales: '100', price: '50', saleCost: '20', refund: '50',
        returnHandling: '4', incrementalReturnFee: '1', recoveredInventoryValue: '15', eligibleInventoryCost: '15',
        beforeRate: '0.1', afterRate: '0.2',
    }, 'refund', '50.000001', '-400 USD'],
    [485, 'private.environment.supplied-factor-carbon-footprint@1', {
        reportingPeriod: '2026', boundary: 'Fixture', 'activities.0.id': 'electricity',
        'activities.0.quantity': '1000', 'activities.0.unit': 'kWh',
        'activities.0.factor.kgCO2ePerUnit': '0.13096', 'activities.0.factor.perUnit': 'kWh',
        'activities.0.factor.sourceReference': 'Fixture', 'activities.0.factor.sourceVersion': '1',
    }, 'activities.0.factor.perUnit', 'MWh', '130.96 kg CO₂e'],
    [522, 'private.sports.supplied-exponent-race-time@1', {
        referenceDistanceMetres: '5000', targetDistanceMetres: '10000',
        referenceTimeSeconds: '1500', exponent: '2', calibrationReference: 'Fixture',
    }, 'referenceDistanceMetres', '1000000.00000000001', '6000 seconds'],
];
const server = await createServer({
    configFile: false,
    esbuild: { jsx: 'automatic' },
    server: { host: '127.0.0.1', port: 0, hmr: false },
});
let browser;
const journeys = [];
try {
    await server.listen();
    const origin = server.resolvedUrls.local[0].replace(/\/$/, '');
    browser = await startBrowser(origin);
    for (const width of [360, 1440]) {
        await browser.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width === 360 });
        await browser.visit('/tests/private-model-workbench/');
        await browser.until('!!document.querySelector("form")');
        await browser.js(axe);
        for (const [id, engine, inputs, invalid, bad, expected] of cases) {
            await browser.js(`(() => {
                const selector = document.querySelector('section > select');
                selector.value = '${id}';
                selector.dispatchEvent(new Event('change', { bubbles: true }));
            })()`);
            await browser.until(`document.querySelector('code')?.textContent === ${JSON.stringify(engine)}`);
            for (const [field, value] of Object.entries(inputs)) await browser.field(`input[name="${field}"]`, value);
            const enter = async () => {
                for (const type of ['keyDown', 'keyUp']) {
                    await browser.send('Input.dispatchKeyEvent', {
                        type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13,
                        ...(type === 'keyDown' ? { text: '\r' } : {}),
                    });
                }
            };
            if (id === 204) {
                await enter();
                const confirmation = 'input[name=returnCostsConfirmed]';
                await browser.until(`document.querySelector('${confirmation}').getAttribute('aria-invalid') === 'true'`);
                assert.equal(await browser.js('document.querySelector("[role=status]").textContent'), '');
                for (const selector of [confirmation, 'input[name=refundablePriceConfirmed]']) {
                    await browser.js(`document.querySelector('${selector}').focus()`);
                    for (const type of ['keyDown', 'keyUp']) {
                        await browser.send('Input.dispatchKeyEvent', { type, key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
                    }
                    assert.equal(await browser.js(`document.querySelector('${selector}').checked`), true);
                }
            }
            await browser.field(`input[name="${invalid}"]`, bad);
            await enter();
            await browser.until('!!document.querySelector("[role=alert]")');
            assert.equal(await browser.js('document.querySelector("[role=status]").textContent'), '');
            assert.equal(await browser.js(`document.querySelector('input[name="${invalid}"]').getAttribute('aria-invalid')`), 'true');
            await browser.field(`input[name="${invalid}"]`, inputs[invalid]);
            await enter();
            await browser.until(`document.querySelector('[role=status]').textContent.includes(${JSON.stringify(expected)})`);
            if (id === 173) {
                assert((await browser.js('document.querySelector("[role=status]").textContent')).includes('No display rounding applied.'));
            }
            assert.equal(await browser.js('document.documentElement.scrollWidth <= innerWidth'), true);
            const violations = await browser.js('axe.run({runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}}).then(r=>r.violations.map(v=>v.id))');
            assert.deepEqual(violations, []);
            journeys.push({ id, width, engine, result: expected, keyboardRefusalRecovery: true, exactDisclosureVerified: id === 173, nonOverlapConfirmationVerified: id === 204, horizontalOverflow: false, axeViolations: violations });
        }
    }
    assert.deepEqual(browser.errors, []);
    assert.deepEqual(browser.network.filter(request => !request.allowed), []);
    console.log(JSON.stringify({ scope: 'loopback browser component fixture', journeys }, null, 2));
} finally {
    try { await browser?.close(); } finally { await server.close(); }
}
