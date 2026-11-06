import { describe, expect, it } from 'vitest';
import { addToHistory, HISTORY_LIMIT, parseStoredHistory, type HistoryEntry } from './history';

const entry = (amount: number, from = 'USD', to = 'ARS', at = 1): HistoryEntry => ({ amount, from, to, at });

describe('addToHistory', () => {
  it('adds newest first', () => {
    expect(addToHistory([entry(1)], entry(2)).map((e) => e.amount)).toEqual([2, 1]);
  });

  it('moves a repeated conversion to the front instead of duplicating it', () => {
    const list = [entry(1), entry(2), entry(3)];
    const result = addToHistory(list, entry(2, 'USD', 'ARS', 99));
    expect(result.map((e) => e.amount)).toEqual([2, 1, 3]);
    expect(result[0].at).toBe(99);
  });

  it('treats a different pair as a different entry', () => {
    expect(addToHistory([entry(1)], entry(1, 'ARS', 'USD'))).toHaveLength(2);
  });

  it('caps the list', () => {
    let list: HistoryEntry[] = [];
    for (let i = 1; i <= HISTORY_LIMIT + 3; i++) list = addToHistory(list, entry(i));
    expect(list).toHaveLength(HISTORY_LIMIT);
    expect(list[0].amount).toBe(HISTORY_LIMIT + 3);
  });
});

describe('parseStoredHistory', () => {
  it('returns [] for anything that is not an array', () => {
    expect(parseStoredHistory(null)).toEqual([]);
    expect(parseStoredHistory('oops')).toEqual([]);
    expect(parseStoredHistory({ amount: 1 })).toEqual([]);
  });

  it('keeps valid entries and drops invalid ones', () => {
    const stored = [entry(5), { amount: -1, from: 'USD', to: 'ARS', at: 1 }, { amount: 2, from: 'usd', to: 'ARS', at: 1 }, 42];
    expect(parseStoredHistory(stored)).toEqual([entry(5)]);
  });

  it('migrates the legacy string format, newest first', () => {
    const legacy = ['100 USD → 145230.00 ARS', '25.5 EUR → 27.10 USD', 'garbage'];
    expect(parseStoredHistory(legacy)).toEqual([
      { amount: 25.5, from: 'EUR', to: 'USD', at: 0 },
      { amount: 100, from: 'USD', to: 'ARS', at: 0 },
    ]);
  });

  it('deduplicates and caps the result', () => {
    const stored = Array.from({ length: 10 }, (_, i) => entry(i + 1));
    stored.push(entry(1));
    const result = parseStoredHistory(stored);
    expect(result).toHaveLength(HISTORY_LIMIT);
    expect(new Set(result.map((e) => e.amount)).size).toBe(HISTORY_LIMIT);
  });
});
