# Midnight Bloom

A React + Vite graduation celebration website with a midnight-purple botanical art direction.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Build

```bash
npm run build
npm run preview
```

## Customize the event

Edit `src/data/event.js` to change the graduate name, event date, venue, directions link, message, programme, and gallery images.

To enable the live countdown, set `dateISO` to a real date/time with timezone, for example:

```js
dateISO: '2026-12-12T14:00:00+03:00'
```

## GitHub Pages

Before deployment, update `base` in `vite.config.js` to your repository name, including both slashes. Example for repository `her-graduation`:

```js
base: '/her-graduation/',
```

For a GitHub user/organization site at the root domain, use `base: '/'`.

This starter intentionally uses placeholders for event details. Replace them with the client's confirmed information before publishing. Gallery images currently use remote Unsplash URLs as visual placeholders; download and store approved images locally for more dependable production loading.
