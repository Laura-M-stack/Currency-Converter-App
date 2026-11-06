<script lang="ts">
  import Icon from './Icon.svelte';
  import { settings } from '../lib/settings.svelte';
  import type { UiTexts } from '../i18n';

  type Props = { texts: UiTexts };
  let { texts }: Props = $props();

  const isDark = $derived(settings.theme === 'dark');
  const label = $derived(isDark ? texts.themeToLight : texts.themeToDark);
</script>

<button type="button" class="icon-btn" aria-label={label} title={label} onclick={() => settings.toggleTheme()}>
  <Icon name={isDark ? 'sun' : 'moon'} size={18} />
</button>
