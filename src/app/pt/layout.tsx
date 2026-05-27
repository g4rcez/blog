import { PostJsonLd } from "@/components/server/post-json-ld";
import { createGenerateMetadata } from "@/lib/metadata";

export const generateMetadata = createGenerateMetadata("pt-BR");

export default function PostsLayout(props: any) {
    return (
        <>
            <PostJsonLd lang="pt-BR" />
            {props.children}
        </>
    );
}
