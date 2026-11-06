<script lang="ts">
  import TopBar from './components/TopBar.svelte';
  import Converter from './components/Converter.svelte';
  import Footer from './components/Footer.svelte';
  import { settings } from './lib/settings.svelte';
  import { getUiTexts } from './i18n';

  const texts = $derived(getUiTexts(settings.lang));

  $effect(() => {
    document.title = `${texts.title} – Laura Moyano`;
  });
</script>

<TopBar {texts} />

<main class="main">
  <Converter {texts} />
</main>

<Footer {texts} />

<style>
  .main {
    display: flex;
    flex: 1;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    padding: 24px 16px 0;
  }

  @media (min-height: 760px) {
    .main {
      padding-top: 6vh;
    }
  }
</style>
