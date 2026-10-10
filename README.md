# TATO — tatorm.com

Sito e-commerce di TATO (Roma). HTML/CSS/JS senza framework, prodotti e contenuti
da Shopify (Storefront API), build con esbuild in `_site/`.

```
npm install
npm run dev        # http://localhost:8777 (sorgenti)
npm run build      # catalogo e contenuti da Shopify → _site/
npm test           # build + unit + e2e
```

- Mappa del codice e regole di lavoro: [`CLAUDE.md`](CLAUDE.md)
- Stato attuale e cose da fare: [`docs/handoff.md`](docs/handoff.md)
- Guide per gestire prodotti e contenuti su Shopify: [`docs/guide/`](docs/guide/)
- Foto nuove: comprimerle prima del commit; derivati AVIF con `npm run images`.
