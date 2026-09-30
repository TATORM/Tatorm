/* ═══════════════════════════════════════════
   TATO — catalog-core.js
   ─────────────────────────────────────────
   Shopify → catalogo del sito. Unica trasformazione,
   usata in due posti:
     • nel browser (shopify.js) sui dati dal vivo
     • in Node (scripts/fetch-catalog.mjs) per la copia
       inclusa nel sito (assets/js/catalog-snapshot.js)
   Nessun import/export: si appoggia a globalThis così
   gira identico come <script> classico e come modulo.

   COME SI GESTISCE UN PRODOTTO (tutto da Shopify):
   • Tipo prodotto  → categoria (vedi CATEGORY_BY_TYPE)
     tag `category:<slug>` la forza (es. category:outerwear)
   • tag `women` / `men` → reparto; nessuno dei due = entrambi
   • Opzioni "Color" e "Size" → varianti
   • Immagine della variante → foto di quel colore
   • Descrizione: elenco puntato; la riga con la % è la
     composizione, le altre diventano la descrizione
   • Metafield custom.care (testo) → istruzioni di lavaggio
   • Stato Bozza / Archiviato → sparisce dal sito
   I look in cui compare un capo si ricavano dai nomi
   in TATO_LOOKS (products.js), non vanno inseriti.
   ═══════════════════════════════════════════ */
(function (root) {
  'use strict';

  /* Connessione Storefront. Il token Storefront è pubblico per
     design (solo lettura catalogo + creazione carrello).
     Se cambia `domain`, aggiornare anche connect-src nella
     Content-Security-Policy di index.html. */
  root.TATO_SHOPIFY = {
    domain: 'pshgtp-ak.myshopify.com',
    storefrontToken: '387e563b969e48b03ea0be98c1851e2f',
    apiVersion: '2024-10',
  };

  const PRODUCT_FIELDS = `
    handle
    title
    productType
    tags
    descriptionHtml
    availableForSale
    priceRange { minVariantPrice { amount currencyCode } }
    care: metafield(namespace: "custom", key: "care") { value }
    options { name optionValues { name swatch { color } } }
    images(first: 20) { nodes { url altText width height } }
    variants(first: 100) {
      nodes {
        id
        availableForSale
        selectedOptions { name value }
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        image { url altText width height }
      }
    }`;

  /* Paginato: $after = cursore della pagina precedente */
  const CATALOG_QUERY = `query Catalog($after: String) {
    products(first: 100, after: $after, sortKey: CREATED_AT, reverse: true) {
      pageInfo { hasNextPage endCursor }
      nodes { ${PRODUCT_FIELDS} }
    }
  }`;

  /* Tipo prodotto Shopify (minuscolo) → categoria del sito */
  const CATEGORY_BY_TYPE = {
    pants: 'pants', trousers: 'pants',
    shirts: 'shirts', shirt: 'shirts',
    skirts: 'skirts', skirt: 'skirts',
    jersey: 'knitwear', knitwear: 'knitwear', knit: 'knitwear',
    outerwear: 'outerwear', coats: 'outerwear', jackets: 'outerwear',
    accessories: 'accessories',
  };

  /* Colore del pallino. Priorità: swatch impostato su Shopify →
     questa tabella → grigio neutro (e un avviso in build). */
  const COLOR_HEX = {
    'black': '#141414', 'white': '#f4f4f0', 'navy': '#232b3a', 'dark navy': '#1d2331',
    'dark blue': '#22304a', 'baby blue': '#bcd3e6', 'baby pink': '#e9cdd2',
    'anthracite': '#3a3a3d', 'light grey / white': '#d9d9d6', 'grey': '#8d8d8d',
    'burgundy / navy': '#4a2230', 'black / dark grey': '#2b2b2e', 'burgundy': '#5a1f2b',
    'red': '#7c1f2b', 'green': '#3f4a2e', 'chocolate': '#4a3226', 'lilac': '#c7b7d6',
    'cherry': '#6e1a24', 'baby green': '#c9dcc4', 'washed black': '#2a2a2a',
  };
  const FALLBACK_HEX = '#9a9a9a';

  const lc = s => String(s || '').trim().toLowerCase();

  function optionMap(v) {
    const o = {};
    (v.selectedOptions || []).forEach(x => { o[lc(x.name)] = x.value; });
    return { color: o.color || o.colour || 'Default', size: o.size || 'One Size' };
  }

  function categoryOf(node) {
    const forced = (node.tags || []).map(lc).find(t => t.startsWith('category:'));
    if (forced) return { slug: forced.slice(9), how: 'tag' };
    const type = lc(node.productType);
    if (type === 'tailoring') {
      const t = lc(node.title);
      if (/pant|trouser/.test(t)) return { slug: 'pants', how: 'tailoring' };
      if (/skirt/.test(t))        return { slug: 'skirts', how: 'tailoring' };
      return { slug: 'outerwear', how: 'tailoring' };
    }
    if (CATEGORY_BY_TYPE[type]) return { slug: CATEGORY_BY_TYPE[type], how: 'type' };
    return { slug: type || 'other', how: 'unknown' };
  }

  function gendersOf(node) {
    const tags = (node.tags || []).map(lc);
    const g = ['women', 'men'].filter(x => tags.includes(x));
    return { list: g.length ? g : ['women', 'men'], tagged: g.length > 0 };
  }

  /* <ul><li>100% Cotton</li><li>…</li></ul> → composizione + testo */
  function parseDescription(html) {
    const text = s => s.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    const items = [];
    String(html || '').replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, x) => { const t = text(x); if (t) items.push(t); });
    if (!items.length) return { composition: '', description: text(String(html || '')) };
    const ci = items.findIndex(t => /\d+\s*%/.test(t));
    const composition = ci >= 0 ? items[ci] : '';
    const rest = items.filter((_, i) => i !== ci);
    return { composition, description: rest.map(t => /[.!?]$/.test(t) ? t : t + '.').join(' ') };
  }

  const HEX_RE = /^#[0-9a-f]{3,8}$/i;   // finisce in style="…": solo codici colore validi

  function hexOf(name, swatch) {
    if (swatch && HEX_RE.test(swatch)) return { hex: swatch, known: true };
    const h = COLOR_HEX[lc(name)];
    return { hex: h || FALLBACK_HEX, known: !!h };
  }

  /* Nodo Shopify → prodotto nel formato di sempre del sito
     (stessi campi che usavano products.js e script.js). */
  function toProduct(node, warn) {
    const cat = categoryOf(node);
    const gen = gendersOf(node);
    const desc = parseDescription(node.descriptionHtml);
    const variants = (node.variants && node.variants.nodes) || [];
    const colorOpt = (node.options || []).find(o => ['color', 'colour'].includes(lc(o.name)));
    const sizeOpt  = (node.options || []).find(o => lc(o.name) === 'size');
    const colorNames = colorOpt
      ? colorOpt.optionValues.map(v => v.name)
      : [...new Set(variants.map(v => optionMap(v).color))];
    const sizeOrder = sizeOpt ? sizeOpt.optionValues.map(v => v.name) : ['One Size'];
    const allImgs = ((node.images && node.images.nodes) || []).map(i => i.url);

    const colors = colorNames.map(name => {
      const vs = variants.filter(v => optionMap(v).color === name);
      const sw = colorOpt && colorOpt.optionValues.find(v => v.name === name);
      const hx = hexOf(name, sw && sw.swatch && sw.swatch.color);
      if (!hx.known && warn) warn(node.handle, `colore "${name}" senza tinta: aggiungilo a COLOR_HEX o imposta lo swatch su Shopify`);
      const img = vs.map(v => v.image && v.image.url).find(Boolean);
      const sizes = sizeOrder
        .filter(s => vs.some(v => optionMap(v).size === s))
        .map(s => ({ label: s, available: vs.some(v => optionMap(v).size === s && v.availableForSale) }));
      return { name, hex: hx.hex, images: img ? [img] : [], sizes };
    });

    /* un colore senza immagine propria: usa le foto prodotto generiche */
    if (colors.length === 1 && !colors[0].images.length) colors[0].images = allImgs.slice(0, 8);

    if (warn) {
      if (cat.how === 'unknown') warn(node.handle, `tipo prodotto "${node.productType}" non riconosciuto: usa un tag category:<slug>`);
      if (!node.care || !node.care.value) warn(node.handle, 'manca il metafield custom.care (lavaggio)');
      if (!desc.composition) warn(node.handle, 'nessuna riga con la composizione (es. "100% Cotton") nella descrizione');
      const imgs = colors.map(c => c.images[0]).filter(Boolean);
      if (new Set(imgs).size < imgs.length) warn(node.handle, 'più colori usano la stessa immagine');
      if (colors.some(c => !c.images.length)) warn(node.handle, 'colori senza immagine');
    }

    const min = node.priceRange && node.priceRange.minVariantPrice;
    return {
      id: node.handle,
      slug: node.handle,
      name: String(node.title || '').toUpperCase(),
      category: cat.slug,
      price: min ? Number(min.amount) : null,
      currency: (min && min.currencyCode) || 'EUR',
      composition: desc.composition,
      care: (node.care && node.care.value) || '',
      description: desc.description,
      colors,
      genders: gen.list,
      lookRefs: [],
      status: 'available',
    };
  }

  /* lookRefs ricavati dai look: un capo compare nel look N se
     il suo nome coincide con il titolo del prodotto. */
  function attachLooks(products, looks) {
    const byName = {};
    products.forEach(p => { byName[p.name] = p; });
    Object.keys(looks || {}).forEach(n => {
      (looks[n].items || []).forEach(it => {
        const p = byName[String(it.name).toUpperCase()];
        if (p && !p.lookRefs.includes(Number(n))) p.lookRefs.push(Number(n));
      });
    });
    products.forEach(p => p.lookRefs.sort((a, b) => a - b));
  }

  function buildCatalog(nodes, looks, warn) {
    // l'handle finisce negli URL (#product/<handle>): solo [a-z0-9-], come impone Shopify
    const products = (nodes || []).filter(n => n && /^[a-z0-9-]+$/.test(n.handle || '')).map(n => toProduct(n, warn));
    attachLooks(products, looks);
    return products;
  }

  /* Mappe varianti per il carrello/checkout (usate da shopify.js) */
  function buildVariantIndex(nodes) {
    const variants = {}, products = {};
    (nodes || []).forEach(p => {
      const vmap = {};
      const vs = (p.variants && p.variants.nodes) || [];
      vs.forEach(v => {
        const o = optionMap(v);
        vmap[o.color + '||' + o.size] = {
          id: v.id,
          available: !!v.availableForSale,
          price: v.price ? Number(v.price.amount) : null,
          compareAt: v.compareAtPrice ? Number(v.compareAtPrice.amount) : null,
          currency: (v.price && v.price.currencyCode) || 'EUR',
          image: v.image ? v.image.url : null,
        };
      });
      variants[p.handle] = vmap;
      const min = p.priceRange && p.priceRange.minVariantPrice;
      products[p.handle] = {
        title: p.title || '',
        available: !!p.availableForSale,
        soldOut: vs.length > 0 && vs.every(v => !v.availableForSale),
        minPrice: min ? Number(min.amount) : null,
        currency: (min && min.currencyCode) || 'EUR',
        images: ((p.images && p.images.nodes) || []).map(n => n.url),
      };
    });
    return { variants, products };
  }

  root.TATO_catalogCore = { CATALOG_QUERY, COLOR_HEX, buildCatalog, buildVariantIndex, parseDescription };
})(typeof window !== 'undefined' ? window : globalThis);
