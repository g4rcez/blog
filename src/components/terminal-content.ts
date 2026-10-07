import { TRANSLATIONS, type Locale } from "@/lib/dictionary";

export const getTerminalContent = (locale: Locale) => TRANSLATIONS[locale].terminal;
