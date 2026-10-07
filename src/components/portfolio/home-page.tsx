import { BlogConfig } from "@/blog.config";
import { Posts } from "@/components/server/list-posts";
import { getPosts } from "@/components/server/posts";
import { localized, portfolioCopy, portfolioPath, projects, type Project } from "@/lib/portfolio";
import type { Locale } from "@/lib/dictionary";
import { Button } from "@/components/button";
import Link from "next/link";
import { CaseStudyGrid, MetricGrid, ProjectLink, SectionHeading, WritingGrid } from "./portfolio-ui";

type HomePageProps = {
    lang: Locale;
    search?: string;
};

const compactProjectLinks = (project: Project) => project.links.slice(0, 1);

function ProjectPreview({ project, lang }: { project: Project; lang: Locale }) {
    return (
        <li className="rounded-2xl border border-slate-200 bg-white/60 p-5 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl tracking-tight text-foreground">{project.name}</h3>
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {portfolioCopy[lang].projects.openSource}
                </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {localized(project.description, lang)}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={portfolioCopy[lang].projects.technologies}>
                {project.technologies.slice(0, 5).map((technology) => (
                    <li key={technology}>
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {technology}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {compactProjectLinks(project).map((link) => (
                    <ProjectLink key={link.href} link={link} />
                ))}
            </div>
        </li>
    );
}

export function HomePage({ lang, search = "" }: HomePageProps) {
    const copy = portfolioCopy[lang];
    const posts = getPosts(lang);
    const searchValue = search.trim();

    return (
        <div className="w-full overflow-hidden">
            <section className="border-b border-slate-200/80 dark:border-slate-800" aria-labelledby="hero-title">
                <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28 lg:px-12 lg:pb-24">
                    <div className="max-w-5xl">
                        <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
                            <span className="h-px w-10 bg-sky-500" aria-hidden="true" />
                            {copy.hero.focus}
                        </p>
                        <h1
                            id="hero-title"
                            className="font-display text-5xl tracking-[-0.04em] text-foreground sm:text-7xl lg:text-8xl"
                        >
                            <span className="block">{BlogConfig.user.name}</span>
                            <span className="mt-4 block text-2xl tracking-tight text-slate-500 dark:text-slate-400 sm:text-4xl">
                                {copy.hero.role}
                            </span>
                        </h1>
                        <p className="mt-10 max-w-3xl text-xl leading-9 tracking-tight text-foreground sm:text-2xl sm:leading-10">
                            {copy.hero.statement}
                        </p>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
                            {copy.hero.supporting}
                        </p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <Button href={portfolioPath(lang, "work")}>{copy.hero.actions.work}</Button>
                            <Button href={portfolioPath(lang, "writing")} variant="secondary">
                                {copy.hero.actions.writing}
                            </Button>
                            <Button
                                href={BlogConfig.github}
                                variant="secondary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {copy.hero.actions.github} <span aria-hidden="true">↗</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="impact"
                className="border-b border-slate-200/80 dark:border-slate-800"
                aria-labelledby="impact-title"
            >
                <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
                        {copy.impact.eyebrow}
                    </p>
                    <h2 id="impact-title" className="sr-only">
                        {copy.impact.title}
                    </h2>
                    <MetricGrid metrics={copy.impact.metrics} />
                </div>
            </section>

            <section
                id="work"
                className="border-b border-slate-200/80 dark:border-slate-800"
                aria-labelledby="work-title"
            >
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
                    <SectionHeading
                        id="work-title"
                        eyebrow={copy.work.eyebrow}
                        title={copy.work.title}
                        description={copy.work.description}
                        action={{ href: portfolioPath(lang, "work"), label: copy.work.viewAll }}
                    />
                    <CaseStudyGrid lang={lang} />
                </div>
            </section>

            <section
                id="writing"
                className="border-b border-slate-200/80 dark:border-slate-800"
                aria-labelledby="writing-title"
            >
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
                    <SectionHeading
                        id="writing-title"
                        eyebrow={copy.writing.eyebrow}
                        title={copy.writing.title}
                        description={copy.writing.description}
                        action={{ href: portfolioPath(lang, "writing"), label: copy.writing.viewAll }}
                    />
                    <p className="mb-5 text-sm font-medium text-slate-500 dark:text-slate-400">{copy.writing.recent}</p>
                    <WritingGrid posts={posts.slice(0, 4)} lang={lang} />
                    {searchValue && (
                        <section
                            className="mt-20 border-t border-slate-200 pt-12 dark:border-slate-800"
                            aria-labelledby="search-title"
                        >
                            <SectionHeading
                                id="search-title"
                                eyebrow={copy.writing.searchResults}
                                title={`“${searchValue}”`}
                            />
                            <Posts posts={posts} lang={lang} search={searchValue} />
                        </section>
                    )}
                </div>
            </section>

            <section
                id="open-source"
                className="border-b border-slate-200/80 dark:border-slate-800"
                aria-labelledby="open-source-title"
            >
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
                    <SectionHeading
                        id="open-source-title"
                        eyebrow={copy.openSource.eyebrow}
                        title={copy.openSource.title}
                        description={copy.openSource.description}
                        action={{ href: portfolioPath(lang, "openSource"), label: copy.openSource.viewAll }}
                    />
                    <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {projects.slice(0, 3).map((project) => (
                            <ProjectPreview key={project.slug} project={project} lang={lang} />
                        ))}
                    </ul>
                </div>
            </section>

            <section
                className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
                aria-labelledby="about-cta-title"
            >
                <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
                        {copy.about.eyebrow}
                    </p>
                    <h2
                        id="about-cta-title"
                        className="mt-4 font-display text-3xl tracking-tight text-foreground sm:text-4xl"
                    >
                        {copy.about.title}
                    </h2>
                    <Link
                        href={portfolioPath(lang, "about")}
                        className="mt-6 inline-flex text-sm font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-500 dark:text-sky-400 dark:decoration-sky-800 dark:hover:text-sky-300"
                    >
                        {copy.about.learnMore}{" "}
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
