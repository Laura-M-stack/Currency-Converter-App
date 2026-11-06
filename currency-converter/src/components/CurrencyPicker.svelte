<script lang="ts">
  import { tick } from 'svelte';
  import CurrencyFlag from './CurrencyFlag.svelte';
  import Icon from './Icon.svelte';
  import { currencyName, filterCurrencies } from '../lib/currencies';
  import { t, type Lang, type UiTexts } from '../i18n';

  type Props = {
    value: string;
    currencies: readonly string[];
    lang: Lang;
    texts: UiTexts;
    /** Accessible name of the trigger, e.g. "You send". */
    label: string;
    onchange: (code: string) => void;
  };

  let { value, currencies, lang, texts, label, onchange }: Props = $props();

  const uid = $props.id();
  const listId = `${uid}-list`;

  let open = $state(false);
  let query = $state('');
  let activeIndex = $state(0);

  let root = $state<HTMLDivElement>();
  let trigger = $state<HTMLButtonElement>();
  let searchInput = $state<HTMLInputElement>();
  let listEl = $state<HTMLUListElement>();

  const results = $derived(filterCurrencies(currencies, query, lang));
  const activeCode = $derived(results[activeIndex]);

  async function openPanel() {
    query = '';
    activeIndex = Math.max(0, results.indexOf(value));
    open = true;
    await tick();
    searchInput?.focus();
    scrollActiveIntoView();
  }

  function closePanel(restoreFocus = true) {
    open = false;
    if (restoreFocus) trigger?.focus();
  }

  function select(code: string) {
    if (code !== value) onchange(code);
    closePanel();
  }

  function moveActive(delta: number) {
    if (results.length === 0) return;
    activeIndex = (activeIndex + delta + results.length) % results.length;
    scrollActiveIntoView();
  }

  async function scrollActiveIntoView() {
    await tick();
    listEl?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }

  function onSearchKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveActive(-1);
        break;
      case 'Home':
        if (!query) {
          event.preventDefault();
          activeIndex = 0;
          scrollActiveIntoView();
        }
        break;
      case 'End':
        if (!query) {
          event.preventDefault();
          activeIndex = Math.max(0, results.length - 1);
          scrollActiveIntoView();
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (activeCode) select(activeCode);
        break;
      case 'Escape':
        event.preventDefault();
        closePanel();
        break;
      case 'Tab':
        closePanel(false);
        break;
    }
  }

  function onTriggerKeydown(event: KeyboardEvent) {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      openPanel();
    }
  }

  // Close on any pointer interaction outside the picker.
  $effect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (root && !root.contains(event.target as Node)) closePanel(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  });
</script>

<div class="picker" bind:this={root}>
  <button
    bind:this={trigger}
    type="button"
    class="trigger"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-label="{label}: {currencyName(value, lang)} ({value}). {texts.chooseCurrency}"
    onclick={() => (open ? closePanel() : openPanel())}
    onkeydown={onTriggerKeydown}
  >
    <CurrencyFlag code={value} />
    <span class="trigger__code">{value}</span>
    <Icon name="chevron-down" size={16} class={open ? 'chevron chevron--open' : 'chevron'} />
  </button>

  {#if open}
    <div class="panel" role="dialog" aria-label={texts.chooseCurrency}>
      <div class="search">
        <Icon name="search" size={16} />
        <input
          bind:this={searchInput}
          bind:value={query}
          oninput={() => (activeIndex = 0)}
          onkeydown={onSearchKeydown}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeCode ? `${uid}-${activeCode}` : undefined}
          aria-label={texts.searchPlaceholder}
          placeholder={texts.searchPlaceholder}
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>

      {#if results.length > 0}
        <ul bind:this={listEl} id={listId} class="list" role="listbox" aria-label={texts.chooseCurrency}>
          {#each results as code, i (code)}
            <!-- Keyboard interaction lives on the search input (combobox pattern). -->
            <!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
            <li
              id="{uid}-{code}"
              role="option"
              aria-selected={code === value}
              data-index={i}
              class="option"
              class:option--active={i === activeIndex}
              onpointermove={() => (activeIndex = i)}
              onclick={() => select(code)}
            >
              <CurrencyFlag {code} size={26} />
              <span class="option__text">
                <span class="option__code">{code}</span>
                <span class="option__name">{currencyName(code, lang)}</span>
              </span>
              {#if code === value}
                <Icon name="check" size={16} class="option__check" />
              {/if}
            </li>
          {/each}
        </ul>
      {:else}
        <p class="empty" role="status">{t(texts.noResults, { q: query.trim() })}</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .picker {
    position: relative;
    flex-shrink: 0;
  }

  .trigger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    padding: 0 12px 0 8px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--card);
    color: var(--text);
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }

  .trigger:hover {
    border-color: var(--border-strong);
  }

  .trigger__code {
    letter-spacing: 0.01em;
  }

  .trigger :global(.chevron) {
    color: var(--muted);
    transition: transform 0.2s ease;
  }

  .trigger :global(.chevron--open) {
    transform: rotate(180deg);
  }

  .panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 20;
    width: min(340px, calc(100vw - 32px));
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--card);
    box-shadow: var(--popover-shadow);
    animation: pop-in 0.14s ease-out;
  }

  .search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    margin-bottom: 6px;
    border-radius: var(--radius-sm);
    background: var(--panel);
    color: var(--muted);
  }

  .search:focus-within {
    outline: 2px solid var(--focus);
    outline-offset: 0;
  }

  .search input {
    flex: 1;
    min-width: 0;
    height: 42px;
    border: none;
    background: transparent;
    color: var(--text);
    font-size: 16px; /* ≥16px avoids iOS zoom on focus */
    outline: none;
  }

  .search input::placeholder {
    color: var(--muted);
  }

  .list {
    max-height: 300px;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    list-style: none;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .option--active {
    background: var(--panel-hover);
  }

  .option[aria-selected='true'] .option__code {
    color: var(--accent-text);
  }

  .option__text {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    line-height: 1.25;
  }

  .option__code {
    font-weight: 600;
    font-size: 14px;
  }

  .option__name {
    overflow: hidden;
    color: var(--muted);
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .option :global(.option__check) {
    color: var(--accent-text);
  }

  .empty {
    margin: 0;
    padding: 16px 12px;
    color: var(--muted);
    font-size: 14px;
    text-align: center;
  }

  @keyframes pop-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
</style>
