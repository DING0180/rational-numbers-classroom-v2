import { expect, test } from '@playwright/test';

const lessons = [
  { id: 'number-line', name: 'Number Line' },
  { id: 'opposite', name: 'Opposite' },
  { id: 'absolute-value', name: 'Absolute Value' },
  { id: 'compare', name: 'Comparing Rational Numbers' },
];
const viewports = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1280x720', width: 1280, height: 720 },
];

async function expectGeometry(page, viewport) {
  const result = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('button')].map((element) => {
      const box = element.getBoundingClientRect();
      return { label: element.textContent.trim(), left: box.left, right: box.right, top: box.top, bottom: box.bottom, height: box.height };
    });
    const collision = boxes.some((box, index) => boxes.slice(index + 1).some((other) => box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top));
    const stage = document.querySelector('[data-stage]').getBoundingClientRect();
    const sidebar = document.querySelector('.sidebar').getBoundingClientRect();
    const controls = document.querySelector('.teacher-controls').getBoundingClientRect();
    const question = document.querySelector('.question-panel').getBoundingClientRect();
    const answer = document.querySelector('[data-answer-panel]').getBoundingClientRect();
    const groups = [...document.querySelectorAll('.control-group')]
      .map((element) => element.getBoundingClientRect());
    const overflow = [...document.querySelectorAll('body *')].some((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none' && box.width > 0 && box.height > 0 && (box.left < -1 || box.right > innerWidth + 1 || box.top < -1 || box.bottom > innerHeight + 1);
    });
    return { scrollWidth: document.documentElement.scrollWidth, buttonHeights: boxes.map(({ height }) => height), collision, overflow, stage, sidebar, controls, question, answer, groups };
  });
  expect(result.scrollWidth).toBe(viewport.width);
  expect(result.buttonHeights.every((height) => height >= 52)).toBe(true);
  expect(result.collision).toBe(false);
  expect(result.overflow).toBe(false);
  expect(result.stage.width).toBeGreaterThan(result.sidebar.width * 3);
  expect(result.groups).toHaveLength(2);
  for (const box of [result.question, result.answer]) {
    expect(box.left).toBeGreaterThanOrEqual(result.stage.left - 1);
    expect(box.top).toBeGreaterThanOrEqual(result.stage.top - 1);
    expect(box.right).toBeLessThanOrEqual(result.stage.right + 1);
    expect(box.bottom).toBeLessThanOrEqual(result.stage.bottom + 1);
  }
  expect(result.groups.every((box) => box.width > 0 && box.height > 0)).toBe(true);
  expect(
    result.answer.bottom <= result.controls.top + 1
      || result.answer.top >= result.controls.bottom - 1
      || result.answer.right <= result.controls.left + 1
      || result.answer.left >= result.controls.right - 1,
  ).toBe(true);
  expect(result.stage.width * result.stage.height).toBeGreaterThan(result.controls.width * result.controls.height);
}

for (const viewport of viewports) {
  test(`Quick Check remains touch-safe at ${viewport.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByText('Explore')).toHaveCount(0);

    for (const lesson of lessons) {
      await page.locator(`[data-lesson="${lesson.id}"]`).click();
      await expect(page.locator(`[data-lesson="${lesson.id}"]`)).toHaveAttribute('aria-current', 'page');
      await expect(page.locator('#lesson-title')).toContainText(lesson.name);
      await expect(page.locator('[data-answer-panel] .answer-label')).toHaveCount(0);
      await page.getByRole('button', { name: 'New Question' }).click();
      await page.getByRole('button', { name: 'Reveal Answer' }).click();
      await expect(page.locator('[data-answer-panel]')).toHaveClass(/answer-panel--visible/);
      await expectGeometry(page, viewport);
      await page.getByRole('button', { name: 'Next' }).click();
      await expect(page.locator('[data-answer-panel]')).not.toHaveClass(/answer-panel--visible/);
      await page.locator('[data-difficulty="challenge"]').click();
      await expect(page.locator('[data-difficulty="challenge"]')).toHaveAttribute('aria-pressed', 'true');

      if (lesson.id === 'number-line') {
        await page.locator('[data-direction="point-to-number"]').click();
        await expect(page.locator('[data-number-line] svg')).toBeVisible();
      } else {
        await expect(page.locator('[data-direction]')).toHaveCount(0);
      }

      await expectGeometry(page, viewport);
      await page.screenshot({ path: testInfo.outputPath(`${viewport.name}-${lesson.id}.png`), fullPage: true });
    }
  });
}
