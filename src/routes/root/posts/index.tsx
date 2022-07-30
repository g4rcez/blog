import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Auth } from "~/auth/middleware";
import { Anchor } from "~/components/anchor";
import { Container } from "~/components/container";
import { Heading } from "~/components/heading";
import { Post } from "~/components/post";
import { Posts } from "~/database/posts.server";
import { Links } from "~/lib/links";

export const loader: LoaderFunction = Auth.loader(async () =>
  json({ posts: await Posts.getAll() }, 200)
);

type LoaderData = { posts: Posts.TPostTitle[] };

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <Container>
      <Heading
        description={
          <span>
            Here you can view all posts and click to edit them{" "}
            <Anchor to={Links.rootNewPost} className="text-main">
              or Create a new post
            </Anchor>
          </span>
        }
      >
        All posts
      </Heading>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {data.posts.map((post) => (
          <Post
            key={post.title}
            post={post}
            toPostLink={Links.rootPost}
            toTagLink={Links.rootTagWithFilter}
          />
        ))}
      </ul>
    </Container>
  );
}
