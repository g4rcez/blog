import { ActionFunction, json } from "@remix-run/node";
import { Cookies } from "~/cookies.server";
import { Themes, validateTheme } from "~/lib/theme";

export const themeCookies = async (request: Request) => {
  const session = await Cookies.theme.getSession(request.headers.get("Cookie"));
  return {
    get: () => {
      const themeValue = session.get("theme");
      return validateTheme(themeValue) ? themeValue : Themes.Null;
    },
    set: (theme: Themes) => session.set("theme", theme),
    change: () =>
      Cookies.theme.commitSession(session, { expires: new Date("2077-01-01") }),
  };
};

export const action: ActionFunction = async ({ request }) => {
  const themeSession = await themeCookies(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get("theme");
  if (!validateTheme(theme)) {
    return json({ ok: false, message: "Accept only light or dark themes" });
  }
  themeSession.set(theme as Themes);
  const cookie = await themeSession.change();
  return json(
    { ok: true, message: "Theme changed" },
    { headers: { "Set-Cookie": cookie } }
  );
};
