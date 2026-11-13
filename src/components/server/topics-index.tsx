import { JsonLd } from "@/components/server/json-ld";
import { getTopics } from "@/components/server/topics";
import { getTranslation, type Locale } from "@/lib/dictionary";
import { absoluteUrl, tagsBasePath } from "@/lib/seo";
import { TopicsGrid } from "@/components/client/topics-grid";

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
            <TopicsGrid tags={tags} base={base} />
        </div>
    );
}
