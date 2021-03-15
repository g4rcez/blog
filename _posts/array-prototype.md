---
useFolks: true
subjects: ["javascript","tricks","typescript"]
title: "Array.prototype"
language: "pt-br"
translations: ["pt-br"]
date: "2019-08-05T00:00:00.000Z"
description: "Desmascarando Array em JS"
---

Como todo bom escritor de artigos JS, eu vou ter que escrever a minha série `Map, Filter e Reduce`. Mas to pensando em ser um pouco diferente da maioria de todos os artigos e fazer um deep dive do pacote `Array`. Sem mais delongas, vamos lá.

### Array

Criar um Array em JS é simples, se liga só

```javascript
const pessoas = ["João", "Maria"]; // ou então
const Pessoas = Array("Jão", "Mariá");
```

Ambas as formas criam um array, porém é mais comum você ver a primeira forma sendo usada. Instanciando um array com `Array` você terá algumas implicações. Exemplo

```javascript
const a = Array(5); // Cria um array com tamanho 5 e elementos undefined
const a = Array(5, 6, 7, 8); // Cria um array [5,6,7,8]
```

Conseguiu ver como usar diretamenta a criação através de `Array` pode ser problemático? Melhor adotarmos então sempre o uso de `[]`. E é o que vou fazer nesse artigo a partir de agora. Mas antes, talvez seja legal você conhecer outros 3 métodos estáticos que podem ser úteis pra você

**Array.isArray**

```javascript
const ehArray = Array.isArray; // type check para saber se é um array
ehArray([]); // true
ehArray({}); // false
ehArray(null); // false
ehArray("AEEEE"); // false
```

**Array.from**

```javascript
// Exemplo retirado da MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Array_from_a_Set
const set = new Set(["foo", "bar", "baz", "foo"]);
Array.from(set); // ['foo', 'bar', 'baz', 'foo']
// Podemos usar funções transformadoras
// também (parecido com o map, como você irá ver mais pra frente)
Array.from([1, 2, 3], (x) => x ** 2); // [1,4,9]
```

**Array.of**

```javascript
// A diferença entre ele e a instancia de um novo array
// com Array é que você tem a segurança de não criar
// um array com inconsistências de acordo com seus parâmetros
const a = Array(5); // Cria um array com tamanho 5 e elementos undefined
const a = Array.of(5); // [5]
```

### Array.length

Esse eu nem vou mostrar com código, mas ele serve pra obter o tamanho do Array.

> Importante lembrar que os índices de array em Javascript começam em 0, caso você venha de Delphi, Lua...

### Array.concat

Esse método é bem interessante para você **concat**enar elementos e arrays com um já existente. Mas lembre-se que ele retorna um novo array e não muda a referência do seu array atual, sendo necessário reatribuir em caso de reuso

```javascript
const zero = []; // []
const with7elements = zero.concat(1, 2, 3, 4, 5, 6, 7); // [1,2,3,4,5,6,7]
const with3elements = zero.concat([1, 2, 3]); // [1,2,3]
const with2elements = zero.concat([1], 2); // [1,2]
```

> O concat é bem legal para usar no .reduce, mas se você for louco com performance, pode dar uma
> [olhada nesse artigo](https://dev.to/uilicious/javascript-array-push-is-945x-faster-than-array-concat-1oki) que é bem interessante mostrar a diferença de uso e performance entre push e concat

### Array.push

Como eu já citei acima, vou falar desse. O `push` é bastante semelhante ao `concat` a diferença é que ele acrescenta todos os itens passados como argumentos ao final do array, mantendo a natureza. Ou seja, ele não converte um array para elementos planos como é o caso do `concat`. Então se for fazer algo do tipo `array.push(elements)`, você poderá se surpreender com o seu novo último item de array

```javascript
const a = []; // criamos uma constante,
// mas vamos mudar a referência dela com o push
a.push(1); // não retorna nada, mas temos a = [1]
a.push([1]); // não retorna nada, mas temos a = [1, [1]]
```

Se você souber exatamente o tipo dos elementos, você pode usar ele sem medo e ainda ter um ganho de performance em larga escala.

### Array.reverse

Como o próprio nome sugere, ele inverte os elementos do array, fazendo o primeiro ser o último, o segundo ser o penúltimo e assim vai...Esse eu vou mostrar em formato de código para me dar brecha no próximo tópico sobre um operador de array

```javascript
const string = "Socorram-me em Marrocos";
[...string].reverse().join("");
// socorraM me em-marrocoS
```

> Eu usei uma frase [palíndroma](https://www.soportugues.com.br/secoes/palindromos/) só de sacanagem, mas o traço e as letras maiúsculas ajudam você a entender

### ... ou SpreadOperator

"Sintaxe de propagação" como está na [MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_operator) é o nosso querido _SpreadOperator_. Ele permite expandir os objetos iteráveis para o uso em funções e também desestruturar iteráveis.

Apesar de não ser muito o foco desse artigo, vou mostrar umas tricks com o SpreadOperator em array, se tiver dúvida, posta uma issue no repositório do blog que eu te explico :smile:

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

O Spread é sinistro, você pode fazer bom uso dele para evitar `.call` e `.apply` em algumas funções. Pode usar em objetos...mas fica para você descobrir como funcionam os outros usos.

### Array.join

Já que eu usei ele em um exemplo anterior, aqui fica a explicação dele. O `join` concatena todos os itens do array e os transforma em string. O argumento passado é como irá ser feita a conversão `array -> string`. O padrão é vírgula, mas se você quiser transformar em palavras, basta usar uma string vazia `("")`

```javascript
const string = "A sorte ajuda a quem cedo madruga";
const toArray = [...string];
const toStringAgain = toArray.join("");
```

### Array.find

Esse é o método que eu costumo chamar de **mãe**, porque se ele não achar, não existe. E é isso mesmo que ele faz. Ele vai procurar a primeira ocorrência de acordo com o seu callback, caso nada dê match, não existe e retorna `undefined`;

> Esse exemplo a seguir pode ser um pouco pesado, mas não leve a sério, é só brincadeira didática

```javascript
const seusAmores = ["mãe", "pai", "irmã", "irmão", "cachorro", "papagaio"];
seusAmores.find((x) => Voce.meAmaPeloNome(x)); // undefined
// O exemplo acima retorna undefined porque ninguém te ama
// Mas não fique triste, isso vai mudar
seusAmores.find(Boolean); // mãe
```

Não se preocupe pessoa, se o find não curou a sua carência de ter somente um amor, vamos pra um próximo método que vai te deixar bem feliz

### Array.filter

Se o find retorna a primeira ocorrência, o filter retorna **TODAS** as ocorrências de acordo com o seu callback

> Dessa vez você será amado :heart:

```javascript
const seusAmores = ["mãe", "pai", "irmã", "irmão", "cachorro", "papagaio"];
const quemTeAma = seusAmores.filter(Boolean);
seusAmores.length === quemTeAma.length; // true. Geral te ama
```

Bom, usei esses dois métodos em sequência para explicar os parâmetros passados tanto para o `find` quanto para o `filter`. Ambos recebem `elementoCorrente, indiceNoArray, arrayIterado`. Importante lembrar que o `map` também tem essa assinatura. E falando dele...

### Array.map

Esse é um dos mais legais, porque ele **map**eia seu array e transforma de acordo com o retorno do callback que você passa. É bastante útil para converter arrays de objetos em arrays de valores únicos ou acrescentar/retirar propriedades de uma lista de objetos.

```javascript
const vida = ["você", "s(ua|eu) crush", "Brasil"];
// E se a sua vida se transformasse com um callback?
// Vamos melhorar o item da sua vida mil vezes
const novaVida = vida.map((element) => Vida.melhorar(x, 1000));
novaVida; // ["Ricão", "s(ua|eu) crush apaixonad(o|a)", "Brasil+++"]
```

> Desculpa algumas brincadeiras, eu juro que isso parece ser didático na minha cabeça

Uma coisa que o `map` não faz é converter o seu array pra valores únicos, então pra isso nós iremos entender o `reduce`

### Array.reduce

O reduce transforma uma lista em um elemento do tipo que você bem definir, sendo útil pra fazer somas de itens e também emular quase todos os outros métodos que mostrei aqui.

> Antes de dar um exemplo, só queria lembrar que no final eu vou fazer um compilado de tricks pra te facilitar no entendimento caso nada do que eu tenha falado tenha feito sentido até então

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

Mas cara, o que é `acc` e `el`? São os parâmetros recebidos pela função :smile:. Como são parâmetros posicionais, temos:

1. Acumulador. Definido um valor inicial, ele irá respeitar aquele tipo, a menos que você mude sem mais nem menos em um retorno errado (nunca faça isso ou nunca deixe acontecer)
2. Valor atual. O nome diz tudo
3. Índice do valor atual. O nome também diz tudo
4. Array de origem iterável. Preciso nem falar que o nome também diz tudo né?

Caso não tenha prestado atenção, o método `reduce` recebe dois parâmetros, o callback e o valor inicial, caso você esqueça de passar o valor inicial, o `reduce` irá usar o primeiro item do seu array e a redução será feita a partir do índice 1 e não do índice 0. Para o seu bem, nunca esqueça do valor inicial :smile:

### Tricks

Umas tricks boladonas pra você assimilar o conteúdo lido. Não vai ter explicação. Se você não entendeu, tente exercitar e postar uma issue de dúvida pra gente discutir

```javascript
const newArray = (number, transformCallback) =>
	Array(number)
		.fill(0)
		.map(transformCallback);

const reverseStr = (str) => [...str].reverse().join("");

// src: https://30secondsofcode.org/adapter#pipeasyncfunctions
const pipeAsyncFunctions = (...fns) => (arg) =>
	fns.reduce((p, f) => p.then(f), Promise.resolve(arg));
```

Pra finalizar, aquele abraço e espero que tenha entendido tudo. Se não entendeu, pode entrar em contato ou postar uma issue que eu terei o maior prazer em te ajudar :smile:
