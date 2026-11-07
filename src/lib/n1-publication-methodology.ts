/** Caller disclosure only; immutable engine codes, source authority and captured artifacts are unchanged. */
export function n1PublicationMethodology(catalogId:number,version:number,methodology:string,scope:string):string{
 if(version!==1)return methodology;
 const convention=catalogId===430
  ?'cal and kcal use the thermochemical calorie convention: 1 cal = 4.184 J and 1 kcal = 4184 J. International Table and mean calories are distinct conventions; no nutritional applicability is inferred.'
  :catalogId===434
   ?'KB is the retained engine code for decimal kilobytes (1000 bytes); the SI symbol is kB. Stored inputs, history and raw exports retain KB. Binary KiB is distinct (1024 bytes).'
   :undefined;
 return convention?[methodology,scope,convention].join('\n\n'):methodology;
}
