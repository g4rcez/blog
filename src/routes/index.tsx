import { json, Link, LoaderFunction, useLoaderData } from "remix";
import { Container } from "~/components/container";
import { Posts } from "~/database/posts.server";
import { Links } from "~/lib/links";

export const loader: LoaderFunction = async () => {
  const posts = await Posts.getAll();
  return json({ posts }, 200);
};

type LoaderData = { posts: Posts.TPostTitle[] };

export default function Index() {
  const data: LoaderData = useLoaderData();

  return (
    <Container>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {data.posts.map((post) => (
          <li key={post.title}>
            <section>
              <Link
                to={Links.post(post.slug)}
                className="block group link:text-sky-700 dark:link:text-sky-400 link:underline transform duration-300 link:scale-105 origin-center"
              >
                <h3 className="font-extrabold leading-snug text-2xl whitespace-pre-wrap">{post.title}</h3>
                <time className="text-gray-400 group-hover:text-sky-400">{new Date(post.createdAt).toDateString()}</time>
                <p className="prose dark:prose-invert prose-lg group-hover:text-sky-400">{post.description}</p>
              </Link>
              <footer>
                <ul className="inline-flex gap-x-4 mt-2">
                  {post.tags.map((tag) => (
                    <li key={`${tag.tag.label}-tag-post`}>
                      <Link to={Links.rootTagFilter(tag.tag.label)} className="rounded-lg px-2 py-1 bg-main link:bg-main-dark text-slate-200">
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
