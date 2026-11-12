import {sanitizeText,sanitizeEvidence} from '../five-native-auth-20261109/evidence-sanitizer.mjs';
// Execution credentials remain in memory. Persist only redacted evidence or hashes.
const credentials=new Set();
export function registerCredentials(...values){for(const value of values.flat())if(typeof value==='string'&&value.length>=8)credentials.add(value);}
export function redactText(value){let text=String(value);for(const credential of credentials)text=text.split(credential).join('[REDACTED_CREDENTIAL]');return sanitizeText(text.replace(/((?:\/api\/native-embed\/|\/embed\/native\/))[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,'$1[REDACTED_SIGNED_GRANT]'));}
export const evidenceJSON=value=>redactText(sanitizeEvidence(JSON.stringify(value)));
