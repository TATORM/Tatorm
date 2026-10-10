/* 404.html → se il percorso è una pagina del sito (prodotto nuovo, categoria…)
   non ancora generata dal build, riapre il sito su /#percorso: app/url.js lo
   riconverte nel percorso vero e mostra la pagina (o "no longer available"). */
(function () {
  var route = location.pathname.replace(/^\/+|\/+$/g, '');
  var roots = ['shop', 'product', 'collection', 'archive', 'about', 'wishlist', 'shipping', 'returns', 'faq', 'privacy', 'cookies', 'terms'];
  if (route && roots.indexOf(route.split('/')[0]) !== -1) {
    location.replace('/' + location.search + '#' + route);
  }
})();

/* Stessa modalità scura e lingua scelte sul sito (theme.js, app/i18n.js) */
(function () {
  var dark = false, it = false;
  try {
    dark = localStorage.getItem('tato-dark') === 'true';
    it = localStorage.getItem('tato-lang') === 'it';
  } catch (_) {}
  if (dark) document.documentElement.classList.add('dark');
  if (!it) return;
  document.documentElement.lang = 'it';
  document.title = 'Pagina non trovata · TATO';
  document.addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('[data-it]');
    for (var i = 0; i < els.length; i++) els[i].textContent = els[i].getAttribute('data-it');
  });
})();
