export const Links = {
  root: "/",
  post: (name: string) => `/posts/${name}`,
  rootTagFilter: (tag: string) => `/?tag=${tag}`,
  adminNewPost: `/admin/posts/new`,
  adminPost: (slug: string) => `/admin/posts/${slug}`,
  adminTagFilter: (tag: string) => `/admin/tags?tag=${tag}`,
  adminRoot: "/admin/posts",
  login: "/login",
};
