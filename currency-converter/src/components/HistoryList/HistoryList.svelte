<script lang="ts">
  export let history: string[] = [];
</script>

{#if history.length > 0}
  <div class="history">
    <h2>Recent conversions</h2>
    <ul>
      {#each history as item}
        <li>{item}</li>
      {/each}
    </ul>
  </div>
{/if}

<style lang="scss" src="./HistoryList.scss"></style>
