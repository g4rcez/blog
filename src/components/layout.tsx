import { Header, HeroBanner, SiteMain } from "@/components/hero-banner";
import { portfolioPath } from "@/lib/portfolio-routes";
import { getTranslation, type Locale } from "@/lib/dictionary";
import { postPath } from "@/lib/seo";
import Link from "next/link";
import React, { Suspense } from "react";

export function Layout({ children, lang }: { children: React.ReactNode; lang: Locale }) {
    const copy = getTranslation(lang);
    return (
        <div className="flex w-full flex-col">
            <a
                href="#main-content"
                className="focus:bg-foreground focus:text-background sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:px-4 focus:py-2"
            >
                {copy.common.skipToContent}
            </a>
            <Suspense fallback={null}>
                <Header />
            </Suspense>
            <HeroBanner />
            <SiteMain>{children}</SiteMain>
            <footer className="border-border mt-20 border-t">
                <div className="max-w-8xl text-secondary-foreground mx-auto flex flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm sm:px-8 lg:px-12">
                    <span>Allan Garcez</span>
                    <div className="flex gap-6">
                        <Link
                            href={portfolioPath(lang, "writing")}
                            className="hover:text-primary-hover dark:hover:text-primary"
                        >
                            {copy.navigation.posts}
                        </Link>
                        <Link
                            href={postPath(lang, "/feed.xml")}
                            className="hover:text-primary-hover dark:hover:text-primary"
                        >
                            RSS
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
