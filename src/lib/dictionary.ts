import enUS from "@/i18n/en-US";
import ptBR from "@/i18n/pt-BR";

export const TRANSLATIONS = {
    "pt-BR": ptBR,
    "en-US": enUS,
} as const;

export type Locale = keyof typeof TRANSLATIONS;

export const DEFAULT_LOCALE: Locale = "en-US";
export const SUPPORTED_LOCALES = Object.keys(TRANSLATIONS) as Locale[];

export const LOCALE_INFO: Record<Locale, { name: string; flag: string }> = {
    "en-US": { name: "English", flag: "🇺🇸" },
    "pt-BR": { name: "Português", flag: "🇧🇷" },
};

export const findSupportedLocale = (language: string): Locale | undefined => {
    const normalized = language.toLowerCase();
    const exactLocale = SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === normalized);
    if (exactLocale) return exactLocale;

    const languageCode = normalized.split("-")[0];
    const languageMatches = SUPPORTED_LOCALES.filter(
        (locale) => locale.split("-")[0].toLowerCase() === languageCode,
    );
    return languageMatches.length === 1 ? languageMatches[0] : undefined;
};

export const getTranslation = (lang: string) => TRANSLATIONS[findSupportedLocale(lang) ?? DEFAULT_LOCALE];
