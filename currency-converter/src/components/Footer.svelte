<script lang="ts">
  import Icon from './Icon.svelte';
  import type { UiTexts } from '../i18n';

  type Props = { texts: UiTexts };
  let { texts }: Props = $props();

  const year = new Date().getFullYear();
</script>

<footer class="footer">
  <p>{texts.source}</p>
  <p>
    © {year} Laura Moyano ·
    <a href="https://github.com/Laura-M-stack/Currency-Converter-App" target="_blank" rel="noopener noreferrer">
      <Icon name="github" size={14} />
      {texts.sourceCode}
    </a>
  </p>
</footer>

<style>
  .footer {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: auto;
    padding: 24px 20px 32px;
    color: var(--muted);
    font-size: 12px;
    text-align: center;
  }

  p {
    margin: 0;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  a:hover {
    color: var(--text);
  }
</style>
