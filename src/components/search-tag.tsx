"use client";
import Link from "next/link";

export const SearchTag = (props: { tag: string; title: string }) => (
    <Link
        href={`/?q=${props.tag}`}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 rounded bg-primary-btn px-3 text-primary-btn-text"
    >
        {props.tag}
    </Link>
);
