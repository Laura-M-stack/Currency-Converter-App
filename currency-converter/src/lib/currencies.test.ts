import { describe, expect, it } from 'vitest';
import { currencyName, filterCurrencies, flagCountry, flagUrl, sortCurrencies } from './currencies';

describe('flagCountry', () => {
  it('maps currency codes to countries', () => {
    expect(flagCountry('ARS')).toBe('AR');
    expect(flagCountry('USD')).toBe('US');
    expect(flagCountry('EUR')).toBe('EU');
  });

  it('returns null for supranational and invalid codes', () => {
    expect(flagCountry('XAF')).toBeNull();
    expect(flagCountry('XDR')).toBeNull();
    expect(flagCountry('usd')).toBeNull();
    expect(flagCountry('')).toBeNull();
    expect(flagUrl('XOF')).toBeNull();
  });
});

describe('sortCurrencies', () => {
  it('puts popular currencies first in a fixed order, then the rest alphabetically', () => {
    expect(sortCurrencies(['ZAR', 'ARS', 'AED', 'USD', 'EUR'])).toEqual(['USD', 'EUR', 'ARS', 'AED', 'ZAR']);
  });

  it('removes duplicates', () => {
    expect(sortCurrencies(['USD', 'USD', 'AED'])).toEqual(['USD', 'AED']);
  });
});

describe('filterCurrencies', () => {
  const codes = ['USD', 'EUR', 'ARS', 'BRL', 'MXN', 'AUD', 'GBP', 'JPY'];

  it('returns everything for an empty query', () => {
    expect(filterCurrencies(codes, '   ', 'es')).toEqual(sortCurrencies(codes));
  });

  it('ranks code-prefix matches before name matches', () => {
    const result = filterCurrencies(codes, 'a', 'en');
    expect(result.slice(0, 2)).toEqual(['ARS', 'AUD']);
  });

  it('matches localized names without accents', () => {
    expect(filterCurrencies(codes, 'dolar', 'es')).toEqual(expect.arrayContaining(['USD', 'AUD']));
    expect(filterCurrencies(codes, 'yen', 'es')).toEqual(['JPY']);
    expect(filterCurrencies(codes, 'real', 'pt')).toEqual(['BRL']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterCurrencies(codes, 'zzz', 'en')).toEqual([]);
  });
});

describe('currencyName', () => {
  it('localizes names and falls back to the code', () => {
    expect(currencyName('ARS', 'es')).toBe('peso argentino');
    expect(currencyName('ARS', 'en')).toBe('Argentine Peso');
    expect(currencyName('QQQ', 'en')).toBe('QQQ');
  });
});
