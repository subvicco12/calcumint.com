import React from 'react';
import {createRoot} from 'react-dom/client';
import {CalculatorFactoryPortal} from '../../src/components/calculator-factory-portal';
const params=new URLSearchParams(location.search);
createRoot(document.getElementById('root')!).render(<CalculatorFactoryPortal ownerId="synthetic-browser-owner" plan={(params.get('plan')||'free') as 'free'|'pro'|'business'}/>);
