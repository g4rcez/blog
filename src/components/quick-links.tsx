import { Dates } from "@/components/client/dates";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

type Props = { title: string; description: string; href: string; tags?: string[]; readingTime: number; date: string };
const noop: string[] = [];

export const QuickLinks = (props: PropsWithChildren<{}>) => (
    <div className="not-prose my-12 grid grid-cols-1 gap-6 lg:grid-cols-2">{props.children}</div>
);
export const QuickLink = ({ title, description, tags = noop, href, date }: Props) => (
    <div className="group relative rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 duration-300 ease-in-out [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.300),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 motion-safe:transition-all dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
        <div className="relative flex h-full flex-col justify-start gap-4 overflow-hidden rounded-xl p-6">
            <h2 className="font-display text-base text-slate-900 dark:text-white">
                <Link href={href}>
                    <span className="absolute -inset-px rounded-xl" />
                    {title}
                </Link>
            </h2>
            <span className="flex flex-col gap-2">
                <p className="text-sm text-slate-700 dark:text-slate-200">{description}</p>
                <p className="text-sm font-normal text-slate-700 dark:text-slate-400">
                    <Dates date={date} />
                </p>
            </span>
            <ul className="mt-auto flex flex-wrap gap-2 text-sm">
                {tags.map((tag) => (
                    <li key={`${title}-${tag}`} className="rounded bg-sky-600 px-2 py-0.5 text-white">
                        {tag}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);
