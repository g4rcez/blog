import dotenv from "dotenv";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { Cookies } from "~/cookies.server";
import { Users } from "~/database/users.server";
import ConfigJson from "../config.json";
dotenv.config();

type User = {
  name: string;
};

export const authenticator = new Authenticator<User>(Cookies.auth);

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
    callbackURL: ConfigJson.urlCallback,
  },
  async (ctx): Promise<User> => {
    const user = await Users.get(ctx.profile._json.id.toString());
    if (user === null) return Promise.reject(new UserError());
    return Promise.resolve(user);
  }
);

authenticator.use(gitHubStrategy);
