import { describe, expect, it } from 'vitest';
import { createQuestion } from './questions.js';

const deterministicRandom = (values) => {
  let index = 0;
  return () => values[index++ % values.length];
};

describe('Quick Check question templates', () => {
  it('keeps a Number → Point answer out of the public prompt', () => {
    const question = createQuestion(
      'number-line',
      { direction: 'number-to-point', difficulty: 'easy' },
      [],
      deterministicRandom([0.2, 0.4, 0.6, 0.8]),
    );

    expect(question.prompt).not.toContain('Answer:');
    expect(question.controls).toEqual(expect.arrayContaining(['number-to-point', 'easy', 'reveal']));
    expect(question.visual.points).toHaveLength(4);
  });

  it('uses only permitted Easy and Challenge number-line steps', () => {
    const easy = createQuestion('number-line', { direction: 'point-to-number', difficulty: 'easy' }, [], Math.random);
    const challenge = createQuestion('number-line', { direction: 'point-to-number', difficulty: 'challenge' }, [], Math.random);

    expect(easy.visual.points.every(({ value }) => (value.numerator * 2) % value.denominator === 0)).toBe(true);
    expect(challenge.visual.points.every(({ value }) => (value.numerator * 4) % value.denominator === 0)).toBe(true);
  });

  it.each(['opposite', 'absolute-value', 'compare'])('keeps the %s answer hidden before reveal', (lessonId) => {
    const question = createQuestion(lessonId, {}, [], deterministicRandom([0.1, 0.3, 0.5, 0.7]));
    expect(question.prompt).not.toContain('Answer:');
    expect(question.fingerprint).toBeTruthy();
  });

  it('avoids a recent exact fingerprint when another template candidate is available', () => {
    const first = createQuestion('opposite', {}, [], deterministicRandom([0.1, 0.2, 0.3, 0.4]));
    const next = createQuestion('opposite', {}, [first.fingerprint], deterministicRandom([0.1, 0.2, 0.3, 0.4, 0.7, 0.8]));
    expect(next.fingerprint).not.toBe(first.fingerprint);
  });
});
