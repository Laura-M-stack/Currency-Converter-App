<script lang="ts">
  import { formatPlain } from '../lib/format';
  import type { HistoryEntry } from '../lib/history';
  import { t, type UiTexts } from '../i18n';

  type Props = {
    entries: readonly HistoryEntry[];
    locale: string;
    texts: UiTexts;
    onpick: (entry: HistoryEntry) => void;
    onclear: () => void;
  };

  let { entries, locale, texts, onpick, onclear }: Props = $props();
  const uid = $props.id();
</script>

{#if entries.length > 0}
  <section class="history" aria-labelledby="{uid}-title">
    <div class="history__header">
      <h2 id="{uid}-title">{texts.recent}</h2>
      <button type="button" class="history__clear" onclick={onclear}>{texts.clear}</button>
    </div>

    <ul class="history__list">
      {#each entries as entry (`${entry.amount}-${entry.from}-${entry.to}`)}
        {@const amount = formatPlain(entry.amount, locale)}
        <li>
          <button
            type="button"
            class="chip"
            aria-label={t(texts.repeatConversion, { amount, from: entry.from, to: entry.to })}
            onclick={() => onpick(entry)}
          >
            {amount} {entry.from} → {entry.to}
          </button>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  .history {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .history__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h2 {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
    font-weight: 500;
  }

  .history__clear {
    padding: 4px 8px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--muted);
    font-size: 13px;
    cursor: pointer;
  }

  .history__clear:hover {
    background: var(--panel);
    color: var(--text);
  }

  .history__list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .chip {
    height: 32px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: 999px;
    background: var(--panel);
    color: var(--text);
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    cursor: pointer;
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }

  .chip:hover {
    border-color: var(--border-strong);
    background: var(--panel-hover);
  }
</style>
