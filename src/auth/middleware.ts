import { LoaderFunction, createCookie, Cookie } from "remix";

export namespace Middleware {
  type LoaderParams = Parameters<LoaderFunction>[0];

  type ActionMiddleware = (params: LoaderParams, cookie: Cookie) => ReturnType<LoaderFunction> | Promise<ReturnType<LoaderFunction>>;

  export const loader = (fn: ActionMiddleware) => {
    const cookies = createCookie("cookies");

    return (context: Parameters<LoaderFunction>[0]) => fn(context, cookies);
  };
}
