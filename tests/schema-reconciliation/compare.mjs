import {createHash} from 'node:crypto';
import {canonical, SECTIONS} from '../batch17-capture/descriptor.mjs';
export const fingerprint = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
// PostgreSQL allocates internal RI trigger names from local OIDs. Replace only
// that generated name, never arbitrary numbers or application SQL literals.
export function triggerSemantic(row) {
  if (!row.internal || !/^RI_ConstraintTrigger_[ac]_\d+$/.test(row.name)) return row;
  const {id, name, ...rest} = row;
  return {...rest, definition: row.definition.replace(new RegExp(`"${name}"`, 'g'), '"RI_GENERATED_NAME"')};
}
export function difference(model, hosted) {
  const sections = {};
  for (const section of SECTIONS) {
    const left = model.sections[section], right = hosted.sections[section];
    if (!left || !right || left.count !== left.rows.length || right.count !== right.rows.length) throw Error('Malformed capture');
    const index = rows => {
      const out = new Map(rows.map(row => [row.id, row]));
      if (out.size !== rows.length) throw Error('Duplicate identity');
      return out;
    };
    const a = index(left.rows), b = index(right.rows);
    sections[section] = {
      modelCount: a.size, hostedCount: b.size,
      modelStatus: left.status, hostedStatus: right.status,
      modelOnly: [...a.keys()].filter(id => !b.has(id)).sort(),
      hostedOnly: [...b.keys()].filter(id => !a.has(id)).sort(),
      changed: [...a.keys()].filter(id => b.has(id) && fingerprint(a.get(id)) !== fingerprint(b.get(id))).sort().map(id => ({
        id, fields: [...new Set([...Object.keys(a.get(id)), ...Object.keys(b.get(id))])].filter(key => fingerprint(a.get(id)[key] ?? null) !== fingerprint(b.get(id)[key] ?? null)).sort(),
        modelSha256: fingerprint(a.get(id)), hostedSha256: fingerprint(b.get(id)),
      })),
    };
  }
  const bag = rows => rows.map(row => fingerprint(triggerSemantic(row))).sort();
  const a = bag(model.sections.triggers.rows), b = bag(hosted.sections.triggers.rows);
  // Preserve multiplicity: a set would conceal duplicate equivalent triggers.
  const subtract = (left, right) => {const rest = [...right]; return left.filter(hash => {const i=rest.indexOf(hash); if(i<0)return true;rest.splice(i,1);return false;});};
  return {format:'calcumint-read-only-difference-v1', modelSha256:fingerprint(model), hostedSha256:fingerprint(hosted), sections,
    semanticTriggers:{modelOnly:subtract(a,b),hostedOnly:subtract(b,a)},
    equal:false, adoptionAuthorized:false, productionEquivalence:'UNKNOWN',
    warning:'Difference intake only. Does not replace strict 68-relation validation, authenticate input, prove migration effects or authorize adoption.'};
}
