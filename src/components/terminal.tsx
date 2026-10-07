"use client";
import { useTranslation } from "@/lib/i18n";
import dynamic from "next/dynamic";
import React from "react";
import styles from "./terminal.module.css";
import { getTerminalContent } from "./terminal-content";

const terminalBanner = [
    " ██████╗  █████╗ ██████╗  ██████╗███████╗███████╗   ██████╗ ███████╗██╗   ██╗",
    "██╔════╝ ██╔══██╗██╔══██╗██╔════╝██╔════╝╚══███╔╝   ██╔══██╗██╔════╝██║   ██║",
    "██║  ███╗███████║██████╔╝██║     █████╗    ███╔╝    ██║  ██║█████╗  ██║   ██║",
    "██║   ██║██╔══██╗██╔══██╗██║     ██╔══╝   ███╔╝     ██║  ██║██╔══╝  ╚██╗ ██╔╝",
    "╚██████╔╝██║  ██║██║  ██║╚██████╗███████╗███████╗██╗██████╔╝███████╗ ╚████╔╝",
    " ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚══════╝╚═╝╚═════╝ ╚══════╝  ╚═══╝",
].join("\n");

function TerminalLoading() {
    const { locale } = useTranslation();
    const copy = getTerminalContent(locale);
    return (
        <p className={styles.fallback} role="status">
            {copy.loading}
        </p>
    );
}

const TerminalSandbox = dynamic(() => import("./terminal-sandbox").then((module) => module.TerminalSandbox), {
    ssr: false,
    loading: TerminalLoading,
});

class TerminalBoundary extends React.Component<
    {
        children: React.ReactNode;
        messages: Pick<ReturnType<typeof getTerminalContent>, "startupError" | "reload">;
    },
    { failed: boolean }
> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    render() {
        if (this.state.failed) {
            return (
                <div className={styles.fallback} role="alert">
                    <p>{this.props.messages.startupError}</p>
                    <button className={styles.retry} type="button" onClick={() => window.location.reload()}>
                        {this.props.messages.reload}
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export function Terminal() {
    const { locale } = useTranslation();
    const copy = getTerminalContent(locale);
    return (
        <div>
            <section className={styles.frame} aria-label={copy.label}>
                <pre className={styles.banner} role="img" aria-label={copy.bannerLabel}>
                    {terminalBanner}
                </pre>
                <TerminalBoundary key={locale} messages={copy}>
                    <TerminalSandbox key={locale} />
                </TerminalBoundary>
            </section>
            <p className={styles.hint}>{copy.hint}</p>
        </div>
    );
}
