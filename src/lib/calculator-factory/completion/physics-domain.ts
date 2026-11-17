/** Observed implementation contracts only; these are not adopted physical units or methodology. */
export type PhysicsObservedDomain = {
  minimum: number;
  maximum: number;
  excludesZero: boolean;
  unit: null;
};
const signed = { minimum: -1e100, maximum: 1e100, excludesZero: false, unit: null } as const;
const nonnegative = { minimum: 0, maximum: 1e100, excludesZero: false, unit: null } as const;
const positive = { ...nonnegative, excludesZero: true } as const;
export const physicsObservedContracts = {
  322: {
    expression: 'charge / voltage',
    fields: { charge: signed, voltage: { ...signed, excludesZero: true } },
    zeroPolicy: 'Historical binary64 quotient may round nonzero results to zero',
    angleEncoding: null,
    privateSuccessor: false,
  },
  323: {
    expression: '8.9875517923e9 * charge1 * charge2 / (distance * distance)',
    fields: { charge1: signed, charge2: signed, distance: positive },
    zeroPolicy: 'Private scaled evaluation rejects nonzero results rounded to zero; zero charge accepted',
    angleEncoding: null,
    privateSuccessor: true,
  },
  324: {
    expression: 'speed * speed * sin(2 * angle * PI / 180) / gravity',
    fields: { speed: nonnegative, angle: { ...nonnegative, maximum: 90 }, gravity: positive },
    zeroPolicy: 'Private scaled evaluation rejects nonzero results rounded to zero; zero speed or zero angle accepted',
    angleEncoding: 'degrees; 90 degree binary64 sine residual retained',
    privateSuccessor: true,
  },
  325: {
    expression: '0.5 * gravity * time * time',
    fields: { time: nonnegative, gravity: nonnegative },
    zeroPolicy: 'Historical left-to-right binary64 multiplication may underflow before final result',
    angleEncoding: null,
    privateSuccessor: false,
  },
  327: {
    expression: 'angle / time',
    fields: { angle: signed, time: positive },
    zeroPolicy: 'Historical binary64 quotient may round nonzero results to zero',
    angleEncoding: 'unspecified scalar angular displacement; radians not inferred',
    privateSuccessor: false,
  },
} as const;
