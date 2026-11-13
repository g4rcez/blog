import type { SimplePost } from "@/components/server/posts";
import { caseStudies, localized, portfolioCopy, portfolioPath, type CaseStudy, type Project } from "@/lib/portfolio";
import { getTranslation, type Locale } from "@/lib/dictionary";
import { postPath } from "@/lib/seo";
import Link from "next/link";
import type { ReactNode } from "react";

type SectionAction = { href: string; label: string };

type SectionHeadingProps = {
    id?: string;
    eyebrow: string;
    title: string;
    description?: string;
    action?: SectionAction;
};

export function PortfolioPage({ children }: { children: ReactNode }) {
    return <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">{children}</div>;
}

export function SectionHeading({ id, eyebrow, title, description, action }: SectionHeadingProps) {
    return (
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
                <p className="mb-3 font-display text-sm font-medium uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
                    {eyebrow}
                </p>
                <h2 id={id} className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
                    {title}
                </h2>
                {description && (
                    <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <Link
                    href={action.href}
                    className="shrink-0 text-sm font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-500 dark:text-sky-400 dark:decoration-sky-800 dark:hover:text-sky-300"
                >
                    {action.label} <span aria-hidden="true">→</span>
                </Link>
            )}
        </div>
    );
}

export function MetricGrid({ metrics }: { metrics: Array<{ value: string; label: string }> }) {
    return (
        <ul className="grid grid-cols-1 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/60 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950/40 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {metrics.map((metric) => (
                <li key={metric.label} className="min-w-0 p-5 sm:p-6">
                    <p className="font-display text-2xl tracking-tight text-foreground [overflow-wrap:anywhere]">
                        {metric.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{metric.label}</p>
                </li>
            ))}
        </ul>
    );
}

const cardClassName =
    "relative rounded-2xl border border-slate-200 bg-white/60 p-6 transition-colors hover:border-sky-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-sky-800 dark:hover:bg-slate-900/70";

export function CaseStudyCard({ study, lang }: { study: CaseStudy; lang: Locale }) {
    const copy = localized(study.title, lang);
    const metric = localized(study.metric, lang);
    const tagsLabel = getTranslation(lang).navigation.tags;
    return (
        <li>
            <article className={`${cardClassName} group flex h-full flex-col`}>
                <div className="flex items-start justify-between gap-4 text-sm">
                    <p className="font-medium text-sky-700 dark:text-sky-400">{study.company}</p>
                    <p className="text-right text-slate-500 dark:text-slate-400">
                        <span className="block font-display text-base text-foreground">{metric.value}</span>
                        <span>{metric.label}</span>
                    </p>
                </div>
                <h3 className="mt-8 font-display text-xl tracking-tight text-foreground sm:text-2xl">
                    <Link
                        href={portfolioPath(lang, "work", study.slug)}
                        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                    >
                        <span className="absolute inset-0 rounded-2xl" aria-hidden="true" />
                        {copy}
                    </Link>
                </h3>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {localized(study.summary, lang)}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={tagsLabel}>
                    {study.tags.map((tag) => (
                        <li key={tag}>
                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {tag}
                            </span>
                        </li>
                    ))}
                </ul>
            </article>
        </li>
    );
}

export function CaseStudyGrid({ lang }: { lang: Locale }) {
    return (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {caseStudies.map((study) => (
                <CaseStudyCard key={study.slug} study={study} lang={lang} />
            ))}
        </ul>
    );
}

const formatDate = (date: string, lang: Locale) =>
    new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));

export function WritingCard({ post, lang }: { post: SimplePost; lang: Locale }) {
    return (
        <li className="grid gap-3 border-b border-border py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
            <p className="pt-1 text-sm tabular-nums text-secondary-foreground">
                {formatDate(post.date, lang)}
            </p>
            <article className="min-w-0">
                <h3 className="font-display text-xl font-medium tracking-tight text-foreground">
                    <Link
                        href={postPath(lang, post.href)}
                        className="decoration-primary underline-offset-4 hover:text-primary-hover hover:underline focus-visible:outline-2 focus-visible:outline-primary dark:hover:text-primary"
                    >
                        {post.info.title}
                    </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-secondary-foreground">{post.info.description}</p>
            </article>
        </li>
    );
}

export function WritingGrid({ posts, lang }: { posts: SimplePost[]; lang: Locale }) {
    return (
        <ul className="border-t border-border">
            {posts.map((post) => (
                <WritingCard key={post.href} post={post} lang={lang} />
            ))}
        </ul>
    );
}

export const ProjectLink = ({ link }: { link: Project["links"][number] }) => {
    const isExternal = link.href.startsWith("http");
    const className =
        "text-sm font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-500 dark:text-sky-400 dark:decoration-sky-800 dark:hover:text-sky-300";
    return isExternal ? (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
            {link.label} <span aria-hidden="true">↗</span>
        </a>
    ) : (
        <Link href={link.href} className={className}>
            {link.label} <span aria-hidden="true">→</span>
        </Link>
    );
};

export function ProjectCard({ project, lang }: { project: Project; lang: Locale }) {
    const labels = portfolioCopy[lang].projects;
    return (
        <li>
            <article id={`project-${project.slug}`} className={`${cardClassName} flex h-full flex-col`}>
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl tracking-tight text-foreground">{project.name}</h3>
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        {labels.openSource}
                    </span>
                </div>
                <p className="mt-3 text-base font-medium leading-6 text-foreground">
                    {localized(project.description, lang)}
                </p>
                <dl className="mt-6 space-y-4 text-sm leading-6">
                    <div>
                        <dt className="font-semibold text-foreground">{labels.problem}</dt>
                        <dd className="text-slate-600 dark:text-slate-400">{localized(project.problem, lang)}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold text-foreground">{labels.demonstrates}</dt>
                        <dd className="text-slate-600 dark:text-slate-400">{localized(project.demonstrates, lang)}</dd>
                    </div>
                </dl>
                <ul
                    className="mt-6 flex flex-wrap gap-2"
                    aria-label={labels.technologies}
                >
                    {project.technologies.map((technology) => (
                        <li key={technology}>
                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {technology}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-7">
                    {project.links.map((link) => (
                        <ProjectLink key={link.href} link={link} />
                    ))}
                </div>
            </article>
        </li>
    );
}

export function ProjectGrid({ projects, lang }: { projects: Project[]; lang: Locale }) {
    return (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} lang={lang} />
            ))}
        </ul>
    );
}
