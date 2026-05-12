"use client";
import { Locale } from "@/lib/dictionary";
import { useLocale } from "@/lib/i18n";
import { Menu, MenuItem } from "@g4rcez/components/menu";
import { usePathname, useRouter } from "next/navigation";

const languages = [
    { base: "/", code: "en-US" as Locale, name: "English", flag: "🇺🇸" },
    { base: "/pt", code: "pt-BR" as Locale, name: "Português", flag: "🇧🇷" },
];

const prefixes = languages.map((l) => l.base).filter((b) => b !== "/");

const toNeutralPath = (pathname: string) => {
    for (const prefix of prefixes) {
        if (pathname === prefix) return "/";
        if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
    }
    return pathname;
};

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const [locale, setLocale] = useLocale();
    const currentLanguage = languages.find((lang) => lang.code === locale);

    return (
        <Menu
            title={locale}
            label={
                <span className="flex items-center gap-1 text-foreground">
                    {currentLanguage?.flag} <span className="hidden lg:inline-block">{currentLanguage?.name}</span>
                </span>
            }
        >
            {languages.map((language) => (
                <MenuItem
                    key={language.code}
                    title={language.name}
                    onClick={() => {
                        setLocale(language.code);
                        const neutral = toNeutralPath(pathname);
                        router.push(language.base === "/" ? neutral : `${language.base}${neutral}`);
                    }}
                >
                    <span className="text-foreground">
                        {language.flag} {language.name}
                    </span>
                </MenuItem>
            ))}
        </Menu>
    );
}
