import { WritingPage } from "@/components/portfolio/writing-page";
import { portfolioCopy } from "@/lib/portfolio";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import type { Metadata } from "next";

const lang = "en-US" as const;
const copy = portfolioCopy[lang].pages.writing;

export const dynamic = "force-static";

export const metadata: Metadata = portfolioMetadata({
    lang,
    section: "writing",
    title: copy.title,
    description: copy.description,
    keywords: ["product engineering", "architecture", "frontend systems", "developer experience", "AI engineering"],
});

export default function Page() {
    return <WritingPage lang={lang} />;
}
