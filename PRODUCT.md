# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Readers interested in Allan Garcez's writing on software engineering, and visitors exploring his work and open-source projects.

## Product Purpose

A personal bilingual blog and portfolio: readers can find articles, browse topics, learn about work, and explore projects. The homepage also offers an interactive terminal experience.

## Operating Context

English and Portuguese routes, long-form technical articles, topic indexes, search, RSS feeds, and portfolio pages already exist in the repository.

## Capabilities and Constraints

The terminal is a browser-only Bash sandbox using wterm. It must not expose a server shell or network access. Keep real blog content and navigation available outside the terminal. Use @g4rcez/components as the design-system library and Tailwind CSS at the latest version.

## Brand Commitments

A minimalist light/dark visual system with #00A6F4 as the main color, as specified for this redesign.

## Evidence on Hand

The repository contains bilingual posts in `src/app/posts/` and `src/app/pt/posts/`, portfolio content in `src/lib/portfolio.ts`, and existing metadata/SEO routes. Do not invent professional claims or article content.

## Product Principles

- Put reading and discoverability before decoration.
- Keep the terminal genuinely interactive, but isolated from the host.
- Preserve content, route coverage, and bilingual access while redesigning the interface.
