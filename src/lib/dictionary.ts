import enUS from "@/i18n/en-US";
import ptBR from "@/i18n/pt-BR";

export type Locale = "pt-BR" | "en-US";

export const TRANSLATIONS = {
    "pt-BR": ptBR,
    "en-US": enUS,
} as const;

export const getTranslation = (lang: string) => {
    if (lang in TRANSLATIONS) return TRANSLATIONS[lang as Locale];
    if (lang.startsWith("en")) return TRANSLATIONS["en-US"];
    if (lang.startsWith("pt")) return TRANSLATIONS["pt-BR"];
    return TRANSLATIONS["pt-BR"];
};

