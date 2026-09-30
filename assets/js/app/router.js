import { shopTitleEl } from './dom.js';
import { INFO_ROUTES, showInfo } from './info.js';
import { setMeta, setProductJsonLd } from './meta.js';
import { renderNavMenu, showSection } from './nav.js';
import { renderPDP, renderPDPMissing } from './pdp.js';
import { CATEGORIES, renderShop } from './shop.js';
import { state } from './state.js';

/* ─── Routing hash ───────────────────────── */
export function handleShopRoute() {
  const hash = location.hash.replace(/^#/, '');
  const parts = hash.split('/');
  const route = parts[0];
  const a = parts[1] || '';
  const b = parts[2] || '';

  if (!hash)               { setProductJsonLd(null); setMeta({}); showSection('home');       return; }
  if (route === 'collection') { setProductJsonLd(null); setMeta({ title: 'Collection', description: 'The TATO collection — 21 looks. Designed in Rome, made in Italy.', canonicalHash: 'collection' }); showSection('collection'); return; }
  if (route === 'about')      { setProductJsonLd(null); setMeta({ title: 'Contacts', description: 'Get in touch with TATO — general, press and sales enquiries.', canonicalHash: 'about' }); showSection('about'); return; }
  if (INFO_ROUTES.includes(route)) { setProductJsonLd(null); showInfo(route); return; }

  if (route === 'product' && a) {
    if (renderPDP(a)) {
      showSection('product');
      document.getElementById('product')?.classList.add('active');
      const p = window.TATO_getProduct(a);
      if (p) {
        const pd = window.TATO_shopify && window.TATO_shopify.ready ? window.TATO_shopify.productData(a) : null;
        const price = pd && pd.minPrice != null ? pd.minPrice : p.price;
        setMeta({
          title: p.name,
          description: `${p.name} — ${p.composition}. ${p.description}`.slice(0, 300),
          canonicalHash: 'product/' + a,
          ogImage: (pd && pd.images && pd.images[0]) || (window.TATO_lookImages ? window.TATO_lookImages(p.lookRefs, { onePerLook: true, limit: 1 })[0] : null),
        });
        setProductJsonLd(p);
      }
    } else if (!(window.TATO_shopify && window.TATO_shopify.state === 'loading')) {
      // prodotto tolto da Shopify (o link sbagliato). Se il catalogo dal vivo
      // sta ancora arrivando si aspetta: lo riprova il listener shopify-ready.
      renderPDPMissing();
      showSection('product');
      document.getElementById('product')?.classList.add('active');
      setProductJsonLd(null);
      setMeta({ title: 'No longer available', description: 'This piece is no longer available.', canonicalHash: 'shop' });
    }
    return;
  }

  if (route === 'shop') {
    const isCat = slug => CATEGORIES.some(c => c.slug === slug);
    if (a === 'women' || a === 'men') {
      state.shopScope    = a;
      state.shopCategory = isCat(b) ? b : 'all';
    } else if (a === 'accessories') {
      state.shopScope    = 'accessories';
      state.shopCategory = 'all';
    } else if (isCat(a)) {
      state.shopScope    = 'new';
      state.shopCategory = a;
    } else {
      state.shopScope    = 'new';
      state.shopCategory = 'all';
    }
    renderShop();
    showSection('shop');
    document.getElementById('shop')?.classList.add('active');
    setProductJsonLd(null);
    const label = shopTitleEl ? shopTitleEl.textContent : 'Shop';
    setMeta({
      title: label,
      description: `Shop ${label} — TATO. Independent fashion, designed in Rome, made in Italy.`,
      canonicalHash: hash,
    });
  }
}

export function initRouter() {
/* Dati Shopify arrivati (copia o dal vivo): ridisegna quello che è a
   schermo. Col catalogo dal vivo possono esserci prodotti nuovi/tolti →
   anche menu, pill e un eventuale link prodotto rimasto in attesa. */
document.addEventListener('tato:shopify-ready', (e) => {
  const live = e.detail && e.detail.live;
  const prod = document.getElementById('product');
  const onProduct = location.hash.startsWith('#product/');
  if (live) renderNavMenu();
  const shown = prod && prod.classList.contains('active') && state.pdp.slug;
  if (onProduct && shown) {
    // ridisegno sul posto (niente reset dello scroll); se il prodotto
    // è appena stato tolto, passa alla vista "non disponibile"
    if (!renderPDP(state.pdp.slug)) handleShopRoute();
  } else if (onProduct && live) {
    handleShopRoute();
  } else if (document.getElementById('shop')?.classList.contains('active')) {
    renderShop();
  }
});

window.addEventListener('hashchange', handleShopRoute);

/* Deep-link all'apertura */
(function initShopRoute() {
  renderShop();
  const h = location.hash.replace(/^#/, '');
  const first = h.split('/')[0];
  if (h === 'shop' || h.startsWith('shop/') || h.startsWith('product/') ||
      h === 'collection' || h === 'about' || INFO_ROUTES.includes(first)) {
    window.addEventListener('load', handleShopRoute, { once: true });
  }
})();
}
