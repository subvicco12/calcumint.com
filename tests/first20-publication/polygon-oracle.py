"""Independent Decimal120 Machin pi / Taylor sin-cos oracle, not application math."""
import json, math, hashlib
from decimal import Decimal, localcontext
from pathlib import Path

def atan(x):
    value=x; term=x; k=1
    while True:
        term=-term*x*x; candidate=value+term/Decimal(2*k+1)
        if candidate==value:return value
        value=candidate;k+=1

def tangent(x):
    sine=x; term=x; k=1
    while True:
        term=-term*x*x/Decimal((2*k)*(2*k+1)); candidate=sine+term
        if candidate==sine:break
        sine=candidate;k+=1
    cosine=Decimal(1);term=Decimal(1);k=1
    while True:
        term=-term*x*x/Decimal((2*k-1)*(2*k));candidate=cosine+term
        if candidate==cosine:break
        cosine=candidate;k+=1
    return sine/cosine

with localcontext() as ctx:
    ctx.prec=120
    pi=16*atan(Decimal(1)/5)-4*atan(Decimal(1)/239)
    cases=[]
    vectors=[(n,4.0,'ordinary') for n in [3,4,5,6,8,12,1000,9007199254740991]]+[(3,1e154,'reported-false-overflow')]
    for n in range(3,13):
        coefficient=Decimal(n)/(4*tangent(pi/n))
        side=float((Decimal.from_float(float.fromhex('0x1.fffffffffffffp+1023'))*Decimal('.95')/coefficient).sqrt())
        vectors.append((n,side,'near-finite-edge'))
    vectors.extend([(9007199254740991,1e-9,'large-side-count-minimum-side'),(3,1e-9,'minimum-side'),(3,1e308,'true-nonfinite'),(9007199254740991,1e154,'true-nonfinite')])
    for n,side,label in vectors:
        s=Decimal.from_float(side);value=Decimal(n)*s*s/(4*tangent(pi/n));rounded=float(value)
        cases.append({'label':label,'input':{'sides':n,'side':side},'reference':str(value),'expectedFinite':math.isfinite(rounded),'nearestBinary64':rounded if math.isfinite(rounded) else None})
    print(json.dumps({'oracle':'Python Decimal120, Machin pi and independent Taylor trigonometry at exact binary64 inputs','oracleSHA256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'cases':cases},indent=2,allow_nan=False))
