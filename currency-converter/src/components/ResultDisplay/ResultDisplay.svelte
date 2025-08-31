<script lang="ts">
  import { fade, slide } from 'svelte/transition';

  export let result: number | null;
  export let from: string;
  export let to: string;
  export let rate: number | null;
  export let locale: string;
</script>

{#if result !== null}
  <div class="result" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
    <p>
      Converted:
      <strong in:slide={{ duration: 300 }}>
        {new Intl.NumberFormat(locale).format(result)}
      </strong> {to}
    </p>
    {#if rate !== null}
      <small in:fade={{ delay: 100 }}>
        Rate: 1 {from} = {new Intl.NumberFormat(locale).format(rate)} {to}
      </small>
    {/if}
  </div>
{/if}

<style lang="scss" src="./ResultDisplay.scss"></style>
