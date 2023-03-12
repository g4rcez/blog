---
title: Criando um reduce tipado
level: 1
subjects: ["typescript","tricks"]
language: "pt-br"
translations: ["pt-br"]
date: "2023-01-25T11:47:51.314Z"
description: "Como transformar um array em um objeto fortemente tipado?"
---

Um dos problemas mais legais que já tive com tipagem no Typescript foi como transformar um array em um objeto com chave
e valor tipado. Caso esteja curioso, você pode ver isso no [brouther](https://github.com/g4rcez/brouther).

# Motivação

Para construir as rotas de configuração do Brouther, era necessário receber um array com todas as rotas. A principal
ideia era mapear esse array para um objeto mapeado onde a chave é correspondente a propriedade "id" e o valor é
correspondente ao "path".

Claro que não seria possível fazer essa mágica sem o uso do [ts-toolbelt](https://github.com/millsp/ts-toolbelt), uma
biblioteca que entrega diversos tipos utilitários. Assim você não precisa se preocupar em construir alguns tipos super
complexos do zero, e quando precisar de tipos ainda mais complexos, você tem um ferramental enorme.

# Intenção

Explicando da maneira mais simples possível, a ideia desse tipo é simular comportamento do `.reduce` de Array para
tipos, podendo transformar o seu Array em qualquer coisa. No nosso caso, um objeto que se encaixa no
padrão `Record<string, string>`. Fazer dessa forma genérica não faz sentido, pois você perde toda a inferência de tipos,
por isso a necessidade do `reduce` tipado.

# Cadê o código?

Antes de jogar uma tipagem super complexa aqui, é preciso explicar o uso do ts-toolbelt nesse código. Foram utilizados
dois métodos da biblioteca, `F.Narrow` e `N.Add`, que são basicamente são namespaces correspondentes a `Function` e `Number`,
respectivamente.

- `F.Narrow`: uma forma de garantir imutabilidade total do nosso array. Apenas o `as const` não foi totalmente válido em
  alguns casos, mas ele é opcional para objetos simples
- `N.Add`: o método de adicionar números através de tipos, você pode fazer `N.Add<1,1>` e o resultado será `2`. Esse
  cara é o mais importante na lógica do nosso `Reduce`.

Agora uma explicação da lógica necessária para chegar no resultado. Dado que você conheça o `.reduce` e os índices de
arrays, será tranquilo chegar na lógica desse tipo (não dá para falar que foi fácil executar).

1. Precisamos receber um array readonly `extends readonly any[]` para garantir a imutabilidade. O uso do any é para
   determinar que pode ser qualquer tipo de array⁄
2. Recebemos um generics `K extends keyof T[number]` para sinalizar que queremos uma property expecífica do nosso array.
   Essa property será usada para ser uma chave no objeto
3. Recebemos um generics `V extends keyof T[number]` para sinalizar que queremos uma property expecífica do nosso array.
   Essa property será usada para ser um valor da chave no objeto
4. Recebemos um `C extends number = 0` para ser o nosso contador. Ele será responsável por controlar a recursividade do
   nosso tipo, indo de 0 até o tamanho máximo do array
5. Caso `C` seja igual ao tamanho máximo do array, retorne um objeto vazio. Como os índices do array vão de 0
   até `tamanho máximo - 1` essa condição encerra a recursividade
6. Caso `C` não seja o mesmo valor do tamanho do array, crie um objeto `{ readonly [_ in T[C][K]]: T[C][V] }`. Calma que
   eu vou explicar. `T[C]` é para pegar o item corrente do array, ou seja, para a posição `C=0`, pegue o primeiro
   item, `C=2` pegue o segundo item e assim até que o array seja todo percorrido. `T[C][K]` serve para pegar a chave do
   item corrente no array, equivalente a `array[0].id`. E por último `T[C][V]` é responsável por pegar o valor,
   equivalente a `array[0].path`
7. Um merge é feito do objeto criado com um objeto recursivo de `Reduce`, porém nesse ponto é importante lembrar que
   iremos incrementar o valor de `C` para podermos percorrer o array da posição `1` até `N-1`.

Com todos esses passos, temos esse resultado:

```typescript
import type { N, F } from "ts-toolbelt";

type Reduce<
        T extends readonly any[], 
        K extends keyof T[number], 
        V extends keyof T[number], 
        C extends number = 0
> =
    C extends T["length"] ? {} : {
        readonly [_ in T[C][K]]: T[C][V]
    } & Reduce<T, K, V, N.Add<C, 1>>

const reduce =
    <
            T extends readonly any[], 
            K extends keyof T[number], 
            V extends keyof T[number]
    >(routes: F.Narrow<T>, k: K, v: V):
        Reduce<T, K, V> => 
            (routes as T).reduce((acc, el) => ({...acc, [el[k]]: el[v]}), {}) as any

const map = reduce([
    { id: "users", path: "/users" },
    { id: "admin", path: "/admin" },
    { id: "root", path: "/root" },
    { id: "general", path: "/general" },
] as const, "id", "path")

// infer types from each item of your object
const rootName = map.admin;
const root = map.root
console.log(map);
```

Caso tenha interesse em ver o funcionamento desse código, pode dar uma olhada
no [playground](https://www.typescriptlang.org/play?ssl=17&ssc=1&pln=18&pc=1#code/JYWwDg9gTgLgBDAnmApnA3nAcgGjgMTgF84AzKCEOAIhgGcBaGCCAGwCMVWZqBuAKH5JUcAEooAJgFcAxigA8AFTgoAHjBQA7CXThQUAQwkRNrRHAObEAbQC6eANIr1WnXADWKRBFJxF1zSkQTih7OAA1Zw1tXU9vX39A4JRQvABhKNddJJC4AF44AAYAPnz+OAq4DLVot39qVi0AcxgAC2pbOAB+DBIALgxyyuH9IxMzOGsAfThgTT9rNNtrB1tbAf8l63DbIYqSADIxSVkFRUc8cLwsADoAQQkJeTS8AEZi4sEZEzp4fWk5GVhkpMjE9IZjKZzJYbGEnDUsh4vD4FjkUmFIgiwXEUYkgiFbMUABQUKQaOgDfA3LAGKAUADuSmKeHcAwceAAbgNwgBKPp7YbHAFnC4RUp5UokiBklC6Ay6RQ8m7-U5EokGGQyPBcHn5SWYG6GjVayZcazuNYDM0czpEHl4dB2ixyqxfH7wEAGMD5cHConWAWYYASAbUKR0FJ0ah4MAGNqhgD04cj1GIOEDsxDNCMIDm0bgsfjNATObzaYzwdDFAgPBjcdaierPHLwyDWeoTS0KQMrHzhYbxc7mm7vfLnXlcG+ml+eGowfz1H71B5gn4CYTs00pBSCGQsrIFCohhkrVmGioKO8UigcAg7AAVigZDB+FPfnoWDAaSA0AVPWAblLTQBDfP5Px9f9lU-V8fjYFAblYCAmiJf8eV4IA). 