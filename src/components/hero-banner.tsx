"use client";
import { BlogConfig } from "@/blog.config";
import { Hero } from "@/components/hero";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo, Logomark } from "@/components/logo";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Navigation } from "@/components/navigation";
import { Search } from "@/components/search";
import { TerminalModal } from "@/components/terminal-modal";
import { ThemeSelector } from "@/components/theme-selector";
import { portfolioRoutes } from "@/lib/portfolio-routes";
import { localeToPath, tagsBasePath } from "@/lib/seo";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const homePaths = Object.values(localeToPath);

const useIsHome = () => {
    const pathname = usePathname();
    return homePaths.includes(pathname);
};

export const HeroBanner = () => {
    const isHomePage = useIsHome();
    return isHomePage ? <Hero /> : null;
};

export const SiteMain = ({ children }: { children: React.ReactNode }) => {
    const isHomePage = useIsHome();
    return (
        <main
            id="main-content"
            className={`max-w-8xl mx-auto flex w-full min-w-0 flex-auto flex-col px-5 sm:px-8 lg:px-12 ${isHomePage ? "" : "xl:grid xl:grid-cols-[minmax(15rem,1fr)_minmax(0,75ch)_minmax(15rem,1fr)]"}`}
        >
            {!isHomePage && (
                <aside className="hidden w-60 shrink-0 pt-16 xl:col-start-1 xl:row-start-1 xl:block">
                    <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-8">
                        <Navigation />
                    </div>
                </aside>
            )}
            {children}
        </main>
    );
};

const GitHubIcon = (props: React.ComponentPropsWithoutRef<"svg">) => (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
        <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
    </svg>
);

export function Header() {
    const { t, locale } = useTranslation();
    const pathname = usePathname();
    const links = [
        { href: localeToPath[locale], label: t("common.home") },
        { href: portfolioRoutes[locale].writing, label: t("navigation.posts") },
        { href: tagsBasePath[locale], label: t("navigation.tags") },
        { href: portfolioRoutes[locale].about, label: t("navigation.about") },
    ];

    return (
        <div className="border-border bg-background sticky top-0 z-20 w-full border-b">
            <header className="max-w-8xl mx-auto flex items-center gap-4 px-5 py-4 sm:px-8 lg:px-12">
                <div className="lg:hidden">
                    <MobileNavigation />
                </div>
                <Link
                    href={localeToPath[locale]}
                    aria-label={t("common.home")}
                    className="focus-visible:outline-primary shrink-0 focus-visible:outline-2"
                >
                    <Logomark className="sm:hidden" />
                    <Logo className="text-foreground hidden sm:block" />
                </Link>
                <nav
                    aria-label={t("navigation.main")}
                    className="ml-auto hidden items-center gap-6 text-sm font-medium lg:flex"
                >
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={pathname === link.href ? "page" : undefined}
                            className={
                                pathname === link.href
                                    ? "text-primary-hover dark:text-primary"
                                    : "text-secondary-foreground hover:text-foreground transition-colors"
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="ml-auto flex items-center gap-4 lg:ml-5">
                    <Search />
                    <LanguageSwitcher />
                    <TerminalModal />
                    <div className="relative">
                        <ThemeSelector />
                    </div>
                    <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={BlogConfig.github}
                        className="text-secondary-foreground hover:text-primary hidden transition-colors sm:block"
                        aria-label={t("hero.github")}
                    >
                        <GitHubIcon className="h-5 w-5 fill-current" />
                    </Link>
                </div>
            </header>
        </div>
    );
}
