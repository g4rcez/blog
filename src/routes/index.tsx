import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { Fragment } from "react";
import { ActionButton, ResetButton } from "~/components/button";
import { Container } from "~/components/container";
import { Heading } from "~/components/heading";
import { Post } from "~/components/post";
import { Posts } from "~/database/posts.server";
import { Tags } from "~/database/tags.server";
import { Http } from "~/lib/http";
import { Links } from "~/lib/links";

export const loader = async (ctx: DataFunctionArgs) => {
  const url = new URL(ctx.request.url);
  const tag = url.searchParams.get("tag") ?? undefined;
  const action = url.searchParams.get("_action") ?? "";
  const tags = await Tags.getAll();
  const posts = await Posts.getAll(action === "reset" ? undefined : tag);
  return json(
    { posts, tag, tags },
    {
      status: 200,
      headers: {
        "Cache-Control": "max-age=86400, must-revalidate",
      },
    }
  );
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container>
      <header>
        <Heading>Topics</Heading>
        <Form method={Http.Get} className="mb-12 gap-x-2 flex flex-wrap">
          {data.tags.map((x) => (
            <ActionButton type="submit" name="tag" value={x.label}>
              {x.label}
            </ActionButton>
          ))}
          <ResetButton type="reset" name="_action">
            Reset
          </ResetButton>
        </Form>
      </header>
      <section className="mt-4">
        <Heading>My Posts</Heading>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {(data.posts.length === 0 && (
            <li>
              {data.tag ? (
                <Fragment>
                  No posts with <b>{data.tag}</b>
                </Fragment>
              ) : (
                <Fragment>No posts in blog :/</Fragment>
              )}
            </li>
          )) ||
            data.posts.map((post) => (
              <Post
                post={post}
                key={post.title}
                toPostLink={Links.post}
                toTagLink={Links.indexTagWithFilter}
              />
            ))}
        </ul>
      </section>
    </Container>
  );
}
