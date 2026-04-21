# Mahmoud Radio

A complete static radio streaming website with:

- Curated public internet radio stations
- Browser audio playback with sticky player controls
- Search, genre filters, country filters, and favorites
- Radio Browser discovery for secure public streams
- Custom station saving through local browser storage
- Responsive layout for desktop and mobile

## Run locally

From this folder:

```powershell
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

No build step or package install is required.

## Deploy

This repo includes a GitHub Pages workflow at `.github/workflows/pages.yml`.
Push to `main`, then open the Pages deployment URL from the repository Actions run.
