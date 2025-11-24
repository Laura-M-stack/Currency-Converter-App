<script lang="ts">
  import type { Lang } from '../../i18n';

  export let current: Lang = 'en';
  export let onChange: (lang: Lang) => void;

  const options: { code: Lang; short: string; label: string }[] = [
    { code: 'en', short: 'EN', label: 'English' },
    { code: 'es', short: 'ES', label: 'Español' },
    { code: 'fr', short: 'FR', label: 'Français' },
    { code: 'de', short: 'DE', label: 'Deutsch' },
    { code: 'pt', short: 'PT', label: 'Português' },
    { code: 'it', short: 'IT', label: 'Italiano' }
  ];

  let open = false;

  function toggle() {
    open = !open;
  }

  function select(lang: Lang) {
    onChange?.(lang);
    open = false;
  }

  function handleTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    } else if (event.key === 'Escape') {
      open = false;
    }
  }

  function handleFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    const root = event.currentTarget as HTMLElement;
    if (!next || !root.contains(next)) {
      open = false;
    }
  }
</script>

<div
  class="lang-dropdown"
  on:focusout={handleFocusOut}
>
  <button
    class="lang-trigger"
    type="button"
    on:click={toggle}
    on:keydown={handleTriggerKeydown}
    aria-haspopup="listbox"
    aria-expanded={open}
  >
    <span class="lang-trigger__icon" aria-hidden="true">🌐</span>
    <span class="lang-trigger__code">{current.toUpperCase()}</span>
    <span class="lang-trigger__chevron" aria-hidden="true">▾</span>
  </button>

  {#if open}
    <ul class="lang-menu" role="listbox">
      {#each options as opt}
        <li>
          <button
            type="button"
            class:selected={opt.code === current}
            on:click={() => select(opt.code)}
          >
            <span class="lang-menu__short">{opt.short}</span>
            <span class="lang-menu__label">{opt.label}</span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss" src="./LanguageDropdown.scss"></style>
