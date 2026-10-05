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
