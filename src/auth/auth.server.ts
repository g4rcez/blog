import dotenv from "dotenv";
import { createCookieSessionStorage } from "remix";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { Users } from "~/database/users.server";
dotenv.config();

type User = {
  name: string;
};

export const authSession = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["s3cr3t"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const authenticator = new Authenticator<User>(authSession);

class UserError extends Error {
  constructor() {
    super("UserError");
    this.message = "UserError";
    this.name = "UserError";
  }
}

const gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    callbackURL: "http://localhost:3000/auth/callback/github",
  },
  async (ctx): Promise<User> => {
    const user = await Users.get(ctx.profile._json.id.toString());
    if (user === null) return Promise.reject(new UserError());
    return Promise.resolve(user);
  }
);

authenticator.use(gitHubStrategy);
