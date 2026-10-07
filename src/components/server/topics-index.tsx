import { JsonLd } from "@/components/server/json-ld";
import { getTopics } from "@/components/server/topics";
import { getTranslation, type Locale } from "@/lib/dictionary";
import { absoluteUrl, tagsBasePath } from "@/lib/seo";
import Link from "next/link";

type Props = { lang: Locale };

export function TopicsIndex({ lang }: Props) {
    const tags = getTopics(lang);
    const base = tagsBasePath[lang];
    const tagsLabel = getTranslation(lang).navigation.tags;
    const json = {
        name: tagsLabel,
        inLanguage: lang,
        url: absoluteUrl(base),
        "@type": "CollectionPage",
        "@context": "https://schema.org",
        hasPart: tags.map((t) => ({
            "@type": "Thing",
            name: t.name,
            url: absoluteUrl(`${base}/${t.slug}`),
        })),
    };
    return (
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-12 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
            <JsonLd data={json} />
            <header className="mb-9 space-y-4">
                <h1 className="font-display text-foreground text-3xl tracking-tight">{tagsLabel}</h1>
                <p className="font-display text-secondary-foreground">
                    {tags.length} {tagsLabel.toLocaleLowerCase(lang)}
                </p>
            </header>
            <ul className="not-prose grid grid-cols-1 gap-4 sm:grid-cols-2">
                {tags.map((t) => (
                    <li key={t.slug}>
                        <Link
                            href={`${base}/${t.slug}`}
                            className="border-divider text-primary flex items-center justify-between rounded-md border-primary border px-3 py-1 duration-500 hover:scale-105 transition-all ease-in-out"
                        >
                            <span className="font-medium text-foreground">{t.name}</span>
                            <span className="text-sm text-secondary-foreground">{t.count}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
