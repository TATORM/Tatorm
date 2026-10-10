/* ═══════════════════════════════════════════
   MOTION — piccole animazioni di entrata
   ─────────────────────────────────────────
   · le foto prodotto compaiono in dissolvenza quando sono caricate
     (niente scatto da vuoto a pieno);
   · le card della griglia salgono di poco entrando nello schermo,
     una dopo l'altra lungo la riga.
   Tutto è aggiunto da qui alle immagini/card inserite nella pagina
   (MutationObserver): se il JS non parte, nulla resta nascosto.
   Spento con "riduci animazioni" del sistema.
   CSS in parts/motion.css.
   ═══════════════════════════════════════════ */
const FADE = '.pgrid-media img, .pdp-gallery-img, .pdp-complete-look img';
const STEP = 70;   // ms tra una card e la successiva

let io = null;

function fadeImg(img) {
  if (img.classList.contains('fade-img')) return;
  if (img.complete && img.naturalWidth) return;   // già pronta (cache): nessuna dissolvenza
  img.classList.add('fade-img');
  const done = () => img.classList.add('is-loaded');
  img.addEventListener('load', done, { once: true });
  img.addEventListener('error', done, { once: true });
}

function reveal(cell) {
  if (!io || cell.classList.contains('reveal')) return;
  cell.classList.add('reveal');
  io.observe(cell);
}

function scan(root) {
  if (!root.querySelectorAll) return;
  if (root.matches && root.matches(FADE)) fadeImg(root);
  root.querySelectorAll(FADE).forEach(fadeImg);
  if (root.matches && root.matches('.pgrid-cell')) reveal(root);
  root.querySelectorAll('.pgrid-cell').forEach(reveal);
}

export function initMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(entries => {
      let i = 0;
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.style.setProperty('--d', `${i++ * STEP}ms`);
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
  }

  scan(document.body);
  new MutationObserver(list => {
    list.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); }));
  }).observe(document.body, { childList: true, subtree: true });
}
