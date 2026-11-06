import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearRatesCache, getRates, RATES_API_URL, RatesError } from './api';

const NOW = Date.UTC(2026, 10, 6, 12, 0, 0);

function okResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

const successBody = {
  result: 'success',
  time_last_update_unix: NOW / 1000 - 3 * 3600,
  time_next_update_unix: NOW / 1000 + 21 * 3600,
  rates: { USD: 1, ARS: 1452.3, EUR: 0.92 },
};

describe('getRates', () => {
  beforeEach(() => clearRatesCache());

  it('requests the base currency and maps the response', async () => {
    const fetchFn = vi.fn(async () => okResponse(successBody));
    const snap = await getRates('USD', { fetchFn, now: () => NOW });

    expect(fetchFn).toHaveBeenCalledWith(`${RATES_API_URL}USD`);
    expect(snap.base).toBe('USD');
    expect(snap.rates.ARS).toBe(1452.3);
    expect(snap.updatedAt.getTime()).toBe(NOW - 3 * 3_600_000);
    expect(snap.nextUpdateAt.getTime()).toBe(NOW + 21 * 3_600_000);
  });

  it('serves from cache until the next update', async () => {
    const fetchFn = vi.fn(async () => okResponse(successBody));
    let now = NOW;
    await getRates('USD', { fetchFn, now: () => now });
    await getRates('USD', { fetchFn, now: () => now });
    expect(fetchFn).toHaveBeenCalledTimes(1);

    now = NOW + 22 * 3_600_000;
    await getRates('USD', { fetchFn, now: () => now });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('caches per base currency', async () => {
    const fetchFn = vi.fn(async () => okResponse(successBody));
    await getRates('USD', { fetchFn, now: () => NOW });
    await getRates('EUR', { fetchFn, now: () => NOW });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('shares one request between concurrent calls', async () => {
    const fetchFn = vi.fn(async () => okResponse(successBody));
    const [a, b] = await Promise.all([
      getRates('USD', { fetchFn, now: () => NOW }),
      getRates('USD', { fetchFn, now: () => NOW }),
    ]);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
  });

  it('caches at least 10 minutes when the API next-update time is in the past', async () => {
    const fetchFn = vi.fn(async () => okResponse({ ...successBody, time_next_update_unix: NOW / 1000 - 60 }));
    const snap = await getRates('USD', { fetchFn, now: () => NOW });
    expect(snap.nextUpdateAt.getTime()).toBe(NOW + 10 * 60_000);
  });

  it('throws on HTTP errors and does not cache them', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(okResponse(successBody));

    await expect(getRates('USD', { fetchFn, now: () => NOW })).rejects.toBeInstanceOf(RatesError);
    await expect(getRates('USD', { fetchFn, now: () => NOW })).resolves.toMatchObject({ base: 'USD' });
  });

  it('throws on API-level errors', async () => {
    const fetchFn = vi.fn(async () => okResponse({ result: 'error', 'error-type': 'unsupported-code' }));
    await expect(getRates('QQQ', { fetchFn, now: () => NOW })).rejects.toThrow('unsupported-code');
  });

  it('throws on malformed responses', async () => {
    const fetchFn = vi.fn(async () => okResponse({ result: 'success' }));
    await expect(getRates('USD', { fetchFn, now: () => NOW })).rejects.toThrow('invalid-response');
  });

  it('propagates network failures', async () => {
    const fetchFn = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    await expect(getRates('USD', { fetchFn, now: () => NOW })).rejects.toThrow('Failed to fetch');
  });
});
