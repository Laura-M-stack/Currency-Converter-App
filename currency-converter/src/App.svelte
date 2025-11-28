<script lang="ts">
  import AmountInput from "./components/AmountInput/AmountInput.svelte";
  import CurrencySelect from "./components/CurrencySelect/CurrencySelect.svelte";
  import ResultDisplay from "./components/ResultDisplay/ResultDisplay.svelte";
  import HistoryList from "./components/HistoryList/HistoryList.svelte";
  import SwapButton from "./components/SwapButton/SwapButton.svelte";
  import LocaleSelect from "./components/LocaleSelect/LocaleSelect.svelte";
  import TopBar from "./components/TopBar/TopBar.svelte";
  import Footer from "./components/Footer/Footer.svelte";
  import { convertCurrency } from "./lib/api";
  import { onMount } from "svelte";

  import { getUiTexts } from "./i18n";
  import type { Lang, UiTexts } from "./i18n";

  import "./styles/layout.scss";

  let amount: string = "100";
  let from = "USD";
  let to = "ARS";
  let result: number | null = null;
  let rate: number | null = null;
  let loading = false;
  let history: string[] = [];
  let error: string | null = null;
  let lang: Lang = "es";
  let locale = "es-AR";
  let texts: UiTexts = getUiTexts(lang);

  function parseAndValidateAmount(raw: string): number | null {
    if (!raw || raw.trim() === "") {
      return null;
    }

    const normalized = raw.replace(",", ".").trim();

    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
      return null;
    }

    const num = Number(normalized);

    if (!Number.isFinite(num)) return null;
    if (num <= 0) return null; // > 0
    if (num > 1_000_000_000) return null;

    return num;
  }

  onMount(() => {
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      try {
        history = JSON.parse(savedHistory);
      } catch {
        history = [];
      }
    }

    const savedLocale = localStorage.getItem("locale");
    if (savedLocale) {
      locale = savedLocale;
    }

    const savedLang = localStorage.getItem("lang") as Lang | null;
    if (savedLang && ["en", "es", "fr", "de", "pt", "it"].includes(savedLang)) {
      lang = savedLang;
    }
  });

  $: localStorage.setItem("lang", lang);
  $: texts = getUiTexts(lang);
  $: localStorage.setItem("locale", locale);

  async function fetchConversion() {
    const parsedAmount = parseAndValidateAmount(amount);

    if (parsedAmount === null) {
      error = texts.errorInvalidAmount;
      result = null;
      rate = null;
      return;
    }

    loading = true;
    error = null;

    try {
      const data = await convertCurrency(from, to, parsedAmount);
      result = data.result;
      rate = data.rate;

      const record = `${parsedAmount} ${from} → ${data.result.toFixed(2)} ${to}`;
      history = [...history, record].slice(-5);
      localStorage.setItem("history", JSON.stringify(history));
    } catch (e) {
      error = texts.errorFetch;
      result = null;
      rate = null;
    } finally {
      loading = false;
    }
  }

  function clearHistory() {
    history = [];
    localStorage.removeItem("history");
  }

  function handleLanguageChange(newLang: Lang) {
    lang = newLang;
  }
</script>

<TopBar {lang} title={texts.title} onLanguageChange={handleLanguageChange} />

<div class="page-shell">
  <div class="wrapper">
    <main class="converter-card">
      <section class="conversion-form">
        <AmountInput
          bind:value={amount}
          label={texts.amountLabel}
          hasError={error === texts.errorInvalidAmount}
        />

        <div class="row">
          <CurrencySelect label={texts.fromLabel} bind:selected={from} />
          <SwapButton onSwap={() => ([from, to] = [to, from])} />
          <CurrencySelect label={texts.toLabel} bind:selected={to} />
        </div>

        <div class="locale-control">
          <LocaleSelect
            bind:selected={locale}
            label={texts.localeLabel}
            tooltip={texts.localeTooltip}
          />
        </div>

        <button
          class="convert-btn"
          on:click={fetchConversion}
          disabled={loading}
        >
          {texts.convert}
        </button>
      </section>

      <section class="conversion-result">
        {#if error}
          <p class="error">{error}</p>
        {:else}
          {#key `${locale}-${lang}`}
            <ResultDisplay
              {result}
              {from}
              {to}
              {rate}
              {locale}
              {texts}
              {lang}
            />
          {/key}
        {/if}
      </section>

      <HistoryList {history} {texts} on:clear={clearHistory} />
    </main>
  </div>
</div>

<Footer />
