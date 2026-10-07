import { JsonLd } from "@/components/server/json-ld";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { caseStudies, localized, portfolioCopy, portfolioPath } from "@/lib/portfolio";
import type { Locale } from "@/lib/dictionary";
import { CaseStudyGrid, MetricGrid, PortfolioPage } from "./portfolio-ui";

export function WorkPage({ lang }: { lang: Locale }) {
    const copy = portfolioCopy[lang];
    const pageCopy = copy.pages.work;
    const path = portfolioPath(lang, "work");
    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${absoluteUrl(path)}#page`,
        url: absoluteUrl(path),
        name: pageCopy.title,
        description: pageCopy.description,
        inLanguage: lang,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: caseStudies.length,
            itemListElement: caseStudies.map((study, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: absoluteUrl(portfolioPath(lang, "work", study.slug)),
                name: localized(study.title, lang),
            })),
        },
    };
    return (
        <PortfolioPage>
            <JsonLd data={collectionJsonLd} />
            <header className="max-w-3xl">
                <p className="mb-4 font-display text-sm font-medium uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
                    {pageCopy.eyebrow}
                </p>
                <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-6xl">{pageCopy.title}</h1>
                <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">{pageCopy.description}</p>
            </header>
            <section className="mt-16" aria-labelledby="work-impact-title">
                <h2 id="work-impact-title" className="sr-only">
                    {copy.impact.title}
                </h2>
                <MetricGrid metrics={copy.impact.metrics} />
            </section>
            <section className="mt-20" aria-labelledby="case-studies-title">
                <h2
                    id="case-studies-title"
                    className="mb-8 font-display text-2xl tracking-tight text-foreground sm:text-3xl"
                >
                    {copy.work.caseStudiesHeading}
                </h2>
                <CaseStudyGrid lang={lang} />
            </section>
        </PortfolioPage>
    );
}
