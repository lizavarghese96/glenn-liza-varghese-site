# glenn-liza-varghese-site

A personal ideas lab blending technical writing, AI‑powered documentation, leadership insights, and Formula 1‑inspired thinking.

## Structure
- `assets/` — CSS, JS, images
- `partials/` — shared `header.html` and `footer.html`
- `pages/` — top‑level pages (Ideas, Work, About, Contact, etc.)
- `posts/` — individual posts
- `projects/` — individual project pages
- `data/` — JSON indexes powering listing pages

## Add a post
1. Create `posts/YYYY-MM-slug.html` using an existing file as a template.
2. Add an entry in `data/posts.json` with `title`, `date`, `tags`, `url` (e.g., `posts/YYYY-MM-slug.html`), and `summary`.

## Add a project
1. Create `projects/slug.html` from the template.
2. Add an entry to `data/projects.json`.

No build step required — runs on GitHub Pages. Partials load client‑side via `assets/js/partials.js`. Listings use `assets/js/cards.js`.

## RSS
- `feed.xml` is a static RSS feed. Update items as you publish, or ask me to wire an automatic generator if you’d like one.

## Search
- Go to `pages/search.html` for on-site search across posts and projects. It matches on title, summary, and tags using the JSON data in `data/`.

## Features
- Dark / Light / Brutalist themes: use the header toggle (cycles light → dark → brutalist). Persisted in `localStorage`.
- Snap scrolling: use the “Snap Scroll” button in the footer to toggle scroll-snap sections. Persisted in `localStorage`.
- Accessibility: skip link, focus-visible styles, high-contrast modes, reduced-motion support, lazy-loading images.
- Micro-interactions: subtle 3D tilt on cards.
- Chatbot (demo): click the “Chat” floating button. This is a frontend-only demo on GitHub Pages. To make it live, connect the `callBackend` function in `assets/js/site.js` to a real API endpoint (e.g., OpenAI, Azure OpenAI, or any compatible service) and handle CORS.

