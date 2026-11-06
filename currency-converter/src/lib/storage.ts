/**
 * All keys are prefixed: every project on laura-m-stack.github.io shares the
 * same origin, so an unprefixed "history" key would collide across apps.
 */
export const STORAGE_KEYS = {
  lang: 'cc:lang',
  locale: 'cc:locale',
  theme: 'cc:theme',
  history: 'cc:history',
  pair: 'cc:pair',
  legacyHistory: 'history',
  legacyDarkMode: 'darkMode',
} as const;

// localStorage can throw (Safari private mode, storage disabled, quota exceeded).
export function readString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* non-critical */
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* non-critical */
  }
}

export function readJSON(key: string): unknown {
  const raw = readString(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown): void {
  writeString(key, JSON.stringify(value));
}
