<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { UiTexts, Lang } from '../../i18n';

  export let result: number | null;
  export let from: string;
  export let to: string;
  export let rate: number | null;
  export let locale: string;
  export let texts: UiTexts;
  export let lang: Lang = 'en';

  const formatNumber = (value: number, maximumFractionDigits = 3) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);

  $: hasResult = result !== null;
  $: inverseRate = rate !== null && rate !== 0 ? 1 / rate : null;

  const langToDisplayLocale: Record<Lang, string> = {
    en: 'en',
    es: 'es',
    fr: 'fr',
    de: 'de',
    pt: 'pt',
    it: 'it'
  };

  $: displayNames =
    typeof Intl !== 'undefined'
      ? new Intl.DisplayNames(langToDisplayLocale[lang] ?? 'en', {
          type: 'currency'
        })
      : null;

  $: fromName = displayNames?.of(from) ?? from;
  $: toName = displayNames?.of(to) ?? to;

  $: pairExplanation = texts.pairExplanationTemplate
    .replace('{from}', fromName)
    .replace('{to}', toName);
</script>

{#if hasResult}
  <div class="result" in:fade={{ duration: 200 }}>
    <p>
      {texts.convertedPrefix}
      {' '}
      <strong>{formatNumber(result!)}</strong>
      {' '}
      {to}
    </p>

    {#if rate !== null}
      <small>
        {texts.rateLabel}
        {' '}
        1 {from} = {formatNumber(rate, 6)} {to}
      </small>

      {#if inverseRate}
        <small>
          {texts.inverseRateLabel}
          {' '}
          1 {to} = {formatNumber(inverseRate, 6)} {from}
        </small>
      {/if}

      <small class="pair-explanation">
        {pairExplanation}
      </small>
    {/if}
  </div>
{/if}

<style lang="scss" src="./ResultDisplay.scss"></style>
