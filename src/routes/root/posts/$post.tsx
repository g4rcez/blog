import { useEffect, useRef, useState } from "react";
import { ActionFunction, Form, json, LoaderFunction, redirect, useActionData, useLoaderData, useTransition } from "remix";
import { authenticator } from "~/auth/auth.server";
import { Auth } from "~/auth/middleware";
import { ActionButton } from "~/components/button";
import { Callout } from "~/components/callout";
import { Container } from "~/components/container";
import { Heading } from "~/components/heading";
import { Input } from "~/components/input";
import { Switch } from "~/components/switch";
import { Textarea } from "~/components/textarea";
import { Cookies } from "~/cookies.server";
import { Posts } from "~/database/posts.server";
import { Tags } from "~/database/tags.server";
import { Http } from "~/lib/http";
import { Links } from "~/lib/links";
import { Strings } from "~/lib/strings";
import { Nullable } from "~/lib/utility-types";

export const loader: LoaderFunction = Auth.loader(
  async ({ params }) => {
    const slug = params.post as string;
    const post = await Posts.findOne(slug);
    const tags = await Tags.getAll();
    if (post === null) {
      return json({ error: `Not found ${slug}`, posts: [], tags }, Http.StatusNotFound);
    }
    return json({ post, tags, error: null, oldTitle: post.title }, Http.StatusNotFound);
  },
  Cookies.auth,
  authenticator
);

export const action: ActionFunction = Auth.action(
  async ({ request }) => {
    const data = await request.formData();
    const title = data.get("title") as string;
    const slug = Strings.slugify(title);
    const post = await Posts.update({
      title,
      postId: data.get("postId") as string,
      tags: data.getAll("tags") as string[],
      content: data.get("content") as string,
      description: data.get("description") as string,
      published: data.get("published")?.toString() === "on",
    });
    if (slug !== data.get("oldLink")) {
      return redirect(Links.rootPost(post.slug));
    }
    return { savedAt: new Date().toISOString() };
  },
  Cookies.auth,
  authenticator
);

type Post = NonNullable<Posts.PostDetailed>;

type Props = {
  post: Nullable<Post>;
  tags: Tags.AllTags;
  error: Nullable<string>;
};

export default function PostEditRoute() {
  const { post, tags, error } = useLoaderData<Props>();
  const transition = useTransition();
  const actionData = useActionData<{ savedAt: Date }>();
  const form = useRef<HTMLFormElement>(null);
  const [show, setShow] = useState(false);

  console.log({ show }, actionData);

  useEffect(() => {
    if (actionData?.savedAt) setShow(true);
  }, [actionData?.savedAt]);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key.toLowerCase() === "s") {
          if (form.current) {
            form.current.submit();
          }
        }
      }
    });
  }, []);

  if (post === null) return <Container>{error}</Container>;

  const contentLines = post.content.split("\n").length + 1;

  return (
    <Container>
      <Heading description={post.description}>{post.title}</Heading>
      <Callout show={show} onChange={setShow} className="dark:border-l-main border-l-main">
        {post.title} saved at <b className="text-main">{actionData?.savedAt && Strings.formatDate(new Date(actionData?.savedAt))}</b>!
      </Callout>
      <Form method={Http.Post} ref={form}>
        <input type="hidden" value={post.postId} name="postId" />
        <input type="hidden" value={post.slug} name="oldLink" />
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
              defaultValue={post.tags.map((tag) => tag.tag.tagId)}
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
      </Form>
    </Container>
  );
}
