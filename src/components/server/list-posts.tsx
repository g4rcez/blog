import { BlogConfig } from "@/blog.config";
import { QuickLink, QuickLinks, type QuickLinksLayout } from "@/components/quick-links";
import { getTranslation, type Locale } from "@/lib/dictionary";
import { SimplePost } from "./posts";
import { filterPosts } from "@/lib/models";

export const dynamic = "force-static";

export function Posts(props: { search: string; lang: string; posts: SimplePost[]; layout?: QuickLinksLayout }) {
    const lang = (props.lang?.toLocaleLowerCase() as Locale) || BlogConfig.defaultLanguage;
    const message = getTranslation(lang);
    const posts = filterPosts(props.search, props.posts);
    return (
        <QuickLinks layout={props.layout}>
            {posts.length === 0 ? (
                <span>{message.common.emptyPosts}</span>
            ) : (
                posts.map((post) => (
                    <QuickLink
                        key={post.href}
                        href={post.href}
                        date={post.info.date}
                        layout={props.layout}
                        title={post.info.title}
                        tags={post.info.subjects}
                        readingTime={post.readingTime}
                        description={post.info.description}
                    />
                ))
            )}
        </QuickLinks>
    );
}
