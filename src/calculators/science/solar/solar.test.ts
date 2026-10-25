import { describe, expect, it } from 'vitest';
import { solarPosition } from '../solar-position';
import { sunEvents } from '../sun-events';
describe('SSC approximate geometric solar model', () => {
 it('agrees with published NREL SPA example within 0.05 degrees (geometric)', () => {
  const p = solarPosition({instant:'2003-10-17T19:30:30Z',latitude:39.742476,longitude:-105.1786});
  expect(Math.abs(p.azimuthDegrees! - 194.340241)).toBeLessThan(0.05);
  // SPA apparent zenith 50.111622 includes about .016 degrees refraction.
  expect(Math.abs(p.zenithDegrees - 50.12795)).toBeLessThan(0.05);
 });
 it('uses actual UTC instants, including offset rollover', () => {
  expect(solarPosition({instant:'2024-02-29T23:30:00-07:00',latitude:-33.86,longitude:151.21})).toEqual(solarPosition({instant:'2024-03-01T06:30:00Z',latitude:-33.86,longitude:151.21}));
 });
 it('rejects ambiguous time and unsupported inputs', () => {
  for (const instant of ['2024-01-01T12:00:00','2101-01-01T00:00:00Z','2024-02-30T00:00:00Z']) expect(() => solarPosition({instant,latitude:0,longitude:0})).toThrow();
  expect(() => solarPosition({instant:'2024-01-01T00:00:00Z',latitude:91,longitude:0})).toThrow();
 });
 it('returns events within the requested fixed-offset civil day', () => {
  const e = sunEvents({date:'2024-03-20',latitude:51.4779,longitude:0,utcOffsetMinutes:0});
  expect(e.status).toBe('events');
  expect(e.sunriseUtc!.slice(0,13)).toBe('2024-03-20T06');
  expect(e.sunsetUtc!.slice(0,13)).toBe('2024-03-20T18');
  const f = sunEvents({date:'2024-01-01',latitude:-33.86,longitude:151.21,utcOffsetMinutes:660});
  expect(f.sunriseUtc!.startsWith('2023-12-31')).toBe(true);
 });
 it('distinguishes continuous polar daylight and night', () => {
  expect(sunEvents({date:'2024-06-21',latitude:78,longitude:15}).status).toBe('polar-day');
  expect(sunEvents({date:'2024-12-21',latitude:78,longitude:15}).status).toBe('polar-night');
 });
});

import oracle from './spa-oracle.json';
it.each(oracle)('independent pvlib SPA geometric oracle $instant ($latitude,$longitude)', row => {
 const p = solarPosition(row);
 expect(Math.abs(p.zenithDegrees-row.zenithDegrees)).toBeLessThan(0.05);
 const delta = Math.abs(p.azimuthDegrees!-row.azimuthDegrees);
 expect(Math.min(delta,360-delta)).toBeLessThan(0.1);
});
it('has undefined geographical azimuth at the poles', () => {
 expect(solarPosition({instant:'2024-06-21T12:00:00Z',latitude:90,longitude:0}).azimuthDegrees).toBeNull();
});
import eventOracle from './spa-events-oracle.json';
it.each(eventOracle)('SPA independent geometric horizon crossings $date ($latitude,$longitude)', row => {
 const e = sunEvents(row);
 expect(Math.abs(Date.parse(e.sunriseUtc!)-Date.parse(row.sunriseUtc))).toBeLessThan(60000);
 expect(Math.abs(Date.parse(e.sunsetUtc!)-Date.parse(row.sunsetUtc))).toBeLessThan(60000);
});
