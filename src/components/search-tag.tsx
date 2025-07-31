"use client";
import { Button } from "@g4rcez/components/button";
import Link from "next/link";

export const SearchTag = (props: { tag: string; title: string }) => (
    <Link href={`/?q=${props.tag}`} onClick={(e) => e.stopPropagation()}>
        <Button size="small">{props.tag}</Button>
    </Link>
);
