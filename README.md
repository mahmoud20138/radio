# Wavelength · Live Radio & Podcasts

A polished, fully-functional streaming website for live internet radio AND podcasts. Browse 30+ curated radio stations plus 20+ popular podcasts — all streaming live in your browser.

**Live demo:** open `index.html` in any modern browser. No build step. No backend.

---

## Features

- **30+ live radio streams** — SomaFM, Radio France (FIP), BBC, NPR, KEXP, Jazz24 and more
- **20+ popular podcasts** — The Daily, Radiolab, Lex Fridman, Planet Money, Serial, Hardcore History, and more — episodes fetched live from each show's RSS feed
- **Genre & category filtering** — sidebar organizes radio by genre and podcasts by category
- **Episode browser** — click any podcast to see the 30 most recent episodes in a side drawer
- **Unified player** — same controls for radio and podcasts; auto-advance to next episode
- **Search** — by station, podcast, publisher, genre, country, or description
- **Favorites** — heart any station or podcast; persisted to `localStorage`
- **Recently played** — auto-tracks your last 24 listens (radio + episodes)
- **Player controls** — play/pause, prev/next, volume, mute
- **Animated visualizer** — bars dance while audio is playing
- **Light & dark themes** — toggle in the top-right
- **Keyboard shortcuts** — `Space` play/pause, `←/→` prev/next, `/` focus search, `Esc` close drawer
- **Fully responsive** — works on phones, tablets, desktops
- **No frameworks, no build** — vanilla HTML, CSS, and JavaScript

---

## File structure

```
.
├── index.html      # markup
├── styles.css      # all styles, themes, animations
├── app.js          # player logic, RSS fetching, state, rendering
├── stations.js     # editable radio station catalog
├── podcasts.js     # editable podcast catalog
└── README.md
```

Podcast episodes are fetched client-side via a public CORS proxy (`api.allorigins.win`) with a fallback to `corsproxy.io`. No API key needed. The RSS XML is parsed in-browser with `DOMParser`.

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

- **GitHub Pages** — push to `main`, enab