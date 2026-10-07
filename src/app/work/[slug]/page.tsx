import { WorkDetailPage } from "@/components/portfolio/work-detail-page";
import { caseStudies, getCaseStudy, localized } from "@/lib/portfolio";
import { portfolioMetadata } from "@/lib/portfolio-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const lang = "en-US" as const;

export const dynamicParams = false;

export function generateStaticParams() {
    return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const study = getCaseStudy(slug);
    if (!study) return { robots: { index: false, follow: false } };
    return portfolioMetadata({
        lang,
        section: "work",
        slug: study.slug,
        title: localized(study.title, lang),
        description: localized(study.summary, lang),
        keywords: study.tags,
        type: "article",
    });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = getCaseStudy(slug);
    if (!study) notFound();
    return <WorkDetailPage study={study} lang={lang} />;
}
