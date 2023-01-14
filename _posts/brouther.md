---
title: Criando um router fortemente tipado
useFolks: true
subjects: ["react", "frontend", "typescript", "javascript"]
language: "pt-br"
translations: ["pt-br"]
date: "2023-01-13T18:30:00.000Z"
description: "Melhorando a DX na hora de trabalhar com rotas, links e redirecionamentos"
---

[tl;dr. Código no codesandbox](https://codesandbox.io/s/vigilant-cloud-1lnyov?file=/src/index.tsx)

# Introdução

Quando se fala de roteamento em react, você logo lembra do [react-router](https://github.com/remix-run/react-router).
Alguns podem conhecer o recente [tanstack-router](https://github.com/TanStack/router). Ambos são ótimos e resolvem o
mesmo problema, roteamento em aplicações SPA (*Single Page Application*), possibilitando também o uso caso sua aplicação
seja SSR.

> Comentário pessoal: funcionar para SSR é pouco útil, já que as soluções para aplicações SSR como NextJS ou Remix
> entregam um sistema de roteamento. Mesmo que o Remix use o react-router por baixo dos panos, você não faz a
> configuração
> da mesma forma em uma aplicação CSR (*Client Side Render*).

A proposta desse artigo é apresentar algumas coisas que não nos atentamos quanto ao uso de bibliotecas de roteamento e
apresentar o [brouther](https://github.com/g4rcez/brouther), uma solução minha para resolver alguns dos problemas que
irei comentar.

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

Porém, com isso tudo é claro que existem buracos de implementação, principalmente em questões de tipagem e DX (
*Developer experience*). Algumas delas são:

- Falta de tipagem das rotas registradas no contexto
- Falta de tipagem nos componentes de Link, Redirect
- Falta de tipagem nas funções de manipulação da URL
- Diversas features que podem não ser usadas

Com a alta do Typescript, a tipagem acaba impactando bastante quando não existe um ecossistema fortemente tipado. E isso
nos leva ao tanstack-router

# Tanstack Router

O mais novo router da comunidade visa resolver certos problemas, principalmente problemas relacionados a DX. Visando
esses problemas, eles criaram um ecossistema que consegue entregar o melhor dos dois mundos entre **roteamento vs DX**.

Nesse cara não posso opinar muito porque ainda não tive muitas experiências com o mesmo, mas dando uma olhada na
documentação é possível ver que o mesmo ainda não possui documentação de todos os seus hooks e formas canônicas de
resolver um problema. Seu ecossistema possui muitas coisas que acabam não sendo responsabilidade de uma lib de
roteamento e ainda possui uma arquitetura voltada para integrar com bibliotecas de controle de estado, como
react-query (sendo do grupo desenvolvedor 🤔), Apollo, SWR e etc.

Por ser um cara bem novo, não vou comentar tanto, mas num geral, é uma tecnologia a se observar caso você possua muitos
problemas com estado/roteamento sincronizado

Por ser um cara bem novo, não vou comentar tanto, mas num geral, é uma tecnologia a se observar caso você possua muitos
problemas com estado/roteamento sincronizado

# Brouther

Apesar de também ser uma biblioteca nova, o [brouther](https://github.com/g4rcez/brouther) foi pensado em resolver um
único problema além do roteamento, sendo esse o problema de DX/tipagem. Como comentado sobre o react-router, sempre
pensei que a falta de tipagem para os métodos e componentes era um problema, por que caso você precise mudar o path de
uma página você terá um problema de mudar manualmente a referência em todos os lugares. Claro que você pode adotar
práticas para evitar os erros, mas ainda assim o problema continua a existir, pois, o ecossistema não é fortemente
integrado a biblioteca.

Com o brouther, a ideia é entregar todas as ferramentas necessárias, sejam elas fortemente integrados ao sistema (de
forma opinativa) ou apenas isolado de todo o sistema de tipos (de forma não opinativa). Alguns dos problemas visados:

- Melhoria de DX
- Tipagem para as rotas, incluindo query-string e paths valorados (assim como no express)
- Tipagem para os métodos do histórico
- Tipagem para os componentes
- Tipagem para os hooks
- Ecossistema simples
- Entregar o mínimo possível para o roteamento

## Tipagem

Com a alta do Typescript, ter um ecossistema fortemente tipado se tornou essencial no desenvolvimento de aplicações. Com
isso em mente, decidi fazer com que todo o ecossistema da biblioteca pudesse ser conectado aos paths das páginas e
seguindo as regras das URLs, onde:

- *Pathname* (meusite.com/isso-e-o-pathname) fosse obrigatório, incluindo lugares onde o pathname é dinânico (/users/:
  id)
- Garantindo que todos os paths fossem de fato uma string
- Tipagem de *query string*, onde todos os parâmetros de query string são opcionais

Seguindo essas regras e utilizando a biblioteca [ts-toolbelt](https://github.com/millsp/ts-toolbelt) foi possível
constuir um sistema onde você só precisa informar a URL (path) e um apelido (id) para ter todo o sistema montado. Não
podemos esquecer do nosso element, mas ele não entra nessa parte da tipagem. Através da URL é possível extrair todas as
informações necessárias
para podermos construir nossas páginas, fazer redirecionamentos e links. Observe o path abaixo

```text
/posts/brouther?language=pt-br
|        ||
|        ||
|pathname||query-string
```

Para cadastrarmos essa rota no brouther precisamos fazer da seguinte forma

```text
/posts/:title?language=string
```

Dessa forma você o brouther irá te entregar a seguinte forma de construir a URL:

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

Primeiro construimos o nosso router e ele irá retornar um objeto contendo alguns métodos, componentes e hooks fortemente
tipados para o nosso ecossistema tipado. Nesse ponto iremos apenas explorar o `router.link` e o `router.links`

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

Agora que temos a explicação fica fácil construir os nossos paths, basta seguir as regras dos parâmetros. O melhor de
tudo é que tudo fica fortemente tipado e você não precisa fazer macetes no código para conectar os tipos da biblioteca
com o seu ecossistema.

### Mapa de *query string*

A tipagem de uma *query string* sempre foi uma feature que eu quis nos routers, mas não de forma automática, mas sim de
forma que eu pudesse dizer "esse valor é uma string e esse é um number", evitando conversões no código e ficando de
forma transparente o uso em todos os lugares do sistema. A boa notícia é que agora podemos ter isso.

Abaixo temos a tipagem aceita na *query string*, feita a conversão automática para o tipo desejado. Caso você queira que
um desses itens seja um array, você pode incluir `[]` ao final do valor e ainda caso queira que ele seja obrigatório,
basta informar um `!` ao final. Caso queira saber todos os tipos da conversão, você pode ver o mapa abaixo:

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

O mais importante no brouther foi facilitar a vida de quem está usando a biblioteca, trazendo tipos fortes e bons hooks
para manipular inteiramente o sistema de rotas. A simplicidade também foi um fator crucial, tentando trazer o mínimo
possível para não inchar a biblioteca, evitando assim um código complexo e uma documentação extensa e cansativa para que
ninguém precise procurar diversos métodos

# Referências

- Construção de paths dinâmicos via tipo - [Github](https://github.com/ghoullier/awesome-template-literal-types)
- [ts-toolbelt](https://millsp.github.io/ts-toolbelt/)
- [RFC 1738](https://www.rfc-editor.org/rfc/rfc1738)
- [MDN - URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)