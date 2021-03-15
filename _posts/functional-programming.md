---
useFolks: true
subjects: ["typescript", "fp", "functional", "programming"]
title: "Functional Typescript"
language: "pt-br"
translations: ["pt-br"]
date: "2020-04-06T23:29:59.999Z"
description: "FP além do .reduce"
---

Talvez você nunca tenha ouvido falar de programação funcional, mas com certeza já usou os conceitos básicos desse paradigma de programação.
Atire uma pedra se você nunca usou um `Array.forEach`, `Array.map`, `Array.reduce` ou `Array.filter`. Se você nunca fez `[...array1, ...array2]`, então pode tacar uma pedra também.

Viu como sem saber você já usa conceitos de FP `(functional programming ou programação funcional)`? Mas afinal de contas, que conceitos são esses?

### Funções puras e impuras

O que seria uma função pura? E o que seria uma função impura? Vamos ver dois exemplos simples para entender a diferença entre uma e outra...

```typescript
// um caso de função impura
let total = 0;
const sumTotal = (x: number) => {
	total += x; // o mesmo que total = total + x
};
sumTotal(1); // total === 1
sumTotal(2); // total === 3
sumTotal(4); // total === 7

// um caso de função pura
const sum = (x: number, y: number) => y + x;
const total = sum(1, 2); // total === 3
const newTotal = sum(total, 4); // total === 7
```

No primeiro caso, temos uma função impura que recebe um valor e o incrementa a nossa variável inicial.

No segundo caso, temos uma função pura que recebe dois valores, realiza a soma e retorna o total, não mexendo em nenhuma variável fora do escopo da própria função.

Com isso, dá pra entender que as funções puras **NÃO GERAM EFEITO COLATERAL**, ou seja, elas não produzem efeitos de alteração fora do próprio escopo, apenas recebem valores e retornam valores, garantindo sempre que para uma mesma entrada, a saída seja a mesma. Coisa que já não acontece numa função impura, pois a mesma **GERA EFEITOS COLATERAIS**, ou seja, ela realiza mudanças que trazem imprevisibilidade ao código, não garantindo que dada uma entrada, a saída seja a mesma.

Um caso clássico para isso é quando desejamos somar valores de uma lista de objetos. Alguns iriam fazer da seguinte forma

```typescript
const list = [
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
];

let total = 0;
list.forEach((x) => {
	total += x.value; // ou total = total + x.value
});
```

Não é uma solução ruim, mas podemos criar uma solução que evite alterar o valor de uma variável constantemente. Simplesmente usando um reduce

```typescript
const list = [
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
	{ value: 1 },
];

const total = list.reduce((acc, el) => acc + el.value, 0);
```

Fica até mais simples, não? Talvez esses exemplos não sejam suficiente para você pescar o fio da meada, mas imagine uma situação onde você tem arrays e objetos.

```typescript
// Ao executar essa função, você irá alterar o seu array original e não terá consistência nas informações
const unsafeConcatToArray = <T>(array: T[], newItem: T) => {
    array.push(item)
    return array
}

// Ao executar essa função, você irá garantir que seu array original não foi alterado
const safeConcatToArray = <T>(array: T[], newItem: T) => [...array, newItem]
```

### Funções de primeira classe

> Mas se é função como vai ser de classe? HAHA

Funções de primeira classe ou `first class function` é o conceito que diz

> Funções podem ser tratadas como simples valores, sendo manipulados e retornados (assim como fazemos com inteiros e strings). Quer dizer que podemos passar uma função para uma função e operarmos com ela como valor simples

Isso com certeza você já usou em algum momento, afinal de contas, você já ouviu falar de callback né? Isso nos trás outro conceito que é `função de alta ordem`, que é uma função que recebe ou retorna uma função.

Esses dois conceitos já foram usados no exemplo anterior, quando fizemos um `.reduce`. Se liga na assinatura do `Array.reduce`

```typescript
Array.reduce((accumulator: ACC, currentElement: T, index: number, array: T[]) => T);
```

Podemos ler da seguinte forma: *Array.reduce é uma função que recebe uma função. A função passada para Array.reduce recebe como parâmetros: acumulador que é do tipo T, um elemento atual que é do tipo do item da lista, um index que é a posição numérica do item na lista e o próprio array que está sendo operado*. Apenas citei esse exemplo, agora deixo com você a tarefa de lembrar de todos os métodos que você conhece em Javascript que atendam a esses requisitos:

1. Recebe uma função como parâmetro
2. Itera uma lista ou objeto aplicando a função recebida
3. Processa um valor sem alterar a sua própria variável

Ao reparar nisso, você vai ver que conhece muito mais de programação funcional do que imagina, apenas não sabia "dar nome aos bois".


### Imutabilidade

Esse é um conceito importante que apesar de ser simples de entender, torna-se complicado devido ao mindset que temos de paradigmas estrutural e orientado a objetos. Talvez seja bem fácil introduzir esse conceito devido ao uso da keyword `const`, mas talvez em casos de arrays e objetos você ainda possa ter dificuldade de aplicar o conceito.

Para entender a imutabilidade, precisamos atentar a duas coisas, `reatribuição de variáveis` e `operações em variáveis`. 

```typescript
const mutate = (obj) => {
  obj.c = 2;
  return obj;
}
const b = {a:1};
console.log(b); // {a: 1}
a(b);
console.log(b); // {a: 1, c: 2}
```

Aí você faz a seguinte pergunta

> Se eu to usando const, pq ele deixa eu alterar o valor do meu objeto?

Simples, o `const` previne somente a `reatribuição` de valores, e não que ele altere as refêrencias de objetos. **MAS COMO EU NÃO VOU ALTERAR UM VALOR NO OBJETO SEM MUDAR A REFERÊNCIA DELE?**. Simples, basta criar uma cópia para manipular e entregar um novo objeto. 

Nosso amigo `spread operator` nos ajuda bastante nisso, apesar de fazer apenas uma `shallow copy`, que é uma copia apenas de valores com o tipo primitivo (string, number, boolean). Em casos onde há objetos com arrays ou outros objetos, é necessário usar métodos como `deepClone`.

No exemplo dado acima, poderíamos fazer da seguinte forma:

```typescript
const mutate = (obj) => ({ ...obj, c: 2 })
const b = { a: 1 };
console.log(b); // {a: 1}
a(b);
console.log(b); // {a: 1}
```

E assim garantiríamos a imutabilidade do nosso objeto recebido na função.

### Calma que tem mais...

Mas só no próximo artigo haha. Esse fica com os conceitos básicos pra tentar triggar aos poucos a forma funcional de como podemos pensar funcional.