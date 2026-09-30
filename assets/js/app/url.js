/* ═══════════════════════════════════════════
   URL veri (History API) al posto di #hash
   ─────────────────────────────────────────
   Rotta = percorso senza slash iniziale/finale:
     ''                  Home            → /
     'shop/women/pants'  Shop            → /shop/women/pants/
     'product/tobi-pants' PDP            → /product/tobi-pants/
     'collection' · 'about' · 'shipping' …
   Il build genera un index.html per ogni rotta nota (meta e JSON-LD
   propri); le altre arrivano da 404.html → /#rotta → convertita qui.
   I vecchi link con # (#product/…) continuano a funzionare.
   Ogni cambio di rotta emette l'evento `tato:route` su window.
   ═══════════════════════════════════════════ */

export const ROUTE_EVENT = 'tato:route';

const APP_ROOTS = ['shop', 'product', 'collection', 'about',
  'shipping', 'returns', 'faq', 'privacy', 'cookies', 'terms'];

const trim = s => String(s || '').replace(/^\/+|\/+$/g, '');

export function isAppRoute(route) {
  const r = trim(route);
  return r === '' || APP_ROOTS.includes(r.split('/')[0]);
}

/* 'shop/women' → '/shop/women/'   '' → '/' */
export function routeToPath(route) {
  const r = trim(route);
  return r ? `/${r}/` : '/';
}

export function currentRoute() {
  let path = location.pathname;
  try { path = decodeURIComponent(path); } catch (_) {}
  return trim(path);
}

function emit() {
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

/* Naviga a una rotta (nuova voce di cronologia) */
export function go(route) {
  const path = routeToPath(route);
  // i parametri (filtri dello shop…) appartengono alla pagina che si lascia
  if (location.pathname !== path || location.hash || location.search) history.pushState(null, '', path);
  emit();
}

/* Allinea l'indirizzo senza creare cronologia né rinavigare */
export function setUrl(route) {
  const path = routeToPath(route);
  if (location.pathname !== path || location.hash) history.replaceState(null, '', path + location.search);
}

/* Link interni → navigazione senza ricaricare la pagina */
function onClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('a[href]');
  if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
  const href = a.getAttribute('href');
  if (href === '#' || href === '') { e.preventDefault(); return; }   // link "finti" gestiti da JS
  let route = null;
  if (href.startsWith('#')) {
    route = trim(href.slice(1));                                   // vecchio formato #shop/…
  } else {
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    route = trim(url.pathname);
  }
  if (!isAppRoute(route)) return;
  e.preventDefault();
  go(route);
}

export function initUrl() {
  /* vecchio link #product/… (o arrivo da 404.html) → percorso vero */
  const legacy = trim(location.hash.slice(1));
  if (legacy && isAppRoute(legacy)) {
    history.replaceState(null, '', routeToPath(legacy) + location.search);
  }
  document.addEventListener('click', onClick);
  window.addEventListener('popstate', emit);
}
