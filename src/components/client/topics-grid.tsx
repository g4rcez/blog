"use client";
import type { TopicSummary } from "@/components/server/topics";
import { Card } from "@g4rcez/components/card";
import { Tag } from "@g4rcez/components/tag";
import Link from "next/link";

type Props = { tags: TopicSummary[]; base: string };

const FEATURED_COUNT = 3;

export function TopicsGrid({ tags, base }: Props) {
    const featured = tags.slice(0, FEATURED_COUNT);
    const rest = tags.slice(FEATURED_COUNT);
    return (
        <>
            <ul className="not-prose grid grid-cols-1 gap-4 sm:grid-cols-3">
                {featured.map((t) => (
                    <li key={t.slug}>
                        <Card
                            as={Link}
                            href={`${base}/${t.slug}`}
                            className="group flex h-full flex-col justify-between gap-6 transition-colors hover:border-primary"
                        >
                            <span className="font-display text-4xl tracking-tight text-foreground">{t.count}</span>
                            <span className="font-medium text-primary group-hover:underline">{t.name}</span>
                        </Card>
                    </li>
                ))}
            </ul>
            <ul className="not-prose mt-8 flex flex-wrap gap-3">
                {rest.map((t) => (
                    <li key={t.slug}>
                        <Tag
                            as={Link}
                            href={`${base}/${t.slug}`}
                            size="big"
                            appearance="soft"
                            className="gap-2 transition-colors hover:border-primary"
                        >
                            <span>{t.name}</span>
                            <span className="text-secondary-foreground">{t.count}</span>
                        </Tag>
                    </li>
                ))}
            </ul>
        </>
    );
}
