/* ═══════════════════════════════════════════
   Controllo accessibilità (axe-core, WCAG 2.1 AA) delle pagine principali,
   desktop e mobile. Uso:  npm run build && npm run preview   (in un terminale)
                           npm run a11y                       (in un altro)
   DARK=true npm run a11y  → stesso controllo in modalità scura.
   ═══════════════════════════════════════════ */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const DARK = process.env.DARK || 'false';
const b = await chromium.launch();
const pages = ['/', '/shop/', '/product/tobi-pants/', '/collection/', '/about/', '/shipping/', '/wishlist/'];
const agg = new Map();
for (const vp of [{width:1440,height:900},{width:390,height:844}]) {
  for (const u of pages) {
    const ctx = await b.newContext({ viewport: vp }); const p = await ctx.newPage();
    await p.addInitScript(d => { localStorage.setItem('tato-nl-done','1'); localStorage.setItem('tato-dark', d); }, DARK);
    await p.goto('http://127.0.0.1:8001' + u); await p.waitForTimeout(3000);
    const r = await new AxeBuilder({ page: p }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    for (const v of r.violations) {
      const k = v.id; const e = agg.get(k) || { impact: v.impact, help: v.help, pages: new Set(), nodes: new Map() };
      e.pages.add(`${vp.width}${u}`);
      v.nodes.forEach(n => e.nodes.set(n.target.join(' '), (n.any[0]||n.all[0]||n.none[0]||{}).message || ''));
      agg.set(k, e);
    }
    await ctx.close();
  }
}
for (const [k, e] of agg) {
  console.log(`\n## ${k} [${e.impact}] ${e.help}\n  pagine: ${[...e.pages].join(', ')}`);
  [...e.nodes].forEach(([t, m]) => console.log('  -', t, '|', m.slice(0, 140)));
}
await b.close();
