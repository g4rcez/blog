"use client";
import { WebMcp } from "@/components/client/webmcp";
import { LocaleProvider } from "@/lib/i18n";
import { PropsWithChildren } from "react";

type Props = {
    lang?: string;
};

export const Providers = (props: PropsWithChildren<Props>) => (
    <LocaleProvider lang={props.lang}>
        <WebMcp />
        {props.children}
    </LocaleProvider>
);
