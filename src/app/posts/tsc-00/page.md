---
level: 0
subjects: ["typescript"]
title: "Typescript 101 - [0]"
language: "pt-br"
translations: ["pt-br"]
date: "2020-02-10T23:29:59.999Z"
description: "Começando uma série sobre o querido Typescript"
---

# Introdução

Antes de tudo, vamos prestar bastante atenção no que diz o site do [typescript](https://typescriptlang.org).

> TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

Ou em português...

> TypeScript é um superconjunto tipado de JavaScript compilado para JavaScript simples.

Então essa série é sobre um **superset** de Javascript e não uma nova linguagem. Não vou dizer que a migração é super tranquila pois o transpilador (sim, é transpilador pois não gera código de máquina) do Typescript impede por padrão algumas das besteiras que fazemos com Javascript, sejam elas acidentais ou não.

A seguir, os conceitos fundamentais com exemplos de código.

# Getting started

Simples e direto ao ponto:

```bash
npm install -g typescript
```

Caso prefira não instalar localmente, o [playground online](https://www.typescriptlang.org/play/index.html) é uma boa alternativa.

# Tipos primitivos

Quem vem de Java, C#, F# ou Haskell já estará familiarizado com o conceito. Para quem vem exclusivamente do JavaScript, este é o ponto de entrada para um sistema onde os tipos das variáveis são explícitos e verificados em tempo de desenvolvimento.

> JsDoc não é tipagem e nem todos os editores conseguem saber o que são suas variáveis, objetos, quais os tipos do seu array e afins.

Como tipos primários nós temos:

- number: 42, 0xf042, 0b1010, 0o742
- string: "Hack the planet", "Hello World", 'typescript'
- boolean: true, false
- null: _algo que existe e não possui valor_
- undefined: _algo que possivelmente não existe ou não foi definido_

Tipos primitivos são os tipos implementados da linguagem. Apesar de `[]` (array) e `{}` (objetos) serem tipos básicos em JS, não vou abordar sobre eles nesse momento para não confundir com termos como **_inferência_** ou **_tipos condicionais_**.

Como esses 4 tipos aí já podemos começar a garantir algumas seguranças no nosso código através dos tipos

```typescript
// @ts-nocheck
type NomePessoa =
  | "Fu"
  | "Bá"
  | "Joãozinho"
  | "Mariazinha"
  | "Fulano";

// Type '"John"' is not assignable to type 'NomePessoa'
const pessoa: NomePessoa = "John";  //
```

O tipo `NomePessoa` aceita somente os valores literais definidos na union: "Fu", "Bá", "Joãozinho", "Mariazinha" ou "Fulano". "John" não é um valor aceito, portanto não pode ser atribuído a uma variável do tipo `NomePessoa`.

Esse é o tipo de segurança que o TypeScript oferece em tempo de desenvolvimento. Mas é importante lembrar que o TypeScript garante isso apenas durante o desenvolvimento, mas em runtime isso não pode ser garantido caso o input seja algo que não esteja no nosso type. Se você escrever um código que garanta que o input não vai ser uma `string` genérica, mas sim um `NomePessoa`, você pode ficar despreocupado.

> Uma dúvida natural: como garantir que o código fique totalmente protegido contra valores inválidos?

A resposta é simples, **não pode**. Mas podemos evitar ao máximo que o input seja malicioso.

```typescript
// @ts-nocheck
type NomePessoa = "Fu" | "Bá" | "Joãozinho" | "Mariazinha" | "Fulano";

function getChar(pessoa: NomePessoa, char: number) {
  return pessoa.charCodeAt(char);
}

getChar("Fu", 2); // Isso passa
getChar("FULANO", 0); // Isso dá erro
```

Este é o comportamento esperado.

Em desenvolvimento, o transpilador do Typescript irá impedir você passar qualquer valor diferente de `NomePessoa` para a sua função `getChar`. Da mesma maneira que ele irá garantir que o primeiro parâmetro seja uma string do tipo `NomePessoa`, ele vai garantir que seu segundo parâmetro seja um número e não uma string numérica.

Ainda há o caso onde você cria uma variável do tipo `string`, que será genérica. E depois irá querer que ela seja usada nessa função. Mas nada pode garantir que ela realmente seja uma string caso o valor não seja controlado ou validado por você.

# Inferência

Nem sempre quando for atribuir valor as suas variáveis e atributos, você irá precisar definir o tipo delas. O transpilador do Typescript é inteligente o suficiente para saber seus tipos através do tipo do valor que você está passando.

```typescript
// @ts-nocheck
const a: string = "a"; // isso é o mesmo que
const a = "a"; // Aqui ele vai inferir o tipo

// Vamos adicionar complexidade aqui pra causar dúvida
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Qual é esse tipo?

// numbers é o mesmo que
const numbers: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Que é o mesmo que
const numbers: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
```

> Uma nota sobre como tipar arrays em TypeScript:

Tipar arrays é muito simples, e existem duas formas que são **quase idênticas**. Uma é usando o tipo `Array` e outro é usando o seu `shorthand`, como já vimos, é o `[]`. A diferença deles é apenas essa:

```typescript
// @ts-nocheck
let shorthand: readonly number[]; // Isso dá bom
let array: readonly Array<number>; // Isso dá ruim
```

O erro apresentado para o `Array<number>` é `'readonly' type modifier is only permitted on array and tuple literal types.(1354)`.

Como não vou entrar no mérito do readonly agora (apesar de ser bem explicito dizendo que o valor é somente leitura e não deve ser sobrescrito), vamos passar para a próxima.

# Objetos

Como falei dos arrays acima, agora irei falar de objetos. De cara, veja esse objeto bem simples:

```typescript
// @ts-nocheck
const user = {
  name: "Fu",
  age: 20,
  languages: ["Javascript", "Typescript", "C#", "Java"],
};
```

Se você observar [nesse playground](https://www.typescriptlang.org/play/index.html?ssl=25&ssc=1&pln=30&pc=1#code/C4TwDgpgBAcg9gWwgBQgZzXAhlAvFAIgDEBXAqAH0ICEBD8qggKTgGO4AvASwDsALOA0IBZLACcuWbvyxDiJADZYeggNwAodQDMSPAMbAucHlADmEYAGE+4gBSQM2AFzwkqR1gA0UPTbFOeEgQAIwgxAEooAG91KDioMQsSMRMHTCwAOl9xSzgAEwgAQWBbbIiNAF9Ncys-W3kCbwAmcI0a6ztiAFUAGUKYAHlGqAAGVs09YzRgKECQsLQ8KABtEe8ARmbvAGZvABZvAFZvADZvAHZvAA5vAE4AXQ1NBQsocTEsECcEiCw84wUICghTEHxAAB45qExAA+VRQAD0CKgYTEcDEAEJ1C8ZmgBGJgDYeHlvok-gCgVCwstHojkQB3dEAa0WWl4EE0oEgUB6vFMJCw5h4i3wzCwADcsGg9BIwMA5AAVcDoGVcOVySwAYjkTAlsk5yqgXTQYSWMXisywSG+rhQ6HSsXiSKgWiwXAAHjgClAuHk-tBIGIEFxDH7vusrlAAAdQJqHR1xQUQcORqjrW6UWMjTNNdY5po57Y5vY5+MWpQ8flJtDfXmVgVCtA09RVdSTYUzEgmsQjb7G034c3xHhW5OEUiNBNvczfJprKcVqvmGsrMWS6Wy+XeAhKhyq9XbrXDNeye4tiZTTvd9Z97tmqcj600eieKdJ77befl5RL9DfZYnhuapboQu4qpux5HtuuqSgQZ5VEAA), ao interagir com a variável `user`, você vai ver que consegue autocompletar com os tipos desse objeto, isso graças a inferência do tipo de `user`.

Mas e se você quiser garantir que os tipos de user sejam exatamente o que você quer? Assim como era em `NomePessoa`. Bom, aí é só começarmos a tipar nossos objetos antes de atribuir os valores. Vou apresentar o tipo aqui, e no playground você pode ver que já temos alguns exemplos

```typescript
// @ts-nocheck
type Linguagens = "Javascript" | "Typescript" | "C#" | "Java";

type User = {
  name: NomePessoa;
  // faixa de idade permitida: 18 à 25
  age: 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;
  languages: Linguagens[];
};
```

Com nosso novo tipo `User` e `Linguagens` iremos conseguir tipar as nossas chaves e valores de cada objeto que seja do tipo `User`.

Como exemplo adicional de uso do `readonly`:

Como falei do `readonly` mais acima, vamos usa-lo aqui para garantir imutabilidade ao nosso objeto. Ou seja, toda vez que alguém tentar reatribuir um valor a propriedade de `User`, irá ganhar um erro para evitar isso.

Para isso, basta acrescentar o `readonly` antes das chaves do nosso objeto, assim podemos escolher quais delas serão imutáveis. Ou utilizar o [tipo utilitário](https://www.typescriptlang.org/docs/handbook/utility-types.html) do Typescript, chamado `Readonly`. Isso dá uma sintáxe um pouco diferente:

```typescript
// sintáxe readonly por chave
type User = {
  readonly name: NomePessoa;
  // faixa de idade permitida: 18 à 25
  readonly age: 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;
  readonly languages: Linguagens[];
};

type ReadonlyUser = Readonly<{
  readonly name: NomePessoa;
  // faixa de idade permitida: 18 à 25
  readonly age: 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;
  readonly languages: Linguagens[];
}>;

const user2: ReadonlyUser = {
  name: "Fu",
  age: 20,
  languages: ["Javascript", "Typescript", "C#", "Java"],
};
user2.name = "Chitão"; // Cannot assign to 'name' because it is a read-only property.(2540)
```

Assim você garante que seus valores nunca irão ser reatribuídos. Em caso de objetos e arrays, o valor pode mudar através dos seus métodos, mas nunca poderão ser reatribuídos.

# Conclusão

A série continuará nos próximos artigos com tipos mais complexos, avançando até padrões como o [use-typed-reducer](https://github.com/g4rcez/use-typed-reducer/). Obrigado pelo seu tempo, tamo junto e até a próxima
