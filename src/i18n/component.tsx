import React, { createContext, PropsWithChildren, useContext } from "react";
import type { Locales } from "the-mask-input/dist/src/types";
import { I18n } from "~/i18n/i18n";

const context = createContext<null | I18n.Fmt>(null);

export const I18nProvider = (props: PropsWithChildren<{ locale: Locales }>) => (
    <context.Provider value={new I18n.Fmt(props.locale)}>{props.children}</context.Provider>
);

export const useI18n = () => {
    const ctx = useContext(context);
    if (ctx === null) throw new Error("No FMT provided");
    return ctx;
};
