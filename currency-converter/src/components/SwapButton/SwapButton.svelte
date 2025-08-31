<script lang="ts">
  export let onSwap: () => void;
</script>

<button class="swap-btn" on:click={onSwap} title="Swap currencies">
  &#8646;
</button>

<style lang="scss" src="./SwapButton.scss"></style>
