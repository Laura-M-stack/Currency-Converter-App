<script lang="ts">
  export let value: string;
  export let label: string = "Amount";
  export let hasError: boolean = false;
  const inputId = label.toLowerCase().replace(/\s+/g, "-") + "-input";
</script>

<div class="amount-input" class:amount-input--error={hasError}>
  <label class="input-label" for={inputId}>{label}</label>

  <div class="input-shell">
    <input
      id={inputId}
      type="text"
      inputmode="decimal"
      bind:value
      class="custom-input"
      aria-invalid={hasError}
    />
  </div>
</div>

<style lang="scss" src="./AmountInput.scss"></style>
