---
useFolks: true
subjects: ["tricks", "typescript", "types", "generics"]
title: "Typescript - [3]"
language: "pt-br"
translations: ["pt-br"]
date: "2021-03-14T18:33:00.000Z"
description: "Os problemas de tipo do Dia a Dia"
---

Com a alta de TS, cada vez mais pessoas tem estudado tipos, criando tipos mais complexos para cada situação. Mas nem sempre é fácil criar tipos que resolvam nosso problema. Vamos discutir alguns problemas comuns

### Dicionários de enum

> Dado um enum de opções, preciso criar um objeto onde as chaves serão as chaves do enum, e o valor será um tipo genérico T

Esse é um problema comum, costumo precisar resolver esse problema no frontend quando tenho visualização de status para enums que recebo do backend.

```tsx
enum Status {
    Wait = "wait",
    Progress = "progress",
    Success = "success",
    Failed = "failed"
}
```

Com esse enum, temos mapeado todos os status que podemos receber, e com isso, aplicar o nosso dicionário. Existem duas formas simples de resolver esse problema. Uma é com o auxílio do `Record`, e a outra com o auxílio da keyword `keyof`.

Resolvendo com record

```tsx
type StatusDict<T> = Record<Status, T>
```

O Record faz um mapeamento das chaves do nosso enum, e para cada chave, ele aplica o tipo que passamos como segundo argumento, sendo o primeiro o enum ou objeto que iremos iterar.

Resolvendo com `keyof`:

```tsx
type StatusDict<T> = {
    [key in keyof Status]: T;
}
```

Com o `keyof`, precisamos escrever uma sintaxe menos human friendly, mas que possui o mesmo resultado de Record

Com esse tipo, temos tudo pronto para criar outros tipos baseado neste, já que esse tipo criado recebe um generics.


### Dicionários de alguma coisa

Como o nosso tipo ficou definido:

```tsx
type StatusDict<T> = Record<Status, T>
```

Agora com ele, iremos construir outros tipos para cada situação. Se precisarmos criar um componente react:

```tsx
type StatusComponents = StatusDict<React.FC<{ status: Status }>>
```

Com isso, temos um dicionário de componentes react, ficando assim a construção do nosso dicionário

```tsx
enum Status {
    Wait = "wait",
    Progress = "progress",
    Success = "success",
    Failed = "failed"
}

type StatusDict<T> = Record<Status, T>

type StatusComponents = StatusDict<React.FC<{ status: Status }>>

const statusComponents: StatusComponents = {
    [Status.Wait]: ({ status }) => <span className="capitalize text-default">{Status.Wait}</span>,
    [Status.Progress]: ({ status }) => <span className="capitalize text-progress">{Status.Progress}</span>,
    [Status.Success]: ({ status }) => <span className="capitalize text-success">{Status.Success}</span>,
    [Status.Failed]: ({ status }) => <span className="capitalize text-danger">{Status.Failed}</span>
}
```

Muito simples, não é? Tudo bem definido com os tipos e sem quebrar nada. O melhor de tudo é que se o enum receber uma nova property ou tiver alguma property removida, o `statusComponents` irá alertar um erro e vc terá que corrigir, sem precisar se preocupar se está esquecendo alguma coisa. O mesmo também vale pra caso você mude o nome das properties.

Era esse caso bem simples que queria trazer pra vocês hoje. Um truque simples e poderosíssimo, que vai ajudar bastante na hora da sua *codada* do dia a dia.
