import { LoaderFunction } from "remix";
import { authenticator } from "~/auth/auth.server";
import { Links } from "~/lib/links";

export let loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate("github", request, {
    successRedirect: Links.rootIndex,
    failureRedirect: "/login",
  });
};
