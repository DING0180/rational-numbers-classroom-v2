import { expect, it } from 'vitest';
import { renderNumberLineSvg, valueToX } from './number-line-svg.js';

it('maps number-line endpoints and zero exactly', () => {
  expect(valueToX(-5, -5, 5, 1000, 80)).toBe(80);
  expect(valueToX(0, -5, 5, 1000, 80)).toBe(500);
  expect(valueToX(5, -5, 5, 1000, 80)).toBe(920);
});

it('renders independent tick and point-label bands', () => {
  const markup = renderNumberLineSvg({
    visual: {
      step: 0.5,
      points: [{ letter: 'A', value: { numerator: -1, denominator: 2 } }],
    },
  });

  expect(markup).toContain('class="tick-label"');
  expect(markup).toContain('class="point-label"');
  expect(markup).toContain('viewBox="0 0 1200 320"');
});

it('uses reduced major-tick labels rather than unreduced hundredths', () => {
  const markup = renderNumberLineSvg({ visual: { step: 0.5, points: [] } });
  expect(markup).toContain('>−5</text>');
  expect(markup).not.toContain('−500/100');
});
