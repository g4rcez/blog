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

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.post as string;
  const post = await Posts.findOne(slug);
  const tags = await Tags.getAll();
  if (post === null) {
    return json({ error: `Not found ${slug}` }, Http.StatusNotFound);
  }
  return json({ post, tags }, Http.StatusNotFound);
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  await Posts.update({
    tags: data.getAll("tags") as string[],
    content: data.get("content") as string,
    postId: data.get("postId") as string,
    description: data.get("description") as string,
    published: data.get("published")?.toString() === "on",
    title: data.get("title") as string,
  });
  return redirect(Links.adminPosts);
};

type Post = NonNullable<Posts.PostDetailed>;

type Props = {
  post: Post;
  tags: Tags.AllTags;
};

export default function PostEditRoute() {
  const { post, tags } = useLoaderData<Props>();
  const fetcher = useFetcher();
  const transition = useTransition();

  return (
    <Container>
      <Heading description={post.description}>{post.title}</Heading>
      <fetcher.Form method={Http.Post}>
        <input type="hidden" value={post.postId} name="postId" />
        <fieldset disabled={transition.state === "submitting"} className="py-2 justify-between w-full mx-auto gap-8 flex flex-wrap">
          <Switch<Post> name="published" defaultChecked={post.published}>
            Publish post?
          </Switch>
          <div className="w-full">
            <p className="mb-2">Select post tags:</p>
            <select required multiple name="tags" className="dark:bg-black text-slate-200 w-1/3 h-36">
              {tags.map((tag) => (
                <option value={tag.tagId} className="capitalize">
                  {tag.label}
                </option>
              ))}
            </select>
          </div>
          <Input<Post> defaultValue={post.title} name="title" placeholder="Title" required className="w-full" />
          <Input<Post> defaultValue={new Date(post.createdAt).toISOString()} name="createdAt" placeholder="Created At" required className="w-full" />
          <Textarea<Post> required placeholder="Description" defaultValue={post.description} name="description" />
          <Textarea<Post> required placeholder="Content" defaultValue={post.content} name="content" rows={90} />
        </fieldset>
        <ActionButton type="submit">Update post</ActionButton>
      </fetcher.Form>
    </Container>
  );
}
