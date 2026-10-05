/* Test della trasformazione Shopify → contenuti editoriali (node --test) */
import { test } from 'node:test';
import assert from 'node:assert/strict';

await import('../../assets/js/content-core.js');
const core = globalThis.TATO_contentCore;

const img = url => ({ image: { url, width: 1000, height: 1500, altText: null } });
const field = (key, value, extra = {}) => ({ key, value, reference: null, references: null, ...extra });

function look(number, items, images = ['https://cdn.shopify.com/l.jpg']) {
  return {
    handle: 'look-' + number,
    fields: [
      field('number', number == null ? null : String(number)),
      field('images', '[]', { references: { nodes: images.map(img) } }),
      field('items', items),
    ],
  };
}
function collection(handle, over = {}) {
  return {
    handle,
    fields: [
      field('title', over.title || 'Rome'),
      field('season', over.season || 'FW26'),
      field('intro', over.intro || null),
      field('campaign_images', '[]', { references: { nodes: (over.campaign || []).map(img) } }),
      field('looks', '[]', { references: { nodes: over.looks || [look(1, 'BACK SHIRT | 100% Cotton | White')] } }),
      field('current', over.current == null ? 'false' : String(over.current)),
    ],
  };
}
const LOCAL = { handle: 'current', title: 'Collection', season: '', intro: [], campaign: [], current: true, looks: [] };

test('capi: una riga per capo, NOME | composizione | colore', () => {
  assert.deepEqual(core.parseItems('BACK SHIRT | 100% Cotton | White\n\n  TOBI PANTS|100% Cotton|Black  \nTATO CAP'), [
    { name: 'BACK SHIRT', comp: '100% Cotton', color: 'White' },
    { name: 'TOBI PANTS', comp: '100% Cotton', color: 'Black' },
    { name: 'TATO CAP', comp: '', color: '' },
  ]);
});

test('rich text di Shopify → righe', () => {
  const rt = JSON.stringify({ type: 'root', children: [
    { type: 'paragraph', children: [{ type: 'text', value: 'Prima riga' }] },
    { type: 'paragraph', children: [{ type: 'text', value: 'Seconda ' }, { type: 'text', value: 'riga', bold: true }] },
  ] });
  assert.deepEqual(core.linesOf(rt), ['Prima riga', 'Seconda riga']);
});

test('nessuna collezione su Shopify → collezione locale', () => {
  const c = core.buildContent({ collections: null, pages: null }, LOCAL);
  assert.equal(c.source, 'local');
  assert.equal(c.current, LOCAL);
  assert.deepEqual(c.archive, []);
});

test('collezione da Shopify: campi, look con foto, corrente e archivio', () => {
  const c = core.buildContent({ collections: [
    collection('ss26', { title: 'Old', current: false }),
    collection('fw26', { current: true, intro: 'Testo campagna\nSeconda riga', campaign: ['https://cdn.shopify.com/c.jpg'],
      looks: [look(2, 'TOBI PANTS | 100% Cotton | Black'), look(1, 'BACK SHIRT | 100% Cotton | White'), look(3, 'X', [])] }),
  ] }, LOCAL);
  assert.equal(c.source, 'shopify');
  assert.equal(c.current.handle, 'fw26');
  assert.deepEqual(c.archive.map(x => x.handle), ['ss26']);
  assert.deepEqual(c.current.intro, ['Testo campagna', 'Seconda riga']);
  assert.deepEqual(c.current.campaign, ['https://cdn.shopify.com/c.jpg']);
  assert.deepEqual(c.current.looks.map(l => l.key), ['2', '1']);   // ordine di Shopify, look senza foto escluso
  assert.equal(c.current.looks[0].label, 'LOOK #2');
  assert.deepEqual(core.lookMap(c.current)['1'], { number: 'LOOK #1', items: [{ name: 'BACK SHIRT', comp: '100% Cotton', color: 'White' }] });
});

test('nessuna "current" → la prima; avvisi su look senza numero e foto', () => {
  const warns = [];
  const c = core.buildContent({ collections: [collection('a', { looks: [look(null, 'A'), look(4, 'B', [])] })] }, LOCAL,
    (w, m) => warns.push(m));
  assert.equal(c.current.handle, 'a');
  assert.equal(c.current.current, true);
  assert.deepEqual(c.current.looks.map(l => l.key), ['1']);
  assert.ok(warns.some(m => /senza numero/.test(m)));
  assert.ok(warns.some(m => /look 4 senza foto/.test(m)));
  assert.ok(warns.some(m => /nessuna segnata come "current"/.test(m)));
});

test('pagine: per handle, quelle vuote ignorate', () => {
  const c = core.buildContent({ pages: [
    { handle: 'about', title: 'About', body: '<p>TATO</p>' },
    { handle: 'faq', title: 'FAQ', body: '  ' },
  ] }, LOCAL);
  assert.deepEqual(Object.keys(c.pages), ['about']);
  assert.equal(c.pages.about.body, '<p>TATO</p>');
});
