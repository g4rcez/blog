import fs from "fs";
import matter from "gray-matter";
import http from "http";
import path from "path";
import puppeteer from "puppeteer";

const root = path.resolve(process.cwd());

type Metadata = {
  title: string;
  description: string;
  subjects: string[];
  date: string;
};

const server = http.createServer((req, res) => {
  try {
    const url = req.url ?? "";
    const [, post = ""] = url.split("/");
    const postPath = path.join(root, "_posts", `${post}.md`);

    const content = fs.readFileSync(postPath, { encoding: "utf-8" });
    const metadata: Metadata = matter(content).data as never;

    const template = fs.readFileSync(
      path.resolve(path.join(root, "open-graph-bot", "template.html")),
      { encoding: "utf-8" }
    );

    const data = {
      title: metadata.title,
      description: metadata.description,
      tags: metadata.subjects
        .map((x) => `<li>${x}</li>`)
        .slice(0, 2)
        .join(" "),
      releaseDate: new Intl.DateTimeFormat("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: false,
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(metadata.date)),
      time: `${Math.ceil(content.split(" ").length / 250)} min`,
    };

    const html = Object.entries(data).reduce(
      (acc, [key, val]) =>
        acc.replace(new RegExp(`{{(|\\s+)${key}(|\\s+)}}`), val),
      template
    );

    res.setHeader("Content-Type", "text/html");
    res.write(html);
    res.end();
  } catch (error) {
    console.log(error);
    res.statusCode = 404;
    res.end();
  }
});

server.listen(5000);

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      height: 210,
      width: 750,
    },
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const imagePath = path.resolve(path.join(root, "public", "post-graph"));
  const allPosts = fs.readdirSync(path.join(root, "_posts"));
  try {
    await Promise.allSettled(
      allPosts.map(async (x) => {
        const post = x.replace(/\.md/, "");
        console.log("Printing", post);
        const page = await browser.newPage();
        await page.goto(`http://localhost:5000/${post}`);
        await page.screenshot({
          path: path.join(imagePath, `${post}.png`),
          encoding: "binary",
        });
        await page.close();
      })
    );
  } catch (error) {
    console.log(error);
  } finally {
    console.log("print page");
    process.exit(0);
  }
})();
