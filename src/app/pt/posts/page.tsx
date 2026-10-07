import { WritingPage } from "@/components/portfolio/writing-page";
import { portfolioCopy } from "@/lib/portfolio";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import type { Metadata } from "next";

const lang = "pt-BR" as const;
const copy = portfolioCopy[lang].pages.writing;

export const metadata: Metadata = portfolioMetadata({
    lang,
    section: "writing",
    title: copy.title,
    description: copy.description,
    keywords: [
        "engenharia de produto",
        "arquitetura",
        "sistemas frontend",
        "experiência do desenvolvedor",
        "engenharia de IA",
    ],
});

export default function Page() {
    return <WritingPage lang={lang} />;
}
