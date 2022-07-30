import { VscGithub } from "react-icons/vsc";
import { Form } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";
import { ActionButton } from "~/components/button";
import { Container } from "~/components/container";
import { Links } from "~/lib/links";

export const action: ActionFunction = async ({ request }) =>
  authenticator.authenticate("user-pass", request, {
    successRedirect: Links.rootIndex,
    failureRedirect: Links.login,
  });

export const loader: LoaderFunction = async ({ request }) =>
  authenticator.isAuthenticated(request, {
    successRedirect: Links.rootIndex,
  });

export default function Login() {
  return (
    <Container>
      <Form
        action="/auth/github"
        method="post"
        className="flex items-center justify-center"
      >
        <ActionButton className="flex items-center">
          <VscGithub aria-hidden="true" className="inline-block mr-2" />
          Login with GitHub
        </ActionButton>
      </Form>
    </Container>
  );
}
