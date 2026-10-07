"use client";
import { Dates } from "@/components/client/dates";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { SearchTag } from "./search-tag";

export type QuickLinksLayout = "list" | "grid";

type Props = {
    title: string;
    description: string;
    href: string;
    tags?: string[];
    readingTime: number;
    date: string;
    layout?: QuickLinksLayout;
};
const noop: string[] = [];

export const QuickLinks = ({ children, layout = "list" }: PropsWithChildren<{ layout?: QuickLinksLayout }>) => (
    <div
        className={
            layout === "grid"
                ? "not-prose grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 [&>*:nth-child(1)]:border-t-0 sm:[&>*:nth-child(2)]:border-t-0 lg:[&>*:nth-child(3)]:border-t-0"
                : "not-prose divide-border divide-y"
        }
    >
        {children}
    </div>
);

export const QuickLink = ({ title, description, tags = noop, href, date, layout = "list" }: Props) => (
    <article
        className={
            layout === "grid"
                ? "group border-border min-w-0 border-t pt-5"
                : "group grid gap-3 py-7 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8"
        }
    >
        <p
            className={
                layout === "grid"
                    ? "text-secondary-foreground text-xs tabular-nums"
                    : "text-secondary-foreground pt-1 text-sm tabular-nums"
            }
        >
            <Dates date={date} />
        </p>
        <div className="min-w-0">
            <Link
                href={href}
                className="decoration-primary hover:text-primary-hover focus-visible:outline-primary dark:hover:text-primary block underline-offset-4 transition-colors hover:underline focus-visible:outline-2"
            >
                <h3
                    className={
                        layout === "grid"
                            ? "font-display text-foreground mt-3 text-xl leading-snug font-medium"
                            : "font-display text-foreground text-xl leading-snug font-medium sm:text-2xl"
                    }
                >
                    {title}
                </h3>
                <p className="text-secondary-foreground mt-2 max-w-2xl text-sm leading-6">{description}</p>
            </Link>
            {tags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
                    {tags.map((tag) => (
                        <li key={`${title}-${tag}`}>
                            <SearchTag tag={tag} title={title} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </article>
);
