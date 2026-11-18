import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { startGoTrueFixture } from '../gotrue-runtime/fixture.mjs';
import { initializeFullSchema } from '../gotrue-full-schema/schema.mjs';

for (const name of ['DATABASE_URL', 'SUPABASE_DB_URL', 'PGHOST', 'PGPORT', 'PGUSER', 'PGPASSWORD', 'PGDATABASE']) {
  assert(!process.env[name], 'External database selector refused: ' + name);
}

const fixture = await startGoTrueFixture({initializeSchema: initializeFullSchema});
const client = () => createClient(fixture.url, fixture.anonKey, {
  auth: {persistSession: false, autoRefreshToken: false},
});
const ok = async request => {
  const {data,error} = await request;
  assert.equal(error, null, error?.message);
  return data;
};

try {
  const signup = async () => {
    const sdk = client();
    const {user,session} = await ok(sdk.auth.signUp({
      email: randomUUID() + '@example.invalid', password: 'Fixture-' + randomUUID(),
    }));
    await fixture.sql(`UPDATE public.profiles SET plan='business' WHERE id='${user.id}';`);
    return {sdk,id:user.id,session};
  };
  const owner = await signup();
  const member = await signup();
  const other = await signup();
  const createOrg = user => ok(user.sdk.rpc('create_business_organization', {
    org_name:'Security acceptance', org_slug:'security-' + randomUUID(),
  }));
  const org = await createOrg(owner);
  const otherOrg = await createOrg(other);
  await fixture.sql(`INSERT INTO public.organization_members(organization_id,user_id,role)
    VALUES ('${org}','${member.id}','manager');`);

  const sdk = member.sdk;
  const project = await ok(owner.sdk.from('business_projects').insert({
    organization_id:org, created_by:owner.id, name:'Owner project',
  }).select('id').single());
  const foreign = await ok(other.sdk.from('business_projects').insert({
    organization_id:otherOrg, created_by:other.id, name:'Other tenant',
  }).select('id').single());
  const update = name => ok(sdk.from('business_projects').update({name}).eq('id',project.id).select('id'));
  assert.deepEqual(await update('Manager update'),[project]);
  assert.deepEqual(await ok(sdk.from('business_projects').select('id').eq('id',foreign.id)),[]);
  assert.deepEqual(await ok(sdk.from('business_projects').update({name:'Denied foreign update'})
    .eq('id',foreign.id).select('id')),[]);
  const rest = async (table, query) => {
    const response = await fetch(fixture.url + '/rest/v1/' + table + '?' + query, {
      headers:{apikey:fixture.anonKey,Authorization:'Bearer ' + member.session.access_token},
    });
    assert.equal(response.status,200);
    return response.json();
  };
  const projects = () => rest('business_projects', 'select=id&id=in.(' + project.id + ',' + foreign.id + ')');
  assert.deepEqual(await projects(),[project]);

  const personal = await ok(sdk.from('calculation_projects').insert({user_id:member.id,name:'Personal'}).select('id').single());
  const ownersPersonal = await ok(owner.sdk.from('calculation_projects').insert({user_id:owner.id,name:'Owner personal'}).select('id').single());
  const snapshot = {
    user_id:member.id, calculator_slug:'square-calculator', calculator_version:1,
    input_data:{x:2}, output_data:{result:4},
  };
  const history = {id:await ok(sdk.rpc('save_calculation_history_atomic',{
    p_request_id:randomUUID(),p_calculator_slug:snapshot.calculator_slug,
    p_calculator_version:snapshot.calculator_version,p_input_data:snapshot.input_data,
    p_output_data:snapshot.output_data,p_expected_owner_id:member.id,
  }))};
  const scenarioRequest = {
    p_request_id:randomUUID(),p_project_id:personal.id,p_history_id:history.id,
    p_name:'Personal scenario',p_expected_owner_id:member.id,
  };
  const scenario = {id:await ok(sdk.rpc('save_project_scenario_atomic',scenarioRequest))};
  const staleOwner = await sdk.rpc('save_project_scenario_atomic',{
    ...scenarioRequest,p_expected_owner_id:owner.id,
  });
  assert.equal(staleOwner.error?.code,'42501');
  const deniedAttach = await sdk.from('saved_scenarios').insert({
    ...snapshot,name:'Wrong owner project',project_id:ownersPersonal.id,
  });
  assert.equal(deniedAttach.error?.message,'SCENARIO_WRITE_REJECTED');
  for (const [table,row] of [['calculation_history',history],['saved_scenarios',scenario]]) {
    assert.deepEqual(await ok(owner.sdk.from(table).select('id').eq('id',row.id)),[]);
    assert.deepEqual(await ok(other.sdk.from(table).select('id').eq('id',row.id)),[]);
  }

  const memberships = owner.sdk.from('organization_members');
  const changed = await ok(memberships.update({role:'viewer'}).eq('organization_id',org)
    .eq('user_id',member.id).select('role'));
  assert.deepEqual(changed,[{role:'viewer'}]);
  assert.deepEqual(await update('Denied after downgrade'),[]);
  assert.deepEqual(await projects(),[project]);
  const deniedInsert = await sdk.from('business_projects').insert({
    organization_id:org, created_by:member.id, name:'Denied viewer project',
  });
  assert.equal(deniedInsert.error?.code,'42501');

  const removed = await ok(memberships.delete().eq('organization_id',org).eq('user_id',member.id).select('user_id'));
  assert.deepEqual(removed,[{user_id:member.id}]);
  assert.deepEqual(await projects(),[]);
  assert.deepEqual(await update('Denied after revocation'),[]);
  assert.deepEqual(await ok(owner.sdk.from('business_projects').select('id,name').eq('id',project.id)),
    [{id:project.id,name:'Manager update'}]);
  for (const [table,row] of [['calculation_history',history],['saved_scenarios',scenario]]) {
    const recovered = await rest(table, 'select=calculator_slug,calculator_version,input_data,output_data&id=eq.' + row.id);
    assert.deepEqual(recovered,[{
      calculator_slug:snapshot.calculator_slug, calculator_version:snapshot.calculator_version,
      input_data:snapshot.input_data, output_data:snapshot.output_data,
    }]);
  }
  console.log(JSON.stringify({
    passed:true, support:'Real GoTrue sessions, PostgreSQL RLS and direct PostgREST with one unchanged access token',
    checks:['manager write','foreign project read and write denied','owner downgrade','viewer read only','owner revocation',
      'stale bearer denied','owner retains project access','private history and scenario ownership',
      'foreign personal project attachment denied','stale expected session owner denied','exact personal replay survives organization revocation'],
    fixtureImages:fixture.provenance.images, productionEquivalence:'UNKNOWN',
  },null,2));
} finally {
  await fixture.close();
}
