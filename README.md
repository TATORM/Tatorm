# TATO — tatorm.com

Sito one-page statico (HTML/CSS/JS vanilla, zero build). Deploy: GitHub Pages → tatorm.com.

## Struttura

```
index.html            Pagina unica (Home · Collection · Shop · Product · Contacts)
CNAME                 Dominio GitHub Pages
assets/
  css/style.css       Stili
  js/script.js        Logica (splash, home feed, carousel look, shop/PDP, carrello)
  js/products.js      Catalogo prodotti + categorie + mappa foto-look
  icons/              Favicon + apple-touch-icon
media/
  brand/              Logotipo + pittogramma
  home/               Foto home feed (01..21)
  looks/look-NN/      Foto di ogni look (01.jpg, 02.jpg, …)
docs/handoff.md       Stato lavori / decisioni aperte
archive/              Prototipi e materiale fuori sito (non deployare come contenuto)
```

## Sviluppo locale

```
python3 -m http.server 8777
# http://localhost:8777/index.html
```

`file://` è bloccato dall'estensione Chrome; serve un server.
Il browser cachea anche `index.html` sulla URL senza query-string → in locale aprire con `?x` per forzare il refresh.

## Cache busting

A ogni modifica di `assets/css/style.css` o `assets/js/*.js` va bumpato il parametro
`?v=<timestamp>` nei tag `<link>` / `<script>` di `index.html`.

## Deploy

Branch `main` → pubblicato automaticamente da GitHub Pages.
Lavoro e-commerce in corso sul branch `ecommerce-dev`.

## Foto

- **Look:** `media/looks/look-NN/PP.jpg`, numerate nell'ordine del carosello in `index.html`.
  Eventuali frame editoriali (crop Instagram) sono numerati per ultimi.
- **Prodotti:** finché non arrivano i packshot, il front-end usa come fallback le foto
  dei look in cui il capo compare (`lookRefs` in `products.js`, conteggio in
  `TATO_LOOK_PHOTO_COUNT`). Quando ci sono i packshot → popolare `colors[].images`.
- Comprimere sempre le foto nuove prima del commit:
  `sips --resampleHeightWidthMax 1800 --setProperty formatOptions 82 <file>`
