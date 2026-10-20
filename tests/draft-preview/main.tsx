import React from 'react';
import {createRoot} from 'react-dom/client';
import {DraftCalculatorPreview} from '../../src/components/draft-calculator-preview';
import '../../src/app/globals.css';
createRoot(document.getElementById('root')!).render(<DraftCalculatorPreview ownerScope="synthetic-local-reviewer"/>);
