import { createGenerateMetadata } from "@/lib/metadata";

export const generateMetadata = createGenerateMetadata("en-US");

export default function PostsLayout(props: any) {
    return props.children;
}
