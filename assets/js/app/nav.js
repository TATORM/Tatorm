import { renderLookPanel } from './collection.js';
import { fixedLookInfo, logo, navLinks, navToggle, siteBreadcrumb, siteNav } from './dom.js';
import { renderHomeHero } from './home.js';
import { handleShopRoute } from './router.js';
import { renderShop } from './shop.js';
import { state } from './state.js';
import { isDesktopViewport } from './utils.js';
import { currentRoute, go, setUrl } from './url.js';

/* ═══════════════════════════════════════════
   NAVIGAZIONE SEZIONI
   ═══════════════════════════════════════════ */
/* ─── Menu principale (home) ──────────────
   New Arrivals · Women▸ · Men▸ · Accessories
   · Collection · About
   Women/Men aprono il sottomenu categorie.     */
export function navDeptSub(dept) {
  const cats = window.TATO_categoriesFor
    ? window.TATO_categoriesFor(dept)
    : (window.TATO_CATEGORIES || []);
  const items = [`<li><a href="/shop/${dept}/">View All</a></li>`].concat(
    cats.map(c =>
      `<li><a href="/shop/${dept}/${c.slug}/">${c.label}</a></li>`)
  );
  return `<ul class="nav-sub">${items.join('')}</ul>`;
}

export function renderNavMenu() {
  navLinks.innerHTML = `
    <li><a href="/shop/">New Arrivals</a></li>
    <li class="nav-group">
      <button type="button" class="nav-group-toggle" data-group="women">Women</button>
      ${navDeptSub('women')}
    </li>
    <li class="nav-group">
      <button type="button" class="nav-group-toggle" data-group="men">Men</button>
      ${navDeptSub('men')}
    </li>
    <li><a href="/shop/accessories/">Accessories</a></li>
    <li class="nav-spacer" aria-hidden="true"></li>
    <li><a href="/collection/">Collection</a></li>
    <li><a href="/about/">About</a></li>
  `;
  /* i link veri li gestisce url.js (navigazione senza ricaricare);
     il menu si chiude in showSection() */
  navLinks.querySelectorAll('.nav-group-toggle').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const grp = btn.closest('.nav-group');
      const wasOpen = grp.classList.contains('open');
      navLinks.querySelectorAll('.nav-group').forEach(g => {
        g.classList.remove('open');
        g.querySelector('.nav-group-toggle')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) { grp.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
}

export function closeNav() {
  navLinks.classList.remove('open');
  navLinks.querySelectorAll('.nav-group').forEach(g => {
    g.classList.remove('open');
    g.querySelector('.nav-group-toggle')?.setAttribute('aria-expanded', 'false');
  });
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
    siteNav.style.opacity       = '0';
    siteNav.style.pointerEvents = 'none';
    state.activeLook = null;
    renderLookPanel('1');
  } else if (id === 'about') {
    fixedLookInfo.classList.remove('panel-visible');
    siteBreadcrumb.classList.add('visible');
    siteNav.style.opacity       = '';
    siteNav.style.pointerEvents = '';
  } else if (id === 'shop' || id === 'product') {
    fixedLookInfo.classList.remove('panel-visible');
    siteBreadcrumb.classList.add('visible');
    siteNav.style.opacity       = '';
    siteNav.style.pointerEvents = '';
    if (id === 'shop') {
      if (!currentRoute().startsWith('shop') && currentRoute() !== 'wishlist') {
        state.shopScope = 'new';
        state.shopCategory = 'all';
        setUrl('shop');
      }
      renderShop();
    }
  } else {
    fixedLookInfo.classList.remove('panel-visible');
    siteBreadcrumb.classList.remove('visible');
    siteNav.style.opacity       = '';
    siteNav.style.pointerEvents = '';
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
  if (navLinks.classList.contains('open')) closeNav();
  else { navLinks.classList.add('open'); navToggle.setAttribute('aria-expanded', 'true'); }
});

document.addEventListener('click', e => {
  if (!e.target.closest('.site-nav')) closeNav();
});
}
