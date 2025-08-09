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
