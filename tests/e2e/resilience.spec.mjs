import { test as base, expect } from '@playwright/test';
import { mockShopify } from './fixtures.mjs';

/* Qui non si usano le fixture con il controllo errori console:
   con Shopify giù il sito scrive volutamente un avviso. */

base('Shopify irraggiungibile: lo shop funziona con la copia del catalogo', async ({ page }) => {
  await mockShopify(page, { down: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/shop/');
  await page.waitForFunction(() => window.TATO_shopify && window.TATO_shopify.state === 'snapshot', null, { timeout: 20_000 });
  await expect(page.locator('#shop-grid .pgrid-card').first()).toBeVisible();
  await page.goto('/product/2-button-shirt/');
  await expect(page.locator('.pdp-name')).toHaveText('2 BUTTON SHIRT');
  expect(errors).toEqual([]);
});

base('Shopify lento: la pagina non resta appesa', async ({ page }) => {
  await page.route('https://pshgtp-ak.myshopify.com/api/**', () => { /* mai risposta */ });
  await page.goto('/shop/');
  await expect(page.locator('#shop-grid .pgrid-card').first()).toBeVisible();   // subito, dalla copia
  await page.waitForFunction(() => window.TATO_shopify.state !== 'loading', null, { timeout: 20_000 });
});

base('Pubblicazione: i file interni non sono online', async ({ request }) => {
  for (const path of ['/docs/handoff.md', '/CLAUDE.md', '/package.json', '/scripts/build.mjs', '/assets/js/app.js', '/assets/js/app/cart.js', '/tests/e2e/fixtures.mjs', '/archive/shop-test.html']) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});
