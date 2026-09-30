/* ═══════════════════════════════════════════
   TATO — Shopify (source of truth per il commerce)
   ─────────────────────────────────────────
   Storefront API GraphQL, fetch dirette (nessun SDK).
   Config (dominio, token) in catalog-core.js.

   CICLO
   1. Al caricamento: indici varianti dalla copia del
      catalogo (catalog-snapshot.js) → la UI ha subito
      prezzi, taglie, sold-out e id variante.
   2. init(): scarica il catalogo dal vivo (timeout 6s,
      un nuovo tentativo). Se riesce, sostituisce prodotti
      e varianti → evento `tato:shopify-ready`.
      Se fallisce resta la copia: si naviga e si compra
      lo stesso (il checkout richiede comunque Shopify).
   ═══════════════════════════════════════════ */

window.TATO_shopify = {
  ready: false,
  state: 'idle',                 // idle | snapshot | loading | ready | error
  live: false,                   // true = dati scaricati in questa visita
  error: null,
  variants: {},                  // { handle: { "Color||Size": { id, available, price, compareAt, currency } } }
  products: {},                  // { handle: { title, available, minPrice, currency, images:[], soldOut } }
  TIMEOUT_MS: 6000,

  _key(color, size) { return (color || '') + '||' + (size || 'One Size'); },

  _endpoint() {
    const cfg = window.TATO_SHOPIFY;
    return `https://${cfg.domain}/api/${cfg.apiVersion}/graphql.json`;
  },

  async _gql(query, variables) {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    let timer = null;
    // doppia garanzia: abort della richiesta + promise che scade comunque
    const expire = new Promise((_, reject) => {
      timer = setTimeout(() => {
        if (ctrl) ctrl.abort();
        reject(new Error('Shopify timeout'));
      }, this.TIMEOUT_MS);
    });
    try {
      const res = await Promise.race([expire, fetch(this._endpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': window.TATO_SHOPIFY.storefrontToken,
        },
        body: JSON.stringify(variables ? { query, variables } : { query }),
        signal: ctrl ? ctrl.signal : undefined,
      })]);
      if (!res.ok) throw new Error('Storefront HTTP ' + res.status);
      return await Promise.race([expire, res.json()]);
    } catch (e) {
      if (e && e.name === 'AbortError') throw new Error('Shopify timeout');
      throw e;
    } finally {
      clearTimeout(timer);
    }
  },

  /* Sostituisce catalogo e indici con i nodi Shopify dati.
     TATO_PRODUCTS resta lo stesso array (script.js ne tiene
     un riferimento): si svuota e si riempie. */
  _apply(nodes) {
    const core = window.TATO_catalogCore;
    const idx = core.buildVariantIndex(nodes);
    this.variants = idx.variants;
    this.products = idx.products;
    const list = window.TATO_PRODUCTS || (window.TATO_PRODUCTS = []);
    list.splice(0, list.length, ...core.buildCatalog(nodes, window.TATO_LOOKS));
  },

  /* Dalla copia inclusa nel sito — sincrono, al caricamento */
  _seed() {
    const snap = window.TATO_CATALOG_SNAPSHOT;
    if (!snap || !snap.nodes || !snap.nodes.length) return;
    const idx = window.TATO_catalogCore.buildVariantIndex(snap.nodes);
    this.variants = idx.variants;
    this.products = idx.products;
    this.ready = true;
    this.state = 'snapshot';
  },

  async _fetchAll() {
    const query = window.TATO_catalogCore.CATALOG_QUERY;
    let nodes = [], after = null;
    do {
      const json = await this._gql(query, { after });
      if (json.errors && json.errors.length) {
        throw new Error(json.errors.map(e => e.message).join('; '));
      }
      const page = json.data && json.data.products;
      if (!page) throw new Error('Risposta Shopify senza prodotti');
      nodes = nodes.concat(page.nodes);
      after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
    } while (after);
    return nodes;
  },

  /* Aggiornamento dal vivo (un solo tentativo in più) */
  async init() {
    if (!window.TATO_SHOPIFY || !window.TATO_SHOPIFY.storefrontToken) { this._announce(); return; }
    const prev = this.state;
    this.state = 'loading';
    let nodes = null;
    for (let attempt = 1; attempt <= 2 && !nodes; attempt++) {
      try { nodes = await this._fetchAll(); }
      catch (e) { this.error = e.message || String(e); }
    }
    if (nodes) {
      this._apply(nodes);
      this.ready = true;
      this.live = true;
      this.error = null;
      this.state = 'ready';
    } else {
      console.warn('[TATO] Shopify non raggiungibile, uso la copia del catalogo:', this.error);
      // i dati già in mano (copia o scaricati prima) restano validi
      this.state = this.ready ? (prev === 'loading' ? 'snapshot' : prev) : 'error';
    }
    this._announce();
  },

  _announce() {
    document.dispatchEvent(new CustomEvent('tato:shopify-ready', {
      detail: { ready: this.ready, state: this.state, live: this.live, error: this.error },
    }));
  },

  _hit(handle, color, size) {
    const m = this.variants[handle];
    if (!m) return null;
    // niente fallback a "One Size" per prodotti con taglie reali:
    // si accetta la voce esatta, oppure "One Size" solo se la taglia
    // richiesta è già "One Size" / assente.
    if (m[this._key(color, size)]) return m[this._key(color, size)];
    if (!size || size === 'One Size') return m[this._key(color, 'One Size')] || null;
    return null;
  },

  /* GID variante Shopify per (handle, colore, taglia) — null se non trovata */
  variantId(handle, color, size) {
    const hit = this._hit(handle, color, size);
    return hit ? hit.id : null;
  },

  variantAvailable(handle, color, size) {
    if (!this.ready) return true;          // finché non sappiamo, non blocchiamo la UI
    const hit = this._hit(handle, color, size);
    return hit ? hit.available : false;
  },

  /* Prezzo reale della variante { price, compareAt, currency } o null */
  variantPrice(handle, color, size) {
    const hit = this._hit(handle, color, size);
    if (!hit) return null;
    return { price: hit.price, compareAt: hit.compareAt, currency: hit.currency };
  },

  /* Dati prodotto lato Shopify (o null se non caricato) */
  productData(handle) {
    return this.products[handle] || null;
  },

  soldOut(handle) {
    const p = this.products[handle];
    return p ? p.soldOut : false;
  },

  /* Colori (dai selectedOptions) che hanno almeno una variante disponibile */
  availableColors(handle) {
    const m = this.variants[handle];
    if (!m) return null;
    const out = {};
    Object.keys(m).forEach(k => {
      const color = k.split('||')[0];
      if (m[k].available) out[color] = true;
    });
    return out;
  },

  /* Crea un carrello Shopify (Cart API) e restituisce l'URL di checkout.
     lineItems: [{ variantId, quantity }] */
  async createCheckoutUrl(lineItems) {
    if (!lineItems.length) return null;
    const query = `mutation($lines:[CartLineInput!]!){
      cartCreate(input:{lines:$lines}){
        cart{ checkoutUrl }
        userErrors{ field message }
      }
    }`;
    const json = await this._gql(query, {
      lines: lineItems.map(li => ({
        merchandiseId: li.variantId,
        quantity: li.quantity || 1,
      })),
    });
    const errs = json.errors || (json.data && json.data.cartCreate && json.data.cartCreate.userErrors);
    if (errs && errs.length) throw new Error(JSON.stringify(errs));
    return json.data && json.data.cartCreate && json.data.cartCreate.cart
      ? json.data.cartCreate.cart.checkoutUrl
      : null;
  },
};

window.TATO_shopify._seed();
