import { MarkdownClient } from "~/markdown/client";
import { MarkdownServer } from "~/markdown/server";

type Props = { params: { id: string }, searchParams: { lang?: string } }

export default async function Home(props: Props) {
    const content = await MarkdownServer.getFile(props.params.id);
    if (content === null) {
        return <main>Not found</main>
    }
    const mdx = await MarkdownServer.serializeMarkdown(content);
    return (
        <div>
            <MarkdownClient {...mdx}/>
        </div>
    );
}
