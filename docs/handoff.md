# TATO — Handoff

**Ultimo aggiornamento:** 2026-09-30
**Branch di lavoro:** `ecommerce-dev` — HEAD `dcec316` (+ questo commit docs)
**Branch live:** `main` → tatorm.com (invariato, non toccato).

═══════════════════════════════════════════════════════════════════
## RIPRENDERE DA QUI (30/09)
═══════════════════════════════════════════════════════════════════
- **Desktop Shop/PDP** (`2fde548`): MENU di nuovo visibile in shop-mode, ancorato
  in alto a dx a 58px (come Home scrollata); su mobile resta nascosto. Pill
  categorie anche su desktop (riga centrata, a capo, outline grigio chiaro,
  attiva piena `var(--black)`). Scelta utente: "entrambi".
- **Collection mobile** (`fde58cf`): `body.collection-mode` (da `showSection`) →
  `scroll-snap-type: y mandatory` + `scroll-snap-stop: always` sui caroselli
  (prima proximity → si fermava a metà tra due look e il pannello fisso finiva
  sulla foto sotto). Pannello: via `mix-blend-mode` (illeggibile sui fondali
  bianchi) → bianco pieno + text-shadow, sfumatura carosello 45% fino a 0.72.
  `max-height: calc(100dvh - 140px)`: il pannello è pointer-events:none quindi
  non scrollabile, deve starci tutto (Look 11 = 4 capi). L'utente NON vuole
  toggle +/− : tutte le info (composizione, colore) sempre visibili.
- Aperto: header a scomparsa da provare su telefono vero, push bloccato.
- **Catalogo da Shopify** (`e1f45ba`): Shopify è l'UNICA fonte dei prodotti.
  `assets/js/catalog-core.js` (config Storefront + trasformazione, gira in browser
  e in Node) → `catalog-snapshot.js` generato da `npm run catalog`
  (`scripts/fetch-catalog.mjs`, incluso in `npm run build`, stampa un controllo
  qualità) → `products.js` costruisce `TATO_PRODUCTS` dalla copia →
  `shopify.js` aggiorna dal vivo (timeout 6s, 2 tentativi, fallback alla copia).
  Carrello riallineato (`reconcileCart`), PDP "no longer available", foto dalla
  CDN Shopify (`cdnSrcset`), `media/products/` eliminata. Deploy: cron 30 min.
  Guida + checklist per l'utente: `docs/shopify-prodotti.md`.
  Aperto lato Shopify: tag `women` sulla Long Skirt, foto per colore Smock,
  metafield `custom.care` (con accesso Storefront).
- **Sicurezza** (`117ec9a`): build → `_site/` con i soli file pubblici (lista
  `PUBLIC` in `scripts/build.mjs`; index.html del progetto non più riscritto),
  CSP + Referrer-Policy in index.html (se cambia il dominio Shopify → connect-src),
  `esc()` su tutti i testi esterni in script.js, handle/hex validati in
  catalog-core, Dependabot. Storia git senza segreti, remote pulito.
- **Test** (`e81f282`): `npm test` = build + `tests/unit` (node:test, catalogo)
  + `tests/e2e` (Playwright su `_site/`, desktop + Pixel 7, Shopify simulato in
  `fixtures.mjs`; fallisce su errori JS/console/CSP). CI: `test.yml` a ogni push,
  `deploy.yml` testa prima di pubblicare. Bug trovato: reconcileCart ora solo
  con dati dal vivo (`sh.live`). esbuild 0.28, sharp 0.35.
- Tipografia Collection desktop allineata alla PDP (pannello 0.54–0.62rem,
  breadcrumb 0.56rem).
- **Moduli** (punto 4): `script.js` eliminato → `assets/js/app.js` (avvio, stesso
  ordine di prima) + 16 moduli ES in `assets/js/app/` (state, dom, utils, grid,
  home, intro, nav, newsletter, cart, collection, shop, pdp, info, meta, router,
  theme). Stato condiviso in `app/state.js` (shopScope, shopCategory, pdp,
  activeLook). index.html carica `main.js` come `type="module"`.
  Dev: `npm run dev` (scripts/serve.mjs, porta 8777, Cache-Control no-store —
  con python http.server i moduli restano in cache).
- Piano sicurezza/struttura concordato (30/09): 1 ✅ catalogo Shopify →
  2 sicurezza (deploy solo dist/, escape innerHTML, CSP, token .git/config,
  main protetto, scope token Storefront) → 3 test Playwright in CI →
  4 moduli script.js → 5 URL veri prodotto (prerender) → 6 Cloudflare Pages
  (DNS Aruba; posta su Aruba mx.tatorm.com; manca SPF, DMARC p=none).

═══════════════════════════════════════════════════════════════════
## Sessione 28/09
═══════════════════════════════════════════════════════════════════

### Sessione 28/09 — pass mobile (Home, Shop, PDP)
Verificato in un iframe 390px dentro Chrome (localhost:8777). Desktop non toccato
salvo dove indicato.
- **Home si apriva in fondo** (`9691192`): `.site-footer` era l'unico snap point
  (body `scroll-snap-type: y proximity`) → al load Chrome ci si agganciava e ci
  restava mentre il feed cresceva. Footer mobile ora `scroll-snap-align:none`.
- **Header scrollato** (`9691192`): le regole `body.header-scrolled` erano globali
  → su mobile MENU scendeva a 58px e il logo perdeva `translateX(-50%)`. Ora dentro
  `@media (min-width:769px)`.
- **Men/Women su mobile** (`e13e6a2`): tile 3:4 affiancate, gap 2px. Hero mobile
  resta sulle foto dei look (scelta utente).
- **Polish Home** (`928c9b9`): sfumatura scura sul fondo hero, monogramma bianco
  pieno + icone opacity 1, `.pgrid-name` padding 0 10px, `.home-look(-pair)` 44px.
- **PDP overflow** (`2e60e6d`): `.pdp-main` mobile `minmax(0,1fr)` (con `1fr` la
  fila `.pdp-tabs` nowrap allargava la PDP a ~520px).
- **Shop pill + header a scomparsa**: `#shop-pills` + `renderShopPills()` (solo
  mobile via CSS): All · Women · Men · categorie con prodotti nello scope ·
  Accessories; categorie mantengono lo scope; `.is-scope` = reparto attivo.
  `body.header-hidden` (JS nel listener header) nasconde logo/icone scendendo
  in shop-mode mobile, ricompaiono risalendo (`8bb21d9`).
- **Header a scomparsa rifatto "più fluido"** (`80eb1db`, soglie `26e157c`):
  l'utente lo trovava strano (scattava a ogni 4px, rimbalzo iOS lo faceva
  ricomparire, slide rigido). Ora movimento **accumulato** per direzione:
  `HIDE_FROM = 60` (sopra resta sempre visibile), `HIDE_AFTER = 8` px giù per
  sparire, `SHOW_AFTER = 12` px su per ricomparire; scrollY clampato a
  [0, max] (ignora bounce iOS); su `hashchange` torna sempre visibile.
  CSS: logo+icone salgono insieme di 72px con fade, `translate3d`,
  `0.42s cubic-bezier(0.22,0.61,0.36,1)`, `pointer-events:none` da nascosti.
  Prima taratura era 140/24 → l'utente l'ha voluto "sparire prima".
  **Da verificare su telefono vero** (Chrome in background sospende rAF → in
  browser non si è visto l'effetto; logica verificata con simulazione Node).
  Test da telefono: `python3 -m http.server 8777` + `http://<IP Mac>:8777/#shop`.

### Note di metodo (28/09)
- Test mobile in Chrome: `resize_window` non ha effetto se la finestra è
  massimizzata → iniettare in una pagina localhost un `<iframe>` 390×viewport
  sul sito. Bumpare sempre `?v=` (`sed -E "s/\?v=[0-9]+/?v=$(date +%s)/g" index.html`),
  altrimenti il CSS vecchio resta in cache.

### Aperto dopo il 28/09
- Pill categorie anche su desktop? (Shop/PDP desktop non hanno MENU → nessuna
  navigazione tra categorie). Da decidere con l'utente.
- Collection mobile non ancora ripassata.
- Push ancora bloccato (account `samuelemurru1-wq` senza permessi su TATORM),
  tutti i commit restano locali su `ecommerce-dev`.

═══════════════════════════════════════════════════════════════════
## Sessione 16/09
═══════════════════════════════════════════════════════════════════

### Sessione 16/09 — pass di design sulla Home, solo desktop (commit `402feaa`…`4db3bd9`, 13 commit)

Lavoro a piccoli step guidato da screenshot/feedback dal vivo, ogni pezzo
verificato nel browser reale (locale, `python3 -m http.server 8777`)
prima del commit. **Tutto scoped a desktop (`min-width:769px`) — il
mobile non è stato toccato in nessuno dei punti sotto**, resta come
da fine sessione 14/09.

- **Shop grid / card prodotto** (`402feaa`, `9e21a83`, `eb3aab4`):
  - Tolta la pill categoria sopra la foto preview (`.pgrid-tag`, esisteva
    solo in Home/New Arrivals).
  - Aggiunti pallini colore (`.pgrid-swatches`/`.pgrid-swatch`) sotto il
    **prezzo** di ogni card, ovunque: Shop, Home (sia le card di
    prodotto sia quelle per singola colorway — su queste ultime il
    pallino della colorway mostrata è evidenziato con un anello,
    `.pgrid-swatch.is-active`), "Complete the look" in PDP. Prima le
    card per-colorway della Home mostravano solo il nome testuale del
    colore (`.pgrid-colour`, ora rimossa) — inconsistente col resto.
  - `pgridCardHTML(p, colorIdx)`: firma semplificata (via il vecchio
    parametro `showTag`, morto insieme al tag).

- **Header (logo/MENU) fisso in alto allo scroll** (`ae2cae6`, poi
  esteso): normalmente centrato in verticale (`.site-logo`/`.site-nav`,
  invariato); scendendo con lo scroll di 80px si ancora in alto agli
  angoli (`body.header-scrolled`, listener in script.js su `window` e
  `body` per coprire anche mobile — ma le regole CSS che spostano
  top/transform sono dentro `@media (min-width:769px)`).

- **Hero Home ridisegnato, solo desktop** (`b5d4394`→`b446b04`):
  - Pool dedicato `heroPhotosDesktop` (`media/home/hero/`) invece del
    vecchio `allHomePhotos` generico (quello resta per il fallback
    mobile, invariato). Partito da 8 foto "book" fornite dall'utente
    (compresse con sips 2800px/q92 dagli originali in
    `~/Desktop/.../TATO/FOTO POST PRODOTTE X BOOK/`), **ridotto a 5**
    (`02,04,05,06,08.jpg`): le altre 3 (`01,03,07`) erano scatti di
    dettaglio ravvicinati (piedi/pantaloni, no volto/busto) che a
    schermo intero restavano tagliati male qualunque object-position
    si usasse — il soggetto era già al bordo dello scatto originale.
    Restano nel repo (derivate comprese) ma fuori dal pool random.
  - `renderHomeHero()`: pesca una foto a caso dal pool e la richiama
    **anche tornando alla Home da un'altra sezione** (chiamata in
    `showSection`), non solo al load iniziale come prima.
  - L'hero è ora **full-bleed** (`width:100vw` + margini negativi,
    invece della colonna `--image-width` ~700px) e **+100px di
    altezza** (`100dvh + 100px`). Specificità raddoppiata
    (`.home-hero.home-image-block`) per battere `.home-image-block`
    più sotto nel file.
  - `scripts/images.mjs`: `media/home/hero/` ora genera derivati AVIF
    **1600/2400w a qualità 62** (il resto del sito resta 900/1440 q48,
    tarato per le miniature) — a piena larghezza su monitor grandi le
    derivate piccole sgranavano vistosamente. `pictureEl()` accetta un
    `opts.widths` per il srcset, usato solo qui.
  - **HUD in negativo su desktop** (`ab85cdb`, fix toggle `73d4ff9`):
    logo/`.top-icons`/MENU ora `mix-blend-mode:difference` (stessa
    tecnica già in uso su mobile) — si autoadattano al contrasto di
    quel che hanno dietro invece di restare sempre neri e sparire
    sulle foto scure dell'hero. Il toggle dark/light usava
    `var(--black)` (quasi nero) per bordo/pallino → differenza minima
    contro sfondo scuro → sparito anche lui finché non portato a
    bianco pieno come le altre icone.

- **Nuova sezione Men/Women sotto l'hero, stile Dior** (`7473540`, poi
  rifinita in `0e21364`/`1b24454`/`4db3bd9`): due foto full-bleed
  affiancate (`media/home/hero/05.jpg` uomo, `06.jpg` donna — i due
  ritratti più "puliti" del set), `renderHomeDepartments()` chiamata
  subito dopo `renderHomeHero()` in `buildHomeFeed`. Link a
  `#shop/men` / `#shop/women`. Solo titolo **MEN**/**WOMEN** in basso
  a sx (font-size `0.9rem`, ridotto da un primo `1.4rem` troppo
  grande) — niente più link "Discover" sotto (tolto su richiesta),
  niente più zoom al hover (tolto, l'immagine resta ferma). Sezione
  nascosta `display:none` sotto i 769px, il pass mobile per questo
  blocco resta da fare.

- **PDP — taglia "OS" sul TATO CAP** (`402feaa`): per i prodotti
  One Size (`singleSize`) prima la riga taglia spariva del tutto senza
  mostrare nulla; ora mostra un'etichetta statica "OS" sotto "Size".
  Non tocca la logica di matching con Shopify (resta `'One Size'`
  internamente, solo la label mostrata è "OS").

### Blocco push — invariato ma causa chiarita
Il push resta bloccato (tutti i 13 commit di questa sessione + i
precedenti restano **solo locali**), ma la causa non è più il token
scaduto: `gh auth login` risulta autenticato come **`samuelemurru1-wq`**,
un account **senza permessi di scrittura** su `TATORM/Tatorm` (è il
repo dell'account org **TATORM**, non dell'account personale). Il
remote è stato ripulito (tolto il vecchio token in chiaro dall'URL,
ora `https://github.com/TATORM/Tatorm.git`). Per sbloccare, una di:
1. generare un nuovo Personal Access Token dall'account GitHub TATORM
   e usarlo per il push;
2. `gh auth login` scegliendo l'account TATORM;
3. aggiungere `samuelemurru1-wq` come collaboratore del repo su TATORM
   (Settings → Collaborators).
L'utente ha scelto di rimandare — per ora si continua a lavorare e
committare in locale.

═══════════════════════════════════════════════════════════════════
## Sessione precedente (14/09 sera)
═══════════════════════════════════════════════════════════════════

### Sessione pomeriggio/sera — pass di rifinitura su menu/carrello (commit `9d2e40f`…`ed61e3c`)

Lavoro a piccoli step guidato da screenshot dal vivo (l'utente segue la sessione
e manda feedback visivo a ogni giro), tutto verificato nel browser reale prima
del commit.

- **Cartelle riorganizzate**: `SHOPIFY EXPORT/` e il kit font `~/Desktop/font/`
  sono stati spostati dall'utente dentro `SITO/` (consolidamento manuale, non
  più sparsi sul Desktop). Aggiunte a `.gitignore` (`ESHOP/`, `SHOPIFY EXPORT/`)
  — materiale di riferimento/lavoro, non asset del sito, mai da trackare.
- **Menu desktop** (`.nav-links`/`.nav-group-toggle`/`.nav-sub`, `style.css`):
  rifatto a più riprese per taglia/colore/interlinea, partendo dal design del
  sito **live** (`main`) come riferimento (testo non-maiuscolo, colore
  `var(--gray)` con hover a `var(--black)`, niente più il nero pieno/uppercase
  di prima). Sequenza reale della sessione (ogni step confermato/corretto
  dall'utente via screenshot, **non prendere solo l'ultimo valore per buono
  senza guardare gli step intermedi se si riparte da qui**):
  1. `b3363e5` — taglia/colore/interlinea come il live, ma col font nuovo:
     `font-size` invariato a `0.6rem`/`0.54rem`, tolto `text-transform:uppercase`,
     `line-height` da 2.6/2.2 a 1, colore da nero a `--gray`+hover.
  2. `162e0b9` — l'utente lo trova ancora troppo grande → **-5pt** un po' a
     naso su tutti i livelli: `0.6rem→0.35rem` (MENU + voci primo livello),
     `0.54rem→0.29rem` (sottomenu). **Da queste due modifiche in poi "diminuisci/
     aumenta di N pt" è stato interpretato come N px letti sul valore calcolato
     a schermo** (root `html{font-size:125%}` = 20px → 0.35rem = 7px), non pt
     tipografici in senso stretto: è così che i numeri qui sotto tornano.
  3. `93a1265` — troppo piccolo e illeggibile con le sottocategorie aperte →
     **+3pt**: `0.35rem→0.5rem`, `0.29rem→0.44rem`. In più, la spaziatura non
     reggeva più (era tutta affidata al `line-height`, inaffidabile col
     maiuscolo): `.nav-links` gap `1px→8px`; `.nav-sub a` passa da spaziatura
     via `line-height:1.6` a `padding:5px 0` esplicito.
  4. `c4d1d59` — mancava aria tra il toggle Women/Men e la prima voce del
     sottomenu (stesso `<li>`, il gap di `.nav-links` non si applica lì) →
     `.nav-group.open > .nav-sub { margin-top: 8px }`.
  **Stato finale**: MENU/voci primo livello `0.5rem` (~10px), sottomenu
  `0.44rem` (~8.8px), tutto in `var(--gray)`/hover `var(--black)`, spaziatura
  via `gap`/`padding` non più `line-height`. Se si ritocca ancora, ragionare
  in px assoluti (root a 20px) più che in rem a mente.
- **Shop grid — tag categoria sui packshot**: provato a spostarlo fuori
  dall'overlay sull'immagine (era sovrapposto al disegno tecnico) in
  `4e275f1`, **poi annullato con `git revert` in `65f237f`** su richiesta
  esplicita ("rimetti la categoria come prima") — è tornato l'overlay
  assoluto originale (top:12px/left:12px sopra il packshot). Se si riprova
  in futuro, il codice del tentativo (spostare `${tag}` prima di
  `.pgrid-media` in `pgridCardHTML`, classe `.pgrid-tag--flat`) è nella storia
  git di `4e275f1`, non serve reinventarlo da zero — ma **non richiesto ora**.
- **Carrello — miniatura prodotto** (`ed61e3c`): `addToCart` (nel listener
  `#pdp-add` di `renderPDP`) ora salva anche `image`/`imageFlat` (stessa foto
  già calcolata per la gallery PDP: packshot o, in mancanza, foto del look).
  `renderCart()` la mostra come `<picture>` 56px prima del nome prodotto,
  classe `.cart-item-thumb` (+ `.is-flat` per i packshot, stesso trattamento
  `object-fit:contain` su bianco di `.pgrid-media.is-flat`). Righe carrello
  già in `localStorage` da PRIMA di questa modifica non hanno `image` →
  fallback `.ph-block` grigio, non si rompe nulla. Verificato end-to-end:
  miniatura visibile nel drawer E trascinata fino al checkout Shopify reale
  (Cart API → il checkout Shopify la mostra di suo).
- **Chiarito, non è un bug nostro**: il logo "TATO" nella pagina di
  **checkout Shopify** (`pshgtp-ak.myshopify.com/checkouts/...`) porta alla
  home del tema Shopify di default (non configurato, contenuti placeholder
  "Browse our latest products") invece che a tatorm.com. Il checkout è
  **hostato da Shopify**, non è il nostro `index.html`/`script.js` — quel
  logo è del tema di checkout Shopify, il link va al dominio primario del
  negozio, che oggi è ancora `pshgtp-ak.myshopify.com` (nessun dominio
  custom collegato). Si risolve solo da **Shopify Admin**, non da codice:
  Impostazioni → Domini (collegare `tatorm.com`) + Impostazioni →
  Check-out → Branding. Stesso blocco già in lista sotto, punto 3.

### Fase 05 ✅ (commit `a1cd622`) — font self-host, a11y, Lighthouse CI
- **Font**: Neue Haas Grotesk Display self-hosted in `assets/fonts/` (solo i 3 pesi
  usati: Light 300, Medium 500, Bold→600), `@font-face` + `font-display:swap` in
  `style.css`, `<link rel=preload>` del peso Medium in `index.html`. File sorgente
  dell'utente: `~/Desktop/font/` (kit woff/woff2/ttf/eot con licenza web). `build.mjs`
  aggiornato (`external: ['*.woff','*.woff2']`) perché altrimenti esbuild non sapeva
  bundlare i `.woff2` referenziati dal CSS.
- **`lang="it"` → `"en"`**: il copy del sito è tutto in inglese, solo le meta
  description/OG/Twitter/JSON-LD erano rimaste in italiano → tradotte per coerenza.
- **`<h1>`**: aggiunto (sr-only) in Home — prima non esisteva NESSUN h1 nel sito.
- **Alt text reali**: le 74 immagini dei caroselli Collection avevano tutte `alt=""`
  → `"TATO — Look N, view X of Y"` (script Python one-off, non salvato). Stesso
  trattamento per le foto editoriali/di look nell'home feed (`script.js`,
  `homePhotoAlt()`) che non avevano alt. Griglia prodotti/PDP erano già a posto.
- **Focus da tastiera**: `:where(a,button,[role=button],input,select,textarea):focus-visible`
  globale — `:where()` azzera la specificità apposta così i campi con un trattamento
  focus già disegnato (`.mailchimp-custom-input`, `.pdp-size-select`, …) continuano
  a vincere senza bisogno di eccezioni sparse.
- **`aria-expanded`**: su `#nav-toggle` (MENU) e sui due `.nav-group-toggle`
  (Women/Men). **Bonus**: il toggle dark mode era un `<div role="button">` senza
  `tabindex` né gestione tastiera → aggiunto `tabindex="0"`, `aria-pressed`,
  handler `keydown` (Enter/Spazio).
- **Lighthouse CI**: `.github/workflows/lighthouse.yml` + `.github/lighthouse/lighthouserc.json`
  — gira `npm run build` poi audita la build reale (staticDistDir) su Home e
  `#shop`, preset mobile di default. Accessibilità ≥0.95 **bloccante**; performance/
  best-practices/seo ≥0.90 solo **warning** (i runner condivisi di GH Actions hanno
  troppa varianza di CPU per un hard-fail affidabile su performance). Non ancora
  verificato con una run reale (serve push, vedi sotto).
- Verificato in browser (locale, sia sorgenti che build `npm run build`): font
  caricato (`document.fonts` → 3 face "loaded"), zero errori console, nav/tema
  funzionanti, alt presenti.
- **Non fatto**: fase 04b (modularizzazione `script.js`) — resta manutenzione,
  rimandata come da piano.

### Blocchi che dipendono da te (non-codice) — aggiornato
1. **Push** — ancora bloccato, vedi sotto (invariato dal 06/09).
2. **GitHub Pages** → Settings → Pages → Source da "Deploy from a branch" a
   **"GitHub Actions"** (farlo al merge su `main`).
3. **Shopify**: stock 0 ovunque, 10 prodotti in Bozza, vetrina con password,
   gateway "TEST", nome negozio da sistemare (invariato dal 06/09). **+ dominio**:
   nessun dominio custom collegato → il checkout Shopify (logo/link "torna al
   negozio") rimanda a `pshgtp-ak.myshopify.com` col tema demo non configurato
   invece che a tatorm.com. Impostazioni → Domini (collega `tatorm.com`) +
   Impostazioni → Check-out → Branding. Non è un bug nel nostro codice: il
   checkout è hostato da Shopify, fuori da `index.html`/`script.js`.
4. ~~**Font**~~ — risolto oggi, self-hosted.
5. **Analytics + consenso cookie**: non impostati.
6. **Contenuti legali/spedizioni/resi**: tutto marcato `[DA FORNIRE: …]`.
7. **Lighthouse CI**: la prima run reale richiede il push (workflow gira su
   push/PR); da controllare i punteggi effettivi appena sbloccato il push.

### Come girare in locale
```
cd "/Users/samuelemurru/Desktop/LAVORO/IN CONTINUAZIONE/TATO/SITO"
python3 -m http.server 8000        # se non è già su
# desktop:  http://localhost:8000/?vN     (cambia N a ogni modifica → bypassa la cache)
# mobile:   http://192.168.1.190:8000/?vN (telefono su stessa Wi-Fi)
```
`assets/dist/` è generato/gitignored; in locale servono i tag SORGENTE in `index.html`.
Dopo ogni modifica a css/js: `npm run build` riscrive i tag dist tra i marker →
**va poi ripristinato ai tag sorgente** (perl one-liner nei log della sessione) e
bumpato `?v=` con `sed -i '' "s/?v=[0-9]*/?v=$(date +%s)/g" index.html`.

### Stato Git — NIENTE È PUSHATO
~26 commit locali su `ecommerce-dev`, **0 pushati** (il token in `.git/config` è
scaduto ed era in chiaro). Working tree pulito.
Per sbloccare: `gh auth login` + `git remote set-url origin https://github.com/TATORM/Tatorm.git`
poi `git push origin ecommerce-dev`.

### Fatto il 06/09 — sopra il piano in 5 fasi
- **Fasi 00–04a** del piano tecnico (build esbuild + GitHub Action, immagini AVIF+lazy,
  catalogo unico + "Shop the look", layout in CSS puro, via SDK js-buy-sdk).
- **Production-readiness P1** (`2434775`): Shopify = fonte per prezzo/compare-at/
  disponibilità/sold-out; variant integrity (taglie/colori disabilitati, add bloccato);
  carrello in `localStorage` (`tato-cart-v1`) con quantità + sync tra tab; stati e-commerce;
  size guide modale; pagine `#info` (shipping/returns/legal) con placeholder flaggati;
  `404.html`, `robots.txt`, `sitemap.xml` (solo `/`), `setMeta()` per vista, JSON-LD Product.
  Checklist completa: artifact https://claude.ai/code/artifact/9ed06868-85dd-499b-9945-529ed1d32eaa
- **Fix scroll mobile** (`eb4277b`): `scroll-snap-type` da `mandatory` → `proximity`; Home
  senza snap → scorre libera; `#info` come documento normale su mobile.
- **Fix "categorie dal fondo"** (`0b8118f`): `showSection()` → `resetScroll()` nel doppio rAF.
- **PDP rifatta su modello Dior** (`1055915`, poi `2f20286`/`f2d702b`/`a85ec6b`): immagine a
  filo sx + info dx; nome+materiale+`Ref. TATO-Pxx`; taglia = `<select>`; `.pdp-add-btn` con
  prezzo DENTRO il bottone; nuovo `.pdp-express-btn` (checkout diretto singola variante);
  delivery/phone = placeholder; accordion → `.pdp-tabs`; sezione `.pdp-complete`
  "Complete the look" = foto look a sx + ≥2 capi consigliati a dx (da tutti i `lookRefs`,
  riempiti con stessa categoria / altri), allineati in alto, nessun vuoto verso il footer.
- **Home** (`0b8118f` → `5b9e01f`): dopo l'hero, tutte le colorway (una card per prodotto×colore)
  mescolate a ogni load (`declusterBySlug`); **alterna 2 righe di prodotti e una foto di look**
  (`.home-look`); **ogni tanto due foto di look affiancate** (`.home-look-pair`, gap
  `clamp(24px,4vw,64px)`); 100px di stacco griglia → footer (`.home-feed padding-bottom`).
- **Testi +25%** (`ef6e1ec`): `html { font-size: 125% }` (16→20px), tutto in `rem` scala.
- **MENU** (`ef6e1ec`): `body.shop-mode .site-nav { display:none }` — niente MENU su shop/prodotto
  (resta su Home/Collection). Logo TATO centrato in alto in shop-mode; `.shop-title` più piccolo.
- **Pagine info** (`12b8e82`): testo tutto centrato (ragged center).
- **Mobile** (`12b8e82`): foto a filo (niente margini neri): `#shop` padding laterale 0,
  `.pdp-complete-items` padding 0, packshot flat con meno aria interna.

### Cose ancora aperte / da rivedere
- **PLP** (griglia shop) come screen Dior: pill flottante "Tutto il prêt-à-porter" +
  bottone "Filtra e ordina" → NON fatto.
- **Fase 04b**: `script.js` (~1300 righe, ora ~1350 con le aggiunte) NON spezzato in moduli
  `src/js/*`. Solo manutenzione. Dead code: `productThumb()`, CSS `.pdp-acc-*` / `.pdp-fit`
  / `.pdp-model` / `.home-feature` (rimasti da versioni precedenti).
- **Fase 05**: font self-host, `lang="en"`, a11y audit completo, Lighthouse CI.
- **Mobile UX pass** (deciso 06/09, non fatto): sticky Add-to-Bag su PDP mobile, gallery a
  swipe, newsletter popup ritardato, MENU/BAG sempre leggibili (via `mix-blend-mode` fragile).
- Il **logo TATO fisso** sulla Home si sovrappone alle card della griglia (z-index / pre-esistente).
- `#collection` deep-link a volte non atterra in cima (~scroll residuo) — `resetScroll` nel rAF
  aiuta ma non sempre.
- `og:image` per-prodotto: aggiornato via JS → ok per browser/Googlebot, NON per crawler
  social senza JS (WhatsApp/iMessage) → serve pre-render/SSG (C1 nel report production).
- **Hero + sezione Men/Women (16/09) sono desktop-only**: su mobile l'hero resta il vecchio
  comportamento (pool `allHomePhotos`, fisso al load) e la sezione Men/Women non esiste
  proprio (`display:none` sotto i 769px). Quando si farà il mobile UX pass, decidere se
  portare lì lo stesso trattamento (pool curato + full-bleed + sezione Men/Women) o
  qualcosa di diverso per lo swipe mobile.

═══════════════════════════════════════════════════════════════════

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

## PDP riorganizzata su modello Dior ✅ (commit `1055915`)

Da 4 screenshot Dior forniti dall'utente. Font/grafica TATO invariati (grottesco, maiuscolo,
b/n, filetti — nessun serif). `renderPDP` in `script.js` + blocco `.pdp-*` in `style.css` rifatti:
- `.pdp-main` grid: immagine a filo sinistro + colonna info a destra.
- Testata: nome grande + `.pdp-material` (grigio) + `.pdp-ref` "Ref. TATO-Pxx" a destra.
- Taglia: `<select>` nativo (`#pdp-size-select`) con chevron, opzioni "— Sold out".
- `.pdp-add-btn`: flex space-between, testo a sx + **prezzo dentro il bottone** a dx (`.pdp-add-price`, compare-at `<s>`).
- Nuovo `.pdp-express-btn` (`#pdp-express`): "Express checkout" + "PayPal · Apple Pay · Card";
  chiama `TATO_shopify.createCheckoutUrl([variante])` e reindirizza (salta il carrello).
- `.pdp-delivery-note` / `.pdp-phone-note`: placeholder "to be configured/provided" (DA FORNIRE, non inventati).
- Accordion → **tab** (`.pdp-tabs` / `.pdp-tab` / `.pdp-tab-panel`): Description / Size & fit /
  Composition & care / Shipping & returns. "Seen in Look N" nel pannello Description.
- Nuova sezione `.pdp-complete` "Complete the look": altri capi a catalogo del 1° look del prodotto.
- Mobile PDP CSS aggiornato (negativo).
- **PLP** (screen 2: pill "Tutto il prêt-à-porter" flottante + "Filtra e ordina") NON ancora fatto.

## Fix categorie "dal fondo" + Home tutte le colorway ✅ (commit `0b8118f`)

- `showSection()`: nuova `resetScroll()` chiamata anche nel doppio rAF. Navigando via
  `location.hash = "#shop"` il browser scrollava a `<section id="shop">` DOPO averla mostrata
  → su mobile la pagina si apriva dal fondo. Ora torna sempre in cima.
- Home dopo l'hero: una card per OGNI prodotto × OGNI colorway (20), rimescolate a ogni load
  (`shuffle` + `declusterBySlug`). `pgridCardHTML(p, showTag, colorIdx)`. Rimosso `.home-feature`.

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
