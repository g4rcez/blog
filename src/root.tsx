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

export default function App() {
  const loaderData = useLoaderData();
  const [theme] = useTheme();
  return (
    <ThemeProvider initialTheme={theme}>
      <html lang="pt-BR" className={theme === Themes.Dark ? "dark" : ""}>
        <head>
          <meta charSet="utf-8" />
          <title>g4rcez Blog</title>
          <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
          <meta name="theme-color" content={ConfigJson.colors.main.default} />
          <meta name="color-scheme" content={theme === Themes.Dark ? "dark light" : "light dark"} />
          <Meta />
          <Links />
        </head>
        <body className="w-full h-full">
          <Navbar items={loaderData.menuItems} />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === "development" && <LiveReload />}
        </body>
      </html>
    </ThemeProvider>
  );
}
