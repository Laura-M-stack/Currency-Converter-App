<script lang="ts">
  import { flagUrl } from '../lib/currencies';

  type Props = { code: string; size?: number };
  let { code, size = 22 }: Props = $props();

  const src = $derived(flagUrl(code));
  // Remember which code failed so a later code change retries automatically.
  let failedFor = $state<string | null>(null);
</script>

{#if src && failedFor !== code}
  <img
    class="flag"
    {src}
    alt=""
    width={size}
    height={size}
    loading="lazy"
    decoding="async"
    onerror={() => (failedFor = code)}
  />
{:else}
  <span class="flag flag--fallback" style:width="{size}px" style:height="{size}px" style:font-size="{size * 0.4}px" aria-hidden="true">
    {code.slice(0, 2)}
  </span>
{/if}

<style>
  .flag {
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 0 0 1px var(--border);
    background: var(--panel);
  }

  .flag--fallback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--muted);
  }
</style>
