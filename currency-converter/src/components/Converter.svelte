<script lang="ts">
  import { untrack } from 'svelte';
  import CurrencyPicker from './CurrencyPicker.svelte';
  import SwapButton from './SwapButton.svelte';
  import RateInfo from './RateInfo.svelte';
  import LocaleSelect from './LocaleSelect.svelte';
  import HistoryChips from './HistoryChips.svelte';
  import Icon from './Icon.svelte';
  import { getRates, type RatesSnapshot } from '../lib/api';
  import { parseAmount } from '../lib/amount';
  import { FALLBACK_CURRENCIES } from '../lib/currencies';
  import { formatForInput, formatMoney } from '../lib/format';
  import { addToHistory, parseStoredHistory, type HistoryEntry } from '../lib/history';
  import { settings } from '../lib/settings.svelte';
  import { readJSON, removeKey, STORAGE_KEYS, writeJSON } from '../lib/storage';
  import { t, type UiTexts } from '../i18n';

  type Props = { texts: UiTexts };
  let { texts }: Props = $props();

  const HISTORY_DELAY_MS = 1500;
  const uid = $props.id();
  const inputId = `${uid}-amount`;
  const errorId = `${uid}-amount-error`;

  const initialPair = loadPair();

  let from = $state(initialPair.from);
  let to = $state(initialPair.to);
  let amountText = $state(formatForInput(100, settings.locale));

  let snapshot = $state.raw<RatesSnapshot | null>(null);
  let status = $state<'loading' | 'ready' | 'error'>('loading');
  let reloadKey = $state(0);

  let history = $state.raw<HistoryEntry[]>(loadHistory());
  /** Only record history after the user actually did something (not on first load). */
  let userInteracted = false;

  function loadPair(): { from: string; to: string } {
    const saved = readJSON(STORAGE_KEYS.pair) as { from?: unknown; to?: unknown } | null;
    const isCode = (v: unknown): v is string => typeof v === 'string' && /^[A-Z]{3}$/.test(v);
    const savedFrom = saved?.from;
    const savedTo = saved?.to;
    const pairFrom = isCode(savedFrom) ? savedFrom : 'USD';
    const fallbackTo = pairFrom === 'ARS' ? 'USD' : 'ARS';
    return { from: pairFrom, to: isCode(savedTo) && savedTo !== pairFrom ? savedTo : fallbackTo };
  }

  function loadHistory(): HistoryEntry[] {
    const current = readJSON(STORAGE_KEYS.history);
    if (current !== null) return parseStoredHistory(current);
    const migrated = parseStoredHistory(readJSON(STORAGE_KEYS.legacyHistory));
    if (migrated.length) writeJSON(STORAGE_KEYS.history, migrated);
    removeKey(STORAGE_KEYS.legacyHistory);
    return migrated;
  }

  // Fetch rates whenever the base currency changes (cached per base inside getRates).
  $effect(() => {
    const base = from;
    void reloadKey;
    let cancelled = false;

    // Avoid a loading flash when we already show this base.
    if (untrack(() => snapshot?.base) !== base) status = 'loading';

    getRates(base)
      .then((result) => {
        if (cancelled) return;
        snapshot = result;
        status = 'ready';
      })
      .catch(() => {
        if (!cancelled) status = 'error';
      });

    return () => {
      cancelled = true;
    };
  });

  // Keep the typed amount meaning the same number when the number format changes.
  let previousLocale = settings.locale;
  $effect(() => {
    const locale = settings.locale;
    if (locale === previousLocale) return;
    const value = parseAmount(untrack(() => amountText), previousLocale);
    previousLocale = locale;
    if (value !== null) amountText = formatForInput(value, locale);
  });

  $effect(() => {
    writeJSON(STORAGE_KEYS.pair, { from, to });
  });

  const amount = $derived(parseAmount(amountText, settings.locale));
  const showAmountError = $derived(amountText.trim() !== '' && amount === null);
  const currentSnapshot = $derived(snapshot?.base === from ? snapshot : null);
  const rate = $derived(currentSnapshot ? (currentSnapshot.rates[to] ?? null) : null);
  const rateMissing = $derived(status === 'ready' && currentSnapshot !== null && rate === null);
  const result = $derived(amount !== null && rate !== null ? amount * rate : null);
  const currencies = $derived(snapshot ? Object.keys(snapshot.rates) : FALLBACK_CURRENCIES);
  const resultText = $derived(result !== null ? formatMoney(result, to, settings.locale) : '—');

  // Save to history once the user stops typing for a moment.
  $effect(() => {
    if (amount === null || result === null) return;
    const entry = { amount, from, to };
    if (!userInteracted) return;
    const id = setTimeout(() => {
      history = addToHistory(history, { ...entry, at: Date.now() });
      writeJSON(STORAGE_KEYS.history, history);
    }, HISTORY_DELAY_MS);
    return () => clearTimeout(id);
  });

  function markInteracted() {
    userInteracted = true;
  }

  function setFrom(code: string) {
    markInteracted();
    if (code === to) to = from;
    from = code;
  }

  function setTo(code: string) {
    markInteracted();
    if (code === from) from = to;
    to = code;
  }

  function swap() {
    markInteracted();
    [from, to] = [to, from];
  }

  function pickHistory(entry: HistoryEntry) {
    markInteracted();
    from = entry.from;
    to = entry.to;
    amountText = formatForInput(entry.amount, settings.locale);
  }

  function clearHistory() {
    history = [];
    removeKey(STORAGE_KEYS.history);
  }

  function retry() {
    reloadKey += 1;
  }
</script>

<section class="card" aria-label={texts.title}>
  <div class="panels">
    <div class="panel" class:panel--error={showAmountError}>
      <label class="panel__label" for={inputId}>{texts.send}</label>
      <div class="panel__row">
        <input
          id={inputId}
          class="amount"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          enterkeyhint="done"
          spellcheck="false"
          aria-invalid={showAmountError}
          aria-describedby={showAmountError ? errorId : undefined}
          bind:value={amountText}
          oninput={markInteracted}
        />
        <CurrencyPicker value={from} {currencies} lang={settings.lang} {texts} label={texts.send} onchange={setFrom} />
      </div>
      {#if showAmountError}
        <p id={errorId} class="panel__error">{texts.errorInvalidAmount}</p>
      {/if}
    </div>

    <div class="swap-slot">
      <SwapButton label={texts.swap} onswap={swap} />
    </div>

    <div class="panel">
      <span class="panel__label" id="{uid}-receive">{texts.receive}</span>
      <div class="panel__row">
        <output
          class="amount amount--result"
          class:amount--loading={status === 'loading'}
          for={inputId}
          aria-labelledby="{uid}-receive"
          aria-busy={status === 'loading'}
          title={result !== null ? resultText : undefined}
        >
          {status === 'loading' ? '' : resultText}
        </output>
        <CurrencyPicker value={to} {currencies} lang={settings.lang} {texts} label={texts.receive} onchange={setTo} />
      </div>
    </div>
  </div>

  {#if status === 'error'}
    <div class="alert" role="alert">
      <span>{texts.errorFetch}</span>
      <button type="button" class="alert__retry" onclick={retry}>
        <Icon name="refresh" size={14} />
        {texts.retry}
      </button>
    </div>
  {:else if rateMissing}
    <div class="alert" role="alert">{t(texts.errorRateMissing, { from, to })}</div>
  {:else if status === 'loading'}
    <p class="loading" role="status">{texts.loading}</p>
  {:else}
    <RateInfo {from} {to} {rate} updatedAt={currentSnapshot?.updatedAt ?? null} locale={settings.locale} lang={settings.lang} {texts} />
  {/if}

  <hr />

  <LocaleSelect
    value={settings.localeOverride}
    autoLocale={settings.autoLocale}
    {texts}
    onchange={(code) => settings.setLocale(code)}
  />

  <HistoryChips entries={history} locale={settings.locale} {texts} onpick={pickHistory} onclear={clearHistory} />
</section>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    padding: 20px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--card);
    box-shadow: var(--shadow);
  }

  .panels {
    display: flex;
    flex-direction: column;
  }

  .panel {
    padding: 14px 16px 16px;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    background: var(--panel);
    transition: border-color 0.15s ease;
  }

  .panel:focus-within {
    border-color: var(--border-strong);
  }

  .panel--error,
  .panel--error:focus-within {
    border-color: var(--danger);
  }

  .panel__label {
    display: block;
    margin-bottom: 4px;
    color: var(--muted);
    font-size: 13px;
  }

  .panel__row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .panel__error {
    margin: 6px 0 0;
    color: var(--danger);
    font-size: 13px;
  }

  .amount {
    flex: 1;
    min-width: 0;
    height: 44px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--text);
    font-size: clamp(24px, 7vw, 32px);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
    line-height: 44px;
    outline: none;
  }

  .amount--result {
    display: block;
    overflow: hidden;
    color: var(--accent-text);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .amount--loading {
    max-width: 60%;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(90deg, var(--panel-hover), var(--border), var(--panel-hover));
    background-size: 200% 100%;
    animation: shimmer 1.2s linear infinite;
  }

  .swap-slot {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    height: 8px;
  }

  .swap-slot :global(.swap) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .swap-slot :global(.swap:active) {
    transform: translateY(-50%) scale(0.94);
  }

  .alert {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    background: var(--danger-bg);
    color: var(--danger);
    font-size: 13px;
  }

  .alert__retry {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 10px;
    border: 1px solid currentColor;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }

  .loading {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
  }

  hr {
    width: 100%;
    margin: 0;
    border: none;
    border-top: 1px solid var(--border);
  }

  @keyframes shimmer {
    to {
      background-position: -200% 0;
    }
  }
</style>
