export const MAX_AMOUNT = 1_000_000_000_000;

const separatorCache = new Map<string, { group: string; decimal: string }>();

function separatorsFor(locale: string): { group: string; decimal: string } {
  const cached = separatorCache.get(locale);
  if (cached) return cached;

  let parts: Intl.NumberFormatPart[];
  try {
    parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  } catch {
    parts = new Intl.NumberFormat('en-US').formatToParts(12345.6);
  }

  const result = {
    group: parts.find((p) => p.type === 'group')?.value ?? ',',
    decimal: parts.find((p) => p.type === 'decimal')?.value ?? '.',
  };
  separatorCache.set(locale, result);
  return result;
}

/**
 * Parses what the user typed into a positive number.
 *
 * Accepts both "1.234,56" and "1,234.56". When only one kind of separator
 * appears, it is resolved with the active locale: "1.500" is 1500 in es-AR
 * but 1.5 in en-US. Returns null for empty, invalid, zero, negative or
 * out-of-range input.
 */
export function parseAmount(raw: string, locale = 'en-US'): number | null {
  if (typeof raw !== 'string') return null;

  // Spaces, NBSP, narrow NBSP (fr-FR) and apostrophes (de-CH) are only ever group separators.
  const s = raw.replace(/[\s  '’]/g, '');
  if (s === '' || /[^\d.,]/.test(s)) return null;

  const dotCount = (s.match(/\./g) ?? []).length;
  const commaCount = (s.match(/,/g) ?? []).length;
  let normalized: string;

  if (dotCount > 0 && commaCount > 0) {
    const decimalChar = s.lastIndexOf('.') > s.lastIndexOf(',') ? '.' : ',';
    const groupChar = decimalChar === '.' ? ',' : '.';
    if ((decimalChar === '.' ? dotCount : commaCount) > 1) return null;
    normalized = s.split(groupChar).join('').replace(decimalChar, '.');
  } else if (dotCount > 0 || commaCount > 0) {
    const sep = dotCount > 0 ? '.' : ',';
    const count = dotCount || commaCount;
    const parts = s.split(sep);
    const looksGrouped =
      parts[0].length >= 1 && parts[0].length <= 3 && parts.slice(1).every((p) => p.length === 3);

    if (count > 1) {
      if (!looksGrouped) return null;
      normalized = parts.join('');
    } else if (looksGrouped && sep === separatorsFor(locale).group) {
      normalized = parts.join('');
    } else {
      normalized = `${parts[0]}.${parts[1]}`;
    }
  } else {
    normalized = s;
  }

  const value = Number(normalized);
  if (normalized === '.' || !Number.isFinite(value)) return null;
  if (value <= 0 || value > MAX_AMOUNT) return null;
  return value;
}
