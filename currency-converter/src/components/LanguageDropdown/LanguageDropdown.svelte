<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Lang } from '../../i18n';

  export let current: Lang = 'en';

  const dispatch = createEventDispatcher<{ change: Lang }>();

  const options: { value: Lang; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'pt', label: 'Português' },
    { value: 'it', label: 'Italiano' }
  ];

  function handleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as Lang;
    current = value;
    dispatch('change', value);
  }
</script>

<div class="lang-dropdown">
  <span class="lang-dropdown__icon" aria-hidden="true">🌐</span>
  <select
    class="lang-dropdown__select"
    bind:value={current}
    on:change={handleChange}
    aria-label="Language"
  >
    {#each options as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
</div>

<style lang="scss"> 
  @import './LanguageDropdown.scss';
</style>
