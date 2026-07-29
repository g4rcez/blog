---
level: 1
title: Back to css
subjects: ["frontend"]
language: "en-us"
translations: ["pt-br", "en-us"]
date: "2026-07-29T12:15:47.000Z"
description: "Move from Tailwindcss to pure CSS"
---

I have been using [Tailwindcss](tailwindcss.com) since the v1. Was an amazing bet, with a lots of benefits that we can

- Quick way to prototype
- Functional CSS by default
- Amazing way to use your design tokens
- CSS generation integrated with your codebase
- IntelliSense, LSP since v1

An amazing tool to have in your frontend arsenal, no doubts. Now in v4 (almost 6 years after the v1) we have even more tools integrated to tailwindcss. It's a strong pattern nowadays in the AI world, compatibility with Vite. And even with those amazing tooling, why I'm talking about back to CSS? Let's dive into this topic

## AI and Tailwindcss

Of course we will talk about AI, but not too much. Since the release of [Vercel V0](https://v0.app/), tailwindcss exploded more and more their usage, you can check the npm downloads to see this. Lots of examples with Tailwindcss, lots of websites using tailwindcss, AI choosing tailwindcss as default to the project.

But how AI enter at this? Talking about the "coding" side, without a good harness to the AI, with strict rules and solid examples, AI will start the slop, writing all tailwindcss classes to create a button, replicating more and more slops, using inconsistent values from tailwindcss classes...a truly nightmare when we talk about consistency.

You can do things quickly with AI + Tailwindcss, but you will need a good setup of rules and skills to enforce the desired code output. Write good examples is a mandatory thing, export the components using things like [shadcn](https://ui.shadcn.com/) are good as well.

In general, my experience using tailwindcss with AI without the correct tools is more slop them the expected result. Misleading the standard behaviour, more time invested in build the skills and rules to the project. ~~Or this is just a skill issue~~

## Plain old CSS

Back to 1996, we have the CSS. Where everything started, but with a great evolution in terms of tools and support, just check the `:is` and `:where`, [pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements) and other awesome features from the latest release of CSS.

The question is "Why plain CSS?". Using only CSS instead of a framework we can have more benefits than you can imagine:

- Control to fine grain performance
- Use `@layer` to control the cascade effect of css
- Semantic classes
- Zero setup
- Reduce the size of the HTML in SSR
- Enforce style with one CSS class

Of course there are downsides on use the plain CSS instead of Tailwindcss, but it's our job deal with trade-offs. And to understand them, let's think about the benefits that I listed

### Control to fine gain performance

Who cares about CSS performance? We should think more about it. There are lots of ways to improve the CSS performance, like reducing the selectors, use only the styles that is needed, control the CSS stylesheet by using media queries to avoid unnecessary loading, preload...

I put this topic just to talk about the `:has`, that have a [performance consideration](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has#performance_considerations).

Tailwindcss uses the `:has` selector with other selectors, like `has-focus` or `has-checked`. Of course the `has` is a feature that we can use, but there are some concerns about it. Use carefully.

## Use `@layer` to control the cascade effect of css

Specially working with design systems, you maybe need to enforce some style behaviours to avoid the users to override the styles. Using the `@layer` you can have more control over this. Tailwindcss also use the `@layer`, but to enforce their functional css rules (properties, theme, base, components, utilities) and you can use it to enforce your own components, like card or dialog

## Semantic class

Of course we need to understand the context from components instead of css classes, but to reduce the context window to AI, the needs about understand one of each tailwindcss class, semantic class is worth. Compare both button implementations inside your HTML/JSX

- CSS: `button`
- Tailwindcss: `px-4 py-2 bg-slate-950 text-white hover:bg-slate-900 transition-colors transition-discrete duration-300 ease-linear`

The utility classes describe how the button looks. The semantic class describes what the element is. This distinction matters when an AI agent needs to inspect a component, because `button` provides the relevant context without requiring the agent to interpret every visual decision in the markup.

It also gives us one place to change that decision. If the transition duration or background color changes, the component markup remains untouched. The stylesheet becomes the source of truth instead of every occurrence of the class list.

Semantic does not mean vague. A global `.container` or `.item` class can create more confusion than it solves. Names should represent a clear component or responsibility, and styles should be scoped with CSS Modules, a naming convention, or an explicit cascade layer when necessary.

### Zero setup

CSS is part of the browser platform. It does not require a plugin to interpret class names, scan source files, or generate a stylesheet. A bundler can still process and minify it, but the code does not depend on that tooling to be understood by the browser.

This reduces the number of concepts involved in a project. There is no framework configuration, no mapping between utility names and CSS properties, and no upgrade required to access a browser feature. When a new CSS capability reaches the support level required by the project, it can be used directly.

Zero setup does not mean zero structure. A project still needs decisions about tokens, file organization, specificity, and the cascade. The difference is that these decisions can be expressed with the language itself.

### Reduce the size of the HTML in SSR

Utility classes repeat styling information in every rendered element. A semantic class replaces that list with a small identifier:

```tsx
<button className="button">Save changes</button>
```

The difference for one button is irrelevant. The difference across a large server-rendered page can become measurable, especially when the same utility list appears many times. Compression reduces the transfer cost, but the browser still receives and parses the expanded markup.

This is not a reason to rewrite an application by itself. It is one more trade-off to consider when HTML size, streaming, or rendering performance matters.

### Enforce style with one CSS class

A class can own the complete visual contract of a component. Tokens, interaction states, accessibility preferences, and responsive behavior remain together instead of being distributed across markup:

```css
@layer components {
    .button {
        padding: var(--space-2) var(--space-4);
        color: var(--color-on-primary);
        background: var(--color-primary);
        border-radius: var(--radius-medium);
        transition: background-color 300ms linear;
    }

    .button:hover {
        background: var(--color-primary-hover);
    }

    @media (prefers-reduced-motion: reduce) {
        .button {
            transition: none;
        }
    }
}
```

The JSX communicates intent, while CSS owns presentation. An AI agent can reuse the class without recreating the component's visual rules or introducing a slightly different spacing value. Code review also becomes simpler: a change to the button design appears in the stylesheet rather than in every consumer.

## The trade-offs

Plain CSS does not remove complexity. It moves responsibility back to the team. Someone must define the cascade, prevent accidental global styles, identify unused rules, and keep design tokens consistent. Tailwindcss provides conventions and tooling for several of these problems by default.

Colocation is another difference. Utility classes make it possible to understand most of a component's presentation without opening another file. With CSS, the reader may need to move between the component and its stylesheet. CSS Modules and predictable file names reduce this cost, but they do not eliminate it.

Variants also require a deliberate API. A utility can be added directly for an exceptional case, while a semantic component needs a class, attribute, or custom property that represents the variation. I consider this constraint useful for shared components, but it can slow down experiments.

Tailwindcss remains a strong choice when a team already has a consistent configuration, a mature component library, and clear rules for generated code. Returning to CSS is not a claim that every project should remove Tailwindcss. It is a decision to prefer browser primitives and a smaller abstraction for the projects where I control the architecture.

## My approach

I am not returning to the CSS of 1996. I am using modern CSS with custom properties for design tokens, cascade layers for ordering, media and container queries for adaptation, and scoped styles when the framework supports them.

The basic structure is intentionally small:

1. A token layer defines colors, spacing, typography, and motion.
2. A base layer defines document defaults and element behavior.
3. A component layer contains semantic classes.
4. A utility layer contains only the few reusable exceptions the project needs.

This gives both developers and AI agents a clear place to find a decision. More importantly, it keeps generated code within the same constraints as manually written code. The goal is not to avoid tooling; it is to ensure that tooling supports the platform instead of becoming the platform.

## Conclusion

Tailwindcss helped improve how frontend teams think about constraints, tokens, and reusable visual rules. Modern CSS can now express many of those ideas directly while keeping markup smaller and component intent clearer. For my current work, returning to CSS offers the control and simplicity I want, with trade-offs that I am willing to manage.

Thank you for reading.
