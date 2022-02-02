import { Links, LinksFunction, LiveReload, LoaderFunction, Meta, MetaFunction, Outlet, Scripts, ScrollRestoration, useLoaderData } from "remix";
import { authenticator } from "./auth/auth.server";
import { Auth } from "./auth/middleware";
import { Navbar } from "./components/navbar";
import css from "./styles/dist.css";
import ConfigJson from "./config.json";
import { ThemeProvider } from "./components/theme.provider";
import { themeCookies } from "./routes/api/theme";
import { Themes } from "./lib/theme";

export const meta: MetaFunction = () => {
  return { title: "g4rcez Blog", "theme-color": ConfigJson.colors.main.default, "color-scheme": "" };
};

export const loader: LoaderFunction = async (ctx) => {
  const isAuth = await Auth.isAuth(ctx, authenticator);
  const themes = await themeCookies(ctx.request);
  return { menuItems: isAuth ? ConfigJson.menuItems : [], theme: themes.get() || Themes.Null };
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: css }];

export default function App() {
  const loaderData = useLoaderData();
  const theme = loaderData.theme;
  return (
    <ThemeProvider initialTheme={theme}>
      <html lang="pt-BR" className={theme === Themes.Dark ? "dark" : ""}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
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
