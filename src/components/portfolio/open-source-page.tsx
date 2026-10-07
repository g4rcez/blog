import { JsonLd } from "@/components/server/json-ld";
import { portfolioCopy, portfolioPath, projects } from "@/lib/portfolio";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import type { Locale } from "@/lib/dictionary";
import { PortfolioPage, ProjectGrid } from "./portfolio-ui";

export function OpenSourcePage({ lang }: { lang: Locale }) {
    const copy = portfolioCopy[lang];
    const pageCopy = copy.pages.openSource;
    const path = portfolioPath(lang, "openSource");
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
            numberOfItems: projects.length,
            itemListElement: projects.map((project, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: project.name,
                url: project.links[0]?.href.startsWith("http")
                    ? project.links[0].href
                    : absoluteUrl(project.links[0]?.href ?? path),
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
            <p className="mt-12 max-w-2xl border-l-2 border-sky-400 pl-5 text-lg leading-8 text-foreground">
                {copy.about.openSource}
            </p>
            <section className="mt-16" aria-labelledby="projects-title">
                <h2
                    id="projects-title"
                    className="mb-8 font-display text-2xl tracking-tight text-foreground sm:text-3xl"
                >
                    {copy.openSource.projectsHeading}
                </h2>
                <ProjectGrid projects={projects} lang={lang} />
            </section>
        </PortfolioPage>
    );
}
