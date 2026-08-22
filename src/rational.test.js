import { describe, expect, it } from 'vitest';
import {
  absolute,
  compare,
  equals,
  formatRational,
  negate,
  rational,
} from './rational.js';

describe('rational', () => {
  it('normalizes signs and common factors', () => {
    expect(rational(-6, -8)).toEqual({ numerator: 3, denominator: 4 });
    expect(rational(6, -8)).toEqual({ numerator: -3, denominator: 4 });
  });

  it('negates, takes absolute values, and compares exactly', () => {
    expect(negate(rational(3, 4))).toEqual({ numerator: -3, denominator: 4 });
    expect(absolute(rational(-3, 4))).toEqual({ numerator: 3, denominator: 4 });
    expect(compare(rational(1, 2), rational(2, 3))).toBe(-1);
    expect(equals(rational(4, 6), rational(2, 3))).toBe(true);
  });

  it('formats every classroom value as an integer or finite decimal', () => {
    expect(formatRational(rational(-3, 4))).toBe('−0.75');
    expect(formatRational(rational(3, 2))).toBe('1.5');
    expect(formatRational(rational(2))).toBe('2');
  });
});
