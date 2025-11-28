export type Lang = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it';

export type UiTexts = {
  title: string;
  amountLabel: string;
  fromLabel: string;
  toLabel: string;
  localeLabel: string;
  localeTooltip: string;
  convert: string;
  convertedPrefix: string;
  rateLabel: string;
  inverseRateLabel: string;
  pairExplanationTemplate: string;
  historyTitle: string;
  clearHistory: string;
  errorInvalidAmount: string;
  errorFetch: string;
};

export const TRANSLATIONS: Record<Lang, UiTexts> = {
  en: {
    title: 'Currency Converter',
    amountLabel: 'Amount',
    fromLabel: 'From',
    toLabel: 'To',
    localeLabel: 'Locale',
    localeTooltip:
      'Controls how numbers and currencies are formatted (decimal and thousand separators, symbol position, etc.).',
    convert: 'Convert',
    convertedPrefix: 'Converted:',
    rateLabel: 'Rate:',
    inverseRateLabel: 'Inverse:',
    pairExplanationTemplate:
      'You are converting from {from} to {to}. Rates are provided by open.er-api.com and are updated once per day under the free plan.',
    historyTitle: 'Recent conversions',
    clearHistory: 'Clear',
    errorInvalidAmount: 'Please enter a valid positive number.',
    errorFetch: 'Error fetching conversion data. Please try again.'
  },
  es: {
    title: 'Conversor de moneda',
    amountLabel: 'Monto',
    fromLabel: 'De',
    toLabel: 'A',
    localeLabel: 'Formato regional',
    localeTooltip:
      'Define cómo se muestran números y monedas (separadores, símbolo, etc.).',
    convert: 'Convertir',
    convertedPrefix: 'Convertido:',
    rateLabel: 'Tasa:',
    inverseRateLabel: 'Inversa:',
    pairExplanationTemplate:
      'Estás convirtiendo de {from} a {to}. Las tasas provienen de open.er-api.com y se actualizan una vez al día según el plan gratuito.',
    historyTitle: 'Conversiones recientes',
    clearHistory: 'Limpiar',
    errorInvalidAmount: 'Por favor ingresa un monto positivo válido.',
    errorFetch: 'Hubo un error al obtener la tasa. Intentá nuevamente.'
  },
  fr: {
    title: 'Convertisseur de devises',
    amountLabel: 'Montant',
    fromLabel: 'De',
    toLabel: 'Vers',
    localeLabel: 'Format régional',
    localeTooltip:
      'Contrôle l’affichage des nombres et des devises (séparateurs, symbole, etc.).',
    convert: 'Convertir',
    convertedPrefix: 'Converti :',
    rateLabel: 'Taux :',
    inverseRateLabel: 'Inverse :',
    pairExplanationTemplate:
      'Vous convertissez de {from} vers {to}. Les taux proviennent de open.er-api.com et sont mis à jour une fois par jour dans le cadre du plan gratuit.',
    historyTitle: 'Conversions récentes',
    clearHistory: 'Effacer',
    errorInvalidAmount: 'Veuillez saisir un montant positif valide.',
    errorFetch:
      'Erreur lors de la récupération du taux de change. Veuillez réessayer.'
  },
  de: {
    title: 'Währungsrechner',
    amountLabel: 'Betrag',
    fromLabel: 'Von',
    toLabel: 'Nach',
    localeLabel: 'Regionale Einstellung',
    localeTooltip:
      'Steuert, wie Zahlen und Währungen formatiert werden (Trennzeichen, Symbol, usw.).',
    convert: 'Umrechnen',
    convertedPrefix: 'Umgerechnet:',
    rateLabel: 'Kurs:',
    inverseRateLabel: 'Umgekehrt:',
    pairExplanationTemplate:
      'Du wandelst von {from} in {to} um. Die Kurse werden von open.er-api.com bereitgestellt und im Rahmen des kostenlosen Tarifs einmal täglich aktualisiert.',
    historyTitle: 'Letzte Umrechnungen',
    clearHistory: 'Löschen',
    errorInvalidAmount: 'Bitte gib einen gültigen positiven Betrag ein.',
    errorFetch:
      'Fehler beim Abrufen der Wechselkurse. Bitte versuche es erneut.'
  },
  pt: {
    title: 'Conversor de moeda',
    amountLabel: 'Valor',
    fromLabel: 'De',
    toLabel: 'Para',
    localeLabel: 'Formato regional',
    localeTooltip:
      'Controla como números e moedas são exibidos (separadores, símbolo, etc.).',
    convert: 'Converter',
    convertedPrefix: 'Convertido:',
    rateLabel: 'Taxa:',
    inverseRateLabel: 'Inversa:',
    pairExplanationTemplate:
      'Você está convertendo de {from} para {to}. As taxas são fornecidas por open.er-api.com e são atualizadas uma vez por dia no plano gratuito.',
    historyTitle: 'Conversões recentes',
    clearHistory: 'Limpar',
    errorInvalidAmount: 'Por favor, insira um valor positivo válido.',
    errorFetch:
      'Erro ao buscar a taxa de câmbio. Tente novamente mais tarde.'
  },
  it: {
    title: 'Convertitore di valuta',
    amountLabel: 'Importo',
    fromLabel: 'Da',
    toLabel: 'A',
    localeLabel: 'Formato locale',
    localeTooltip:
      'Controlla come vengono visualizzati numeri e valute (separatore decimale, simbolo, ecc.).',
    convert: 'Converti',
    convertedPrefix: 'Convertito:',
    rateLabel: 'Tasso:',
    inverseRateLabel: 'Inverso:',
    pairExplanationTemplate:
      'Stai convertendo da {from} a {to}. I tassi sono forniti da open.er-api.com e vengono aggiornati una volta al giorno con il piano gratuito.',
    historyTitle: 'Conversioni recenti',
    clearHistory: 'Cancella',
    errorInvalidAmount: " Per favore inserisci un importo positivo valido.",
    errorFetch:
      'Errore durante il recupero del tasso di cambio. Riprova più tardi.'
  }
};

export function getUiTexts(lang: Lang): UiTexts {
  return TRANSLATIONS[lang] ?? TRANSLATIONS.en;
}
