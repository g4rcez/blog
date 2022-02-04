import { DataFunctionArgs } from "@remix-run/server-runtime";
import { Fragment, useRef } from "react";
import { Form, LoaderFunction, useLoaderData } from "remix";
import { ActionButton, ResetButton } from "~/components/button";
import { Container } from "~/components/container";
import { Input } from "~/components/input";
import { Post } from "~/components/post";
import { Posts } from "~/database/posts.server";
import { Http } from "~/lib/http";
import { Links } from "~/lib/links";

export const loader: LoaderFunction = async (ctx: DataFunctionArgs) => {
  const url = new URL(ctx.request.url);
  const tag = url.searchParams.get("tag") ?? undefined;
  const action = url.searchParams.get("_action") ?? "";
  const posts = await Posts.getAll(action === "reset" ? undefined : tag);
  return { posts, tag };
};

type LoaderData = { posts: Posts.TPostTitle[]; tag: string };

export default function Index() {
  const loaderData: LoaderData = useLoaderData();
  const form = useRef<HTMLFormElement>(null);

  return (
    <Container>
      <Form method={Http.Get} className="mb-12 gap-x-2" ref={form}>
        <Input name="tag" placeholder="Filter by subject..." className="w-full" />
        <fieldset className="flex gap-x-4 mt-2">
          <ActionButton className="h-fit" type="submit">
            Filter
          </ActionButton>
          <ResetButton onClick={() => form.current?.reset()} className="h-fit" type="submit" name="_action" value="reset">
            Reset
          </ResetButton>
        </fieldset>
      </Form>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {(loaderData.posts.length === 0 && (
          <li>
            {loaderData.tag ? (
              <Fragment>
                No posts with <b>{loaderData.tag}</b>
              </Fragment>
            ) : (
              <Fragment>No posts in blog :/</Fragment>
            )}
          </li>
        )) ||
          loaderData.posts.map((post) => <Post key={post.title} post={post} toPostLink={Links.post} toTagLink={Links.indexTagWithFilter} />)}
      </ul>
    </Container>
  );
}
