/** Shown first in the picker, in this order, when the API returns them. */
export const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'ARS', 'BRL', 'MXN', 'CLP', 'COP', 'UYU', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY',
] as const;

/** Used until the first API response arrives. */
export const FALLBACK_CURRENCIES: string[] = [...POPULAR_CURRENCIES];

const FLAG_BASE = 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/';

/**
 * Most ISO 4217 codes start with the ISO 3166 country code (ARS → AR).
 * EUR maps to the EU flag; X-codes (XAF, XDR, gold…) have no single country.
 */
export function flagCountry(currency: string): string | null {
  if (!/^[A-Z]{3}$/.test(currency)) return null;
  if (currency === 'EUR') return 'EU';
  if (currency.startsWith('X')) return null;
  return currency.slice(0, 2);
}

export function flagUrl(currency: string): string | null {
  const country = flagCountry(currency);
  return country ? `${FLAG_BASE}${country}.svg` : null;
}

const displayNamesCache = new Map<string, Intl.DisplayNames | null>();

export function currencyName(code: string, lang: string): string {
  let names = displayNamesCache.get(lang);
  if (names === undefined) {
    try {
      names = new Intl.DisplayNames([lang], { type: 'currency' });
    } catch {
      names = null;
    }
    displayNamesCache.set(lang, names);
  }
  try {
    return names?.of(code) ?? code;
  } catch {
    return code;
  }
}

/** Popular currencies first (fixed order), then the rest alphabetically. Removes duplicates. */
export function sortCurrencies(codes: readonly string[]): string[] {
  const available = new Set(codes);
  const popular = POPULAR_CURRENCIES.filter((c) => available.has(c));
  const popularSet = new Set<string>(popular);
  const rest = [...available].filter((c) => !popularSet.has(c)).sort();
  return [...popular, ...rest];
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

/** Matches by code or localized name, accent-insensitive. Code-prefix matches rank first. */
export function filterCurrencies(codes: readonly string[], query: string, lang: string): string[] {
  const sorted = sortCurrencies(codes);
  const q = normalize(query);
  if (!q) return sorted;

  const byCode: string[] = [];
  const byName: string[] = [];
  for (const code of sorted) {
    if (code.toLowerCase().startsWith(q)) byCode.push(code);
    else if (normalize(currencyName(code, lang)).includes(q)) byName.push(code);
  }
  return [...byCode, ...byName];
}
