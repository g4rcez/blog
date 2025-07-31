import { WelcomePosts } from "@/components/welcome-posts";

export const dynamic = "force-static";

const lang = "en-US";

export default async function IndexPage(props: any) {
    const search = await props.searchParams;
    const q = search?.q || "";
    const value = Array.isArray(q) ? q[0] : q;
    return <WelcomePosts lang={lang} q={value} />;
}
