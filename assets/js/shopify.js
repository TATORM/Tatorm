/* ═══════════════════════════════════════════
   TATO — Shopify (source of truth per il commerce)
   ─────────────────────────────────────────
   Storefront API GraphQL, fetch dirette (nessun SDK).
   Shopify è la fonte autorevole per: prezzo, compare-at,
   disponibilità, sold-out, id variante. I campi editoriali
   (composizione, cura, fit, look) restano in products.js.

   SETUP
   1. Shopify → app custom con Storefront API → copia lo
      Storefront access token (è pubblico by design).
   2. Incollalo in `storefrontToken`.
   3. Rendi i prodotti disponibili sul canale headless.

   Senza token / offline il sito funziona lo stesso in
   modalità degradata: prezzi dal catalogo locale, checkout
   disabilitato con messaggio.
   ═══════════════════════════════════════════ */

window.TATO_SHOPIFY = {
  domain: 'pshgtp-ak.myshopify.com',
  storefrontToken: '387e563b969e48b03ea0be98c1851e2f',
  apiVersion: '2024-10',
};

window.TATO_shopify = {
  ready: false,
  state: 'idle',                 // idle | loading | ready | error
  error: null,
  variants: {},                  // { handle: { "Color||Size": { id, available, price, compareAt, currency } } }
  products: {},                  // { handle: { title, available, minPrice, currency, images:[], soldOut } }

  _key(color, size) { return (color || '') + '||' + (size || 'One Size'); },

  _endpoint() {
    const cfg = window.TATO_SHOPIFY;
    return `https://${cfg.domain}/api/${cfg.apiVersion}/graphql.json`;
  },

  async _gql(query, variables) {
    const res = await fetch(this._endpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': window.TATO_SHOPIFY.storefrontToken,
      },
      body: JSON.stringify(variables ? { query, variables } : { query }),
    });
    if (!res.ok) throw new Error('Storefront HTTP ' + res.status);
    return res.json();
  },

  /* Prefetch: una sola richiesta, product(handle:) aliasati p0, p1, … */
  async init(handles) {
    const cfg = window.TATO_SHOPIFY;
    if (!cfg.storefrontToken || !handles || !handles.length) {
      this.state = 'idle';
      this._announce();
      return;
    }
    this.state = 'loading';
    this._announce();
    try {
      const aliases = handles
        .map((h, i) => `p${i}: product(handle: ${JSON.stringify(h)}) { ...V }`)
        .join('\n');
      const query = `query {
        ${aliases}
      }
      fragment V on Product {
        title
        availableForSale
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 12) { nodes { url altText } }
        variants(first: 100) {
          nodes {
            id
            availableForSale
            selectedOptions { name value }
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            image { url altText }
          }
        }
      }`;
      const json = await this._gql(query);
      if (json.errors && json.errors.length) {
        throw new Error(json.errors.map(e => e.message).join('; '));
      }
      const data = json.data || {};
      let matched = 0;
      handles.forEach((h, i) => {
        const p = data['p' + i];
        if (!p) return;
        matched++;
        const vmap = {};
        const nodes = (p.variants && p.variants.nodes) || [];
        nodes.forEach(v => {
          const opt = {};
          (v.selectedOptions || []).forEach(o => { opt[o.name] = o.value; });
          const color = opt.Color || opt.Colour || '';
          const size  = opt.Size  || 'One Size';
          vmap[this._key(color, size)] = {
            id: v.id,
            available: v.availableForSale,
            price: v.price ? Number(v.price.amount) : null,
            compareAt: v.compareAtPrice ? Number(v.compareAtPrice.amount) : null,
            currency: (v.price && v.price.currencyCode) || 'EUR',
            image: v.image ? v.image.url : null,
          };
        });
        this.variants[h] = vmap;
        const min = p.priceRange && p.priceRange.minVariantPrice;
        this.products[h] = {
          title: p.title || '',
          available: !!p.availableForSale,
          soldOut: nodes.length > 0 && nodes.every(v => !v.availableForSale),
          minPrice: min ? Number(min.amount) : null,
          currency: (min && min.currencyCode) || 'EUR',
          images: ((p.images && p.images.nodes) || []).map(n => n.url),
        };
      });
      this.ready = matched > 0;
      this.state = this.ready ? 'ready' : 'error';
      if (!this.ready) this.error = 'Nessun prodotto trovato su Shopify';
    } catch (e) {
      console.warn('[TATO] Shopify init fallita:', e);
      this.ready = false;
      this.state = 'error';
      this.error = e.message || String(e);
    }
    this._announce();
  },

  _announce() {
    document.dispatchEvent(new CustomEvent('tato:shopify-ready', {
      detail: { ready: this.ready, state: this.state, error: this.error },
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
