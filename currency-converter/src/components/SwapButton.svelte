<script lang="ts">
  import Icon from './Icon.svelte';

  type Props = { label: string; onswap: () => void };
  let { label, onswap }: Props = $props();

  let turns = $state(0);

  function handleClick() {
    turns += 1;
    onswap();
  }
</script>

<button type="button" class="swap" aria-label={label} title={label} onclick={handleClick}>
  <span class="swap__icon" style:transform="rotate({turns * 180}deg)">
    <Icon name="swap" size={20} />
  </span>
</button>

<style>
  .swap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 4px solid var(--card);
    border-radius: 50%;
    background: var(--accent);
    color: var(--on-accent);
    cursor: pointer;
    transition: background-color 0.15s ease, transform 0.1s ease;
  }

  .swap:hover {
    background: var(--accent-hover);
  }

  .swap:active {
    transform: scale(0.94);
  }

  .swap:focus-visible {
    outline-offset: 0;
  }

  .swap__icon {
    display: flex;
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
</style>
