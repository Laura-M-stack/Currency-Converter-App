<script lang="ts">
  import Icon from './Icon.svelte';
  import { LOCALES, t, type UiTexts } from '../i18n';

  type Props = {
    /** Current override, or null for automatic. */
    value: string | null;
    autoLocale: string;
    texts: UiTexts;
    onchange: (code: string | null) => void;
  };

  let { value, autoLocale, texts, onchange }: Props = $props();

  const AUTO = '';
  const uid = $props.id();
</script>

<div class="locale">
  <label for="{uid}-locale">{texts.numberFormat}</label>
  <div class="locale__control">
    <select
      id="{uid}-locale"
      value={value ?? AUTO}
      onchange={(event) => {
        const next = event.currentTarget.value;
        onchange(next === AUTO ? null : next);
      }}
    >
      <option value={AUTO}>{t(texts.automatic, { locale: autoLocale })}</option>
      {#each LOCALES as loc (loc.code)}
        <option value={loc.code}>{loc.label}</option>
      {/each}
    </select>
    <Icon name="chevron-down" size={14} class="locale__chevron" />
  </div>
</div>

<style>
  .locale {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 13px;
    color: var(--muted);
  }

  .locale__control {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  select {
    max-width: 210px;
    height: 32px;
    padding: 0 28px 0 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--card);
    color: var(--text);
    font-size: 13px;
    text-overflow: ellipsis;
    cursor: pointer;
    appearance: none;
  }

  select:hover {
    border-color: var(--border-strong);
  }

  .locale__control :global(.locale__chevron) {
    position: absolute;
    right: 9px;
    color: var(--muted);
    pointer-events: none;
  }
</style>
