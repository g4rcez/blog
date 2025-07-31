import { Dates } from "@/components/client/dates";
import { Card } from "@g4rcez/components/card";
import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { SearchTag } from "./search-tag";

type Props = { title: string; description: string; href: string; tags?: string[]; readingTime: number; date: string };
const noop: string[] = [];

export const QuickLinks = (props: PropsWithChildren<{}>) => (
    <div className="not-prose my-12 grid grid-cols-1 gap-6 lg:grid-cols-2">{props.children}</div>
);

export const QuickLink = ({ title, description, tags = noop, href, date }: Props) => (
    <Card container="group relative">
        <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 duration-300 ease-in-out [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.300),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 motion-safe:transition-all dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
        <div className="relative flex h-full flex-col justify-start gap-4 overflow-hidden rounded-xl pt-4 pb-2">
            <h2 className="font-display font-medium text-lg text-foreground">
                <Link href={href}>
                    <span className="absolute -inset-px rounded-xl" />
                    {title}
                </Link>
            </h2>
            <span className="flex flex-col gap-2 text-[0.8125rem] text-foreground/80">
                <p>{description}</p>
                <p className="font-normal">
                    <Dates date={date} />
                </p>
            </span>
            <ul className="mt-auto font-medium flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <SearchTag key={`${title}-${tag}`} tag={tag} title={title} />
                ))}
            </ul>
        </div>
    </Card>
);
