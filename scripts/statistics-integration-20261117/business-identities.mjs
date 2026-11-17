const rows=[
 [292,'correlation',['correlation','count','meanX','meanY','steps']],
 [293,'linear-regression',['slope','intercept','rSquared','correlation','count','steps']],
 [294,'weighted-mean',['weightedMean','totalWeight','count','steps']],
 [295,'percentile',['percentile','position','count','steps']],
 [296,'quartile',['quartile','quartileNumber','position','count','steps']],
 [297,'interquartile-range',['q1','q3','interquartileRange','count','steps']],
 [299,'expected-value',['expectedValue','steps']],
];
export const newIdentities=Object.freeze(rows.map(([catalogId,name])=>Object.freeze({catalogId,engineId:'statistics.'+name,slug:name+'-calculator',version:1})));
export const shapeFields=Object.freeze(Object.fromEntries(rows.map(([,name,fields])=>[name+'-calculator',Object.freeze(fields)])));
