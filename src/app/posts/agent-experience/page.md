---
level: 1
title: "Forget DX, Focus on AX"
subjects: ["ai", "agents", "workflow", "testing"]
language: "en-us"
translations: ["pt-br", "en-us"]
date: "2026-11-12T12:00:00.000Z"
description: "How to design the agent experience: context, tools, guardrails, and CI so that AI can write code with quality"
---

DX stands for _Developer Experience_: how pleasant and productive it is to work in a codebase. AX stands for _Agent Experience_: how easy it is for an agent to understand a codebase, act on it, and know whether it got the result right.

Today I no longer write code. I write workflows, skills, plugins, and tools so that my harness (Claude Code and [pi.dev](https://pi.dev)) can validate the code. The agent writes, and the workflow decides whether the result is correct. This post gathers the pieces of that workflow, one per section, with snippets you can adapt to your project.

> A natural question is: why invest in AX if a better model solves the problem? Because the model is only one variable. An agent with poor context, no search tools, and no tests makes mistakes with any model; it just makes them at a different pace.

## Context is the new onboarding

A new developer reads the README, asks the team questions, and learns the language of the domain. An agent has none of this, and every session starts from zero. The project instructions file plays the role of onboarding.

This file is called `CLAUDE.md` or `AGENTS.md`, depending on the harness. The name matters less than the content. A useful file answers four questions:

```md
# AGENTS.md

## Commands
- `npm run check`: lint, typecheck, and tests. Run it before opening a PR.
- `npm run test -- <file>`: a single test file.

## Structure
- `src/domain`: business rules, with no React dependency.
- `src/ui`: components. They do not access the API directly.

## Domain language
- An `Order` is a cart after payment. Before that, it is a `Cart`.

## Rules
- Do not add dependencies without asking.
- Every new behavior needs a scenario in `tests/features`.
```

Two rules keep this file useful. First: every line must prevent a real mistake that the agent has already made. A line that prevents no mistake costs tokens and attention without any return. Second: keep the file short and point to larger documents when needed, because context loaded without need gets in the way of decisions.

## Give the agent better search tools

Most of an agent's work is finding the right code. A naive `grep` returns hundreds of lines, and the agent spends its context reading noise. These tools reduce that cost:

- [ripgrep](https://github.com/BurntSushi/ripgrep) (`rg`) for fast text search that respects `.gitignore`.
- [fzf](https://github.com/junegunn/fzf) to filter large lists of files by name.
- [ast-grep](https://ast-grep.github.io) to search by code structure instead of by text.

The difference shows up in structural searches. Finding every `fetch` call without error handling is hard with text and simple with the syntax tree:

```bash
ast-grep run --lang ts --pattern 'await fetch($$$ARGS)' src
```

Installing the tool is not enough; the agent needs to know when to use it. A short instruction in the context file solves this:

```md
## Search
- Symbol name or text: `rg`.
- Code pattern (calls, imports, JSX): `ast-grep run --lang tsx --pattern '...'`.
- Never read a whole file to find a function. Search first.
```

## Deterministic and non-deterministic rules

There are two kinds of rules, and each has its own role.

Deterministic rules are verified by a tool. The result is always the same, and the agent cannot ignore them. An example with [oxlint](https://oxc.rs/docs/guide/usage/linter):

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "react"],
  "rules": {
    "no-console": "error",
    "typescript/no-explicit-any": "error",
    "react/exhaustive-deps": "error"
  }
}
```

Non-deterministic rules are natural-language instructions, such as those in `CLAUDE.md` or `.cursorrules`. The agent interprets them, so they can fail. "Prefer composition over inheritance" and "function names describe intent" have no verifier.

My criterion is simple. If a tool can validate the rule, it goes to the linter or the type checker. Natural language is left for what only judgment can evaluate. Every rule that moves from text to a tool stops depending on the agent's interpretation.

## Skills, plugins, and hooks

When the same procedure repeats, it becomes a skill. A skill is a folder with a `SKILL.md` file. The frontmatter says when it applies, and the body says how to execute it.

```md
---
name: new-feature
description: Creates a new feature following the project flow. Use when the user asks for a new capability.
---

1. Write the scenario in `tests/features/<name>.feature`.
2. Run the scenario and confirm that it fails for the right reason.
3. Implement the minimum needed to pass.
4. Run `npm run check`.
```

Skills depend on the agent remembering them. Hooks do not, because the harness runs them on defined events. In Claude Code, this hook runs oxlint after every file edit:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx oxlint >&2 || exit 2"
          }
        ]
      }
    ]
  }
}
```

The exit code `2` is the detail that matters. It sends the error message back to the agent, which fixes the problem in the same session. The error arrives right after the code is written, not in CI twenty minutes later.

Plugins package skills, hooks, and commands so that the whole team uses the same workflow.

## Tests as a guardrail and future-proofing

Tests have two functions. The first is to verify that the code works. The second, more important for AX, is to make change possible. With a reliable suite, the agent changes several parts of the application and knows immediately whether something broke. Without the suite, every change is a risk that someone must review line by line.

I write use cases in [Gherkin](https://cucumber.io/docs/gherkin/). The format works as a [DSL](https://martinfowler.com/articles/llm-and-dsls.html) between human intent and code: people read it effortlessly, and it is precise enough for the agent to implement.

```gherkin
# language: en
Feature: Discount coupon

  Scenario: A valid coupon reduces the total
    Given a cart with a total of $100.00
    When the customer applies the coupon "PRIMEIRA10"
    Then the cart total is $90.00

  Scenario: An expired coupon is rejected
    Given a cart with a total of $100.00
    When the customer applies the coupon "NATAL2020"
    Then the customer sees the message "Coupon expired"
    And the cart total remains $100.00
```

Each scenario becomes a test. For business rules, I use [Vitest](http://vitest.dev/):

```ts
import { describe, expect, it } from "vitest";
import { applyCoupon } from "./cart";

describe("discount coupon", () => {
  it("a valid coupon reduces the total", () => {
    const cart = { total: 100 };
    expect(applyCoupon(cart, "PRIMEIRA10").total).toBe(90);
  });
});
```

For the complete flow in the browser, I use [Playwright](https://playwright.dev/):

```ts
import { expect, test } from "@playwright/test";

test("an expired coupon is rejected", async ({ page }) => {
  await page.goto("/cart");
  await page.getByLabel("Coupon").fill("NATAL2020");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("Coupon expired")).toBeVisible();
});
```

A practical rule: the agent writes the scenario first, watches the test fail, and only then implements. This way, no tests are left that pass without verifying anything.

## Validate behavior on video

An automated test answers "passed or failed". For interface flows, I also want to see what happened, so I use video as evidence of the agent's work.

[testing-agent](https://github.com/g4rcez/testing-agent) executes use cases written in natural language in a real browser. Each step is an instruction, with no selectors, and the assertions define the final result, not the model:

```yaml
name: Expired coupon
url: http://localhost:3000/cart
prompt: Apply an expired coupon and verify that it is rejected.
steps:
  - instruction: Type NATAL2020 in the Coupon field
    value: NATAL2020
  - instruction: Click Apply
    expect:
      text: Coupon expired
```

The run generates a video. Instead of reading a diff to find out whether the flow works, I watch thirty seconds of recording. The review focuses on behavior, which is what matters to the people who use the product.

## CI fast enough for the agent

An agent can only validate its own work if verification is fast. With a twenty-minute CI, it opens the PR without certainty, and the feedback arrives late. The question for your pipeline is: can the agent run all of this before publishing the PR?

The first step is a single local command that reproduces CI:

```json
{
  "scripts": {
    "check": "oxlint && tsc --noEmit && vitest run",
    "check:changed": "oxlint && tsc --noEmit && vitest run --changed origin/main"
  }
}
```

`check:changed` runs only the tests affected by the change, and it is what the agent uses while working. CI runs the full `check`:

```yaml
name: ci
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 26
          cache: npm
      - run: npm ci
      - run: npm run check
```

To keep the pipeline fast, cache dependencies, run only the affected tests in the local cycle, run lint, types, and tests in parallel, and treat the time limit as a requirement. A flaky test is worse than a missing test, because the agent learns to ignore failures.

## Review the workflow, not the code

In some cases, a person no longer reviews the code. Even so, someone is accountable for the result. Responsibility changes place: the human now reviews the workflow and validates the behavior.

What I review:

- Rules: do the linter and the context file cover the mistakes that have already happened?
- Tests: do the scenarios describe the expected behavior, including edge cases?
- Evidence: do the video and the CI result show that the flow works?
- Skills and hooks: is the procedure the agent follows correct and complete?

When a bug gets through, the fix has two parts. First, fix the code. Then ask why the workflow let the bug through. The answer becomes a linter rule, a new scenario, or a line in the context. This way the same mistake does not return, and the workflow improves with every failure.

## Agent teams

The next step for AX is making several agents work together. This is what I am building in [ZettaBot](https://zettabot.app/), an open source project that runs on your own server. You describe an outcome, and a team of bots does the work.

Each bot is a configured worker, such as a Writer or a Reviewer. It runs on top of an agent you already use (Claude Code, Codex, Cursor, Pi, OpenCode), receives skills, plugins, and MCP servers, and has its own way of working. A main bot, Zetta, creates the other bots, distributes tasks, and maintains routines. Tasks move through backlog, in progress, blocked, review, and done, and each card shows the responsible bot. Sensitive actions, such as deleting data or sending email, require your approval.

The structure repeats what this post described for a single agent: context, tools, and guardrails. The difference is that there are now roles, and the goal of the team is to deliver with quality and speed.

## Conclusion

AX means giving the agent context, tools, and a fast way to know whether it got the result right. The better the workflow, the less the code needs to be reviewed line by line. Start with one step: take your agent's latest mistake and turn it into a rule or a test.

Thank you for reading.
