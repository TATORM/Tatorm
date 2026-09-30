import { test, expect, shopifyReady, mockShopify, NODES } from './fixtures.mjs';
import { test as base } from '@playwright/test';

test('Shop: tutti i prodotti tranne gli accessori, filtri per reparto e categoria', async ({ page, shopify }) => {
  await page.goto('/shop/');
  await shopifyReady(page);
  const expected = await page.evaluate(() => window.TATO_PRODUCTS.filter(p => p.category !== 'accessories').length);
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(expected);

  await page.locator('#shop-pills').getByRole('link', { name: 'Pants', exact: true }).click();
  await expect(page).toHaveURL(/\/shop\/pants\/$/);
  const pants = await page.evaluate(() => window.TATO_PRODUCTS.filter(p => p.category === 'pants').length);
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(pants);

  await page.locator('#shop-pills').getByRole('link', { name: 'Accessories' }).click();
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(1);
  await expect(page.locator('#shop-grid')).toContainText('TATO CAP');
});

test('PDP: dati da Shopify, colori, taglie e sold-out', async ({ page, shopify }) => {
  await page.goto('/product/tobi-pants/');
  await shopifyReady(page);
  await expect(page.locator('.pdp-name')).toHaveText('TOBI PANTS');
  await expect(page.locator('.pdp-material')).toHaveText('100% Cotton');
  await expect(page.locator('.pdp-color')).toHaveCount(3);
  // foto dalla CDN Shopify ridimensionata
  const src = await page.locator('.pdp-gallery-img').first().getAttribute('src');
  expect(src).toMatch(/^https:\/\/cdn\.shopify\.com\/.+width=\d+/);

  // taglia 5 del nero esaurita
  await expect(page.locator('#pdp-size-select option[value="5"]')).toBeDisabled();
  // colore Navy esaurito per intero
  await expect(page.locator('.pdp-color.is-soldout')).toHaveCount(1);
});

test('Link a un prodotto tolto da Shopify: pagina "no longer available"', async ({ page, shopify }) => {
  await page.goto('/product/prodotto-tolto/');
  await expect(page.locator('.pdp-missing-title')).toHaveText('This piece is no longer available.');
  await expect(page.locator('.pdp-missing-grid .pgrid-card')).toHaveCount(4);
});

base('Etichetta New da tag Shopify + seconda immagine all\'hover (desktop)', async ({ page }, info) => {
  const nodes = JSON.parse(JSON.stringify(NODES));
  nodes.find(n => n.handle === 'tobi-pants').tags.push('new');
  await mockShopify(page, { nodes });
  await page.addInitScript(() => localStorage.setItem('tato-nl-done', '1'));
  await page.goto('/shop/pants/');
  await page.waitForFunction(() => window.TATO_shopify.state === 'ready');
  const card = page.locator('#shop-grid .pgrid-card[data-slug="tobi-pants"]');
  await expect(card.locator('.pgrid-badge')).toHaveText('New');
  if (info.project.name === 'desktop') {
    const alt = card.locator('.pgrid-alt');
    await expect(alt).toHaveCount(1);
    await card.hover();
    await expect(alt).toHaveCSS('opacity', '1');
  } else {
    await expect(card.locator('.pgrid-alt')).toHaveCount(0);   // touch: niente seconda immagine
  }
  await card.click();
  await expect(page.locator('.pdp-badge')).toHaveText('New');
});
