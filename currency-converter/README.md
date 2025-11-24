# Currency Converter - Svelte + TypeScript

A clean, responsive and multilingual currency converter built with **Svelte**, featuring:

- Real‑time currency conversion (Open ER API)
- **Locale-based** number formatting (US, EU, LatAm, etc.)
- **Dark/Light mode**
- **Full i18n** (EN, ES, FR, DE, PT, IT)
- Custom styled dropdowns (Currencies, Locales, Languages)
- Persistent state (localStorage)
- Smooth UI transitions and accessible controls

---

## Features

### ✔ Real-time Conversion  
Uses the public API from https://open.er-api.com/ to fetch up-to-date exchange rates.

### ✔ Locale Formatting  
All numbers, decimals and thousand separators adapt to the selected locale using  
`Intl.NumberFormat()` and `Intl.DisplayNames()`.

### ✔ Multilingual UI  
You can switch the entire interface between:  
**English, Español, Français, Deutsch, Português, Italiano.**

### ✔ Custom Dropdown Components  
- CurrencySelect  
- LocaleSelect  
- LanguageDropdown  
All made from scratch using Svelte.

### ✔ Dark Mode  
Persistent theme with a toggle.

### ✔ History  
Stores last 5 conversions in localStorage.

---

## 📁 Project Structure

```
src/
│ App.svelte
│ app.css
│ i18n.ts
│ main.ts
│
├── lib/
│   └── api.ts
│
├── styles/
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── base.scss
│   ├── inputs.scss
│   └── layout.scss
│
└── components/
    ├── AmountInput/
    ├── CurrencySelect/
    ├── LocaleSelect/
    ├── SwapButton/
    ├── ResultDisplay/
    ├── HistoryList/
    ├── TopBar/
    ├── LanguageDropdown/
    ├── DarkModeToggle/
    └── Footer/
```

---

## 🛠 Tech Stack

- **Svelte 4**
- **TypeScript**
- **SCSS**
- Open Exchange Rate API (open.er-api.com)
- LocalStorage for persistence

---

## 🔧 Installation

```bash
npm install
npm run dev
```

---

## 📜 License

MIT License.
