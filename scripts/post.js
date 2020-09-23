const fs = require("fs");
const path = require("path");
const { ENTRY, POSTS, indexHtml, indexMd, meta } = require("./defaults");

const [postName, description = []] = process.argv.slice(2);

const slugify = (str = "") => str.toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");

if (!postName) {
  throw new Error("Postname cannot be nil");
}

const name = slugify(postName);

const publicPath = path.join(POSTS, name);
const entrypoint = path.join(publicPath, indexMd);
const metadata = path.join(publicPath, meta);

fs.mkdirSync(publicPath);
fs.writeFileSync(entrypoint, `# ${postName}`, { encoding: "utf-8" });
fs.writeFileSync(metadata, `{ "description": "${description}" }`, { encoding: "utf-8" });
