import { ActionFunction, LoaderFunction, redirect } from "remix";
import { authenticator } from "~/auth/auth.server";

export const loader: LoaderFunction = () => redirect("/login");

export const action: ActionFunction = ({ request }) => {
  return authenticator.authenticate("github", request);
};
