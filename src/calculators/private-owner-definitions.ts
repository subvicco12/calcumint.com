import {privateOwnerBusinessCore} from './private-owner-business-core';
import {privateOwnerBusinessImpact} from './private-owner-business-impact';
import {privateOwnerEveryday} from './private-owner-everyday';
/** Owner-approved bounded scopes; private engineering identities, never public registry entries. */
export const privateOwnerDefinitions=[...privateOwnerBusinessCore,...privateOwnerBusinessImpact,...privateOwnerEveryday];
