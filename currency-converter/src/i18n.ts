export type Lang = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it';

export type UiTexts = {
  title: string;
  amountLabel: string;
  fromLabel: string;
  toLabel: string;
  localeLabel: string;
  localeTooltip: string;
  convert: string;
  converting: string;
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
    converting: 'Converting...',
    convertedPrefix: 'Converted:',
    rateLabel: 'Rate:',
    inverseRateLabel: 'Inverse:',
    pairExplanationTemplate:
      'You are converting from {from} to {to}. Rates come from open.er-api.com and may change over time.',
    historyTitle: 'Recent conversions',
    clearHistory: 'Clear',
    errorInvalidAmount: 'Please enter an amount greater than 0.',
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
    converting: 'Convirtiendo...',
    convertedPrefix: 'Convertido:',
    rateLabel: 'Tasa:',
    inverseRateLabel: 'Inversa:',
    pairExplanationTemplate:
      'Estás convirtiendo de {from} a {to}. Las tasas provienen de open.er-api.com y pueden variar con el tiempo.',
    historyTitle: 'Conversiones recientes',
    clearHistory: 'Limpiar',
    errorInvalidAmount: 'Ingresá un monto mayor que 0.',
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
    converting: 'Conversion...',
    convertedPrefix: 'Converti :',
    rateLabel: 'Taux :',
    inverseRateLabel: 'Inverse :',
    pairExplanationTemplate:
      'Vous convertissez de {from} vers {to}. Les taux proviennent de open.er-api.com et peuvent varier.',
    historyTitle: 'Conversions récentes',
    clearHistory: 'Effacer',
    errorInvalidAmount: 'Veuillez saisir un montant supérieur à 0.',
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
    converting: 'Wird umgerechnet...',
    convertedPrefix: 'Umgerechnet:',
    rateLabel: 'Kurs:',
    inverseRateLabel: 'Umgekehrt:',
    pairExplanationTemplate:
      'Du wandelst von {from} in {to} um. Die Kurse stammen von open.er-api.com und können sich ändern.',
    historyTitle: 'Letzte Umrechnungen',
    clearHistory: 'Löschen',
    errorInvalidAmount: 'Bitte einen Betrag größer als 0 eingeben.',
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
    converting: 'Convertendo...',
    convertedPrefix: 'Convertido:',
    rateLabel: 'Taxa:',
    inverseRateLabel: 'Inversa:',
    pairExplanationTemplate:
      'Você está convertendo de {from} para {to}. As taxas vêm de open.er-api.com e podem mudar ao longo do tempo.',
    historyTitle: 'Conversões recentes',
    clearHistory: 'Limpar',
    errorInvalidAmount: 'Informe um valor maior que 0.',
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
    converting: 'Conversione in corso...',
    convertedPrefix: 'Convertito:',
    rateLabel: 'Tasso:',
    inverseRateLabel: 'Inverso:',
    pairExplanationTemplate:
      'Stai convertendo da {from} a {to}. I tassi provengono da open.er-api.com e possono variare nel tempo.',
    historyTitle: 'Conversioni recenti',
    clearHistory: 'Cancella',
    errorInvalidAmount: "Inserisci un importo maggiore di 0.",
    errorFetch:
      'Errore durante il recupero del tasso di cambio. Riprova più tardi.'
  }
};

export function getUiTexts(lang: Lang): UiTexts {
  return TRANSLATIONS[lang] ?? TRANSLATIONS.en;
}
