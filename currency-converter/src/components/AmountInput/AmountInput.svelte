<script lang="ts">
  export let value: number;
  export let label: string = "Amount";
  export let hasError: boolean = false;
</script>

<div class="amount-input" class:amount-input--error={hasError}>
  <label class="input-label">{label}</label>

  <div class="input-shell">
    <input
      type="text"
      inputmode="decimal"
      bind:value
      class="custom-input"
      aria-invalid={hasError}
    />
  </div>
</div>

<style lang="scss" src="./AmountInput.scss"></style>
