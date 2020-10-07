const { ENTRY, POSTS } = require("./defaults");
const fs = require("fs");
const exec = require("./parser");

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const posts = [];

const promises = getDirectories(POSTS).map(async (directory) => {
  const { date, ...r } = await exec(directory);
  posts.push({
    ...r,
    subjects: r.subjects || [],
    createdAt: date,
    img: "",
    path: directory,
    url: `/post/${directory}`
  });
});

(async () => {
  await Promise.all(promises);
  posts.sort((a, b) => b.createdAt - a.createdAt);
  fs.writeFileSync(ENTRY, JSON.stringify(posts), { encoding: "utf-8" });
})();
