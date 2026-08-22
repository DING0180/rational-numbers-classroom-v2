import { formatRational, rational } from './rational.js';

const DOMAIN_START = -5;
const DOMAIN_END = 5;
const WIDTH = 1200;
const PADDING = 80;

const numericValue = (value) => value.numerator / value.denominator;

export function valueToX(value, domainStart, domainEnd, width, padding) {
  return padding + ((value - domainStart) / (domainEnd - domainStart)) * (width - 2 * padding);
}

function tickValues(step) {
  const count = Math.round((DOMAIN_END - DOMAIN_START) / step);
  return Array.from({ length: count + 1 }, (_, index) => DOMAIN_START + index * step);
}

export function renderNumberLineSvg(question) {
  const { step, points } = question.visual;
  const ticks = tickValues(step);
  const labelEvery = step === 0.25 ? 2 : 1;
  const sortedPoints = [...points].sort((left, right) => numericValue(left.value) - numericValue(right.value));

  const tickMarkup = ticks.map((tick, index) => {
    const x = valueToX(tick, DOMAIN_START, DOMAIN_END, WIDTH, PADDING);
    const label = formatRational(rational(Math.round(tick * 100), 100));
    const showLabel = index % labelEvery === 0;
    return `<line class="tick" x1="${x}" y1="170" x2="${x}" y2="190" />${showLabel ? `<text class="tick-label" x="${x}" y="240">${label}</text>` : ''}`;
  }).join('');

  const pointMarkup = sortedPoints.map((point, index) => {
    const x = valueToX(numericValue(point.value), DOMAIN_START, DOMAIN_END, WIDTH, PADDING);
    const labelY = index % 2 === 0 ? 78 : 118;
    return `<line class="point-stem" x1="${x}" y1="${labelY + 12}" x2="${x}" y2="154" /><circle class="number-point" cx="${x}" cy="180" r="11" /><text class="point-label" x="${x}" y="${labelY}">${point.letter}</text>`;
  }).join('');

  return `<svg class="number-line-svg" viewBox="0 0 1200 320" role="img" aria-label="Number line from negative five to five with labelled points"><title>Number line from −5 to 5</title><line class="axis" x1="${PADDING}" y1="180" x2="${WIDTH - PADDING}" y2="180" />${tickMarkup}${pointMarkup}</svg>`;
}
