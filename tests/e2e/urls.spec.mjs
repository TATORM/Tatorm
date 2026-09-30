import { test, expect, shopifyReady, mockShopify, NODES } from './fixtures.mjs';

test('Pagina prodotto generata: meta, Open Graph e JSON-LD già nell\'HTML (senza JavaScript)', async ({ request }) => {
  const res = await request.get('/product/tobi-pants/');
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).toContain('<title>TOBI PANTS — TATO</title>');
  expect(html).toContain('<link rel="canonical" href="https://www.tatorm.com/product/tobi-pants/" />');
  expect(html).toContain('<meta property="og:type" content="product" />');
  expect(html).toMatch(/<meta property="og:image" content="https:\/\/cdn\.shopify\.com\/[^"]+width=1200" \/>/);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json" id="ld-product">([\s\S]*?)<\/script>/)[1]);
  expect(ld['@type']).toBe('Product');
  expect(ld.offers.price).toBe('295');
});

test('Sitemap con tutte le pagine prodotto; pagine info escluse', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const n of NODES) expect(xml).toContain(`https://www.tatorm.com/product/${n.handle}/`);
  expect(xml).not.toContain('/privacy/');
  const privacy = await (await request.get('/privacy/')).text();
  expect(privacy).toContain('<meta name="robots" content="noindex, follow" />');
});

test('Navigazione interna: URL veri, niente ricarica, tasto indietro', async ({ page, shopify }) => {
  await page.goto('/shop/');
  await shopifyReady(page);
  await page.evaluate(() => { window.__sameDocument = true; });
  await page.locator('#shop-grid .pgrid-card').first().click();
  await expect(page).toHaveURL(/\/product\/[a-z0-9-]+\/$/);
  await expect(page.locator('.pdp-name')).toBeVisible();
  expect(await page.evaluate(() => window.__sameDocument)).toBe(true);   // nessun ricaricamento
  await page.goBack();
  await expect(page).toHaveURL(/\/shop\/$/);
  await expect(page.locator('#shop-grid .pgrid-card').first()).toBeVisible();
});

test('Vecchi link con # portano al percorso vero', async ({ page, shopify }) => {
  await page.goto('/#product/2-button-shirt');
  await expect(page).toHaveURL(/\/product\/2-button-shirt\/$/);
  await expect(page.locator('.pdp-name')).toHaveText('2 BUTTON SHIRT');
});

test('Prodotto aggiunto su Shopify dopo il build: il suo URL funziona (via 404.html)', async ({ page }) => {
  const nuovo = JSON.parse(JSON.stringify(NODES.find(n => n.handle === '2-button-shirt')));
  nuovo.handle = 'nuovo-capo';
  nuovo.title = 'NUOVO CAPO';
  await mockShopify(page, { nodes: [...NODES, nuovo] });
  await page.goto('/product/nuovo-capo/');
  await expect(page).toHaveURL(/\/product\/nuovo-capo\/$/);
  await expect(page.locator('.pdp-name')).toHaveText('NUOVO CAPO', { timeout: 15_000 });
});
