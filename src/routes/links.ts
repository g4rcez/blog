import { Extension } from "../blog/post.type";
export const Links = {
  root: "/",
  post: "/post/:title",
  getPost: (title: string, extension?: Extension, lang?: string) => {
    const url = new URL("https://localhost");
    url.pathname = `/post/${title}`;
    if (extension) url.searchParams.set("extension", extension);
    if (lang) url.searchParams.set("lang", lang);
    return `${url.pathname}${url.search}`;
  }
};