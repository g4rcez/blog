import React, { useEffect, useRef } from "react";
import { RiAddLine, RiEditLine } from "react-icons/ri";
import { ActionFunction, json, useFetcher, useLoaderData } from "remix";
import { authenticator, authSession } from "~/auth/auth.server";
import { Auth } from "~/auth/middleware";
import { ActionButton, EditButton } from "~/components/button";
import { Container } from "~/components/container";
import { Heading } from "~/components/heading";
import { Input } from "~/components/input";
import { Tags } from "~/database/tags.server";
import { Remix } from "~/globals.types";
import { Http } from "~/lib/http";
import { has } from "~/lib/utility-types";

type Tag = Tags.AllTags[0];

type Props = {
  tags: Tags.AllTags;
  tagQueryString: string;
};

const className = "flex items-center justify-center w-fit font-extrabold text-xl";

export const loader: Remix.LoaderFunction<Props> = Auth.loader(
  async ({ request }) => {
    const url = new URL(request.url);
    const tags = await Tags.getAll();
    return { tags: tags, tagQueryString: url.searchParams.get("tag") ?? "" };
  },
  authSession,
  authenticator
);

const httpMethodActions: Record<string, ActionFunction> = {
  [Http.Post]: async ({ request }) => {
    const formData = await request.formData();
    const label = formData.get("label") as string;
    const tag = await Tags.create(label);
    return json({ tag }, Http.StatusOk);
  },
  [Http.Put]: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("tagId") as string;
    const label = formData.get("label") as string;
    const tag = await Tags.update(id, label);
    return json({ tag }, Http.StatusOk);
  },
};

export const action: ActionFunction = async (context) => {
  const method = context.request.method.toLowerCase();
  if (has(httpMethodActions, method)) {
    return httpMethodActions[method](context);
  }
  return json({ notFound: true }, Http.StatusNotFound);
};

const NewTagInline: React.VFC<{ autoFocus: boolean }> = ({ autoFocus }) => {
  const form = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "loading" || fetcher.state === "submitting";
  const isAdding = fetcher.state === "submitting" && fetcher.submission.formData.get(Remix.FormActionKey) === "create";
  const skipFirst = useRef(false);

  useEffect(() => {
    if (form.current === null) return;
    if (!isAdding && autoFocus) {
      form.current.reset();
      const first = form.current.elements.namedItem("label") as HTMLInputElement;
      setTimeout(() => first.focus(), 100);
    }
    skipFirst.current = true;
  }, [isAdding]);

  return (
    <li className="my-4">
      <fetcher.Form method={Http.Post} ref={form}>
        <fieldset className={`flex flex-nowrap gap-x-4 justify-between items-end ${isSubmitting ? "opacity-25" : ""}`} disabled={isSubmitting}>
          <Input<Tag> placeholder="Label" name="label" className="w-full" required autoFocus={autoFocus} />
          <ActionButton type="submit" className={className} name={Remix.FormActionKey} value="create">
            <RiAddLine aria-label="Add new tag" />
          </ActionButton>
        </fieldset>
      </fetcher.Form>
    </li>
  );
};

const TagInline: React.VFC<{ tag: Tag | null; autoFocus: boolean }> = ({ tag, autoFocus }) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "loading" || fetcher.state === "submitting";
  return (
    <li className="my-4">
      <fetcher.Form method={Http.Put}>
        <fieldset className={`flex flex-nowrap gap-x-4 justify-between items-end ${isSubmitting ? "opacity-25" : ""}`} disabled={isSubmitting}>
          <Input<Tag> name="tagId" type="hidden" className="hidden" defaultValue={tag?.tagId} required={tag !== null} />
          <Input<Tag> placeholder="Label" name="label" defaultValue={tag?.label} className="w-full" required autoFocus={autoFocus} />
          <EditButton type="submit" className={className} name={Remix.FormActionKey} value="update">
            <RiEditLine aria-label={`Edit ${tag?.label} tag`} />
          </EditButton>
        </fieldset>
      </fetcher.Form>
    </li>
  );
};

export default function NewTagRoute() {
  const loaderData = useLoaderData<Props>();
  return (
    <Container>
      <Heading tag="h1" description="Create and update tags for blog posts">
        Tags
      </Heading>
      <ul className="list-none list-inside">
        <NewTagInline autoFocus={loaderData.tagQueryString === ""} />
        {loaderData.tags.length > 0 &&
          loaderData.tags.map((tag) => <TagInline key={tag.tagId} tag={tag} autoFocus={tag.label === loaderData.tagQueryString} />)}
      </ul>
    </Container>
  );
}
