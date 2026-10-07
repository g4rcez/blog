"use client";
import { useTranslation } from "@/lib/i18n";
import { type Section, type Subsection } from "@/lib/sections";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";

const margin = { 0: "0", 1: "0", 2: "1", 3: "2", 4: "3", 5: "4", 6: "5" };

export const TableOfContents = ({ tableOfContents }: { tableOfContents: Array<Section> }) => {
    const { t } = useTranslation();
    const [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id);
    const getHeadings = useCallback(
        (tableOfContents: Array<Section>) =>
            tableOfContents
                .flatMap((node) => [node.id, ...node.children.map((child) => child.id)])
                .map((id) => {
                    const el = document.getElementById(id);
                    if (!el) return null;
                    const style = window.getComputedStyle(el);
                    const scrollMt = parseFloat(style.scrollMarginTop);
                    const top = window.scrollY + el.getBoundingClientRect().top - scrollMt;
                    return { id, top };
                })
                .filter((x): x is { id: string; top: number } => x !== null),
        [],
    );

    useEffect(() => {
        if (tableOfContents.length === 0) return;
        const headings = getHeadings(tableOfContents);
        function onScroll() {
            const top = window.scrollY;
            let current = headings[0].id;
            for (const heading of headings) {
                if (top >= heading.top - 10) current = heading.id;
                else break;
            }
            setCurrentSection(current);
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, [getHeadings, tableOfContents]);

    const isActive = (section: Section | Subsection) => {
        if (section.id === currentSection) return true;
        if (!section.children) return false;
        return section.children.findIndex(isActive) > -1;
    };

    const items = (
        <nav aria-label={t("blog.tableOfContents")} className="w-full">
            {tableOfContents.length > 0 && (
                <>
                    <h2 className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-secondary-foreground">
                        {t("blog.tableOfContents")}
                    </h2>
                    <ol className="mt-4 space-y-2 text-sm">
                        {tableOfContents.map((section) => (
                            <li key={section.id} style={{ marginLeft: `${margin[section.level]}rem` }}>
                                <h3>
                                    <Link
                                        href={`#${section.id}`}
                                        aria-current={section.id === currentSection ? "location" : undefined}
                                        className={clsx(
                                            "block rounded-sm py-0.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                                            isActive(section)
                                                ? "font-medium text-primary-hover dark:text-primary"
                                                : "font-normal text-secondary-foreground hover:text-foreground",
                                        )}
                                    >
                                        {section.title}
                                    </Link>
                                </h3>
                                {section.children.length > 0 && (
                                    <ol className="mt-1 space-y-1.5 pl-3 text-secondary-foreground">
                                        {section.children.map((subSection) => (
                                            <li key={subSection.id}>
                                                <Link
                                                    href={`#${subSection.id}`}
                                                    aria-current={subSection.id === currentSection ? "location" : undefined}
                                                    className={clsx(
                                                        "block rounded-sm py-0.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                                                        isActive(subSection)
                                                            ? "font-medium text-primary-hover dark:text-primary"
                                                            : "hover:text-foreground",
                                                    )}
                                                >
                                                    {subSection.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </li>
                        ))}
                    </ol>
                </>
            )}
        </nav>
    );

    if (tableOfContents.length === 0) return null;

    return (
        <Fragment>
            <details className="mb-8 border-y border-border py-3 text-sm text-foreground xl:hidden">
                <summary className="min-h-11 cursor-pointer py-3 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    {t("blog.tableOfContents")}
                </summary>
                <div className="pb-2 pt-1">{items}</div>
            </details>
            <div className="hidden xl:sticky xl:col-start-3 xl:row-start-1 xl:top-24 xl:block xl:h-[calc(100vh-6rem)] xl:w-60 xl:flex-none xl:justify-self-end xl:overflow-y-auto xl:border-border xl:py-2 xl:pl-6">
                {items}
            </div>
        </Fragment>
    );
};
