"use client";
import React, { useCallback, useState } from "react";
import { DEFAULT_LOCALE, findSupportedLocale, Locale, TRANSLATIONS } from "./dictionary";

const detectLocale = (defaults?: string): Locale => findSupportedLocale(defaults ?? "") ?? DEFAULT_LOCALE;

const LocaleContext = React.createContext([detectLocale(), (_: Locale) => {}] as const);

export const useLocale = () => {
    if (LocaleContext === undefined)
        throw new Error(
            "useLocale must be used within a LocaleProvider. Make sure you have a <LocaleProvider> at the root of your application.",
        );
    return React.useContext(LocaleContext);
};

export const LocaleProvider = ({ children, lang = DEFAULT_LOCALE }: { children: React.ReactNode; lang?: string }) => {
    const locale = useState<Locale>(() => detectLocale(lang));
    return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

export function useTranslation() {
    const [locale, setLocaleState] = useLocale();
    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        if (typeof window !== "undefined") document.documentElement.lang = newLocale;
    }, []);

    const t = (key: string) => {
        const keys = key.split(".");
        let value: any = TRANSLATIONS[locale];
        for (const k of keys) {
            if (value && typeof value === "object" && k in value) {
                value = value[k];
            } else {
                value = TRANSLATIONS[DEFAULT_LOCALE];
                for (const fallbackKey of keys) {
                    if (value && typeof value === "object" && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else return key;
                }
                break;
            }
        }
        return typeof value === "string" ? value : key;
    };
    return { t, locale, setLocale };
}
