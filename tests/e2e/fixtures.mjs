/* Fixture comuni:
   • Shopify simulato con i prodotti della copia del catalogo, tutto
     disponibile tranne i casi usati dai test (vedi STOCK)
   • raccolta di errori JS, errori console e violazioni CSP: ogni test
     fallisce se ce ne sono
   • popup newsletter già "visto", così non copre la pagina */
import { test as base, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const SHOP_API = 'https://pshgtp-ak.myshopify.com/api/**';
export const CHECKOUT_URL = 'https://checkout.test/cart/c/test-123';

function snapshotNodes() {
  const src = readFileSync(new URL('../../assets/js/catalog-snapshot.js', import.meta.url), 'utf8');
  const ctx = { window: {} };
  vm.runInNewContext(src, ctx);
  return ctx.window.TATO_CATALOG_SNAPSHOT.nodes;
}

/* Stock simulato: tutto disponibile, tranne
   - Tobi Pants Navy: esaurito per intero (colore sold-out)
   - Tobi Pants Black taglia 5: esaurita */
function withStock(nodes) {
  const copy = JSON.parse(JSON.stringify(nodes));
  for (const p of copy) {
    for (const v of p.variants.nodes) {
      const o = Object.fromEntries(v.selectedOptions.map(x => [x.name, x.value]));
      v.availableForSale = !(p.handle === 'tobi-pants' &&
        (o.Color === 'Navy' || (o.Color === 'Black' && o.Size === '5')));
    }
    p.availableForSale = p.variants.nodes.some(v => v.availableForSale);
  }
  return copy;
}

export const NODES = withStock(snapshotNodes());

/* Prezzi di un altro mercato: stessi nodi, importi × rate, codice valuta */
function inCurrency(nodes, code, rate) {
  const copy = JSON.parse(JSON.stringify(nodes));
  const conv = m => { if (m) { m.amount = String(Math.round(Number(m.amount) * rate)); m.currencyCode = code; } };
  copy.forEach(p => {
    conv(p.priceRange && p.priceRange.minVariantPrice);
    p.variants.nodes.forEach(v => { conv(v.price); conv(v.compareAtPrice); });
  });
  return copy;
}
const MARKETS = { US: ['USD', 1.1], GB: ['GBP', 0.85], JP: ['JPY', 170] };

/* markets: true → lo store vende anche in US / GB / JP (oggi su Shopify: solo IT) */
export async function mockShopify(page, { down = false, nodes = NODES, markets = false } = {}) {
  const calls = { catalog: 0, cartCreate: [], cartCountry: [] };
  await page.route(SHOP_API, async (route) => {
    if (down) return route.abort('connectionrefused');
    const body = route.request().postDataJSON() || {};
    if (/localization/.test(body.query || '')) {
      const countries = [{ isoCode: 'IT', currency: { isoCode: 'EUR' } }]
        .concat(markets ? Object.entries(MARKETS).map(([c, [code]]) => ({ isoCode: c, currency: { isoCode: code } })) : []);
      return route.fulfill({ json: { data: { localization: { availableCountries: countries } } } });
    }
    if (/cartCreate/.test(body.query || '')) {
      calls.cartCreate.push(body.variables.lines);
      calls.cartCountry.push(body.variables.country);
      return route.fulfill({ json: { data: { cartCreate: { cart: { checkoutUrl: CHECKOUT_URL }, userErrors: [] } } } });
    }
    calls.catalog++;
    const m = markets && MARKETS[(body.variables || {}).country];
    const out = m ? inCurrency(nodes, m[0], m[1]) : nodes;
    return route.fulfill({ json: { data: { products: { pageInfo: { hasNextPage: false, endCursor: null }, nodes: out } } } });
  });
  // la pagina di checkout "esterna" non esiste: rispondiamo noi
  await page.route('https://checkout.test/**', route => route.fulfill({ body: '<h1>Checkout</h1>', contentType: 'text/html' }));
  return calls;
}

export const test = base.extend({
  shopify: async ({ page }, use) => {
    await use(await mockShopify(page));
  },
  page: async ({ page }, use) => {
    const problems = [];
    page.on('pageerror', e => problems.push('JS: ' + e.message));
    page.on('console', m => {
      if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) problems.push('console: ' + m.text());
    });
    await page.addInitScript(() => {
      try { localStorage.setItem('tato-nl-done', '1'); } catch (_) {}
      window.__csp = [];
      document.addEventListener('securitypolicyviolation', e => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
    });
    await use(page);
    const csp = await page.evaluate(() => window.__csp || []).catch(() => []);
    expect(csp, 'violazioni Content-Security-Policy').toEqual([]);
    expect(problems, 'errori JavaScript / console').toEqual([]);
  },
});

export { expect };

/* Attende che il catalogo dal vivo (simulato) sia applicato */
export async function shopifyReady(page) {
  await page.waitForFunction(() => window.TATO_shopify && window.TATO_shopify.state === 'ready');
}
