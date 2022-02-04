export const Links = {
  root: "/",
  post: (name: string) => `/posts/${name}`,
  indexTagWithFilter: (tag: string) => `/?tag=${tag}`,
  rootNewPost: `/root/posts/new`,
  rootPost: (slug: string) => `/root/posts/${slug}`,
  rootTagWithFilter: (tag: string) => `/root/tags?tag=${tag}`,
  rootIndex: "/root/posts",
  login: "/login",
  postApiTheme: "/api/theme"
};
