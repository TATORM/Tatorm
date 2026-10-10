import { ROUTE_EVENT } from './url.js';

export function initNewsletter() {
/* ═══════════════════════════════════════════
   NEWSLETTER POPUP
   ═══════════════════════════════════════════ */
(function () {
  const popup      = document.getElementById('dropPopup');
  const overlay    = document.getElementById('dropPopupOverlay');
  const closeBtn   = document.getElementById('closeDropPopup');
  const panel      = popup.querySelector('.drop-popup__panel');
  const form       = document.getElementById('realMailchimpForm');
  const status     = document.getElementById('mailchimpStatus');
  const errorText  = document.getElementById('mailchimpError');
  const emailInput = document.getElementById('mce-EMAIL');
  let submitted    = false;

  function openPopup() {
    if (localStorage.getItem('tato-nl-done')) return;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    form.style.display = 'block';
    status.classList.remove('is-visible');
    errorText.classList.remove('is-visible');
  }

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
  }

  /* Apertura automatica: qualche secondo dopo l'intro, così non copre
     subito la pagina; mai sopra la Collection (coprirebbe il pannello del
     look): lì aspetta che si passi a un'altra pagina. */
  const AUTO_DELAY = 8000;    // ms dopo la fine dell'intro
  const AFTER_ROUTE = 3000;   // ms dopo essere usciti dalla Collection
  const inCollection = () => document.getElementById('collection')?.classList.contains('active');
  function autoOpen() {
    if (!inCollection()) { openPopup(); return; }
    const onRoute = () => setTimeout(() => {
      if (inCollection()) return;
      window.removeEventListener(ROUTE_EVENT, onRoute);
      openPopup();
    }, AFTER_ROUTE);
    window.addEventListener(ROUTE_EVENT, onRoute);
  }
  window.addEventListener('tato:intro-done', () => setTimeout(autoOpen, AUTO_DELAY), { once: true });

  closeBtn.addEventListener('click', closePopup);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });

  emailInput.addEventListener('input', () => {
    errorText.classList.remove('is-visible');
  });

  form.addEventListener('submit', e => {
    if (!emailInput.value.trim() || !emailInput.checkValidity()) {
      e.preventDefault();
      errorText.classList.add('is-visible');
      return;
    }
    errorText.classList.remove('is-visible');
    submitted = true;
    localStorage.setItem('tato-nl-done', '1');
    form.style.display = 'none';
    status.classList.add('is-visible');
    setTimeout(closePopup, 2500);
  });
})();

/* ─── Newsletter nel footer (stesso endpoint Mailchimp) ─── */
(function () {
  const fy = document.getElementById('footer-year');
  if (fy) fy.textContent = new Date().getFullYear();

  const form   = document.getElementById('footerMailchimpForm');
  const status = document.getElementById('footerMailchimpStatus');
  if (!form || !status) return;
  const email = form.querySelector('#footer-EMAIL');
  form.addEventListener('submit', e => {
    if (!email.value.trim() || !email.checkValidity()) { e.preventDefault(); return; }
    form.style.display = 'none';
    status.classList.add('is-visible');
    try { localStorage.setItem('tato-nl-done', '1'); } catch (_) {}
  });
})();
}
