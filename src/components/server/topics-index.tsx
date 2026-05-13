import { BlogConfig } from "@/blog.config";
import { JsonLd } from "@/components/server/json-ld";
import { getTopics } from "@/components/server/topics";
import { Locale } from "@/lib/dictionary";
import { absoluteUrl, topicsBasePath } from "@/lib/seo";
import Link from "next/link";

type Props = { lang: Locale };

export function TopicsIndex({ lang }: Props) {
    const topics = getTopics(lang);
    const base = topicsBasePath[lang];
    const json = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        url: absoluteUrl(base),
        name: lang === "pt-BR" ? "Tópicos" : "Topics",
        inLanguage: lang,
        hasPart: topics.map((t) => ({
            "@type": "Thing",
            name: t.name,
            url: absoluteUrl(`${base}/${t.slug}`),
        })),
    };
    return (
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-12 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
            <JsonLd data={json} />
            <header className="mb-9 space-y-4">
                <h1 className="font-display text-3xl tracking-tight text-foreground">
                    {lang === "pt-BR" ? "Tópicos" : "Topics"}
                </h1>
                <p className="font-display text-secondary-foreground">
                    {topics.length} {lang === "pt-BR" ? "tópicos" : "topics"}
                </p>
            </header>
            <ul className="not-prose grid grid-cols-1 gap-4 sm:grid-cols-2">
                {topics.map((t) => (
                    <li key={t.slug}>
                        <Link
                            href={`${base}/${t.slug}`}
                            className="border-divider flex items-center justify-between rounded-xl border px-4 py-3 transition hover:border-foreground"
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
