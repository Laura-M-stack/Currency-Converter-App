<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { UiTexts } from '../../i18n';

  export let history: string[] = [];
  export let texts: UiTexts;

  const dispatch = createEventDispatcher<{ clear: void }>();

  function handleClear() {
    dispatch('clear');
  }
</script>

{#if history.length > 0}
  <div class="history">
    <div class="history-header">
      <h2>{texts.historyTitle}</h2>

      <button class="clear-btn" on:click={handleClear}>
        {texts.clearHistory}
      </button>
    </div>

    <div class="history-chips">
      {#each history as item}
        <span class="chip">{item}</span>
      {/each}
    </div>
  </div>
{/if}

<style lang="scss" src="./HistoryList.scss"></style>
