import { describe, expect, it } from 'vitest';
import { parseAmount } from './amount';
import {
  currencyFractionDigits,
  formatForInput,
  formatMoney,
  formatRate,
  formatRelativeTime,
  smallValueDigits,
} from './format';

describe('currencyFractionDigits', () => {
  it('uses ISO minor units', () => {
    expect(currencyFractionDigits('USD')).toBe(2);
    expect(currencyFractionDigits('JPY')).toBe(0);
    expect(currencyFractionDigits('KWD')).toBe(3);
  });

  it('defaults to 2 for unknown codes', () => {
    expect(currencyFractionDigits('???')).toBe(2);
  });
});

describe('formatMoney', () => {
  it('formats with the locale separators', () => {
    expect(formatMoney(145230, 'ARS', 'es-AR')).toBe('145.230,00');
    expect(formatMoney(145230, 'ARS', 'en-US')).toBe('145,230.00');
  });

  it('respects zero-decimal currencies', () => {
    expect(formatMoney(15234.7, 'JPY', 'en-US')).toBe('15,235');
  });

  it('keeps significant digits for tiny values', () => {
    expect(formatMoney(0.000688, 'USD', 'en-US')).toBe('0.000688');
  });
});

describe('formatRate', () => {
  it('shows 2 to 4 decimals above 1', () => {
    expect(formatRate(1452.3, 'es-AR')).toBe('1.452,30');
    expect(formatRate(1.23456, 'en-US')).toBe('1.2346');
  });

  it('shows 4 significant digits below 1', () => {
    expect(formatRate(1 / 1452.3, 'en-US')).toBe('0.0006886');
  });
});

describe('smallValueDigits', () => {
  it('scales with magnitude and is capped', () => {
    expect(smallValueDigits(5)).toBe(2);
    expect(smallValueDigits(0.5)).toBe(4);
    expect(smallValueDigits(0.000001)).toBe(8);
  });
});

describe('formatForInput', () => {
  it('round-trips through parseAmount in every locale', () => {
    for (const locale of ['en-US', 'es-AR', 'fr-FR', 'de-DE', 'pt-BR', 'it-IT']) {
      for (const value of [1500, 1234.56, 0.5, 1_000_000]) {
        expect(parseAmount(formatForInput(value, locale), locale)).toBeCloseTo(value, 8);
      }
    }
  });
});

describe('formatRelativeTime', () => {
  const now = Date.UTC(2026, 10, 6, 12, 0, 0);

  it('describes the past in the UI language', () => {
    expect(formatRelativeTime(new Date(now - 10_000), 'en', now)).toBe('now');
    expect(formatRelativeTime(new Date(now - 5 * 60_000), 'en', now)).toBe('5 minutes ago');
    expect(formatRelativeTime(new Date(now - 3 * 3_600_000), 'es', now)).toBe('hace 3 horas');
    expect(formatRelativeTime(new Date(now - 26 * 3_600_000), 'en', now)).toBe('yesterday');
  });
});
