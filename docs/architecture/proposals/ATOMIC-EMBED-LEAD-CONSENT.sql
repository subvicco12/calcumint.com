-- PROPOSAL ONLY. Not a deployment migration. Requires database/security/privacy review.
BEGIN;
DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated acceptance and owner authorization required'; END $$;
CREATE TABLE public.embed_lead_receipts (
  embed_config_id uuid NOT NULL REFERENCES public.embed_configs(id),
  request_id uuid NOT NULL,
  organization_id uuid NOT NULL REFERENCES public.organizations(id),
  calculator_id uuid NOT NULL REFERENCES public.custom_calculators(id),
  calculator_version integer NOT NULL CHECK (calculator_version > 0),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  lead_id uuid NOT NULL UNIQUE REFERENCES public.embed_leads(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (embed_config_id,request_id)
);
ALTER TABLE public.embed_lead_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.embed_lead_receipts FROM PUBLIC,anon,authenticated;
-- No client receipt policy, and no direct service-role receipt mutation grant.
CREATE FUNCTION public.capture_verified_embed_lead_v1(
  p_public_key text,p_config_id uuid,p_organization_id uuid,p_calculator_id uuid,
  p_version integer,p_expires_at bigint,p_request_id uuid,p_payload jsonb
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public AS $$
DECLARE
  config public.embed_configs%ROWTYPE;
  receipt public.embed_lead_receipts%ROWTYPE;
  current_version integer;
  lead uuid;
  field text;
BEGIN
  -- Signature verification is the trusted application's responsibility; this
  -- function is service-role-only, never an anonymous capability endpoint.
  IF p_config_id IS NULL OR p_request_id IS NULL OR p_organization_id IS NULL
    OR p_calculator_id IS NULL OR p_version IS NULL OR p_version < 1
    OR p_expires_at IS NULL OR p_expires_at <= extract(epoch FROM clock_timestamp())*1000
    OR p_expires_at > extract(epoch FROM clock_timestamp())*1000 + 900000
    OR jsonb_typeof(p_payload) IS DISTINCT FROM 'object'
    OR p_payload->'consented' IS DISTINCT FROM 'true'::jsonb THEN
    RAISE EXCEPTION 'Invalid lead capability or payload';
  END IF;
  SELECT * INTO config FROM public.embed_configs WHERE id=p_config_id FOR UPDATE;
  IF NOT FOUND OR config.public_key IS DISTINCT FROM p_public_key
    OR config.organization_id IS DISTINCT FROM p_organization_id
    OR config.calculator_id IS DISTINCT FROM p_calculator_id
    OR config.status IS DISTINCT FROM 'active' OR config.lead_capture_enabled IS DISTINCT FROM true
    OR coalesce(btrim(config.consent_text),'')='' THEN
    RAISE EXCEPTION 'Unavailable lead configuration';
  END IF;
  SELECT published_version INTO current_version FROM public.custom_calculators
    WHERE id=p_calculator_id AND organization_id=p_organization_id AND status='published' FOR SHARE;
  IF NOT FOUND OR current_version IS DISTINCT FROM p_version THEN
    RAISE EXCEPTION 'Published version or ownership changed';
  END IF;
  FOREACH field IN ARRAY ARRAY['name','email','phone','company'] LOOP
    IF p_payload ? field AND jsonb_typeof(p_payload->field) IS DISTINCT FROM 'string' THEN
      RAISE EXCEPTION 'Invalid lead field';
    END IF;
  END LOOP;
  IF length(p_payload->>'name')>120 OR length(p_payload->>'email')>254
    OR length(p_payload->>'phone')>40 OR length(p_payload->>'company')>120
    OR length(p_payload->>'sourceUrl')>2048 THEN RAISE EXCEPTION 'Lead field too long'; END IF;
  FOREACH field IN ARRAY config.lead_fields LOOP
    IF field NOT IN ('name','email','phone','company') OR (field IN ('name','email') AND coalesce(btrim(p_payload->>field),'')='') THEN
      RAISE EXCEPTION 'Required lead field absent';
    END IF;
  END LOOP;
  SELECT * INTO receipt FROM public.embed_lead_receipts
    WHERE embed_config_id=p_config_id AND request_id=p_request_id;
  IF FOUND THEN
    IF receipt.payload IS DISTINCT FROM p_payload OR receipt.organization_id IS DISTINCT FROM p_organization_id
      OR receipt.calculator_id IS DISTINCT FROM p_calculator_id OR receipt.calculator_version IS DISTINCT FROM p_version THEN
      RAISE EXCEPTION 'Conflicting lead request identity' USING ERRCODE='PT409';
    END IF;
    IF NOT EXISTS (SELECT FROM public.lead_consents WHERE lead_id=receipt.lead_id AND consented=true) THEN
      RAISE EXCEPTION 'Incomplete lead receipt';
    END IF;
    RETURN jsonb_build_object('status','duplicate','lead_id',receipt.lead_id);
  END IF;
  INSERT INTO public.embed_leads(organization_id,embed_config_id,calculator_id,name,email,phone,company,calculation_input,calculation_output,source_url)
    VALUES(p_organization_id,p_config_id,p_calculator_id,nullif(p_payload->>'name',''),nullif(p_payload->>'email',''),
      nullif(p_payload->>'phone',''),nullif(p_payload->>'company',''),p_payload->'input',p_payload->'output',p_payload->>'sourceUrl')
    RETURNING id INTO lead;
  -- Existing AFTER INSERT webhook enqueue happens in this same transaction:
  -- no worker can observe it if consent or receipt persistence rolls back.
  INSERT INTO public.lead_consents(lead_id,consent_text,privacy_url,consented)
    VALUES(lead,config.consent_text,config.privacy_url,true);
  INSERT INTO public.embed_lead_receipts(embed_config_id,request_id,organization_id,calculator_id,calculator_version,payload,lead_id)
    VALUES(p_config_id,p_request_id,p_organization_id,p_calculator_id,p_version,p_payload,lead);
  BEGIN
    INSERT INTO public.embed_events(organization_id,embed_config_id,calculator_id,event_type,source_url)
      VALUES(p_organization_id,p_config_id,p_calculator_id,'lead_submit',p_payload->>'sourceUrl');
  EXCEPTION WHEN OTHERS THEN
    -- Existing analytics is best effort, separate from mandatory consent/receipt.
    NULL;
  END;
  RETURN jsonb_build_object('status','created','lead_id',lead);
END $$;
REVOKE ALL ON FUNCTION public.capture_verified_embed_lead_v1(text,uuid,uuid,uuid,integer,bigint,uuid,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.capture_verified_embed_lead_v1(text,uuid,uuid,uuid,integer,bigint,uuid,jsonb) TO service_role;
COMMIT;
