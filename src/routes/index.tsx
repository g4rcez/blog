import { Link, LoaderFunction, useLoaderData } from "remix";
import { Files } from "~/lib/files.server";
import { Links } from "~/lib/links";

export const loader: LoaderFunction = async () => {
  const posts = await Files.listAllPosts();
  return { posts };
};

export default function Index() {
  const data: { posts: Files.PostFile[] } = useLoaderData();
  return (
    <div className="mx-auto py-2 container w-full max-w-6xl">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {data.posts.map((post) => (
          <li key={post.title}>
            <Link
              className="block group link:text-sky-700 dark:link:text-sky-400 link:underline transform duration-300 link:scale-105 origin-center"
              to={Links.post(post.slug)}
            >
              <h3 className="font-extrabold leading-snug text-2xl whitespace-pre-wrap">{post.title}</h3>
              <time className="text-gray-400 group-hover:text-sky-400">{new Date(post.date).toDateString()}</time>
              <p className="prose dark:prose-invert prose-lg group-hover:text-sky-400">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
