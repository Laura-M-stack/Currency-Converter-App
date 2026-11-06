<script lang="ts">
  import Icon from './Icon.svelte';
  import { formatDateTime, formatRate, formatRelativeTime } from '../lib/format';
  import { t, type Lang, type UiTexts } from '../i18n';

  type Props = {
    from: string;
    to: string;
    rate: number | null;
    updatedAt: Date | null;
    locale: string;
    lang: Lang;
    texts: UiTexts;
  };

  let { from, to, rate, updatedAt, locale, lang, texts }: Props = $props();

  // Re-render the relative time ("3 hours ago") every minute.
  let now = $state(Date.now());
  $effect(() => {
    const id = setInterval(() => (now = Date.now()), 60_000);
    return () => clearInterval(id);
  });

  const inverse = $derived(rate !== null && rate > 0 ? 1 / rate : null);
</script>

{#if rate !== null}
  <div class="rate">
    <p class="rate__main">
      1 {from} = <strong>{formatRate(rate, locale)}</strong> {to}
      {#if inverse !== null}
        <span class="rate__inverse">· 1 {to} = {formatRate(inverse, locale)} {from}</span>
      {/if}
    </p>
    {#if updatedAt}
      <p class="rate__meta" title={texts.source}>
        <Icon name="clock" size={14} />
        <time datetime={updatedAt.toISOString()} title={formatDateTime(updatedAt, locale)}>
          {t(texts.updated, { time: formatRelativeTime(updatedAt, lang, now) })}
        </time>
      </p>
    {/if}
  </div>
{/if}

<style>
  .rate {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: var(--muted);
  }

  .rate p {
    margin: 0;
  }

  .rate__main strong {
    color: var(--text);
    font-weight: 600;
  }

  .rate__inverse {
    white-space: nowrap;
  }

  .rate__meta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
</style>
