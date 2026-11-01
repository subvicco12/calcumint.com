// A finite, explicit polynomial family, not a full-domain proof certificate.
// Integer power rules and antiderivatives are independent of all engine helpers.
const gcd=(a:bigint,b:bigint):bigint=>b?gcd(b,a%b):a<0n?-a:a;
const fraction=(numerator:bigint,denominator=1n)=>{
 const divisor=gcd(numerator,denominator);
 return {numerator:String(numerator/divisor),denominator:String(denominator/divisor)};
};
export function polynomialWitnesses(maxDegree:number){
 if(!Number.isInteger(maxDegree)||maxDegree<0||maxDegree>32)throw Error('Witness degree must be an integer from0 through32');
 const witnesses=[];
 for(let n=0;n<=maxDegree;n++)for(const point of [-2,0,2]){
  const x=BigInt(point),degree=BigInt(n),expression=`x^${n}`;
  witnesses.push({input:{operation:'derivative',expression,x:String(point)},exact:fraction(n===0?0n:degree*x**(degree-1n))});
  witnesses.push({input:{operation:'integral',expression,lower:String(point),upper:String(point+1)},exact:fraction((x+1n)**(degree+1n)-x**(degree+1n),degree+1n)});
  witnesses.push({input:{operation:'limit',expression,x:String(point),direction:'both'},exact:fraction(x**degree)});
 }
 return witnesses;
}
