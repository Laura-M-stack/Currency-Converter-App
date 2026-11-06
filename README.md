# Currency Converter — Svelte 5 + TypeScript

A fast, accessible and multilingual currency converter. Type an amount and it converts instantly — no "Convert" button.

## Features

- **Live conversion** as you type, with locale-aware input (`1.234,56` and `1,234.56` both work)
- **160+ currencies** from the API, with a searchable picker (by code or localized name, accent-insensitive), flags and popular currencies first
- **Swap** currencies with one tap; picking the same currency on both sides swaps them automatically
- **Rate details**: direct and inverse rate, plus "updated 3 hours ago" from the API timestamp
- **Recent conversions** you can tap to repeat (newest first, no duplicates)
- **6 languages** (EN, ES, FR, DE, PT, IT), detected from the browser
- **Number format** follows the language automatically, or can be set manually
- **Light / dark theme** that follows the OS until you choose, with no flash on load
- **Persistence** of language, format, theme, last currency pair and history
- **Accessibility**: keyboard-operable combobox and menu (ARIA patterns), visible focus, labelled controls, `prefers-reduced-motion`

## Tech stack

- **Svelte 5** (runes: `$state`, `$derived`, `$effect`, `$props`)
- **TypeScript**
- **Vite 7**
- **Vitest** for unit tests
- [open.er-api.com](https://www.exchangerate-api.com/docs/free) for rates (free plan, updated daily; responses cached until the next update)
- `Intl.NumberFormat`, `Intl.DisplayNames`, `Intl.RelativeTimeFormat` for all formatting

## Project structure

```
src/
├── App.svelte
├── main.ts
├── i18n.ts                  # translations, languages, number formats
├── styles/global.css        # design tokens (light/dark) and base styles
├── components/
│   ├── Converter.svelte     # state and orchestration
│   ├── CurrencyPicker.svelte
│   ├── CurrencyFlag.svelte
│   ├── SwapButton.svelte
│   ├── RateInfo.svelte
│   ├── LocaleSelect.svelte
│   ├── HistoryChips.svelte
│   ├── TopBar.svelte
│   ├── LanguageMenu.svelte
│   ├── ThemeToggle.svelte
│   ├── Footer.svelte
│   └── Icon.svelte
└── lib/                     # framework-free logic, unit tested
    ├── amount.ts            # locale-aware parsing
    ├── format.ts            # money, rates, relative time
    ├── currencies.ts        # names, flags, sorting, search
    ├── api.ts               # rates fetch with cache and request dedupe
    ├── history.ts           # history rules and legacy migration
    ├── storage.ts           # safe localStorage access
    └── settings.svelte.ts   # global reactive settings (lang, format, theme)
```

## Getting started

```bash
cd currency-converter
npm install
npm run dev
```

| Script            | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Development server                    |
| `npm test`        | Unit tests (Vitest)                   |
| `npm run check`   | Type checking (svelte-check + tsc)    |
| `npm run build`   | Production build into `../docs`       |
| `npm run preview` | Preview the production build          |

## Deployment

`npm run build` outputs the static site to `docs/` at the repo root (base path `/Currency-Converter-App/`, see `vite.config.ts`).

## License

MIT
