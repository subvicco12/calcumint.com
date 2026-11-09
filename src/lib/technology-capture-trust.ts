/** After original schema/engine validation: new-capture precision boundary only, never historical replay. */
const minimumNormal=2**-1022;
const selected=new Set(['technology.ip-subnet','technology.raid-capacity','technology.screen-ppi','technology.aspect-ratio','technology.resolution','technology.dpi','technology.battery-runtime','technology.ups-runtime','technology.power-supply','technology.website-bandwidth','technology.cloud-storage-cost','technology.cloud-data-transfer-cost','technology.base64-size','technology.password-entropy']);
const network=new Set(['technology.bandwidth','technology.download-time','technology.upload-time','technology.data-transfer','technology.storage-conversion']);
const zeroFields:Record<string,readonly string[]>={
 'technology.website-bandwidth':['monthlyPageViews'],
 'technology.cloud-storage-cost':['storageGb','pricePerGbMonth'],
 'technology.cloud-data-transfer-cost':['transferGb','pricePerGb'],
 'technology.base64-size':['inputBytes'],
};
function requireNormal(value:number){if(!Number.isFinite(value)||value===0||Math.abs(value)<minimumNormal)throw Error('The current version underflows its supported precision range at these inputs. Your input is preserved; use compatible magnitudes.');}
export function validateTechnologyCapture(id:string,input:Readonly<Record<string,unknown>>,output:{value:number}):void{
 if(network.has(id))return; // These five have their existing publication20 result-trust boundary.
 if(!selected.has(id))throw Error('Technology capture scope has not been established.');
 const value=output.value;
 if(!Number.isFinite(value)||(value!==0&&Math.abs(value)<minimumNormal))throw Error('Result is outside the supported finite normal precision range.');
 if(value===0&&!(zeroFields[id]??[]).some(key=>input[key]===0))throw Error('A positive result underflows the supported precision range. Your input is preserved.');
 if(id==='technology.screen-ppi')requireNormal((input.widthPixels as number)**2+(input.heightPixels as number)**2);
 if(id==='technology.battery-runtime'||id==='technology.ups-runtime'){
  const efficiency=(input.efficiencyPercent as number)/100;requireNormal(efficiency);
  requireNormal((input[id==='technology.battery-runtime'?'capacityWh':'batteryWh'] as number)*efficiency);
 }
}
