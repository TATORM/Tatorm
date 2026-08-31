# TATO — Handoff

**Ultimo aggiornamento:** 2026-08-31
**Branch attivo:** `ecommerce-dev`
**Branch live:** `main` → tatorm.com

---

## Stato attuale

Il sito ha:
1. Un **cart drawer** funzionante (dalla sessione di agosto) — non collegato a pagamento.
2. Un **e-commerce a prodotti singoli** (nuovo, questa sessione) — sezione **Shop** con griglia
   prodotti + scheda prodotto (PDP), collegati allo stesso carrello. Foto prodotto = blocchi
   grigi placeholder. Checkout ancora placeholder.

**Niente è committato né pushato.** Il sito live su `main` è invariato.

---

## Come testare in locale

Il `file://` diretto è bloccato dall'estensione Chrome. Serve un server:

```
cd "/Users/samuelemurru/Desktop/LAVORO/IN CONTINUAZIONE/TATO/SITO"
python3 -m http.server 8777
```

Poi apri `http://localhost:8777/index.html`.
Rotte shop: `#shop` · `#shop/knitwear` · `#product/cardigan-v-neck`

**Cache:** ad ogni modifica di `style.css` / `script.js` bumpare il parametro `?v=...`
nei tag `<link>` e `<script>` di `index.html`, altrimenti il browser serve la versione vecchia.

---

## Cosa è stato fatto — sessione 30/08/2026

### Nuovo file: `data/products.js`

- `window.TATO_PRODUCTS` — **24 prodotti singoli** derivati dai 21 look.
- `window.TATO_CATEGORIES` — 7 categorie: outerwear, tailoring, knitwear, shirts, trousers,
  skirts, accessories.
- Helper: `window.TATO_getProduct(slug)`, `window.TATO_getCategoryLabel(slug)`.

**Modello dati** — un prodotto per capo, varianti colore selezionabili:

```js
{
  id, slug, name, category, price, currency: 'EUR',
  composition, care, description,
  colors: [
    { name: 'Chocolate', hex: '#4b3621',
      images: [],                         // vuoto → placeholder grigio
      sizes: [{ label: 'S', available: true }, ...] }
  ],
  lookRefs: [3, 19],                       // in quali look appare
  status: 'available'                      // | 'sold-out' | 'coming-soon'
}
```

### `index.html`

- Nuova `<section id="shop">` → `#shop-filters` (barra categorie) + `#shop-grid` (griglia).
- Nuova `<section id="product">` → `#pdp` (scheda prodotto).
- Voce `SHOP` aggiunta al breadcrumb (`#site-breadcrumb`).
- `<script src="data/products.js?v=...">` prima di `script.js`.

### `style.css`

- `.ph-block` — blocco grigio placeholder (aspect-ratio 3/4), scuro in dark mode.
- `.shop-head`, `.shop-filters`, `.shop-filter`, `.shop-grid` (4 colonne), `.product-card*`.
- `.pdp*` — layout scheda: `.pdp-gallery` (blocchi grigi), `.pdp-colors`/`.pdp-color`
  (swatch), `.pdp-sizes`/`.pdp-size`, `.pdp-add-btn`, `.pdp-accordion`.
- `body.shop-mode` — logo + `MENU` diventano header in alto a sinistra (evitano che il
  logo fisso centrato copra la griglia); `.collection-breadcrumb` nascosto.
- Override mobile (≤768px) in negativo, griglia a 2 colonne, PDP a colonna singola.

### `script.js`

- `renderShop()` = `renderShopFilters()` + `renderShopGrid()`.
- `renderPDP(slug)` — cambio colore, selezione taglia (avviso "Select a size" se manca),
  accordion, link "Seen in Look #X" → apre il lookbook sullo scroll del look, `ADD TO BAG`
  → `addToCart({ name, price, look: categoria, color, size })` + apre il drawer.
- `handleShopRoute()` — routing hash: `#shop`, `#shop/<categoria>`, `#product/<slug>`.
  Registrato su `hashchange` e (per deep-link) su `load`.
- `showSection()` esteso con i rami `shop` / `product` (toggle `body.shop-mode`,
  breadcrumb visibile, hash pulito solo per home/collection/about).
- `NAV_PAGES` — aggiunta la voce `shop`.

### Verificato (test end-to-end)

Griglia → click prodotto → PDP → cambio colore → scelta taglia → `ADD TO BAG` →
cart drawer con riga corretta (`RIB BOMBER · L · Dark Navy / Black · Outerwear · €360`),
totale, rimozione item. Filtro categoria (es. Knitwear → 6 prodotti). Deep-link rotte OK.

---

## Cosa è stato fatto — sessione 31/08/2026

### Foto prodotto = foto dei look (fallback)
- `data/products.js`: nuova mappa `TATO_LOOK_PHOTOS` (look № → file in `FOTO LOOK/LOOK n/`)
  + helper `TATO_lookImages(lookRefs, { onePerLook, limit })`.
- `script.js`: `productThumb()` e la gallery della PDP, se `colors[].images` è vuoto,
  usano la 1ª foto di ogni look in `lookRefs` (griglia = 1 foto, PDP = fino a 8).
  I packshot veri, quando arrivano, hanno la precedenza.
- **Nota:** prodotti che compaiono nello stesso look "di testa" mostrano la stessa
  thumbnail (es. Windbreaker/Back Shirt/Tobi Pants → tutti Look 1). Riordinare
  `lookRefs` o aggiungere un campo `heroPhoto` per differenziarle.

### Menu home + reparti WOMEN / MEN + nuova tassonomia
- `data/products.js`:
  - `TATO_DEPARTMENTS` = women, men.
  - `TATO_CATEGORIES` rifatta: outerwear, tailoring, shirts, dresses, jersey, pants,
    skirts, knit, **vquarto** (V° Quarto, 0 prodotti → griglia "Coming soon").
  - `accessories` NON è più in `TATO_CATEGORIES`: è voce di menu a sé, senza genere.
    Etichette via `TATO_ALL_CATEGORY_LABELS`.
  - Ogni prodotto ha ora `genders: ['women','men']`. **Eccezioni women-only:**
    `2-button-shirt-dress`, `2-button-midi-skirt`, `2-button-long-skirt`.
    Per spostare un capo in un reparto → editare `genders` sul prodotto.
  - Categorie riassegnate (scelte da rivedere): knitwear→**knit** (cardigan, vest lana),
    crewneck/hoodie/zip-up cotone→**jersey**, trousers e "tailored pants"→**pants**,
    shirt dress→**dresses**.
- `script.js`:
  - Menu home ora: New Arrivals · Women▸ · Men▸ · Accessories · Collection · About.
    `renderNavMenu()` / `closeNav()` sostituiscono `updateNavLinks`. Women/Men sono
    accordion con sottomenu categorie (`.nav-group` / `.nav-sub`).
  - Stato shop: `shopScope` ('new'|'women'|'men'|'accessories') + `shopCategory`.
  - Rotte: `#shop` · `#shop/women` · `#shop/women/<cat>` · `#shop/men[/<cat>]` ·
    `#shop/accessories` · `#shop/<cat>` (retro-compat) · `#product/<slug>`.
  - `renderShopHead()` aggiorna il titolo (`#shop-title`); barra filtri categorie
    solo per Women/Men; `shopFilteredProducts()` applica genere + categoria.
  - **New Arrivals** = tutti i capi tranne accessories (accessories solo dal suo tab).
- `index.html`: `<p class="shop-title" id="shop-title">New Arrivals</p>`; bump `?v=`.
- `style.css`: stile menu (`.nav-group`, `.nav-group-toggle`, `.nav-sub`, `.nav-spacer`),
  `.nav-links.open` max-height 78vh + scroll, `.shop-empty`, hover-fade su `.product-card-img`.

### Da rivedere (scelte fatte in autonomia)
1. **Genere per prodotto** — quasi tutto è `['women','men']`. Assegnare i generi reali.
2. **Categoria per prodotto** — vedi mappatura sopra (jersey vs knit, pants vs tailoring).
3. **V° Quarto** — categoria vuota, mostra "Coming soon".
4. **New Arrivals senza accessories** — cambiare se li si vuole includere.

---

## Catalogo — prezzi placeholder

Stessi di `itemPrices` in `script.js`. Da sostituire con i prezzi reali sia in
`data/products.js` (`price`) sia in `itemPrices` (usato ancora dal pannello look della
collection).

| Capo | € | | Capo | € |
|---|---|---|---|---|
| 2 Button Windbreaker | 280 | | 3/4 Zip-up | 260 |
| Back Shirt | 180 | | Inside Out Selvedge Denim | 320 |
| Tobi Pants | 220 | | Tato Cap | 80 |
| Cropped Tailored Jacket | 390 | | Tato Tailoring Cap | 90 |
| 2 Button Tailored Pants | 280 | | Smock Longsleeve | 180 |
| Cardigan V Neck | 320 | | Triple Breasted Coat | 520 |
| 2 Button Shirt Dress | 260 | | 2 Button Long Skirt | 240 |
| Tailored Pants | 280 | | Triple Breasted Bomber | 450 |
| Tiny Crewneck | 160 | | Rib Bomber | 360 |
| 2 Button Shirt | 180 | | 2 Button Midi Skirt | 240 |
| Tailored Jacket | 390 | | Side Way Vest | 220 |
| Hoodie | 200 | | Side Way Zip-up | 280 |

---

## Prossimi passi

1. **Foto prodotto** — creare `FOTO PRODOTTI/<slug>/<colore>/01.jpg` (packshot),
   poi popolare `colors[].images` in `data/products.js`. Comprimere con `sips` prima
   del commit (max 1800px, q82), come per le FOTO LOOK.
2. **Prezzi reali** — aggiornare `data/products.js` + `itemPrices` in `script.js`.
3. **Taglie / disponibilità reali** — impostare `available: false` sulle taglie esaurite,
   `status: 'sold-out'` sui prodotti finiti.
4. **Checkout** — scegliere la piattaforma (consigliato: Shopify Starter $5/mese, Buy Button)
   e sostituire il pulsante `.cart-checkout-btn` nel drawer + `Payment integration coming soon.`.
5. **Decisione lookbook** — la sezione Collection resta com'è (editoriale). Valutare se
   collegare ogni item del pannello look alla relativa scheda prodotto.
6. **Pulizia** — decidere di `shop-test.html` (prototipo standalone, tenere o eliminare) e
   delle 4 foto `LOOK 11_PHOTO* extended.jpg` non tracciate.
7. **Merge su `main`** quando approvato:
   ```
   git checkout main
   git merge ecommerce-dev
   git push origin main
   ```

---

## File non tracciati / in sospeso

- `data/` — nuovo, da aggiungere al commit.
- `FOTO LOOK/LOOK 11/LOOK 11_PHOTO {1,3,5,6} extended.jpg` — non tracciate.
- `shop-test.html` — prototipo standalone della sessione di agosto.
- `handoff.md` — questo file.
- `FOTO LOOK/LOOK 18/LOOK 17_PHOTO4.jpg` — eliminata (già in staging come `D`).
