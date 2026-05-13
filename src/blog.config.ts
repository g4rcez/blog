import { Locale } from "./lib/dictionary";

type LocalizedContent = {
    "pt-BR": string;
    "en-US": string;
};

type LocalizedLink = {
    title: LocalizedContent;
    href: string;
};

export const BlogConfig = {
    defaultLanguage: "en-US",
    user: {
        name: "Allan Garcez",
    },
    author: "g4rcez",
    name: {
        "pt-BR": "Blog do Garcez",
        "en-US": "Garcez's Blog",
    },
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
                "pt-BR": "Meus dotfiles para configuração incrível do shell",
                "en-US": "My dotfiles for awesome setup/shell",
            },
            href: "https://github.com/g4rcez/dotfiles",
        },
        {
            title: "brouther",
            description: {
                "pt-BR": "O roteador irmão para ajudar em aplicações React",
                "en-US": "The brother router to help in React apps",
            },
            href: "https://brouther.vercel.app",
        },
        {
            title: "use-reducer",
            description: {
                "pt-BR": "Outra forma de usar React.useReducer, com tipos",
                "en-US": "Another way to use React.useReducer, with types",
            },
            href: "https://github.com/g4rcez/use-reducer",
        },
    ],
};

export const getLocalizedContent = (content: LocalizedContent, locale: Locale): string =>
    content[locale] || content["en-US"];
