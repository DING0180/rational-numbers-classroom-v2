import { absolute, compare, formatRational, negate, rational, rationalKey } from './rational.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const CONTROL_SETS = {
  'number-line': ['number-to-point', 'point-to-number', 'easy', 'challenge', 'new-question', 'reveal', 'next'],
  opposite: ['new-question', 'reveal', 'next'],
  'absolute-value': ['new-question', 'reveal', 'next'],
  compare: ['new-question', 'reveal', 'next'],
};

const randomInt = (random, minimum, maximum) => minimum + Math.floor(random() * (maximum - minimum + 1));
const pick = (random, values) => values[Math.min(values.length - 1, Math.floor(random() * values.length))];
const signText = (value) => (value < 0 ? '−' : '+');

function valuesForStep(step) {
  const totalSteps = 10 / step;
  return Array.from({ length: totalSteps + 1 }, (_, index) => rational(Math.round((-5 + index * step) * 100), 100));
}

function chooseSpacedPoints(random, step, count) {
  const candidates = valuesForStep(step);
  const chosen = [];
  const remaining = [...candidates];

  while (chosen.length < count && remaining.length) {
    const candidate = remaining.splice(randomInt(random, 0, remaining.length - 1), 1)[0];
    if (chosen.every((point) => Math.abs(point.numerator / point.denominator - candidate.numerator / candidate.denominator) >= step * 2)) {
      chosen.push(candidate);
    }
  }

  return chosen.sort((left, right) => compare(left, right));
}

function numberLineQuestion(options, random) {
  const direction = options.direction === 'point-to-number' ? 'point-to-number' : 'number-to-point';
  const difficulty = options.difficulty === 'challenge' ? 'challenge' : 'easy';
  const step = difficulty === 'challenge' ? 0.25 : 0.5;
  const pointCount = 4 + randomInt(random, 0, 3);
  const values = chooseSpacedPoints(random, step, pointCount);
  const points = values.map((value, index) => ({ letter: LETTERS[index], value }));
  const target = pick(random, points);
  const targetValue = formatRational(target.value);

  return {
    id: 'number-line',
    prompt: direction === 'number-to-point'
      ? `Which point represents ${targetValue}?`
      : `Point ${target.letter} represents what number?`,
    answer: direction === 'number-to-point' ? target.letter : targetValue,
    explanation: direction === 'number-to-point'
      ? `${targetValue} corresponds to point ${target.letter}.`
      : `Point ${target.letter} is at ${targetValue}.`,
    fingerprint: `number-line:${direction}:${difficulty}:${points.map((point) => `${point.letter}${rationalKey(point.value)}`).join(',')}:${target.letter}`,
    controls: CONTROL_SETS['number-line'],
    visual: { step, points, targetLetter: target.letter, direction, difficulty },
  };
}

function sourceValue(random) {
  const kind = pick(random, ['integer', 'decimal', 'fraction']);
  if (kind === 'integer') return rational(pick(random, [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]));
  if (kind === 'decimal') return rational(pick(random, [-25, -15, -5, 5, 15, 25, 35]), 10);
  return rational(pick(random, [-5, -4, -3, -2, 2, 3, 4, 5]), pick(random, [2, 3, 4]));
}

function oppositeQuestion(random) {
  const value = sourceValue(random);
  const layers = randomInt(random, 2, 4);
  const signs = Array.from({ length: layers }, () => pick(random, [-1, 1]));
  const multiplier = signs.reduce((total, sign) => total * sign, 1);
  const answerValue = multiplier === -1 ? negate(value) : value;
  const body = formatRational(value);
  const expression = signs.reduceRight((inner, sign) => `${signText(sign)}(${inner})`, body);

  return {
    id: 'opposite',
    prompt: `Simplify: ${expression}`,
    answer: formatRational(answerValue),
    explanation: `${expression} = ${formatRational(answerValue)}`,
    fingerprint: `opposite:${rationalKey(value)}:${signs.join('')}`,
    controls: CONTROL_SETS.opposite,
  };
}

function absoluteValueQuestion(random) {
  const value = sourceValue(random);
  const innerSign = pick(random, [-1, 1]);
  const outerSign = pick(random, [-1, 1]);
  const inner = innerSign === -1 ? negate(value) : value;
  const answerValue = outerSign === -1 ? negate(absolute(inner)) : absolute(inner);
  const expression = `${signText(outerSign)}|${signText(innerSign)}(${formatRational(value)})|`;

  return {
    id: 'absolute-value',
    prompt: `Simplify: ${expression}`,
    answer: formatRational(answerValue),
    explanation: `Inside: ${formatRational(inner)}; |${formatRational(inner)}| = ${formatRational(absolute(inner))}; result: ${formatRational(answerValue)}.`,
    fingerprint: `absolute:${rationalKey(value)}:${innerSign}:${outerSign}`,
    controls: CONTROL_SETS['absolute-value'],
  };
}

function compareQuestion(random) {
  const left = sourceValue(random);
  let right = sourceValue(random);
  if (compare(left, right) === 0) right = rational(right.numerator + right.denominator, right.denominator);
  const relation = compare(left, right) < 0 ? '<' : '>';
  const leftText = formatRational(left);
  const rightText = formatRational(right);

  return {
    id: 'compare',
    prompt: `Compare: ${leftText}  □  ${rightText}`,
    answer: relation,
    explanation: `${leftText} ${relation} ${rightText}; therefore the symbol is ${relation}.`,
    fingerprint: `compare:${rationalKey(left)}:${rationalKey(right)}`,
    controls: CONTROL_SETS.compare,
  };
}

const BUILDERS = {
  'number-line': (options, random) => numberLineQuestion(options, random),
  opposite: (_options, random) => oppositeQuestion(random),
  'absolute-value': (_options, random) => absoluteValueQuestion(random),
  compare: (_options, random) => compareQuestion(random),
};

export function createQuestion(lessonId, options = {}, recentFingerprints = [], random = Math.random) {
  const build = BUILDERS[lessonId];
  if (!build) throw new RangeError(`Unknown lesson: ${lessonId}`);

  let candidate = build(options, random);
  for (let attempt = 0; attempt < 20 && recentFingerprints.includes(candidate.fingerprint); attempt += 1) {
    candidate = build(options, random);
  }
  return candidate;
}
