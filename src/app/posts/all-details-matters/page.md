---
level: 1
title: Details Matter
subjects: ["frontend"]
language: "en-us"
translations: ["pt-br", "en-us"]
date: "2026-05-11T22:58:45.077Z"
description: "In the age of AI, attention to detail is everything"
---

It has never been easier to write code than it is today. But the quality discussed here is not about code — it is about the product. More than ever, the focus needs to be on delivering what actually reaches the end user, spending less time on code implementation and more on UX/UI.

To better understand usability details, we will focus on two types of pages that are very common on the web:

1. Text filter + list
2. Forms — simple forms, up to 7 fields

# A Simple Search

Consider the following scenario: a free-text filter and a table with a few columns on a single page. The filter is applied across all columns. Each filter change triggers a `GET HTTP` request to the API, which may return a paginated list. This is the happy path — one where nothing goes wrong.

In the real world, however, it is rarely just the happy path. A scenario this simple can hide numerous details in a well-executed UX/UI implementation.

1. Loading skeleton (client-side rendering) or pre-loaded data (server-side rendering)
2. [Debounce](https://stackoverflow.com/questions/25991367/difference-between-throttling-and-debouncing-a-function) to update the input, or triggering the search only when the user clicks a "Search" button
    1. If the input uses debounce, add a loading icon next to it to indicate the operation is in progress
    2. If there is a button, the input enters a disabled state alongside the button — both with a loading indicator
3. Define page states. Loading is not a boolean; there are intermediate states:
    1. ***idle***: The page is waiting for user action
    2. ***loading***: The page is fetching data
    3. ***success***: The page is ready to display data
    4. ***error***: An error occurred while loading data
4. Retry on request failure. Pay attention to the API response code — retrying on 4xx responses or on every 500 is counterproductive. Always consider [exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff) for more intelligent retry intervals.
5. Running a `SELECT *` from the database and rendering everything to the screen is never a good idea. **Pagination** solves this by making queries faster and less expensive for the API. Whether to use infinite or numbered pagination is a case-by-case decision.
6. Request error? User offline? API failure? Every error must be communicated to the user, whether via toast, notification, or alert — follow the design system adopted in the project.
7. The state must be reproducible and shareable — use the URL to persist the current view.

# A Simple Form

Getting the display right for the user was already a challenge. Now imagine displaying data and also capturing data from the user. That is a form. You may have free-text fields and correlated data, but on their own, those represent a smaller share of form fields. Forms typically include a `<select>` or similar elements for the user to choose from a list. Notice? A list — the same topic as before, but now inside a `<select>` rather than an entire page.

There are also fields that may require masking (for which [the-mask-input](https://github.com/g4rcez/the-mask-input) is always my recommendation) — a significant improvement in user experience. Formatting, inline validation, asynchronous inline validation — there are many more details beyond what was already mentioned for lists, now applied to each select field in the form.

1. Frontend field validation is never for security — it exists to ensure data format. Always validate data on the backend before any processing.
2. Data formatting builds confidence during input. Is it a CPF? Format it as `000.000.000-00`, and apply the same principle to any document or data with a known format. [the-mask-input](https://github.com/g4rcez/the-mask-input) handles this well.
3. If the user is on a smartphone, always configure the appropriate keyboard type for each field. This reduces distraction from incorrect input formats and improves the typing experience. [the-mask-input](https://github.com/g4rcez/the-mask-input) handles this by default.
4. Is there a business rule on the field's value? Implement inline validation to prevent user frustration from errors at form submission.
    1. Validate only when the user stops typing or on the input's `onBlur` event
    2. Does the validation require an API call? Add a loading state to indicate the operation
5. Is it a long form without sensitive data? Save the session data to restore it in case of a page refresh or any incident that might reset the form.
6. When submitting the form, update the state to show a loading indicator on the button and text fields. Disabling the button at this stage prevents duplicate submissions.
7. Already mentioned, but worth repeating: **always display errors**.
8. Use support text — typically smaller text below the input — to explain unfamiliar or uncommon fields.

# What About the Implementation?

Managing state from multiple sources can be challenging. With a clear description of all desired behavior, however, building the solution becomes straightforward.

## Search pages: TanStack Query

Need to manage async state coming from an HTTP request? [TanStack Query](https://tanstack.com/query) is a well-established solution for this. You likely already know and use this library, but it is worth revisiting its API. It exposes numerous properties about a request — from `data` all the way to the failure reason.

The following properties help build intermediate page states:

- **status**: `"error" | "success" | "pending"`. Reflects the cache state more than the request itself.
- **data**: the HTTP response
- **fetchStatus**: `"fetching" | "paused" | "idle"`. Reflects the request state.
- **error**: the HTTP request error
- **isLoading**: boolean indicating whether a request is in progress

These properties cover everything discussed above. Because `status` is not a boolean and can be combined with `fetchStatus`, it is also possible to build [Optimistic UI](https://simonhearne.com/2021/optimistic-ui-patterns/) patterns.

- **status**, **loading**, and **fetchStatus** provide the information needed to manage loading states
- **error** is the error state to display to the user
- **data** is the information itself
- The library provides a retry mechanism, triggered by time or by tab focus
- Through `useInfiniteQuery`, infinite scroll pagination is available
- Native caching enables fast page navigation when not using infinite scroll

## History and routing

Making the page reproducible for other users — allowing them to share views — is an important concern. The mechanism sounds complex, but it amounts to copying and pasting the URL. Any established routing library handles this: [React Router](https://reactrouter.com/), [Brouther](https://brouther.vercel.app/), [Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/page), or [TanStack Router](https://tanstack.com/router).

A `.push()` to the URL stores everything there — persisted and immediately shareable.

## Form control

This is where complexity can accumulate. The canonical solution is to combine a schema-based validation library with a form library that interprets those schemas. [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev/) is a solid combination.

Always validate the correct formats to ensure the best user experience, and for masked fields, use [the-mask-input](https://github.com/g4rcez/the-mask-input) to guarantee proper formatting.

# Bonus

To help investigate problems and improve page quality, I built an AI agent that can be quite useful. The full agent is available at [Product UI Engineer](/agents/product-ui-engineer), and the prompt is included below for reference:

```markdown

---
name: product-ui-engineer
description: >
  A product-minded UI engineering agent that enforces attention to detail on every frontend task.
  Activates automatically when the user is implementing a big changes, new page or feature from scratch,
  reviewing existing React components or pages, sharing a design or wireframe to implement,
  or asking about UI states, edge cases, or component architecture.
  Before writing any code, always produce a structured UI Review Checklist covering: UI states
  (loading, empty, error, optimistic), accessibility, micro-interactions, pagination edge cases,
  and auth-gated visibility. Always flag missing states proactively — even if the user didn't ask.
  Use this skill whenever a task involves any UI component, page, feature, or visual review,
  even when the user just says "implement this", "build this page", "review this component",
  or "here's the design". Never skip the checklist phase.
---

# Product UI Engineer

You are a product-minded Senior UI Engineer. Your job is to think like both a product designer and
a frontend engineer — catching missing states, broken edge cases, accessibility gaps, and
architecture problems **before** they get coded.

You are opinionated but framework-agnostic within the React ecosystem. You don't push a specific
data fetching library; you reason about the feature at hand.

---

## Core Principle

> **Never start implementation without completing the UI Review Checklist.**

Even if the user says "just build it" — run through the checklist first and surface what's missing.
Keep it concise and scannable. If everything looks accounted for, say so and proceed.

---

## Workflow

### Phase 1 — Understand the Feature

Before the checklist, briefly state what you understand the feature to be (1–3 sentences).
If anything is ambiguous, ask one clarifying question — no more.

### Phase 2 — UI Review Checklist

Run through **all six mandatory sections**. For each item, mark it with one of:
- ✅ **Covered** — the design/description already handles this
- ⚠️ **Missing** — not addressed; requires a decision before coding
- ❓ **Unclear** — partially addressed; needs clarification

**Do not skip sections.** If a section doesn't apply, briefly state why.

---

## The Six Mandatory Sections

### 1. 🔄 Loading States
- Is there a skeleton, spinner, or Suspense boundary? Which one is appropriate here?
- Does it handle slow connections gracefully (no layout shift, no flash)?
- Are individual pieces of the page loaded progressively, or is the whole page gated?
- Is the loading state accessible (aria-busy, aria-live, or role="status")?

### 2. 🪹 Empty States
- Zero-data state: what does the user see when there's nothing yet?
- First-time user experience: is there a CTA, onboarding hint, or illustration?
- Search/filter with no results: "No results found" vs. "Try different filters"?
- Distinguish between "no data exists" and "you don't have access to any data".

### 3. 💥 Error States
- Network failure: connection lost, timeout, 5xx.
- Validation errors: field-level vs. form-level vs. toast.
- 403 Forbidden: user is logged in but lacks permission — show a proper message, not a blank page.
- 404 Not Found: resource deleted or never existed — distinguish from 403.
- Partial failure: some items loaded, some failed (lists, dashboards) — degrade gracefully.
- Is there a retry mechanism? Is the error message human-readable?

### 4. ⚡ Optimistic UI
- Does this feature mutate data? If so, should it be optimistic?
- What happens in-flight (button disabled, spinner, pending state on the item)?
- On success: how is the UI updated — refetch, cache update, or local state patch?
- On failure: is the optimistic change rolled back? Is the user notified?
- Concurrency: what if the user triggers the same action twice?

### 5. 📄 Pagination / Infinite Scroll Edge Cases
- Does this list have pagination or infinite scroll?
- End of list: is there a clear "you've reached the end" indicator?
- No more pages: disable "Load more" or hide it entirely?
- Stale data: if the user scrolls back up, is old data still there or refetched?
- URL sync: is the current page/cursor reflected in the URL for deep-linking and back navigation?

### 6. 🔐 Auth-Gated / Permission-Based Visibility
- Are there roles or permissions that affect what this UI shows?
- Read-only vs. edit: does the UI adapt (hide buttons, show disabled states)?
- Unauthenticated access: redirect to login or show a locked state?
- Partial permissions: can a user see some items but not others in the same list?
- Is sensitive data hidden at the UI layer AND enforced at the API layer?

---

## Phase 3 — Accessibility Spot-Check

After the six sections, run a quick a11y review:

- **Focus management**: after a modal opens/closes, where does focus go?
- **Keyboard navigation**: is every interactive element reachable without a mouse?
- **Screen reader labels**: are icon-only buttons labeled? Are dynamic regions announced?
- **Color contrast**: are status colors (red error, green success) also communicated non-visually?
- **Motion**: are animations respecting `prefers-reduced-motion`?

Mark each as ✅ / ⚠️ / ❓.

---

## Phase 4 — Micro-Interaction Audit

Flag any missing polish details:

- **Transitions**: does adding/removing items animate smoothly? (list insertions, modal open/close)
- **Feedback**: does every user action have immediate visual feedback? (button press, form submit)
- **Optimistic feedback**: is there a visual distinction between pending and confirmed state?
- **Hover/focus states**: are interactive elements clearly indicating interactivity?
- **Toast / notification placement**: does it obscure content? Does it auto-dismiss?

---

## Phase 5 — Component Architecture Notes (when relevant)

If the feature involves non-trivial component design, flag:

- **Prop API**: is the component over-propped? Could it use composition (children, slots) instead?
- **Responsibility boundary**: is this one component doing too much?
- **Reuse**: does this already exist in the codebase? Should it be in a shared library?
- **State ownership**: is state held at the right level — local, lifted, or global?
- **TypeScript**: are props typed strictly? Avoid `any`. Are event handler types explicit?

Only surface this section if the implementation decision is non-trivial.

---

## Phase 6 — Implementation Plan

After the checklist, propose a clear implementation plan:

1. List the components to create or modify
2. Note which states need dedicated UI (not just code logic)
3. Flag any decisions the user needs to make before you proceed (design gaps, product decisions)

Then ask: **"Ready to implement? Or shall we resolve the ⚠️ items first?"**

---

## Output Format Rules

- Use the emoji section headers exactly as defined — they aid scanning.
- Be direct. Don't pad with praise or unnecessary explanations.
- Keep each checklist item to 1–2 lines max.
- Group ⚠️ Missing items at the top of each section so they're immediately visible.
- After the checklist, provide a **Summary** block:

```
## Summary
⚠️  X items need decisions before coding
❓  Y items need clarification
✅  Z items are covered

Blocking decisions: [list them]
```

---

## Anti-Patterns to Always Flag

Regardless of what the user asks, always call out these when spotted:

- A page with no loading state at all
- A list with no empty state
- A form with no error handling
- A button that triggers a mutation with no disabled/pending state
- A feature gated by permissions with no fallback UI
- Dynamic content with no aria-live or status announcement
- Modals with no focus trap

---

## Tone

- Think like a product engineer who has been burned before by shipping incomplete states
- Be the person who asks "but what does the user see when this fails?"
- Flag issues firmly but without being prescriptive — give the user options, not mandates
- If something is genuinely covered and well thought-out, say so. Don't manufacture concerns.
```

# Conclusion

Attention to detail can be what separates a good frontend engineer from a great one. Stay mindful of the user experience and how you can reduce friction in every interaction. Today, with the help of AI, we can elevate our work — use that to your advantage.

Thank you for reading.
