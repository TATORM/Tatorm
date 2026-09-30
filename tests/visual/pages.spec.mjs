import { test, expect } from '@playwright/test';
import { mockShopify } from '../e2e/fixtures.mjs';

/* Pagina deterministica: random fisso, niente popup, animazioni ferme */
async function prepare(page) {
  await mockShopify(page);
  await page.addInitScript(() => {
    let s = 42;
    Math.random = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    try { localStorage.setItem('tato-nl-done', '1'); } catch (_) {}
  });
}

async function settle(page) {
  // fine intro (logo + splash) e dati Shopify simulati applicati
  await page.waitForFunction(() => {
    const s = document.getElementById('splash-bg');
    return (!s || getComputedStyle(s).display === 'none') &&
      window.TATO_shopify && window.TATO_shopify.state === 'ready';
  }, null, { timeout: 15_000 });
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}' });
  // tutte le immagini visibili caricate
  await page.waitForFunction(() => [...document.images]
    .filter(i => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; })
    .every(i => i.complete && i.naturalWidth > 0), null, { timeout: 15_000 });
  await page.waitForTimeout(300);
}

const PAGES = [
  { name: 'home', url: '/' },
  { name: 'home-griglia', url: '/', scrollTo: '#home-feed .home-pgrid' },
  { name: 'shop', url: '/shop/' },
  { name: 'shop-women-pants', url: '/shop/women/pants/' },
  { name: 'prodotto', url: '/product/tobi-pants/' },
  { name: 'prodotto-dettagli', url: '/product/tobi-pants/', scrollTo: '.pdp-tabs' },
  { name: 'prodotto-complete-look', url: '/product/tobi-pants/', scrollTo: '.pdp-complete' },
  { name: 'collection', url: '/collection/' },
  { name: 'about', url: '/about/' },
  { name: 'shipping', url: '/shipping/' },
  { name: 'non-disponibile', url: '/product/prodotto-tolto/' },
  { name: 'footer', url: '/shop/', scrollTo: '.site-footer' },
];

for (const p of PAGES) {
  test(p.name, async ({ page }) => {
    await prepare(page);
    await page.goto(p.url);
    await settle(page);
    if (p.scrollTo) {
      await page.locator(p.scrollTo).first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await settle(page);
    }
    await expect(page).toHaveScreenshot(`${p.name}.png`);
  });
}

test('menu-aperto', async ({ page }) => {
  await prepare(page);
  await page.goto('/');
  await settle(page);
  await page.locator('#nav-toggle').click();
  await page.locator('.nav-group-toggle').first().click();
  await page.waitForTimeout(600);
  await expect(page).toHaveScreenshot('menu-aperto.png');
});

test('carrello', async ({ page }) => {
  await prepare(page);
  await page.goto('/product/tobi-pants/');
  await settle(page);
  await page.locator('#pdp-size-select').selectOption('2');
  await page.locator('#pdp-add').click();
  await page.waitForTimeout(600);
  await settle(page);
  await expect(page).toHaveScreenshot('carrello.png');
});

test('guida-taglie', async ({ page }) => {
  await prepare(page);
  await page.goto('/product/tobi-pants/');
  await settle(page);
  await page.locator('#pdp-sizeguide').click();
  await page.waitForTimeout(300);
  await expect(page).toHaveScreenshot('guida-taglie.png');
});

test('dark-mode-shop', async ({ page }) => {
  await prepare(page);
  await page.addInitScript(() => { try { localStorage.setItem('tato-dark', 'true'); } catch (_) {} });
  await page.goto('/shop/');
  await settle(page);
  await expect(page).toHaveScreenshot('dark-mode-shop.png');
});
