---
name: blog-writer
description: Write, review, and translate blog posts between Portuguese (pt-BR) and English (en-US) for garcez.dev. Use this skill whenever the user wants to write a new blog post, translate an existing post between Portuguese and English, review grammar/style of a post, improve writing quality, or create content for the blog. Triggers on mentions of blog posts, articles, translations pt-br/en-us, writing posts, reviewing post grammar, or content for the blog.
---

# Blog Writer

Skill for writing, reviewing, and translating blog posts on garcez.dev. Posts are technical articles about frontend development, TypeScript, React, and related topics.

## Blog Structure

Posts live in two directories:
- **Portuguese (default)**: `src/app/posts/<slug>/page.md`
- **English**: `src/app/en/posts/<slug>/page.md`

## Post Format

Every post is a Markdown file with YAML frontmatter:

```yaml
---
level: 0          # 0 = beginner, 1 = intermediate, 2 = advanced
title: "Post Title"
subjects: ["react", "typescript", "frontend"]
language: "pt-br"  # or "en-US"
translations: ["pt-br"]  # add "en-us" when English version exists
date: "2025-01-18T13:07:22.874Z"
description: "One-line summary of the post"
---
```

When creating a translation, update the original post's `translations` array to include the new language.

## Writing Style

The blog targets a technical audience (developers). The tone should be **formal but accessible** — professional without being dry. The author's personality should come through in the structure and examples, not through slang or jokes.

### Rules

1. **No emoji shortcodes** (`:smile:`, `:cry:`, `:heart:`, etc.) in prose. Emojis are acceptable only in code comments if they serve a purpose.
2. **No slang or internet-speak**: avoid "dude", "buddy", "lol", "haha", "xD", "folks", "awesome", "cool" as filler.
3. **No profanity** in any language.
4. **No self-deprecating humor** that undermines technical credibility ("Sorry for the jokes", "I swear this makes sense in my head").
5. **No apologetic filler**: remove "Well...", "Anyway...", "Without further ado", "Let's go".
6. **Formal closings**: use "Thank you for reading." or "Feel free to reach out with questions." instead of "Big hug", "See ya", "That's all, folks".
7. **Formal openings**: avoid casual greetings like "Hey folks" or "What's up". Start with the topic or a brief context sentence.
8. **Rhetorical questions are OK** when they introduce a concept, but avoid overusing them or answering your own questions casually ("Right? Right.").
9. **Code blocks are sacred**: never modify code examples when reviewing or translating, except for translating comments inside code.
10. **Blockquotes for reader questions**: when simulating a reader question, phrase it formally. Instead of `> But Allan, why...`, use `> A natural question is: why...` or `> One might ask: why...`.

### Grammar Checklist

When writing or reviewing, check for:

- **Missing articles**: English requires "a", "an", "the" more than Portuguese. Every noun phrase should be checked.
- **Run-on sentences**: break sentences longer than ~30 words into two. Use periods, semicolons, or em dashes.
- **Subject-verb agreement**: especially in complex sentences with nested clauses.
- **Comma usage**: before "but", "which", "although"; after introductory phrases; in lists (Oxford comma preferred).
- **Sentence fragments**: ensure every sentence has a subject and verb.
- **Consistent tense**: prefer present tense for describing code behavior, past tense for project narratives.

## Translation Guidelines

Read `references/translation-guide.md` for the complete translation reference. Key principles:

### PT-BR to EN-US

1. **Do not translate literally** — rewrite for natural English. Portuguese sentence structure (subject placement, relative clauses) often produces awkward English when translated word-for-word.
2. **Watch for false cognates and idioms**:
   - "nem tudo sao flores" -> "not everything is straightforward" (not "not everything is roses")
   - "na hora" -> "at that moment" or "immediately" (not "in the hour")
   - "dar conta" -> "handle" or "manage" (not "give account")
   - "fazer sentido" -> "make sense" (this one translates directly)
3. **Add articles**: Portuguese often omits articles where English requires them. "Criando array em JS" -> "Creating an array in JavaScript".
4. **Expand contractions in formal writing**: prefer "it is" over "it's", "do not" over "don't" in topic sentences and key statements. Contractions are acceptable in flowing prose.
5. **Translate code comments** inside code blocks, but leave variable names, function names, and string literals unchanged.
6. **Preserve all URLs, image paths, and code block content** exactly as-is.

### EN-US to PT-BR

1. **Use Brazilian Portuguese conventions**: "voce" (informal), not "tu" (unless regional). Prefer "a gente" over "nos" for informal contexts.
2. **Technical terms**: keep English terms that are standard in Brazilian dev culture: "deploy", "build", "commit", "branch", "hook", "callback", "framework". Do not translate these.
3. **Adapt examples**: if examples reference culture-specific items (SSN, ZIP codes), adapt to Brazilian equivalents (CPF, CEP) when possible.
4. **Formal register**: use "e possivel observar" over "da pra ver", "utilizar" over "usar" for key actions, though "usar" is fine in flowing text.

## Workflow

### Writing a new post

1. Ask the user for: topic, target language, difficulty level (0/1/2), and key subjects/tags.
2. Generate the frontmatter with today's date in ISO format.
3. Write the post following the style guidelines above.
4. Structure: Introduction -> Core sections with code examples -> Conclusion.
5. Keep conclusions brief (2-3 sentences). Do not repeat what was already said.

### Translating an existing post

1. Read the source post completely.
2. Create the translated version in the correct directory (`src/app/en/posts/<slug>/page.md` or `src/app/posts/<slug>/page.md`).
3. Update the frontmatter: change `language`, keep `translations` array with both languages.
4. Update the **source post's** `translations` array to include the new language.
5. Translate following the guidelines above. Rewrite for natural reading, do not translate literally.
6. Preserve all code blocks, only translating comments within them.
7. Review the translation for the common pitfalls listed in `references/translation-guide.md`.

### Reviewing an existing post

1. Read the post completely.
2. Check against the Writing Style rules and Grammar Checklist above.
3. Apply fixes using Edit tool — targeted changes, not full rewrites.
4. Preserve the author's voice and technical content. Only change grammar, formality, and clarity.
5. Never modify code blocks (except fixing comments if translating).
