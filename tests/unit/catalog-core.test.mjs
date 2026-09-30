/* Test della trasformazione Shopify → catalogo del sito (node --test) */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

await import('../../assets/js/catalog-core.js');
const core = globalThis.TATO_catalogCore;

function node(over = {}) {
  return {
    handle: 'rib-bomber', title: 'Rib Bomber', productType: 'Outerwear', tags: [],
    descriptionHtml: '<ul><li>100% Nylon</li><li>Ribbed collar</li><li>Designed in Rome, Made in Italy</li></ul>',
    availableForSale: true,
    priceRange: { minVariantPrice: { amount: '420.0', currencyCode: 'EUR' } },
    care: { value: 'Dry clean only' },
    options: [
      { name: 'Color', optionValues: [{ name: 'Black', swatch: null }, { name: 'Olive', swatch: { color: '#556b2f' } }] },
      { name: 'Size', optionValues: [{ name: '1' }, { name: '2' }] },
    ],
    images: { nodes: [{ url: 'https://cdn.shopify.com/a.png' }] },
    variants: { nodes: [
      v('Black', '1', true, 'https://cdn.shopify.com/black.png'),
      v('Black', '2', false, 'https://cdn.shopify.com/black.png'),
      v('Olive', '1', true, 'https://cdn.shopify.com/olive.png'),
    ] },
    ...over,
  };
}
function v(color, size, ok, img) {
  return { id: `gid://${color}-${size}`, availableForSale: ok,
    selectedOptions: [{ name: 'Color', value: color }, { name: 'Size', value: size }],
    price: { amount: '420.0', currencyCode: 'EUR' }, compareAtPrice: null, image: img ? { url: img } : null };
}

test('prodotto base: nome, prezzo, composizione, descrizione, lavaggio', () => {
  const [p] = core.buildCatalog([node()]);
  assert.equal(p.slug, 'rib-bomber');
  assert.equal(p.name, 'RIB BOMBER');
  assert.equal(p.price, 420);
  assert.equal(p.category, 'outerwear');
  assert.equal(p.composition, '100% Nylon');
  assert.equal(p.description, 'Ribbed collar. Designed in Rome, Made in Italy.');
  assert.deepEqual(p.details, ['Ribbed collar', 'Designed in Rome, Made in Italy']);
  assert.equal(p.care, 'Dry clean only');
  assert.deepEqual(p.genders, ['women', 'men']);
});

test('colori: foto per variante, taglie disponibili, tinta da swatch o tabella', () => {
  const [p] = core.buildCatalog([node()]);
  const [black, olive] = p.colors;
  assert.deepEqual(black.images, ['https://cdn.shopify.com/black.png']);
  assert.deepEqual(black.sizes, [{ label: '1', available: true }, { label: '2', available: false }]);
  assert.equal(black.hex, core.COLOR_HEX.black);
  assert.equal(olive.hex, '#556b2f');
  assert.deepEqual(olive.sizes.map(s => s.label), ['1']);   // la taglia 2 non esiste per Olive
});

test('categoria: tipo prodotto, Tailoring dal titolo, tag category: vince', () => {
  const cat = over => core.buildCatalog([node(over)])[0].category;
  assert.equal(cat({ productType: 'Jersey' }), 'knitwear');
  assert.equal(cat({ productType: 'Tailoring', title: 'Tailored Pants' }), 'pants');
  assert.equal(cat({ productType: 'Tailoring', title: 'Cropped Jacket' }), 'outerwear');
  assert.equal(cat({ productType: 'Pants', tags: ['category:skirts'] }), 'skirts');
});

test('reparti dai tag women/men', () => {
  assert.deepEqual(core.buildCatalog([node({ tags: ['women'] })])[0].genders, ['women']);
  assert.deepEqual(core.buildCatalog([node({ tags: ['Men'] })])[0].genders, ['men']);
});

test('look ricavati dai nomi', () => {
  const looks = { 3: { items: [{ name: 'RIB BOMBER' }] }, 7: { items: [{ name: 'Rib Bomber' }, { name: 'ALTRO' }] } };
  assert.deepEqual(core.buildCatalog([node()], looks)[0].lookRefs, [3, 7]);
});

test('sicurezza: handle non valido scartato, swatch non valido ignorato', () => {
  assert.equal(core.buildCatalog([node({ handle: 'x"><img src=x onerror=alert(1)>' })]).length, 0);
  const bad = node();
  bad.options[0].optionValues[1].swatch = { color: 'red;background:url(x)' };
  assert.notEqual(core.buildCatalog([bad])[0].colors[1].hex, 'red;background:url(x)');
});

test('indice varianti per il checkout', () => {
  const idx = core.buildVariantIndex([node()]);
  assert.equal(idx.variants['rib-bomber']['Black||2'].id, 'gid://Black-2');
  assert.equal(idx.variants['rib-bomber']['Black||2'].available, false);
  assert.equal(idx.products['rib-bomber'].soldOut, false);
});

test('la copia del catalogo nel sito è valida e completa', () => {
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync(new URL('../../assets/js/catalog-snapshot.js', import.meta.url), 'utf8'), ctx);
  const nodes = ctx.window.TATO_CATALOG_SNAPSHOT.nodes;
  assert.ok(nodes.length > 0, 'catalogo vuoto');
  const products = core.buildCatalog(nodes);
  assert.equal(products.length, nodes.length, 'prodotti scartati');
  for (const p of products) {
    assert.ok(p.price > 0, `${p.slug}: prezzo`);
    assert.ok(p.colors.length > 0, `${p.slug}: nessun colore`);
    assert.ok(p.colors.every(c => c.images.length), `${p.slug}: colore senza foto`);
    assert.ok(p.colors.every(c => c.sizes.length), `${p.slug}: colore senza taglie`);
  }
});

test('etichette New / Exclusive dai tag', () => {
  assert.deepEqual(core.buildCatalog([node({ tags: ['New', 'women', 'exclusive'] })])[0].badges, ['New', 'Exclusive']);
  assert.deepEqual(core.buildCatalog([node()])[0].badges, []);
});
