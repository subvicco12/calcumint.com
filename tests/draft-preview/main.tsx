import React from 'react';
import {createRoot} from 'react-dom/client';
import {DraftCalculatorPreview} from '../../src/components/draft-calculator-preview';
import '../../src/app/globals.css';
import {AccountFixture} from './account-fixture';
createRoot(document.getElementById('root')!).render(new URLSearchParams(location.search).get('accountFixture')==='1'?<AccountFixture/>:<DraftCalculatorPreview ownerScope="synthetic-local-reviewer"/>);
