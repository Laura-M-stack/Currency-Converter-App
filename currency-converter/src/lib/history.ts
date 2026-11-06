export type HistoryEntry = {
  amount: number;
  from: string;
  to: string;
  at: number;
};

export const HISTORY_LIMIT = 6;

/** Newest first; an identical conversion moves to the front instead of duplicating. */
export function addToHistory(
  list: readonly HistoryEntry[],
  entry: HistoryEntry,
  limit = HISTORY_LIMIT,
): HistoryEntry[] {
  const rest = list.filter(
    (e) => !(e.amount === entry.amount && e.from === entry.from && e.to === entry.to),
  );
  return [entry, ...rest].slice(0, limit);
}

function isEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.amount === 'number' &&
    Number.isFinite(v.amount) &&
    v.amount > 0 &&
    typeof v.from === 'string' &&
    /^[A-Z]{3}$/.test(v.from) &&
    typeof v.to === 'string' &&
    /^[A-Z]{3}$/.test(v.to) &&
    typeof v.at === 'number'
  );
}

/** Format saved by the previous version: "100 USD → 145230.00 ARS". */
const LEGACY_ENTRY = /^(\d+(?:\.\d+)?) ([A-Z]{3}) → [\d.]+ ([A-Z]{3})$/;

/**
 * Validates whatever is in storage. Also migrates the old string format,
 * which was stored oldest-first.
 */
export function parseStoredHistory(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value)) return [];

  const entries: HistoryEntry[] = [];
  const legacy: HistoryEntry[] = [];

  for (const item of value) {
    if (typeof item === 'string') {
      const match = LEGACY_ENTRY.exec(item);
      if (match) legacy.push({ amount: Number(match[1]), from: match[2], to: match[3], at: 0 });
    } else if (isEntry(item)) {
      entries.push(item);
    }
  }

  let result: HistoryEntry[] = [];
  for (const entry of [...entries, ...legacy.reverse()]) {
    if (!result.some((e) => e.amount === entry.amount && e.from === entry.from && e.to === entry.to)) {
      result = [...result, entry];
    }
  }
  return result.slice(0, HISTORY_LIMIT);
}
