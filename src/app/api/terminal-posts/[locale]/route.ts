import { getPosts } from "@/components/server/posts";
import { getTerminalFiles } from "@/components/server/terminal-files";
import { getTranslation, SUPPORTED_LOCALES, type Locale } from "@/lib/dictionary";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
    return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

type Props = {
    params: Promise<{ locale: string }>;
};

export async function GET(_request: Request, { params }: Props) {
    const { locale } = await params;
    if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
        return Response.json({ error: getTranslation(locale).terminal.unsupportedLocale }, { status: 404 });
    }

    const requestedLocale = locale as Locale;
    const files = getTerminalFiles(requestedLocale, getPosts(requestedLocale));

    return Response.json(
        { files },
        { headers: { "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" } },
    );
}
