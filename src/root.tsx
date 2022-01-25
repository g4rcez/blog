import type { MetaFunction } from "remix";
import { Links, LinksFunction, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "remix";
import { Navbar } from "./components/navbar";
import css from "./styles/dist.css";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: css }];

export default function App() {
  return (
    <html lang="en" className="dark:bg-gray-900 dark:text-slate-200">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="w-full container mx-auto">
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
