import { z } from 'zod';
import { add, decimal, divide, formatRational, multiply, rational, subtract, zero } from '../exact-rational';

const amount = z.string().max(19).regex(/^(0|[1-9]\d{0,11})(\.\d{1,6})?$/);
const fraction = z.string().max(8).regex(/^(?:0(?:\.\d{1,6})?|1(?:\.0{1,6})?)$/);
const discount = z.string().max(20).regex(/^-?(?:0|[1-9]\d{0,11})(?:\.\d{1,6})?$/)
    .refine(value => Number(value) > -1, 'Discount per period must exceed −1.');
const currency = z.string().regex(/^[A-Z]{3}$/);
const one = rational(1n);

const lifetimeValueInput = z.object({
    currency,
    period: z.enum(['week', 'month', 'quarter', 'year']),
    acquisitionCost: amount,
    discountPerPeriod: discount,
    periods: z.array(z.object({
        activityProbability: fraction,
        revenueIfActive: amount,
        costIfActive: amount,
        unconditionalCost: amount,
    }).strict()).max(60),
}).strict();

const returnImpactInput = z.object({
    currency,
    sales: z.number().int().min(0).max(1_000_000_000),
    price: amount,
    saleCost: amount,
    refund: amount,
    returnHandling: amount,
    incrementalReturnFee: amount,
    recoveredInventoryValue: amount,
    beforeRate: fraction,
    afterRate: fraction,
}).strict();

/** Private engineering candidate for #173, scoped to explicitly supplied cohort assumptions. */
export const cohortLifetimeValue = {
    id: 'private.business.customer-lifetime-value',
    version: 1,
    masterId: 173,
    inputSchema: lifetimeValueInput,
    methodology: 'Discount expected end-of-period contribution and subtract acquisition cost once at time zero. All amounts are per original customer. The model infers neither churn nor terminal value.',
    calculate(raw: unknown) {
        const input = lifetimeValueInput.parse(raw);
        const rate = input.discountPerPeriod;
        const factor = rate.startsWith('-') ? subtract(one, decimal(rate.slice(1))) : add(one, decimal(rate));
        let discountPower = one;
        let presentValue = zero;
        for (const period of input.periods) {
            discountPower = multiply(discountPower, factor);
            const activeContribution = subtract(decimal(period.revenueIfActive), decimal(period.costIfActive));
            const expectedContribution = subtract(
                multiply(decimal(period.activityProbability), activeContribution),
                decimal(period.unconditionalCost),
            );
            presentValue = add(presentValue, divide(expectedContribution, discountPower));
        }
        return {
            currency: input.currency,
            value: formatRational(subtract(presentValue, decimal(input.acquisitionCost))),
        };
    },
} as const;

/** Private engineering candidate for #204, with a fixed sales and cost basis across scenarios. */
export const returnRateImpact = {
    id: 'private.business.return-rate-impact',
    version: 1,
    masterId: 204,
    inputSchema: returnImpactInput,
    methodology: 'Compare expected contribution on the same sales cohort. Charge only incremental return fees. Recovered inventory offsets return cost without being counted as cash revenue.',
    calculate(raw: unknown) {
        const input = returnImpactInput.parse(raw);
        const sales = rational(BigInt(input.sales));
        const base = multiply(sales, subtract(decimal(input.price), decimal(input.saleCost)));
        const returnCost = subtract(
            add(add(decimal(input.refund), decimal(input.returnHandling)), decimal(input.incrementalReturnFee)),
            decimal(input.recoveredInventoryValue),
        );
        const projected = (rate: string) => subtract(base, multiply(multiply(sales, decimal(rate)), returnCost));
        const before = projected(input.beforeRate);
        const after = projected(input.afterRate);
        return {
            currency: input.currency,
            beforeContribution: formatRational(before),
            afterContribution: formatRational(after),
            impact: formatRational(subtract(after, before)),
        };
    },
} as const;
