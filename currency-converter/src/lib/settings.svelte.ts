import { defaultLocaleFor, detectBrowserLang, isLang, isSupportedLocale, type Lang } from '../i18n';
import { readString, removeKey, STORAGE_KEYS, writeString } from './storage';

export type Theme = 'light' | 'dark';

const THEME_COLOR: Record<Theme, string> = { light: '#efeee9', dark: '#07090c' };
const darkQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;

function savedTheme(): Theme | null {
  const saved = readString(STORAGE_KEYS.theme);
  if (saved === 'light' || saved === 'dark') return saved;
  // Previous version stored "darkMode": "true" | "false".
  const legacy = readString(STORAGE_KEYS.legacyDarkMode);
  if (legacy === 'true') return 'dark';
  if (legacy === 'false') return 'light';
  return null;
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}

class Settings {
  lang = $state<Lang>(initialLang());
  /** null = follow the language (automatic). */
  localeOverride = $state<string | null>(initialLocale());
  theme = $state<Theme>(savedTheme() ?? (darkQuery?.matches ? 'dark' : 'light'));

  readonly autoLocale = $derived(defaultLocaleFor(this.lang));
  readonly locale = $derived(this.localeOverride ?? this.autoLocale);

  constructor() {
    applyTheme(this.theme);
    document.documentElement.lang = this.lang;

    // Follow OS changes only while the user hasn't picked a theme explicitly.
    darkQuery?.addEventListener('change', (event) => {
      if (savedTheme() === null) {
        this.theme = event.matches ? 'dark' : 'light';
        applyTheme(this.theme);
      }
    });
  }

  setLang(lang: Lang): void {
    this.lang = lang;
    writeString(STORAGE_KEYS.lang, lang);
    document.documentElement.lang = lang;
  }

  setLocale(code: string | null): void {
    if (code !== null && !isSupportedLocale(code)) return;
    this.localeOverride = code;
    if (code === null) removeKey(STORAGE_KEYS.locale);
    else writeString(STORAGE_KEYS.locale, code);
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    writeString(STORAGE_KEYS.theme, this.theme);
    removeKey(STORAGE_KEYS.legacyDarkMode);
    applyTheme(this.theme);
  }
}

function initialLang(): Lang {
  const saved = readString(STORAGE_KEYS.lang);
  return isLang(saved) ? saved : detectBrowserLang();
}

function initialLocale(): string | null {
  const saved = readString(STORAGE_KEYS.locale);
  return isSupportedLocale(saved) ? saved : null;
}

export const settings = new Settings();
