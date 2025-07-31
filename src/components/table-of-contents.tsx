"use client";
import { useTocLink } from "@/hooks/use-toc-link";
import { type Section, type Subsection } from "@/lib/sections";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";

const margin = { 0: "0", 1: "0", 2: "1", 3: "2", 4: "3", 5: "4", 6: "5" };

export const TableOfContents = ({ tableOfContents }: { tableOfContents: Array<Section> }) => {
    const showToc = useTocLink();
    const [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id);
    const getHeadings = useCallback(
        (tableOfContents: Array<Section>) =>
            tableOfContents
                .flatMap((node) => [node.id, ...node.children.map((child) => child.id)])
                .map((id) => {
                    let el = document.getElementById(id);
                    if (!el) return null;
                    let style = window.getComputedStyle(el);
                    let scrollMt = parseFloat(style.scrollMarginTop);
                    let top = window.scrollY + el.getBoundingClientRect().top - scrollMt;
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
        <nav aria-labelledby="on-this-page-title" className="w-60 whitespace-nowrap">
            {tableOfContents.length > 0 && (
                <>
                    <h2
                        id="on-this-page-title"
                        className="text-sm font-medium dark:text-white font-display text-slate-900"
                    >
                        Sumário
                    </h2>
                    <ol role="list" className="mt-4 space-y-3 text-sm">
                        {tableOfContents.map((section) => (
                            <li key={section.id} style={{ marginLeft: `${margin[section.level]}rem` }}>
                                <h3>
                                    <Link
                                        href={`#${section.id}`}
                                        className={clsx(
                                            isActive(section)
                                                ? "text-sky-500"
                                                : "font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300",
                                        )}
                                    >
                                        {section.title}
                                    </Link>
                                </h3>
                                {section.children.length > 0 && (
                                    <ol role="list" className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
                                        {section.children.map((subSection) => (
                                            <li key={subSection.id}>
                                                <Link
                                                    href={`#${subSection.id}`}
                                                    className={
                                                        isActive(subSection)
                                                            ? "text-sky-500"
                                                            : "hover:text-slate-600 dark:hover:text-slate-300"
                                                    }
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

    return (
        <Fragment>
            {showToc ? (
                <div className="fixed right-0 top-16 isolate block rounded p-8 backdrop-blur xl:hidden dark:bg-slate-900/95 [@supports(backdrop-filter:blur(0))]:bg-slate-50/75 dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75">
                    <div className="relative">{items}</div>
                </div>
            ) : null}
            <div className="hidden xl:block xl:overflow-y-auto xl:sticky xl:flex-none xl:py-16 xl:pr-6 xl:-mr-6 xl:top-[4.75rem] xl:h-[calc(100vh-4.75rem)]">
                {items}
            </div>
        </Fragment>
    );
};
