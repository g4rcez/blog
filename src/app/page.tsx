import Link from "next/link";
import { Links } from "~/links";
import { MarkdownServer } from "~/markdown/server";
import { MarkdownValidator } from "~/markdown/validator";

type Props = {
    searchParams: {
        page?: string;
        pageSize?: string;
    }
}

export default async function Home(props: Props) {
    const pagination = MarkdownValidator.getPagination(props.searchParams);
    const posts = await MarkdownServer.getAll(pagination.page, pagination.pageSize);
    return (
        <div>
            <ul>
                {posts.map((post) => (
                    <li key={`${post.href}-post`}>
                        <Link className="underline" href={Links.post(post.href)}>
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
