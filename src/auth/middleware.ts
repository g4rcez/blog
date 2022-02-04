import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { ActionFunction, LoaderFunction, Session } from "remix";
import type { Authenticator } from "remix-auth";
import { Cookies } from "~/cookies.server";
import { Links } from "~/lib/links";
import { authenticator } from "./auth.server";

export namespace Auth {
  type Middleware<T extends (...args: any) => any> = (
    loaderCallback: (ctx: Parameters<T>[0], session: Session, error: any) => ReturnType<any>
  ) => (ctx: DataFunctionArgs) => ReturnType<T>;

  const checkAuth = (request: Request, authenticator: Authenticator) => authenticator.isAuthenticated(request, { failureRedirect: Links.login });
  const middleware =
    <T extends Function>(loaderCallback: T) =>
    async (ctx: DataFunctionArgs) => {
      await checkAuth(ctx.request, authenticator);
      const session = await Cookies.auth.getSession(ctx.request.headers.get("cookie"));
      const error = session.get(authenticator.sessionErrorKey);
      return loaderCallback(ctx, session, error);
    };

  export const action: Middleware<ActionFunction> = middleware;
  export const loader: Middleware<LoaderFunction> = middleware;

  export const isAuth = async (ctx: Parameters<LoaderFunction>[0], authenticator: Authenticator): Promise<boolean> => {
    try {
      await checkAuth(ctx.request, authenticator);
      return true;
    } catch (error) {
      return false;
    }
  };
}
