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
- Privacy policy: see `pages/privacy.html`.

## Make the chatbot live with OpenAI
Because GitHub Pages is static, host a small serverless endpoint elsewhere and update `callBackend` to POST to it.

Example serverless handler (Node/Express-ish):

```js
// POST /api/chat
import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function handler(req, res){
  try{
    const { message } = JSON.parse(req.body || '{}');
    if(!message) return res.status(400).json({error:'Missing message'});

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful, concise assistant.' },
        { role: 'user', content: message }
      ]
    });
    const reply = completion.choices?.[0]?.message?.content || '';
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ reply });
  }catch(err){
    return res.status(500).json({ error: 'Server error' });
  }
}
```

Then in `assets/js/site.js`:

```js
async function callBackend(message){
  const res = await fetch('https://your-domain.com/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await res.json();
  return data.reply || 'No reply';
}
```

Be sure to:
- Keep API keys server-side only.
- Add CORS headers on the serverless endpoint.
- Update the privacy page as your data practices evolve.

