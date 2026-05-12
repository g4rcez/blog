"use client";
import { navigation } from "@/lib/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCallback, useState } from "react";
import { SearchTag } from "@/components/search-tag";
import { Button } from "@g4rcez/components";

type Props = { title: string; description: string; tags?: string[]; name?: string; source?: string; type?: string };

export function DocsHeader({ title, description, tags, name, source, type }: Props) {
    const pathname = usePathname();
    const basePath = pathname.startsWith("/pt") ? "/pt" : "/";
    const [copied, setCopied] = useState(false);
    const section = navigation.find((section) => section.links.find((link) => link.href === pathname));

    const copyRaw = useCallback(async () => {
        const text = await fetch(`${pathname}/raw`).then((r) => r.text());
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [pathname]);

    if (!title && !section) {
        return null;
    }
    return (
        <header className="mb-9 space-y-4">
            {section && <p className="font-display text-sm font-medium">{section.title}</p>}
            <div className="flex items-start justify-between gap-4">
                {title && <h1 className="font-display text-3xl tracking-tight text-foreground">{title}</h1>}
                {type === "agent" && (
                    <Button size="tiny" onClick={copyRaw} theme="ghost-primary" aria-label="Copy raw file to clipboard">
                        {copied ? "Copied!" : "Copy raw file"}
                    </Button>
                )}
            </div>
            {(name || source) && (
                <dl className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-sm text-secondary-foreground">
                    {name && (
                        <>
                            <dt className="font-medium">Name</dt>
                            <dd>{name}</dd>
                        </>
                    )}
                    {source && (
                        <>
                            <dt className="font-medium">Source</dt>
                            <dd>
                                <Link href={source} className="underline underline-offset-2 hover:text-foreground">
                                    {source}
                                </Link>
                            </dd>
                        </>
                    )}
                </dl>
            )}
            {description && <p className="font-display text-secondary-foreground">{description}</p>}
            {tags && tags.length > 0 && (
                <ul className="flex list-none flex-wrap gap-2 pt-1">
                    {tags.map((tag) => (
                        <li key={tag}>
                            <SearchTag tag={tag} title={title} basePath={basePath} />
                        </li>
                    ))}
                </ul>
            )}
        </header>
    );
}
