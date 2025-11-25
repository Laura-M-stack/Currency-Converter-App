<script lang="ts">
  export let selected: string;
  export let label: string = "Formato locale";
  export let tooltip: string =
    "Controls how numbers and currencies are formatted based on your region.";

  const locales = [
    { code: "en-US", label: "US English (US)" },
    { code: "en-GB", label: "GB English (UK)" },
    { code: "es-AR", label: "Español (Argentina)" },
    { code: "es-ES", label: "Español (España)" },
    { code: "fr-FR", label: "Français (France)" },
    { code: "de-DE", label: "Deutsch (Deutschland)" },
    { code: "pt-BR", label: "Português (Brasil)" },
    { code: "it-IT", label: "Italiano (Italia)" },
  ];

  let isOpen = false;

  function handleClick() {
    // alterno estado visual de la flecha
    isOpen = !isOpen;
  }

  function handleBlur() {
    // si pierde foco, aseguramos flecha hacia abajo
    isOpen = false;
  }
</script>

<div class="locale-select {isOpen ? 'open' : ''}">
  <div class="locale-select__header">
    <span class="label-text">{label}</span>

    <span class="info-icon" aria-hidden="true">
      ⓘ
      <span class="tooltip-bubble">
        {tooltip}
      </span>
    </span>
  </div>

  <select
    class="locale-select__control"
    bind:value={selected}
    on:click={handleClick}
    on:blur={handleBlur}
  >
    {#each locales as loc}
      <option value={loc.code}>{loc.label}</option>
    {/each}
  </select>
</div>

<style lang="scss" src="./LocaleSelect.scss"></style>
