/** Internal revision3: exact rational functions plus the immutable analytic-v2 fallback. */
import { z } from 'zod';
import { parseExpression, type ExprNode } from './advanced-math/expression-engine';
import { rational, add, subtract, multiply, formatRational, type Rational } from './exact-rational';
import { exportPrivateCalculus } from './private-calculus-successor';
const R = (n: bigint, d = 1n) => { if (d === 0n)
    throw Error('Zero denominator'); const r = rational(d < 0n ? -n : n, d < 0n ? -d : d); if (BigInt(r.numerator).toString(2).length > 4096 || BigInt(r.denominator).toString(2).length > 4096)
    throw Error('Exact coefficient bit budget exceeded'); return r; };
const A = (a: Rational, b: Rational) => { const r = add(a, b); return R(BigInt(r.numerator), BigInt(r.denominator)); }, S = (a: Rational, b: Rational) => { const r = subtract(a, b); return R(BigInt(r.numerator), BigInt(r.denominator)); }, M = (a: Rational, b: Rational) => { const r = multiply(a, b); return R(BigInt(r.numerator), BigInt(r.denominator)); }, D = (a: Rational, b: Rational) => R(BigInt(a.numerator) * BigInt(b.denominator), BigInt(a.denominator) * BigInt(b.numerator));
const zero = R(0n), one = R(1n), isZero = (r: Rational) => r.numerator === '0';
export function parseExactDecimal(s: string): Rational {
    if (s.length > 100)
        throw Error('Decimal literal resource bound');
    const m = s.match(/^([+-]?)(\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?\d+))?$/);
    if (!m)
        throw Error('Exact decimal string required');
    const e = Number(m[3] ?? 0), [w, f = ''] = m[2].split('.');
    if (Math.abs(e) > 256 || (w + f).length > 64)
        throw Error('Decimal precision/exponent resource bound');
    const scale = f.length - e, n = BigInt((m[1] === '-' ? '-' : '') + (w + f));
    return scale >= 0 ? R(n, 10n ** BigInt(scale)) : R(n * 10n ** BigInt(-scale));
}
export const calculusCoordinateSchema = z.string().max(40).regex(/^-?(?:0|[1-9]\d*)(?:\.\d{1,18})?$/).refine(s => { try {
    const r = parseExactDecimal(s);
    const n = BigInt(r.numerator);
    return (n < 0n ? -n : n) <= 1000000n * BigInt(r.denominator);
}
catch {
    return false;
} }, { message: 'Finite decimal coordinate within±1000000' });
const expression = z.string().min(1).max(500);
export const canonicalCalculusInputSchema = z.discriminatedUnion('operation', [
    z.object({ operation: z.literal('derivative'), expression, x: calculusCoordinateSchema }).strict(),
    z.object({ operation: z.literal('limit'), expression, x: calculusCoordinateSchema, direction: z.enum(['both', 'left', 'right']).default('both') }).strict(),
    z.object({ operation: z.literal('integral'), expression, lower: calculusCoordinateSchema, upper: calculusCoordinateSchema }).strict()
]);
export type CanonicalCalculusInput = z.infer<typeof canonicalCalculusInputSchema>;
type Poly = Rational[];
type FunctionData = {
    n: Poly;
    d: Poly;
    holes: Poly[];
    polynomialIntegral: boolean;
};
class NonRational extends Error {
}
const trim = (p: Poly) => { while (p.length > 1 && isZero(p.at(-1)!))
    p.pop(); return p; };
const pAdd = (a: Poly, b: Poly, negative = false) => trim(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => negative ? S(a[i] ?? zero, b[i] ?? zero) : A(a[i] ?? zero, b[i] ?? zero)));
const pMul = (a: Poly, b: Poly) => { if (a.length + b.length - 2 > 32)
    throw Error('Polynomial degree resource bound32'); const p = Array.from({ length: a.length + b.length - 1 }, () => zero); for (let i = 0; i < a.length; i++)
    for (let j = 0; j < b.length; j++)
        p[i + j] = A(p[i + j], M(a[i], b[j])); return trim(p); };
const pEval = (p: Poly, x: Rational) => p.reduceRight((s, c) => A(M(s, x), c), zero), pDerivative = (p: Poly) => p.length === 1 ? [zero] : p.slice(1).map((c, i) => M(c, R(BigInt(i + 1))));
const hasVariable = (n: ExprNode): boolean => n.kind === 'variable' || n.kind === 'unary' && hasVariable(n.arg) || n.kind === 'binary' && (hasVariable(n.left) || hasVariable(n.right)) || n.kind === 'call' && hasVariable(n.arg);
function exactFunction(ast: ExprNode, text: string): FunctionData {
    if (/\b(?!x\b)[A-Za-z]+\b/.test(text.replace(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/g, '')))
        throw new NonRational('Analytic function/constant');
    const literals = [...text.matchAll(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/g)].map(m => parseExactDecimal(m[0]));
    let cursor = 0, nodes = 0;
    function walk(n: ExprNode): FunctionData {
        if (++nodes > 512)
            throw Error('Expression node budget exceeded');
        if (n.kind === 'number') {
            const c = literals[cursor++];
            if (!c)
                throw new NonRational('Nondecimal constant');
            return { n: [c], d: [one], holes: [], polynomialIntegral: true };
        }
        if (n.kind === 'variable')
            return { n: [zero, one], d: [one], holes: [], polynomialIntegral: true };
        if (n.kind === 'call')
            throw new NonRational('Analytic function');
        if (n.kind === 'unary') {
            const a = walk(n.arg);
            return { ...a, n: n.op === '-' ? a.n.map(c => S(zero, c)) : a.n };
        }
        const a = walk(n.left), b = walk(n.right), holes = [...a.holes, ...b.holes], eligible = a.polynomialIntegral && b.polynomialIntegral;
        if (n.op === '+')
            return { n: pAdd(pMul(a.n, b.d), pMul(b.n, a.d)), d: pMul(a.d, b.d), holes, polynomialIntegral: eligible };
        if (n.op === '-')
            return { n: pAdd(pMul(a.n, b.d), pMul(b.n, a.d), true), d: pMul(a.d, b.d), holes, polynomialIntegral: eligible };
        if (n.op === '*')
            return { n: pMul(a.n, b.n), d: pMul(a.d, b.d), holes, polynomialIntegral: eligible };
        if (n.op === '/') {
            if (b.n.every(isZero))
                throw Error('Identically zero divisor');
            return { n: pMul(a.n, b.d), d: pMul(a.d, b.n), holes: [...holes, b.n], polynomialIntegral: eligible && !hasVariable(n.right) };
        }
        if (hasVariable(n.right) || b.n.length !== 1 || b.d.length !== 1)
            throw new NonRational('Nonconstant exponent');
        const exponent = D(b.n[0], b.d[0]);
        if (exponent.denominator !== '1')
            throw new NonRational('Noninteger exponent');
        const k = Number(exponent.numerator);
        if (Math.abs(k) > 32)
            throw Error('Exponent resource bound32');
        if (k < 0 && a.n.every(isZero))
            throw Error('Zero negative power');
        if (k === 0 && a.n.every(isZero))
            throw Error('Indeterminate zero power');
        let pn = [one], pd = [one];
        for (let i = 0; i < Math.abs(k); i++) {
            pn = pMul(pn, k < 0 ? a.d : a.n);
            pd = pMul(pd, k < 0 ? a.n : a.d);
        }
        return { n: pn, d: pd, holes: k < 0 ? [...holes, a.n] : holes, polynomialIntegral: eligible && (k >= 0 || !hasVariable(n.left)) };
    }
    const r = walk(ast);
    if (cursor !== literals.length)
        throw Error('Literal alignment mismatch');
    return r;
}
function firstTaylor(p: Poly, x: Rational) { let q = p, order = 0; while (true) {
    const value = pEval(q, x);
    if (!isZero(value))
        return { order, value };
    if (q.length === 1)
        return null;
    q = pDerivative(q);
    order++;
} }
const finiteOutput = (r: Rational, method: string) => ({ classification: 'finite' as const, value: formatRational(r), exact: r, arithmetic: 'exact-rational' as const, method, warning: 'Exact relative to supplied decimal literals; no display rounding.' });
function computeCanonicalCalculus(raw: unknown) {
    const input = canonicalCalculusInputSchema.parse(raw), ast = parseExpression(input.expression);
    let f: FunctionData;
    try {
        f = exactFunction(ast, input.expression);
    }
    catch (error) {
        if (!(error instanceof NonRational))
            throw error;
        if (input.operation === 'integral')
            throw Error('Only polynomial integrals; no arbitrary quadrature error claim');
        const x = parseExactDecimal(input.x), number = Number(input.x);
        if (formatRational(parseExactDecimal(String(number))) !== formatRational(x))
            throw Error('Analytic coordinate conversion loses supplied precision');
        for (const m of input.expression.matchAll(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/g))
            if (formatRational(parseExactDecimal(m[0])) !== formatRational(parseExactDecimal(String(Number(m[0])))))
                throw Error('Analytic literal conversion loses supplied precision');
        const s = exportPrivateCalculus({ operation: input.operation, expression: input.expression, x: number });
        const value = String(s.calculation.output.value);
        return { classification: 'finite' as const, value, exact: null, arithmetic: 'binary64-analytic' as const, method: 'Immutable analytical revision2 dependency', warning: 'Binary64 approximation; no rigorous roundoff bound. Unsupported boundary/removable analytic cases reject.' };
    }
    if (input.operation === 'integral') {
        if (!f.polynomialIntegral || f.d.length !== 1)
            throw Error('Only syntactic polynomial integrals with constant denominators; no singular extension inferred');
        const lower = parseExactDecimal(input.lower), upper = parseExactDecimal(input.upper), coefficients = f.n.map(c => D(c, f.d[0]));
        const primitive = (x: Rational) => { let total = zero, power = x; for (let k = 0; k < coefficients.length; k++) {
            total = A(total, D(M(coefficients[k], power), R(BigInt(k + 1))));
            power = M(power, x);
        } return total; };
        return finiteOutput(S(primitive(upper), primitive(lower)), 'Exact polynomial power-rule antiderivative');
    }
    const x = parseExactDecimal(input.x), n = pEval(f.n, x), d = pEval(f.d, x);
    if (input.operation === 'derivative') {
        if (isZero(d) || f.holes.some(h => isZero(pEval(h, x))))
            throw Error('Original expression undefined at derivative point');
        return finiteOutput(D(S(M(pEval(pDerivative(f.n), x), d), M(n, pEval(pDerivative(f.d), x))), M(d, d)), 'Exact rational quotient/power rules; original holes retained');
    }
    const nt = firstTaylor(f.n, x), dt = firstTaylor(f.d, x);
    if (!dt)
        throw Error('Identically undefined denominator');
    if (!nt)
        return finiteOutput(zero, 'Exact zero numerator on punctured domain');
    if (nt.order > dt.order)
        return finiteOutput(zero, 'Exact polynomial vanishing orders');
    if (nt.order === dt.order)
        return finiteOutput(D(nt.value, dt.value), 'Exact derivative-order cancellation; factorial factors cancel');
    const right = BigInt(nt.value.numerator) * BigInt(dt.value.numerator) > 0n ? 1 : -1, left = (dt.order - nt.order) % 2 ? -right : right, sign = input.direction === 'left' ? left : input.direction === 'right' ? right : left === right ? left : 0;
    return { classification: sign === 0 ? 'does-not-exist' as const : sign > 0 ? 'positive-infinity' as const : 'negative-infinity' as const, value: sign === 0 ? 'Does not exist' : sign > 0 ? '+∞' : '−∞', exact: null, arithmetic: 'exact-rational' as const, method: 'Exact leading-order sign/parity on requested side(s)', warning: sign === 0 ? 'Left and right limits disagree; no finite result.' : 'Unbounded limit, not a finite numerical answer.' };
}
export const canonicalCalculusOutputSchema = z.object({ classification: z.enum(['finite', 'positive-infinity', 'negative-infinity', 'does-not-exist']), value: z.string().min(1).max(8192), exact: z.object({ numerator: z.string().regex(/^-?(0|[1-9]\d*)$/).max(1300), denominator: z.string().regex(/^[1-9]\d*$/).max(1300) }).strict().nullable(), arithmetic: z.enum(['exact-rational', 'binary64-analytic']), method: z.string().min(1), warning: z.string().min(1) }).strict().refine(o => o.classification === 'finite' ? (o.exact !== null ? o.arithmetic === 'exact-rational' && formatRational(o.exact) === o.value : o.arithmetic === 'binary64-analytic' && Number.isFinite(Number(o.value))) : o.exact === null && o.value === (o.classification === 'positive-infinity' ? '+∞' : o.classification === 'negative-infinity' ? '−∞' : 'Does not exist'), { message: 'Output classification, exact value and arithmetic must agree' });
export function runCanonicalCalculus(raw: unknown) { return canonicalCalculusOutputSchema.parse(computeCanonicalCalculus(raw)); }
export const canonicalCalculusContract = Object.freeze({ relatedCatalogIds: Object.freeze([246, 247, 248]), engineId: 'private.canonical-calculus', version: 3, inputs: 'Strict operation/expression/decimal-coordinate schemas; limit direction explicit. Decimal coefficients<=64digits/exponents±256; coordinates±1000000/18decimal places; each intermediate polynomial degree/power<=32; coefficient4096bits.', rounding: 'Exact rational results use terminating decimal or reduced fraction strings; no invented rounding. Analytic fallback is explicitly binary64.', domain: 'Rational functions for exact derivatives and finite/directional/removable/pole limits; original derivative holes retained. Polynomial-only oriented integrals; no variable denominators/cancelled-hole integration. Nonrational derivative/continuous-limit methods delegate immutablev2.', sources: 'Algebraic differentiation and polynomial power rule; exact vanishing-order limit theorem. Internal derivations and independently authored exact goldens; not provider/regulatory rules.', limitations: 'General transcendental removable limits, boundary analytic limits and non-polynomial integration remain unsupported engineering scope. No sampled proof, certified error bound, canonical acceptance, certification or publication.' });
