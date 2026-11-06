import { describe, expect, it } from 'vitest';
import { MAX_AMOUNT, parseAmount } from './amount';

describe('parseAmount', () => {
  it.each([
    ['100', 'en-US', 100],
    ['0.5', 'en-US', 0.5],
    ['.5', 'en-US', 0.5],
    ['5.', 'en-US', 5],
    ['1,234.56', 'en-US', 1234.56],
    ['1.234,56', 'es-AR', 1234.56],
    ['1.234,56', 'en-US', 1234.56],
    ['1,234,567.8', 'en-US', 1234567.8],
    ['1.234.567', 'es-AR', 1234567],
    ['  250 ', 'en-US', 250],
    ['1 234,5', 'fr-FR', 1234.5],
    ['1 234,5', 'fr-FR', 1234.5],
    ["1'234.5", 'de-CH', 1234.5],
  ])('parses %j in %s as %d', (raw, locale, expected) => {
    expect(parseAmount(raw, locale)).toBeCloseTo(expected, 10);
  });

  it('resolves a lone 3-digit group with the locale', () => {
    expect(parseAmount('1.500', 'es-AR')).toBe(1500);
    expect(parseAmount('1.500', 'en-US')).toBe(1.5);
    expect(parseAmount('1,500', 'en-US')).toBe(1500);
    expect(parseAmount('1,500', 'es-AR')).toBe(1.5);
  });

  it('treats a single separator not followed by 3 digits as decimal', () => {
    expect(parseAmount('1,5', 'en-US')).toBe(1.5);
    expect(parseAmount('12.25', 'es-AR')).toBe(12.25);
    expect(parseAmount('0,001', 'es-AR')).toBe(0.001);
  });

  it.each(['', '   ', 'abc', '12a', '-5', '0', '0,00', '1.2.3', '1,2,3', '1.234.56,7,8', '.', ',', '1e5', '+3'])(
    'rejects %j',
    (raw) => {
      expect(parseAmount(raw, 'en-US')).toBeNull();
    },
  );

  it('rejects amounts above the limit', () => {
    expect(parseAmount(String(MAX_AMOUNT), 'en-US')).toBe(MAX_AMOUNT);
    expect(parseAmount(String(MAX_AMOUNT + 1), 'en-US')).toBeNull();
  });

  it('falls back gracefully on an invalid locale tag', () => {
    expect(parseAmount('1,500', 'not a locale')).toBe(1500);
  });
});
