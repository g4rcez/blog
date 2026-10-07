# Allan Garcez's blog

A bilingual Next.js blog and portfolio. The UI uses Tailwind CSS 4 and `@g4rcez/components`, with light/dark/system themes and a `#00A6F4` accent.

## Development

Requires Node.js 20.19+ and pnpm 10.34.6. The repository pins pnpm in `package.json`; use Corepack or a compatible pnpm executable (not pnpm 7 on Node 24).

```sh
corepack pnpm install
corepack pnpm dev
```

Build and serve locally with `corepack pnpm build` and `corepack pnpm start`. Next.js uses Webpack here for the existing Markdoc/search integration. Tailwind's CSS-first theme entrypoint is `src/styles/tailwind.css`; light/dark design-system colors are in `src/styles/light.ts` and `src/styles/dark.ts`.

## Information architecture

The wider layout follows the docs hierarchy at [wterm.dev](https://wterm.dev/): topic, agent, and project links live in a left sidebar, while long-form pages add a right-side table of contents. On mobile, the sidebar is hidden and the main navigation remains available in the header.

The About page borrows the manual-page hierarchy from [cicatriz.dev](https://cicatriz.dev/en): a `garcez.dev(1)` masthead, synopsis-style section links, and clear descriptions of practice, history, and related destinations. It keeps the blog's localized copy and semantic theme tokens.

## Interactive terminal

The homepage terminal is powered by `@wterm/react` and `@wterm/just-bash`. It runs entirely in the browser, against a temporary in-memory filesystem with English and Portuguese blog links and reading samples. Try `ls`, `cat README.md`, `cd writing`, and `help`. It has **no server shell or network access**; changes inside the sandbox do not persist after a reload. Press Escape, then Tab to leave the terminal by keyboard.

`just-bash`'s browser bundle still imports `node:zlib` for compression commands. The Webpack config maps that import to `browserify-zlib`; it does not enable Node APIs in the visitor's browser.
