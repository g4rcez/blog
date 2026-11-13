import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/app/providers";
import { BlogConfig } from "@/blog.config";
import { Layout } from "@/components/layout";
import { JsonLd } from "@/components/server/json-ld";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/dictionary";
import {
    absoluteUrl,
    DEFAULT_OG_IMAGE,
    homeCopy,
    homeKeywords,
    localeFromPath,
    localizedAlternates,
    localeToPath,
    ogLocale,
    postPath,
    SITE_URL,
} from "@/lib/seo";
import { darkColors } from "@/styles/dark";
import { lightColors } from "@/styles/light";
import { createThemeCss, defaultDarkThemeTokens } from "@g4rcez/components/theme";
import clsx from "clsx";
import { type Metadata, type Viewport } from "next";
import { headers } from "next/headers";
import { Inter, Lexend } from "next/font/google";
import "@/styles/tailwind.css";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const lexend = Lexend({ subsets: ["latin"], display: "swap", variable: "--font-lexend" });

const metadataBase = (() => {
    try {
        return new URL(SITE_URL);
    } catch (cause) {
        throw new Error("BlogConfig.site must be a valid absolute URL.", { cause });
    }
})();

export const metadata: Metadata = {
    metadataBase,
    title: {
        template: `%s · ${BlogConfig.name[DEFAULT_LOCALE]}`,
        default: homeCopy[DEFAULT_LOCALE].title,
    },
    description: homeCopy[DEFAULT_LOCALE].description,
    applicationName: BlogConfig.name[DEFAULT_LOCALE],
    keywords: homeKeywords[DEFAULT_LOCALE],
    authors: [{ name: BlogConfig.user.name, url: SITE_URL }],
    creator: BlogConfig.user.name,
    publisher: BlogConfig.user.name,
    referrer: "origin-when-cross-origin",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    alternates: {
        canonical: localeToPath[DEFAULT_LOCALE],
        languages: localizedAlternates(SUPPORTED_LOCALES, (locale) => localeToPath[locale]),
    },
    openGraph: {
        type: "website",
        url: SITE_URL,
        siteName: BlogConfig.name[DEFAULT_LOCALE],
        title: homeCopy[DEFAULT_LOCALE].title,
        description: homeCopy[DEFAULT_LOCALE].description,
        locale: ogLocale[DEFAULT_LOCALE],
        alternateLocale: SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).map((locale) => ogLocale[locale]),
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: BlogConfig.user.name }],
    },
    twitter: {
        card: "summary_large_image",
        site: "@garcez_allan",
        creator: "@garcez_allan",
        title: homeCopy[DEFAULT_LOCALE].title,
        description: homeCopy[DEFAULT_LOCALE].description,
        images: [DEFAULT_OG_IMAGE],
    },
    icons: { icon: "/favicon.ico" },
    category: "technology",
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
    colorScheme: "dark light",
};

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BlogConfig.name[DEFAULT_LOCALE],
    description: homeCopy[DEFAULT_LOCALE].description,
    inLanguage: SUPPORTED_LOCALES,
    publisher: { "@id": `${SITE_URL}/#person` },
};

const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: BlogConfig.user.name,
    url: SITE_URL,
    image: absoluteUrl("/avatar.png"),
    sameAs: [BlogConfig.github, BlogConfig.twitter],
    jobTitle: "Senior Frontend Engineer",
    knowsAbout: ["TypeScript", "React", "Node.js", "Frontend Engineering", "Web Performance", "Design Systems"],
};

export default async function RootLayout(props: PropsWithChildren) {
    const h = await headers();
    const pathname = h.get("x-pathname");
    const lang = localeFromPath(pathname);
    return (
        <html
            lang={lang}
            suppressHydrationWarning
            className={clsx("h-full antialiased", inter.variable, lexend.variable)}
        >
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {SUPPORTED_LOCALES.map((locale) => (
                    <link
                        key={locale}
                        rel="alternate"
                        type="application/rss+xml"
                        title={`${BlogConfig.name[locale]} — RSS`}
                        href={postPath(locale, "/feed.xml")}
                        hrefLang={locale}
                    />
                ))}
                <link rel="me" href={BlogConfig.github} />
                <link rel="author" href={SITE_URL} />
                <style data-name="theme" id="theme-light">
                    {createThemeCss({ name: "default", colorScheme: "light", colors: lightColors })}
                </style>
                <style data-name="theme" id="theme-dark">
                    {createThemeCss({ name: "dark", colorScheme: "dark", colors: { ...defaultDarkThemeTokens.colors, ...darkColors } })}
                </style>
                <JsonLd data={[websiteJsonLd, personJsonLd]} />
            </head>
            <body className="flex min-h-full bg-background">
               <Analytics/>
               <Providers lang={lang}>
                    <Layout lang={lang}>{props.children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
