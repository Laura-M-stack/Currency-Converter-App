const currencyDigitsCache = new Map<string, number>();

/** ISO 4217 minor units: 2 for USD, 0 for JPY, 3 for KWD. */
export function currencyFractionDigits(currency: string): number {
  const cached = currencyDigitsCache.get(currency);
  if (cached !== undefined) return cached;

  let digits = 2;
  try {
    digits =
      new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions()
        .maximumFractionDigits ?? 2;
  } catch {
    digits = 2;
  }
  currencyDigitsCache.set(currency, digits);
  return digits;
}

/** Enough decimals to show ~4 significant digits for values below 1. */
export function smallValueDigits(value: number): number {
  const abs = Math.abs(value);
  if (abs === 0 || abs >= 1) return 2;
  return Math.min(Math.max(Math.ceil(-Math.log10(abs)) + 3, 2), 8);
}

function safeFormat(value: number, locale: string, options: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return new Intl.NumberFormat('en-US', options).format(value);
  }
}

/** Converted amounts: currency-appropriate decimals, more for tiny values. */
export function formatMoney(value: number, currency: string, locale: string): string {
  if (Math.abs(value) >= 1) {
    const digits = currencyFractionDigits(currency);
    return safeFormat(value, locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }
  return safeFormat(value, locale, { maximumFractionDigits: smallValueDigits(value) });
}

/** Exchange rates: 2–4 decimals above 1, significant digits below 1. */
export function formatRate(value: number, locale: string): string {
  if (Math.abs(value) >= 1) {
    return safeFormat(value, locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  return safeFormat(value, locale, { maximumSignificantDigits: 4 });
}

/** Amount for history chips: grouped, no forced decimals. */
export function formatPlain(value: number, locale: string): string {
  return safeFormat(value, locale, { maximumFractionDigits: 8 });
}

/** Amount written back into the input: no grouping, so it re-parses unambiguously. */
export function formatForInput(value: number, locale: string): string {
  return safeFormat(value, locale, { maximumFractionDigits: 8, useGrouping: false });
}

export function formatRelativeTime(date: Date, lang: string, now: number = Date.now()): string {
  const seconds = (date.getTime() - now) / 1000;
  const abs = Math.abs(seconds);
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });

  if (abs < 45) return rtf.format(0, 'second');
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), 'minute');
  if (abs < 86_400) return rtf.format(Math.round(seconds / 3600), 'hour');
  return rtf.format(Math.round(seconds / 86_400), 'day');
}

export function formatDateTime(date: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  } catch {
    return date.toISOString();
  }
}
