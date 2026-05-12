---
level: 1
title: Creating a strongly typed router
subjects: ["react", "frontend", "typescript", "javascript"]
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2023-01-13T18:30:00.000Z"
description: "Improving DX when working with routes, links and redirects"
---

[tl;dr. Code on codesandbox](https://codesandbox.io/s/vigilant-cloud-1lnyov?file=/src/index.tsx)

# Introduction

When it comes to routing in react, you immediately think of [react-router](https://github.com/remix-run/react-router).
Some might know the recent [tanstack-router](https://github.com/TanStack/router). Both are excellent solutions for routing in SPA (*Single Page Application*) applications, with support for server-side rendering (SSR) as well.

> Personal comment: working for SSR is not very useful, since SSR application solutions like NextJS or Remix
> deliver a routing system. Even though Remix uses react-router under the hood, you don't do the
> configuration
> the same way in a CSR (*Client Side Render*) application.

The purpose of this article is to present some things we don't pay attention to when using routing libraries and
introduce [brouther](https://github.com/g4rcez/brouther), my solution to solve some of the problems that
I'll comment on.

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

However, with all this, there are obviously implementation gaps, especially regarding typing and DX (
*Developer experience*). Some of them are:

- Lack of typing for registered routes in the context
- Lack of typing in Link, Redirect components
- Lack of typing in URL manipulation functions
- Various features that may not be used

The growing adoption of TypeScript has made a strongly typed ecosystem increasingly important. This brings us to tanstack-router.

# Tanstack Router

The newest router in the community aims to solve certain problems, mainly problems related to DX. With
these problems in mind, they created an ecosystem that manages to deliver the best of both worlds between **routing vs DX**.

I can't comment much on this one because I haven't had much experience with it yet, but looking at the
documentation it's possible to see that it still doesn't have documentation for all its hooks and canonical ways to
solve a problem. Its ecosystem has many things that end up not being the responsibility of a routing
library and still has an architecture aimed at integrating with state control libraries, like
react-query (being from the developer group), Apollo, SWR, etc.

Being relatively new, there is not much to add here, but it is a technology worth watching if synchronized state and routing are significant concerns in your project.

# Brouther

Despite also being a new library, [brouther](https://github.com/g4rcez/brouther) was designed to solve a
single problem besides routing, that being the DX/typing problem. As commented about react-router, I've always
thought that the lack of typing for methods and components was a problem, because if you need to change the path of
a page you'll have a problem of manually changing the reference everywhere. Of course you can adopt
practices to avoid errors, but the problem still exists because the ecosystem is not strongly
integrated with the library.

With brouther, the idea is to deliver all the necessary tools, whether they are strongly integrated with the system (
in an opinionated way) or just isolated from the entire type system (in a non-opinionated way). Some of the targeted problems:

- DX improvement
- Typing for routes, including query-string and valued paths (just like in express)
- Typing for history methods
- Typing for components
- Typing for hooks
- Simple ecosystem
- Deliver the minimum possible for routing

## Typing

With the rise of Typescript, having a strongly typed ecosystem has become essential in application development. With
this in mind, I decided to make the entire library ecosystem connect to page paths and
following URL rules, where:

- *Pathname* (mysite.com/this-is-the-pathname) was mandatory, including places where the pathname is dynamic (/users/:
  id)
- Ensuring all paths were indeed strings
- *Query string* typing, where all query string parameters are optional

Following these rules and using the [ts-toolbelt](https://github.com/millsp/ts-toolbelt) library it was possible
to build a system where you only need to provide the URL (path) and a nickname (id) to have the entire system set up. We
can't forget our element, but it doesn't enter this part of typing. Through the URL it's possible to extract all
necessary information to build our pages, do redirects and links. See the path below

```text
/posts/brouther?language=pt-br
|        ||
|        ||
|pathname||query-string
```

To register this route in brouther we need to do the following

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

First we build our router and it will return an object containing some methods, components and hooks strongly
typed for our typed ecosystem. At this point we'll only explore `router.link` and `router.links`

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

Now that we have the explanation it's easy to build our paths, just follow the parameter rules. The best
of all is that everything is strongly typed and you don't need to hack the code to connect the library types
with your ecosystem.

### *Query string* map

Typing a *query string* has always been a feature I wanted in routers, but not automatically, but in a way
that I could say "this value is a string and this is a number", avoiding conversions in code and being
transparent in use everywhere in the system. The good news is that now we can have this.

Below we have the accepted typing in the *query string*, with automatic conversion to the desired type. If you want
one of these items to be an array, you can include `[]` at the end of the value and if you want it to be required,
just add a `!` at the end. If you want to know all the conversion types, you can see the map below:

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

The primary goal of brouther was to simplify the developer experience by providing strong types and a focused set of hooks for fully manipulating the routing system. Simplicity was a crucial design factor: keeping the library lean avoids complex code and verbose documentation.

# References

- Building dynamic paths via type - [Github](https://github.com/ghoullier/awesome-template-literal-types)
- [ts-toolbelt](https://millsp.github.io/ts-toolbelt/)
- [RFC 1738](https://www.rfc-editor.org/rfc/rfc1738)
- [MDN - URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)

Thank you for your time, see you soon, bye bye
