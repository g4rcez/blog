import { VscGithub } from "react-icons/vsc";
import { ActionFunction, Form, LoaderFunction } from "remix";
import { authenticator } from "~/auth/auth.server";
import { ActionButton } from "~/components/button";
import { Container } from "~/components/container";
import { Links } from "~/lib/links";

export const action: ActionFunction = async ({ request }) => {
  return authenticator.authenticate("user-pass", request, {
    successRedirect: Links.rootIndex,
    failureRedirect: Links.login,
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  return authenticator.isAuthenticated(request, { successRedirect: Links.rootIndex });
};

export default function Login() {
  return (
    <Container>
      <Form action="/auth/github" method="post" className="flex items-center justify-center">
        <ActionButton className="flex items-center">
          <VscGithub aria-hidden="true" className="inline-block mr-2" />
          Login with GitHub
        </ActionButton>
      </Form>
    </Container>
  );
}
