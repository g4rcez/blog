"use client";
import { Icon } from "@/components/icon";
import { useSearchParams } from "next/navigation";

export const useTocLink = () => {
    const query = useSearchParams();
    return query.get("toc") === "true";
};

export const TocBulb = () => {
    const toc = useTocLink();
    return (
        <Icon
            icon="lightbulb"
            color={toc ? "amber" : "blue"}
            className="h-6 w-6 !fill-yellow-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"
        />
    );
};
