import { Link } from "@remix-run/react";
import { Posts } from "~/database/posts.server";
import { Strings } from "~/lib/strings";
import { SerializeToPlain } from "~/lib/utility-types";

type Props = {
  toTagLink: (link: string) => string;
  toPostLink: (link: string) => string;
  post: SerializeToPlain<Posts.TPostTitle>;
};

export const Post: React.FC<Props> = ({ post, toPostLink, toTagLink }) => {
  return (
    <li>
      <Link
        to={toPostLink(post.slug)}
        className="block group link:text-sky-700 dark:link:text-sky-400 link:underline duration-300 origin-center"
      >
        <header>
          <h3 className="font-extrabold leading-snug text-2xl whitespace-pre-wrap">
            {post.title}
          </h3>
        </header>
        <section>
          <time className="block text-gray-400 group-hover:text-sky-400">
            {Strings.formatDate(new Date(post.createdAt))}
          </time>
          <p className="prose dark:prose-invert prose-lg group-hover:text-sky-400">
            {post.description}
          </p>
        </section>
      </Link>
      <footer>
        <ul className="inline-flex gap-x-4 mt-2 flex-wrap gap-y-4">
          {post.tags.map((tag) => (
            <li key={`${tag.tag.label}-tag-post`}>
              <Link
                to={toTagLink(tag.tag.label)}
                className="rounded-lg px-2 py-1 bg-main link:bg-main-dark text-slate-200"
              >
                {tag.tag.label}
              </Link>
            </li>
          ))}
        </ul>
      </footer>
    </li>
  );
};
