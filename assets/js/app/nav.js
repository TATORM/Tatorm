import { renderLookPanel } from './collection.js';
import { fixedLookInfo, logo, navLinks, navToggle, siteBreadcrumb } from './dom.js';
import { renderHomeHero } from './home.js';
import { handleShopRoute } from './router.js';
import { renderShop } from './shop.js';
import { state } from './state.js';
import { isDesktopViewport } from './utils.js';
import { currentRoute, go, setUrl } from './url.js';

/* ═══════════════════════════════════════════
   NAVIGAZIONE SEZIONI
   ═══════════════════════════════════════════ */
/* ─── Menu principale (pannello da sinistra) ─────────────
   Shop ▸ (All · New arrivals · categorie · Accessories)
   · Collection · About
   Solo le voci con prodotti: New arrivals = tag Shopify `new`.
   Women/Men non sono voci di menu: sono un filtro dello shop. */
const menuDrawer  = document.getElementById('menu-drawer');
const menuOverlay = document.getElementById('menu-overlay');

export function shopMenuItems() {
  const products = window.TATO_PRODUCTS || [];
  const cats = (window.TATO_CATEGORIES || []).filter(c => products.some(p => p.category === c.slug));
  return [
    { href: '/shop/', label: 'All' },
    ...(products.some(p => (p.badges || []).includes('New')) ? [{ href: '/shop/new/', label: 'New arrivals' }] : []),
    ...cats.map(c => ({ href: `/shop/${c.slug}/`, label: c.label })),
    ...(products.some(p => p.category === 'accessories') ? [{ href: '/shop/accessories/', label: 'Accessories' }] : []),
  ];
}

export function renderNavMenu() {
  navLinks.innerHTML = `
    <li class="nav-group open">
      <button type="button" class="nav-group-toggle" aria-expanded="true">Shop</button>
      <ul class="nav-sub">${shopMenuItems().map(i => `<li><a href="${i.href}">${i.label}</a></li>`).join('')}</ul>
    </li>
    <li><a href="/collection/">Collection</a></li>
    <li><a href="/about/">About</a></li>
  `;
  /* i link veri li gestisce url.js (navigazione senza ricaricare);
     il pannello si chiude in showSection() */
  navLinks.querySelectorAll('.nav-group-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.closest('.nav-group').classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
}

export function openNav() {
  menuDrawer.classList.add('open');
  menuOverlay.classList.add('open');
  menuDrawer.setAttribute('aria-hidden', 'false');
  navToggle.setAttribute('aria-expanded', 'true');
  // voce della pagina corrente evidenziata
  navLinks.querySelectorAll('a').forEach(a => {
    if (new URL(a.href).pathname === location.pathname) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.getElementById('menu-close')?.focus();
}

export function closeNav() {
  if (!menuDrawer.classList.contains('open')) return;
  menuDrawer.classList.remove('open');
  menuOverlay.classList.remove('open');
  menuDrawer.setAttribute('aria-hidden', 'true');
  navToggle.setAttribute('aria-expanded', 'false');
}

export function resetScroll() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function showSection(id) {
  // Reset scroll prima di tutto per evitare che l'IntersectionObserver
  // legga la posizione della home e mostri il look sbagliato su mobile
  resetScroll();

  // Nascondi tutte le sezioni
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
    p.classList.remove('active');
  });

  // Mostra la sezione target
  const target = document.getElementById(id);
  if (!target) return;
  target.style.display = id === 'about' ? 'flex' : 'block';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.add('active');
      // Ri-forza lo scroll a 0: quando la navigazione avviene via
      // `location.hash = "#shop"` il browser prova a scrollare fino a
      // <section id="shop"> DOPO che l'abbiamo mostrata → su mobile la
      // pagina si apriva "dal fondo". Questo la riporta in cima.
      // (il deep-link ai look da "Seen in" scrolla a t+80ms, quindi vince).
      resetScroll();
    });
  });

  // Gestisci visibilità pannello look e breadcrumb
  if (id === 'collection') {
    fixedLookInfo.classList.add('panel-visible');
    siteBreadcrumb.classList.add('visible');
    state.activeLook = null;
    renderLookPanel('1');
  } else if (id === 'about') {
    fixedLookInfo.classList.remove('panel-visible');
    siteBreadcrumb.classList.add('visible');
  } else if (id === 'shop' || id === 'product') {
    fixedLookInfo.classList.remove('panel-visible');
    siteBreadcrumb.classList.add('visible');
    if (id === 'shop') {
      if (!currentRoute().startsWith('shop') && currentRoute() !== 'wishlist') {
        state.shopScope = 'all';
        state.shopCategory = 'all';
        setUrl('shop');
      }
      renderShop();
    }
  } else {
    fixedLookInfo.classList.remove('panel-visible');
    siteBreadcrumb.classList.remove('visible');
    // Home: nuova foto hero casuale ogni volta che si torna qui da
    // un'altra sezione. Solo desktop — su mobile l'hero non cambia.
    if (id === 'home' && isDesktopViewport()) renderHomeHero();
  }

  // Modalità header per shop / product
  document.body.classList.toggle('shop-mode', id === 'shop' || id === 'product');
  document.body.classList.toggle('collection-mode', id === 'collection');

  // Allinea l'indirizzo alla sezione (replaceState: niente nuova cronologia)
  if (id === 'home') setUrl('');
  else if (id === 'collection' || id === 'about') setUrl(id);

  closeNav();
}

/* Naviga a una sezione creando una voce di cronologia (tasto Indietro) */
export function navToSection(id) {
  go(id === 'home' ? '' : id);
}

export function initNav() {
// Click su link breadcrumb / footer (statici nell'HTML)
document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navToSection(link.dataset.section);
  });
});

// Click sul logo → home
logo.addEventListener('click', e => {
  e.preventDefault();
  go('');
});

// Stato iniziale nav
renderNavMenu();

/* ─── Toggle menu ────────────────────────── */
navToggle.addEventListener('click', () => {
  if (menuDrawer.classList.contains('open')) closeNav();
  else openNav();
});
document.getElementById('menu-close')?.addEventListener('click', () => { closeNav(); navToggle.focus(); });
menuOverlay?.addEventListener('click', closeNav);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
}
