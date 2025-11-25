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

  let isOpen = false;

  function handleClick() {
    // Cada click alterna el estado visual del dropdown
    isOpen = !isOpen;
  }

  function handleBlur() {
    // Si el select pierde el foco, aseguramos que quede "cerrado"
    isOpen = false;
  }
</script>

<div class="currency-select {isOpen ? 'open' : ''}">
  <label class="input-label" for={label}>{label}</label>

  <select
    id={label}
    bind:value={selected}
    class="currency-select__control"
    on:click={handleClick}
    on:blur={handleBlur}
  >
    {#each currencies as c}
      <option value={c}>{c}</option>
    {/each}
  </select>
</div>

<style lang="scss" src="./CurrencySelect.scss"></style>
