# Wavelength · Live Internet Radio

A polished, fully-functional internet radio streaming website. Browse 30+ curated stations across genres — lo-fi, electronic, jazz, classical, indie, news, world music — all streaming live in your browser.

**Live demo:** open `index.html` in any modern browser. No build step. No backend.

---

## Features

- **30+ live streams** — SomaFM, Radio France (FIP), BBC, NPR, KEXP, Jazz24 and more
- **Genre filtering** — sidebar lists every genre with station counts
- **Search** — by station name, genre, country, or description
- **Favorites** — heart any station; persisted to `localStorage`
- **Recently played** — auto-tracks your last 24 stations
- **Player controls** — play/pause, prev/next, volume, mute
- **Animated visualizer** — bars dance while a stream is live
- **Light & dark themes** — toggle in the top-right
- **Keyboard shortcuts** — `Space` play/pause, `←/→` prev/next, `/` focus search
- **Fully responsive** — works on phones, tablets, desktops
- **No frameworks, no build** — vanilla HTML, CSS, and JavaScript

---

## File structure

```
.
├── index.html      # markup
├── styles.css      # all styles, themes, animations
├── app.js          # player logic, state, rendering
├── stations.js     # editable station catalog
└── README.md
```

To add a station, edit `stations.js`:

```js
{
  id: 'unique-id',
  name: 'Station Name',
  description: 'Short tagline',
  genre: 'Jazz',
  country: 'USA',
  url: 'https://stream-url.example/stream.mp3',
  grad: 'linear-gradient(135deg, #7c5cff, #4cc9f0)'
}
```

---

## Running locally

Open `index.html` directly in a browser — that's it.

If a stream fails (some require specific origins), serve the folder over HTTP:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then visit http://localhost:8000.

---

## Deploying

This is a static site. Drop the four files into:

- **GitHub Pages** — push to `main`, enable Pages on the repo (root)
- **Netlify** — drag the folder onto netlify.com
- **Vercel** — `vercel deploy`
- **Cloudflare Pages** — connect the repo

---

## Stream credits

All streams are from publicly accessible internet radio providers:

- [SomaFM](https://somafm.com) — listener-supported, commercial-free
- [Radio France (FIP)](https://www.radiofrance.fr/fip)
- [BBC](https://www.bbc.co.uk/sounds), [NPR](https://www.npr.org), [KEXP](https://kexp.org)
- [Jazz24](https://www.jazz24.org), Classical KING FM, Venice Classic Radio

If you redistribute, please keep attribution and respect each station's terms.

---

## License

MIT. Do whatever you want — credit appreciated.
