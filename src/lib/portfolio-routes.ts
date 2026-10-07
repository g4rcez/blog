import type { Locale } from "./dictionary";
import { localeToPath } from "./seo";

export type PortfolioSection = "work" | "writing" | "openSource" | "about";

export const portfolioRoutes = {
    "en-US": {
        work: "/work",
        writing: "/posts",
        openSource: "/open-source",
        about: "/about",
    },
    "pt-BR": {
        work: "/pt/trabalho",
        writing: "/pt/posts",
        openSource: "/pt/codigo-aberto",
        about: "/pt/sobre",
    },
} satisfies Record<Locale, Record<PortfolioSection, string>>;

export const homePath = (locale: Locale) => localeToPath[locale];

export const portfolioPath = (locale: Locale, section: PortfolioSection, slug?: string) => {
    const base = portfolioRoutes[locale][section];
    return slug ? `${base}/${slug}` : base;
};
