/** Exact internal quantities. Only normalized integer strings cross JSON boundaries. */
export type Rational=Readonly<{numerator:string;denominator:string}>;
function gcd(a:bigint,b:bigint):bigint{a=a<0n?-a:a;while(b!==0n){const r=a%b;a=b;b=r;}return a;}
export function rational(n:bigint,d=1n):Rational{
 if(d<=0n)throw new RangeError('Positive denominator required');
 const g=gcd(n,d);return Object.freeze({numerator:String(n/g),denominator:String(d/g)});
}
export const zero=rational(0n);
export function decimal(value:string):Rational{
 if(!/^(0|[1-9]\d{0,11})(\.\d{1,6})?$/.test(value))throw new RangeError('Bounded nonnegative decimal required');
 const [whole,fraction='']=value.split('.');return rational(BigInt(whole+fraction),10n**BigInt(fraction.length));
}
export function add(a:Rational,b:Rational):Rational{return rational(BigInt(a.numerator)*BigInt(b.denominator)+BigInt(b.numerator)*BigInt(a.denominator),BigInt(a.denominator)*BigInt(b.denominator));}
export function subtract(a:Rational,b:Rational):Rational{return add(a,rational(-BigInt(b.numerator),BigInt(b.denominator)));}
export function multiply(a:Rational,b:Rational):Rational{return rational(BigInt(a.numerator)*BigInt(b.numerator),BigInt(a.denominator)*BigInt(b.denominator));}
export function divide(a:Rational,b:Rational):Rational{
 if(BigInt(b.numerator)<=0n)throw new RangeError('Positive divisor required');
 return rational(BigInt(a.numerator)*BigInt(b.denominator),BigInt(a.denominator)*BigInt(b.numerator));
}
/** No rounding policy is invented: display terminating decimals or exact fractions. */
export function formatRational(value:Rational):string{
 let n=BigInt(value.numerator);const d=BigInt(value.denominator);
 if(d<=0n)throw new RangeError('Positive denominator required');
 const negative=n<0n;n=negative?-n:n;
 let remainder=d,twos=0,fives=0;
 while(remainder%2n===0n){remainder/=2n;twos++;}
 while(remainder%5n===0n){remainder/=5n;fives++;}
 if(remainder!==1n)return `${negative?'-':''}${n}/${d}`;
 const places=Math.max(twos,fives),scale=10n**BigInt(places);
 n=n*scale/d;const s=n.toString().padStart(places+1,'0');
 return (negative?'-':'')+(places?s.slice(0,-places)+'.'+s.slice(-places).replace(/0+$/,''):s).replace(/\.$/,'');
}
