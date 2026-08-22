const gcd = (left, right) => {
  let a = Math.abs(left);
  let b = Math.abs(right);

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a || 1;
};

export function rational(numerator, denominator = 1) {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) {
    throw new TypeError('Rational values require integer numerator and non-zero denominator.');
  }

  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);

  return {
    numerator: (numerator * sign) / divisor,
    denominator: Math.abs(denominator) / divisor,
  };
}

export const negate = (value) => rational(-value.numerator, value.denominator);
export const absolute = (value) => rational(Math.abs(value.numerator), value.denominator);

export function compare(left, right) {
  const difference = left.numerator * right.denominator - right.numerator * left.denominator;
  return Math.sign(difference);
}

export const equals = (left, right) => compare(left, right) === 0;

export function formatRational(value) {
  if (value.denominator === 1) return String(value.numerator).replace('-', '−');
  if ([2, 4, 5, 10].includes(value.denominator)) {
    return String(value.numerator / value.denominator).replace('-', '−');
  }
  return `${value.numerator < 0 ? '−' : ''}${Math.abs(value.numerator)}/${value.denominator}`;
}

export const rationalKey = (value) => `${value.numerator}/${value.denominator}`;
