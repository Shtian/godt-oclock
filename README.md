# Godt o'clock

En mobilvennlig hjelper for godteboks med tidslås. Velg når boksen skal åpnes (standard: neste **fredag kl. 14:00**), så viser appen dager / timer / minutter / sekunder du skal stille inn på boksen, i et LCD-display som ligner lokket.

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

## Installer på iPhone

Åpne siden i Safari → Del → **Legg til på Hjem-skjerm**. Appen åpnes da i fullskjerm og fungerer uten nett: byggingen lager `sw.js` (se `pwa/sw.js` og pluginen i `vite.config.ts`) som lagrer alle filene lokalt ved første besøk.
