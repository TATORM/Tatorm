import { test, expect, shopifyReady, mockShopify, NODES } from './fixtures.mjs';
import { test as base } from '@playwright/test';

test('Shop: All = tutti i prodotti, pill per categoria', async ({ page, shopify }) => {
  await page.goto('/shop/');
  await shopifyReady(page);
  await expect(page.locator('#shop-title')).toHaveText('All');
  // una card per ogni colore di ogni prodotto
  const expected = await page.evaluate(() => window.TATO_PRODUCTS.reduce((n, p) => n + p.colors.length, 0));
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(expected);

  await page.locator('#shop-pills').getByRole('link', { name: 'Pants', exact: true }).click();
  await expect(page).toHaveURL(/\/shop\/pants\/$/);
  await expect(page.locator('#shop-title')).toHaveText('Pants');
  // Pants include anche i pantaloni sartoriali di Tailoring
  const pants = await page.evaluate(() => window.TATO_PRODUCTS
    .filter(p => window.TATO_inCategory(p, 'pants')).reduce((n, p) => n + p.colors.length, 0));
  await expect(page.locator('#shop-grid')).toContainText('TAILORED PANTS');
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(pants);

  await page.locator('#shop-pills').getByRole('link', { name: 'Accessories' }).click();
  // Accessories: una card per colore
  const capColors = await page.evaluate(() => window.TATO_getProduct('tato-cap').colors.length);
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(capColors);
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
  const card = page.locator('#shop-grid .pgrid-card[data-slug="tobi-pants"]').first();
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

test('Filtri e ordinamento: taglia, prezzo, URL condivisibile, azzera', async ({ page, shopify }) => {
  await page.goto('/shop/');
  await shopifyReady(page);
  const total = await page.locator('#shop-grid .pgrid-card').count();
  await page.locator('#shop-filter-btn').click();
  await page.locator('.filter-chip[data-group="sort"][data-value="price-asc"]').click();
  await page.locator('.filter-chip[data-group="price"][data-value="200-500"]').click();
  await page.locator('#filter-apply').click();
  await expect(page).toHaveURL(/\/shop\/\?price=200-500&sort=price-asc$/);
  const prices = (await page.locator('#shop-grid .pgrid-price').allTextContents()).map(t => Number(t.replace(/\D/g, '')));
  expect(prices.length).toBeGreaterThan(0);
  expect(prices.every(p => p >= 200 && p < 500)).toBe(true);
  expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  await expect(page.locator('#shop-filter-btn')).toHaveText('Filter & sort (1)');
  // lo stesso URL aperto da zero dà lo stesso risultato
  await page.reload();
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(prices.length);
  // azzera
  await page.locator('#shop-filter-btn').click();
  await page.locator('#filter-clear').click();
  await page.locator('#filter-apply').click();
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(total);
  await expect(page).toHaveURL(/\/shop\/$/);
});

test('Wishlist: salva da card e PDP, contatore, pagina /wishlist/, rimuovi', async ({ page, shopify }) => {
  await page.goto('/shop/');
  await shopifyReady(page);
  await page.locator('#shop-grid .pgrid-cell').nth(0).locator('.wish-btn').click();
  await expect(page.locator('#wish-badge')).toHaveText('1');
  await page.goto('/product/tobi-pants/');
  await page.locator('.wish-btn--pdp').click();
  await expect(page.locator('.wish-btn--pdp')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#wish-badge')).toHaveText('2');
  await page.locator('#btn-wish').click();
  await expect(page).toHaveURL(/\/wishlist\/$/);
  await expect(page.locator('#shop-title')).toHaveText('Wishlist');
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(2);
  await expect(page.locator('#shop-pills')).toBeHidden();
  await page.reload();                                   // resta salvata
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(2);
  await page.locator('#shop-grid .wish-btn').first().click();
  await expect(page.locator('#shop-grid .pgrid-card')).toHaveCount(1);
  await expect(page.locator('#wish-badge')).toHaveText('1');
});

test('Menu: voci sotto MENU, pagina sfumata, chiusura e navigazione', async ({ page, shopify }) => {
  await page.goto('/about/');
  await page.locator('#nav-toggle').click();
  const links = page.locator('#nav-links');
  await expect(links).toHaveClass(/open/);
  await expect(page.locator('body')).toHaveClass(/menu-open/);
  await expect(page.locator('#nav-toggle')).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(links).not.toHaveClass(/open/);
  await page.locator('#nav-toggle').click();
  await links.getByRole('link', { name: 'Tailoring' }).click();
  await expect(page).toHaveURL(/\/shop\/tailoring\/$/);
  await expect(links).not.toHaveClass(/open/);
  await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  await expect(page.locator('#shop-title')).toHaveText('Tailoring');
});

test('Reparto come filtro: Men dalla Home, vecchi link /shop/women/', async ({ page, shopify }) => {
  await page.goto('/shop/women/skirts/');
  await expect(page).toHaveURL(/\/shop\/skirts\/\?dept=women$/);
  await expect(page.locator('#shop-title')).toHaveText('Women / Skirts');
  await page.goto('/');
  await page.locator('.home-dept[href="/shop/?dept=men"]').click();
  await expect(page).toHaveURL(/\/shop\/\?dept=men$/);
  await expect(page.locator('#shop-title')).toHaveText('Men');
  await expect(page.locator('#shop-filter-btn')).toHaveText('Filter & sort (1)');
});

test('PDP: zoom delle foto e visti di recente', async ({ page, shopify }) => {
  await page.goto('/product/tato-cap/');
  await shopifyReady(page);
  await page.goto('/product/tobi-pants/');
  await shopifyReady(page);
  await expect(page.locator('.pdp-recent .pgrid-card[data-slug="tato-cap"]')).toHaveCount(1);
  await expect(page.locator('.pdp-recent .pgrid-card[data-slug="tobi-pants"]')).toHaveCount(0);   // non quello aperto

  await page.locator('.pdp-gallery-img').first().click();
  await expect(page.locator('.zoom')).toBeVisible();
  await expect(page.locator('.zoom-img').first()).toHaveAttribute('src', /width=2048/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.zoom')).toBeHidden();
});

test('Account cliente: icona e voce di menu verso la pagina account Shopify', async ({ page, shopify }) => {
  await page.goto('/shop/');
  await shopifyReady(page);
  await expect(page.locator('#nav-links a', { hasText: 'Account' })).toHaveAttribute('href', /^https:\/\/shopify\.com\/\d+\/account/);
  await expect(page.locator('#btn-account')).toHaveAttribute('href', /^https:\/\/shopify\.com\/\d+\/account/);
});

test('Italiano: selettore EN / IT, testi dell\'interfaccia, colori e composizione tradotti', async ({ page, shopify }) => {
  await page.goto('/product/tobi-pants/');
  await shopifyReady(page);
  await expect(page.locator('#pdp-add')).toContainText('Add to bag');
  await page.locator('.footer-region .lang-btn[data-lang="it"]').click();
  await page.waitForLoadState('load');
  await shopifyReady(page);
  await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  await expect(page.locator('#pdp-add')).toContainText('Aggiungi al carrello');
  await expect(page.locator('.pdp-color-name')).toHaveText('Nero');
  await expect(page.locator('.pdp-material')).toHaveText('100% Cotone');
  await expect(page.locator('.footer-col__title', { hasText: 'Assistenza clienti' })).toHaveCount(1);
  await page.evaluate(() => localStorage.removeItem('tato-lang'));
});
