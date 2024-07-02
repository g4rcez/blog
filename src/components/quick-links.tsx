import Link from "next/link";
import React, { PropsWithChildren } from "react";

export function QuickLinks({ children }: PropsWithChildren<{}>) {
    return <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">{children}</div>;
}

type Props = { title: string; description: string; href: string; tags?: string[] };

const noop: string[] = [];

export function QuickLink({ title, description, tags = noop, href }: Props) {
    return (
        <div className="group relative rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 duration-300 ease-in-out [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.300),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 motion-safe:transition-all dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
            <div className="relative overflow-hidden rounded-xl p-6">
                <h2 className="font-display text-base text-slate-900 dark:text-white">
                    <Link href={href}>
                        <span className="absolute -inset-px rounded-xl" />
                        {title}
                    </Link>
                </h2>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">{description}</p>
                <ul className="mt-4 flex gap-2 text-sm flex-wrap">
                    {tags.map((tag) => (
                        <li key={`${title}-${tag}`} className="text-white rounded bg-sky-600 px-2 py-0.5">
                            {tag}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
