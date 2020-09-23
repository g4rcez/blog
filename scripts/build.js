const { ENTRY, POSTS, indexHtml, indexMd, meta } = require("./defaults");
const fs = require("fs");
const path = require("path");

const getFiles = (path) => fs.readdirSync(path);

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const posts = [];

const readingTime = (text = "") => Math.ceil(text.split(" ").length / 250);

const promises = getDirectories(POSTS).map(async (directory) => {
  const folder = path.join(POSTS, directory);
  const items = [meta, indexMd, indexHtml];
  const metaFilename = path.join(folder, meta);
  const mdFilename = path.join(folder, indexMd);
  const htmlFilename = path.join(folder, indexHtml);
  const files = getFiles(path.join(folder)).filter((x) => !items.includes(x));

  const hasTranslation = files.length > 0;
  const metaContent = JSON.parse(fs.readFileSync(metaFilename, "utf-8") || {});

  const mainFilename = fs.existsSync(mdFilename) ? mdFilename : htmlFilename;

  const stat = fs.statSync(mainFilename);
  const createdAt = stat.birthtime;
  const modifiedAt = stat.mtimeMs;
  const mainFileContent = fs.readFileSync(mainFilename, "utf-8");

  posts.push({
    ...metaContent,
    createdAt,
    img: `/img/${metaContent.img}.png`,
    hasTranslation,
    modifiedAt,
    path: directory,
    readingTime: readingTime(mainFileContent),
    languages: files.map((x) => x.replace(".md", "").replace(".html", "")),
    extension: mainFilename.endsWith(".html") ? "html" : "md"
  });
});

(async () => {
  await Promise.all(promises);
  posts.sort((a, b) => b.createdAt - a.createdAt);
  fs.writeFileSync(ENTRY, JSON.stringify(posts), { encoding: "utf-8" });
})();
