"use client";

import { Terminal } from "@/components/terminal";
import { useTranslation } from "@/lib/i18n";
import { ComponentsProvider } from "@g4rcez/components";
import { Modal } from "@g4rcez/components/modal";
import { useState, type ComponentPropsWithoutRef } from "react";

const TerminalIcon = (props: ComponentPropsWithoutRef<"svg">) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 7 5 5-5 5M12 17h7" />
    </svg>
);

const iconButtonClassName =
    "flex h-10 w-10 items-center justify-center rounded-lg border border-border text-primary focus-visible:outline-2 focus-visible:outline-primary";

export function TerminalModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { t, locale } = useTranslation();

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={iconButtonClassName}
                aria-label={t("terminal.open")}
                title={t("terminal.open")}
            >
                <TerminalIcon className="h-5 w-5" />
            </button>
            <ComponentsProvider locale={locale}>
                <Modal
                    open={isOpen}
                    onChange={setIsOpen}
                    title={t("terminal.modalTitle")}
                    type="dialog"
                    overlayClickClose
                    className="w-full max-w-5xl"
                >
                    <Terminal />
                </Modal>
            </ComponentsProvider>
        </>
    );
}
