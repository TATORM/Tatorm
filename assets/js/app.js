/* ═══════════════════════════════════════════
   TATO — app.js (avvio del sito)
   ─────────────────────────────────────────
   Il codice è diviso in moduli in assets/js/app/:
     state       stato condiviso (reparto/categoria shop, PDP, look)
     dom         riferimenti DOM comuni
     utils       immagini (<picture>, CDN Shopify), esc(), money()
     grid        card prodotto (Shop, Home, suggerimenti)
     home        hero, reparti, feed
     intro       splash + header allo scroll
     nav         menu, showSection, navigazione
     newsletter  popup + footer Mailchimp
     cart        carrello, drawer, checkout
     collection  caroselli look + pannello "Shop the look"
     shop        griglia, pill
     filters     filtri e ordinamento dello shop
     wishlist    capi salvati (segnalibro, pagina /wishlist/)
     pdp         scheda prodotto, size guide, prodotto tolto
     info        pagine info/legali
     meta        title/description/OG + JSON-LD
     router      rotte hash (#shop, #product/…)
     theme       dark/light
     url         indirizzi veri (/product/…), link interni, vecchi #…
   Qui si avviano nello stesso ordine di prima.
   ═══════════════════════════════════════════ */
import { initUrl } from './app/url.js';
import { initHome } from './app/home.js';
import { initIntro } from './app/intro.js';
import { initNav } from './app/nav.js';
import { initNewsletter } from './app/newsletter.js';
import { initCartUI, initCartRestore } from './app/cart.js';
import { initCollection } from './app/collection.js';
import { initSizeGuide } from './app/pdp.js';
import { initRouter } from './app/router.js';
import { initTheme } from './app/theme.js';
import { initShopFilters } from './app/shop.js';
import { initWishlist } from './app/wishlist.js';

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

initUrl();      // prima di tutto: converte i vecchi link #… nel percorso vero

initHome();
initIntro();
initNav();
initNewsletter();
initCartUI();
initCollection();

/* Aggiornamento dal vivo del catalogo Shopify */
if (window.TATO_shopify) window.TATO_shopify.init();

initSizeGuide();
initShopFilters();
initWishlist();
initRouter();

/* Protezione immagini: niente menu contestuale / trascinamento */
document.addEventListener('contextmenu', e => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});
document.addEventListener('dragstart', e => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

initCartRestore();
initTheme();
