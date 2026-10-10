import { t } from './i18n.js';
import { firstCollectionKey, renderLookPanel } from './collection.js';
import { fixedLookInfo, logo, navLinks, navToggle, siteBreadcrumb } from './dom.js';
import { renderHomeHero } from './home.js';
import { handleShopRoute } from './router.js';
import { renderShop } from './shop.js';
import { state } from './state.js';
import { esc, isDesktopViewport } from './utils.js';
import { currentRoute, go, setUrl } from './url.js';

/* ═══════════════════════════════════════════
   NAVIGAZIONE SEZIONI
   ═══════════════════════════════════════════ */
/* ─── Menu principale (voci sotto MENU, pagina sfumata) ──
   Shop ▸ (All · New arrivals · categorie · Accessories)
   · Collection · Archive (solo se ci sono collezioni passate) · About
   Solo le voci con prodotti: New arrivals = tag Shopify `new`.
   Women/Men non sono voci di menu: sono un filtro dello shop. */
export function shopMenuItems() {
  const products = window.TATO_PRODUCTS || [];
  const cats = (window.TATO_CATEGORIES || []).filter(c => products.some(p => window.TATO_inCategory(p, c.slug)));
  return [
    { href: '/shop/', label: t('All') },
    ...(products.some(p => (p.badges || []).includes('New')) ? [{ href: '/shop/new/', label: t('New arrivals') }] : []),
    ...cats.map(c => ({ href: `/shop/${c.slug}/`, label: t(c.label) })),
    ...(products.some(p => p.category === 'accessories') ? [{ href: '/shop/accessories/', label: t('Accessories') }] : []),
  ];
}

/* Collection ▸ una voce per collezione: la corrente (/collection/) e poi
   quelle d'archivio (/collection/<handle>/), dalla più recente */
export function collectionMenuItems() {
  const c = window.TATO_CONTENT;
  if (!c || !c.current) return [{ href: '/collection/', label: t('Collection') }];
  const name = col => [col.season, col.title].filter(Boolean).join(' ') || t('Collection');
  return [{ href: '/collection/', label: name(c.current) }]
    .concat(c.archive.map(col => ({ href: `/collection/${col.handle}/`, label: name(col) })));
}

export function renderNavMenu() {
  // pagina account Shopify: stesso indirizzo dell'icona nell'header (index.html)
  const account = document.getElementById('btn-account')?.getAttribute('href');
  navLinks.innerHTML = `
    <li class="nav-group open">
      <button type="button" class="nav-group-toggle" aria-expanded="true">${t('Shop')}</button>
      <ul class="nav-sub">${shopMenuItems().map(i => `<li><a href="${i.href}">${i.label}</a></li>`).join('')}</ul>
    </li>
    <li class="nav-group">
      <button type="button" class="nav-group-toggle" aria-expanded="false">${t('Collection')}</button>
      <ul class="nav-sub">${collectionMenuItems().map(i => `<li><a href="${i.href}">${esc(i.label)}</a></li>`).join('')}</ul>
    </li>
    <li><a href="/about/">${t('About')}</a></li>
    ${account ? `<li><a href="${account}">${t('Account')}</a></li>` : ''}
  `;
  /* i link veri li gestisce url.js (navigazione senza ricaricare);
     il menu si chiude al click su una voce (listener sotto) */
  navLinks.querySelectorAll('.nav-group-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.closest('.nav-group').classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
}

/* posizione di scroll della pagina (su mobile scorre <body>, vedi mobile.css) */
const pageY = () => Math.max(window.scrollY, document.body.scrollTop, document.documentElement.scrollTop);
let openedAtY = 0;
const CLOSE_AFTER = 40;   // px scorsi verso il basso con il menu aperto → si chiude

export function openNav() {
  openedAtY = pageY();
  navLinks.classList.add('open');
  document.body.classList.add('menu-open');
  navToggle.setAttribute('aria-expanded', 'true');
  // voce della pagina corrente evidenziata
  navLinks.querySelectorAll('a').forEach(a => {
    if (new URL(a.href).pathname === location.pathname) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

export function closeNav() {
  if (!navLinks.classList.contains('open')) return;
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
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
    renderLookPanel(firstCollectionKey());
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
  else if (id === 'about') setUrl(id);
  else if (id === 'collection' && !currentRoute().startsWith('collection/')) setUrl(id);   // /collection/<archivio>/ resta
  /* il menu NON si chiude qui: la pagina iniziale si disegna al "load" e
     chiuderebbe un menu appena aperto. Si chiude da sé su voce, click fuori, Indietro. */
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

/* Menu aperto → la pagina scende della stessa altezza delle voci, così
   le voci non finiscono sopra i testi (niente pannello né sfumatura).
   Segue l'animazione del menu fotogramma per fotogramma (ResizeObserver). */
if ('ResizeObserver' in window) {
  const MARGIN = 18;   // margin-top di .nav-links (menu.css)
  const site = document.getElementById('site');
  const root = document.documentElement;
  /* Pagina già scorsa: la parte di pagina dietro le voci resta vuota
     (colore di fondo), come quando il menu si apre in cima. */
  const update = () => {
    const r = navLinks.getBoundingClientRect();
    // in home e in Collection il menu resta sopra le foto: la pagina non scende
    const overPhotos = ['home', 'collection'].some(id => document.getElementById(id)?.classList.contains('active'));
    const open = r.height > 1 && !overPhotos;
    root.style.setProperty('--menu-push', (open ? Math.round(r.height + MARGIN) : 0) + 'px');
    // su mobile scorre <body> (mobile.css), non la finestra
    const scrolled = Math.max(window.scrollY, document.body.scrollTop, document.documentElement.scrollTop) > 0;
    const clip = open && scrolled ? Math.round(r.bottom + 24 - site.getBoundingClientRect().top) : 0;
    site.style.clipPath = clip > 0 ? `inset(${clip}px 0 0 0)` : '';
  };
  new ResizeObserver(update).observe(navLinks);
  document.addEventListener('scroll', () => { if (navLinks.classList.contains('open')) update(); }, { passive: true, capture: true });
}

/* Menu aperto + pagina scorsa verso il basso DAL VISITATORE → il menu si chiude.
   Contano solo gli scroll subito dopo un gesto (dito, rotellina, tasti): quelli
   automatici (scroll-snap del mobile, pagina che si ridisegna) no.
   Lo scroll dentro l'elenco delle voci non conta: pageY non cambia. */
let lastGesture = 0;
const GESTURE_MS = 800;
const gesture = () => { lastGesture = Date.now(); };
['wheel', 'touchmove'].forEach(ev => window.addEventListener(ev, gesture, { passive: true }));
window.addEventListener('keydown', e => {
  if (['ArrowDown', 'PageDown', 'End', ' '].includes(e.key)) gesture();
});
document.addEventListener('scroll', () => {
  if (!navLinks.classList.contains('open')) return;
  const y = pageY();
  if (Date.now() - lastGesture > GESTURE_MS) { openedAtY = y; return; }   // scroll automatico
  if (y - openedAtY > CLOSE_AFTER) closeNav();
  else if (y < openedAtY) openedAtY = y;   // risalendo si riparte da lì
}, { passive: true, capture: true });

/* ─── Toggle menu ────────────────────────── */
navToggle.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) closeNav();
  else openNav();
});
// click fuori dal menu, o su una sua voce → chiude
document.addEventListener('click', e => {
  if (!e.target.closest('.site-nav') || e.target.closest('#nav-links a')) closeNav();
});
window.addEventListener('popstate', closeNav);   // tasto Indietro
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
}
