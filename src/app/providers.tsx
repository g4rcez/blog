"use client";
import { LocaleProvider } from "@/lib/i18n";
import { PropsWithChildren } from "react";

type Props = {
    lang?: string;
};

export const Providers = (props: PropsWithChildren<Props>) => (
    <LocaleProvider lang={props.lang}>{props.children}</LocaleProvider>
);
