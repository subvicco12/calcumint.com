/** New-input boundary only. Historical artifact import/replay retains its original semantics. */
const limit=2_000_000,formNumberPattern=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
function normalizedDecimal(text:string):string{
 const [mantissa,exponent='0']=text.toLowerCase().split('e');
 const negative=mantissa.startsWith('-'),unsigned=/^[+-]/.test(mantissa)?mantissa.slice(1):mantissa;
 const [whole,fraction='']=unsigned.split('.');
 let digits=(whole+fraction).replace(/^0+/,'');
 if(!digits)return '0';
 let trailing=0;while(digits.endsWith('0')){digits=digits.slice(0,-1);trailing++;}
 return (negative?'-':'')+digits+'e'+(BigInt(exponent)-BigInt(fraction.length)+BigInt(trailing));
}
function checkedNumber(text:string):number{
 const value=Number(text);
 if(!Number.isFinite(value))throw Error('Numeric input must remain finite');
 if(value===0&&/[1-9]/.test(text.split(/[eE]/)[0]))throw Error('Numeric input precision underflow');
 if(normalizedDecimal(text)!==normalizedDecimal(String(value)))throw Error('Numeric input precision would change before engine validation');
 return value;
}
/** Invalid or lossy drafts stay strings so a controlled form can retain the caller's text. */
export function parsePublicationFactoryNumber(text:string):number|string{
 if(text.length>limit||!formNumberPattern.test(text))return text;
 try{return checkedNumber(text);}catch{return text;}
}
/** Validate JSON syntax first; inspect only unquoted number tokens before returning its values. */
export function parsePublicationFactoryInput(text:string):unknown{
 if(text.length>limit)throw Error('Review input size bound');
 let quoted=false,escaped=false,depth=0;
 for(const char of text){
  if(quoted){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char==='"')quoted=false;continue;}
  if(char==='"')quoted=true;
  else if(char==='['||char==='{'){if(++depth>128)throw Error('Review input nesting bound');}
  else if(char===']'||char==='}')depth--;
 }
 const parsed:unknown=JSON.parse(text);
 quoted=false;escaped=false;
 for(let i=0;i<text.length;i++){
  const char=text[i];
  if(quoted){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char==='"')quoted=false;continue;}
  if(char==='"'){quoted=true;continue;}
  if(char==='-'||(char>='0'&&char<='9')){
   let end=i+1;while(end<text.length&&/[0-9eE+.\-]/.test(text[end]))end++;
   checkedNumber(text.slice(i,end));i=end-1;
  }
 }
 return parsed;
}
