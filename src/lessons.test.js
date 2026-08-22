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

  it('provides the classroom fields for every lesson', () => {
    LESSONS.forEach((lesson) => {
      expect(lesson).toEqual(expect.objectContaining({
        labelZh: expect.any(String),
        labelEn: expect.any(String),
        explore: expect.any(Object),
        quickCheck: expect.any(Object),
      }));
    });
  });

  it('returns the selected lesson by id', () => {
    expect(getLesson('opposite').labelEn).toBe('Opposite');
  });
});
