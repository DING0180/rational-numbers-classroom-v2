import { describe, expect, it } from 'vitest';
import { createInitialState, reduceState, renderApp } from './main.js';

describe('classroom state', () => {
  it('switches lesson while preserving the mode', () => {
    const state = reduceState(
      { lessonId: 'number-line', mode: 'quick-check' },
      { type: 'select-lesson', lessonId: 'absolute-value' },
    );

    expect(state).toEqual({ lessonId: 'absolute-value', mode: 'quick-check' });
  });

  it('switches mode while preserving the lesson', () => {
    const state = reduceState(
      { lessonId: 'opposite', mode: 'explore' },
      { type: 'select-mode', mode: 'quick-check' },
    );

    expect(state).toEqual({ lessonId: 'opposite', mode: 'quick-check' });
  });

  it('renders one active lesson and an active Explore button initially', () => {
    const html = renderApp(createInitialState());

    expect(html).toContain('aria-current="page"');
    expect(html).toContain('data-mode="explore" aria-pressed="true"');
  });

  it('renders the selected mode placeholder in the classroom stage', () => {
    const html = renderApp({ lessonId: 'absolute-value', mode: 'quick-check' });

    expect(html).toContain('data-stage');
    expect(html).toContain('Quick Check');
  });
});
