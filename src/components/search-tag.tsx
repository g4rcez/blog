"use client";
import Link from "next/link";

export const SearchTag = (props: { tag: string; title: string; basePath?: string }) => (
    <Link
        href={`${props.basePath ?? "/"}?q=${encodeURIComponent(props.tag)}`}
        className="inline-flex rounded-full bg-primary-subtle px-3 py-1 text-xs font-medium text-primary-hover transition-colors hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-primary dark:text-primary"
    >
        {props.tag}
    </Link>
);
