# Candy Timer

A mobile-first helper for time-locked candy jars. Pick when the jar should unlock (default: the next **Friday at 14:00**), and it shows the days / hours / minutes / seconds to enter on the jar, in an LCD display that looks like the jar lid.

## Development

Built with [Vite+](https://viteplus.dev) (`vp`), React and TypeScript.

```sh
vp install     # install dependencies
vp dev         # start the dev server
vp check       # format, lint, type check
vp test        # run unit tests
vp build       # production build to dist/
```

## Deploy

Vercel auto-detects the Vite setup: build command `pnpm build`, output directory `dist`.
