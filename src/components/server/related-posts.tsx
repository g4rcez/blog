import { getPosts } from "@/components/server/posts";
import { Locale, getTranslation } from "@/lib/dictionary";
import { headers } from "next/headers";
import Link from "next/link";

type Props = { lang: Locale; max?: number };

export async function RelatedPosts({ lang, max = 3 }: Props) {
    const h = await headers();
    const pathname = h.get("x-pathname") || "";
    const cleanHref = lang === "pt-BR" ? pathname.replace(/^\/pt/, "") : pathname;
    const posts = getPosts(lang);
    const current = posts.find((x) => x.href === cleanHref);
    if (!current) return null;
    const currentSubjects = new Set(current.info.subjects);
    const scored = posts
        .filter((p) => p.href !== current.href)
        .map((p) => ({
            post: p,
            score: p.info.subjects.filter((s) => currentSubjects.has(s)).length,
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
        .slice(0, max);
    if (scored.length === 0) return null;
    const t = getTranslation(lang);
    return (
        <aside aria-label={t.blog.relatedPosts} className="border-divider mt-12 border-t pt-8">
            <h2 className="font-display text-xl tracking-tight text-foreground">{t.blog.relatedPosts}</h2>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {scored.map(({ post }) => {
                    const href = lang === "pt-BR" ? `/pt${post.href}` : post.href;
                    return (
                        <li key={post.href}>
                            <Link
                                href={href}
                                className="border-divider block rounded-xl border p-4 transition hover:border-foreground"
                            >
                                <span className="block font-medium text-foreground">{post.info.title}</span>
                                <span className="mt-2 block text-sm text-secondary-foreground">
                                    {post.info.description}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}
