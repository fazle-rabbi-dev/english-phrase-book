# English Boss

A small, offline phrasebook of everyday English phrases with Bangla meanings.
Plain HTML, CSS, and JavaScript — no build step, no dependencies at runtime.

## Run it

Open `index.html` in a browser. That's it. Everything (icons, data, styles)
loads from local files, so it also works with no internet connection.

If you prefer a local server:

```sh
bunx serve .
```

## Features

- 451 phrases across 16 chapters
- Search by English, Bangla, **or** phonetic spelling
- Click a card's copy button (top right) to copy the English phrase
- Light / dark theme, remembered between visits
- Desktop sidebar + mobile drawer, scroll spy, reading progress
- Keyboard: `/` or `Ctrl/Cmd + K` focuses search, `Esc` clears it
- Offline support via a service worker (after the first visit)
- Direct Android APK download from the homepage

## Offline support

`sw.js` caches the app shell on the first visit. After that, the phrasebook
opens and works with no connection. Page navigations try the network first
and fall back to the cached copy; static files are served from cache and
refreshed in the background.

Requirements and notes:

- Serve over `http://` or `https://`. Browsers do not run service workers on
  `file://`, so open the app with the local server below or from GitHub Pages.
- The service worker needs one online visit to install its cache.
- When you change cached files, bump `CACHE_VERSION` in `sw.js` so visitors
  receive the new version.

## Updating the phrases

`AGENTS.md` is the source of truth. Edit the tables there, then regenerate
the data and icons:

```sh
bun tools/build-data.mjs
```

The script writes `js/data.js` and `js/icons.js`. The phonetic column is kept
in the data for search, but is never rendered.

## Structure

```
index.html          markup
English-Boss.apk    Android app download
assets/favicon.svg
css/tokens.css      colors, fonts, reset
css/layout.css      top bar, sidebar, hero, responsive
css/components.css  cards, buttons, empty state, animations
js/data.js          generated phrase data
js/icons.js         generated Lucide icons (ISC)
js/ui.js            small helpers (highlight, clipboard, toast)
js/theme.js         light / dark theme
js/app.js           rendering, search, navigation
js/offline.js       service worker registration
sw.js               offline cache
tools/build-data.mjs
```
