import { OpenSourcePage } from "@/components/portfolio/open-source-page";
import { portfolioCopy } from "@/lib/portfolio";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import type { Metadata } from "next";

const lang = "pt-BR" as const;
const copy = portfolioCopy[lang].pages.openSource;

export const metadata: Metadata = portfolioMetadata({
    lang,
    section: "openSource",
    title: copy.title,
    description: copy.description,
    keywords: [
        "código aberto",
        "React",
        "TypeScript",
        "produtos com IA",
        "ferramentas de desenvolvimento",
        "design de APIs",
    ],
});

export default function Page() {
    return <OpenSourcePage lang={lang} />;
}
