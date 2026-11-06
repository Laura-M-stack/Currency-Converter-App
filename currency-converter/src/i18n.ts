export const LANGS = ['en', 'es', 'fr', 'de', 'pt', 'it'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_NAMES: Record<Lang, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  it: 'Italiano',
};

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}

/** Number formats offered in the selector (the "automatic" option derives one from the language). */
export const LOCALES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'es-AR', label: 'Español (Argentina)' },
  { code: 'es-ES', label: 'Español (España)' },
  { code: 'es-MX', label: 'Español (México)' },
  { code: 'fr-FR', label: 'Français (France)' },
  { code: 'de-DE', label: 'Deutsch (Deutschland)' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'it-IT', label: 'Italiano (Italia)' },
] as const;

export function isSupportedLocale(value: unknown): value is string {
  return typeof value === 'string' && LOCALES.some((l) => l.code === value);
}

const FALLBACK_LOCALE: Record<Lang, string> = {
  en: 'en-US',
  es: 'es-AR',
  fr: 'fr-FR',
  de: 'de-DE',
  pt: 'pt-BR',
  it: 'it-IT',
};

/** Prefers the browser's own region for that language (es-MX user → es-MX), else a sensible default. */
export function defaultLocaleFor(lang: Lang, browserLocales: readonly string[] = browserLanguages()): string {
  const match = browserLocales.find((l) => l.toLowerCase().startsWith(`${lang}-`));
  if (match) {
    try {
      return Intl.getCanonicalLocales(match)[0];
    } catch {
      /* fall through */
    }
  }
  return FALLBACK_LOCALE[lang];
}

export function browserLanguages(): readonly string[] {
  if (typeof navigator === 'undefined') return [];
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}

export function detectBrowserLang(browserLocales: readonly string[] = browserLanguages()): Lang {
  for (const locale of browserLocales) {
    const base = locale.slice(0, 2).toLowerCase();
    if (isLang(base)) return base;
  }
  return 'en';
}

export type UiTexts = {
  title: string;
  send: string;
  receive: string;
  swap: string;
  chooseCurrency: string;
  searchPlaceholder: string;
  noResults: string;
  updated: string;
  source: string;
  loading: string;
  numberFormat: string;
  automatic: string;
  recent: string;
  clear: string;
  repeatConversion: string;
  errorInvalidAmount: string;
  errorFetch: string;
  errorRateMissing: string;
  retry: string;
  language: string;
  themeToDark: string;
  themeToLight: string;
  sourceCode: string;
};

export const TRANSLATIONS: Record<Lang, UiTexts> = {
  en: {
    title: 'Currency converter',
    send: 'You send',
    receive: 'You get',
    swap: 'Swap currencies',
    chooseCurrency: 'Choose currency',
    searchPlaceholder: 'Search currency or code',
    noResults: 'No currency matches “{q}”.',
    updated: 'Updated {time}',
    source: 'Rates from open.er-api.com, refreshed once a day.',
    loading: 'Loading rates…',
    numberFormat: 'Number format',
    automatic: 'Automatic ({locale})',
    recent: 'Recent',
    clear: 'Clear',
    repeatConversion: 'Convert {amount} {from} to {to}',
    errorInvalidAmount: 'Enter a valid amount greater than 0.',
    errorFetch: 'Couldn’t load exchange rates. Check your connection.',
    errorRateMissing: 'No rate available for {from} → {to}.',
    retry: 'Retry',
    language: 'Language',
    themeToDark: 'Switch to dark mode',
    themeToLight: 'Switch to light mode',
    sourceCode: 'Source code',
  },
  es: {
    title: 'Conversor de monedas',
    send: 'Envías',
    receive: 'Recibes',
    swap: 'Invertir monedas',
    chooseCurrency: 'Elegir moneda',
    searchPlaceholder: 'Buscar moneda o código',
    noResults: 'Ninguna moneda coincide con “{q}”.',
    updated: 'Actualizado {time}',
    source: 'Tasas de open.er-api.com, se actualizan una vez al día.',
    loading: 'Cargando tasas…',
    numberFormat: 'Formato de números',
    automatic: 'Automático ({locale})',
    recent: 'Recientes',
    clear: 'Borrar',
    repeatConversion: 'Convertir {amount} {from} a {to}',
    errorInvalidAmount: 'Ingresa un monto válido mayor que 0.',
    errorFetch: 'No se pudieron cargar las tasas. Revisa tu conexión.',
    errorRateMissing: 'No hay tasa disponible para {from} → {to}.',
    retry: 'Reintentar',
    language: 'Idioma',
    themeToDark: 'Cambiar a modo oscuro',
    themeToLight: 'Cambiar a modo claro',
    sourceCode: 'Código fuente',
  },
  fr: {
    title: 'Convertisseur de devises',
    send: 'Vous envoyez',
    receive: 'Vous recevez',
    swap: 'Inverser les devises',
    chooseCurrency: 'Choisir une devise',
    searchPlaceholder: 'Rechercher une devise ou un code',
    noResults: 'Aucune devise ne correspond à « {q} ».',
    updated: 'Mis à jour {time}',
    source: 'Taux fournis par open.er-api.com, mis à jour une fois par jour.',
    loading: 'Chargement des taux…',
    numberFormat: 'Format des nombres',
    automatic: 'Automatique ({locale})',
    recent: 'Récents',
    clear: 'Effacer',
    repeatConversion: 'Convertir {amount} {from} en {to}',
    errorInvalidAmount: 'Saisissez un montant valide supérieur à 0.',
    errorFetch: 'Impossible de charger les taux. Vérifiez votre connexion.',
    errorRateMissing: 'Aucun taux disponible pour {from} → {to}.',
    retry: 'Réessayer',
    language: 'Langue',
    themeToDark: 'Passer en mode sombre',
    themeToLight: 'Passer en mode clair',
    sourceCode: 'Code source',
  },
  de: {
    title: 'Währungsrechner',
    send: 'Sie senden',
    receive: 'Sie erhalten',
    swap: 'Währungen tauschen',
    chooseCurrency: 'Währung wählen',
    searchPlaceholder: 'Währung oder Code suchen',
    noResults: 'Keine Währung passt zu „{q}“.',
    updated: 'Aktualisiert {time}',
    source: 'Kurse von open.er-api.com, einmal täglich aktualisiert.',
    loading: 'Kurse werden geladen…',
    numberFormat: 'Zahlenformat',
    automatic: 'Automatisch ({locale})',
    recent: 'Zuletzt',
    clear: 'Löschen',
    repeatConversion: '{amount} {from} in {to} umrechnen',
    errorInvalidAmount: 'Geben Sie einen gültigen Betrag größer als 0 ein.',
    errorFetch: 'Kurse konnten nicht geladen werden. Prüfen Sie Ihre Verbindung.',
    errorRateMissing: 'Kein Kurs für {from} → {to} verfügbar.',
    retry: 'Erneut versuchen',
    language: 'Sprache',
    themeToDark: 'Zum dunklen Modus wechseln',
    themeToLight: 'Zum hellen Modus wechseln',
    sourceCode: 'Quellcode',
  },
  pt: {
    title: 'Conversor de moedas',
    send: 'Você envia',
    receive: 'Você recebe',
    swap: 'Inverter moedas',
    chooseCurrency: 'Escolher moeda',
    searchPlaceholder: 'Buscar moeda ou código',
    noResults: 'Nenhuma moeda corresponde a “{q}”.',
    updated: 'Atualizado {time}',
    source: 'Taxas de open.er-api.com, atualizadas uma vez por dia.',
    loading: 'Carregando taxas…',
    numberFormat: 'Formato de números',
    automatic: 'Automático ({locale})',
    recent: 'Recentes',
    clear: 'Limpar',
    repeatConversion: 'Converter {amount} {from} para {to}',
    errorInvalidAmount: 'Insira um valor válido maior que 0.',
    errorFetch: 'Não foi possível carregar as taxas. Verifique sua conexão.',
    errorRateMissing: 'Nenhuma taxa disponível para {from} → {to}.',
    retry: 'Tentar novamente',
    language: 'Idioma',
    themeToDark: 'Mudar para o modo escuro',
    themeToLight: 'Mudar para o modo claro',
    sourceCode: 'Código-fonte',
  },
  it: {
    title: 'Convertitore di valuta',
    send: 'Invii',
    receive: 'Ricevi',
    swap: 'Inverti valute',
    chooseCurrency: 'Scegli valuta',
    searchPlaceholder: 'Cerca valuta o codice',
    noResults: 'Nessuna valuta corrisponde a “{q}”.',
    updated: 'Aggiornato {time}',
    source: 'Tassi forniti da open.er-api.com, aggiornati una volta al giorno.',
    loading: 'Caricamento dei tassi…',
    numberFormat: 'Formato dei numeri',
    automatic: 'Automatico ({locale})',
    recent: 'Recenti',
    clear: 'Cancella',
    repeatConversion: 'Converti {amount} {from} in {to}',
    errorInvalidAmount: 'Inserisci un importo valido maggiore di 0.',
    errorFetch: 'Impossibile caricare i tassi. Controlla la connessione.',
    errorRateMissing: 'Nessun tasso disponibile per {from} → {to}.',
    retry: 'Riprova',
    language: 'Lingua',
    themeToDark: 'Passa alla modalità scura',
    themeToLight: 'Passa alla modalità chiara',
    sourceCode: 'Codice sorgente',
  },
};

export function getUiTexts(lang: Lang): UiTexts {
  return TRANSLATIONS[lang] ?? TRANSLATIONS.en;
}

/** Replaces {placeholders}; unknown placeholders are left as-is so missing data is visible in development. */
export function t(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
