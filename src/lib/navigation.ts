import { BlogConfig, getLocalizedContent } from "@/blog.config";
import { Locale } from "./dictionary";

export function getNavigation(locale: Locale) {
    return [
        {
            title: locale === "pt-BR" ? "Tópicos" : "Topics",
            links: BlogConfig.topics.map((topic) => ({
                title: getLocalizedContent(topic.title, locale),
                href: topic.href,
            })),
        },
        {
            title: locale === "pt-BR" ? "Agentes" : "Agents",
            links: BlogConfig.agents.map((agent) => ({
                title: getLocalizedContent(agent.title, locale),
                href: agent.href,
            })),
        },
        {
            title: locale === "pt-BR" ? "Projetos" : "Projects",
            links: BlogConfig.projects.map((project) => ({
                title: getLocalizedContent(project.title, locale),
                href: project.href,
            })),
        },
    ];
}

// Keep the old export for backward compatibility (will be updated in components)
export const navigation = [
    { title: "Topics", links: BlogConfig.topics.map((topic) => ({ title: topic.title["en-US"], href: topic.href })) },
    { title: "Agents", links: BlogConfig.agents.map((agent) => ({ title: agent.title["en-US"], href: agent.href })) },
    {
        title: "Projects",
        links: BlogConfig.projects.map((project) => ({ title: project.title["en-US"], href: project.href })),
    },
];
