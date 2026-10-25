/** Approximate geometric SSC solarpos model. See solar/PROVENANCE.md. */
export interface SolarPositionInput { instant: string; latitude: number; longitude: number }
const rad = Math.PI / 180;
const wrap = (v: number, period: number) => ((v % period) + period) % period;
export function solarPosition(input: SolarPositionInput) {
  const {latitude, longitude, instant} = input;
  if (!Number.isFinite(latitude) || Math.abs(latitude)>90 || !Number.isFinite(longitude) || Math.abs(longitude)>180) throw new RangeError('Latitude [-90,90], east-positive longitude [-180,180] required');
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(instant)) throw new RangeError('ISO instant with explicit UTC offset required');
  const civil = instant.slice(0,10);
  const calendar = new Date(civil+'T00:00:00Z');
  const date = new Date(instant);
  if (!Number.isFinite(date.getTime()) || calendar.toISOString().slice(0,10)!==civil || date.getUTCFullYear()<1950 || date.getUTCFullYear()>2050) throw new RangeError('Valid Gregorian instant in 1950–2050 required');
  const days = date.getTime()/86400000 + 2440587.5 - 2451545;
  const utcHours = (date.getTime()-Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),date.getUTCDate()))/3600000;
  const meanLongitude = wrap(280.46+0.9856474*days,360);
  const anomaly = wrap(357.528+0.9856003*days,360)*rad;
  const ecliptic = wrap(meanLongitude+1.915*Math.sin(anomaly)+0.020*Math.sin(2*anomaly),360)*rad;
  const obliquity = (23.439-0.0000004*days)*rad;
  const rightAscension = Math.atan2(Math.cos(obliquity)*Math.sin(ecliptic),Math.cos(ecliptic));
  const declination = Math.asin(Math.sin(obliquity)*Math.sin(ecliptic));
  const sidereal = wrap(6.697375+0.0657098242*days+utcHours,24);
  const hourAngle = (wrap(sidereal*15+longitude-rightAscension/rad+180,360)-180)*rad;
  const phi = latitude*rad;
  const up = Math.sin(phi)*Math.sin(declination)+Math.cos(phi)*Math.cos(declination)*Math.cos(hourAngle);
  const east = -Math.cos(declination)*Math.sin(hourAngle);
  const north = Math.cos(phi)*Math.sin(declination)-Math.sin(phi)*Math.cos(declination)*Math.cos(hourAngle);
  const elevationDegrees = Math.atan2(up,Math.hypot(east,north))/rad;
  // At a pole geographical azimuth has no unique north reference; vertical rays also have no azimuth.
  const azimuthDegrees = Math.abs(latitude)===90 || Math.hypot(east,north)<1e-10 ? null : wrap(Math.atan2(east,north)/rad,360);
  return {elevationDegrees, zenithDegrees:90-elevationDegrees, azimuthDegrees, declinationDegrees:declination/rad};
}
