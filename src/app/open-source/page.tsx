import { OpenSourcePage } from "@/components/portfolio/open-source-page";
import { portfolioCopy } from "@/lib/portfolio";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import type { Metadata } from "next";

const lang = "en-US" as const;
const copy = portfolioCopy[lang].pages.openSource;

export const dynamic = "force-static";

export const metadata: Metadata = portfolioMetadata({
    lang,
    section: "openSource",
    title: copy.title,
    description: copy.description,
    keywords: ["open source", "React", "TypeScript", "AI products", "developer tooling", "API design"],
});

export default function Page() {
    return <OpenSourcePage lang={lang} />;
}
