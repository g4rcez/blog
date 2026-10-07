import { AboutPage } from "@/components/portfolio/about-page";
import { portfolioCopy } from "@/lib/portfolio";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import type { Metadata } from "next";

const lang = "en-US" as const;
const copy = portfolioCopy[lang].pages.about;

export const dynamic = "force-static";

export const metadata: Metadata = portfolioMetadata({
    lang,
    section: "about",
    title: copy.title,
    description: copy.description,
    keywords: [
        "Senior Software Engineer",
        "product engineering",
        "frontend architecture",
        "AI tooling",
        "technical leadership",
    ],
});

export default function Page() {
    return <AboutPage lang={lang} />;
}
