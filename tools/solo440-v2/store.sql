-- ISOLATED SUCCESSOR SCHEMA: never apply to production or an unapproved hosted store.
-- SQL execution qualification remains gated on an authorized disposable endpoint.
-- Policy aa6b7a18 admits no hosted live authority endpoint: this store is QUALIFICATION ONLY.
BEGIN;
CREATE SCHEMA solo440_crypto;
CREATE EXTENSION pgcrypto WITH SCHEMA solo440_crypto;
CREATE SCHEMA solo440;
REVOKE ALL ON SCHEMA solo440 FROM PUBLIC;
CREATE ROLE solo440_executor LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
CREATE TABLE solo440.claims (
 run_id text NOT NULL,
 attempt integer NOT NULL CHECK(attempt=1),
 nonce text NOT NULL UNIQUE,
 grant_sha256 text NOT NULL UNIQUE,
 grant_text text NOT NULL,
 claimed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 receipt jsonb,
 receipted_at timestamptz,
 PRIMARY KEY(run_id,attempt),
 CHECK((receipt IS NULL)=(receipted_at IS NULL))
);
REVOKE ALL ON solo440.claims FROM PUBLIC,solo440_executor;
CREATE FUNCTION solo440.canonical_flat(j jsonb) RETURNS text
LANGUAGE sql IMMUTABLE STRICT SET search_path=pg_catalog AS $$
 SELECT '{'||string_agg(to_json(key)::text||':'||value::text,',' ORDER BY key COLLATE "C")||'}' FROM jsonb_each(j)
$$;
CREATE FUNCTION solo440.validate_grant(t text) RETURNS jsonb
LANGUAGE plpgsql SET search_path=pg_catalog AS $$
DECLARE g jsonb:=t::jsonb; k text; issued bigint; expires bigint; now_seconds bigint:=floor(extract(epoch FROM clock_timestamp()));
BEGIN
 IF (jsonb_typeof(g)='object' AND g ?& ARRAY['runId','nonce','issuedAt','expiresAt','executor','executorTree','evidenceSha256','productDispositionSha256','applicabilitySha256','storeIdentity','mode'] AND (g-ARRAY['runId','nonce','issuedAt','expiresAt','executor','executorTree','evidenceSha256','productDispositionSha256','applicabilitySha256','storeIdentity','mode'])='{"action":"source-only","activation":false,"adoptionComment":"doco.yCW4dzFjM3eDgvrRWjBNVA","amendmentSha256":"62c30cc17ad5b9a87e57bb2e91a5ee2b25bbcfd3d9fe3c3e7f1775a99cd8475a","attempt":1,"basis":"authenticated-owner-acceptance-under-adopted-amendment","candidate":"1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e","engineBlob":"d8f5cb0153a0ae773c0fbd0dd9c999ae8cfb96a3","nominationSha256":"aef727afa4234c4e0e7c6db84bfa312e85696ac655513d3cd6b10a2d829af449","ownerSubject":"115201266201052505736","policyBlob":"642d25f770b334a13419c4466d81f17aabff0aae","policyCommit":"aa6b7a18f8dd89c6d4cf01a3aa1514a1c5a5f5ff","policySha256":"16564fc8612e87a282195193e539b5e9d44d2fd94c88f9ee9b6ea9f19c73008c","repository":"subvicco12/calcumint.com","schema":"calcumint.singleton440.single-owner-grant.v2","sourceArchiveSha256":"6fcfdf70a0e08004e4c7df76a1417b905b166a97cb7f5bba7b2adcf592ca4a72","tree":"209982b9a81d7bf9f4783228505b5a274563391f"}'::jsonb) IS DISTINCT FROM TRUE THEN RAISE EXCEPTION 'Exact grant fields or policy differ'; END IF;
 IF solo440.canonical_flat(g)<>t OR g->>'attempt'<>'1' THEN RAISE EXCEPTION 'Noncanonical or nonintegral attempt'; END IF;
 FOREACH k IN ARRAY ARRAY['runId','nonce','executor','executorTree','evidenceSha256','productDispositionSha256','applicabilitySha256','storeIdentity','mode'] LOOP
  IF jsonb_typeof(g->k) IS DISTINCT FROM 'string' THEN RAISE EXCEPTION 'String field type differs'; END IF;
 END LOOP;
 FOREACH k IN ARRAY ARRAY['executor','executorTree'] LOOP
  IF coalesce(g->>k,'') !~ '^[0-9a-f]{40}$' THEN RAISE EXCEPTION 'Executor identity malformed'; END IF;
 END LOOP;
 FOREACH k IN ARRAY ARRAY['evidenceSha256','productDispositionSha256','applicabilitySha256'] LOOP
  IF coalesce(g->>k,'') !~ '^[0-9a-f]{64}$' THEN RAISE EXCEPTION 'Evidence identity malformed'; END IF;
 END LOOP;
 IF coalesce(g->>'runId','') !~ '^[1-9][0-9]{0,19}$' OR coalesce(g->>'nonce','') !~ '^[0-9a-f]{32}$' OR coalesce(g->>'storeIdentity','') !~ '^[A-Za-z0-9._:/-]{1,200}$' OR coalesce(g->>'mode','') <> 'disposable-qualification' THEN RAISE EXCEPTION 'Run, nonce or store differs'; END IF;
 IF jsonb_typeof(g->'issuedAt') IS DISTINCT FROM 'number' OR jsonb_typeof(g->'expiresAt') IS DISTINCT FROM 'number' OR coalesce(g->>'issuedAt','') !~ '^[0-9]+$' OR coalesce(g->>'expiresAt','') !~ '^[0-9]+$' THEN RAISE EXCEPTION 'Validity type differs'; END IF;
 issued:=(g->>'issuedAt')::bigint; expires:=(g->>'expiresAt')::bigint;
 IF NOT(issued<=now_seconds AND now_seconds<expires AND expires<=issued+600) THEN RAISE EXCEPTION 'Expired, future or overlong authority'; END IF;
 RETURN g;
END $$;
CREATE FUNCTION solo440.claim(t text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog SET statement_timeout='30s' SET lock_timeout='5s' AS $$
DECLARE g jsonb:=solo440.validate_grant(t); sha text:=encode(solo440_crypto.digest(convert_to(t,'UTF8'),'sha256'),'hex');
BEGIN
 -- No ON CONFLICT/update/upsert: repeat, replacement and cross-run nonce reuse all fail.
 INSERT INTO solo440.claims(run_id,attempt,nonce,grant_sha256,grant_text) VALUES(g->>'runId',1,g->>'nonce',sha,t);
 RETURN jsonb_build_object('state','CLAIMED_NO_RECEIPT','grantSha256',sha,'runId',g->>'runId','attempt',1);
END $$;
CREATE FUNCTION solo440.reconcile(run text) RETURNS jsonb
LANGUAGE sql SECURITY DEFINER SET search_path=pg_catalog SET statement_timeout='30s' AS $$
 SELECT coalesce((SELECT jsonb_build_object('state',CASE WHEN receipt IS NULL THEN 'CLAIMED_NO_RECEIPT' ELSE 'RECEIPTED' END,'grantSha256',grant_sha256,'runId',run_id,'attempt',attempt,'receipt',receipt,'claimedAt',claimed_at,'receiptedAt',receipted_at) FROM solo440.claims WHERE run_id=run AND attempt=1),jsonb_build_object('state','ABSENT'))
$$;
CREATE FUNCTION solo440.finish(t text,r text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog SET statement_timeout='30s' SET lock_timeout='5s' AS $$
DECLARE g jsonb:=solo440.validate_grant(t); row solo440.claims%ROWTYPE; supplied jsonb:=r::jsonb; body jsonb; sha text:=encode(solo440_crypto.digest(convert_to(t,'UTF8'),'sha256'),'hex');
BEGIN
 SELECT * INTO STRICT row FROM solo440.claims WHERE run_id=g->>'runId' AND attempt=1 FOR UPDATE;
 IF row.grant_text<>t OR row.grant_sha256<>sha OR row.receipt IS NOT NULL THEN RAISE EXCEPTION 'Claim differs or already finalized'; END IF;
 body:='{"activated":false,"adoptionComment":"doco.yCW4dzFjM3eDgvrRWjBNVA","amendmentSha256":"62c30cc17ad5b9a87e57bb2e91a5ee2b25bbcfd3d9fe3c3e7f1775a99cd8475a","attempt":1,"basis":"authenticated-owner-acceptance-under-adopted-amendment","candidate":"1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e","certified":false,"engineBlob":"d8f5cb0153a0ae773c0fbd0dd9c999ae8cfb96a3","independentApproval":false,"nominationSha256":"aef727afa4234c4e0e7c6db84bfa312e85696ac655513d3cd6b10a2d829af449","ownerSubject":"115201266201052505736","policyBlob":"642d25f770b334a13419c4466d81f17aabff0aae","policyCommit":"aa6b7a18f8dd89c6d4cf01a3aa1514a1c5a5f5ff","policySha256":"16564fc8612e87a282195193e539b5e9d44d2fd94c88f9ee9b6ea9f19c73008c","published":false,"releaseHold":true,"schema":"calcumint.singleton440.single-owner-source-receipt.v2","sourceArchiveSha256":"6fcfdf70a0e08004e4c7df76a1417b905b166a97cb7f5bba7b2adcf592ca4a72","tree":"209982b9a81d7bf9f4783228505b5a274563391f"}'::jsonb || jsonb_build_object('grantSha256',sha,'productDispositionSha256',g->>'productDispositionSha256','applicabilitySha256',g->>'applicabilitySha256','evidenceSha256',g->>'evidenceSha256','executor',g->>'executor','executorTree',g->>'executorTree','runId',g->>'runId','storeIdentity',g->>'storeIdentity','qualification',g->>'mode'='disposable-qualification','admitted',g->>'mode'='source-admission');
 IF supplied IS DISTINCT FROM jsonb_build_object('body',body,'sha256',encode(solo440_crypto.digest(convert_to(solo440.canonical_flat(body),'UTF8'),'sha256'),'hex')) THEN RAISE EXCEPTION 'Receipt identity, role or integrity differs'; END IF;
 UPDATE solo440.claims SET receipt=supplied,receipted_at=clock_timestamp() WHERE run_id=row.run_id AND attempt=1;
 RETURN jsonb_build_object('state','RECEIPTED','grantSha256',sha,'receipt',supplied);
END $$;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA solo440 FROM PUBLIC;
GRANT USAGE ON SCHEMA solo440 TO solo440_executor;
GRANT EXECUTE ON FUNCTION solo440.claim(text),solo440.reconcile(text),solo440.finish(text,text) TO solo440_executor;
COMMIT;
