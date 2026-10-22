"use client";

import Link from 'next/link';
import {useEffect,useRef} from 'react';

/** A retry refetches this segment; it must never replay an uncertain mutation. */
export default function BusinessError({retry}:{error:Error&{digest?:string};retry:()=>void}){
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{if(document.activeElement===document.body)heading.current?.focus();},[]);
 return <section className="container page-top business-page">
  <h1 ref={heading} tabIndex={-1}>Workspace request unavailable</h1>
  <p role="alert" aria-atomic="true">We could not confirm this request. Review your workspace before submitting again. Reloading checks the current state; it does not repeat the action.</p>
  <div className="scenario-controls"><button type="button" className="button secondary" onClick={retry}>Reload workspace</button><Link className="text-link" href="/business">Business workspace</Link></div>
 </section>;
}
