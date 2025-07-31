import { BlogConfig, getLocalizedContent } from "@/blog.config";
import { Locale } from "./dictionary";

export function getNavigation(locale: Locale) {
    return [
        { 
            title: locale === "pt-BR" ? "Tópicos" : "Topics", 
            links: BlogConfig.topics.map(topic => ({
                title: getLocalizedContent(topic.title, locale),
                href: topic.href
            }))
        },
        { 
            title: locale === "pt-BR" ? "Projetos" : "Projects", 
            links: BlogConfig.projects.map(project => ({
                title: getLocalizedContent(project.title, locale),
                href: project.href
            }))
        },
    ];
}

// Keep the old export for backward compatibility (will be updated in components)
export const navigation = [
    { title: "Tópicos", links: BlogConfig.topics.map(topic => ({ title: topic.title["pt-BR"], href: topic.href })) },
    { title: "Projetos", links: BlogConfig.projects.map(project => ({ title: project.title["pt-BR"], href: project.href })) },
];
