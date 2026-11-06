/** Independent Python Fraction and Decimal200digits, repeated300digits; <=1e-190 relative disagreement. */
export const advancedOracleMetadata={
  "runtime": "Python 3.12.14",
  "algorithm": "Fraction weighted sufficient statistics; stdlib Decimal sqrt at200and300digits",
  "sourceSHA256": "19e071ad40f11782301616873698079b1d2ad770f4a4604232d1b03415214b55",
  "source": "from fractions import Fraction\nfrom decimal import Decimal, localcontext\nimport json\ncases=[\n {'name':'contract-ST-Q23-irrational-sample-target','mode':'sample','values':['1','2','3'],'targetMetric':'variance','target':'2','shift':'0'},\n {'name':'four-point-population','mode':'population','values':['-1','0','1','2'],'targetMetric':'variance','target':'2','shift':'1'},\n {'name':'weighted-sample','mode':'sample','values':['0','3'],'frequencies':['2','1'],'targetMetric':'standardDeviation','target':'0.1','shift':'0'},\n {'name':'extreme-cancellation','mode':'population','values':['1e100','1','-1e100'],'targetMetric':'variance','target':'1','shift':'0'},\n {'name':'tiny-spread-large-scale','mode':'population','values':['0','2e-100'],'targetMetric':'variance','target':'1e100','shift':'0'},\n {'name':'34digit-neighbor','mode':'sample','values':['1000000000000000000000000000000000','1000000000000000000000000000000001'],'targetMetric':'variance','target':'0.01','shift':'0'},\n {'name':'exact-decimal-inputs','mode':'sample','values':['0.1','1.1','1.11','2.22'],'targetMetric':'standardDeviation','target':'7','shift':'-2'},\n]\ndef dec(q):return Decimal(q.numerator)/Decimal(q.denominator)\ndef compute(c,precision):\n with localcontext() as context:\n  context.prec=precision\n  xs=list(map(Fraction,c['values'])); fs=list(map(int,c.get('frequencies',['1']*len(xs)))); n=sum(fs); s=sum((x*f for x,f in zip(xs,fs)),Fraction()); mean=s/n; m2=sum((f*(x-mean)**2 for x,f in zip(xs,fs)),Fraction()); variance=m2/(n-1 if c['mode']=='sample' else n);sd=dec(variance).sqrt();t=Decimal(c['target']);scale=(t/dec(variance)).sqrt() if c['targetMetric']=='variance' else t/sd\n  return{'mean':str(dec(mean)),'variance':str(dec(variance)),'standardDeviation':str(sd),'scale':str(scale),'target':str(t)}\nresult=[]\nfor c in cases:\n a=compute(c,200);b=compute(c,300)\n with localcontext() as ctx:\n  ctx.prec=350\n  for k in a:\n   left,right=Decimal(a[k]),Decimal(b[k]); assert left==right if not right else abs((left-right)/right)<Decimal('1e-190')\n result.append({'case':c,'expected':a})\nprint(json.dumps(result,indent=2))\n"
} as const;
export const advancedOracleFixtures=[
  {
    "case": {
      "name": "contract-ST-Q23-irrational-sample-target",
      "mode": "sample",
      "values": [
        "1",
        "2",
        "3"
      ],
      "targetMetric": "variance",
      "target": "2",
      "shift": "0"
    },
    "expected": {
      "mean": "2",
      "variance": "1",
      "standardDeviation": "1",
      "scale": "1.4142135623730950488016887242096980785696718753769480731766797379907324784621070388503875343276415727350138462309122970249248360558507372126441214970999358314132226659275055927557999505011527820605715",
      "target": "2"
    }
  },
  {
    "case": {
      "name": "four-point-population",
      "mode": "population",
      "values": [
        "-1",
        "0",
        "1",
        "2"
      ],
      "targetMetric": "variance",
      "target": "2",
      "shift": "1"
    },
    "expected": {
      "mean": "0.5",
      "variance": "1.25",
      "standardDeviation": "1.1180339887498948482045868343656381177203091798057628621354486227052604628189024497072072041893911374847540880753868917521266338622235369317931800607667263544333890865959395829056383226613199282902679",
      "scale": "1.2649110640673517327995574177730874134878220557300867307430019411170377754556952885376992433517201180749389136611360220594195424121815520058762078386800615613379686628717039762636600613896453357936496",
      "target": "2"
    }
  },
  {
    "case": {
      "name": "weighted-sample",
      "mode": "sample",
      "values": [
        "0",
        "3"
      ],
      "frequencies": [
        "2",
        "1"
      ],
      "targetMetric": "standardDeviation",
      "target": "0.1",
      "shift": "0"
    },
    "expected": {
      "mean": "1",
      "variance": "3",
      "standardDeviation": "1.7320508075688772935274463415058723669428052538103806280558069794519330169088000370811461867572485756756261414154067030299699450949989524788116555120943736485280932319023055820679748201010846749232650",
      "scale": "0.057735026918962576450914878050195745564760175127012687601860232648397767230293334569371539558574952522520871380513556767665664836499965082627055183736479121617603107730076852735599160670036155830775501",
      "target": "0.1"
    }
  },
  {
    "case": {
      "name": "extreme-cancellation",
      "mode": "population",
      "values": [
        "1e100",
        "1",
        "-1e100"
      ],
      "targetMetric": "variance",
      "target": "1",
      "shift": "0"
    },
    "expected": {
      "mean": "0.33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333",
      "variance": "66666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666667",
      "standardDeviation": "8164965809277260327324280249019637973219824935522233761442308557503201258191050088466198110348800782.7286486707553806304161962181994591911387526131707909285094297091584255885708254336842363725674116044",
      "scale": "1.2247448713915890490986420373529456959829737403283350642163462836254801887286575132699297165523201174092973006133070945624294327299188786708128919756186392764144563737638382856238150526354558851117407E-100",
      "target": "1"
    }
  },
  {
    "case": {
      "name": "tiny-spread-large-scale",
      "mode": "population",
      "values": [
        "0",
        "2e-100"
      ],
      "targetMetric": "variance",
      "target": "1e100",
      "shift": "0"
    },
    "expected": {
      "mean": "1E-100",
      "variance": "1E-200",
      "standardDeviation": "1E-100",
      "scale": "1E+150",
      "target": "1E+100"
    }
  },
  {
    "case": {
      "name": "34digit-neighbor",
      "mode": "sample",
      "values": [
        "1000000000000000000000000000000000",
        "1000000000000000000000000000000001"
      ],
      "targetMetric": "variance",
      "target": "0.01",
      "shift": "0"
    },
    "expected": {
      "mean": "1000000000000000000000000000000000.5",
      "variance": "0.5",
      "standardDeviation": "0.70710678118654752440084436210484903928483593768847403658833986899536623923105351942519376716382078636750692311545614851246241802792536860632206074854996791570661133296375279637789997525057639103028574",
      "scale": "0.14142135623730950488016887242096980785696718753769480731766797379907324784621070388503875343276415727350138462309122970249248360558507372126441214970999358314132226659275055927557999505011527820605715",
      "target": "0.01"
    }
  },
  {
    "case": {
      "name": "exact-decimal-inputs",
      "mode": "sample",
      "values": [
        "0.1",
        "1.1",
        "1.11",
        "2.22"
      ],
      "targetMetric": "standardDeviation",
      "target": "7",
      "shift": "-2"
    },
    "expected": {
      "mean": "1.1325",
      "variance": "0.75009166666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666667",
      "standardDeviation": "0.86607832594209784131193811140698674280128296473710218286566180195611761162332857908590144026315197556897255273610420453217064054532311290654782953392271514399185076157986317300416321078157976733765153",
      "scale": "8.0824098586990721878662387217325533985077122838227087090150749757600603677727833979419983093293892910637249258238163314153085518222374469953691971925107011471170705772303947886757962588631056711249434",
      "target": "7"
    }
  }
] as const;
