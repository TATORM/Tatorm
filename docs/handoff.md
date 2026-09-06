# TATO — Handoff

**Ultimo aggiornamento:** 2026-09-06
**Branch di lavoro:** `ecommerce-dev`
**Branch live:** `main` → tatorm.com (invariato, non toccato).

---

## Rifacimento tecnico — piano in 5 fasi (dal 06/09)

Obiettivo: sito fluido e ottimizzato, aspetto invariato, resta vanilla su GitHub Pages.
Piano completo: artifact `Piano Tecnico TATO`
(https://claude.ai/code/artifact/825b75c5-4f41-484d-ac38-ebd7f8b3b5eb).
Decisioni bloccate: modello dati = **Opzione A "Shop the look"**; build = **esbuild + GitHub Action**.
Ordine fasi: 00 → 02 → 01 → 03 → 04 → 05.

### Fase 00 — Fondamenta & build ✅ (commit su `ecommerce-dev`)

- `package.json` (type: module). Script:
  - `npm run dev` → `esbuild --servedir=. --serve=127.0.0.1:8000` (statico, niente cache di index.html)
  - `npm run build` → `node scripts/build.mjs`
  - `npm run images` → `node scripts/images.mjs` (predisposto, usato in fase 02)
- `scripts/build.mjs`: esbuild bundla+minifica `assets/js/main.js` → `assets/dist/app-[hash].js`
  e `assets/css/style.css` → `assets/dist/app-[hash].css`, poi riscrive i tag in `index.html`
  tra i marker `<!-- build:css -->…` e `<!-- build:js -->…`. Flag `--check` = build senza toccare l'HTML.
  Prima prova: JS 35.5 KB, CSS 27.1 KB.
- `assets/js/main.js`: entry del bundle — `import` di products.js, shopify.js, script.js nell'ordine dei `<script>`.
  I file restano caricati singolarmente in dev (i sorgenti NON sono ancora moduli: quello è fase 04).
- `.github/workflows/deploy.yml`: al push su `main` → `npm ci && npm run build` → deploy Pages.
  **NON attivo finché Settings → Pages → Source non passa da "Deploy from a branch" a "GitHub Actions"**
  (cambia come si aggiorna tatorm.com — da fare a mano quando si è pronti al merge).
- `.gitignore`: aggiunti `node_modules/`, `assets/dist/`, `media/_src/`.
- **Modello:** `index.html` nel repo tiene sempre i tag SORGENTE tra i marker; `assets/dist/` è
  gitignored e lo rigenera la Action su un checkout usa-e-getta. Se lanci `npm run build` in
  locale ti riscrive `index.html` → `git checkout -- index.html` per tornare indietro.

## Fix mobile scroll ✅ (commit `eb4277b`)

Il body mobile era un contenitore `100dvh` con `scroll-snap-type: y mandatory` su ogni pagina.
Con la Home ridotta a 1 hero (unico snap point) → il browser risbatteva in cima, impossibile
navigare griglia prodotti / footer / PDP / pagine info.
- `body` mobile: `scroll-snap-type: y proximity` (era `mandatory`).
- `.home-image-block` mobile: rimosso `scroll-snap-align` → Home scorre libera. Lo snap
  per-look resta solo in `#collection`.
- `#info` aggiunto alla regola `html body #shop, #product { height:auto; overflow:visible }` mobile.
- Verificato a 614px: scroll resta a metà pagina (scrollTop 800 sulla griglia), niente overflow orizzontale.

## Production-readiness — P1 fatto (commit `2434775`)

Passata sulla spec "make it production-ready". Fatto in questo commit:
- **Shopify source of truth**: `shopify.js` recupera title/prezzo/compare-at/immagini/disponibilità
  per prodotto e variante (`productData`, `variantPrice`, `soldOut`, `availableColors`). PDP + griglia
  leggono da Shopify quando `ready`, fallback locale offline. PDP si ridisegna su `tato:shopify-ready`.
- **Variant integrity**: via il fallback "One Size" per capi con taglie; taglie/colori disabilitati per
  disponibilità Shopify; ADD TO BAG bloccato su sold-out o combinazione non disponibile; prezzo reale
  della variante salvato in carrello.
- **Cart**: persistenza `localStorage` (`tato-cart-v1`) + restore + sync tra tab; righe unite per
  variante con quantità (stepper +/−); "Continue shopping"; badge = somma qty; checkout con qty per riga.
- **Stati**: sold-out (griglia + PDP), swatch colore barrato, hint "not available", aria-busy sui bottoni.
- **Size guide**: modale `TATO_openSizeGuide(category)` — tabella per categoria, misure "—" + avviso
  (misure reali DA FORNIRE).
- **Info/legal**: sezione `#info` + `INFO_PAGES` → `#shipping #returns #faq #privacy #cookies #terms`,
  struttura pronta, ogni dato fattuale marcato `[DA FORNIRE: …]`. Footer con link reali.
- **SEO**: `404.html`, `robots.txt`, `sitemap.xml` (solo `/`), `setMeta()` per vista
  (title/description/canonical/OG), JSON-LD Product+Offer sulla PDP da dati Shopify.

**Da fare** (report completo dato in chat): mobile UX pass, analytics+consent, a11y audit,
favicon.ico + manifest, contenuti legali/shipping reali, indicizzabilità pagine prodotto
(SPA hash → serve prerender/SSG per OG e sitemap prodotti).

## Svolta mobile-first (decisa 06/09) — da fare

Priorità: pensare il sito **mobile-first**, flusso d'acquisto perfetto e preciso, poi riadattare il desktop.
Decisioni prese:
- **Struttura mobile**: si tiene quella del sito TATO **attualmente online** (swiper di foto fullscreen,
  layout editoriale in negativo) e ci si integra l'e-commerce — deve restare fluido, intuitivo, veloce,
  facile da comprare.
- **Nav mobile**: NO barra fissa in basso. Si tiene minimale — MENU in alto + BAG in alto — ma resi
  **sempre visibili e leggibili** (togliere la fragilità del `mix-blend-mode: difference` che a volte
  li fa sparire sopra le foto).
- **Newsletter popup mobile**: **ritardato** (dopo scroll o exit-intent), non alla prima schermata.
  Resta il form nel footer.
- Serve "tutto ciò che serve a un e-commerce di brand" ben fruibile: da definire in dettaglio
  (sticky Add-to-Bag su PDP mobile, gallery swipe, size guide, trust signal al checkout, ecc.).

### Fase 04a — Via l'SDK Shopify da CDN ✅ (commit `0cc9fd0`)

- `assets/js/shopify.js`: `init()` non usa più `js-buy-sdk`. **Una sola fetch GraphQL** allo Storefront
  endpoint (`_endpoint()` = `https://<domain>/api/<apiVersion>/graphql.json`, `apiVersion: '2024-10'`
  in `window.TATO_SHOPIFY`) con `product(handle:)` aliasati `p0`, `p1`, … + fragment `V` sulle varianti
  (`id availableForSale selectedOptions`). Nuovi helper `_endpoint()` / `_gql(query, variables)`;
  `createCheckoutUrl()` li riusa (era già `cartCreate` diretto).
- `index.html`: rimosso `<script src="sdks.shopifycdn.com/js-buy-sdk…">`. `scripts/build.mjs`: via la
  costante `SHOPIFY_SDK` e la sua iniezione nel blocco `build:js`.
- Verificato in browser (`javascript_tool`): `init` → `ready:true`, 10 handle con varianti + disponibilità
  reali (`tato-cap` Black disponibile, Navy/Red/Green no); `variantId()` risolve i GID;
  `createCheckoutUrl()` → URL `/cart/c/…` valido di Shopify.
- **Fase 04b (modularizzazione `script.js` → `src/js/modules/*` + event delegation) NON fatta** —
  è manutenzione, nessun beneficio utente; rimandata (probabilmente dopo/insieme al lavoro mobile).

### Fase 03 — Layout caroselli/home in CSS puro ✅ (commit `c06122c`)

- `assets/js/script.js`: **rimossi** `layoutCarousels()`, `layoutHome()`, l'handler
  `window.addEventListener('resize', …)` e la chiamata `layoutCarousels()` in `showSection`. −44 righe.
- `assets/css/style.css`:
  - `.look-carousel` — da `position:absolute` + `top`/`height` iniettati da JS → `position:relative`
    in flusso normale, `height:100vh; height:100dvh`, `margin:0 auto`. `.visual-column` senza altezza
    forzata (si somma da sé: 21 × 100dvh — verificato 16107px con vh 767).
  - `.home-hero` — `height:100dvh` in CSS invece di `innerHeight`px da JS.
  - **Blocco mobile Collection**: eliminati ~15 `!important` (`position/top/left/transform/width/height`
    su `.visual-column` / `.look-carousel` / `.carousel-track`) — le regole base ora fanno già la cosa
    giusta. Resta `.look-carousel { height:100dvh; scroll-snap-align:start }`.
  - Aggiunto `@media (prefers-reduced-motion: reduce)`.
- `100svh` scartato: su alcuni Chrome rende meno del viewport → uso `100dvh` (che è anche quello
  che il resto del blocco mobile usa già).
- Verificato: caroselli full-height impilati (0 / 767 / 1534 …), pannello IntersectionObserver
  sincronizzato allo scroll, hero full-height, zero errori console. Bundle JS 34.8 → 34.2 KB.
- **Aperto**: il deep-link `#collection` non sempre atterra in cima (scroll ~72px). Non è una
  regressione di layout (misure DOM perfette). Eventuale fix: `scrollTo(0,0)` dopo il doppio rAF.

### Fase 01 — Catalogo unico + "Shop the look" ✅ (commit `1b6e403`)

- `assets/js/products.js`: aggiunti `window.TATO_LOOKS` (21 look come lista di capi
  `{ name, comp, color, slug? }` — `slug` presente se il capo è uno dei 10 prodotti reali)
  e `window.TATO_resolveLook(n)` (unisce look + `price`/`currency` da `TATO_PRODUCTS`).
  Mappa nome→slug in `TATO_LOOK_SLUG`.
- `assets/js/script.js`: **rimossi `lookData` (177 righe) e `itemPrices`**. `renderLookPanel()`
  riscritto → "Shop the look": ogni capo mostra nome + composizione + colore; se a catalogo
  un `<a class="panel-item-shop" href="#product/<slug>">€… — Shop</a>`, altrimenti
  `<p class="panel-item-archive">Archive piece</p>`. Niente più size-picker/ADD TO CART nel pannello.
- **Routing**: `#collection` e `#about` sono rotte vere (`handleShopRoute` le gestisce,
  `initShopRoute` fa il deep-link al load, `showSection` sincronizza l'hash con `replaceState`).
  Nuovo `navToSection(id)` usato dai link `[data-section]` (menu + breadcrumb + footer) →
  crea la voce di cronologia così il tasto Indietro funziona. Hash vuoto → Home.
- `assets/css/style.css`: `.panel-item-shop` / `.panel-item-archive` (+ varianti nel blocco mobile,
  testo bianco). Il vecchio `pointer-events:auto` per `.size-btn`/`.panel-add-btn` → ora su `.panel-item-shop`.
- Verificato in browser: deep-link `#collection` e `#about`, pannello Shop-the-look (capo a
  catalogo = link con prezzo, gli altri = "Archive piece"), click sul capo → PDP giusta con
  "Seen in", zero errori console. Bundle JS 36.5 → 34.8 KB.
- **Aperto / da rivedere**: (1) il colore mostrato nel pannello è quello *del look* (editoriale) —
  può non essere un colore acquistabile di quel prodotto (es. Tobi Pants "White" nel Look 1, ma
  il drop è Black/Navy/Baby Pink). La PDP mostra i colori reali. (2) CSS morto rimasto:
  `.panel-item-price`, `.panel-size-row`, `.size-btn`, `.panel-add-btn`, `@keyframes size-pulse`,
  `.size-required` — pulizia in fase 05. (3) `productThumb()` in script.js resta dead code.

### Fase 02 — Immagini AVIF + lazy-load ✅ (commit `a005350`)

- `scripts/images.mjs`: legge gli originali in `media/{looks,home,products}` e genera
  accanto `<nome>-900.avif` + `<nome>-1440.avif` (sharp, q48). Niente WebP:
  AVIF (~95% browser) + originale jpg/png come fallback = 100%. `media/brand` e `assets` intatti.
  `npm run images` (solo mancanti) / `-- --force` (rigenera).
- **230 derivati AVIF committati** (`media/` 42 → 49 MB, `.git` → 83 MB).
  Hero 467 KB → 65 KB · look più pesante 453 KB → 57 KB · PNG home 838 KB → 11 KB.
- `assets/js/script.js`: helper `pictureHTML()` (stringa) e `pictureEl()` (DOM) →
  `<picture><source type="image/avif" srcset="…-900.avif 900w, …-1440.avif 1440w" sizes><img …></picture>`.
  Usati in: home feed (`appendPhotos`), griglia prodotti (`pgridCardHTML`), gallery PDP (`renderPDP`).
  L'hero è costruito via DOM (source PRIMA di img) per non scaricare due volte l'eager.
  Regex `HAS_DERIVATIVES = /^media\/(looks|home|products)\//` — path fuori da lì → solo `<img>`.
- `scripts/wire-pictures.mjs`: one-shot idempotente, converte i **74 `<img>` statici**
  dei caroselli in `index.html` in `<picture>` + `loading="lazy"`. Effetto: le ~30 MB di
  foto della Collection **non si scaricano più al primo load della Home**, solo aprendo la sezione.
- `assets/css/style.css`: `picture { display: contents }` → il wrapper sparisce dal box tree,
  tutte le regole `img` esistenti valgono invariate. Fix selettore prima immagine `.pdp-gallery`.
- Verificato in browser: AVIF servito su hero + caroselli, lazy-load rinvia i look non
  visibili (3 look su 21 al load), Shop mostra i packshot (prima lenti/vuoti), zero errori console.
- **Aperto**: hero è random (`shuffle`) → niente `<link rel=preload>` possibile senza fissarlo.

---

### Storico precedente

**Sessione 01/09** committata il 06/09 come `df80777`
(griglia editoriale, packshot, tassonomia ridotta, footer, menu shop-mode).

---

## Stato in una riga

Sito one-page statico (HTML/CSS/JS vanilla) con e-commerce a prodotti singoli
collegato a Shopify via Storefront Cart API. Catalogo = 10 prodotti reali del primo
drop, con packshot (flat tecnici) su ogni variante colore. Checkout reale testato.
In corso: pass di design (griglia editoriale, footer, menu). Manca: foto vere,
magazzino Shopify, URL pagine legali, merge su `main`.

---

## Modifiche non committate (sessione 01/09)

```
 M index.html
 M assets/css/style.css
 M assets/js/products.js
 M assets/js/script.js
 M docs/handoff.md
?? media/products/          20 PNG (~3,8 MB) — packshot flat per variante colore
```

Sintesi di cosa è cambiato rispetto a `09ce392`:

1. **Griglia prodotti editoriale `.pgrid`** condivisa Shop + Home.
2. **Packshot**: `colors[].images` popolati con i flat in `media/products/`.
3. **Tassonomia categorie** ridotta da 9 a **5**.
4. **Barra filtri Shop rimossa** → categorie nel menu (Women▸ / Men▸).
5. **Menu**: riposizionato in shop-mode, testi ridotti alla dimensione di "MENU".
6. **Home** ridotta: 1 riga di 4 prodotti + il cappello come singolo prodotto.
7. **Footer** nuovo, su fondo grigio scuro.

Dettaglio nelle sezioni sotto.

---

## Come girare in locale

```
cd "/Users/samuelemurru/Desktop/LAVORO/IN CONTINUAZIONE/TATO/SITO"
python3 -m http.server 8777
# http://localhost:8777/index.html?x   ← la query-string evita la cache di index.html
```

`file://` è bloccato dall'estensione Chrome, serve un server.
Ad ogni modifica di `assets/css/style.css` o `assets/js/*.js` → bumpare `?v=` nei tag
`<link>`/`<script>` di `index.html`:
`sed -i '' "s/?v=[0-9]*/?v=$(date +%s)/g" index.html`

Rotte: `#shop` · `#shop/women` · `#shop/women/pants` · `#shop/men/outerwear`
· `#shop/accessories` · `#product/tobi-pants`

---

## Struttura file

```
index.html · CNAME · README.md          root (index.html/CNAME richiesti da GitHub Pages)
assets/css/style.css
assets/js/products.js                    catalogo + categorie + helper foto (pshot, TATO_lookImages…)
assets/js/shopify.js                     integrazione Shopify (Storefront Cart API)
assets/js/script.js                      logica: splash, home feed, caroselli, shop/PDP, carrello, footer
assets/icons/                            favicon + apple-touch
media/brand/                             logotype.png · pictogram.png
media/home/                              01..21  (feed home; 20-21 .png)
media/looks/look-NN/                     01.jpg 02.jpg…  (ordine carosello)
media/products/<slug>/<colore>/01.png    packshot flat per variante colore (NUOVO, non committato)
docs/handoff.md
archive/                                 shop-test.html + unused-photos/ (gitignored) — fuori sito
```

Niente spazi/%20 nei path.

---

## Catalogo — `assets/js/products.js`

`window.TATO_PRODUCTS` — **10 prodotti reali** (drop TA001), slug = handle Shopify:

| slug | nome | categoria | colori | taglie | € |
|---|---|---|---|---|---|
| tobi-pants | TOBI PANTS | pants | Black · Navy · Baby Pink | 1–5 | 295 |
| 2-button-shirt | 2 BUTTON SHIRT | shirts | White · Light Grey/White · Baby Blue | 1–3 | 230 |
| 2-button-long-skirt | 2 BUTTON LONG SKIRT | skirts | Anthracite | 1–3 | 380 |
| triple-breasted-coat | TRIPLE BREASTED COAT | outerwear | Dark Blue | 1–2 | 950 |
| cropped-tailored-jacket | CROPPED TAILORED JACKET | outerwear | Anthracite | 1–3 | 680 |
| tailored-pants | TAILORED PANTS | pants | Anthracite | 1–3 | 490 |
| 2-button-tailored-pants | 2 BUTTON TAILORED PANTS | pants | Anthracite | 1–3 | 425 |
| tiny-crewneck | TINY CREWNECK | knitwear | Black · Baby Blue | 1–3 | 180 |
| smock-longsleeve | SMOCK LONGSLEEVE | knitwear | White · Burgundy/Navy · Black/Dark Grey | 1–3 | 100 |
| tato-cap | TATO CAP | accessories | Black · Navy · Red · Green | One Size | 70 |

Modello prodotto: `{ id, slug, name, category, price, currency, composition, care,
description, colors:[{ name, hex, images:[…], sizes:[{label,available}] }],
genders:['women','men'], lookRefs:[…], status:'available' }`.
Helper colore: `tatoColor(name, hex, sizes, images)` + `pshot(slug, colorSlug)`.

### Tassonomia (consolidata 01/09)

`window.TATO_CATEGORIES` — **5 voci**: **outerwear** (cappotti + giacche tailoring),
**shirts**, **knitwear** (ex "jersey"), **pants**, **skirts**.
`accessories` è gestita a parte (voce di menu a sé, senza filtro genere).
`window.TATO_DEPARTMENTS` = women, men.
Prima erano 9 (con dresses/knit/vquarto vuote): `cropped-tailored-jacket` spostato in
`outerwear`, `tiny-crewneck` + `smock-longsleeve` in `knitwear`.

### Filtri categoria → nel menu

Niente più barra `.shop-filters` sulla pagina Shop (rimossa da HTML + JS + CSS).
Le categorie si scelgono **dal menu**: voci `Women▸` / `Men▸` con sottomenu
(`navDeptSub()` in `script.js`). Il sottomenu mostra solo le categorie con ≥1 capo
per quel reparto (`window.TATO_categoriesFor(dept)` in `products.js` → niente "Skirts"
sotto Men). Il titolo della sezione Shop riporta reparto + categoria attiva
(`renderShopHead()`, es. "Men / Knitwear").
Le rotte `#shop/<dept>/<cat>` restano invariate; vecchi slug (`jersey`, `tailoring`, …)
non matchano più → degradano a "View All".

### Foto prodotto — packshot flat

Ogni colore ha il suo **packshot** (disegno tecnico su fondo bianco) in
`media/products/<slug>/<colore-slug>/01.png` — 20 file, ~3,8 MB, PNG 8-bit ridotti a
max 1800px. Popolati in `colors[].images` via `pshot()`. Sorgente:
`~/Desktop/SHOPIFY EXPORT/packshot/<slug>/` (flat trasparenti, appiattiti su bianco).
Se un colore avesse `images` vuoto → fallback alle foto dei look (`TATO_lookImages()`).

- Sono **disegni tecnici, non foto**: il front-end li rende con `object-fit: contain`
  + aria attorno + fondo bianco (classe `.is-flat` su `.pgrid-media` / `.pdp-gallery`,
  aggiunta quando la sorgente è un packshot). Quando arriveranno le **foto vere**:
  sostituire i file e togliere il ramo `.is-flat` dal CSS (torna a `object-fit: cover`).
- Mappatura colore→file verificata a vista (i multi-colore erano ambigui, vedi
  `SHOPIFY EXPORT/NOTE.md` punto 6). Es. tobi-pants: Black=`TOBI PANTS-01-31`,
  Navy=`BALOON PANTS-05-32`, Baby Pink=`BALOON PANTS-21-33`.

### Scelte fatte in autonomia, da confermare

1. `genders` — quasi tutto `['women','men']`; solo `2-button-long-skirt` è `['women']`.
2. `tailored-pants` e `2-button-tailored-pants` → categoria `pants` (non `outerwear`).
3. `tiny-crewneck` baby blue → SKU `TA001JE004BB` (nel Numbers era duplicato del nero).
4. Taglie `2-button-long-skirt` = 1–3 (nel file Shopify erano vuote).

---

## Design — sessione 01/09 (rif. dior.com)

### Griglia `.pgrid` (Shop + Home)

- `.pgrid` / `.pgrid-card` / `.pgrid-media` / `.pgrid-tag` / `.pgrid-name` / `.pgrid-price`
  in `style.css`; builder `pgridHTML(list, showTag)` / `pgridCardHTML(p, showTag)` in `script.js`.
- 4 colonne full-bleed, gap colonne **2px**, righe distanziate **84px**, nome + prezzo
  **centrati**, prezzo **nero** (`var(--black)`; mobile in negativo → `#fff`).
- Pill categoria: **solo in Home e in New Arrivals** (`shopScope==='new' && shopCategory==='all'`),
  nascosta nelle viste per reparto/categoria — passata via `showTag` a `pgridHTML()`.
- Shop: `#shop` full-bleed, `.shop-head` con solo il titolo (`#shop-grid` = `class="pgrid"`).

### Home (`buildHomeFeed()`)

- Hero foto a tutto schermo → **una sola riga** `.pgrid.home-pgrid` (primi 4 prodotti) →
  `.home-feature` = **il cappello come singolo prodotto** (card centrata, `max-width:340px`,
  `margin-bottom:100px` di stacco dal footer).
- Rimossi il resto del feed foto e lo scroll infinito.

### Menu

- **Shop-mode**: in alto a sinistra resta **solo il logo TATO** (→ home). Il bottone MENU
  è in alto a destra sotto le icone (`body.shop-mode .site-nav { top:58px; right:26px }`).
  Sulla home il MENU resta a destra centrato come prima.
- Testi delle voci ridotti alla dimensione del bottone MENU:
  `.nav-links > li > a` / `.nav-group-toggle` = `0.6rem` / `0.2em`; sottovoci `0.54rem`.

### Footer — `<footer class="site-footer">` in `index.html`

Fuori da `#site`, `z-index:70` (copre logo/MENU fissi quando ci si arriva).
Struttura ispirata a Dior, estetica TATO (testo micro uppercase, filetti sottili).
**Fondo grigio scuro `#1e1e1e` sempre** (token locali `--fg` / `--fg-dim` / `--fg-line`),
testo chiaro, logotipo invertito in bianco. Blocco mobile = solo layout (2 col, centrature).

- **Newsletter** — stesso endpoint Mailchimp del popup (form `#footerMailchimpForm`,
  IIFE dedicato in `script.js` che mostra la conferma; `#footer-year` = anno corrente).
- **4 colonne**: Shop (rotte `#shop*`) · Customer Care (Contact mailto + Shipping/FAQ
  placeholder `#`) · TATO (About/Collection via `data-section`, Press mailto) ·
  Legal (Privacy/Cookie/Terms placeholder `#`).
- **Barra bassa** (grid 3 colonne): riga 1 = "Follow · Instagram" (sx, link `#` — handle
  da mettere) · logotipo `media/brand/logotype.png` (centro, → home) · "Italy — EUR €"
  (dx, `.footer-region` su `grid-column:3; grid-row:1`). Riga 2 = "Designed in Rome —
  Made in Italy · © <anno> TATO" (centrato, `.footer-meta` span 1/-1). Su mobile tutto
  in colonna centrata.

### Ancora da rivedere

- Il logo `TATO` fisso si intravede dietro la 1ª card della griglia Home (z-index).
- Le icone fisse in alto a destra (toggle/monogramma/bag) sono scure e poco visibili
  sopra il footer grigio scuro.
- Menu: resta il dubbio dell'utente su un menu che entra da sinistra tipo Dior.
- PDP in stile Dior (foto piena a sx, nome grande, taglia a tendina, bottone scuro con
  prezzo dentro) — non ancora toccata.

---

## Shopify

- Negozio: **`pshgtp-ak.myshopify.com`** (admin.shopify.com/store/pshgtp-ak).
- **10 prodotti importati** da CSV (`~/Desktop/SHOPIFY EXPORT/tato-shopify-import.csv`),
  57 varianti, Vendor TATO. Import fatto il 31/08.
- Canale **Buy Button** installato, prodotti resi disponibili sul canale.
- Metodo di pagamento **manuale "TEST"** attivo (per gli ordini di prova).
- Vetrina: "Modalità privata" (password `thaosh`) — verificare se è ancora attiva.
- Packshot: `~/Desktop/SHOPIFY EXPORT/packshot/<slug>/` — da caricare a mano sui prodotti
  Shopify (il CSV non include immagini).
- Aperti: quantità di magazzino (ora ~0), foto, i 4 punti "da confermare", poi prodotti
  da Bozza ad Attivo.

### Integrazione — `assets/js/shopify.js`

- `window.TATO_SHOPIFY = { domain, storefrontToken }`. Token Storefront reale già dentro:
  `387e563b969e48b03ea0be98c1851e2f` (i token Storefront sono pubblici by design → ok in repo).
- SDK `js-buy-sdk` da CDN (in `index.html`) usato **solo** per il prefetch prodotti/varianti.
- `TATO_shopify.init(handles)` — costruisce la mappa `{ handle: { "Colore||Taglia": {id, available} } }`.
- **Checkout = Cart API** (`createCheckoutUrl`): la Checkout API è stata rimossa da Shopify,
  quindi mutation `cartCreate` diretta su `/api/2024-10/graphql.json` → `cart.checkoutUrl`.
- `script.js`: `ADD TO BAG` salva `shopifyVariantId`; `#cart-checkout` crea il carrello
  Shopify e reindirizza; `#cart-note` sincronizzato via evento `tato:shopify-ready`.
  Senza token il sito funziona lo stesso (checkout resta placeholder).

### Test fatto (31/08)

Sito locale → PDP TATO CAP → colore Black + One Size → ADD TO BAG → CHECKOUT →
pagina di pagamento reale Shopify raggiunta (`/checkouts/cn/…`), riga e totale corretti
(€70). Ordine non finalizzato.

---

## Prossimi passi

1. **Design** — chiudere il pass griglia (fatto), menu (in dubbio), poi PDP stile Dior.
2. **Footer** — mettere gli URL veri: Shipping & Returns, FAQ, Privacy Policy,
   Cookie Policy, Terms of Sale; handle Instagram reale.
3. **Packshot** — sul sito FATTO. Ancora: caricare i flat su Shopify (per variante) e,
   quando ci sono, sostituire i flat con le **foto vere** (poi togliere `.is-flat` dal CSS).
4. **Magazzino Shopify** — quantità reali per variante.
5. **Verifiche catalogo** — i 4 punti "da confermare" sopra.
6. **Pagamenti** — quando il negozio è su piano attivo, sostituire "TEST" con
   Shopify Payments / PayPal reali.
7. **Prodotti Shopify** da Bozza → Attivo.
8. **Commit + merge su `main`**:
   ```
   git add -A && git commit -m "..."          # su ecommerce-dev
   git checkout main && git merge ecommerce-dev && git push origin main
   ```
9. **Vetrina** — togliere/rimettere "Modalità privata" secondo quando aprire.

---

## Lookbook InDesign (invariato, non parte del sito)

Script `.jsx` nella cartella del progetto + copia in
`~/Library/Preferences/Adobe InDesign/Version 21.0/it_IT/Scripts/Scripts Panel/`.
Bug noto: con `MeasurementUnits.MILLIMETERS`, `pointSize`/`leading`/`strokeWeight`
vengono letti in mm → dividere per 2.834645669. Vedi `lookbook-tato-biblio.jsx`.
