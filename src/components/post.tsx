import { Link } from "remix";
import { Posts } from "~/database/posts.server";
import { Strings } from "~/lib/strings";

type Props = {
  post: Posts.TPostTitle;
  toPostLink: (link: string) => string;
  toTagLink: (link: string) => string;
};

export const Post: React.VFC<Props> = ({ post, toPostLink, toTagLink }) => {
  return (
    <li className="transform link:scale-105 duration-300 w-fit">
      <Link to={toPostLink(post.slug)} className="block group link:text-sky-700 dark:link:text-sky-400 link:underline duration-300 origin-center">
        <h3 className="font-extrabold leading-snug text-2xl whitespace-pre-wrap">{post.title}</h3>
        <time className="block text-gray-400 group-hover:text-sky-400">{Strings.formatDate(new Date(post.createdAt))}</time>
        <p className="prose dark:prose-invert prose-lg group-hover:text-sky-400">{post.description}</p>
      </Link>
      <footer>
        <ul className="inline-flex gap-x-4 mt-2">
          {post.tags.map((tag) => (
            <li key={`${tag.tag.label}-tag-post`}>
              <Link to={toTagLink(tag.tag.label)} className="rounded-lg px-2 py-1 bg-main link:bg-main-dark text-slate-200">
                {tag.tag.label}
              </Link>
            </li>
          ))}
        </ul>
      </footer>
    </li>
  );
};
