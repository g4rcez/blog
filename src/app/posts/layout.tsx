import { BlogConfig } from "@/blog.config";
import { PostJsonLd } from "@/components/server/post-json-ld";
import { RelatedPosts } from "@/components/server/related-posts";
import { Locale } from "@/lib/dictionary";
import { createGenerateMetadata } from "@/lib/metadata";

const lang = BlogConfig.defaultLanguage as Locale;

export const generateMetadata = createGenerateMetadata(lang);

export default function PostsLayout(props: any) {
    return (
        <>
            <PostJsonLd lang={lang} />
            {props.children}
            <div className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-8 xl:px-16">
                <RelatedPosts lang={lang} />
            </div>
        </>
    );
}
