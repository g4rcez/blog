import { Links, LinksFunction, LiveReload, LoaderFunction, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "remix";
import { authenticator } from "./auth/auth.server";
import { Auth } from "./auth/middleware";
import { Navbar } from "./components/navbar";
import { ThemeProvider, useTheme } from "./components/theme.provider";
import ConfigJson from "./config.json";
import { Themes } from "./lib/theme";
import { themeCookies } from "./routes/api/theme";
import css from "./styles/dist.css";

export const loader: LoaderFunction = async (ctx) => {
  const isAuth = await Auth.isAuth(ctx, authenticator);
  const themes = await themeCookies(ctx.request);
  return { menuItems: isAuth ? ConfigJson.menuItems : [], theme: themes.get() || Themes.Null };
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: css }];

const Wrap: React.VFC<{ items: any[] }> = (props) => {
  const [theme] = useTheme();
  return (
    <html lang="pt-BR" className={theme === Themes.Dark ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <title>g4rcez Blog</title>
        <meta name="description" content="g4rcez blog" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap" rel="stylesheet" />
        <meta name="theme-color" content={ConfigJson.colors.main.default} />
        <meta name="color-scheme" content={theme === Themes.Dark ? "dark light" : "light dark"} />
        <Meta />
        <Links />
      </head>
      <body className="w-full h-full">
        <Navbar items={props.items} />
        <main className="px-4 sm:px-0">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === "development" && <LiveReload />}
        </main>
      </body>
    </html>
  );
};

export default function App() {
  const loaderData = useLoaderData();
  return (
    <ThemeProvider initialTheme={loaderData.theme}>
      <Wrap items={loaderData.menuItems} />
    </ThemeProvider>
  );
}
