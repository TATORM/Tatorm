# TATO — tatorm.com (mappa per Claude)

E-commerce headless di un brand di moda di Roma. HTML/CSS/JS vanilla, dati da Shopify
(Storefront API). Utente: designer, parla italiano, testi del sito in inglese + italiano.
**Stato e cose aperte: `docs/handoff.md`** (corto, leggilo a inizio sessione).

## Regole di lavoro
- Branch `ecommerce-dev` (live = `main`: NON pushare/mergiare su main senza ok esplicito, pubblica il sito).
- Commit dopo ogni modifica (messaggio in italiano + `Co-Authored-By`) e `git push` di `ecommerce-dev` (gh: account TATORM, scope workflow).
- Dopo modifiche: `npm run build` poi test (e2e e visivi girano sul build `_site/`, porta 4173).
  Differenze visive volute → `npm run test:visual:update`.
- Server dell'utente: `HOST=0.0.0.0 npm run dev` → http://localhost:8777 (sorgenti, niente build).
  Non uccidere `serve.mjs` con pkill generici (ferma anche quello dell'utente).
- NON leggere `assets/js/*-snapshot.js` (generati, ~55 KB) né `docs/archive/` salvo necessità.
- npx: la cache `~/.npm` ha permessi rotti → `npm_config_cache=<scratchpad>/npmcache npx …`.
- Testi: tono garbato da maison, niente trattini lunghi; nuove stringhe visibili → `t('…')` + voce IT in `i18n.js`.
- Estetica: niente pannelli/fasce bianche aggiunte; mostrare una prova prima di stravolgere.

## Comandi
| | |
|---|---|
| `npm run dev` | server sorgenti :8777 |
| `npm run build` | scarica catalogo+contenuti Shopify → `_site/` (esbuild + prerender) |
| `npm run preview` | serve `_site/` su :8001 |
| `npm run test:unit` / `npx playwright test` / `npm run test:visual` | 15 unit · 63 e2e · 64 visivi |
| `npm run a11y` | axe WCAG AA (con `preview` acceso; `DARK=true` per il tema scuro) |

## Dove sta cosa
```
index.html              pagina unica: header, sezioni vuote (#home #collection #shop #product #about #info), footer, drawer carrello, popup newsletter
404.html + 404.js       404 nello stile del sito; percorsi del sito non generati → riapre /#percorso
assets/js/
  main.js               entry (ordine: catalog-core → snapshot → content-core → snapshot → products → shopify → app)
  catalog-core.js       config Shopify (dominio, token, apiVersion), CATALOG_QUERY, Shopify → prodotti del sito
  content-core.js       Shopify (metaoggetti tato_collection / tato_look, pagine) → collezioni, look, pagine
  products.js           categorie, TATO_inCategory (tailored pants anche in Pants), look locali di riserva, helper globali
  shopify.js            dati dal vivo, varianti, valute/mercati (CURRENCIES), cartCreate → checkout
  app.js                avvio: elenco moduli e ordine di init
  app/
    url.js router.js    indirizzi veri (/shop/pants/, /product/x/, /collection/<handle>/), rotte
    nav.js              menu (Shop ▸ categorie, Collection ▸ collezioni), showSection, chiusura menu
    intro.js            splash + header a scomparsa allo scroll (shop/PDP)
    home.js             hero, reparti MEN/WOMEN, feed
    collection.js       caroselli look + pannello "Shop the look"; preorder.js = modale pre-ordine
    shop.js filters.js grid.js   griglia (una card per colore), filtri, card prodotto
    pdp.js zoom.js recent.js     scheda prodotto + guida taglie, zoom foto, visti di recente
    cart.js wishlist.js          bag (localStorage + checkout Shopify), wishlist
    i18n.js currency.js          EN/IT (dizionario t(), tColor/tComposition/tCare), valuta EUR/USD/GBP/JPY
    newsletter.js info.js meta.js theme.js motion.js dom.js state.js utils.js
assets/css/style.css    solo @import di parts/ (l'ordine conta: mobile.css e tablet.css in fondo)
assets/css/parts/       tokens (variabili, dark mode) · base · header · menu · home · collection · shop · grid · pdp · zoom · motion · cart · filters · footer · commerce · newsletter · about · breadcrumb · mobile (≤768) · tablet (769–1180)
scripts/                build · prerender · serve · fetch-catalog · fetch-content · images (AVIF) · import-looks (una tantum) · a11y
tests/                  unit (catalog/content core) · e2e (fixtures.mjs simula Shopify, anche mercati) · visual
docs/handoff.md         stato attuale e cose aperte
docs/guide/             guide per l'utente: prodotti e contenuti su Shopify, redirect del negozio Shopify, logo
docs/archive/           storico sessioni e liste del 30/09 (solo consultazione)
```

## Cose non ovvie
- `base.css` mette `pointer-events:none` su tutte le img (protezione foto): per renderne una cliccabile serve `pointer-events:auto`.
- Su mobile scorre `<body>`, non la finestra (scroll-snap). Posizione: `max(window.scrollY, body.scrollTop)`.
- Menu aperto spinge giù `#site` (`--menu-push`), tranne in home e Collection (sta sopra le foto).
- Header/logo/icone: `mix-blend-mode: difference` → colori invertiti sopra le foto.
- Prezzi: `money()` in utils.js (Intl). Valuta ≠ EUR solo se Shopify ha il mercato; filtro prezzo solo in EUR.
- Store Shopify: unica lingua italiano (checkout in IT), contenuti prodotto scritti in inglese.
- Negozio Shopify `pshgtp-ak.myshopify.com` reindirizza a tatorm.com (`docs/guide/shopify-redirect.liquid`, `nuovo_sito=false`).
