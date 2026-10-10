import { logo, splashBg } from './dom.js';
import { ROUTE_EVENT } from './url.js';

export function initIntro() {
/* ═══════════════════════════════════════════
   SPLASH + ANIMAZIONE LOGO
   ─────────────────────────────────────────
   Il logo parte centrato (CSS default).
   Dopo 1.2s → aggiunge .logo--left → CSS
   transition lo porta a left: 3vw, top: 50%.
   Poi lo sfondo bianco fa fade-out.
   Il logo non sparisce mai.
   ═══════════════════════════════════════════ */
window.addEventListener('load', () => {

  setTimeout(() => {
    logo.classList.add('logo--left');

    setTimeout(() => {
      splashBg.classList.add('fade-out');

      setTimeout(() => {
        splashBg.style.display = 'none';
        window.dispatchEvent(new Event('tato:intro-done'));
      }, 580);

    }, 350);

  }, 1200);

});

/* ═══════════════════════════════════════════
   HEADER COMPATTO IN ALTO allo scroll
   Logo/MENU normalmente restano centrati in
   verticale (vedi .site-logo/.site-nav); scendendo
   si spostano negli angoli in alto (body.header-scrolled,
   regole in style.css). Ascolta sia window (desktop)
   che body (mobile, dove body stesso è lo scroll
   container — vedi media query ≤768px). */
(function () {
  const THRESHOLD = 80;
  /* Header a scomparsa (Shop/prodotto, regole in parts/shop.css):
     reagisce a un movimento deciso, non a ogni pixel. Scendendo sparisce
     dopo HIDE_AFTER px continui, risalendo torna dopo SHOW_AFTER px. */
  const HIDE_FROM  = 60;   // sopra questa quota l'header resta sempre visibile
  const HIDE_AFTER = 8;
  const SHOW_AFTER = 12;
  let ticking = false;
  let lastY = 0;
  let acc = 0;             // px accumulati nella direzione corrente (+giù / −su)
  function currentScrollY() {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  function maxScrollY() {
    const el = document.body.scrollHeight > document.body.clientHeight
      ? document.body : document.documentElement;
    return Math.max(0, el.scrollHeight - el.clientHeight);
  }
  function setHidden(on) {
    // con il menu aperto l'intestazione resta: le voci restano visibili
    if (on && document.body.classList.contains('menu-open')) return;
    document.body.classList.toggle('header-hidden', on);
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      /* clamp: ignora il rimbalzo elastico iOS in cima/in fondo */
      const y = Math.min(Math.max(currentScrollY(), 0), maxScrollY());
      document.body.classList.toggle('header-scrolled', y > THRESHOLD);
      const d = y - lastY;
      lastY = y;
      if (y <= HIDE_FROM) { acc = 0; setHidden(false); }
      else if (d !== 0) {
        if ((d > 0) !== (acc > 0)) acc = 0;   // cambio di direzione → riparte
        acc += d;
        if (acc > HIDE_AFTER) setHidden(true);
        else if (acc < -SHOW_AFTER) setHidden(false);
      }
      ticking = false;
    });
  }
  /* cambiando pagina l'header torna sempre visibile */
  window.addEventListener(ROUTE_EVENT, () => { acc = 0; lastY = 0; setHidden(false); });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.body.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
}
