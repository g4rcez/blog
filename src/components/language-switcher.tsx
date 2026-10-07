"use client";
import { LOCALE_INFO, SUPPORTED_LOCALES } from "@/lib/dictionary";
import { useLocale } from "@/lib/i18n";
import { localeFromPath, localizedPath, removeLocalePath } from "@/lib/seo";
import { Menu, MenuItem } from "@g4rcez/components/menu";
import { usePathname, useRouter } from "next/navigation";

const languages = SUPPORTED_LOCALES.map((code) => ({ code, ...LOCALE_INFO[code] }));

const toNeutralPath = (pathname: string) => removeLocalePath(localeFromPath(pathname), pathname);

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
                        router.push(localizedPath(language.code, neutral));
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
