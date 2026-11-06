import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
export const hash=x=>createHash('sha256').update(x).digest('hex');
export function validateQuotaCapture(c){assert.equal(c.kind,'AUTHENTICATED_READ_ONLY_METADATA_CAPTURE');assert.equal(c.project,'zpwpstsvztyshcnwdfye');assert.equal(c.readOnly,'on');assert.deepEqual(JSON.parse(c.raw),c.data);assert.equal(hash(c.raw),'da204f0359df6e85adfe10d8ae6f15896ed35cb03a92fd5cbe03e22d87d10dda','Exact quota predecessor changed');}
export function validateQuotaPostimage(raw){assert.equal(hash(raw),'8dc9fa3596e1a1f8a430f7630cacc6e9144365d8a88b0621c42ba80fb96cc8d4','Exact source-derived quota postimage changed');return hash(raw);}
export function validateQuotaSources(source,wrapper){assert.equal(hash(source),'2e3cd725261052be9c4bce71610a5912b235d2322b737c93cd87a4f74c86a436');assert.equal(hash(wrapper),'59fbc3417054f5482b2e1cc2e9a13cd98167c73fa243e35e72a067a74496de59');}
