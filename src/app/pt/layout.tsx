import { PostJsonLd } from "@/components/server/post-json-ld";
import { RelatedPosts } from "@/components/server/related-posts";
import { createGenerateMetadata } from "@/lib/metadata";

export const generateMetadata = createGenerateMetadata("pt-BR");

export default function PostsLayout(props: any) {
    return (
        <>
            <PostJsonLd lang="pt-BR" />
            {props.children}
            <div className="mx-auto w-full max-w-7xl px-4 pb-16 lg:px-8 xl:px-16">
                <RelatedPosts lang="pt-BR" />
            </div>
        </>
    );
}
