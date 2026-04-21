# Mahmoud Radio

A complete static radio streaming website with:

- Curated public internet radio stations
- Browser audio playback with sticky player controls
- Search, genre filters, country filters, and favorites
- Radio Browser discovery for secure public streams
- Live voice broadcasting from your microphone with shareable listener links
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

## Live voice

Open the public site, go to **Live voice**, and click **Start Live Voice**.
Allow microphone access, copy the generated listener link, and send it to listeners.

This uses browser WebRTC through PeerJS, so it is best for small live sessions.
For radio-scale audiences, use Icecast, AzuraCast, Radio.co, or another hosted streaming provider and add that stream URL to the site.

## Deploy

This repo includes a GitHub Pages workflow at `.github/workflows/pages.yml`.
Push to `main`, then open the Pages deployment URL from the repository Actions run.
