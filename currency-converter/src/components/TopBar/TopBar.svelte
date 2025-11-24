<script lang="ts">
  import DarkModeToggle from '../DarkModeToggle/DarkModeToggle.svelte';
  import LanguageDropdown from '../LanguageDropdown/LanguageDropdown.svelte';
  import type { Lang } from '../../i18n';

  export let lang: Lang = 'en';
  export let title: string = 'Currency Converter';
  export let onLanguageChange: (lang: Lang) => void;
</script>

<header class="top-bar">
  <h1>{title}</h1>

  <div class="top-bar__actions">
    <LanguageDropdown
      current={lang}
      onChange={onLanguageChange}
    />

    <DarkModeToggle />
  </div>
</header>

<style lang="scss" src="./TopBar.scss"></style>
