"use client";
import { Button } from "@g4rcez/components/button";
import Link from "next/link";

export const SearchTag = (props: { tag: string; title: string; basePath?: string }) => (
    <Link href={`${props.basePath ?? "/"}?q=${props.tag}`} onClick={(e) => e.stopPropagation()}>
        <Button size="tiny">{props.tag}</Button>
    </Link>
);
