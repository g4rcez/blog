import { DEFAULT_LOCALE, type Locale } from "./lib/dictionary";

type LocalizedContent = Record<Locale, string>;

type LocalizedLink = {
    title: LocalizedContent;
    href: string;
};

type LocalizedTerminalLink = {
    title: string;
    description: LocalizedContent;
    href: string;
};

export const BlogConfig = {
    defaultLanguage: DEFAULT_LOCALE,
    user: {
        name: "Allan Garcez",
    },
    author: "g4rcez",
    name: {
        "pt-BR": "Blog do Garcez",
        "en-US": "Garcez's Blog",
    } satisfies LocalizedContent,
    domain: "garcez.dev",
    site: "https://garcez.dev",
    github: "https://github.com/g4rcez",
    twitter: "https://x.com/garcez_allan",
    projects: [
        { title: { "pt-BR": "brouther", "en-US": "brouther" }, href: "https://brouther.vercel.app/" },
        { title: { "pt-BR": "dotfiles", "en-US": "dotfiles" }, href: "https://github.com/g4rcez/dotfiles" },
        { title: { "pt-BR": "writeme", "en-US": "writeme" }, href: "https://app.writeme.dev" },
        { title: { "pt-BR": "useReducer", "en-US": "useReducer" }, href: "https://github.com/g4rcez/use-reducer" },
        { title: { "pt-BR": "the-mask-input", "en-US": "the-mask-input" }, href: "/projects/the-mask-input" },
    ] as LocalizedLink[],
    topics: [
        { title: { "pt-BR": "Frontend", "en-US": "Frontend" }, href: "frontend" },
        { title: { "pt-BR": "Javascript", "en-US": "Javascript" }, href: "javascript" },
        { title: { "pt-BR": "NodeJS", "en-US": "NodeJS" }, href: "nodejs" },
        { title: { "pt-BR": "React", "en-US": "React" }, href: "react" },
        { title: { "pt-BR": "Dicas e Truques", "en-US": "Tips and Tricks" }, href: "tips-and-tricks" },
        { title: { "pt-BR": "Typescript", "en-US": "Typescript" }, href: "typescript" },
    ] as LocalizedLink[],
    agents: [
        {
            title: { "pt-BR": "Product UI Engineer", "en-US": "Product UI Engineer" },
            href: "/agents/product-ui-engineer",
        },
    ] as LocalizedLink[],
    terminal: [
        {
            title: "dotfiles",
            description: {
                "pt-BR": "Meus dotfiles para configurar o shell no dia a dia",
                "en-US": "My dotfiles for a practical shell setup",
            },
            href: "https://github.com/g4rcez/dotfiles",
        },
        {
            title: "brouther",
            description: {
                "pt-BR": "Um router para React que simplifica a navegação",
                "en-US": "A React router that keeps navigation simple",
            },
            href: "https://brouther.vercel.app",
        },
        {
            title: "use-reducer",
            description: {
                "pt-BR": "Uma forma tipada de usar React.useReducer",
                "en-US": "A typed way to use React.useReducer",
            },
            href: "https://github.com/g4rcez/use-reducer",
        },
    ] satisfies LocalizedTerminalLink[],
};

export const getLocalizedContent = (content: LocalizedContent, locale: Locale): string =>
    content[locale] || content[DEFAULT_LOCALE];
