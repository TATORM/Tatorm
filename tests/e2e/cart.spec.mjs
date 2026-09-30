import { test, expect, shopifyReady, CHECKOUT_URL, NODES } from './fixtures.mjs';

async function addTobiBlack2(page) {
  await page.goto('/#product/tobi-pants');
  await shopifyReady(page);
  await page.locator('#pdp-size-select').selectOption('2');
  await page.locator('#pdp-add').click();
  await expect(page.locator('#cart-drawer')).toHaveClass(/open/);
}

test('Aggiungi al carrello, quantità, totale, persistenza', async ({ page, shopify }) => {
  await addTobiBlack2(page);
  const row = page.locator('.cart-item-row');
  await expect(row).toHaveCount(1);
  await expect(row).toContainText('TOBI PANTS');
  await expect(row).toContainText('Black · 2');
  await expect(page.locator('#cart-badge')).toHaveText('1');

  await row.locator('[data-act="inc"]').click();
  await expect(row.locator('.cart-qty-val')).toHaveText('2');
  await expect(page.locator('#cart-total')).toHaveText('€590');

  await page.reload();
  await expect(page.locator('#cart-badge')).toHaveText('2');
});

test('Taglia non scelta: messaggio e niente carrello', async ({ page, shopify }) => {
  await page.goto('/#product/tobi-pants');
  await shopifyReady(page);
  await page.locator('#pdp-add').click();
  await expect(page.locator('#pdp-size-hint')).toHaveText('Select a size');
  await expect(page.locator('#cart-badge')).toHaveText('0');
});

test('Checkout: crea il carrello Shopify con la variante giusta e reindirizza', async ({ page, shopify }) => {
  await addTobiBlack2(page);
  await page.locator('#cart-checkout').click();
  await page.waitForURL(CHECKOUT_URL);
  const tobi = NODES.find(n => n.handle === 'tobi-pants');
  const black2 = tobi.variants.nodes.find(v =>
    v.selectedOptions.some(o => o.value === 'Black') && v.selectedOptions.some(o => o.name === 'Size' && o.value === '2'));
  expect(shopify.cartCreate).toEqual([[{ merchandiseId: black2.id, quantity: 1 }]]);
});

test('Carrello con un prodotto tolto: riga rimossa con avviso', async ({ page, shopify }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('tato-cart-v1', JSON.stringify([{ key: 'old|Black|2', slug: 'old-coat', name: 'OLD COAT',
      color: 'Black', size: '2', price: 500, currency: 'EUR', qty: 1, shopifyVariantId: 'gid://shopify/ProductVariant/1' }]));
  });
  await page.goto('/#shop');
  await shopifyReady(page);
  await expect(page.locator('#cart-badge')).toHaveText('0');
  await page.evaluate(() => document.getElementById('btn-shop').click());
  await expect(page.locator('.cart-notice')).toContainText('no longer available');
});
