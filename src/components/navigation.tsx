"use client";
import { getNavigation } from "@/lib/navigation";
import { useTranslation } from "@/lib/i18n";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
    className?: string;
    onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export const Navigation = ({ className, onLinkClick }: Props) => {
    const pathname = usePathname();
    const { locale, t } = useTranslation();
    const navigation = getNavigation(locale);

    return (
        <nav aria-label={t("navigation.browseSections")} className={clsx("text-sm", className)}>
            <ul className="space-y-8">
                {navigation.map((section) => (
                    <li key={section.title}>
                        <h2 className="font-display font-medium text-foreground">{section.title}</h2>
                        <ul className="mt-3 space-y-2 border-l border-border">
                            {section.links.map((link) => (
                                <li key={link.href} className="relative">
                                    <Link
                                        href={link.href}
                                        onClick={onLinkClick}
                                        aria-current={link.href === pathname ? "page" : undefined}
                                        className={clsx(
                                            "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                                            link.href === pathname
                                                ? "font-semibold text-primary-hover before:bg-primary-hover dark:text-primary dark:before:bg-primary"
                                                : "text-secondary-foreground before:hidden before:bg-muted-foreground hover:text-foreground hover:before:block",
                                        )}
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
