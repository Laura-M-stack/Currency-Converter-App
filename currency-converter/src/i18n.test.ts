import { describe, expect, it } from 'vitest';
import { defaultLocaleFor, detectBrowserLang, getUiTexts, LANGS, LOCALES, t, TRANSLATIONS } from './i18n';

describe('translations', () => {
  const referenceKeys = Object.keys(TRANSLATIONS.en).sort();
  const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();

  it.each(LANGS)('%s has every key, non-empty', (lang) => {
    const texts = TRANSLATIONS[lang];
    expect(Object.keys(texts).sort()).toEqual(referenceKeys);
    for (const value of Object.values(texts)) expect(value.trim()).not.toBe('');
  });

  it.each(LANGS)('%s keeps the same placeholders as English', (lang) => {
    for (const key of referenceKeys as (keyof typeof TRANSLATIONS.en)[]) {
      expect(placeholders(TRANSLATIONS[lang][key])).toEqual(placeholders(TRANSLATIONS.en[key]));
    }
  });

  it('every offered locale is valid for Intl', () => {
    for (const { code } of LOCALES) expect(() => new Intl.NumberFormat(code)).not.toThrow();
  });
});

describe('t', () => {
  it('interpolates and leaves unknown placeholders visible', () => {
    expect(t('Convert {amount} {from}', { amount: 5, from: 'USD' })).toBe('Convert 5 USD');
    expect(t('Hello {name}')).toBe('Hello {name}');
  });
});

describe('language detection', () => {
  it('picks the first supported browser language', () => {
    expect(detectBrowserLang(['ja-JP', 'pt-BR', 'en'])).toBe('pt');
    expect(detectBrowserLang(['ja-JP'])).toBe('en');
    expect(detectBrowserLang([])).toBe('en');
  });

  it('prefers the browser region for the number format', () => {
    expect(defaultLocaleFor('es', ['es-MX', 'en-US'])).toBe('es-MX');
    expect(defaultLocaleFor('es', ['en-US'])).toBe('es-AR');
    expect(defaultLocaleFor('en', ['es-AR'])).toBe('en-US');
  });

  it('getUiTexts falls back to English', () => {
    expect(getUiTexts('xx' as never)).toBe(TRANSLATIONS.en);
  });
});
