import {readFileSync} from 'node:fs';import {it,expect} from 'vitest';import {factoryDeliveryCatalog} from './factory-delivery-catalog';
const source=readFileSync('docs/completion-first-20261112/automation/contract-successor.sql','utf8');
const reverse=readFileSync('docs/completion-first-20261112/automation/contract-reverse.sql','utf8');
it('held exact-preimage successor extends job tuples without rewriting embed tables or authority/quota/worker',()=>{
 expect(source).toContain("RAISE EXCEPTION 'UNAPPLIED_FACTORY_NINE_AUTOMATION_SUCCESSOR'");
 expect(source).toContain("1a371a13355af3b186659076489269a887749f8d45c65e27610fd556628b8d85");
 for(const row of factoryDeliveryCatalog)expect(source).toContain(`(${row.catalogId},'${row.engineId}',1)`);
 expect(source).not.toMatch(/ALTER TABLE public\.technology_five_embed_(grants|usage)/);
 expect(source).toContain("(383,'technology.website-bandwidth',2)");
 expect(source).toContain('public.consume_native_business_api_quota_v1(p_api_key_id)');
 expect(source).toContain('public.technology_five_key_authority_v1');
 expect(source).toContain('INSERT INTO public.technology_five_webhook_outbox');
 expect(source).not.toContain('CREATE TABLE');
});
it('reverse pins function source and refuses deleting retained factory history',()=>{
 expect(reverse).toContain("RAISE EXCEPTION 'UNAPPLIED_FACTORY_NINE_AUTOMATION_REVERSE'");
 expect(reverse).toContain('SELECT prosrc FROM pg_proc');
 expect(reverse).toContain('Retained factory history requires forward compatibility; reverse refused');
 expect(reverse).not.toMatch(/DELETE FROM|TRUNCATE/);
});

it('binds signed JSON bytes and normalized immutable snapshot back to original submitted rows',()=>{
 expect(source).toContain('d.payload_text::jsonb=d.payload');
 expect(source).toContain("j.payload->'rows'=j.input_rows");
 expect(source).toContain("j.payload->'catalogId'=to_jsonb(j.catalog_id)");
 expect(source).toContain("j.payload->'version'=to_jsonb(j.technical_version)");
});
