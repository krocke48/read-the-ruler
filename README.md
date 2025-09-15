# Shop Math Workshop — v46 (Voice on Read-the-Ruler)
- Adds **voice input** (Web Speech API) to *Read the Ruler*: mic button, listens, normalizes phrases like “three sixteenths” → `3/16`, auto-checks.
- Works on **Chrome/Edge**; Safari/Firefox show a friendly “not supported” note.
- Keeps **adaptive** engine (targets ~70% correct), teacher console, other modules.
- GitHub Pages workflow includes SPA fallback (`404.html`).

## Run locally
```bash
npm install
npm run dev
# open http://localhost:5173
```

## Deploy on GitHub Pages
Push to GitHub main; Settings → Pages → Source: GitHub Actions.

Build: **v46**
