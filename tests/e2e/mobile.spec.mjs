import { test, expect } from './fixtures.mjs';

test.beforeEach(({}, info) => test.skip(info.project.name !== 'mobile', 'solo mobile'));

for (const route of ['/', '/#shop', '/#product/tobi-pants', '/#collection']) {
  test(`Mobile ${route}: niente scroll orizzontale`, async ({ page, shopify }) => {
    await page.goto(route);
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('Mobile: pill categorie scorrevoli nello shop', async ({ page, shopify }) => {
  await page.goto('/#shop');
  const pills = page.locator('#shop-pills');
  await expect(pills).toBeVisible();
  await expect(pills.locator('.shop-pill.is-active')).toHaveText('All');
});
