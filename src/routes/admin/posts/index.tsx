import { json, Link, LoaderFunction, useLoaderData } from "remix";
import { authenticator, authSession } from "~/auth/auth.server";
import { Auth } from "~/auth/middleware";
import { Anchor } from "~/components/anchor";
import { Container } from "~/components/container";
import { Heading } from "~/components/heading";
import { Posts } from "~/database/posts.server";
import { Links } from "~/lib/links";
import { Strings } from "~/lib/strings";

export const loader: LoaderFunction = Auth.loader(
  async () => {
    const posts = await Posts.getAll();
    return json({ posts }, 200);
  },
  authSession,
  authenticator
);

type LoaderData = { posts: Posts.TPostTitle[] };

export default function Index() {
  const data: LoaderData = useLoaderData();

  return (
    <Container>
      <Heading
        description={
          <span>
            Here you can view all posts and click to edit them{" "}
            <Anchor to={Links.adminNewPost} className="text-main">
              or Create a new post
            </Anchor>
          </span>
        }
      >
        All posts
      </Heading>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {data.posts.map((post) => (
          <li key={post.title}>
            <section>
              <Link
                to={Links.adminPost(post.slug)}
                className="block group link:text-sky-700 dark:link:text-sky-400 link:underline transform duration-300 link:scale-105 origin-center"
              >
                <h3 className="font-extrabold leading-snug text-2xl whitespace-pre-wrap">{post.title}</h3>
                <time className="block text-gray-400 group-hover:text-sky-400">{Strings.formatDate(new Date(post.createdAt))}</time>
                <p className="prose dark:prose-invert prose-lg group-hover:text-sky-400">{post.description}</p>
              </Link>
              <footer>
                <ul className="inline-flex gap-x-4 mt-2">
                  {post.tags.map((tag) => (
                    <li key={`${tag.tag.label}-tag-post`}>
                      <Link to={Links.adminTagFilter(tag.tag.label)} className="rounded-lg px-2 py-1 bg-main link:bg-main-dark text-slate-200">
                        {tag.tag.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </footer>
            </section>
          </li>
        ))}
      </ul>
    </Container>
  );
}
