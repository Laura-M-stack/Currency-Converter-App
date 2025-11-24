<script lang="ts">
  export let label: string = 'From';

  export let selected: string;

  const currencies: string[] = [
    'USD',
    'EUR',
    'GBP',
    'ARS',
    'BRL',
    'JPY',
    'CAD',
    'AUD'
  ];

  let open = false;

  function toggle() {
    open = !open;
  }

  function choose(code: string) {
    selected = code;
    open = false;
  }

  function handleTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    } else if (event.key === 'Escape') {
      open = false;
    }
  }

  function handleFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    const root = event.currentTarget as HTMLElement;
    if (!next || !root.contains(next)) {
      open = false;
    }
  }
</script>

<div class="currency-select" on:focusout={handleFocusOut}>
  <label class="input-label" for="currency-select-trigger">
    {label}
  </label>

  <div class="select-shell">
    <button
      id="currency-select-trigger"
      type="button"
      class="select-trigger"
      on:click={toggle}
      on:keydown={handleTriggerKeydown}
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      <span class="select-trigger__value">
        {selected}
      </span>
      <span class="select-trigger__chevron" aria-hidden="true">▾</span>
    </button>

    {#if open}
      <ul class="select-menu" role="listbox">
        {#each currencies as c}
          <li>
            <button
              type="button"
              class:selected={c === selected}
              on:click={() => choose(c)}
            >
              {c}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style lang="scss" src="./CurrencySelect.scss"></style>
