import { shopTitleEl } from './dom.js';
import { INFO_ROUTES, showInfo } from './info.js';
import { setMeta, setProductJsonLd } from './meta.js';
import { renderNavMenu, showSection } from './nav.js';
import { renderPDP, renderPDPMissing } from './pdp.js';
import { CATEGORIES, renderShop } from './shop.js';
import { state } from './state.js';
import { ROUTE_EVENT, currentRoute, isAppRoute } from './url.js';

/* ─── Routing (percorsi veri, vedi url.js) ─ */
export function handleShopRoute() {
  const hash = currentRoute();
  const parts = hash.split('/');
  const route = parts[0];
  const a = parts[1] || '';
  const b = parts[2] || '';

  if (!hash)               { setProductJsonLd(null); setMeta({}); showSection('home');       return; }
  if (route === 'collection') { setProductJsonLd(null); setMeta({ title: 'Collection', description: 'The TATO collection — 21 looks. Designed in Rome, made in Italy.', canonicalPath: 'collection' }); showSection('collection'); return; }
  if (route === 'about')      { setProductJsonLd(null); setMeta({ title: 'Contacts', description: 'Get in touch with TATO — general, press and sales enquiries.', canonicalPath: 'about' }); showSection('about'); return; }
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
          canonicalPath: 'product/' + a,
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
      setMeta({ title: 'No longer available', description: 'This piece is no longer available.', canonicalPath: 'shop' });
    }
    return;
  }

  if (route === 'wishlist') {
    state.shopScope = 'wishlist';
    state.shopCategory = 'all';
    renderShop();
    showSection('shop');
    document.getElementById('shop')?.classList.add('active');
    setProductJsonLd(null);
    setMeta({ title: 'Wishlist', description: 'Your saved pieces — TATO.', canonicalPath: 'wishlist' });
    return;
  }

  if (route === 'shop') {
    const isCat = slug => CATEGORIES.some(c => c.slug === slug);
    if (a === 'women' || a === 'men') {
      // vecchio /shop/women[/cat]/ → /shop/[cat/]?dept=women (reparto = filtro)
      const cat = isCat(b) ? b : '';
      const q = new URLSearchParams(location.search);
      q.set('dept', a);
      history.replaceState(null, '', `/shop/${cat ? cat + '/' : ''}?${q.toString()}`);
      state.shopScope = 'all';
      state.shopCategory = cat || 'all';
    } else if (a === 'new') {
      state.shopScope = 'new';
      state.shopCategory = 'all';
    } else if (a === 'accessories') {
      state.shopScope = 'accessories';
      state.shopCategory = 'all';
    } else {
      state.shopScope = 'all';
      state.shopCategory = isCat(a) ? a : 'all';
    }
    renderShop();
    showSection('shop');
    document.getElementById('shop')?.classList.add('active');
    setProductJsonLd(null);
    const label = shopTitleEl ? shopTitleEl.textContent : 'Shop';
    setMeta({
      title: label,
      description: `Shop ${label} — TATO. Independent fashion, designed in Rome, made in Italy.`,
      canonicalPath: currentRoute(),
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
  const onProduct = currentRoute().startsWith('product/');
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

window.addEventListener(ROUTE_EVENT, handleShopRoute);

/* Deep-link all'apertura */
(function initShopRoute() {
  renderShop();
  const h = currentRoute();
  if (h && isAppRoute(h)) {
    window.addEventListener('load', handleShopRoute, { once: true });
  }
})();
}
