import { t } from './i18n.js';
import { esc } from './utils.js';

/* ═══════════════════════════════════════════
   PRE-ORDER — capi dei look non in vendita
   ─────────────────────────────────────────
   Nel pannello Collection i capi senza prodotto Shopify
   hanno "Pre-order" (al posto di "Archive piece"): apre
   questo form con capo e colore già compilati.

   INVIO
   • ENDPOINT vuoto  → si apre l'app di posta del cliente con
     la richiesta già scritta, indirizzata a EMAIL.
   • ENDPOINT = URL di un servizio form (es. Formspree:
     https://formspree.io/f/xxxx) → invio diretto dal sito,
     la richiesta arriva per email senza che il cliente
     esca dalla pagina. Aggiungere il dominio del servizio a
     connect-src nella Content-Security-Policy di index.html.
   Lo stesso invio serve anche "Notify me" (notify.js).
   ═══════════════════════════════════════════ */
export const ENDPOINT = '';
export const EMAIL = 'info@tatorm.com';

let overlay, form, statusEl, titleEl, lastFocus = null;

/* Taglie del catalogo (senza One Size), nell'ordine di Shopify */
function sizeOptions() {
  const seen = [];
  (window.TATO_PRODUCTS || []).forEach(p => (p.colors || []).forEach(c => (c.sizes || []).forEach(s => {
    if (!/one size/i.test(s.label) && !seen.includes(s.label)) seen.push(s.label);
  })));
  return seen;
}

function build() {
  overlay = document.createElement('div');
  overlay.className = 'sizeguide-overlay preorder-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="sizeguide preorder" role="dialog" aria-modal="true" aria-labelledby="preorder-title">
      <button class="sizeguide-close" type="button" aria-label="${t('Close pre-order')}">×</button>
      <p class="sizeguide-title" id="preorder-title">${t('Pre-order')}</p>
      <p class="preorder-intro">${t('Each piece is made to order, in small quantities. Leave your details and we will be in touch with price, timing and payment. Nothing is charged at this stage.')}</p>
      <form class="preorder-form" novalidate>
        <input type="hidden" name="piece">
        <div class="preorder-row">
          <label class="preorder-field"><span>${t('Colour')}</span><input name="color" autocomplete="off"></label>
          <label class="preorder-field"><span>${t('Size *')}</span><select name="size" required></select></label>
        </div>
        <div class="preorder-row">
          <label class="preorder-field"><span>${t('Name *')}</span><input name="name" autocomplete="name" required></label>
          <label class="preorder-field"><span>${t('Email *')}</span><input name="email" type="email" autocomplete="email" required></label>
        </div>
        <div class="preorder-row">
          <label class="preorder-field"><span>${t('Phone')}</span><input name="phone" type="tel" autocomplete="tel"></label>
          <label class="preorder-field"><span>${t('Country *')}</span><input name="country" autocomplete="country-name" required></label>
        </div>
        <label class="preorder-field"><span>${t('Notes')}</span><textarea name="notes" rows="2"></textarea></label>
        <label class="preorder-consent"><input type="checkbox" name="consent" required>
          <span>${t('I agree that TATO may use these details to reply to my request')} (<a href="/privacy/">privacy</a>).</span></label>
        <p class="preorder-error" role="alert" hidden></p>
        <div class="preorder-actions"><button class="preorder-submit" type="submit">${t('Send request')}</button></div>
      </form>
      <p class="preorder-status" role="status" hidden></p>
    </div>`;
  document.body.appendChild(overlay);
  form = overlay.querySelector('form');
  statusEl = overlay.querySelector('.preorder-status');
  titleEl = overlay.querySelector('#preorder-title');

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('.sizeguide-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) close(); });
  form.addEventListener('submit', submit);
}

function close() {
  overlay.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

function summary(d) {
  return [
    `Pre-order request: ${d.piece}`,
    '',
    `Piece: ${d.piece}`,
    `Colour: ${d.color || '—'}`,
    `Size: ${d.size}`,
    '',
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone || '—'}`,
    `Country: ${d.country}`,
    `Notes: ${d.notes || '—'}`,
  ].join('\n');
}

async function submit(e) {
  e.preventDefault();
  const err = form.querySelector('.preorder-error');
  if (!form.checkValidity()) {
    const bad = form.querySelector(':invalid');
    err.textContent = bad && bad.name === 'consent' ? t('Please tick the box to continue.')
      : bad && bad.type === 'email' ? t('Please check your email address.')
      : t('Please fill in the fields marked *.');
    err.hidden = false;
    if (bad) bad.focus();
    return;
  }
  err.hidden = true;
  const d = Object.fromEntries(new FormData(form).entries());
  delete d.consent;
  const subject = `Pre-order: ${d.piece}${d.color ? ` (${d.color})` : ''}, size ${d.size}`;

  if (ENDPOINT) {
    const btn = form.querySelector('.preorder-submit');
    btn.disabled = true;
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...d, _subject: subject, _replyto: d.email, message: summary(d) }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      done(t('Thank you. We have received your request and will be in touch by email.'));
    } catch (_) {
      err.textContent = t('Your request could not be sent. Please try again, or write to us at {email}.', { email: EMAIL });
      err.hidden = false;
    } finally {
      btn.disabled = false;
    }
    return;
  }
  // senza servizio form: email già scritta nell'app di posta del cliente
  location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary(d))}`;
  done(t("Thank you. Your email app will open with your request ready to send. If it doesn't, you can write to us at {email}.", { email: EMAIL }));
}

function done(msg) {
  form.hidden = true;
  statusEl.textContent = msg;
  statusEl.hidden = false;
}

export function openPreorder(item) {
  if (!overlay) build();
  lastFocus = document.activeElement;
  titleEl.textContent = t('Pre-order / {name}', { name: item.name });
  form.reset();
  form.hidden = false;
  statusEl.hidden = true;
  form.querySelector('.preorder-error').hidden = true;
  form.elements.piece.value = item.name;
  form.elements.color.value = item.color || '';
  form.elements.size.innerHTML = `<option value="">${t('Select')}</option>` +
    sizeOptions().map(s => `<option>${esc(s)}</option>`).join('') + `<option>${t('Not sure')}</option>`;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  form.elements.size.focus();
}
