'use client';
import {useRef} from 'react';
import {RemainderCaptureSuccessor} from '@/components/remainder-capture-successor';
import type {CalcuMintPlan} from '@/lib/entitlements';
import {saveIntake} from './actions';
export function IntakeClient({owner,plan}:{owner:string;plan:CalcuMintPlan}){
 const retry=useRef<{key:string;id:string}|null>(null);
 return <RemainderCaptureSuccessor plan={plan} onSave={async packet=>{const key=JSON.stringify([owner,packet]);if(retry.current?.key!==key)retry.current={key,id:crypto.randomUUID()};return saveIntake(owner,retry.current.id,packet);}}/>;
}
