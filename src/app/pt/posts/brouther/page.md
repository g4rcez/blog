---
level: 1
title: Criando um router fortemente tipado
subjects: ["react", "frontend", "typescript", "javascript"]
language: "pt-br"
translations: ["pt-br", "en-us"]
date: "2023-01-13T18:30:00.000Z"
description: "Um contrato type-safe para rotas, links e redirecionamentos"
---

[tl;dr. Código no codesandbox](https://codesandbox.io/s/vigilant-cloud-1lnyov?file=/src/index.tsx)

# Introdução

Quando se fala de roteamento em React, o [react-router](https://github.com/remix-run/react-router) costuma ser a primeira biblioteca lembrada. Alguns leitores também podem conhecer o mais recente [tanstack-router](https://github.com/TanStack/router). Ambos são boas opções para aplicações SPA (*Single Page Application*) e também oferecem suporte a SSR.

> Uma observação: o suporte a SSR é menos relevante quando a aplicação já utiliza um framework como Next.js ou Remix, porque essas soluções fornecem o roteamento. O Remix usa react-router internamente, mas sua configuração é diferente da de uma aplicação CSR (*Client Side Render*).

Este artigo aborda detalhes que costumam passar despercebidos ao utilizar bibliotecas de roteamento e apresenta o [brouther](https://github.com/g4rcez/brouther), uma solução para alguns desses problemas.

# React Router

Talvez esse seja o mais famoso de todos os routers react, também o mais antigo. Hoje ele está na versão 6.6.2 e traz
muitas features, algumas nem são ligadas ao roteamento em si. No passado houve alguns problemas quanto ao uso desse
router, principalmente porque os mantenedores do repo se separaram e aconteceu a criação
do [reach-router](https://reach.tech/router/), o que dividiu um pouco a comunidade.

Hoje o react router entrega muitas features úteis, um ecossistema fortemente baseado em hooks e uma documentação bem
rica. Podemos até fazer uma lista com tudo o que ele entrega:

- Roteamento do navegador via URL (padrão), hash ou roteamento em memória utilizando
  o [history](https://github.com/remix-run/history)
- Parametrização de rotas, bem similar ao [express](https://expressjs.com/en/guide/routing.html)
- Formas de navegação entre rotas que podem incrementar ou trocar os elementos da pilha de histórico do navegador
- Hooks, muitos hooks para quase todas as entidades presentes em uma URL ou em alguma outra entidade do contexto de
  roteamento
- Rastreamento de erros para rotas não encontradas, ou o famoso 404
- Controle do estado de transição das páginas, seja em roteamento ou até em submit dos formulários

Mesmo com esses recursos, ainda existem lacunas, principalmente em tipagem e experiência do desenvolvedor (DX):

- Falta de tipagem das rotas registradas no contexto
- Falta de tipagem nos componentes de Link, Redirect
- Falta de tipagem nas funções de manipulação da URL
- Diversas features que podem não ser usadas

Com a adoção do TypeScript, um ecossistema fortemente tipado se tornou mais importante. Isso nos leva ao tanstack-router.

# Tanstack Router

Esse router mais recente concentra-se na experiência do desenvolvedor. Seu ecossistema tenta combinar a flexibilidade do roteamento com tipagem e ferramentas melhores.

Como tive pouca experiência prática com ele, esta seção é breve. Quando escrevi o artigo, a documentação ainda não cobria todos os hooks ou formas canônicas de resolver cada problema. O ecossistema também inclui preocupações que nem sempre pertencem a uma biblioteca de roteamento, como integrações com bibliotecas de estado como react-query, Apollo e SWR.

Como era uma biblioteca relativamente nova, há pouco mais a acrescentar aqui. Ainda assim, é uma tecnologia para acompanhar se estado e roteamento sincronizados forem importantes no projeto.

# Brouther

Embora o [brouther](https://github.com/g4rcez/brouther) também seja uma biblioteca recente, ele se concentra em um problema além do roteamento: a lacuna de DX e tipagem. Sem tipagem para métodos e componentes, mudar o path de uma página exige atualizar referências em vários lugares. Convenções podem reduzir erros, mas não criam um contrato integrado.

O brouther fornece as ferramentas necessárias como um sistema integrado e opinativo ou como peças menores, que podem permanecer separadas do restante do sistema de tipos. Os problemas visados são:

- Melhoria de DX
- Tipagem para as rotas, incluindo query-string e paths valorados (assim como no express)
- Tipagem para os métodos do histórico
- Tipagem para os componentes
- Tipagem para os hooks
- Ecossistema simples
- Entregar o mínimo possível para o roteamento

## Tipagem

Com a adoção do TypeScript, um ecossistema fortemente tipado se tornou importante no desenvolvimento de aplicações. Por isso, conectei todo o ecossistema da biblioteca aos paths das páginas e às regras das URLs:

- *Pathname* (meusite.com/isso-e-o-pathname) fosse obrigatório, incluindo lugares onde o pathname é dinânico (/users/:
  id)
- Garantindo que todos os paths fossem de fato uma string
- Tipagem de *query string*, onde todos os parâmetros de query string são opcionais

Com essas regras e a biblioteca [ts-toolbelt](https://github.com/millsp/ts-toolbelt), basta informar o path da URL e um identificador para configurar o sistema. O element continua necessário, mas fica fora desta parte do modelo de tipos. A URL contém as informações necessárias para construir páginas, redirecionamentos e links. Observe o path:

```text
/posts/brouther?language=pt-br
|        ||
|        ||
|pathname||query-string
```

Para cadastrar essa rota no brouther:

```text
/posts/:title?language=string
```

Com essa definição, o brouther permite construir a URL da seguinte forma:

```typescript jsx
export const router = createRouter([
    {
        path: "/posts/:title?language=string",
        id: "post",
        element: <Fragment/>
    }
] as const);

router.link(router.links.post, {title: ""}, {});
```

O router retorna um objeto com métodos, componentes e hooks tipados a partir da definição das rotas. Aqui, vamos explorar apenas `router.link` e `router.links`.

### Construindo URLs

Antes de desenvolver a ideia, uma breve explicação do que são os dois itens citados acima:

`router.link` é um método que irá construir a URL com base nos paths passados em `createRouter`. O primeiro parâmetro é
uma rota informada no nosso `createRouter`, obrigatoriamente deve ser um path passado no array, para evitar paths
aleatórios que não existam no nosso sistema. É válido lembrar que deve ser exatamente o path inteiro, com a *query
string* e tudo. O segundo parâmetro vai variar conforme o seu path, se existirem paths dinâmicos como `/users/:id`,
então o segundo parâmetro será um objeto com todas as chaves obrigatórias, sendo essas chaves o apelido dado a cada um
dos paths dinâmicos. Caso o seu path não contenha paths dinâmicos, então teremos apenas a *query string* requerida aqui.
Vale lembrar que *query strings* são parâmetros não obrigatórios na URL, logo, não são obrigatórios. Caso você queira,
podemos utilizar `?language=string!` e o tipo irá obrigar a passar o language como string

`router.links` é um dicionário que respeita todos os ids passados no array de `createRouter`. Ou seja, os nossos ids são
apelidos para um objeto, fazendo com que você não precise digitar a string informada toda hora. Basta
usar `router.links.ALIAS_PARA_A_ROTA` e pronto, você já vai ter a mesma string utilizada na construção do nosso router.

Com essas regras, construir paths fica simples. As definições das rotas fornecem os tipos, sem exigir código adaptador para conectar a biblioteca ao restante da aplicação.

### Mapa de *query string*

Eu queria que as query strings fossem tipadas de forma explícita, em vez de convertidas em vários pontos da aplicação. Uma rota deve poder declarar que um valor é string e outro é number, mantendo esse contrato transparente em todo o sistema.

Os tipos abaixo são aceitos na *query string* e convertidos automaticamente. Acrescente `[]` para transformar um valor em array e `!` para torná-lo obrigatório. O mapa completo de conversões é:

```typescript
export type Map = {
    string: string;
    number: number;
    boolean: boolean;
    date: Date;
    null: null;
};
```

## Developer Experience

O objetivo do brouther é simplificar o trabalho com rotas por meio de tipos fortes e um conjunto focado de hooks. Manter a biblioteca pequena é uma decisão deliberada: evita código complexo e uma documentação extensa.

# Referências

- Construção de paths dinâmicos via tipo - [Github](https://github.com/ghoullier/awesome-template-literal-types)
- [ts-toolbelt](https://millsp.github.io/ts-toolbelt/)
- [RFC 1738](https://www.rfc-editor.org/rfc/rfc1738)
- [MDN - URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)

Esse é o núcleo do brouther: uma camada de roteamento pequena com um contrato type-safe.