<script lang="ts">
  import LanguageMenu from './LanguageMenu.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import Icon from './Icon.svelte';
  import { settings } from '../lib/settings.svelte';
  import type { UiTexts } from '../i18n';

  type Props = { texts: UiTexts };
  let { texts }: Props = $props();
</script>

<header class="top-bar">
  <div class="brand">
    <span class="brand__mark" aria-hidden="true"><Icon name="swap" size={18} /></span>
    <h1>{texts.title}</h1>
  </div>

  <div class="actions">
    <LanguageMenu current={settings.lang} label={texts.language} onchange={(lang) => settings.setLang(lang)} />
    <ThemeToggle {texts} />
  </div>
</header>

<style>
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: 16px 20px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .brand__mark {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: var(--accent);
    color: var(--on-accent);
  }

  h1 {
    margin: 0;
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.01em;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .actions {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 8px;
  }
</style>
