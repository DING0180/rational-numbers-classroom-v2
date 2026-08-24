import { describe, expect, it } from 'vitest';
import { createInitialState, reduceState, renderApp } from './main.js';

describe('Quick Check state', () => {
  it('renders no Explore control or secondary mode switcher', () => {
    const html = renderApp(createInitialState(() => 0.3));
    expect(html).not.toContain('Explore');
    expect(html).not.toContain('data-mode');
    expect(html).toContain('Quick Check');
  });

  it('keeps the answer panel hidden until reveal', () => {
    const initial = createInitialState(() => 0.3);
    const revealed = reduceState(initial, { type: 'reveal' }, () => 0.3);
    expect(renderApp(initial)).not.toContain('answer-panel--visible');
    expect(renderApp(revealed)).toContain('answer-panel--visible');
  });

  it('renders difficulty controls for every lesson but direction controls only for Number Line', () => {
    const numberLine = renderApp(createInitialState(() => 0.3));
    const opposite = renderApp(reduceState(createInitialState(() => 0.3), { type: 'select-lesson', lessonId: 'opposite' }, () => 0.5));
    expect(numberLine).toContain('data-direction="number-to-point"');
    expect(numberLine).toContain('data-difficulty="challenge"');
    expect(opposite).not.toContain('data-direction');
    expect(opposite).toContain('data-difficulty="challenge"');
  });

  it('groups lesson settings and teacher actions without changing their controls', () => {
    const html = renderApp(createInitialState(() => 0.3));
    expect(html).toContain('class="control-group control-group--settings"');
    expect(html).toContain('class="control-group control-group--actions"');
    expect(html).toContain('data-direction="number-to-point"');
    expect(html).toContain('data-difficulty="easy"');
    expect(html).toContain('data-action="reveal"');
  });
});
