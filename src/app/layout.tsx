import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/app/providers";
import { BlogConfig } from "@/blog.config";
import { Layout } from "@/components/layout";
import { JsonLd } from "@/components/server/json-ld";
import { Locale } from "@/lib/dictionary";
import { absoluteUrl, DEFAULT_OG_IMAGE, homeCopy, homeKeywords, SITE_URL } from "@/lib/seo";
import { darkColors } from "@/styles/dark";
import { lightColors } from "@/styles/light";
import { defaultDarkTheme, defaultLightTheme } from "@g4rcez/components/themes";
import { createTheme } from "@g4rcez/components/styles";
import clsx from "clsx";
import { type Metadata, type Viewport } from "next";
import { headers } from "next/headers";
import { Inter, Lexend } from "next/font/google";
import "@/styles/tailwind.css";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const lexend = Lexend({ subsets: ["latin"], display: "swap", variable: "--font-lexend" });

const resolveLocale = (pathname: string | null): Locale => {
    if (pathname && pathname.startsWith("/pt")) return "pt-BR";
    return "en-US";
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        template: `%s · ${BlogConfig.name["en-US"]}`,
        default: homeCopy["en-US"].title,
    },
    description: homeCopy["en-US"].description,
    applicationName: BlogConfig.name["en-US"],
    keywords: homeKeywords["en-US"],
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
        canonical: "/",
        languages: { "en-US": "/", "pt-BR": "/pt", "x-default": "/" },
    },
    openGraph: {
        type: "website",
        url: SITE_URL,
        siteName: BlogConfig.name["en-US"],
        title: homeCopy["en-US"].title,
        description: homeCopy["en-US"].description,
        locale: "en_US",
        alternateLocale: ["pt_BR"],
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: BlogConfig.user.name }],
    },
    twitter: {
        card: "summary_large_image",
        site: "@garcez_allan",
        creator: "@garcez_allan",
        title: homeCopy["en-US"].title,
        description: homeCopy["en-US"].description,
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
    name: BlogConfig.name["en-US"],
    description: homeCopy["en-US"].description,
    inLanguage: ["en-US", "pt-BR"],
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
    const lang = resolveLocale(pathname);
    const htmlLang = lang === "pt-BR" ? "pt-BR" : "en-US";
    return (
        <html
            lang={htmlLang}
            suppressHydrationWarning
            className={clsx("dark h-full antialiased", inter.variable, lexend.variable)}
        >
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    rel="alternate"
                    type="application/rss+xml"
                    title={`${BlogConfig.name["en-US"]} — RSS`}
                    href="/feed.xml"
                />
                <link
                    rel="alternate"
                    type="application/rss+xml"
                    title={`${BlogConfig.name["pt-BR"]} — RSS`}
                    href="/pt/feed.xml"
                    hrefLang="pt-BR"
                />
                <link rel="me" href={BlogConfig.github} />
                <link rel="author" href={SITE_URL} />
                <style data-name="theme" id="theme-dark">
                    {createTheme({ ...defaultDarkTheme, colors: darkColors }, "dark")}
                </style>
                <JsonLd data={[websiteJsonLd, personJsonLd]} />
            </head>
            <body className="flex min-h-full bg-background">
               <Analytics/>
               <Providers lang={lang}>
                    <Layout>{props.children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
