# Translation Guide: PT-BR <-> EN-US

Comprehensive reference for translating blog posts between Brazilian Portuguese and American English. These patterns were extracted from reviewing 17 translated posts and identifying recurring issues.

## Table of Contents

1. [Common PT-BR to EN-US Pitfalls](#pt-br-to-en-us-pitfalls)
2. [Common EN-US to PT-BR Pitfalls](#en-us-to-pt-br-pitfalls)
3. [Idioms and Expressions](#idioms-and-expressions)
4. [Technical Vocabulary](#technical-vocabulary)
5. [Sentence Structure Patterns](#sentence-structure-patterns)
6. [Formality Adjustments](#formality-adjustments)

## PT-BR to EN-US Pitfalls

### Missing Articles

Portuguese frequently omits articles where English requires them. This is the single most common error in translations.

| Portuguese | Bad English | Good English |
|---|---|---|
| Criando Array em JS | Creating Array in JS | Creating an Array in JS |
| Usando reduce | Using reduce | Using `reduce` |
| Problema foi resolvido | Problem was solved | The problem was solved |
| Com hooks, podemos... | With hooks, we can... | With hooks, we can... (OK here) |

**Rule**: After translating a sentence, re-read it and check every noun. Does it need "a", "an", or "the"?

### Subject Omission

Portuguese is a pro-drop language (subjects can be implied). English requires explicit subjects.

| Portuguese | Bad English | Good English |
|---|---|---|
| Pode usar sem medo | Can use without fear | You can use it safely |
| Ficou muito bom | Was very good | The result was very good |
| Precisa instalar primeiro | Need to install first | You need to install it first |

### Verb Placement

Portuguese allows more flexible verb placement. English strongly prefers Subject-Verb-Object order.

| Portuguese | Bad English | Good English |
|---|---|---|
| Nesse caso resolve-se com... | In this case resolves itself with... | In this case, this is resolved with... |
| Aqui mostrarei o codigo | Here I'll show the code | The code is shown below |

### Run-on Sentences

Portuguese writing style tends toward longer sentences with many clauses joined by commas. English prefers shorter, clearer sentences.

**Before**: "Since we're going to use TS, it's good to use TSLint together to avoid any mess, and if you want reference you can look at my tslint.json, but remember that you need to install it globally first."

**After**: "Since TypeScript is being used, TSLint is recommended to maintain code quality. A reference configuration is available in my tslint.json. Note that TSLint must be installed globally first."

### Gerund Overuse

Portuguese frequently uses gerunds ("-ando", "-endo", "-indo"). Translating all of them to English "-ing" forms creates awkward prose.

| Portuguese | Awkward | Better |
|---|---|---|
| Estou utilizando hooks | I'm utilizing hooks | Hooks are used here |
| Ficamos precisando de... | We're needing... | This requires... |
| Vamos estar fazendo... | We'll be doing... | We will do... / The next step is... |

## EN-US to PT-BR Pitfalls

### Over-formalization

English formal writing can sound stiff in Portuguese. Brazilian Portuguese allows a slightly warmer register while remaining professional.

| English | Too formal PT-BR | Natural PT-BR |
|---|---|---|
| One might consider... | Alguem poderia considerar... | Vale considerar... |
| It is worth noting that... | E digno de nota que... | Vale notar que... |
| The aforementioned... | O supramencionado... | O item mencionado... |

### Passive Voice

English uses passive voice more than Portuguese. When translating to PT-BR, prefer active voice.

| English | Passive PT-BR | Active PT-BR |
|---|---|---|
| The function is called by... | A funcao e chamada por... | ... chama a funcao |
| This is handled by React | Isso e tratado pelo React | O React trata isso |

### Technical Anglicisms

Some English terms are kept as-is in Brazilian Portuguese tech writing. Do NOT translate these:

- deploy, build, commit, push, pull, merge, branch, fork
- hook, callback, middleware, plugin, framework, library
- frontend, backend, fullstack, devops
- bug, debug, log, stack trace, runtime
- render, mount, unmount, rerender
- props, state, context, reducer, dispatch
- npm, yarn, pnpm (package managers)
- CSS, HTML, API, REST, GraphQL, SSR, SPA, SEO

Terms that SHOULD be translated:
- file -> arquivo
- folder/directory -> pasta/diretorio
- array -> vetor (though "array" is commonly used)
- string -> cadeia de caracteres (though "string" is commonly used)
- pattern -> padrao
- example -> exemplo

**Rule of thumb**: if the term is commonly used in Portuguese tech blogs and meetups without translation, keep it in English.

## Idioms and Expressions

### PT-BR idioms and their English equivalents

| Portuguese | Literal (avoid) | Natural English |
|---|---|---|
| Nem tudo sao flores | Not everything is roses | Not everything is straightforward |
| Na hora H | In the H hour | When it matters most |
| Dar um jeitinho | Give a little way | Find a workaround |
| Mao na massa | Hand in the dough | Hands-on / Let's get started |
| De cara | From face | Right away / Immediately |
| Quebrar a cabeca | Break the head | To struggle with / To puzzle over |
| GoHorse | (Brazilian dev slang) | Quick and dirty / Unprincipled approach |
| Gambiarra | (no direct translation) | Workaround / Hack |
| Puxar sardinha | Pull sardine | To favor one side |

### English idioms to avoid when translating to PT-BR

Some English idioms don't translate well. Rephrase instead:

| English idiom | Don't translate literally | Use instead |
|---|---|---|
| Out of the box | Fora da caixa | Pronto para usar / Nativamente |
| Under the hood | Debaixo do capo | Internamente / Por baixo dos panos |
| Boilerplate | (keep as-is or) | Codigo padrao / Template |
| Silver bullet | Bala de prata (OK) | Solucao magica |
| Deep dive | Mergulho profundo (OK) | Aprofundamento |

## Sentence Structure Patterns

### Introductions

**Portuguese style**: Start with a greeting or personal touch, then transition to the topic.
```
Fala galera, beleza? Hoje vamos falar sobre...
```

**English formal style**: Start directly with the topic or a brief context sentence.
```
This article covers the fundamentals of...
```

### Conclusions

**Portuguese style**: Warm, personal closing.
```
E isso ai pessoal, espero que tenham gostado. Qualquer duvida, sabem onde me encontrar!
```

**English formal style**: Brief, professional closing.
```
Thank you for reading. Feel free to reach out with any questions.
```

### Section Transitions

**Portuguese style**: Casual connectors are common.
```
Bom, agora que ja vimos isso... / Beleza, vamos continuar...
```

**English formal style**: Clean transitions.
```
With that foundation in place... / The next section covers...
```

## Formality Adjustments

### Words to avoid in English posts

| Avoid | Use instead |
|---|---|
| awesome, cool | effective, useful, powerful |
| stuff, things | elements, items, components |
| guy, dude | (omit or use specific noun) |
| super (as intensifier) | highly, very, particularly |
| a lot of | many, several, numerous |
| gonna, wanna | going to, want to |
| basically | (omit — usually filler) |
| just (as minimizer) | (omit or use "simply") |
| check this out | consider the following |
| let's go | let us proceed / (omit) |
| right? | (omit or rephrase as statement) |

### Words to moderate in Portuguese posts

| Too informal | More appropriate |
|---|---|
| mano, cara, brother | (omit direct address) |
| da hora, massa, top | excelente, muito bom, eficaz |
| zuado, zoado | problematico, inadequado |
| treta | problema, conflito |
| foda | (avoid entirely) |
| hahaha, kkk, rsrs | (remove from prose) |
| tipo assim | por exemplo, como |
| basicamente | (omit — filler in both languages) |
