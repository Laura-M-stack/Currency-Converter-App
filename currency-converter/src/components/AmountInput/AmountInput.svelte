<script lang="ts">
export let value: number;
</script>

<div class="amount-input">
  <label for="amount">Amount:</label>
  <input id="amount" type="number" bind:value min="0.01" step="0.01" />
</div>

<style lang="scss" src="./AmountInput.scss"></style>
