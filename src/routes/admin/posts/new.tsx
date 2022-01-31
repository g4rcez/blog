import { ActionFunction, Form } from "remix";
import { ActionButton } from "~/components/button";
import { Container } from "~/components/container";
import { Heading } from "~/components/heading";
import { Input } from "~/components/input";
import { Textarea } from "~/components/textarea";
import { Posts } from "~/database/posts.server";
import { Http } from "~/lib/http";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  return Posts.create({
    content: body.get("content") as string,
    description: body.get("description") as string,
    title: body.get("title") as string,
  });
};

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
