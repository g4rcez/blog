import type { Locales } from "the-mask-input/dist/src/types";
import { EN } from "./en-us";
import { PTBR } from "./pt-br";

const languageMap = {
    en: EN,
    ptbr: PTBR,
};

export namespace I18n {
    export const DEFAULT_LOCALE = "en";

    export type LanguageMap = Record<string, (fmt: Fmt, args?: any) => any>;
    export const getBrowserLanguages = () => window.navigator.languages;

    export const getUrlLanguage = (url: string) => url.split("/")[1];

    export class Fmt {
        public constructor(
            lang: Locales,
            public map: LanguageMap = (languageMap as any)[lang.toLowerCase().replace(/[^a-z]/, "")],
            public decimal: Intl.NumberFormat = new Intl.NumberFormat(lang, {}),
            public percentage: Intl.NumberFormat = new Intl.NumberFormat(lang, { style: "percent" }),
            public currency: Intl.NumberFormat = new Intl.NumberFormat(lang, { style: "currency", currency: "USD" }),
            public andList: Intl.ListFormat = new Intl.ListFormat(lang, { style: "long", type: "conjunction" }),
            public orList: Intl.ListFormat = new Intl.ListFormat(lang, { style: "long", type: "disjunction" }),
            public relativeTime: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat(lang, {
                style: "long",
                numeric: "always",
                localeMatcher: "best fit",
            }),
            public datetime: Intl.DateTimeFormat = new Intl.DateTimeFormat(lang, {
                hour: "numeric",
                minute: "numeric",
                day: "numeric",
                month: "short",
                year: "numeric",
            })
        ) {}

        public get<K extends keyof typeof PTBR>(key: K, args?: Parameters<(typeof PTBR)[K]>[1]) {
            return this.map[key](this, args);
        }
    }
}
