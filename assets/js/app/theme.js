import { btnTheme } from './dom.js';

/* ═══════════════════════════════════════════
   DARK / LIGHT MODE TOGGLE
   ═══════════════════════════════════════════ */
export function applyTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  btnTheme.setAttribute('aria-pressed', String(dark));
}

export function toggleTheme() {
  const isDark = !document.body.classList.contains('dark-mode');
  applyTheme(isDark);
  localStorage.setItem('tato-dark', isDark);
}

export function initTheme() {
// Ripristina preferenza salvata
applyTheme(localStorage.getItem('tato-dark') === 'true');

btnTheme.addEventListener('click', toggleTheme);
// role="button" su un <div>: la tastiera non lo attiva da sé.
btnTheme.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); }
});
}
