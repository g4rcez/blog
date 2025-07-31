"use client";
import { Locale } from "@/lib/dictionary";
import { useLocale } from "@/lib/i18n";
import { Menu, MenuItem } from "@g4rcez/components/menu";
import { useRouter } from "next/navigation";

const languages = [
    { base: "/", code: "pt-BR" as Locale, name: "Português", flag: "🇧🇷" },
    { base: "/en", code: "en-US" as Locale, name: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
    const router = useRouter();
    const [locale, setLocale] = useLocale();
    const currentLanguage = languages.find((lang) => lang.code === locale);
    return (
        <Menu
            title={locale}
            label={
                <span className="flex gap-1 items-center text-foreground">
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
                        router.push(language.base);
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
