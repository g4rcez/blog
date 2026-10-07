import { BlogConfig, getLocalizedContent } from "@/blog.config";
import { getTranslation, type Locale } from "./dictionary";
import { tagsBasePath } from "./seo";

const tagHref = (locale: Locale, slug: string) => `${tagsBasePath[locale]}/${slug}`;

export function getNavigation(locale: Locale) {
    return [
        {
            title: getTranslation(locale).navigation.tags,
            links: BlogConfig.topics.map((topic) => ({
                title: getLocalizedContent(topic.title, locale),
                href: tagHref(locale, topic.href),
            })),
        },
        {
            title: getTranslation(locale).navigation.agents,
            links: BlogConfig.agents.map((agent) => ({
                title: getLocalizedContent(agent.title, locale),
                href: agent.href,
            })),
        },
        {
            title: getTranslation(locale).navigation.projects,
            links: BlogConfig.projects.map((project) => ({
                title: getLocalizedContent(project.title, locale),
                href: project.href,
            })),
        },
    ];
}

