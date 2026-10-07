"use client";
import { WebMcp } from "@/components/client/webmcp";
import { LocaleProvider } from "@/lib/i18n";
import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

type Props = {
    lang?: string;
};

// Keep the server bootstrap executable and the hydrated client copy inert.
const clientThemeScriptProps = typeof window === "undefined" ? undefined : { type: "application/json" };

export const Providers = (props: PropsWithChildren<Props>) => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem scriptProps={clientThemeScriptProps}>
        <LocaleProvider lang={props.lang}>
            <WebMcp />
            {props.children}
        </LocaleProvider>
    </ThemeProvider>
);
