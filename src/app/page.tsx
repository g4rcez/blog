import { Posts } from "@/components/server/list-posts";

export default async function IndexPage(props: any) {
    const search = await props.searchParams;
    const q = search?.q || "";
    const value = Array.isArray(q) ? q[0] : q;
    return (
        <div className="min-w-0 max-w-2xl flex-auto px-4 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
            <Posts search={value} />
        </div>
    );
}
