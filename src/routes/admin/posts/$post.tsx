import { useEffect, useRef } from "react";
import { ActionFunction, json, LoaderFunction, redirect, useFetcher, useLoaderData, useTransition } from "remix";
import { ActionButton } from "~/components/button";
import { Container } from "~/components/container";
import { Heading } from "~/components/heading";
import { Input } from "~/components/input";
import { Switch } from "~/components/switch";
import { Textarea } from "~/components/textarea";
import { Posts } from "~/database/posts.server";
import { Tags } from "~/database/tags.server";
import { Http } from "~/lib/http";
import { Links } from "~/lib/links";
import { Nullable } from "~/lib/utility-types";

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.post as string;
  const post = await Posts.findOne(slug);
  const tags = await Tags.getAll();
  if (post === null) {
    return json({ error: `Not found ${slug}`, posts: [], tags }, Http.StatusNotFound);
  }
  return json({ post, tags, error: null }, Http.StatusNotFound);
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const post = await Posts.update({
    tags: data.getAll("tags") as string[],
    content: data.get("content") as string,
    postId: data.get("postId") as string,
    description: data.get("description") as string,
    published: data.get("published")?.toString() === "on",
    title: data.get("title") as string,
  });
  return redirect(Links.adminPost(post.slug));
};

type Post = NonNullable<Posts.PostDetailed>;

type Props = {
  post: Nullable<Post>;
  tags: Tags.AllTags;
  error: Nullable<string>;
};

export default function PostEditRoute() {
  const { post, tags, error } = useLoaderData<Props>();
  const fetcher = useFetcher();
  const transition = useTransition();
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key.toLowerCase() === "s") {
          if (form.current) {
            event.preventDefault();
            fetcher.submit(form.current);
            return false;
          }
        }
      }
    });
  }, [fetcher]);

  if (post === null) return <Container>{error}</Container>;

  const contentLines = post.content.split("\n").length + 1;

  return (
    <Container>
      <Heading description={post.description}>{post.title}</Heading>
      <fetcher.Form method={Http.Post} ref={form}>
        <input type="hidden" value={post.postId} name="postId" />
        <fieldset disabled={transition.state === "submitting"} className="py-2 justify-between w-full mx-auto gap-8 flex flex-wrap">
          <Switch<Post> name="published" defaultChecked={post.published}>
            Publish post?
          </Switch>
          <div className="w-full">
            <p className="mb-2">Select post tags:</p>
            <select
              required
              multiple
              name="tags"
              className="dark:bg-black text-slate-200 w-1/3 h-36 overflow-y-auto rounded-lg border border-black"
              defaultValue={post.tags.map((tag) => tag.tagId)}
            >
              {tags.map((tag) => (
                <option key={tag.tagId} value={tag.tagId} className="capitalize">
                  {tag.label}
                </option>
              ))}
            </select>
          </div>
          <Input<Post> defaultValue={post.title} name="title" placeholder="Title" required className="w-full" />
          <Input<Post> defaultValue={new Date(post.createdAt).toISOString()} name="createdAt" placeholder="Created At" required className="w-full" />
          <Textarea<Post> required placeholder="Description" defaultValue={post.description} name="description" />
          <Textarea<Post> required placeholder="Content" defaultValue={post.content} name="content" rows={contentLines} spellCheck />
        </fieldset>
        <ActionButton type="submit">Update post</ActionButton>
      </fetcher.Form>
    </Container>
  );
}
