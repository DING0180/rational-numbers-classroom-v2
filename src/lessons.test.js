import { describe, expect, it } from 'vitest';
import { LESSONS, getLesson } from './lessons.js';

describe('lesson definitions', () => {
  it('defines the four classroom lessons in navigation order', () => {
    expect(LESSONS.map(({ id }) => id)).toEqual([
      'number-line',
      'opposite',
      'absolute-value',
      'compare',
    ]);
  });

  it('returns the selected lesson by id', () => {
    expect(getLesson('opposite').labelEn).toBe('Opposite');
  });
});
