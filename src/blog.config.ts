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
    defaultLanguage: "pt-BR",
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
        { title: { "pt-BR": "brouther", "en-US": "brouther", }, href: "https://brouther.vercel.app/", },
        { title: { "pt-BR": "dotfiles", "en-US": "dotfiles", }, href: "https://github.com/g4rcez/dotfiles", },
        { title: { "pt-BR": "racha aí", "en-US": "racha aí", }, href: "https://racha.ai", },
        { title: { "pt-BR": "useReducer", "en-US": "useReducer", }, href: "https://github.com/g4rcez/use-reducer", },
    ] as LocalizedLink[],
    topics: [
        {
            title: {
                "pt-BR": "Frontend",
                "en-US": "Frontend",
            },
            href: "/?q=frontend",
        },
        {
            title: {
                "pt-BR": "Javascript",
                "en-US": "Javascript",
            },
            href: "/?q=javascript",
        },
        {
            title: {
                "pt-BR": "NodeJS",
                "en-US": "NodeJS",
            },
            href: "/?q=nodejs",
        },
        {
            title: {
                "pt-BR": "React",
                "en-US": "React",
            },
            href: "/?q=react",
        },
        {
            title: {
                "pt-BR": "Dicas e Truques",
                "en-US": "Tips and Tricks",
            },
            href: "/?q=tips-and-tricks",
        },
        {
            title: {
                "pt-BR": "Typescript",
                "en-US": "Typescript",
            },
            href: "/?q=typescript",
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
    content[locale] || content["pt-BR"];
