/* ═══════════════════════════════════════════
   TATO — Shopify Buy Button (checkout reale)
   ─────────────────────────────────────────
   Collega ADD TO BAG / CHECKOUT al negozio Shopify
   tramite lo Storefront API SDK (js-buy-sdk).

   SETUP:
   1. Su Shopify: canale "Buy Button" oppure app custom
      con accesso Storefront API → copia lo Storefront
      access token.
   2. Incollalo qui sotto in `storefrontToken`.
   3. Rendi i 10 prodotti disponibili su quel canale.

   Senza token il sito funziona lo stesso: ADD TO BAG
   resta locale e il CHECKOUT mostra il messaggio
   placeholder.
   ═══════════════════════════════════════════ */

window.TATO_SHOPIFY = {
  domain: 'pshgtp-ak.myshopify.com',
  storefrontToken: '',            // <-- INCOLLA QUI IL TOKEN
};

window.TATO_shopify = {
  ready: false,
  client: null,
  variants: {},                   // { handle: { "Color||Size": { id, available } } }

  _key(color, size) { return (color || '') + '||' + (size || 'One Size'); },

  /* Prefetch dei prodotti → mappa varianti per (handle, colore, taglia) */
  async init(handles) {
    const cfg = window.TATO_SHOPIFY;
    if (!cfg.storefrontToken || typeof ShopifyBuy === 'undefined') {
      this._announce();
      return;
    }
    try {
      this.client = ShopifyBuy.buildClient({
        domain: cfg.domain,
        storefrontAccessToken: cfg.storefrontToken,
      });
      const products = await Promise.all(
        handles.map(h => this.client.product.fetchByHandle(h).catch(() => null))
      );
      products.forEach((p, i) => {
        if (!p) return;
        const map = {};
        p.variants.forEach(v => {
          const opt = {};
          (v.selectedOptions || []).forEach(o => { opt[o.name] = o.value; });
          const color = opt.Color || opt.Colour || '';
          const size  = opt.Size  || 'One Size';
          map[this._key(color, size)] = { id: v.id, available: v.available };
        });
        this.variants[handles[i]] = map;
      });
      this.ready = Object.keys(this.variants).length > 0;
    } catch (e) {
      console.warn('[TATO] Shopify init fallita:', e);
      this.ready = false;
    }
    this._announce();
  },

  _announce() {
    document.dispatchEvent(new CustomEvent('tato:shopify-ready', {
      detail: { ready: this.ready },
    }));
  },

  /* GID variante Shopify per (handle, colore, taglia) — null se non trovata */
  variantId(handle, color, size) {
    const m = this.variants[handle];
    if (!m) return null;
    const hit = m[this._key(color, size)] || m[this._key(color, 'One Size')];
    return hit ? hit.id : null;
  },

  variantAvailable(handle, color, size) {
    const m = this.variants[handle];
    if (!m) return true;   // se non sappiamo, non blocchiamo
    const hit = m[this._key(color, size)] || m[this._key(color, 'One Size')];
    return hit ? hit.available : false;
  },

  /* Crea un checkout Shopify con le righe passate e restituisce l'URL.
     lineItems: [{ variantId, quantity }] */
  async createCheckoutUrl(lineItems) {
    if (!this.ready || !lineItems.length) return null;
    const checkout = await this.client.checkout.create();
    const filled   = await this.client.checkout.addLineItems(
      checkout.id,
      lineItems.map(li => ({ variantId: li.variantId, quantity: li.quantity || 1 }))
    );
    return filled.webUrl;
  },
};
