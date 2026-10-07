import { BlogConfig } from "@/blog.config";
import { JsonLd } from "@/components/server/json-ld";
import { portfolioCopy, portfolioPath } from "@/lib/portfolio";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import type { Locale } from "@/lib/dictionary";
import Link from "next/link";
import { PortfolioPage } from "./portfolio-ui";

export function AboutPage({ lang }: { lang: Locale }) {
    const copy = portfolioCopy[lang];
    const pageCopy = copy.pages.about;
    const path = portfolioPath(lang, "about");
    const profileJsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${absoluteUrl(path)}#page`,
        url: absoluteUrl(path),
        name: pageCopy.title,
        description: pageCopy.description,
        inLanguage: lang,
        mainEntity: { "@id": `${SITE_URL}/#person` },
    };
    const labels = copy.about.labels;
    return (
        <PortfolioPage>
            <JsonLd data={profileJsonLd} />
            <header id="name" className="max-w-4xl scroll-mt-24">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-primary-hover dark:text-primary">
                    {BlogConfig.domain}(1) · {labels.manual}
                </p>
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-secondary-foreground">
                    <span className="font-semibold text-primary-hover dark:text-primary">{labels.name}</span>
                    <span aria-hidden="true"> / </span>
                    {pageCopy.eyebrow}
                </p>
                <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-6xl">{pageCopy.title}</h1>
            </header>

            <nav aria-label={labels.synopsis} className="mt-10 max-w-4xl border-y border-border py-5">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-secondary-foreground">
                    {labels.synopsis}
                </p>
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                    {[
                        { href: "#description", flag: "--description", label: labels.description },
                        { href: "#practice", flag: "--practice", label: labels.practice },
                        { href: "#history", flag: "--history", label: labels.history },
                        { href: "#see-also", flag: "--see-also", label: labels.seeAlso },
                    ].map((item) => (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                aria-label={item.label}
                                className="font-mono text-sm text-primary-hover underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary dark:text-primary"
                            >
                                {item.flag}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <section id="description" className="mt-14 max-w-4xl scroll-mt-24" aria-labelledby="description-title">
                <h2
                    id="description-title"
                    className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-secondary-foreground"
                >
                    {labels.description}
                </h2>
                <p className="mt-6 max-w-3xl border-l-2 border-primary pl-5 text-xl leading-9 text-foreground sm:text-2xl sm:leading-10">
                    {copy.about.statement}
                </p>
                <p className="mt-6 max-w-3xl text-base leading-7 text-secondary-foreground">{copy.about.intro}</p>
            </section>

            <section
                id="practice"
                className="mt-20 grid scroll-mt-24 gap-12 border-t border-border pt-12 lg:grid-cols-[0.8fr_1.2fr]"
                aria-labelledby="strengths-title"
            >
                <div>
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-secondary-foreground">
                        {labels.practice}
                    </p>
                    <h2 id="strengths-title" className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">
                        {copy.about.strengthsTitle}
                    </h2>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                    {copy.about.strengths.map((strength) => (
                        <li
                            key={strength}
                            className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm leading-6 text-foreground"
                        >
                            {strength}
                        </li>
                    ))}
                </ul>
            </section>

            <section
                id="history"
                className="mt-20 scroll-mt-24 border-t border-border pt-12"
                aria-labelledby="experience-title"
            >
                <div className="max-w-3xl">
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-secondary-foreground">
                        {labels.history}
                    </p>
                    <h2
                        id="experience-title"
                        className="font-display text-2xl tracking-tight text-foreground sm:text-3xl"
                    >
                        {copy.about.experienceTitle}
                    </h2>
                    <div className="mt-10 space-y-10">
                        {copy.about.experience.map((item) => (
                            <article key={item.title} className="border-l border-border pl-5">
                                <h3 className="font-display text-xl tracking-tight text-foreground">{item.title}</h3>
                                <p className="mt-3 text-base leading-7 text-secondary-foreground">{item.body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="see-also"
                className="mt-20 scroll-mt-24 flex flex-col gap-5 border-t border-border pt-12 sm:flex-row sm:items-center sm:justify-between"
                aria-labelledby="see-also-title"
            >
                <div className="max-w-2xl">
                    <h2
                        id="see-also-title"
                        className="font-mono text-sm font-medium uppercase tracking-[0.12em] text-secondary-foreground"
                    >
                        {labels.seeAlso}
                    </h2>
                    <p className="mt-4 text-base leading-7 text-secondary-foreground">{copy.about.openSource}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-4">
                    <Link
                        href={portfolioPath(lang, "work")}
                        className="text-sm font-semibold text-primary-hover underline decoration-primary underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-primary"
                    >
                        {labels.work} <span aria-hidden="true">→</span>
                    </Link>
                    <Link
                        href={portfolioPath(lang, "writing")}
                        className="text-sm font-semibold text-primary-hover underline decoration-primary underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-primary"
                    >
                        {copy.hero.actions.writing} <span aria-hidden="true">→</span>
                    </Link>
                    <Link
                        href={portfolioPath(lang, "openSource")}
                        className="text-sm font-semibold text-primary-hover underline decoration-primary underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-primary"
                    >
                        {labels.openSource} <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </section>
        </PortfolioPage>
    );
}
