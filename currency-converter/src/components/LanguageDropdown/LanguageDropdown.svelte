<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Lang } from "../../i18n";
  import { FLAG_URL } from "../../lib/flags";

  export let current: Lang = "es";

  const dispatch = createEventDispatcher<{ change: Lang }>();

  type Option = { value: Lang; label: string };

  const options: Option[] = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "pt", label: "Português" },
    { value: "it", label: "Italiano" },
  ];

  let open = false;

  $: currentLabel =
    options.find((opt) => opt.value === current)?.label ??
    current.toUpperCase();

  function toggle() {
    open = !open;
  }

  function selectLanguage(lang: Lang) {
    current = lang;
    dispatch("change", lang);
    open = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      open = false;
    }
  }
</script>

<div class="lang-dropdown" role="region" aria-label="Language selector">
  <button
    type="button"
    class="lang-dropdown__button"
    on:click={toggle}
    on:keydown={handleKeydown}
    aria-haspopup="listbox"
    aria-expanded={open}
  >
    <img class="lang-dropdown__flag" src={FLAG_URL[current]} alt="" />
   
    <span class="lang-dropdown__chevron" aria-hidden="true">▾</span>
  </button>

  {#if open}
    <ul class="lang-dropdown__menu" role="listbox">
      {#each options as opt}
        <li>
          <button
            type="button"
            class="lang-dropdown__option"
            on:click={() => selectLanguage(opt.value)}
          >
            <img class="lang-dropdown__flag" src={FLAG_URL[opt.value]} alt="" />
            <span>{opt.label}</span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss">
  @import "./LanguageDropdown.scss";
</style>
