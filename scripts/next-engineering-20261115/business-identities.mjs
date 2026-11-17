/** Exact immutable engine identities; engineering scope only, never publication authority. */
const rows=[
 [284,'statistics.z-score','z-score-calculator',['zScore','deviation','steps']],
 [285,'statistics.confidence-interval','confidence-interval-calculator',['estimate','marginOfError','lowerBound','upperBound','confidenceLevel','criticalValue','steps']],
 [286,'statistics.sample-size','sample-size-calculator',['sampleSize','unroundedSampleSize','confidenceLevel','marginOfError','proportion','steps']],
 [287,'statistics.probability','probability-calculator',['probabilityOfA','probabilityOfB','bothIndependent','eitherIndependent','notA','steps']],
 [288,'statistics.permutation','permutation-calculator',['permutations','n','r','steps']],
 [289,'statistics.combination','combination-calculator',['combinations','n','r','steps']],
 [290,'statistics.binomial-probability','binomial-probability-calculator',['probability','n','k','p','steps']],
 [291,'statistics.normal-distribution','normal-distribution-calculator',['zScore','pdf','cdf','upperTail','steps']],
 [300,'statistics.bayes-theorem','bayes-theorem-calculator',['posterior','numerator','denominator','steps']],
 ...[[329,'molality'],[333,'ph'],[334,'ideal-gas-law'],[335,'gas-density'],[336,'percent-composition'],[337,'solution-concentration'],[338,'stoichiometry'],[339,'half-life'],[340,'nernst-equation'],[341,'beer-lambert-law'],[342,'titration']].map(([id,name])=>[id,'chemistry.'+name,name+'-calculator',['value','steps']]),
];
export const newIdentities=Object.freeze(rows.map(([catalogId,engineId,slug])=>Object.freeze({catalogId,engineId,slug,version:1})));
export const shapeFields=Object.freeze(Object.fromEntries(rows.map(([, ,slug,fields])=>[slug,Object.freeze(fields)])));
