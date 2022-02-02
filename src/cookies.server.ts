import { createCookieSessionStorage } from "remix";
require("dotenv").config();

export namespace Cookies {
  const secure = process.env.NODE_ENV === "production";
  const secrets = [process.env.SECRET_COOKIE];

  export const auth = createCookieSessionStorage({
    cookie: {
      name: "_session",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secrets,
      secure,
    },
  });

  export const theme = createCookieSessionStorage({
    cookie: {
      secure,
      secrets,
      path: "/",
      sameSite: "strict",
      name: "@blog/theme",
      expires: new Date("2039-01-01T02:59:59.999Z"),
      httpOnly: true,
    },
  });
}
