require("dotenv").config();
const Path = require("path");
const Fs = require("fs");

const colors = {
  main: {
    default: "#6366f1",
    light: "#c7d2fe",
    dark: "#3730a3",
  },
};

const menuItems = [
  {
    title: "Posts",
    link: "/root/posts",
  },
  {
    title: "New Post",
    link: "/root/posts/new",
  },
  {
    title: "Tags",
    link: "/root/tags",
  },
];

const newContent = {
  colors,
  menuItems,
  github: process.env.GITHUB || "",
  twitter: process.env.TWITTER || "",
  twitterAlt: process.env.TWITTER_ALT || "",
  urlCallback: process.env.urlCallback || ""
};

Fs.writeFileSync(Path.resolve(Path.join(process.cwd(), "src", "config.json")), JSON.stringify(newContent, null, 2), "utf-8");
