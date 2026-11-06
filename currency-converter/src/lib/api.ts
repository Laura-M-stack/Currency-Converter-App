export type RatesSnapshot = {
  base: string;
  rates: Readonly<Record<string, number>>;
  updatedAt: Date;
  nextUpdateAt: Date;
};

type ApiResponse = {
  result?: 'success' | 'error';
  'error-type'?: string;
  time_last_update_unix?: number;
  time_next_update_unix?: number;
  rates?: Record<string, number>;
};

type FetchFn = (input: string) => Promise<Response>;

export const RATES_API_URL = 'https://open.er-api.com/v6/latest/';
const MIN_CACHE_MS = 10 * 60_000;

export class RatesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RatesError';
  }
}

const cache = new Map<string, RatesSnapshot>();
const inflight = new Map<string, Promise<RatesSnapshot>>();

/**
 * Fetches all rates for a base currency. Responses are cached until the API's
 * own next-update time (the free plan refreshes once a day), and concurrent
 * calls for the same base share one request.
 */
export async function getRates(
  base: string,
  { fetchFn = (url: string) => fetch(url), now = Date.now }: { fetchFn?: FetchFn; now?: () => number } = {},
): Promise<RatesSnapshot> {
  const cached = cache.get(base);
  if (cached && cached.nextUpdateAt.getTime() > now()) return cached;

  const pending = inflight.get(base);
  if (pending) return pending;

  const request = (async () => {
    const res = await fetchFn(RATES_API_URL + encodeURIComponent(base));
    if (!res.ok) throw new RatesError(`HTTP ${res.status}`);

    const data = (await res.json()) as ApiResponse;
    if (data.result !== 'success' || !data.rates || typeof data.time_last_update_unix !== 'number') {
      throw new RatesError(data['error-type'] ?? 'invalid-response');
    }

    const nextFromApi =
      typeof data.time_next_update_unix === 'number' ? data.time_next_update_unix * 1000 : 0;

    const snapshot: RatesSnapshot = {
      base,
      rates: data.rates,
      updatedAt: new Date(data.time_last_update_unix * 1000),
      // Never cache for less than 10 min, even if the API clock says the next update already passed.
      nextUpdateAt: new Date(Math.max(nextFromApi, now() + MIN_CACHE_MS)),
    };
    cache.set(base, snapshot);
    return snapshot;
  })();

  inflight.set(base, request);
  try {
    return await request;
  } finally {
    inflight.delete(base);
  }
}

export function clearRatesCache(): void {
  cache.clear();
  inflight.clear();
}
