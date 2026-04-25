# Digital Obsidian Garden
This is the template to be used together with the [Digital Garden Obsidian Plugin](https://github.com/oleeskild/Obsidian-Digital-Garden). 
See the README in the plugin repo for information on how to set it up.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/oleeskild/digitalgarden)

---
## Personal homepage

- **`/`** — Personal landing page: [`src/site/index.html`](src/site/index.html) (Nunjucks in HTML, see `html` in `templateFormats` in [`.eleventy.js`](.eleventy.js)). Copy and structure live in [`src/site/_includes/home/`](src/site/_includes/home/); static assets are [`src/site/assets/css/main.css`](src/site/assets/css/main.css) and [`src/site/assets/js/main.js`](src/site/assets/js/main.js) (copied to `dist/assets/`). Editable text and links: [`src/site/_data/home.js`](src/site/_data/home.js), overridable via `HOME_*` env vars (see that file).
- **`/garden/`** — Digital Garden “home” note (the note tagged `gardenEntry`); internal links to that entry resolve here.

## Docs
Docs are available at [dg-docs.ole.dev](https://dg-docs.ole.dev/)
