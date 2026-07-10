# FROZENBERG — Official Hub of Rosenberg Raw

Cinematic arctic-themed hub site for battle rapper **Rosenberg Raw** ("Frozenberg").
Centralizes his battles, channels, and (soon) merch in one place.

## Stack

- **Vite** — dev server + build
- **Three.js** — WebGL hero (snowfall, drifting smoke, glass ice shards, parallax)
- Vanilla JS + custom CSS — no framework, mobile-first

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Structure

| Path | What |
|------|------|
| `index.html` | Page markup — all sections |
| `src/style.css` | Full cinematic design system |
| `src/main.js` | WebGL scene + interactions; `BATTLES` / `CHANNELS` data arrays at top |
| `public/assets/` | Drop-in Seedream/Seedance assets (see the README in that folder) |

## Adding content

- **Battles / channels:** edit the `BATTLES` and `CHANNELS` arrays at the top of `src/main.js`.
- **Portrait:** save a 4:5 image as `public/assets/portrait.jpg` — it auto-loads.
- **TV loop:** save a 16:9 clip as `public/assets/tv-loop.mp4` — it auto-plays on the FrozenbergTV screen.

## Content

Battle catalog and channels are real and verified (VerseTracker, Rap Grid, RBE,
Let's Talk Battle Rap). Battle cards pull live thumbnails from YouTube and link
to the full battles. Stats (71 battles · 9M+ views) are from VerseTracker.

## Roadmap

- [x] Wire in verified battle catalog + all official channels
- [ ] Real portrait + motion assets (Seedream / Seedance)
- [ ] Merch store ("DROP 001")
