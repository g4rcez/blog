import { JsonLd } from "@/components/server/json-ld";
import { localized, portfolioCopy, portfolioPath, type CaseStudy } from "@/lib/portfolio";
import { getTranslation, type Locale } from "@/lib/dictionary";
import { absoluteUrl, postPath, SITE_URL } from "@/lib/seo";
import Link from "next/link";
import { PortfolioPage } from "./portfolio-ui";

export function WorkDetailPage({ study, lang }: { study: CaseStudy; lang: Locale }) {
    const path = portfolioPath(lang, "work", study.slug);
    const title = localized(study.title, lang);
    const summary = localized(study.summary, lang);
    const metric = localized(study.metric, lang);
    const copy = portfolioCopy[lang];
    const labels = {
        work: copy.work.eyebrow,
        back: copy.work.detail.back,
        breadcrumb: copy.work.detail.breadcrumb,
    };
    const tagsLabel = getTranslation(lang).navigation.tags;
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${absoluteUrl(path)}#case-study`,
        mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
        headline: title,
        description: summary,
        url: absoluteUrl(path),
        inLanguage: lang,
        articleSection: study.company,
        keywords: study.tags.join(", "),
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
    };
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Allan Garcez",
                item: absoluteUrl(postPath(lang, ""))
            },
            { "@type": "ListItem", position: 2, name: labels.work, item: absoluteUrl(portfolioPath(lang, "work")) },
            { "@type": "ListItem", position: 3, name: title, item: absoluteUrl(path) },
        ],
    };
    return (
        <PortfolioPage>
            <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />
            <nav aria-label={labels.breadcrumb} className="mb-12 text-sm text-slate-500 dark:text-slate-400">
                <ol className="flex flex-wrap items-center gap-2">
                    <li>
                        <Link href={portfolioPath(lang, "work")} className="hover:text-foreground">
                            {labels.work}
                        </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li className="text-foreground" aria-current="page">
                        {study.company}
                    </li>
                </ol>
            </nav>
            <header className="max-w-4xl">
                <p className="mb-5 font-display text-sm font-medium uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
                    {study.company}
                </p>
                <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-6xl">{title}</h1>
                <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600 dark:text-slate-400 sm:text-2xl sm:leading-10">
                    {summary}
                </p>
                <div className="mt-9 inline-flex flex-col rounded-xl border border-slate-200 bg-white/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/40">
                    <span className="font-display text-2xl tracking-tight text-foreground">{metric.value}</span>
                    <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">{metric.label}</span>
                </div>
            </header>
            <div className="mt-16 grid gap-16 border-t border-slate-200 pt-12 dark:border-slate-800 lg:grid-cols-[minmax(0,1fr)_16rem]">
                <div className="max-w-3xl space-y-12">
                    {study.sections.map((section, index) => (
                        <section key={`${study.slug}-${index}`} aria-labelledby={`${study.slug}-section-${index + 1}`}>
                            <h2
                                id={`${study.slug}-section-${index + 1}`}
                                className="font-display text-2xl tracking-tight text-foreground sm:text-3xl"
                            >
                                {localized(section.heading, lang)}
                            </h2>
                            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">
                                {localized(section.body, lang)}
                            </p>
                        </section>
                    ))}
                </div>
                <aside className="self-start lg:sticky lg:top-28" aria-labelledby="case-study-tags">
                    <h2 id="case-study-tags" className="text-sm font-semibold text-foreground">
                        {tagsLabel}
                    </h2>
                    <ul className="mt-3 flex flex-wrap gap-2 lg:block lg:space-y-2">
                        {study.tags.map((tag) => (
                            <li
                                key={tag}
                                className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300 lg:table"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
            <Link
                href={portfolioPath(lang, "work")}
                className="mt-16 inline-flex text-sm font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-500 dark:text-sky-400 dark:decoration-sky-800 dark:hover:text-sky-300"
            >
                <span aria-hidden="true">←</span>&nbsp;{labels.back}
            </Link>
        </PortfolioPage>
    );
}
