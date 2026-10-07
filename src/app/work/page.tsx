import { WorkPage } from "@/components/portfolio/work-page";
import { portfolioCopy } from "@/lib/portfolio";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import type { Metadata } from "next";

const lang = "en-US" as const;
const copy = portfolioCopy[lang].pages.work;

export const dynamic = "force-static";

export const metadata: Metadata = portfolioMetadata({
    lang,
    section: "work",
    title: copy.title,
    description: copy.description,
    keywords: ["product engineering", "frontend architecture", "system design", "developer experience", "AI tooling"],
});

export default function Page() {
    return <WorkPage lang={lang} />;
}
