---
name: Garcez's Blog
description: A quiet reading surface with an interactive browser terminal.
colors:
  accent: "#00A6F4"
  accent-hover-light: "#006f9f"
  accent-hover-dark: "#6ccfff"
  paper: "#ffffff"
  ink: "#171c27"
  muted-ink: "#4c596b"
  rule: "#d8e0e7"
  night: "#0c1118"
  night-ink: "#e8eef5"
  night-muted: "#b2becb"
  night-rule: "#33404e"
typography:
  display:
    fontFamily: "Lexend, sans-serif"
    fontWeight: 500
  body:
    fontFamily: "Inter, sans-serif"
    fontWeight: 400
  terminal:
    fontFamily: "monospace"
spacing:
  unit: "4px"
rounded:
  terminal: "14px"
components:
  article-link:
    textColor: "{colors.ink}"
  terminal-shell:
    rounded: "{rounded.terminal}"
---

# Design System: Garcez's Blog

## Overview

**Creative North Star: "The reader's desk"**

The blog is a calm editorial surface: generous margin around real writing, quiet dividers instead of card chrome, and a small working terminal as an invitation to explore. The same structure remains legible in light and dark themes. The interface does not compete with the articles.

**Key Characteristics:** restrained typography, flat reading surfaces, editorial date-and-title lists, a clearly bounded interactive terminal.

## Colors

The accent is `#00A6F4`, used sparingly for links, focus and terminal prompts. Light surfaces use paper, ink and cool rules; dark surfaces use night, night-ink and a visible muted neutral. The exact semantic overrides live in `src/styles/light.ts` and `src/styles/dark.ts` and are emitted with `@g4rcez/components/theme`.

**The One Accent Rule.** Do not add another brand hue to compete with the blue.

## Typography

Lexend carries headings, Inter carries interface and reading copy, and monospace belongs to terminal output and code. Article copy is constrained to about 75 characters; headings are weighted rather than decorated.

## Layout

The shell and homepage share a maximum width of 72rem. Reading content narrows to `75ch`, with a desktop table of contents beside it and a disclosure above the article on smaller screens. Mobile content starts at a 20px gutter; spacing follows Tailwind's 4px unit.

## Elevation & Depth

The reading surface is flat. Borders divide navigation, article lists, and the terminal; no decorative glow or glass is required.

## Shapes

The terminal has a 14px radius. Small controls may be rounded; editorial rows remain square and are separated by hairline rules.

## Components

Use `@g4rcez/components` for design-system controls and tokens. Search tags are navigational links, not nested buttons. The wterm terminal has an isolated browser-only Bash filesystem; its frame follows the current theme. Theme controls must expose light, dark, and system choices.

## Do's and Don'ts

- Do keep every route and long-form article readable without using the terminal.
- Do preserve keyboard focus and an Escape-then-Tab exit from the terminal.
- Don't turn writing lists into equal-sized promotional cards or use gradients as decoration.
