import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('layout contract', () => {
  const css = fs.readFileSync(new URL('./styles.css', import.meta.url), 'utf8');

  it('uses the specified responsive sidebar width and a flexible workspace', () => {
    expect(css).toContain('clamp(220px, 18vw, 280px)');
    expect(css).toContain('minmax(0, 1fr)');
  });

  it('sets a 52px minimum touch target for classroom buttons', () => {
    expect(css).toMatch(/min-height:\s*52px/);
  });

  it('reserves independent Quick Check answer and SVG containers without a mode switcher', () => {
    expect(css).toContain('.answer-panel');
    expect(css).toContain('.number-line-svg');
    expect(css).not.toContain('.mode-switcher');
  });
});
