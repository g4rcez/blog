import { Links, LinksFunction, LiveReload, Meta, MetaFunction, Outlet, Scripts, ScrollRestoration } from "remix";
import { Navbar } from "./components/navbar";
import css from "./styles/dist.css";

export const meta: MetaFunction = () => {
  return { title: "g4rcez Blog" };
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: css }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="w-full h-full">
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
