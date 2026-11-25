'use client';

import { useRef } from 'react';
import { CalculatorFactoryWorkbench } from './calculator-factory-workbench';
import { FinalResultPresentation } from './final-result-presentation';
import { weatherProfiles } from '@/lib/calculator-factory/weather';
import type { FactoryExecutionPacket } from '@/lib/calculator-factory/workflows';
import type { CalcuMintPlan } from '@/lib/entitlements';

type Save = (entry: FactoryExecutionPacket['snapshot'] & { requestId: string; expectedOwnerId: string }) => Promise<unknown>;

export function WeatherCalculatorWorkbench({ ownerId, plan, saveHistory }: { ownerId: string; plan: CalcuMintPlan; saveHistory: Save }) {
    return weatherProfiles.map(profile => <WeatherProfile key={`${ownerId}:${profile.catalogId}`} profile={profile} ownerId={ownerId} plan={plan} saveHistory={saveHistory} />);
}

function WeatherProfile({ profile, ownerId, plan, saveHistory }: { profile: typeof weatherProfiles[number]; ownerId: string; plan: CalcuMintPlan; saveHistory: Save }) {
    const retry = useRef<{ key: string; requestId: string } | null>(null);
    const { definition } = profile;
    const source = definition.sources;
    return <div className="factory-delivery-controls" style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        <CalculatorFactoryWorkbench
            title={definition.title}
            plan={plan}
            fields={profile.fields}
            workflows={profile.workflows}
            onSave={async ({ snapshot }) => {
                const key = JSON.stringify(snapshot);
                if (retry.current?.key !== key) retry.current = { key, requestId: crypto.randomUUID() };
                await saveHistory({ ...snapshot, requestId: retry.current.requestId, expectedOwnerId: ownerId });
                return 'Saved to your authenticated calculation history.';
            }}
            renderResult={packet => <FinalResultPresentation plan={plan} result={{
                primaryResult: { id: 'value', label: profile.resultLabel, value: String(packet.snapshot.output.value), unit: '°C' },
                methodology: `${profile.scope} The v1 engine computes with binary floating-point arithmetic and rounds to six decimal places. Displayed digits do not imply measurement accuracy.`,
                sources: source,
            }} />}
        />
        <details>
            <summary>{definition.title} formula and applicability</summary>
            <p>{profile.scope}</p>
            <p>{definition.formulas[0].expression}</p>
        </details>
    </div>;
}
