var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React;
var init_react = __esm({
  "node_modules/@remix-run/dev/compiler/shims/react.ts"() {
    React = __toModule(require("react"));
  }
});

// node_modules/remix/client.js
var require_client = __commonJS({
  "node_modules/remix/client.js"(exports) {
    init_react();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var react = require("@remix-run/react");
    Object.defineProperty(exports, "Form", {
      enumerable: true,
      get: function() {
        return react.Form;
      }
    });
    Object.defineProperty(exports, "Link", {
      enumerable: true,
      get: function() {
        return react.Link;
      }
    });
    Object.defineProperty(exports, "Links", {
      enumerable: true,
      get: function() {
        return react.Links;
      }
    });
    Object.defineProperty(exports, "LiveReload", {
      enumerable: true,
      get: function() {
        return react.LiveReload;
      }
    });
    Object.defineProperty(exports, "Meta", {
      enumerable: true,
      get: function() {
        return react.Meta;
      }
    });
    Object.defineProperty(exports, "NavLink", {
      enumerable: true,
      get: function() {
        return react.NavLink;
      }
    });
    Object.defineProperty(exports, "Outlet", {
      enumerable: true,
      get: function() {
        return react.Outlet;
      }
    });
    Object.defineProperty(exports, "PrefetchPageLinks", {
      enumerable: true,
      get: function() {
        return react.PrefetchPageLinks;
      }
    });
    Object.defineProperty(exports, "RemixBrowser", {
      enumerable: true,
      get: function() {
        return react.RemixBrowser;
      }
    });
    Object.defineProperty(exports, "RemixServer", {
      enumerable: true,
      get: function() {
        return react.RemixServer;
      }
    });
    Object.defineProperty(exports, "Scripts", {
      enumerable: true,
      get: function() {
        return react.Scripts;
      }
    });
    Object.defineProperty(exports, "ScrollRestoration", {
      enumerable: true,
      get: function() {
        return react.ScrollRestoration;
      }
    });
    Object.defineProperty(exports, "useActionData", {
      enumerable: true,
      get: function() {
        return react.useActionData;
      }
    });
    Object.defineProperty(exports, "useBeforeUnload", {
      enumerable: true,
      get: function() {
        return react.useBeforeUnload;
      }
    });
    Object.defineProperty(exports, "useCatch", {
      enumerable: true,
      get: function() {
        return react.useCatch;
      }
    });
    Object.defineProperty(exports, "useFetcher", {
      enumerable: true,
      get: function() {
        return react.useFetcher;
      }
    });
    Object.defineProperty(exports, "useFetchers", {
      enumerable: true,
      get: function() {
        return react.useFetchers;
      }
    });
    Object.defineProperty(exports, "useFormAction", {
      enumerable: true,
      get: function() {
        return react.useFormAction;
      }
    });
    Object.defineProperty(exports, "useHref", {
      enumerable: true,
      get: function() {
        return react.useHref;
      }
    });
    Object.defineProperty(exports, "useLoaderData", {
      enumerable: true,
      get: function() {
        return react.useLoaderData;
      }
    });
    Object.defineProperty(exports, "useLocation", {
      enumerable: true,
      get: function() {
        return react.useLocation;
      }
    });
    Object.defineProperty(exports, "useMatches", {
      enumerable: true,
      get: function() {
        return react.useMatches;
      }
    });
    Object.defineProperty(exports, "useNavigate", {
      enumerable: true,
      get: function() {
        return react.useNavigate;
      }
    });
    Object.defineProperty(exports, "useNavigationType", {
      enumerable: true,
      get: function() {
        return react.useNavigationType;
      }
    });
    Object.defineProperty(exports, "useOutlet", {
      enumerable: true,
      get: function() {
        return react.useOutlet;
      }
    });
    Object.defineProperty(exports, "useOutletContext", {
      enumerable: true,
      get: function() {
        return react.useOutletContext;
      }
    });
    Object.defineProperty(exports, "useParams", {
      enumerable: true,
      get: function() {
        return react.useParams;
      }
    });
    Object.defineProperty(exports, "useResolvedPath", {
      enumerable: true,
      get: function() {
        return react.useResolvedPath;
      }
    });
    Object.defineProperty(exports, "useSearchParams", {
      enumerable: true,
      get: function() {
        return react.useSearchParams;
      }
    });
    Object.defineProperty(exports, "useSubmit", {
      enumerable: true,
      get: function() {
        return react.useSubmit;
      }
    });
    Object.defineProperty(exports, "useTransition", {
      enumerable: true,
      get: function() {
        return react.useTransition;
      }
    });
  }
});

// node_modules/remix/server.js
var require_server = __commonJS({
  "node_modules/remix/server.js"(exports) {
    init_react();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var serverRuntime = require("@remix-run/server-runtime");
    Object.defineProperty(exports, "createCookie", {
      enumerable: true,
      get: function() {
        return serverRuntime.createCookie;
      }
    });
    Object.defineProperty(exports, "createCookieSessionStorage", {
      enumerable: true,
      get: function() {
        return serverRuntime.createCookieSessionStorage;
      }
    });
    Object.defineProperty(exports, "createMemorySessionStorage", {
      enumerable: true,
      get: function() {
        return serverRuntime.createMemorySessionStorage;
      }
    });
    Object.defineProperty(exports, "createSession", {
      enumerable: true,
      get: function() {
        return serverRuntime.createSession;
      }
    });
    Object.defineProperty(exports, "createSessionStorage", {
      enumerable: true,
      get: function() {
        return serverRuntime.createSessionStorage;
      }
    });
    Object.defineProperty(exports, "isCookie", {
      enumerable: true,
      get: function() {
        return serverRuntime.isCookie;
      }
    });
    Object.defineProperty(exports, "isSession", {
      enumerable: true,
      get: function() {
        return serverRuntime.isSession;
      }
    });
    Object.defineProperty(exports, "json", {
      enumerable: true,
      get: function() {
        return serverRuntime.json;
      }
    });
    Object.defineProperty(exports, "redirect", {
      enumerable: true,
      get: function() {
        return serverRuntime.redirect;
      }
    });
  }
});

// node_modules/remix/platform.js
var require_platform = __commonJS({
  "node_modules/remix/platform.js"(exports) {
    init_react();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var node = require("@remix-run/node");
    Object.defineProperty(exports, "createFileSessionStorage", {
      enumerable: true,
      get: function() {
        return node.createFileSessionStorage;
      }
    });
    Object.defineProperty(exports, "unstable_createFileUploadHandler", {
      enumerable: true,
      get: function() {
        return node.unstable_createFileUploadHandler;
      }
    });
    Object.defineProperty(exports, "unstable_createMemoryUploadHandler", {
      enumerable: true,
      get: function() {
        return node.unstable_createMemoryUploadHandler;
      }
    });
    Object.defineProperty(exports, "unstable_parseMultipartFormData", {
      enumerable: true,
      get: function() {
        return node.unstable_parseMultipartFormData;
      }
    });
  }
});

// node_modules/remix/index.js
var require_remix = __commonJS({
  "node_modules/remix/index.js"(exports) {
    init_react();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var client = require_client();
    var server = require_server();
    var platform = require_platform();
    Object.keys(client).forEach(function(k) {
      if (k !== "default" && !exports.hasOwnProperty(k))
        Object.defineProperty(exports, k, {
          enumerable: true,
          get: function() {
            return client[k];
          }
        });
    });
    Object.keys(server).forEach(function(k) {
      if (k !== "default" && !exports.hasOwnProperty(k))
        Object.defineProperty(exports, k, {
          enumerable: true,
          get: function() {
            return server[k];
          }
        });
    });
    Object.keys(platform).forEach(function(k) {
      if (k !== "default" && !exports.hasOwnProperty(k))
        Object.defineProperty(exports, k, {
          enumerable: true,
          get: function() {
            return platform[k];
          }
        });
    });
  }
});

// <stdin>
__export(exports, {
  assets: () => import_assets.default,
  entry: () => entry,
  routes: () => routes
});
init_react();

// src/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
init_react();
var import_server = __toModule(require("react-dom/server"));
var import_remix = __toModule(require_remix());
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const markup = (0, import_server.renderToString)(/* @__PURE__ */ React.createElement(import_remix.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// route-module:/home/garcez/Documents/blog/src/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  meta: () => meta
});
init_react();
var import_remix3 = __toModule(require_remix());

// src/components/navbar.tsx
init_react();
var import_react = __toModule(require("react"));
var import_ri = __toModule(require("react-icons/ri"));
var import_remix2 = __toModule(require_remix());

// src/lib/links.ts
init_react();
var Links = {
  root: "/",
  post: (name) => `/posts/${name}`
};

// src/components/navbar.tsx
var middleItems = [
  { title: "Posts", link: "" },
  { title: "Playground", link: "" },
  { title: "Projects", link: "" }
];
var Themes;
(function(Themes2) {
  Themes2["light"] = "light";
  Themes2["dark"] = "dark";
  Themes2["null"] = "";
})(Themes || (Themes = {}));
var ThemesKey = "@blog/theme";
var Navbar = () => {
  const [theme, setTheme] = (0, import_react.useState)(Themes.null);
  (0, import_react.useEffect)(() => {
    const storageTheme = window.localStorage.getItem(ThemesKey) ?? Themes.light;
    const root = document.documentElement;
    if (storageTheme === Themes.dark)
      root.classList.add("dark");
  }, []);
  (0, import_react.useEffect)(() => {
    if (theme === Themes.null) {
      const storageTheme = window.localStorage.getItem(ThemesKey) ?? Themes.light;
      return setTheme(storageTheme);
    }
    window.localStorage.setItem(ThemesKey, theme);
  }, [theme]);
  const onToggleTheme = (0, import_react.useCallback)(() => {
    const root = document.documentElement;
    setTheme((prev) => {
      if (prev === "light")
        return Themes.dark;
      return Themes.light;
    });
    root.classList.toggle("dark");
  }, []);
  return /* @__PURE__ */ React.createElement("header", {
    className: "w-full bg-zinc-900 text-white sticky top-0 mb-8 z-10"
  }, /* @__PURE__ */ React.createElement("nav", {
    className: "flex justify-between items-center mx-auto container max-w-6xl py-4 text-xl"
  }, /* @__PURE__ */ React.createElement(import_remix2.Link, {
    to: Links.root
  }, /* @__PURE__ */ React.createElement("strong", {
    className: "font-extrabold"
  }, "g4rcez blog")), /* @__PURE__ */ React.createElement("ul", {
    className: "inline-flex py-2 invisible",
    "aria-hidden": "true"
  }, middleItems.map((item) => /* @__PURE__ */ React.createElement("li", {
    className: "px-4",
    key: `navbar-${item.title}`
  }, item.title))), /* @__PURE__ */ React.createElement("div", {
    className: "flex text-2xl"
  }, /* @__PURE__ */ React.createElement("button", {
    onClick: onToggleTheme
  }, /* @__PURE__ */ React.createElement(import_ri.RiSunFill, {
    "aria-hidden": "true",
    className: "hidden dark:block text-orange-200"
  }), /* @__PURE__ */ React.createElement(import_ri.RiMoonFill, {
    "aria-hidden": "true",
    className: "block dark:hidden text-slate-400"
  })))));
};

// src/styles/dist.css
var dist_default = "/build/_assets/dist-ILWPVJBH.css";

// route-module:/home/garcez/Documents/blog/src/root.tsx
var meta = () => {
  return { title: "g4rcez Blog" };
};
var links = () => [{ rel: "stylesheet", href: dist_default }];
function App() {
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ React.createElement("meta", {
    name: "viewport",
    content: "width=device-width,initial-scale=1"
  }), /* @__PURE__ */ React.createElement(import_remix3.Meta, null), /* @__PURE__ */ React.createElement(import_remix3.Links, null)), /* @__PURE__ */ React.createElement("body", {
    className: "w-full h-full"
  }, /* @__PURE__ */ React.createElement(Navbar, null), /* @__PURE__ */ React.createElement(import_remix3.Outlet, null), /* @__PURE__ */ React.createElement(import_remix3.ScrollRestoration, null), /* @__PURE__ */ React.createElement(import_remix3.Scripts, null), false));
}

// route-module:/home/garcez/Documents/blog/src/routes/posts/$post.tsx
var post_exports = {};
__export(post_exports, {
  default: () => Index,
  loader: () => loader,
  meta: () => meta2
});
init_react();
var import_client = __toModule(require("mdx-bundler/client"));
var import_react3 = __toModule(require("react"));
var import_remix4 = __toModule(require_remix());

// src/components/anchor.tsx
init_react();
var Anchor = (props) => {
  return /* @__PURE__ */ React.createElement("a", __spreadProps(__spreadValues({}, props), {
    className: `link:underline underline-offset-4 link:text-sky-600 dark:link:text-sky-400 transition-all duration-300 ${props.className ?? ""}`
  }), props.children);
};

// src/components/mdx-components.tsx
init_react();

// src/lib/strings.ts
init_react();
var Strings;
(function(Strings2) {
  Strings2.slugify = (str = "") => str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
})(Strings || (Strings = {}));

// src/components/mdx-components.tsx
var import_ri2 = __toModule(require("react-icons/ri"));
var import_react2 = __toModule(require("react"));
var import_react_syntax_highlighter = __toModule(require("react-syntax-highlighter"));
var import_dracula = __toModule(require("react-syntax-highlighter/dist/cjs/styles/prism/dracula"));
var HX = (props) => {
  const Render = props.tag;
  const [text, setText] = (0, import_react2.useState)("");
  const span = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    if (!span.current)
      return;
    setText(Strings.slugify(span.current.innerText));
  }, []);
  return /* @__PURE__ */ React.createElement(Render, __spreadValues({}, props), /* @__PURE__ */ React.createElement(Anchor, {
    className: "font-extrabold no-underline group",
    href: `#${text}`
  }, /* @__PURE__ */ React.createElement("button", {
    className: "inline-block opacity-0 transition-opacity duration-300 group-hover:opacity-100 rotate-45 mr-2"
  }, /* @__PURE__ */ React.createElement(import_ri2.RiLink, {
    "aria-hidden": "true",
    className: "rotate-45 text-base"
  })), /* @__PURE__ */ React.createElement("span", {
    ref: span
  }, props.children)));
};
var MdxComponents = {
  pre: (props) => {
    const { className, children } = props.children.props;
    const lang = (className ?? "").replace("language-", "");
    return /* @__PURE__ */ React.createElement(import_react_syntax_highlighter.PrismAsyncLight, {
      showLineNumbers: true,
      language: lang,
      className: "text-lg my-4",
      style: __spreadProps(__spreadValues({}, import_dracula.default), { fontFamily: "monospace" })
    }, children.trim());
  },
  h1: (props) => /* @__PURE__ */ React.createElement(HX, __spreadProps(__spreadValues({}, props), {
    tag: "h2"
  })),
  h2: (props) => /* @__PURE__ */ React.createElement(HX, __spreadProps(__spreadValues({}, props), {
    tag: "h2"
  })),
  h3: (props) => /* @__PURE__ */ React.createElement(HX, __spreadProps(__spreadValues({}, props), {
    tag: "h3"
  })),
  h4: (props) => /* @__PURE__ */ React.createElement(HX, __spreadProps(__spreadValues({}, props), {
    tag: "h4"
  })),
  h5: (props) => /* @__PURE__ */ React.createElement(HX, __spreadProps(__spreadValues({}, props), {
    tag: "h5"
  })),
  h6: (props) => /* @__PURE__ */ React.createElement(HX, __spreadProps(__spreadValues({}, props), {
    tag: "h6"
  })),
  Custom: (props) => /* @__PURE__ */ React.createElement("h1", null, "CUSTOM")
};

// src/lib/files.server.ts
init_react();
var import_path = __toModule(require("path"));
var import_front_matter = __toModule(require("front-matter"));
var import_fs = __toModule(require("fs"));
var Files;
(function(Files2) {
  Files2.parsePostFile = (postFile, slug, content) => __spreadProps(__spreadValues({}, postFile), {
    date: new Date(postFile.date),
    slug: import_path.default.basename(slug, ".md"),
    readingTime: Math.ceil(content.split(" ").length / 250)
  });
  Files2.listAllPosts = async () => {
    const base = import_path.default.resolve(__dirname, "_posts");
    const posts = import_fs.default.readdirSync(base, "utf-8");
    const files = await Promise.all(posts.map(async (post) => {
      const content = import_fs.default.readFileSync(import_path.default.join(base, post), "utf-8");
      const postFile = (0, import_front_matter.default)(content).attributes;
      return __spreadProps(__spreadValues({}, postFile), { date: new Date(postFile.date), slug: import_path.default.basename(post, ".md") });
    }));
    return files.sort((a, b) => b.date.getTime() - a.date.getTime());
  };
})(Files || (Files = {}));

// src/lib/mdx.server.ts
init_react();
var import_fs2 = __toModule(require("fs"));
var import_promises = __toModule(require("fs/promises"));
var import_mdx_bundler = __toModule(require("mdx-bundler"));
var import_path2 = __toModule(require("path"));
var compileMdx = async (post, language) => {
  const filePath = import_path2.default.resolve(import_path2.default.join(__dirname, "_posts", `${post}.md`));
  if (!(0, import_fs2.existsSync)(filePath)) {
    return null;
  }
  const mdxSource = await import_promises.default.readFile(filePath, "utf-8");
  const result = await (0, import_mdx_bundler.bundleMDX)({
    source: mdxSource,
    xdmOptions(options) {
      options.remarkPlugins = [...options.remarkPlugins ?? []];
      options.rehypePlugins = [...options.rehypePlugins ?? []];
      return options;
    }
  });
  return { code: result.code, content: mdxSource, post: result.frontmatter };
};

// route-module:/home/garcez/Documents/blog/src/routes/posts/$post.tsx
var loader = async ({ params }) => {
  const slug = params.post;
  const result = await compileMdx(params.post);
  return (0, import_remix4.json)({ code: result == null ? void 0 : result.code, slug, post: Files.parsePostFile(result == null ? void 0 : result.post, slug, result == null ? void 0 : result.content) }, result === null ? 404 : 200);
};
var meta2 = ({ data }) => {
  const title = data.slug;
  return {
    title,
    "og:title": title
  };
};
function Index() {
  const data = (0, import_remix4.useLoaderData)();
  const [headings, setHeadings] = (0, import_react3.useState)([]);
  const mainRef = (0, import_react3.useRef)(null);
  const Component = (0, import_react3.useMemo)(() => data.code === null ? null : (0, import_client.getMDXComponent)(data.code), [data.code]);
  (0, import_react3.useEffect)(() => {
    if (!mainRef.current)
      return;
    setHeadings(Array.from(mainRef.current.querySelectorAll("h2,h3,h4,h5,h6")).map((hx) => {
      const text = hx.textContent || "";
      const id = Strings.slugify(text);
      hx.id = id;
      return { id, text, order: Number.parseInt(hx.tagName.replace(/h/i, "")) - 2 };
    }));
  }, [data]);
  if (Component === null)
    return /* @__PURE__ */ React.createElement("div", null, "Not found");
  return /* @__PURE__ */ React.createElement("div", {
    className: "mx-auto container w-full max-w-6xl"
  }, /* @__PURE__ */ React.createElement("header", {
    className: "mb-8"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mb-4"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-5xl font-extrabold capitalize leading-snug"
  }, data.post.title), /* @__PURE__ */ React.createElement("small", null, /* @__PURE__ */ React.createElement("time", null, new Date(data.post.date).toDateString()), " \u2014 ", data.post.readingTime, " min read")), /* @__PURE__ */ React.createElement("nav", null, /* @__PURE__ */ React.createElement("ul", {
    className: "my-4"
  }, headings.map((hx) => /* @__PURE__ */ React.createElement("li", {
    key: `${hx.id}-${hx.order}`,
    className: "my-2 text-sm underline underline-offset-4",
    "data-order": hx.order
  }, /* @__PURE__ */ React.createElement(Anchor, {
    href: `#${hx.id}`
  }, hx.text)))))), /* @__PURE__ */ React.createElement("main", {
    ref: mainRef,
    className: "py-2 max-w-6xl prose prose-slate dark:prose-invert prose-a:text-sky-700 dark:prose-a:text-sky-400 dark:prose-a:prose-headings:text-current prose-a:prose-headings:text-current prose-a:underline-offset-4"
  }, /* @__PURE__ */ React.createElement(Component, {
    components: MdxComponents
  })));
}

// route-module:/home/garcez/Documents/blog/src/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index2,
  loader: () => loader2
});
init_react();
var import_remix5 = __toModule(require_remix());
var loader2 = async () => {
  const posts = await Files.listAllPosts();
  return { posts };
};
function Index2() {
  const data = (0, import_remix5.useLoaderData)();
  return /* @__PURE__ */ React.createElement("div", {
    className: "mx-auto py-2 container w-full max-w-6xl"
  }, /* @__PURE__ */ React.createElement("ul", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12"
  }, data.posts.map((post) => /* @__PURE__ */ React.createElement("li", {
    key: post.title
  }, /* @__PURE__ */ React.createElement(import_remix5.Link, {
    className: "block group link:text-sky-700 dark:link:text-sky-400 link:underline transform duration-300 link:scale-105 origin-center",
    to: Links.post(post.slug)
  }, /* @__PURE__ */ React.createElement("h3", {
    className: "font-extrabold leading-snug text-2xl whitespace-pre-wrap"
  }, post.title), /* @__PURE__ */ React.createElement("time", {
    className: "text-gray-400 group-hover:text-sky-400"
  }, new Date(post.date).toDateString()), /* @__PURE__ */ React.createElement("p", {
    className: "prose dark:prose-invert prose-lg group-hover:text-sky-400"
  }, post.description))))));
}

// <stdin>
var import_assets = __toModule(require("./assets.json"));
var entry = { module: entry_server_exports };
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/posts/$post": {
    id: "routes/posts/$post",
    parentId: "root",
    path: "posts/:post",
    index: void 0,
    caseSensitive: void 0,
    module: post_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  entry,
  routes
});
/**
 * @remix-run/node v1.1.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * @remix-run/react v1.1.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * @remix-run/server-runtime v1.1.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * remix v1.1.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
