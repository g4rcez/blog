---
level: 1
title: Os detalhes importam
subjects: ["frontend"]
language: "pt-br"
translations: ["pt-br", "en-us"]
date: "2026-05-11T22:58:45.077Z"
description: "Na era da IA, a atenção aos detalhes é tudo"
---

Nunca foi tão fácil escrever código como hoje em dia. Mas a qualidade sobre a qual vamos falar não é de código, e sim do produto. Mais do que nunca, o foco precisa ser na entrega que atinge o usuário final — gastando menos tempo com implementação de código e mais com UX/UI.

Para entender melhor os detalhes de usabilidade, vamos focar em dois tipos de páginas muito comuns na web:

1. Lista + filtro de texto
2. Formulários. Aqui vale lembrar que são formulários simples, até 7 campos.

# Uma simples busca

Imagine o seguinte cenário numa página: um filtro de texto livre e uma tabela com algumas colunas. O filtro será aplicado a todas as colunas. Cada alteração do filtro gera uma requisição `GET HTTP` para a API, que pode retornar uma lista com paginação. Esse é o cenário feliz, onde nenhum erro pode atrapalhar sua implementação.

Mas no mundo real, nada é somente o cenário feliz. Um cenário simples como esse pode ter diversos detalhes escondidos numa boa implementação de UX/UI.

1. Skeleton de carregamento (client side rendering) ou já iniciar a tela com dados carregados (server side rendering)
2. [Debounce](https://stackoverflow.com/questions/25991367/difference-between-throttling-and-debouncing-a-function) para atualizar o input ou efetuar somente a busca ao clicar no botão "Buscar"
    1. Caso o input tenha debounce, lembre de adicionar um ícone de loading ao lado do input para indicar a operação
    2. No caso de ter o botão, o input entra em estado desabilitado, assim como o botão, ambos com indicativo de carregamento
3. Definir o estado da página. Carregamento não é somente booleano, podemos ter estados intermediários:
    1. ***idle***: A tela está a espera de alguma ação do usuário
    2. ***loading***: A tela está carregando alguma informação
    3. ***success***: A tela está apta para a visualização dos dados
    4. ***error***: houve um erro no carregamento dos dados
4. Retentativas em caso de falha da requisição. Aqui é válido se atentar ao retorno da API. Não adianta fazer uma retentativa em códigos 4xx ou em caso de 500. Nunca se esqueça do [exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff) para fazer retentativas em intervalos mais inteligentes.
5. Fazer um `SELECT *` do banco e exibir na tela nunca é uma boa ideia. Por isso temos a **Paginação**, que nos ajuda a tornar as buscas mais rápidas e menos custosas para a API. Aqui não vamos entrar no mérito de paginação infinita ou numerada, isso vai de caso a caso.
6. Erro na requisição? Usuário sem internet? Falha na API? Todo erro deve ser informado ao usuário, seja com toast, notificação ou alerta — siga o design system adotado no projeto.
7. O estado deve ser reproduzível e buscável, ou seja, use a URL para salvar o histórico.

# Um simples formulário

Deu trabalho pensar em exibir dados para o cliente? Imagina então exibir dados e ainda capturar dados do cliente. Esses são os formulários. Você pode até ter campos de texto livre e dados de correlação, mas sozinhos eles representam uma parcela menor dos campos de formulário. Geralmente em formulários temos o `<select>` ou similares para que o usuário selecione algum item da lista. Reparou bem? Lista, o mesmo tópico repetido anteriormente, mas agora dentro de um `<select>` e não uma página inteira. 

Ainda nem falamos sobre campos que podem ter formatações (para isso sempre tenho o [the-mask-input](https://github.com/g4rcez/the-mask-input)) que são uma grande melhoria na experiência do usuário. Formatações, validações inline, validações assíncronas e inline...são muitos detalhes além dos que já citamos para listas, mas agora para cada campo de select do nosso formulário.

1. A validação de campos do frontend nunca é para segurança, mas sim para garantir o formato dos dados. Antes de qualquer processamento no backend, lembre-se sempre de validar os dados.
2. A formatação dos dados é importante para trazer confiança no preenchimento. É um CPF? Formate com 000.000.000-00, e assim para cada documento ou dado conhecido por ter seu próprio formato. Lembre-se sempre do [the-mask-input](https://github.com/g4rcez/the-mask-input).
3. Se o usuário estiver acessando de um smartphone, lembre-se de sempre alterar o tipo do teclado para a melhor forma de preenchimento. Isso ajuda a reduzir distrações de formatos e a experiência de digitação. É válido dizer que o [the-mask-input](https://github.com/g4rcez/the-mask-input) já trata isso por padrão.
4. Existe alguma regra de negócio no valor do campo? Faça a validação inline para evitar frustração de erros ao submeter o formulário.
    1. Valide somente quando o usuário parar de digitar ou no `onBlur` do input
    2. A validação requer consulta a API? Coloque um estado de carregamento para indicar a operação
5. É um formulário extenso e sem dados sensíveis? Salve os dados de sessão para restaurar em caso de atualização da página ou algum acidente que possa reiniciar o formulário.
6. Ao submeter o formulário, atualize o estado para exibir o carregamento no botão e nos campos de texto. É importante lembrar que desabilitar o botão nesse estágio evita ações duplicadas.
7. Já foi citado antes, mas vale lembrar: **sempre exibir os erros**.
8. Use textos de suporte, geralmente textos em tamanho menor abaixo do input, para explicar mais sobre um campo que é pouco usual.

# Mas e a implementação?

Controlar o estado vindo de múltiplas fontes pode ser um problema, mas tendo a descrição de todo o comportamento desejado, fica fácil construir sua solução.

## Telas de busca: Tanstack/query

Precisa manipular um estado assíncrono? Esse estado vem de uma requisição HTTP? Já temos uma boa solução para isso, e estamos falando do [tanstack-query](https://tanstack.com/query). Provavelmente você já conhece e utiliza essa biblioteca, mas é importante lembrar de sua API. Essa biblioteca fornece diversas informações da requisição, que vão desde o `data` até razão de falha.

Podemos enumerar algumas propriedades que vão nos ajudar a criar os estados intermediários de uma tela:

- **status**: sendo eles `"error" | "success" | "pending"`. O status diz mais sobre os dados em cache do que a requisição em si
- **data**: a resposta para sua requisição HTTP
- **fetchStatus**: sendo eles `"fetching" | "paused" | "idle"`. O fetchStatus diz a respeito da requisição
- **error**: o erro da requisição HTTP
- **isLoading**: booleano se a requisição está sendo feita ou não

Não vou listar todas as propriedades, mas listando essas já dá para cobrir tudo o que falamos anteriormente, e por ter o `status` não booleano + status da requisição, ainda conseguimos trabalhar com [Optimistic UI](https://simonhearne.com/2021/optimistic-ui-patterns/).

- **status**, **loading** e **fetchStatus** nos dão as informações necessárias para o carregamento da tela
- **error** é literalmente o nosso estado de erro para ser exibido em tela
- **data** é a nossa informação
- A biblioteca também fornece mecanismo de retry, seja por tempo ou por ação de focar a aba do site
- Através do `useInfiniteQuery`, temos acesso a paginação no estilo scroll infinito
- O cacheamento nativo da biblioteca nos permite rápida navegação entre páginas (quando não utilizamos scroll infinito)

## Histórico + roteamento

Um tópico importante é tornar nossa página reproduzível para outros clientes, permitindo compartilhar as visualizações. Parece um mecanismo complexo, mas basta copiar e colar a URL. Para isso, podemos utilizar alguma biblioteca famosa de roteamento, seja [React Router](https://reactrouter.com/), [Brouther](https://brouther.vercel.app/), [NextJS](https://nextjs.org/docs/app/api-reference/file-conventions/page) ou até mesmo o [Tanstack Router](https://tanstack.com/router).

Basta fazer o `.push()` para a URL e tudo ficará lá, armazenado e permitindo compartilhamento rápido.

## Controle de formulário

Aqui é onde você realmente pode ter um problema, mas diria que a solução canônica é usar uma biblioteca de validação de esquema baseado em JSON + validação de formulários que interpretem os esquemas. Um combo perfeito é [Tanstack Form](https://tanstack.com/form) + [zod](https://zod.dev/).

Lembre-se sempre de validar os formatos corretos para garantir a melhor experiência do usuário, e em campos de formatação use sempre o [the-mask-input](https://github.com/g4rcez/the-mask-input) para garantir a formatação correta.

# Bônus

Para me ajudar a investigar problemas e melhorar a experiência das páginas, criei um agente de IA que pode ser bastante útil. Deixo aqui o prompt do agente para você usar:

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

## Summary
⚠️  X items need decisions before coding
❓  Y items need clarification
✅  Z items are covered

Blocking decisions: [list them]

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

# Conclusão

O cuidado aos detalhes pode separar você de um bom para um ótimo engenheiro frontend, por isso, fique sempre atento a experiência do usuário e como você pode melhorar e reduzir a fricção no uso do sistema. Hoje com a ajuda de IA podemos melhorar nosso trabalho, use isso ao seu favor.

Obrigado pelo seu tempo. Até a próxima.
