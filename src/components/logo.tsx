import { BlogConfig, getLocalizedContent } from "@/blog.config";
import { useTranslation } from "@/lib/i18n";
import React from "react";

export const Logomark = (props: React.ComponentPropsWithoutRef<"span">) => {
    const { locale } = useTranslation();
    return <span {...props}>{getLocalizedContent(BlogConfig.name, locale)}</span>;
};

export const Logo = (props: React.ComponentPropsWithoutRef<"span">) => {
    const { locale } = useTranslation();
    return <span {...props}>{getLocalizedContent(BlogConfig.name, locale)}</span>;
};
