---
level: 1
title: Back to CSS
subjects: ["frontend"]
language: "en-us"
translations: ["pt-br", "en-us"]
date: "2026-07-29T12:15:47.000Z"
description: "Moving from Tailwind CSS to plain CSS"
---

I have used [Tailwind CSS](tailwindcss.com) since v1. It was a good choice, with several benefits:

- Fast prototyping
- Functional CSS by default
- A practical way to use design tokens
- CSS generation integrated with the codebase
- IntelliSense and LSP support since v1

Tailwind CSS is still a useful tool for frontend work. In v4, almost six years after v1, it includes even more tooling and integrates well with Vite. It is also a common default for AI-generated interfaces. Given those strengths, why return to CSS? This article explains my reasoning.

## AI and Tailwind CSS

AI is part of this discussion because it changes how interfaces are produced. Since the release of [Vercel V0](https://v0.app/), Tailwind CSS has become even more common. The package downloads, the number of examples, and the volume of AI-generated projects all reflect that trend.

Where does AI fit into this? Without a good harness, clear rules, and solid examples, an AI agent tends to produce slop: long class lists for simple components, repeated patterns, and inconsistent Tailwind CSS values. That makes a consistent interface harder to maintain.

AI and Tailwind CSS can make implementation fast, but the project needs rules and skills that guide the generated code. Good examples are essential. Publishing components through tools such as [shadcn](https://ui.shadcn.com/) can also give the agent a reliable starting point.

In practice, my experience with Tailwind CSS and AI is less consistent when those tools are missing. The default behaviour needs direction, and that direction takes time to encode in project-specific skills and rules.

## Plain old CSS

CSS began in 1996, but it has gained substantial tooling and browser support since then. Selectors such as `:is` and `:where`, [pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements), and other modern features cover many of the needs that lead teams to add an abstraction.

Why use plain CSS? For some projects, using the platform directly provides several benefits:

- Fine-grained control over performance
- `@layer` for controlling the cascade
- Semantic classes
- Minimal setup
- Smaller server-rendered HTML
- A single class that owns a component's style

Plain CSS also has trade-offs. Understanding them requires looking more closely at each benefit.

### Fine-grained performance control

CSS performance deserves attention. You can improve it by reducing selector complexity, shipping only the styles you need, and controlling stylesheet loading with media queries, preloading, and similar techniques.

The `:has` selector deserves a specific note because it has [performance considerations](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has#performance_considerations).

Tailwind CSS exposes `:has` through variants such as `has-focus` and `has-checked`. The feature is useful, but it still needs to be used with care.

## Use `@layer` to control the cascade effect of css

When working with design systems, you may need to protect component styles from accidental overrides. `@layer` gives you explicit control over that order. Tailwind CSS also uses layers for its properties, theme, base, components, and utilities; you can use the same feature to organize components such as cards and dialogs.

## Semantic classes

Components still need context, but semantic classes reduce the amount an AI agent must infer from a utility list. Compare these two button implementations in HTML or JSX:

- CSS: `button`
- Tailwind CSS: `px-4 py-2 bg-slate-950 text-white hover:bg-slate-900 transition-colors transition-discrete duration-300 ease-linear`

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

## Trade-offs

Plain CSS does not remove complexity; it puts more of that responsibility on the team. Someone must define the cascade, prevent accidental global styles, identify unused rules, and keep design tokens consistent. Tailwind CSS provides conventions and tooling for several of these problems by default.

Colocation is another difference. Utility classes make it possible to understand most of a component's presentation without opening another file. With CSS, the reader may need to move between the component and its stylesheet. CSS Modules and predictable file names reduce this cost, but they do not eliminate it.

Variants also require a deliberate API. A utility can be added directly for an exceptional case, while a semantic component needs a class, attribute, or custom property that represents the variation. I consider this constraint useful for shared components, but it can slow down experiments.

Tailwind CSS remains a strong choice when a team has a consistent configuration, a mature component library, and clear rules for generated code. Returning to CSS does not mean every project should remove Tailwind CSS. It means preferring browser primitives and a smaller abstraction when I control the architecture.

## My approach

I am not returning to the CSS of 1996. I am using modern CSS: custom properties for design tokens, cascade layers for ordering, media and container queries for adaptation, and scoped styles when the framework supports them.

The basic structure is intentionally small:

1. A token layer defines colors, spacing, typography, and motion.
2. A base layer defines document defaults and element behavior.
3. A component layer contains semantic classes.
4. A utility layer contains only the few reusable exceptions the project needs.

This gives developers and AI agents a clear place to find each decision. More importantly, it keeps generated code within the same constraints as manually written code. The goal is not to avoid tooling. It is to make tooling support the platform instead of becoming the platform.

## Conclusion

Tailwind CSS helped frontend teams think more deliberately about constraints, tokens, and reusable visual rules. Modern CSS can express many of those ideas directly while keeping markup smaller and component intent clearer. In my current work, returning to CSS provides the control and simplicity I want, with trade-offs I am willing to manage.

Thank you for reading.
