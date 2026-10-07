import { WorkPage } from "@/components/portfolio/work-page";
import { portfolioCopy } from "@/lib/portfolio";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import type { Metadata } from "next";

const lang = "pt-BR" as const;
const copy = portfolioCopy[lang].pages.work;

export const metadata: Metadata = portfolioMetadata({
    lang,
    section: "work",
    title: copy.title,
    description: copy.description,
    keywords: [
        "engenharia de produto",
        "arquitetura frontend",
        "design de sistemas",
        "developer experience",
        "ferramentas de IA",
    ],
});

export default function Page() {
    return <WorkPage lang={lang} />;
}
