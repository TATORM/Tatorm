/* ═══════════════════════════════════════════
   TATO — Shopify (checkout reale)
   ─────────────────────────────────────────
   Collega ADD TO BAG / CHECKOUT al negozio Shopify via
   Storefront API GraphQL, con fetch dirette (nessun SDK).

   SETUP:
   1. Su Shopify: app custom con accesso Storefront API →
      copia lo Storefront access token (è pubblico by design).
   2. Incollalo in `storefrontToken`.
   3. Rendi i prodotti disponibili sul canale.

   Senza token il sito funziona lo stesso: ADD TO BAG resta
   locale e il CHECKOUT mostra il messaggio placeholder.
   ═══════════════════════════════════════════ */

window.TATO_SHOPIFY = {
  domain: 'pshgtp-ak.myshopify.com',
  storefrontToken: '387e563b969e48b03ea0be98c1851e2f',
  apiVersion: '2024-10',
};

window.TATO_shopify = {
  ready: false,
  variants: {},                   // { handle: { "Color||Size": { id, available } } }

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
    return res.json();
  },

  /* Prefetch dei prodotti → mappa varianti per (handle, colore, taglia).
     Una sola richiesta: product(handle:) aliasati p0, p1, … */
  async init(handles) {
    const cfg = window.TATO_SHOPIFY;
    if (!cfg.storefrontToken || !handles || !handles.length) {
      this._announce();
      return;
    }
    try {
      const aliases = handles
        .map((h, i) => `p${i}: product(handle: ${JSON.stringify(h)}) { ...V }`)
        .join('\n');
      const query = `query {
        ${aliases}
      }
      fragment V on Product {
        variants(first: 100) {
          nodes { id availableForSale selectedOptions { name value } }
        }
      }`;
      const json = await this._gql(query);
      const data = json.data || {};
      handles.forEach((h, i) => {
        const p = data['p' + i];
        if (!p) return;
        const map = {};
        ((p.variants && p.variants.nodes) || []).forEach(v => {
          const opt = {};
          (v.selectedOptions || []).forEach(o => { opt[o.name] = o.value; });
          const color = opt.Color || opt.Colour || '';
          const size  = opt.Size  || 'One Size';
          map[this._key(color, size)] = { id: v.id, available: v.availableForSale };
        });
        this.variants[h] = map;
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

  /* Crea un carrello Shopify (Cart API) con le righe passate
     e restituisce l'URL di checkout.
     lineItems: [{ variantId, quantity }]                      */
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
