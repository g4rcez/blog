import { type BlogTranslations } from "@/i18n/pt-BR";

export default {
    navigation: {
        topics: "Topics",
        projects: "Projects",
    },
    hero: {
        title: "Ideas and code through posts",
        subtitle: "Posts, reports and experiences from a developer's point of view",
        github: "Github",
        linkedin: "LinkedIn",
        twitter: "Twitter",
    },
    terminal: {
        initialMessage: "Type 'help' to see all available commands",
        commands: {
            clear: {
                description: "Clear history",
            },
            whoami: {
                description: "User name",
            },
            ls: {
                description: "List my projects",
            },
            help: {
                description: "Show all available commands",
            },
        },
    },
    theme: {
        label: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
    },
    common: {
        home: "Home page",
        loading: "Loading...",
        search: "Search",
        readMore: "Read more",
        backToTop: "Back to top",
        emptyPosts: "No posts available..."
    },
    callout: {
        note: "Note",
        warning: "Warning",
    },
    blog: {
        readTime: "min read",
        publishedOn: "Published on",
        lastUpdated: "Last updated on",
        tableOfContents: "Table of Contents",
        relatedPosts: "Related posts",
    },
} as BlogTranslations;
