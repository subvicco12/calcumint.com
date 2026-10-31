/** Private local review persistence. Existing authenticated account/RLS storage remains unchanged. */
import { copyCalculationData } from './calculation-snapshot';
import { getPlanEntitlements, type CalcuMintPlan } from './entitlements';
import { importCanonicalCalculation } from '../calculators/canonical-calculus-workflow';
import { importPrivateCalculus } from '../calculators/private-calculus-successor';
export const CANONICAL_HISTORY_KEY = 'calcumint-private-calculus-versioned-history';
export type CanonicalHistoryRecord = ReturnType<typeof importCanonicalCalculation> | ReturnType<typeof importPrivateCalculus>;
export type HistoryStorage = Pick<Storage, 'getItem' | 'setItem'>;
function decodeSnapshot(value: unknown): CanonicalHistoryRecord { const raw = copyCalculationData({ value }, {}).input.value; if (!raw || typeof raw !== 'object')
    throw Error('Invalid history'); const version = (raw as {
    calculation?: {
        calculatorVersion?: unknown;
    };
}).calculation?.calculatorVersion; if (version === 3)
    return importCanonicalCalculation(raw); if (version === 2)
    return importPrivateCalculus(raw); throw Error('Unsupported historical version; stored data left unchanged'); }
export function readCanonicalHistory(storage: HistoryStorage): {
    records: readonly CanonicalHistoryRecord[];
    writable: boolean;
    error: string | null;
} { try {
    const raw = storage.getItem(CANONICAL_HISTORY_KEY);
    if (!raw)
        return { records: [], writable: true, error: null };
    if (raw.length > 8000000)
        throw Error('Local history resource bound');
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length > 200)
        throw Error('Local history resource bound');
    return { records: Object.freeze(parsed.map(decodeSnapshot)), writable: true, error: null };
}
catch {
    return { records: [], writable: false, error: 'Stored history is unavailable, unsupported or altered. Original data was not deleted; clear explicitly before writing.' };
} }
export function appendCanonicalHistory(storage: HistoryStorage, raw: unknown, plan: CalcuMintPlan) { if (!['free', 'pro', 'business'].includes(plan))
    throw Error('Unknown review plan'); const previous = readCanonicalHistory(storage); if (!previous.writable)
    throw Error(previous.error!); const limit = getPlanEntitlements(plan).historyLimit; if (limit !== null && previous.records.length >= limit)
    throw Error('Current plan history limit reached; existing historical results remain readable.'); if (previous.records.length >= 200)
    throw Error('Local reviewer resource capacity200; no automatic history deletion.'); const rows = Object.freeze([decodeSnapshot(raw), ...previous.records]); const text = JSON.stringify(rows); if (text.length > 8000000)
    throw Error('Local reviewer storage resource bound'); storage.setItem(CANONICAL_HISTORY_KEY, text); return rows; }
export function clearCanonicalHistory(storage: HistoryStorage) { storage.setItem(CANONICAL_HISTORY_KEY, '[]'); return Object.freeze([]) as readonly CanonicalHistoryRecord[]; }
