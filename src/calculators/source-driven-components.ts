import {sumFinite, multiplyFinite, divideFinite} from './owner-model-support';
/** UNREGISTERED internal scenario arithmetic. No tax, lender, provider, retirement,
 * institutional eligibility or clinical policy. Callers supply disjoint cashflows,
 * selected units and timing. IEEE-754 results are unrounded; no display policy.
 * No registry/live calculator imports. Plain numeric utilities are reused; no ownerModel wrapper is invoked. All loops are bounded at 10,000 entries. */
interface Basis { currency: string; period: string }
const LIMIT = 10_000;
function finite(n: number): number {
  if (!Number.isFinite(n)) throw new RangeError('Nonfinite input or arithmetic overflow');
  return n;
}
function nonnegative(n: number): number {
  if (finite(n) < 0) throw new RangeError('Expected nonnegative value');
  return n;
}
function basis(b: Basis) {
  if (typeof b.currency !== 'string' || !b.currency.trim() || typeof b.period !== 'string' || !b.period.trim()) throw new RangeError('Explicit currency and period required');
}
function count(n: number) {
  if (!Number.isInteger(n) || n < 0 || n > LIMIT) throw new RangeError('Finite integer horizon/count must be 0..10000');
}
function rate(n: number) {
  if (finite(n) <= -1) throw new RangeError('Per-period fractional rate must exceed -1');
}
export interface SuppliedLedger extends Basis {
  horizon: number;
  /** Signed net outflows, each included once, at integer period boundaries 0..H.
   * Excludes terminal debt/asset, which are supplied separately below. */
  flows: readonly { at: number; outflow: number }[];
  terminalDebt: number;
  /** Net asset proceeds AFTER selling costs, BEFORE the separate debt payoff. */
  terminalAsset: number;
}
/** Positive difference means greater left scenario cost. Discount rate is a
 * scenario assumption per declared period, never an expected/guaranteed return. */
export function compareSuppliedLedgers(left: SuppliedLedger, right: SuppliedLedger, discountRate: number) {
  basis(left); basis(right); rate(discountRate);
  if (left.currency !== right.currency || left.period !== right.period || left.horizon !== right.horizon) throw new RangeError('Matched currency, period and horizon required');
  const pv = (s: SuppliedLedger) => {
    count(s.horizon); count(s.flows.length);
    const discount = (amount: number, at: number) => {
      const divisor = finite((1 + discountRate) ** at);
      if (divisor === 0) throw new RangeError('Discount underflow');
      return divideFinite(amount, divisor);
    };
    const terms: number[] = [];
    for (const f of s.flows) {
      count(f.at);
      if (f.at > s.horizon) throw new RangeError('Cashflow beyond horizon');
      terms.push(discount(f.outflow, f.at));
    }
    terms.push(discount(sumFinite([nonnegative(s.terminalDebt), -nonnegative(s.terminalAsset)]), s.horizon));
    return sumFinite(terms);
  };
  const l = pv(left), r = pv(right);
  return { left: l, right: r, difference: sumFinite([l,-r]) };
}
export interface SuppliedProjection extends Basis {
  initial: number;
  timing: 'begin' | 'end';
  /** Signed cashflow: deposits positive, requested withdrawals negative.
   * Rate is fractional effective return for this EXACT period. */
  steps: readonly { rate: number; cashflow: number }[];
}
/** Withdrawals are capped at available balance; no borrowing is invented.
 * null means no event WITHIN supplied horizon, never a sustainability claim.
 * Exact-zero is a post-period state; initial zero is reported as period 0. */
export function projectSuppliedBalance(p: SuppliedProjection) {
  basis(p); count(p.steps.length);
  if (p.timing !== 'begin' && p.timing !== 'end') throw new RangeError('Explicit timing required');
  let balance = nonnegative(p.initial);
  let exactZeroPeriod: number | null = balance === 0 ? 0 : null;
  let firstShortfallPeriod: number | null = null;
  for (let i=0; i<p.steps.length; i++) {
    const s = p.steps[i]; rate(s.rate); finite(s.cashflow);
    if (p.timing === 'end') balance = multiplyFinite(balance, (1+s.rate));
    if (s.cashflow < 0 && balance < -s.cashflow) {
      if (firstShortfallPeriod === null) firstShortfallPeriod = i+1;
      balance = 0;
    } else balance = sumFinite([balance,s.cashflow]);
    if (p.timing === 'begin') balance = multiplyFinite(balance, (1+s.rate));
    if (balance === 0 && exactZeroPeriod === null) exactZeroPeriod = i+1;
  }
  return {balance,exactZeroPeriod,firstShortfallPeriod};
}
/** Pure ratio: caller selects numerator/denominator definitions for same period. */
export function suppliedRatioPercent(p: Basis & {numerator: number; denominator: number}) {
  basis(p); finite(p.numerator);
  if (finite(p.denominator) <= 0) throw new RangeError('Positive denominator required');
  return multiplyFinite(divideFinite(p.numerator,p.denominator),100);
}
/** Total disclosed depreciation plus total rent charge divided by payment count.
 * Does not derive money factors, taxes, eligibility or rounded invoice amounts. */
export function suppliedLeaseBase(p: Basis & {capitalized:number; residual:number; rentCharge:number; payments:number}) {
  basis(p); count(p.payments);
  if (p.payments === 0) throw new RangeError('Positive payment count required');
  return divideFinite(sumFinite([nonnegative(p.capitalized),-nonnegative(p.residual),nonnegative(p.rentCharge)]),p.payments);
}
/** Useful heat and auxiliary kWh cover the SAME supplied period/system boundary.
 * Auxiliary input is EXTERNAL to SCOP (never include SCOP-covered energy twice).
 * Prices use currency/kWh; result uses currency/declared period. */
export function suppliedHeatSavings(p: Basis & {usefulHeatKWh:number; baselineEfficiency:number; scop:number; baselinePricePerKWh:number; heatPumpPricePerKWh:number; auxiliaryKWh:number}) {
  basis(p);
  if (finite(p.baselineEfficiency) <= 0 || p.baselineEfficiency > 1 || finite(p.scop) <= 0) throw new RangeError('Baseline efficiency (0,1] and positive SCOP required');
  const baseline = multiplyFinite(divideFinite(nonnegative(p.usefulHeatKWh),p.baselineEfficiency),nonnegative(p.baselinePricePerKWh));
  const electric = sumFinite([divideFinite(p.usefulHeatKWh,p.scop),nonnegative(p.auxiliaryKWh)]);
  return sumFinite([baseline,-multiplyFinite(electric,nonnegative(p.heatPumpPricePerKWh))]);
}
/** Generic dimensionless weighted mean. Caller supplies eligible mapped rows;
 * no grade-symbol mapping, repeat policy, scale or institutional rule inferred. */
export function suppliedWeightedMean(rows: readonly {value:number;weight:number}[]) {
  count(rows.length);
  const products: number[] = [], weights: number[] = [];
  for (const row of rows) {
    products.push(multiplyFinite(row.value,nonnegative(row.weight)));
    weights.push(row.weight);
  }
  const denominator = sumFinite(weights);
  if (denominator === 0) throw new RangeError('Positive total weight required');
  return divideFinite(sumFinite(products),denominator);
}

/** Supplied price algebra only: no jurisdiction, rate, taxability, exemption,
 * credit, shipping/base inclusion or invoice rounding policy selected. */
export function suppliedPriceFactor(p: Basis & {amount:number;rate:number;mode:'exclusive'|'inclusive'}) {
  basis(p); nonnegative(p.amount); nonnegative(p.rate);
  if (p.mode !== 'exclusive' && p.mode !== 'inclusive') throw new RangeError('Explicit price mode required');
  const net = p.mode === 'exclusive' ? p.amount : divideFinite(p.amount,sumFinite([1,p.rate]));
  const tax = multiplyFinite(net,p.rate);
  const gross = p.mode === 'inclusive' ? p.amount : sumFinite([net,tax]);
  return {net,tax,gross};
}

/** Review-binding metadata only, never entries in the canonical registry.
 * Candidate IDs indicate supplied-arithmetic reuse, NOT coverage/completion of
 * their pending methodology, source, applicability or qualified-review contracts. */
export const SUPPLIED_COMPONENT_CONTRACTS = [
  {id:'supplied-price-factor',version:'1.0.0',status:'UNREGISTERED',candidateIds:[125,126,127],units:'currency for supplied period; nonnegative supplied rate fraction',assumptions:['Explicit exclusive/inclusive price mode','Caller selects price base and rate; no jurisdiction, taxability or eligibility inferred','Unrounded algebra only, not a legal tax engine'],limits:'Nonnegative finite amount/rate; finite intermediates; nonzero multiply/divide underflow rejected'},
  {id:'supplied-ledger-comparison',version:'1.0.0',status:'UNREGISTERED',candidateIds:[21,32,36,43,46,49,80,198,199,468,470,472],units:'currency; fractional effective rate per declared period; integer period boundary',assumptions:['Caller supplies disjoint signed net cashflows; terminal asset/debt excluded from flows','Identical currency, period and finite horizon; no tax/provider/inclusion rules selected','Terminal asset is after selling costs before debt payoff; no automatic fee/refund assessment'],limits:'0..10000 periods and entries; rate > -1; finite intermediates; unrounded IEEE-754'},
  {id:'supplied-balance-projection',version:'1.0.0',status:'UNREGISTERED',candidateIds:[81,84,85,86],units:'currency; fractional effective return per explicit period',assumptions:['Explicit begin/end cashflow timing and every period return/cashflow supplied','Deposits positive; withdrawals capped at available balance','Zero/shortfall events within supplied horizon only; not retirement safety'],limits:'0..10000 steps; nonnegative initial balance; rates > -1; no annual/monthly conversion or inflation selection'},
  {id:'supplied-ratio-percent',version:'1.0.0',status:'UNREGISTERED',candidateIds:[43,134],units:'percent from same-period, same-currency quantities',assumptions:['Caller defines and supplies numerator and strictly positive denominator','No statutory effective-rate or return-denominator definition'],limits:'finite inputs/intermediates; unrounded IEEE-754'},
  {id:'supplied-lease-base',version:'1.0.0',status:'UNREGISTERED',candidateIds:[469],units:'currency per declared payment period',assumptions:['Disclosed total rent charge, capitalized cost, residual and payment count supplied','No inferred money factor, tax, fees or invoice rounding'],limits:'1..10000 payments; nonnegative components; finite intermediates'},
  {id:'supplied-heat-balance',version:'1.0.0',status:'UNREGISTERED',candidateIds:[488],units:'currency per declared period from useful heat kWh and currency/kWh',assumptions:['Matched heat demand/system boundary/tariff period','Auxiliary electricity explicitly external to SCOP','No eligibility or installed savings claim'],limits:'baseline efficiency (0,1]; SCOP > 0; nonnegative heat, prices and auxiliary kWh; finite intermediates'},
  {id:'supplied-weighted-mean',version:'1.0.0',status:'UNREGISTERED',candidateIds:[516],units:'dimensionless points weighted by caller-selected eligible units',assumptions:['Caller supplies eligible grade point mappings and weights','No institution, symbol, repeat, temporary grade or program policy inferred'],limits:'0..10000 rows; nonnegative weights with positive sum; finite intermediates'},
] as const;
