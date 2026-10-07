---
level: 1
title: Creating a strongly typed router
subjects: ["react", "frontend", "typescript", "javascript"]
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2023-01-13T18:30:00.000Z"
description: "A type-safe contract for routes, links, and redirects"
---

[tl;dr. Code on codesandbox](https://codesandbox.io/s/vigilant-cloud-1lnyov?file=/src/index.tsx)

# Introduction

When you think about routing in React, [react-router](https://github.com/remix-run/react-router) is usually the first library that comes to mind. Some readers may also know the newer [tanstack-router](https://github.com/TanStack/router). Both are strong solutions for routing single-page applications (SPA) and support server-side rendering (SSR).

> A personal note: SSR support is less useful when the application already uses a framework such as Next.js or Remix, because those frameworks provide routing. Remix uses react-router internally, but its configuration is different from a client-side rendered (CSR) application.

This article looks at details that are easy to overlook when using routing libraries and introduces [brouther](https://github.com/g4rcez/brouther), my solution to several of those problems.

# React Router

This is arguably the most widely used React router, and certainly the oldest. Today it's on version 6.6.2 and brings
many features, some aren't even related to routing itself. In the past there were some problems with using this
router, mainly because the repo maintainers split up and the creation of
[reach-router](https://reach.tech/router/) happened, which divided the community a bit.

Today react router delivers many useful features, an ecosystem heavily based on hooks and very rich
documentation. We can even make a list of everything it delivers:

- Browser routing via URL (standard), hash or memory routing using
  the [history](https://github.com/remix-run/history)
- Route parameterization, very similar to [express](https://expressjs.com/en/guide/routing.html)
- Navigation methods between routes that can increment or swap elements in the browser's history stack
- Hooks, many hooks for almost all entities present in a URL or some other routing context entity
- Error tracking for routes not found, or the famous 404
- Control of page transition state, whether in routing or even in form submits

Even with these features, implementation gaps remain, especially around typing and developer experience (DX):

- Lack of typing for registered routes in the context
- Lack of typing in Link, Redirect components
- Lack of typing in URL manipulation functions
- Various features that may not be used

As TypeScript adoption has grown, a strongly typed ecosystem has become more important. That brings us to tanstack-router.

# Tanstack Router

This newer router focuses on developer experience. Its ecosystem aims to combine the flexibility of routing with stronger types and better tooling.

I have limited hands-on experience with it, so this section is necessarily brief. The documentation did not yet cover every hook or canonical solution when I wrote this article. The ecosystem also includes concerns that do not always belong in a routing library, including integrations with state-management libraries such as react-query, Apollo, and SWR.

Because it was relatively new at the time, there is little more to add here. It is worth watching if synchronized state and routing are important concerns in your project.

# Brouther

Although [brouther](https://github.com/g4rcez/brouther) is also a newer library, it focuses on one problem beyond routing: the DX and typing gap. As with react-router, changing a page path can require updating references in many places when methods and components are not typed. Conventions can reduce mistakes, but they do not create an integrated contract.

Brouther provides the necessary tools either as an integrated, opinionated system or as smaller pieces that can remain separate from the rest of the type system. It targets these problems:

- DX improvement
- Typing for routes, including query-string and valued paths (just like in express)
- Typing for history methods
- Typing for components
- Typing for hooks
- Simple ecosystem
- Deliver the minimum possible for routing

## Typing

As TypeScript has become common in application development, strong typing has become an important part of the ecosystem. Brouther connects the library to page paths and URL rules:

- *Pathname* (mysite.com/this-is-the-pathname) was mandatory, including places where the pathname is dynamic (/users/:
  id)
- Ensuring all paths were indeed strings
- *Query string* typing, where all query string parameters are optional

With these rules and the [ts-toolbelt](https://github.com/millsp/ts-toolbelt) library, the router needs only a URL path and an identifier to set up the system. The element is still required, but it is outside this part of the type model. The URL contains enough information to build pages, redirects, and links. Consider this path:

```text
/posts/brouther?language=pt-br
|        ||
|        ||
|pathname||query-string
```

To register this route in brouther:

```text
/posts/:title?language=string
```

This way brouther will give you the following way to build the URL:

```typescript jsx
export const router = createRouter([
    {
        path: "/posts/:title?language=string",
        id: "post",
        element: <Fragment/>
    }
] as const);

router.link(router.links.post, {title: ""}, {});
```

The router returns an object with methods, components, and hooks typed from the route definition. This article focuses on `router.link` and `router.links`.

### Building URLs

Before developing the idea, a brief explanation of what the two items mentioned above are:

`router.link` is a method that will build the URL based on the paths passed to `createRouter`. The first parameter is
a route informed in our `createRouter`, it must necessarily be a path passed in the array, to avoid random
paths that don't exist in our system. It's worth remembering that it must be exactly the full path, with the *query
string* and everything. The second parameter will vary according to your path, if there are dynamic paths like `/users/:id`,
then the second parameter will be an object with all required keys, these keys being the nickname given to each
of the dynamic paths. If your path doesn't contain dynamic paths, then only the *query string* will be required here.
It's worth remembering that *query strings* are non-mandatory URL parameters, therefore, not required. If you want,
we can use `?language=string!` and the type will force you to pass language as string

`router.links` is a dictionary that respects all ids passed in the `createRouter` array. That is, our ids are
nicknames for an object, so you don't need to type the given string all the time. Just
use `router.links.ALIAS_FOR_THE_ROUTE` and that's it, you'll already have the same string used in building our router.

With those rules in place, building paths is straightforward. The route definitions provide the types, so no adapter code is needed to connect the library to the rest of the application.

### *Query string* map

I wanted query strings to be typed explicitly rather than converted throughout the application. A route should be able to say that one value is a string and another is a number, while keeping that contract transparent everywhere.

The following types are accepted in a *query string* and converted automatically. Add `[]` to make a value an array and `!` to make it required. The complete conversion map is:

```typescript
export type Map = {
    string: string;
    number: number;
    boolean: boolean;
    date: Date;
    null: null;
};
```

## Developer Experience

Brouther's goal is to simplify routing work with strong types and a focused set of hooks. Keeping the library small is deliberate: it avoids complex code and long documentation.

# References

- Building dynamic paths via type - [Github](https://github.com/ghoullier/awesome-template-literal-types)
- [ts-toolbelt](https://millsp.github.io/ts-toolbelt/)
- [RFC 1738](https://www.rfc-editor.org/rfc/rfc1738)
- [MDN - URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)

That is the core of brouther: a small routing layer with a type-safe contract.
