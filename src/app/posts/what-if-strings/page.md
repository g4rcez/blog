---
level: 1
title: E se? Strings
subjects: ["typescript"]
language: "pt-br"
translations: ["pt-br"]
date: "2024-01-31T11:48:37.896Z"
description: "E se strings fossem tipadas no Typescript?"
---

Cá estamos para falar de Typescript e fazer um experimento. Caso esteja ansioso para o resultado, fique tranquilo,
acesse o [playground typescript](https://www.typescriptlang.org/play?#code/HYQwtgpgzgDiDGEAEANJBvAUEpEAeMA9gE4AuSpAnjMqQK4wA2EAPAMq56kTAAmUSKKWIBLYAHMAfEgC8SDvm58BAAwAk6MQDMIxJAEkAvhu26kAJWilDKpAH5sOJAG19AGiQA6b-SatLQpIAukgAXC5BmI74RGQU1MjMEqQAFuycSvyCwmJSshQMzOySzgBESeKppZHRBCTkVDRI8ITA8CCkLACC8PAZPFlCohIebAKKAwJDuc5B0nJj-coupnruXt6rFlaRTvYGS4M5Eo44dttCh1PH4rOn+y1tHSzq6D3wxuhGKh4BpJL3cKvd6fb6ApDvcGQ2qxBoJeRMESdAAqV2yw3EozR0wk8yQqImy1eWwACiAyJ82J8tn8bPdzs4yWQPN5PGxEZ0-qNgmEXMjIoYojF6vEmgB5ABuulEvFYyI8YrxYrASJY8qQAGsIJRCFokIqkAAyfUAbiijWQ+jATDYNygauxNzxWBwFVS4RQnjdaWRAJwkwA6kiUuF0oSjhjJAAKMAdeAh+QASlk0gJXEmSFeOPElJs+2EdGQ4S0IEYUAgjiE5NIUCD7qQYfTy2z0djpHj4TYyZkqbRrypGmzefOBaLSBLZYrOFIhAAqjAaMQAMIgcvhKPd6S2jH2+eL9rltWSP0UQgAGUI7WYe90K7XSA3KfkdpYN+IB7lx8cM4vAHdb6uEDrpuz47iwf66B+R4nj+l6lhAEHLoBwFPtuuT2ohUG+ie8bkl0pChgAcmiwB0GAABGujRsA4SESBnq+EUvrOIRQRmjgjztARDaLOG1wYrM0asuS4hQJ2UD0Z4nHPOqYySOxggcqGChNhGuTRrAjBIp2knslpKLco4YjwIwdCymJPGOpGUbluSHZJk+aaZAIbD0hQxCFuCTkZlmNy5iobmjl5fYaAO6BDgFewjh5U5OMWpblpggqYGI3DECWiCgehDp8ei6lopK0oiLK7A3B4Vo2i+2EYEgyWPJc2b5I2zl5biNk6Z2L5sPM0gCKuSB0MAGrAIQv7AEg-VoRI9rdVEWiDfApAiK0FBWFGoCQOE2bJugtVRPV5ACHI2ZRqUyIJFA8CiDApClImZoHUgjD5FAXo8JUKQPa0lzIMdniBsGp0AF53V9wCXHQL2eDOb53hAG5g5cjC-lDsH-kh5YI5gj19H9uHEPhUYAAz3dj33kL0UPSaQp1ICIUClB4pQTf+UCEJAoNk+D5AiFDxmmeZp2Xddt2k49wC839-NmdAp1sFdIg3Zzj2wFDmlIqdd1cw1MAAEwvTcp1dKz7PIOdNDC4roueOrNPM1rKswAAzAbGJGybkAAPqe+b0AK0riY2xyp3e3dQA) e se divirta.

# E se strings fosse tipadas?

Como assim strings tipadas? Quando digo strings tipadas, quero dizer o Typescript inferindo literalmente o valor da
string com o seu valor. 

Hoje quando trabalhamos com uma string, o nosso retorno sempre é `string` e nós nunca sabemos o valor que os métodos
irão retornar, uma vez que eles são "empacotados" no tipo `string`.

Mas isso pode mudar se a gente se esforçar um pouco para fazer uma tipagem que resolva exatamente aquilo que o
Typescript faz em runtime, mas dessa vez ao nível de tipo (type-level).

# Trabalhando com o infer

Para que isso seja possível, precisamos entender o conceito de `infer` no Typescript. Ele pode ser um pouco
complicado de começo, mas vou tentar exemplificar para ficar fácil a sua forma de usar. Antes de tudo, você precisa
obedecer algumas regras para o bom uso do infer.

1. O infer sempre deve ser usado no extends de um tipo
2. O extends sempre deve estar no retorno do tipo

Ok, dadas as duas regras em mente, vamos tentar entender o que o `infer` faz. Ele literalmente infere um tipo para você
dada uma condição de tipo. Imagine o infer como *Eu testei esse valor no if, então sei que a partir de agora, dentro do
if, o meu valor sempre vai ser o resultado do teste*.

```typescript
const x = [0];
if (x[0] === 0) {
    // aqui você sabe que o `x[0]` sempre vai ser 0
}
```

E o `infer`?


```typescript
type ArrayValue<T extends any[]> T extends Array<infer V> ? V : never;
```

Como dito anteriormente, o `infer` deve ser usado no extends e somente no retorno do tipo. Dito e feito. Mas vale
lembrar que `extends` no Typescript precisam ser feitos utilizando ternários. Você pode tentar ler o `infer` como um
pedido ao Typescript, mais ou menos assim...

> Typescript, eu não sei o que é tipo `T extends any[]`, mas você pode inferir para mim se o meu tipo `T` extender
> `Array<qualquer coisa>`? Se você puder, retorne `qualquer coisa`. Caso não, retorne never

Tendo em mente a conversa com o Typescript, agora você pode utilizar o `infer` de forma mais consciente, como se você
estivesse conversando com o compilador do Typescript.

# String literals

No Typescript nós podemos trabalhar com valores literais através de tipo, sendo possível você saber o valor de uma
variável apenas olhando para seu tipo e não para o valor em runtime.

Você consegue observar esse comportamento quando você cria uma `const` de um valor que seja string. Vale observar que o
valor da variável entendido pelo Typescript não é `string`, mas sim o valor que você definiu.

Trabalhando com String literals, podemos criar métodos de string de forma poderosa, sendo possível até mesmo dizer o
tamanho de uma string em type-level. Como isso é possível?

## Literals + Recursividade + infer

Aqui vai começar a sopa de letrinha para criarmos nosso novo tipo string. Para conseguir fazer isso, vamos criar nosso
primeiro tipo, o tipo `length`, que é responsável por retornar o tamanho da string.

```typescript
export type tuple<S extends string> = S extends `${infer I}${infer Rest}` ?
    [I, ...tuple<Rest>] : []

export type length<S extends string> = tuple<S>["length"]

type Len = length<"Typescript"> // 10
```

Caso você jogue esse código no playground do Typescript, você irá ver que o tipo de `Len` será 10, que é exatamente o
número de caracteres existentes em `Typescript`.

Como isso foi possível? Bom, vamos com um passo de cada vez para entender os conceitos do tipo `tuple`. Esse tipo recebe
um parâmetro chamado `S` e através dele começamos a recusão. Lendo parte por parte, temos a seguinte narrativa

1. Se o tipo `S` extende o `${inferência do tipo I}${inferência do tipo Rest}`. Esse padrão de dois infer dentro de uma
   string faz com que o compilador entenda que você está se referindo ao primeiro caracter da string(I) e aos
posteriores até o último (Rest). 
2. Se a condição anterior for verdade, retorne um Array, sendo o primeiro item o tipo `I` e os posteriores sendo uma
   recursão do próprio tipo tuple.
3. Sendo a parte de início da recursão, esse trecho irá se repetir até que o Typescript consiga entender que não há
   nenhuma string.
4. Com essa recursão, teremos uma lista com cada um dos caracteres da string. Daí é só pegar a propriedade `length`, que
   tem armazenado o tamanho do array.

## Contando caracteres com array

Uma das formas de se obter o tamanho de uma string em type-level é por meio de arrays. Basicamente nós precisamos iterar
sobre a string, pegando caracter a caracter e adicionando em um array, basicamente um `.reduce`, acumulando um valor até
não ter mais nenhum caracter iterável na string

```typescript
export type Tuple<S extends string> = S extends `${infer I}${infer Rest}` ?
    [I, ...Tuple<Rest>] : []

export type Length<S extends string> = Tuple<S>["length"]
```

No tipo `Tuple`, nós iteramos a string utilizando `extends` e `infer`. Essa jogada de `infer I` e `infer Rest` pode ser
entendida como ***pegue o primeiro caracter da string e faça inferência do resto da string***. Notamos também um tipo
recursivo que irá sempre chamar `Rest`, ou seja, sempre iremos fazer o nosso tipo `Tuple` chamar o restante da string
após mesclar o primeiro caracter com os demais da chamada recursiva.

Por fim, no `Length` nós apenas chamamos a `Tuple`, para nos retornar a lista com todos os caracteres e adicionamos a
chamada de `["length]` para obter o tamanho do array e que por sua vez é o tamanho da string.

## Intrisic String Manipulation

Nome complicado para os tipos builtins que manipulam string, sendo eles

- Uppercase
- Lowercase
- Capitalize
- Uncapitalize

Esses tipos são bastante pois eles evitam o nosso trabalho de mapear todas as possíveis strings de caixa baixa (lower
case) para caixa alta (upper case). E funcionam de maneira muito simples, bastando apenas você utilizar o tipo
utilitário e ele será responsável por fazer a conversão.

Tendo conhecimento desses tipos, fazer os métodos `toUpperCase` e `toLowerCase` fica bem fácil.

```typescript
type CaixaAlta = Uppercase<"string">
type CaixaBaixa = LowerCase<"STRING">
```

# Conclusão

Com todos esses conceitos apresentados, agora fica bem mais tranquilo de fazer uma implementação de cada um dos tipos de
string. Como você pode ver no começo do artigo, temos o [link para o playgroud](https://www.typescriptlang.org/play?#code/HYQwtgpgzgDiDGEAEANJBvAUEpEAeMA9gE4AuSpAnjMqQK4wA2EAPAMq56kTAAmUSKKWIBLYAHMAfEgC8SDvm58BAAwAk6MQDMIxJAEkAvhu26kAJWilDKpAH5sOJAG19AGiQA6b-SatLQpIAukgAXC5BmI74RGQU1MjMEqQAFuycSvyCwmJSshQMzOySzgBESeKppZHRBCTkVDRI8ITA8CCkLACC8PAZPFlCohIebAKKAwJDuc5B0nJj-coupnruXt6rFlaRTvYGS4M5Eo44dttCh1PH4rOn+y1tHSzq6D3wxuhGKh4BpJL3cKvd6fb6ApDvcGQ2qxBoJQRMESdAAqV2yw3EozR0wk8yQqImy1eWwACiAyJ82J8tn8bPdzs4yWQPN5PLBGEiWH9RsEwi5kZFDFEYvV4k0APIAN10ol4rGRHnFePFYE5CqQAGsIJRCFokEqkAAyfUAbiijWQ+jATDYNygLAJXEm6NyeKwOAqqXCKE8nrSyIBOEmAHUkSlwulCUcMZIABRgDrwcPyACUsmkjsyqg0OPElJs+2EdGQ4S0IEYUAgjiE5NIUFDXqQkady1zcYTpCT4TYaZkGbRrypOZuBfORZLSDLFarOFIhAAqjAaMQAMIgSvhWO96S2jH2xfL9qVh2SQMUQgAGUI7WYB90a43SC36fkdpYd+IR-lp8cc6vAHd73XCBN23V89xYADdC-E8zz-a9ywgKDV2A0CX13XJ7WQmCAzPJNyS6UgIwAOTRYA6DAAAjXQ42AcJiLAn1fCKANnGIoIzRwR52iIptFija4MVmONWXJcQoG7KBGM8bjnnVMZJE4hEOV45ssxdXFY3ZJFu2k7SUR5RwxHgRg6DlCS+OxG440rcku1TF9M2dNh6QoYhi3BJyiWHDF8xUVzx08gcNCHdBczpPYx3cmcnFLctK0wIVMDEbhiDLRBwMwh0rJjNEpRlEQ5XYG4PCtG031wjAkCSx5LlzfI1OdNstN07s3zYeZpAEdckDoYANWAQh-2AJAeowiR7Q6qItD6+BSBEVoKCsWNQEgcJczTdBqqiWryAEORc1jUpkQSKB4FEGBSFKFMzV2pBGHyKBfR4SoUlu1pLmQA7PBDMMjoAL2u97gEuOhHs8OcPwfCAt2By5GH-cH4MAlDK1hzA7r6b78OIQjYwABhujGPvIXpwdk0gjqQEQoFKDxSlGwCoEISAgeJkHyBEcHjNM8yjrOi6rqJu7gC576ebM6AjrYc6REutm7tgcH9KO672bqmAACZHpuI6uiZlnkBOmgBbloW2URSmGbVxWYAAZh1jE9YNyAAH1XeN6BZfllMLZUo73euoA) onde você pode acompanhar todas as tipagens feitas para implementar alguns dos métodos de `String`. Espero que tenha gostado dessa experiência com tipos, caso não tenha entendido algum tópico é só deixar um comentário e a gente discute sobre. Até a próxima.