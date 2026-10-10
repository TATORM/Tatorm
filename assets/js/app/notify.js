import { t } from './i18n.js';
import { ENDPOINT, EMAIL } from './preorder.js';

/* ═══════════════════════════════════════════
   NOTIFY ME — taglia / colore esaurito
   ─────────────────────────────────────────
   Nella scheda prodotto, con una taglia o un colore esaurito,
   "Add to bag" diventa "Notify me when available" e apre qui
   sotto un campo email. La richiesta parte come il pre-ordine
   (ENDPOINT / EMAIL di preorder.js): con un servizio form arriva
   per email a TATO; senza, si apre l'app di posta del cliente.
   ═══════════════════════════════════════════ */

export function notifyFormHTML() {
  return `
    <form class="pdp-notify" id="pdp-notify" novalidate hidden>
      <p class="pdp-notify-copy" id="pdp-notify-copy"></p>
      <div class="pdp-notify-row">
        <label class="sr-only" for="pdp-notify-email">${t('Email')}</label>
        <input class="pdp-notify-input" id="pdp-notify-email" name="email" type="email" required
               autocomplete="email" inputmode="email" enterkeyhint="send" placeholder="${t('Email')}">
        <button class="pdp-notify-btn" type="submit">${t('Notify me')}</button>
      </div>
      <p class="pdp-notify-error" role="alert" hidden></p>
      <p class="pdp-notify-note">${t('We will only write to you about this piece.')} <a href="/privacy/">${t('Privacy')}</a></p>
    </form>
    <p class="pdp-notify-status" id="pdp-notify-status" role="status" hidden></p>`;
}

/* getItem() → { name, color, size } della selezione corrente (size null = qualsiasi) */
export function bindNotify(root, getItem) {
  const form = root.querySelector('#pdp-notify');
  if (!form) return { open() {}, close() {} };
  const copy = form.querySelector('#pdp-notify-copy');
  const email = form.querySelector('#pdp-notify-email');
  const err = form.querySelector('.pdp-notify-error');
  const status = root.querySelector('#pdp-notify-status');

  email.addEventListener('input', () => { err.hidden = true; });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!email.value.trim() || !email.checkValidity()) {
      err.textContent = t('Please check your email address.');
      err.hidden = false;
      email.focus();
      return;
    }
    const it = getItem();
    const size = it.size || t('Any size');
    const subject = `Notify me: ${it.name}, ${it.color}, size ${size}`;
    const message = [
      `Back in stock request: ${it.name}`,
      '',
      `Piece: ${it.name}`,
      `Colour: ${it.color}`,
      `Size: ${size}`,
      `Email: ${email.value.trim()}`,
    ].join('\n');

    if (ENDPOINT) {
      const btn = form.querySelector('.pdp-notify-btn');
      btn.disabled = true;
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ piece: it.name, color: it.color, size, email: email.value.trim(),
            _subject: subject, _replyto: email.value.trim(), message }),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        done(t('Thank you. We will write to you as soon as it is back.'));
      } catch (_) {
        err.textContent = t('Your request could not be sent. Please try again, or write to us at {email}.', { email: EMAIL });
        err.hidden = false;
      } finally {
        btn.disabled = false;
      }
      return;
    }
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    done(t("Thank you. Your email app will open with your request ready to send. If it doesn't, you can write to us at {email}.", { email: EMAIL }));
  });

  function done(msg) {
    form.hidden = true;
    status.textContent = msg;
    status.hidden = false;
  }

  return {
    open() {
      const it = getItem();
      copy.textContent = it.size
        ? t('{name} in {color}, size {size}, is sold out. Leave your email and we will let you know when it is back.', { name: it.name, color: it.color, size: it.size })
        : t('{name} in {color} is sold out. Leave your email and we will let you know when it is back.', { name: it.name, color: it.color });
      status.hidden = true;
      form.hidden = false;
      email.focus();
    },
    close() {
      form.hidden = true;
      status.hidden = true;
      err.hidden = true;
    },
  };
}
