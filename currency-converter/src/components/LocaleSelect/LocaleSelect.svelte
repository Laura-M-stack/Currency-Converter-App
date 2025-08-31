<script lang="ts">
  export let selected: string;

  const locales = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'es-AR', label: 'Español (AR)' },
    { code: 'es-MX', label: 'Español (MX)' },
    { code: 'fr-FR', label: 'Français (FR)' },
    { code: 'de-DE', label: 'Deutsch (DE)' },
  ];
</script>

<div class="locale-select">
  <label for="locale">Locale:</label>
  <select id="locale" bind:value={selected}>
    {#each locales as l}
      <option value={l.code}>{l.label}</option>
    {/each}
  </select>
</div>

<style lang="scss" src="./LocaleSelect.scss"></style>
