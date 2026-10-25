"""Reproduce independent fixtures: PYTHONPATH=/tmp/solar-oracle python generate-oracle.py.
Install pvlib==0.13.1 separately; this is never a production dependency.
"""
import json
from pathlib import Path
import pandas as pd
import pvlib
assert pvlib.__version__ == '0.13.1'
cases = [
 ('2003-10-17T19:30:30Z',39.742476,-105.1786),
 ('2024-02-29T23:30:00Z',-33.86,151.21),
 ('2024-03-01T06:30:00Z',-33.86,151.21),
 ('2024-06-21T12:00:00Z',78,15),
 ('2024-12-21T12:00:00Z',78,15),
 ('1950-01-01T00:00:00Z',40,-75),
 ('2050-12-31T23:59:00Z',-34,18),
]
result=[]
for instant,lat,lon in cases:
 p=pvlib.solarposition.spa_python(pd.DatetimeIndex([instant]),lat,lon,altitude=0,pressure=0,delta_t=67)
 result.append(dict(instant=instant,latitude=lat,longitude=lon,zenithDegrees=float(p.zenith.iloc[0]),azimuthDegrees=float(p.azimuth.iloc[0])))
Path(__file__).with_name('spa-oracle.json').write_text(json.dumps(result,indent=2)+'\n')
from scipy.optimize import brentq
from datetime import datetime, timezone
cases=[('2024-03-20',51.4779,0,0),('2024-01-01',-33.86,151.21,660),('2024-02-29',40,-75,-300)]
events=[]
for day,lat,lon,offset in cases:
 start=pd.Timestamp(day,tz='UTC')-pd.Timedelta(minutes=offset)
 times=pd.date_range(start,periods=1441,freq='min')
 heights=pvlib.solarposition.spa_python(times,lat,lon,altitude=0,pressure=0,delta_t=67).elevation.to_numpy()+0.833
 row=dict(date=day,latitude=lat,longitude=lon,utcOffsetMinutes=offset)
 def height(t):
  return float(pvlib.solarposition.spa_python(pd.DatetimeIndex([pd.Timestamp(t,unit='s',tz='UTC')]),lat,lon,altitude=0,pressure=0,delta_t=67).elevation.iloc[0])+0.833
 for i in range(1440):
  if heights[i]*heights[i+1]<0:
   t=brentq(height,times[i].timestamp(),times[i+1].timestamp())
   row['sunriseUtc' if heights[i+1]>heights[i] else 'sunsetUtc']=datetime.fromtimestamp(t,timezone.utc).isoformat()
 events.append(row)
Path(__file__).with_name('spa-events-oracle.json').write_text(json.dumps(events,indent=2)+'\n')
# Validate independent oracle against Reda/Andreas published SPA example.
p= pvlib.solarposition.spa_python(pd.DatetimeIndex(['2003-10-17T19:30:30Z']),39.742476,-105.1786,altitude=1830,pressure=82000,temperature=11,delta_t=67)
assert abs(float(p.apparent_zenith.iloc[0])-50.111622)<0.000001
assert abs(float(p.azimuth.iloc[0])-194.340241)<0.000001
