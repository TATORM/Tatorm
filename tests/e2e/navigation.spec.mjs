import { test, expect } from './fixtures.mjs';

test('Home: hero, reparti e griglia prodotti', async ({ page, shopify }) => {
  await page.goto('/');
  await expect(page.locator('#home')).toHaveClass(/active/);
  await expect(page.locator('#home-feed .pgrid-card').first()).toBeVisible({ timeout: 10_000 });
  // una card per ogni colorway del catalogo
  const colorways = await page.evaluate(() => window.TATO_PRODUCTS.reduce((n, p) => n + p.colors.length, 0));
  await expect(page.locator('#home-feed .pgrid-card')).toHaveCount(colorways);
});

test('Collection: pannello del look con link Shop ai capi in vendita', async ({ page, shopify }) => {
  await page.goto('/collection/');
  const panel = page.locator('#fixed-look-info');
  await expect(panel.locator('.panel-look-number')).toHaveText('LOOK #1');
  const shop = panel.locator('a.panel-item-shop');
  await expect(shop).toHaveAttribute('href', '/product/tobi-pants/');
  // capi non in vendita: Pre-order → form con capo e colore già compilati
  await panel.locator('.panel-item-preorder').first().click();
  const dlg = page.locator('.preorder');
  await expect(dlg).toBeVisible();
  await expect(dlg.locator('#preorder-title')).toHaveText('Pre-order / 2 BUTTON WINDBREAKER');
  await expect(dlg.locator('input[name=color]')).toHaveValue('White');
  await dlg.locator('.preorder-submit').click();
  await expect(dlg.locator('.preorder-error')).toBeVisible();   // campi obbligatori
  await page.keyboard.press('Escape');
  await expect(dlg).toBeHidden();
});

test('Rotte dirette e tasto indietro', async ({ page, shopify }) => {
  await page.goto('/shop/?dept=women');
  await expect(page.locator('#shop-title')).toHaveText('Women');
  await page.goto('/product/2-button-shirt/');
  await expect(page.locator('.pdp-name')).toHaveText('2 BUTTON SHIRT');
  await page.goBack();
  await expect(page.locator('#shop-title')).toHaveText('Women');
});

test('Pagine info e 404', async ({ page, shopify }) => {
  await page.goto('/shipping/');
  await expect(page.locator('#info')).toHaveClass(/active/);
  const res = await page.goto('/pagina-che-non-esiste');
  expect(res.status()).toBe(404);
});
