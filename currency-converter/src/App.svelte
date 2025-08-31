<script lang="ts">
  import AmountInput from './components/AmountInput/AmountInput.svelte';
  import CurrencySelect from './components/CurrencySelect/CurrencySelect.svelte';
  import ResultDisplay from './components/ResultDisplay/ResultDisplay.svelte';
  import HistoryList from './components/HistoryList/HistoryList.svelte';
  import SwapButton from './components/SwapButton/SwapButton.svelte';
  import LocaleSelect from './components/LocaleSelect/LocaleSelect.svelte';
  import TopBar from './components/TopBar/TopBar.svelte';
  import Footer from './components/Footer/Footer.svelte';
  import { convertCurrency } from './lib/api';
  import { onMount } from 'svelte';

  let amount = 1;
  let from = 'USD';
  let to = 'EUR';
  let result: number | null = null;
  let rate: number | null = null;
  let loading = false;
  let history: string[] = [];
  let error: string | null = null;
  let locale = 'en-US';

  onMount(() => {
    const savedHistory = localStorage.getItem('history');
    if (savedHistory) history = JSON.parse(savedHistory);

    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) locale = savedLocale;
  });


async function fetchConversion() {
  loading = true;
  error = null;
  try {
    const data = await convertCurrency(from, to, amount);
    result = data.result;
    rate = data.rate;
    const record = `${amount} ${from} \u2192 ${result.toFixed(2)} ${to}`;
    history = [...history, record].slice(-5);
    localStorage.setItem('history', JSON.stringify(history));
  } catch (e) {
    error = 'Error fetching conversion data.';
    result = null;
    rate = null;
  } finally {
    loading = false;
  }
}

  $: localStorage.setItem('locale', locale);
</script>

<TopBar />

<div class="wrapper">
  <section class="conversion-form">
    <AmountInput bind:value={amount} />

    <div class="row">
      <CurrencySelect label="From" bind:selected={from} />
      <SwapButton onSwap={() => ([from, to] = [to, from])} />
      <CurrencySelect label="To" bind:selected={to} />
    </div>

    <LocaleSelect bind:selected={locale} />
  </section>

  <button class="convert-btn" on:click={fetchConversion}>Convert</button>

  <section class="conversion-result">
    {#if loading}
      <p>Loading...</p>
    {:else if error}
      <p class="error">{error}</p>
    {:else}
      <ResultDisplay {result} {from} {to} {rate} {locale} />
    {/if}
  </section>

  <HistoryList {history} />
</div>

<Footer />

<style lang="scss">
  @use './styles/layout';
</style>
