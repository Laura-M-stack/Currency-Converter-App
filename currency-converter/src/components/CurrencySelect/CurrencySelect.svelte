<script lang="ts">
  export let selected: string;
  export let label: string;

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'ARS', 'MXN', 'CLP'];
</script>

<label>
  {label}:
  <select bind:value={selected}>
    {#each currencies as currency}
      <option value={currency}>{currency}</option>
    {/each}
  </select>
</label>

<style lang="scss" src="./CurrencySelect.scss"></style>
