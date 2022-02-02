import { Form, redirect } from "remix";
import { authenticator } from "~/auth/auth.server";
import { Auth } from "~/auth/middleware";
import { ActionButton } from "~/components/button";
import { Container } from "~/components/container";
import { Heading } from "~/components/heading";
import { Input } from "~/components/input";
import { Textarea } from "~/components/textarea";
import { Cookies } from "~/cookies.server";
import { Posts } from "~/database/posts.server";
import { Users } from "~/database/users.server";
import { Http } from "~/lib/http";
import { Links } from "~/lib/links";

export const action = Auth.action(
  async ({ request }, session) => {
    const body = await request.formData();
    const user = await Users.getById(session.data.id);
    const post = await Posts.create({
      userId: user?.id!,
      content: body.get("content") as string,
      description: body.get("description") as string,
      title: body.get("title") as string,
    });
    return redirect(Links.rootPost(post.slug));
  },
  Cookies.auth,
  authenticator
);

export default function AdminPostRoute() {
  return (
    <Container>
      <Heading>Create a new post</Heading>
      <Form method={Http.Post}>
        <fieldset className="py-2 justify-between w-full mx-auto gap-x-8 gap-y-4 flex flex-wrap">
          <Input placeholder="Post Title" name="title" className="w-full" />
          <Textarea name="description" placeholder="Description here..." />
          <Textarea name="content" placeholder="Content here..." />
        </fieldset>
        <ActionButton type="submit">Save</ActionButton>
      </Form>
    </Container>
  );
}
