"use client";
import Link from "next/link";

export const SearchTag = (props: { tag: string; title: string }) => (
    <Link
        href={`/?q=${props.tag}`}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 rounded bg-sky-600 px-2 py-0.5 text-white"
    >
        {props.tag}
    </Link>
);
