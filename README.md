# Godt o'clock

En mobilvennlig hjelper for godteglass med tidslås. Velg når glasset skal åpnes (standard: neste **fredag kl. 14:00**), så viser appen dager / timer / minutter / sekunder du skal stille inn på glasset, i et LCD-display som ligner lokket.

## Utvikling

Bygget med [Vite+](https://viteplus.dev) (`vp`), React og TypeScript.

```sh
vp install     # installer avhengigheter
vp dev         # start utviklingsserver
vp check       # formatering, lint, typesjekk
vp test        # kjør enhetstester
vp build       # produksjonsbygg til dist/
```

## Deploy

Vercel oppdager Vite-oppsettet automatisk: byggkommando `pnpm build`, output-mappe `dist`.
