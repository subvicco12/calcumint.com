import React from 'react';
import {createRoot} from 'react-dom/client';
import {PublicEmbedCalculator} from '@/components/public-embed-calculator';
import {definition,embedConfig} from './embed-fixture';
declare global {interface Window {__embedToken:string}}
const props={publicKey:'review-embed',sessionToken:window.__embedToken,definition,companyName:'Local acceptance',accentColor:'#0b7a66',hideCalcumintBrand:false,leadCaptureEnabled:true,leadFields:embedConfig.lead_fields,consentText:embedConfig.consent_text,privacyUrl:embedConfig.privacy_url};
createRoot(document.getElementById('root')!).render(<main className="embed-shell"><PublicEmbedCalculator {...props}/></main>);
