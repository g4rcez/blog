---
level: 0
subjects: ["javascript", "typescript"]
title: "Array.prototype"
language: "pt-br"
translations: ["pt-br"]
date: "2019-08-05T00:00:00.000Z"
description: "Um guia prático sobre arrays em JavaScript"
---

# Introdução

Este artigo apresenta `map`, `filter` e `reduce` e aprofunda os principais métodos do objeto `Array`.

# Array

Criar um array em JavaScript é simples:

```javascript
const pessoas = ["João", "Maria"]; // ou então
const Pessoas = Array("Jão", "Mariá");
```

As duas formas criam um array, mas a primeira é mais comum. Chamar `Array` como construtor tem algumas implicações. Por exemplo:

```javascript
const a = Array(5); // Cria um array com tamanho 5 e elementos undefined
const a = Array(5, 6, 7, 8); // Cria um array [5,6,7,8]
```

Chamar `Array` diretamente pode gerar resultados inesperados, por isso usarei `[]` ao longo do artigo. Antes dos métodos de instância, vale conhecer três métodos estáticos:

## **Array.isArray**

```javascript
const ehArray = Array.isArray; // type check para saber se é um array
ehArray([]); // true
ehArray({}); // false
ehArray(null); // false
ehArray("AEEEE"); // false
```

## **Array.from**

```javascript
// Exemplo retirado da MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Array_from_a_Set
const set = new Set(["foo", "bar", "baz", "foo"]);
Array.from(set); // ['foo', 'bar', 'baz', 'foo']
// Podemos usar funções transformadoras
// também (parecido com o map, como você irá ver mais pra frente)
Array.from([1, 2, 3], (x) => x ** 2); // [1,4,9]
```

## **Array.of**

```javascript
// A diferença entre ele e a instancia de um novo array
// com Array é que você tem a segurança de não criar
// um array com inconsistências de acordo com seus parâmetros
const a = Array(5); // Cria um array com tamanho 5 e elementos undefined
const a = Array.of(5); // [5]
```

# Array.length

Essa propriedade retorna a quantidade de elementos do array.

> Os índices de arrays em JavaScript começam em 0.

# Array.concat

O `concat` combina elementos e arrays com um array existente. Ele retorna um novo array e não altera o original, então é preciso atribuir o resultado se ele for utilizado novamente.

```javascript
const zero = []; // []
const with7elements = zero.concat(1, 2, 3, 4, 5, 6, 7); // [1,2,3,4,5,6,7]
const with3elements = zero.concat([1, 2, 3]); // [1,2,3]
const with2elements = zero.concat([1], 2); // [1,2]
```

> O `concat` funciona bem em `reduce`. Se performance for uma preocupação, vale ler esta [comparação entre `push` e `concat`](https://dev.to/uilicious/javascript-array-push-is-945x-faster-than-array-concat-1oki).

# Array.push

O `push` é semelhante ao `concat`, mas acrescenta os argumentos ao final do array sem achatá-los. Ao chamar `array.push(elements)` com um array em `elements`, o novo item será outro array:

```javascript
const a = []; // criamos uma constante,
// mas vamos mudar a referência dela com o push
a.push(1); // não retorna nada, mas temos a = [1]
a.push([1]); // não retorna nada, mas temos a = [1, [1]]
```

Quando os tipos dos elementos são conhecidos, `push` é previsível e pode oferecer bom desempenho em escala.

# Array.reverse

Como o nome sugere, `reverse` inverte a ordem dos elementos do array. O exemplo também introduz o operador de propagação, assunto da próxima seção.

```javascript
const string = "Socorram-me em Marrocos";
[...string].reverse().join("");
// socorraM me em-marrocoS
```

> A frase [palíndroma](https://www.soportugues.com.br/secoes/palindromos/) facilita a visualização da inversão porque usa um hífen e letras maiúsculas.

# ... ou SpreadOperator

A [sintaxe de propagação](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_operator) expande valores iteráveis para uso em chamadas de função e atribuições por desestruturação.

A sintaxe de propagação não é o foco principal deste artigo, mas os exemplos a seguir mostram alguns padrões úteis. Em caso de dúvida, abra uma issue no repositório do blog.

```javascript
const [primeiro, segundo, ...n] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
primeiro, segundo; // 1, 2
n; // [3,4,5,6,7,8,9]
const string = "O rato roeu a roupa do rei de Roma";
// [
//   'O', ' ', 'r', 'a', 't', 'o', ' ',
//   'r', 'o', 'e', 'u', ' ', 'a', ' ',
//   'r', 'o', 'u', 'p', 'a', ' ', 'd',
//   'o', ' ', 'r', 'e', 'i', ' ', 'd',
//   'e', ' ', 'R', 'o', 'm', 'a'
// ]
// Usando um push mais safe...
const a = [];
a.push([1, 2, 3, 4, 5, 6, 7]); // Vai colocar o array como um único elemento
a.push(...[1, 2, 3, 4, 5, 6, 7]); // Separa de acordo com cada elemento
```

O Spread é bastante poderoso — é possível fazer bom uso dele para evitar `.call` e `.apply` em algumas funções. Pode usar em objetos...mas fica para você descobrir como funcionam os outros usos.

# Array.join

O `join` concatena os itens do array em uma string. O argumento define o separador usado na conversão `array -> string`. O padrão é a vírgula; use uma string vazia `("")` quando não quiser um separador.

```javascript
const string = "A sorte ajuda a quem cedo madruga";
const toArray = [...string];
const toStringAgain = toArray.join("");
```

# Array.find

O `find` busca a primeira ocorrência de acordo com o callback fornecido. Caso nenhum elemento corresponda, retorna `undefined`.

> O exemplo a seguir é apenas ilustrativo.

```javascript
const seusAmores = ["mãe", "pai", "irmã", "irmão", "cachorro", "papagaio"];
seusAmores.find((x) => Voce.meAmaPeloNome(x)); // undefined
// O exemplo acima retorna undefined pois nenhum elemento satisfaz a condição
seusAmores.find(Boolean); // mãe
```

O próximo método retorna todos os elementos correspondentes, não apenas o primeiro:

# Array.filter

Se `find` retorna a primeira ocorrência, `filter` retorna **todos** os elementos que satisfazem o callback.


```javascript
const seusAmores = ["mãe", "pai", "irmã", "irmão", "cachorro", "papagaio"];
const quemTeAma = seusAmores.filter(Boolean);
seusAmores.length === quemTeAma.length; // true. Geral te ama
```

`find` e `filter` usam a assinatura de callback `elementoCorrente, indiceNoArray, arrayIterado`. O `map` também usa essa assinatura.

# Array.map

Esse é um dos mais legais, porque ele **map**eia seu array e transforma de acordo com o retorno do callback que você passa. É bastante útil para converter arrays de objetos em arrays de valores únicos ou acrescentar/retirar propriedades de uma lista de objetos.

```javascript
const vida = ["você", "s(ua|eu) crush", "Brasil"];
// E se a sua vida se transformasse com um callback?
// Vamos melhorar o item da sua vida mil vezes
const novaVida = vida.map((element) => Vida.melhorar(x, 1000));
novaVida; // ["Ricão", "s(ua|eu) crush apaixonad(o|a)", "Brasil+++"]
```


O `map` não reduz um array a um único valor. Para isso, usamos `reduce`.

# Array.reduce

O reduce transforma uma lista em um elemento do tipo que você bem definir, sendo útil pra fazer somas de itens e também emular quase todos os outros métodos que mostrei aqui.

> Ao final, há uma pequena coleção de exemplos para consolidar os conceitos apresentados.

```javascript
[1, 2, 3, 3, 4, 5, 6].reduce((acc, el) => `${el} + ${acc}`, "");
// 6 + 5 + 4 + 3 + 3 + 2 + 1 +
// Imagina o objeto pessoa {nome:"", idade:0} em uma lista
const somaIdade = listaPessoas.reduce((acc, el) => {
  return acc + el;
}, 0);
// Fazendo um objeto virar objeto de novo com reduce
const pessoa = { nome: "Fu", sobrenome: "Ba", altura: 1.8 };
const keysArray = Object.keys(pessoa); // ["nome", "sobrenome","altura"]
const novaPessoa = keysArray.reduce((acc, el) => {
  return { ...acc, [el]: pessoa[el] };
}, {}); // { nome: "Fu", sobrenome: "Ba", altura: 1.8 }
```

Os parâmetros `acc` e `el` são recebidos pela função de callback. Como são posicionais, temos:

1. Acumulador. Definido um valor inicial, ele irá respeitar aquele tipo, a menos que você mude sem mais nem menos em um retorno errado (nunca faça isso ou nunca deixe acontecer)
2. Valor atual. O nome diz tudo
3. Índice do valor atual. O nome também diz tudo
4. Array de origem iterável. Preciso nem falar que o nome também diz tudo né?

O método `reduce` recebe dois parâmetros: o callback e o valor inicial. Se o valor inicial não for fornecido, `reduce` usará o primeiro item do array como acumulador e começará no índice 1. Sempre forneça um valor inicial explícito para evitar bugs sutis.

# Tricks

Os exemplos a seguir consolidam os conceitos apresentados. Eles não têm explicações adicionais: tente resolvê-los e abra uma issue no repositório em caso de dúvida.

```javascript
const newArray = (number, transformCallback) =>
  Array(number).fill(0).map(transformCallback);

const reverseStr = (str) => [...str].reverse().join("");

// src: https://30secondsofcode.org/adapter#pipeasyncfunctions
const pipeAsyncFunctions =
  (...fns) =>
  (arg) =>
    fns.reduce((p, f) => p.then(f), Promise.resolve(arg));
```

Esses exemplos encerram o artigo.
