/* ═══════════════════════════════════════════
   TATO — content-core.js
   ─────────────────────────────────────────
   Shopify → contenuti editoriali del sito (collezioni,
   look, pagine About / info). Gira come catalog-core.js:
   nel browser (products.js) e in Node
   (scripts/fetch-content.mjs, che scrive la copia in
   assets/js/content-snapshot.js a ogni build).
   Nessun dato dal vivo: i contenuti cambiano di rado,
   si aggiornano al build successivo (cron 30 min).

   COME SI GESTISCE (tutto da Shopify, vedi
   docs/shopify-contenuti.md):
   • Metaoggetto `tato_collection` → una collezione
       title, season, intro (testo campagna),
       campaign_images (foto campagna), looks (elenco
       di `tato_look` nell'ordine voluto), current (sì/no)
     La collezione "current" è /collection/, le altre
     vanno in /archive/ e /collection/<handle>/.
   • Metaoggetto `tato_look`
       number, images, items (una riga per capo:
       NOME | composizione | colore)
     Un capo il cui nome coincide con un prodotto Shopify
     diventa link alla PDP; gli altri sono "Archive piece".
   • Pagine Shopify (handle about, shipping, returns, faq,
     privacy, cookies, terms) → testo di quelle pagine.
   Finché su Shopify non c'è nessuna collezione, il sito
   usa i look locali (TATO_LOOKS_LOCAL in products.js).
   ═══════════════════════════════════════════ */
(function (root) {
  'use strict';

  const IMG = '... on MediaImage { image { url width height altText } }';

  const COLLECTIONS_QUERY = `query Collections {
    metaobjects(type: "tato_collection", first: 20) {
      nodes {
        handle
        fields {
          key
          value
          reference { ${IMG} }
          references(first: 60) {
            nodes {
              ${IMG}
              ... on Metaobject {
                handle
                fields { key value references(first: 30) { nodes { ${IMG} } } }
              }
            }
          }
        }
      }
    }
  }`;

  const PAGES_QUERY = `query Pages {
    pages(first: 50) { nodes { handle title body } }
  }`;

  /* Chiavi dei campi: quelle consigliate nella guida, più
     qualche variante (es. definizione creata in italiano). */
  const KEYS = {
    title:    ['title', 'titolo', 'name', 'nome'],
    season:   ['season', 'stagione'],
    intro:    ['intro', 'text', 'testo', 'description', 'descrizione'],
    campaign: ['campaign_images', 'campaign', 'campagna', 'foto_campagna'],
    looks:    ['looks', 'look'],
    current:  ['current', 'corrente', 'attuale'],
    number:   ['number', 'numero'],
    images:   ['images', 'photos', 'foto', 'immagini'],
    items:    ['items', 'capi', 'pieces'],
  };

  const lc = s => String(s || '').trim().toLowerCase();

  function fieldsOf(node) {
    const m = {};
    ((node && node.fields) || []).forEach(f => { m[lc(f.key)] = f; });
    return m;
  }
  function pick(map, what) {
    const k = KEYS[what].find(x => map[x]);
    return k ? map[k] : null;
  }

  /* Testo semplice o rich text di Shopify (JSON) → righe */
  function linesOf(value) {
    const v = String(value == null ? '' : value);
    if (/^\s*\{"type":"root"/.test(v)) {
      try {
        const out = [];
        const text = n => (n.children || []).map(c => c.type === 'text' ? (c.value || '') : text(c)).join('');
        const walk = n => (n.children || []).forEach(c => {
          if (c.type === 'paragraph' || c.type === 'heading' || c.type === 'list-item') out.push(text(c));
          else walk(c);
        });
        walk(JSON.parse(v));
        return out.map(s => s.trim()).filter(Boolean);
      } catch (_) { return []; }
    }
    return v.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }

  function imagesOf(f) {
    if (!f) return [];
    const nodes = (f.references && f.references.nodes) || (f.reference ? [f.reference] : []);
    return nodes.filter(n => n && n.image && n.image.url).map(n => n.image.url);
  }

  /* "BACK SHIRT | 100% Cotton | White" → { name, comp, color } */
  function parseItems(value) {
    return linesOf(value).map(line => {
      const [name, comp, color] = line.split('|').map(s => s.trim());
      return { name: name || '', comp: comp || '', color: color || '' };
    }).filter(it => it.name);
  }

  function parseLook(node, i, warn, where) {
    const f = fieldsOf(node);
    const numF = pick(f, 'number');
    const n = parseInt(numF && numF.value, 10);
    const number = Number.isFinite(n) ? n : i + 1;
    const images = imagesOf(pick(f, 'images'));
    const itemsF = pick(f, 'items');
    const items = parseItems(itemsF && itemsF.value);
    if (warn) {
      if (!Number.isFinite(n)) warn(where, `look "${node.handle}" senza numero → uso ${number}`);
      if (!images.length) warn(where, `look ${number} senza foto (non compare)`);
      if (!items.length) warn(where, `look ${number} senza capi`);
    }
    return { key: String(number), number, label: 'LOOK #' + number, images, photos: images, items };
  }

  function parseCollection(node, warn) {
    const f = fieldsOf(node);
    const where = 'collezione ' + node.handle;
    const tF = pick(f, 'title'), sF = pick(f, 'season'), iF = pick(f, 'intro'), cF = pick(f, 'current');
    const looksF = pick(f, 'looks');
    const lookNodes = ((looksF && looksF.references && looksF.references.nodes) || []).filter(n => n && n.fields);
    const looks = lookNodes.map((n, i) => parseLook(n, i, warn, where)).filter(l => l.images.length);
    const seen = new Set();
    looks.forEach(l => {
      if (seen.has(l.key) && warn) warn(where, `due look con il numero ${l.key}`);
      seen.add(l.key);
    });
    return {
      handle: node.handle,
      title: (tF && tF.value) || node.handle,
      season: (sF && sF.value) || '',
      intro: linesOf(iF && iF.value),
      campaign: imagesOf(pick(f, 'campaign')),
      current: !!cF && lc(cF.value) === 'true',
      looks,
    };
  }

  /* snapshot = { collections: [nodi metaobject] | null, pages: [nodi page] | null }
     local    = collezione di riserva (già nel formato finale) */
  function buildContent(snapshot, local, warn) {
    snapshot = snapshot || {};
    const fromShop = (snapshot.collections || [])
      .map(n => parseCollection(n, warn))
      .filter(c => {
        const ok = c.looks.length || c.campaign.length;
        if (!ok && warn) warn('collezione ' + c.handle, 'nessun look con foto → non compare');
        return ok;
      });
    const collections = fromShop.length ? fromShop : (local ? [local] : []);
    let current = collections.find(c => c.current) || collections[0] || null;
    if (warn && fromShop.length) {
      const flagged = fromShop.filter(c => c.current);
      if (!flagged.length) warn('collezioni', `nessuna segnata come "current" → uso "${current.handle}"`);
      if (flagged.length > 1) warn('collezioni', `più collezioni "current" → uso "${current.handle}"`);
    }
    collections.forEach(c => { c.current = c === current; });

    const pages = {};
    (snapshot.pages || []).forEach(p => {
      if (p && p.handle && String(p.body || '').trim()) pages[lc(p.handle)] = { title: p.title || '', body: p.body };
    });

    return {
      source: fromShop.length ? 'shopify' : 'local',
      collections,
      current,
      archive: collections.filter(c => c !== current),
      pages,
    };
  }

  /* Look di una collezione nel formato che usa il resto del sito:
     { "1": { number: 'LOOK #1', items: [{ name, comp, color }] } } */
  function lookMap(col) {
    const out = {};
    ((col && col.looks) || []).forEach(l => { out[l.key] = { number: l.label, items: l.items }; });
    return out;
  }

  root.TATO_contentCore = {
    COLLECTIONS_QUERY, PAGES_QUERY,
    linesOf, parseItems, parseCollection, buildContent, lookMap,
  };
})(typeof window !== 'undefined' ? window : globalThis);
