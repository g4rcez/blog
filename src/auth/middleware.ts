import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { ActionFunction, LoaderFunction, SessionStorage, Session } from "remix";
import type { Authenticator } from "remix-auth";
import { Links } from "~/lib/links";

export namespace Auth {
  type Middleware<T extends (...args: any) => any> = (
    loaderCallback: (ctx: Parameters<T>[0], session: Session, error: any) => ReturnType<any>,
    authSession: SessionStorage,
    authenticator: Authenticator
  ) => (ctx: DataFunctionArgs) => ReturnType<T>;

  const checkAuth = (request: Request, authenticator: Authenticator) => authenticator.isAuthenticated(request, { failureRedirect: Links.login });
  const middleware =
    <T extends Function>(loaderCallback: T, authSession: SessionStorage, authenticator: Authenticator) =>
    async (ctx: DataFunctionArgs) => {
      await checkAuth(ctx.request, authenticator);
      const session = await authSession.getSession(ctx.request.headers.get("cookie"));
      const error = session.get(authenticator.sessionErrorKey);
      return loaderCallback(ctx, session, error);
    };

  export const action: Middleware<ActionFunction> = middleware;
  export const loader: Middleware<LoaderFunction> = middleware;
}
