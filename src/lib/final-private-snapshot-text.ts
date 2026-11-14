import {parsePublicationFactoryNumber} from './publication-factory-contracts-input';

/**
 * JSON.parse alone erases forged identity/revision digits before replay sees them.
 * Check the serialized decimal value against the actual finite Number spelling.
 * Unlike new-input limits, historical snapshots retain the existing 8 MB bound,
 * canonical subnormal numbers and all quoted exact-decimal/rational quantities.
 */
export function parseFinalPrivateSnapshotText(text:string):unknown {
 if(text.length>8_000_000)throw Error('Snapshot size limit');
 const parsed:unknown=JSON.parse(text);
 // Syntax is already validated. Skip quoted strings (including escapes) so
 // exact quantities and URLs are never inspected or copied into another buffer.
 let quoted=false,escaped=false;
 for(let i=0;i<text.length;i++){
  const char=text[i];
  if(quoted){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char==='"')quoted=false;continue;}
  if(char==='"'){quoted=true;continue;}
  if(char==='-'||(char>='0'&&char<='9')){
   let end=i+1;while(end<text.length&&/[0-9eE+.\-]/.test(text[end]))end++;
   if(typeof parsePublicationFactoryNumber(text.slice(i,end))!=='number')
    throw Error('Snapshot numeric digits would change before replay verification');
   i=end-1;
  }
 }
 return parsed;
}
