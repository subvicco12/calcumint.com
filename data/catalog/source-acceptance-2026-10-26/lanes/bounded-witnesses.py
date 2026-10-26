#!/usr/bin/env python3
"""Synthetic exact-rational candidate witnesses; never production-engine acceptance."""
import json
from fractions import Fraction as F
from pathlib import Path
# Each expected is a literal independent value, not calculated from the formula under test.
CASES = {
21:[('equal_horizon', '1200-(1100+50)','50'),('fees_reverse_saving','1200-(1100+150)','-50'),('equal_cost','1200-(1100+100)','0')],
32:[('discounted_terminal','1000+(220-110)/F("1.1")-100/F("1.1")','11100/11'),('zero_discount','(120-80)-50','-10'),('equal_flows','100/F("1.1")-100/F("1.1")','0')],
35:[('separate_escrow','2000+500+1000+300-250','3550'),('credit_exceeds_items','100-150','-50'),('no_items','0','0')],
36:[('annual','20000-1000-7000-8000-1000','3000'),('negative_cash','10000-1000-3000-8000-1000','-3000'),('no_debt','20000-1000-7000','12000')],
43:[('cash_on_cash_fraction','F(5000)/100000','1/20'),('holding_fraction','F(20000+110000-100000)/100000','3/10'),('loss_fraction','F(-5000)/100000','-1/20')],
46:[('all_cost_categories','250000-150000-40000-5000-10000-5000-10000','30000'),('loss','200000-150000-40000-30000','-20000'),('break_even','220000-150000-40000-30000','0')],
49:[('balance','100000*(1+F(".005"))-1000','99500'),('cash_separate','1500-200-100-1000','200'),('negative_amortization','100000*(1+F(".005"))-400','100100')],
80:[('two_end_periods','110/F("1.1")+121/F("1.1")**2','200'),('terminal','100+100+50','250'),('benefits_reduce_need','(100-20)+(100-20)','160')],
81:[('end_period_nonzero','100*F("1.1")**2+10*(F("1.1")**2-1)/F(".1")','142'),('zero_rate','100+12*10','220'),('no_contribution','100*F("1.1")**2','121')],
82:[('first_crossing','next(n for n in range(6) if 100+10*n>=130)','3'),('already_met','next(n for n in range(6) if 150>=130)','0'),('none_in_horizon','next((n for n in range(3) if 100+10*n>=130),None)',None)],
84:[('inflation','100*F("1.1")**2','121'),('zero_years','100*F("1.1")**0','100'),('deflation','100*F(".9")**2','81')],
85:[('end_period','1000*F("1.05")-100','950'),('beginning_variant','(1000-100)*F("1.05")','945'),('indexed_second_withdrawal','950*F("1.05")-100*F("1.02")','1791/2')],
86:[('exact_zero_period','longevity(200,100,3)[0]','2'),('shortfall_after_exact_zero','longevity(200,100,3)[1]','3'),('partial_last_payment','longevity(250,100,3)[2]','50'),('none_within_horizon','longevity(1000,100,3)[1]',None)],
89:[('discount','121/F("1.1")**2','100'),('zero_years','121/F("1.1")**0','121'),('zero_rate','121/F(1)**2','121')],
134:[('positive_base_percent','100*F(2000)/10000','20'),('negative_tax_supplied','100*F(-500)/10000','-5'),('zero_tax','100*F(0)/10000','0')],
173:[('conditional_and_unconditional','(F(".5")*(100-20)-10)/F("1.1")-20','80/11'),('unconditional_not_survival_weighted','(0*(100-20)-10)/F("1.1")-20','-320/11'),('zero_horizon','-20','-20')],
204:[('rate_change','(2000-100*F(".2")*35)-(2000-100*F(".1")*35)','-350'),('full_return_profit','100*(50-30)-100*(50+5+0-20)','-1500'),('no_sales','0*(50-30)-0*F(".2")*35','0')],
468:[('zero_rate','(600-200)*60','24000'),('positive_rate','400*(1-F("1.01")**(-2))/F(".01")','8040000/10201'),('no_budget','0*60','0')],
470:[('lease_minus_buy','(12000+1000)-(25000-14000)','2000'),('terminal_debt','13000-(25000-(14000-4000))','-2000'),('discounted','(1000+110/F("1.1"))-(1200-110/F("1.1"))','0')],
472:[('equal_pv','1100/F("1.1")-1000','0'),('fee_at_origination','50+1100/F("1.1")-1000','50'),('zero_discount','1100-1000','100')],
488:[('no_extra_aux','12000/F(".8")*F(".08")-12000/F(3)*F(".25")','200'),('aux_outside_scop','12000/F(".8")*F(".08")-(12000/F(3)+100)*F(".25")','175'),('zero_load','0/F(".8")*F(".08")-0/F(3)*F(".25")','0')],
516:[('supplied_eligible_points','(F("2.7")*3+F("3.7")*4+F("3.3")*3)/10','82/25'),('zero_point_course_included','(4*3+0*3)/F(6)','2'),('excluded_course_removed','4*3/F(3)','4')]
}
def longevity(balance,withdrawal,horizon):
    exact=short=None; last=0
    for t in range(1,horizon+1):
        available=balance
        if available<withdrawal and short is None: short=t
        last=min(available,withdrawal); balance=available-last
        if balance==0 and exact is None: exact=t
    return exact,short,last

def run():
    result={}
    env={'F':F,'range':range,'next':next,'longevity':longevity}
    for ident,cases in CASES.items():
        result[ident]=[]
        for label,expression,expected in cases:
            actual=eval(expression,{'__builtins__':{}},env)
            assert actual is None if expected is None else F(actual)==F(expected),(ident,label,actual,expected)
            result[ident].append({'case':label,'expression':expression,'expectedRational':expected,'actualRational':None if actual is None else str(F(actual)), 'result':'PASS','scope':'SYNTHETIC_CANDIDATE_ONLY_NOT_ENGINE_ACCEPTANCE'})
    return result
if __name__=='__main__':
    r=run(); print(json.dumps({'ids':len(r),'numericCases':sum(map(len,r.values())),'result':'PASS','scope':'EXACT_RATIONAL_CANDIDATE_ONLY'}))
