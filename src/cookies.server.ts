import { createCookieSessionStorage } from "remix";
require("dotenv").config();

const secure = process.env.NODE_ENV === "production";
const secrets = [process.env.SECRET_COOKIE];

export const Cookies = {
  secure: process.env.NODE_ENV === "production",
  secrets: [process.env.SECRET_COOKIE],
  auth: createCookieSessionStorage({
    cookie: {
      name: "_session",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secrets: secrets,
      secure: secure,
    },
  }),
  theme: createCookieSessionStorage({
    cookie: {
      secure,
      secrets,
      path: "/",
      sameSite: "strict",
      name: "@blog/theme",
      expires: new Date("2039-01-01T02:59:59.999Z"),
      httpOnly: true,
    },
  }),
};
