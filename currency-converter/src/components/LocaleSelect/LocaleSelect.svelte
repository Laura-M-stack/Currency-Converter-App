<script lang="ts">
  export let selected: string;
  export let label: string = 'Locale';
  export let tooltip: string =
    'Controls how numbers and currencies are formatted (decimal and thousand separators, symbol position, etc.).';

  const locales = [
    { code: 'en-US', label: 'US English (US)' },
    { code: 'en-GB', label: 'GB English (UK)' },
    { code: 'es-AR', label: 'Español (Argentina)' },
    { code: 'es-ES', label: 'Español (España)' },
    { code: 'fr-FR', label: 'Français (France)' },
    { code: 'de-DE', label: 'Deutsch (Deutschland)' },
    { code: 'pt-BR', label: 'Português (Brasil)' },
    { code: 'it-IT', label: 'Italiano (Italia)' }
  ];

  $: if (!locales.some((l) => l.code === selected)) {
    selected = 'en-US';
  }
</script>

<div class="locale-select">
  <div class="locale-select__header">
    <span class="label-text">{label}</span>

    <span class="info-icon" aria-hidden="true">
      ⓘ
      <span class="tooltip-bubble">
        {tooltip}
      </span>
    </span>
  </div>

  <div class="select-shell">
    <select bind:value={selected}>
      {#each locales as loc}
        <option value={loc.code}>{loc.label}</option>
      {/each}
    </select>

    <span class="select-chevron" aria-hidden="true">▾</span>
  </div>
</div>

<style lang="scss" src="./LocaleSelect.scss"></style>
