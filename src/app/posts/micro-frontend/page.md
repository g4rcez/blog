---
level: 1
subjects: ["javascript", "typescript", "frontend", "nextjs"]
title: "Micro frontend or NextJS"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2020-12-24T00:00:00.000Z"
description: "New technology, old concept. Nothing changes"
---

# Introduction

[NextJS](https://nextjs.org/) is one of the most impressive modern projects in the React ecosystem. The SSR concept it popularized — though not new in itself — combined with its tooling and the React ecosystem, is genuinely remarkable.

However, none of this is truly new. SSR is a well-established concept. Those who have worked with PHP, .NET, or Java have likely encountered techniques for embedding server-side logic within frontend code, where each request causes the server to process and return dynamic content.

Actually, Next's big differentiator is in the static content generation at build-time, incremental cache and enabling all this using one of the best frameworks (or libraries, if you prefer) which is [ReactJS](https://reactjs.org/). With all this, maybe it doesn't even make sense for us to export the responsibility of rendering our applications to the client. After all, SPAs are rendered on the client and still harm the [SEO](https://developers.google.com/search/docs/beginner/seo-starter-guide) of your page.

Even with all these benefits, NextJS is not a universal solution. For applications that do not require SEO — such as internal tools — client-side rendering may be perfectly adequate, especially given the increasing performance of modern browsers. **Have you ever heard about micro frontends?**

# Micro Frontends

If there are microservices, why can't we modularize our frontend? Does the frontend really need to be a monolithic application with hundreds of thousands of lines? You can look for a technical reference at [micro-frontends](https://micro-frontends.org/) and [Martin Fowler's article](https://martinfowler.com/articles/micro-frontends.html).

Admittedly, the concept seemed quite utopian at first. Separating the frontend into multiple repositories raises immediate questions: How would dependency sharing work? How could multiple SPAs be aggregated into a larger SPA? How would state be shared between them? And how would CSS be prevented from leaking across pages?

There are really several problems, looking at it this way, it even seems more interesting not to separate, since you create several problems. But having a monolithic frontend also has its problems, such as:

- Giant code and several people working on it (even with Git, there will always be some mess)
- Giant code[2], because codes with thousands of lines become confusing
- Slow build
- Slowness in development
- High probability of dead code (unused code)
- Refactoring giant codes tends to be more complicated than we would like

Given these points, adopting a microfrontend strategy may not be so painful.

**But what would be necessary to adopt a microfrontend?**

# NextJS vs Render

Before talking about Render, let's analyze the NextJS point. With NextJS, we can adopt an SSR strategy and pages that are cached with pre-established values at build-time, this is really incredible, performant and gives us no additional work. But...it still doesn't solve our problem of having multiple connected frontends, even if they're from different repositories.

Now we can talk about Render. This concept of _Render_ is not exactly a concept you'll find with this name, it was a name given by a great friend and mentor who developed an application that delivered versioned frontends. Upon learning this concept, I tried to understand and adapt it to a microfrontend situation. First, let's understand the render functionalities.

- Http Server
- Be a _proxy_ to where the frontends are stored [1]
- Be a _proxy_ for the APIs called by our frontends [2]
- Cache our frontend assets
- Separate applications
- Version applications [3]

Explaining the 3 highlighted points.

1. In the render strategy, our frontends will be saved in cloud storage (AKA S3). In this cloud storage, we'll have the builds of our frontend, each build will generate a version, which you can access as `/app/v0.0.1/`. This will be our application path
2. This is an optional case, it will depend on your architecture, if you don't have a BFF (Backend for Frontend). In case of calls to our API, Render will resolve the URLs, calling the API or APIs that our front makes requests to, thus making a proxy so you have only one entry point.
3. A very common problem has always been cache. If you build your front using CRA (Create React App), for example, it will generate a hash for each file and thus can avoid cache. But what if your assets are versioned in the URL? Thus, even if the file content is the same, the browser itself will not recognize it as the same file and will make a new request for the new version. As mentioned, `/app/v0.0.1/` is a version of the front that will be used until `/app/v0.0.2/` is released.

Maybe this section gets a bit abstract, but rest assured that I'll make another post bringing the entire code part of how it works, first let's focus on the concept.

# First impressions

In the beginning, working with microfrontend was not so simple. I had to understand how to do dependency sharing, spend some time on webpack configurations, and mainly, share state between React applications that are in different trees.

Sharing dependencies is still the biggest problem of all, because one application doesn't know the build of the other, so I didn't find a decent way to share dependencies between frontends, except by doing an append to `window` of the library you want, something like `window.React = React`.

The webpack configuration needed some boilerplate for JSX and Typescript, besides CSS Loader and Image Loader. Maybe the image loader doesn't make much sense, since images can be hosted on CDNs and thus, not be versioned in the project.

Sharing state was an interesting challenge. By combining `useEffect` and `useState`, it was possible to share state between applications. This required `window.addEventListener` to notify subscribers whenever shared state changed.

# Conclusion

Without a doubt, microfrontends are a totally different challenge from what most frontends are used to, it's a different approach to solve problems that might be complex maintaining thousands of lines of code. Soon, I'll write about the code part of render and about a small Hello World using a microfrontend.

Thank you for your time, see you soon, bye bye
