import { AboutPage } from "@/components/portfolio/about-page";
import { portfolioCopy } from "@/lib/portfolio";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import type { Metadata } from "next";

const lang = "pt-BR" as const;
const copy = portfolioCopy[lang].pages.about;

export const metadata: Metadata = portfolioMetadata({
    lang,
    section: "about",
    title: copy.title,
    description: copy.description,
    keywords: [
        "Senior Software Engineer",
        "engenharia de produto",
        "arquitetura frontend",
        "ferramentas de IA",
        "liderança técnica",
    ],
});

export default function Page() {
    return <AboutPage lang={lang} />;
}
