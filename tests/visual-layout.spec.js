import { expect, test } from '@playwright/test';

const lessons = [
  { id: 'number-line', name: 'Number Line' },
  { id: 'opposite', name: 'Opposite' },
  { id: 'absolute-value', name: 'Absolute Value' },
  { id: 'compare', name: 'Comparing Rational Numbers' },
];

const modes = [
  { id: 'explore', name: 'Explore' },
  { id: 'quick-check', name: 'Quick Check' },
];

async function expectAllVisibleBoxesInViewport(page, viewport) {
  const outOfViewport = await page.locator('body *').evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && box.width > 0
        && box.height > 0;
    })
    .map((element) => {
      const box = element.getBoundingClientRect();
      return {
        tag: element.tagName,
        className: element.className,
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
      };
    })
    .filter((box) => box.left < 0
      || box.top < 0
      || box.right > viewport.width
      || box.bottom > viewport.height));

  expect(outOfViewport).toEqual([]);
}

async function expectButtonsDoNotCollide(page) {
  const collisions = await page.locator('button').evaluateAll((buttons) => {
    const boxes = buttons.map((button) => {
      const box = button.getBoundingClientRect();
      return {
        label: button.textContent.trim(),
        left: box.left,
        right: box.right,
        top: box.top,
        bottom: box.bottom,
      };
    });

    return boxes.flatMap((first, index) => boxes.slice(index + 1)
      .filter((second) => first.left < second.right
        && first.right > second.left
        && first.top < second.bottom
        && first.bottom > second.top)
      .map((second) => ({ first: first.label, second: second.label })));
  });

  expect(collisions).toEqual([]);
}

async function expectStageDominates(page) {
  const [stage, header, switcher, controls] = await Promise.all([
    page.locator('[data-stage]').boundingBox(),
    page.locator('.workspace-header').boundingBox(),
    page.locator('.mode-switcher').boundingBox(),
    page.locator('.teacher-controls').boundingBox(),
  ]);

  expect(stage).not.toBeNull();
  expect(header).not.toBeNull();
  expect(switcher).not.toBeNull();
  expect(controls).not.toBeNull();

  const stageArea = stage.width * stage.height;
  expect(stageArea).toBeGreaterThan(header.width * header.height);
  expect(stageArea).toBeGreaterThan(switcher.width * switcher.height);
  expect(stageArea).toBeGreaterThan(controls.width * controls.height);
}

for (const viewport of [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1280x720', width: 1280, height: 720 },
]) {
  test(`classroom shell fits and switches every lesson/mode state at ${viewport.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    for (const lesson of lessons) {
      await page.locator(`[data-lesson="${lesson.id}"]`).click();

      for (const mode of modes) {
        await page.locator(`[data-mode="${mode.id}"]`).click();

        await expect(page.locator('[data-lesson][aria-current="page"]')).toHaveCount(1);
        await expect(page.locator(`[data-lesson="${lesson.id}"]`)).toHaveAttribute('aria-current', 'page');
        await expect(page.locator('[data-mode][aria-pressed="true"]')).toHaveCount(1);
        await expect(page.locator(`[data-mode="${mode.id}"]`)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('[data-stage]')).toContainText(mode.name);
        await expect(page.locator('#lesson-title')).toContainText(lesson.name);

        const documentWidth = await page.evaluate(() => ({
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        expect(documentWidth.innerWidth).toBe(viewport.width);
        expect(documentWidth.scrollWidth).toBe(documentWidth.innerWidth);
        await expectAllVisibleBoxesInViewport(page, viewport);
        await expectButtonsDoNotCollide(page);
        const buttonHeights = await page.locator('button').evaluateAll((buttons) => buttons
          .map((button) => button.getBoundingClientRect().height));
        expect(buttonHeights.every((height) => height >= 52)).toBe(true);
        await expectStageDominates(page);

        await page.screenshot({
          path: testInfo.outputPath(`${viewport.name}-${lesson.id}-${mode.id}.png`),
          fullPage: true,
        });
      }
    }
  });
}
