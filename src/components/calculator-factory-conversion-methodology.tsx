import {conversionCompletionContracts} from '@/lib/calculator-factory/completion/conversion-contracts';
import {getConversionFactoryDefinition,runConversionFactoryCalculation} from '@/lib/calculator-factory/cohorts/conversions';

/** Source-scoped user explanation, using the unchanged registered v1 engine. */
export function CalculatorFactoryConversionMethodology({catalogId}:{catalogId:number}){
 const contract=conversionCompletionContracts.find(row=>row.catalogId===catalogId);
 if(!contract)return null;
 const entry=getConversionFactoryDefinition(catalogId)!;
 const example=runConversionFactoryCalculation({catalogId,version:1,input:contract.example});
 const from=contract.units[contract.example.fromUnit],to=contract.units[contract.example.toUnit];
 return <section aria-label={`${entry.definition.title} methodology`} style={{minWidth:0,overflowWrap:'anywhere'}}>
  <h2>How this conversion works</h2>
  <p>Each unit has a factor in {contract.baseSymbol}. Divide the source factor by the target factor, then multiply the entered value by that ratio. This keeps the same physical quantity while changing its unit. Selecting the same unit preserves the entered numeric value.</p>
  <p><strong>Formula:</strong> target value = entered value × (source factor ÷ target factor).</p>
  <h3>When to use these units</h3>
  <p>{contract.applicability}</p>
  <p>Enter a complete decimal value and select the exact unit you intend. Signed scalar values and zero are allowed; the sign is carried through the conversion. These choices do not determine whether a negative quantity is meaningful in your application.</p>
  <div style={{overflowX:'auto'}}>
   <table aria-label="Unit definitions">
    <caption>Exact source definitions in {contract.baseSymbol}; product codes select the displayed units.</caption>
    <thead><tr><th scope="col">Product code</th><th scope="col">Unit symbol</th><th scope="col">UCUM correspondence</th><th scope="col">Exact factor in {contract.baseSymbol}</th></tr></thead>
    <tbody>{Object.entries(contract.units).map(([code,unit])=><tr key={code}><th scope="row">{code}</th><td>{unit.symbol}</td><td>{unit.sourceCode}</td><td>{unit.exactBase}</td></tr>)}</tbody>
   </table>
  </div>
  <h3>Worked example</h3>
  <p>Convert {contract.example.value} {from.symbol} to {to.symbol}. Use the two source factors from the table:</p>
  <p aria-label="Worked example formula">{contract.example.value} × ({from.exactBase} ÷ {to.exactBase}) {to.symbol}</p>
  <p>The registered version 1 calculator returns {String(example.output.result)} {to.symbol}.</p>
  <p>Native numeric output, before display rounding:</p>
  <pre aria-label="Worked example native output" style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(example.output)}</pre>
  <h3>Precision and input limits</h3>
  <p>The fractions in the table describe the source definitions. The calculator stores numbers in binary64, so a displayed decimal can include a small representation difference. The calculation uses the existing version 1 factors and keeps its native numeric output; rounding a display does not alter a saved result.</p>
  <p>Unsupported or incorrectly cased unit codes, incomplete decimal text, and entered digits that cannot be retained are refused. Results outside the finite numeric range, results that lose a nonzero value to zero, and results below the supported precision boundary are also refused. Choose a suitable unit or a value within the supported range.</p>
  <h3>Source and review status</h3>
  <p><a href={contract.source.url}>UCUM 2.2 source release</a> supplies the defining unit relationships. Product codes are explicitly mapped to their UCUM correspondences in the table; use the displayed meaning when choosing a unit.</p>
  <p>Competent applicability review remains pending. This methodology and its software checks do not grant canonical acceptance, certification or publication approval.</p>
 </section>;
}
