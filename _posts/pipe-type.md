---
title: Tipando uma cadeia de funções
level: 2
subjects: ["typescript", "javascript"]
language: "pt-br"
translations: ["pt-br"]
date: "2023-03-06T11:45:00.000Z"
description: "Como fazer sua função pipe ser fortemente tipada? Os conceitos por trás de tipos recursivos e cadeias de
função"
---

# Contexto

Após a descoberta do [reduce tipado](/post/type-reduce), eu comecei a criar alguns desafios de tipo para poder ver até onde essa implementação resolve problemas do Typescript. Dessa vez me arrisquei a utilizar essa implementação para resolver o problema da função [pipe](/post/fp#pipe).

# tl;dr

*Too long; didn't read*

Caso você só queira somente olhar o resultado, você pode observar abaixo. Não se esqueça de instalar a dependência [ts-toolbelt](https://github.com/millsp/ts-toolbelt). Mas vale avisar que existe um limite para a tipagem desse modo, já que não é possível fazer uma extensa inferência. Isso é comentado nas implementações abaixo sobre o ramda e o lodash. Esse resultado é um resultado um pouco genérico e pode apresentar problemas em algumas implementações. Caso você queira uma solução um pouco mais robusta, você pode seguir com a leitura.

```typescript
import { L, N } from "ts-toolbelt";
type Fn = (a: any[]) => any;

type Func = (...a: any[]) => any


type PipeArgs<Fns extends readonly Fn[], Func extends Fn, Acc extends readonly Fn[] = [], C extends number = 0> = Fns["length"] extends C
    ? Acc
    : PipeArgs<Fns, Fns[C], L.Merge<Acc, [(p: ReturnType<Func>) => ReturnType<Fns[C]>]>, N.Add<C, 1>>;

type PipeReturn<First extends Fn, Last extends Fn> = (...params: Parameters<First>) => ReturnType<Last>;

export const pipe = <A extends Func, T extends readonly Fn[]>(a: A, ...fns: PipeArgs<T, A>): PipeReturn<A, L.Last<T>> =>
    (fns as Fn[]).reduce(
        (f: Fn, g: Fn) =>
            (args: any) =>
                g(f(args)), (...args: unknown[]) => a(...args)) as any;
```

# Pipe

Como dito no artigo de [programação funcional](/post/fp), esse artigo visa explicar melhor a tipagem da função `pipe` e o porque dela ser tão complicada de tipar.

Antes de apresentar o código (que já está no tl;dr), vamos ver algumas implementações da função pipe

## ramda

Ramda é uma biblioteca que busca trazer uma forma mais funcional para o Javascript, e depois para o Typescript. Olhando no repositório que contém os `@types`, podemos ver a seguinte implementação da função `pipe` do ramda. Caso você prefira, pode olhar a implementação direto no [GitHub](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/ramda/index.d.ts#L3917).

```typescript
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5, R6, R7, TResult>(
    ...funcs: [
        f1: (...args: TArgs) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3,
        f4: (a: R3) => R4,
        f5: (a: R4) => R5,
        f6: (a: R5) => R6,
        f7: (a: R6) => R7,
        ...func: Array<(a: any) => any>,
        fnLast: (a: any) => TResult,
    ]
): (...args: TArgs) => TResult; // fallback overload if number of piped functions greater than 7
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5, R6, R7>(
    f1: (...args: TArgs) => R1,
    f2: (a: R1) => R2,
    f3: (a: R2) => R3,
    f4: (a: R3) => R4,
    f5: (a: R4) => R5,
    f6: (a: R5) => R6,
    f7: (a: R6) => R7,
): (...args: TArgs) => R7;
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5, R6>(
    f1: (...args: TArgs) => R1,
    f2: (a: R1) => R2,
    f3: (a: R2) => R3,
    f4: (a: R3) => R4,
    f5: (a: R4) => R5,
    f6: (a: R5) => R6,
): (...args: TArgs) => R6;
export function pipe<TArgs extends any[], R1, R2, R3, R4, R5>(
    f1: (...args: TArgs) => R1,
    f2: (a: R1) => R2,
    f3: (a: R2) => R3,
    f4: (a: R3) => R4,
    f5: (a: R4) => R5,
): (...args: TArgs) => R5;
export function pipe<TArgs extends any[], R1, R2, R3, R4>(
    f1: (...args: TArgs) => R1,
    f2: (a: R1) => R2,
    f3: (a: R2) => R3,
    f4: (a: R3) => R4,
): (...args: TArgs) => R4;
export function pipe<TArgs extends any[], R1, R2, R3>(
    f1: (...args: TArgs) => R1,
    f2: (a: R1) => R2,
    f3: (a: R2) => R3,
): (...args: TArgs) => R3;
export function pipe<TArgs extends any[], R1, R2>(
    f1: (...args: TArgs) => R1,
    f2: (a: R1) => R2,
): (...args: TArgs) => R2;
export function pipe<TArgs extends any[], R1>(f1: (...args: TArgs) => R1): (...args: TArgs) => R1;
```

É um pouco complicado de entender devido à sobrecarga de método utilizada no código. E é bem interessante lembrar disso porque outra biblioteca bastante famosa, o [lodash](https://lodash.com/) também faz o uso da mesma técnica.

## lodash

Como dito antes, aqui está o código do Lodash. E como podemos ver, ambos fazem o uso de sobrecarga de método para resolver o problema da função pipe.

```typescript
interface LodashFlow {
    <A extends any[], R1, R2, R3, R4, R5, R6, R7>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6, f7: (a: R6) => R7): (...args: A) => R7;
    <A extends any[], R1, R2, R3, R4, R5, R6, R7>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6, f7: (a: R6) => R7, ...func: Array<lodash.Many<(a: any) => any>>): (...args: A) => any;
    <A extends any[], R1, R2, R3, R4, R5, R6>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5, f6: (a: R5) => R6): (...args: A) => R6;
    <A extends any[], R1, R2, R3, R4, R5>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4, f5: (a: R4) => R5): (...args: A) => R5;
    <A extends any[], R1, R2, R3, R4>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3, f4: (a: R3) => R4): (...args: A) => R4;
    <A extends any[], R1, R2, R3>(f1: (...args: A) => R1, f2: (a: R1) => R2, f3: (a: R2) => R3): (...args: A) => R3;
    <A extends any[], R1, R2>(f1: (...args: A) => R1, f2: (a: R1) => R2): (...args: A) => R2;
    (...func: Array<lodash.Many<(...args: any[]) => any>>): (...args: any[]) => any;
}
```

## lodash vs ramda

Como você pode observer no código, o lodash e o ramda possuem um número finito de funções que podem ser encadeadas. Tudo bem que 7 funções para um pipe pode ser um exagero tremendo, mas caso você precise de extender isso ou apenas se desafiar a como resolver um problema de tipagem, você pode resolver utilizando os tipos recursivos + [reduce](/post/type-reduce).

# Pipe tipado + Type Reduce

Antes de tudo, é válido lembrar que a inferência do pipe acaba não sendo extensa, devido à limitação na inferência no [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).

Se você leu o artigo de [type reduce](/post/type-reduce), você terá um pouco mais de contexto de como funciona a lógica desse tipo. Infelizmente o Typescript não nos ajuda na inferência dos tipos através do rest-parameter, como dito anteriormente. Porém, para contornar esse problema nós vamos utilizar algumas artemanhas da linguagem para poder resolver esse problema. 

## *Rest Parameter* e o problema de inferência

Como nós visamos receber pelo menos duas funções, os primeiros dois argumentos precisam ser especificados. Do terceiro em diante nós vamos aceitar quaisquer funções, não importa se sejam 10 ou nenhuma.

O problema do *rest parameter* nesse caso é que precisamos aplicar uma regra nos parâmetros, sendo que eles não foram recebidos e tratados da forma devida da linguagem. Alterar os parâmetros da função diretamente no construtor da função acabam confundindo o nosso type system e jogando toda a inferência para o lado `any` da força.

Tendo isso em mente, ao invés de testar os parâmetros em sua entrada, por que nós não podemos modificar a saída em caso da entrada estar errada? ***Quê?????????????????????????????***

Fica tranquilo, vamos entender um pouco melhor essa frase.

1. Iremos receber 3 parâmetros na nossa função `first`, `second` e um `rest`, sendo esse um rest parameter (N funções permitidas).
       1. O parâmetro `first` precisa extender `(...params: any[]) => any`. Pois, a entrada pode ter N argumentos.
       2. Os parâmetros `second` e `rest` precisam extender `(a: any) => any`. Como todas as funções possuem somente um retorno, essas funções só podem ter uma entrada.
2. Os parâmetros serão recebidos e entendidos pelo Typescript, sem precisar realizar nenhuma operação, com isso a inferência do tipo será preservada e nossas funções poderão ser devidamente tratadas
3. O retorno da nossa função `pipe` será um retorno customizado baseado na entrada. 
   1. Caso todas as funções respeitem a regra **O tipo de entrada da função é o mesmo do retorno da função anterior**, nós poderemos retornar a execução da função pipe de forma adequada
   2. Caso uma das funções não respeite a regra, iremos criar um objeto customizado e não permitir que pipe retorne uma função.
4. Para criar o retorno, iremos criar os argumentos da nossa função pipe normalmente
5. Após a criação, vamos comparar as entradas e saídas com as funções passadas
6. Caso uma das funções tenha erro, iremos marca-lá como `false` e armazenar o seu index
7. Todas as funções que possuirem erros serão armazenadas num acumulador para serem tratadas como erro
8. Por fim, teremos um tipo que irá converter todas as funções erradas em objetos de erro
9. A função pipe irá deixar de retornar uma função e irá retornar um objeto com os erros presentes nas funções

## Code

A lógica pode ser um pouco complicada, mas que tal a gente ir comentando o código para facilitar o entendimento? Se você preferir, pode olhar o [playground](https://www.typescriptlang.org/play?module=1&ts=4.9.5#code/PTAEFUBcEsBtsgQ4E7QPYGdQAcCGzdQBHAVwFMdMNcBbTUBMg5Ue-AgTwwChobs0ySKADeoAGIAaUADlQAX1AAzZGhqgARJAwBaSGjSwARmViQNAbm7cQykgDsA5wFeyWUhWRkAxmRPqMNTJ7SAoSdXwAc3Dg-W5IDmwKcHt8DlAAXlAAClwALlBcew4ASkyAPkLiqxswJQcXN2JyUC9ff1lC5GiaWMx4xIpxB29MnIA6SfyqjgBtAF0yjMqijhqEpNAABWgkgB5uUCPQW2xUXugCOycAY7RQABNPMiUmACv7b2hCbF2yQ+O4kuGGEZAAHqF7A8sMNPpIAUdbPoHrgsKjro0sHgMNQUVhUqB7FRCPVbvdfkkERJ7FhwZDoaAAILITh7WGjAA+EFSyA45WkVNsuG84RIsFwD0EjwoURiIX6xyZ3lGdOCDPZCzGCwFits3jQIQlUslhKo9xgAlaPhIyAw0AAbmgqQBJUCqqH48ImFhZAAMgrAjNI0FAoRBtDYoH1UOgjjuOHwhGo3tAGAo3gAFmRIhG0fclHxHvd2LgONxKllxDTZhpYMFIpAMxp5m6IWqsM6A6AAMKo+7m2hFDP3E0l9JpgBWhHuvQwdCLUYNkCNyGkXn0yFSdCwxZFNDFK4BAH4ld4AQVslTEWAZG405R5aG3MvtwmrsmmKmKABLwo4c5kJcJINPGTw4H8LqtvSWC+qAR5Xscti9oEX5Tn+Zx8IBVyknGaDSCQMDwAAXrmrBYvgABHvSQKoWBtH40CSliUqmLgVI7PsVYYLMzrzNIXHSLMkzjIyyrSNkwl4AQNAYAUWyJtRTAYGywKQOUSyVAASmQkA2vYAAqgwqbaal8bIIkPA8ezOtIACM5TlAh149n2hLxpOuD4YR0Aka+9zroIRKPMBZJVKEqBSvq85SVROmqFScl-Gy1a8fxNKCcJoneOJUm0AU2m6ZuhmcdWMjjAAyiQRjWXZ5TzOpFSgAVenFWQyXcbxdXSGVjKWTVoD2Y5RwlNYGwUAAohCBDeJAzr2EoaAHLqYD6WgeKFFgOGuDuqCRNAqTQDwipcVB7YSCM2qgF2q3reiW1NDRRQYAtyA0BKqJUvpBA0i96juuqF1mV2wqiuKkosGBTC0VSWWnR6Myalkl1dtGy7g5B-2ejQKZ+l2QLqCiVoiradzlmMXE1nW9gNk2LaY6AnZHCeWVdm0NoYKTRwFJNj0zXNC3tdIX1Pb9glUplYlUpeirLUywagL+rwIPc4RPiCFC5aA9qfve9AxdR0My4hYCEzh8aPT9ghvYTHP3NA0S4IdhT0KbIFOkbzmCPb+24LA4wuShHnqPbJCOxg+HqA4ADWRIAO72ArVobqkkrjE5JxgMh9xB480CvF4IRuGuOmBaRPzIAAzxhIW4Qh8nSTpSntTx9Vwwy9e0I3tp7MLluvS3lQntHccJwUFO8VSI1HGZPV9TZA0OdYthBiQIa-qrFr+datoOir3lIBFb6EIxsR59A3j4F+hSwD0DChATxYsqWtSJ+ENd3P7411gwyCIKaaIThICiFgx8nghDPhfFg9Aob9DGqAAA8vYMgzoMDshgAaHuz5aRtnhsPNA8dLraQwGKUEOCGRGAMHWIoYwlC+zTNIV09N7Bek-H6CsTU3AkLblgGiLQTy8IoHkAE+ksGU3rI2Zs3CGZwWUHQ-4XMEFIJQWg9A9hMEgnDqAERGiW5SPZDIgRoACi0NgPQ8yvUrLz0GkvQM8t17qDQARVQoZdhb2JnaR0zQKBEgAUAwgoDT4FkgawBgUJwQv1dqFKKboWRoDTnAlRBo5pPDBONWJyB1HaCkXgghZlGFkKxjjUAvp2HaO0Lo+m+iTyuiEUcRJ9hkngjSaoDJZTNGz0sbVRyL8thSgAF9mD4HhJ8fkXGWg8D-P+uBIheBzCwZE-jQCwArntC+rZsDwAviiF+WdWyHWXNfHo797hBR8ShMc0pQAAAM2lXOkJcMgr4AqbkvqrNARgJwl0uTAtOthyoUF0iaZ8DpPy+CEMM55W5IyojtKkQqhB9Qsh0oQE0kKRzkj+PEwYPYvC4FCBxNqJ1KmAyFlg7J9gY74PsAsdhiDkGoJGOgtRbTKj00MSeEQAJZzUEiGQAoGhY6qGpjoUkM1VGWABDA5AjJIBj0ZaoxpqT0mZIwENa4YqDSyS0VgrsvSnivjrMgWpxtrkFUCmEN6GJ4wTL1pRA29BbZWnzrEJowNbXIFijRF25dMJAStfcCgW9k7ZzIFOLs5pXGXLRcFUAAyYCWrNmgK53BFAXgkpMXKMk5IKS7spCmvp6oaQ4YVAyRkKZlUqtVCmtZxG01qoW6wL8gSpFgL0QuIzIxnOPvwOsbbly4UuYm8ClJowgmHRQLIxkx3ErhKAf50YHhSJSGkaQRDSHQQkOMGQ7B8F7GXbyGl5RsgFhMmPVS0g0wLoKPOg0DxpDCS8CCfKz4SjGu7Li-FSUCVTsgIJIEJlpA3qhPeyYa76rSB5tNWa81FqzH-SCQDPhb0gfGGB6Q374O-tAHB89c6kPAdAMJMDDkKyVGyLME9CGvwLpQ4+yALZ0QakWOMLwDwSC+GyLkMSyh7BFvTeMKIWrVgLCLUoewXHvD8cEyUGTG0Zg1GXvLVWSQPBBTDKEbgo7hDEPUFkXIBRmHYyYNIIwBmWHICLZyo4o7DBkHGLANAkRshiE8qAIwCgp5Jz0n+AA1G5lNmnNXCAELHAATGMfThJzNFoALJ4ozOMELuRpChZGoFmkwh9zLlCOVGi+1IirWZJwMYFIyDS1TOEaQIXQvcBKDULTVpiFmDGFlvFZBcuoGpoVp+HBsihZSyNGzdZ7OOeyI+khI0gA)

```typescript
// Utilitários para que possamos iterar os arrays
import { F, N } from "ts-toolbelt";

// funções que recebem somente um argumento
type Unary = (a: any) => any;

// funções que recebem N argumentos
type Func = (...a: any[]) => any;

type Pipe<
    // primeira função de referência pipe
    First extends Func,
    // todas as funções passadas na nossa função pipe
    Fns extends Array<Func | Unary>, 
    // acumulador de argumentos
    Acc extends Func[] = [], 
    // contador do nosso tipo recursivo
    I extends number = 0
    // Aqui testamos a condição para saber se chegamos ao fim do array
> = Fns["length"] extends I
    // Caso o tamanho do array seja o mesmo do contador, retornamos o acumulador
  ? Acc
  : (
      // Nesse ponto testamos para saber se é a primeira função de pipe
    I extends 0 ?
        // Caso seja a primeira função, utilizamos os parâmetros recebidos por ela
    Pipe<Fns[I], Fns, [...Acc, (...params: Parameters<First>) => ReturnType<First>], N.Add<I, 1>>
        // Caso não seja, utilizamos o retorno da função anterior como parâmetro
    : Pipe<Fns[I], Fns, [...Acc, (param: ReturnType<Fns[N.Sub<I, 1>]>) => ReturnType<Fns[I]>], N.Add<I, 1>>
  )

type ExtractInfo<
    // Todas as funções originais
    Fns extends Func[], 
    // Todas as funções transformadas
    Transform extends Func[], 
    // acumulador de erros
    Acc extends any[] = [], 
    // contador
    I extends number = 0
    // Fim da recursão
> = Fns["length"] extends I
  ? Acc
    // recursão
  : ExtractInfo<Fns, Transform, [
    ...Acc,
    (
        // Aqui é feito um teste para ver se os parâmetros
        // da função transformada são iguais aos da função
        // original. Caso sejam iguais, um unknown é retornado.
        // Caso sejam diferentes, retornamos a própria função
      Parameters<Fns[I]> extends Parameters<Transform[I]> ? unknown : Fns[I]
    )
  ], N.Add<I, 1>>

// Aqui é um tipo recursivo utilitário para identificar se algum item do array
// é uma função. Ele irá nos ajudar a identificar os erros
type OneIsFunction<Tests extends unknown[], Result extends boolean = false, I extends number = 0> = Result extends true ? true :
  Tests["length"] extends I ? false
  : OneIsFunction<Tests, Tests[I] extends Func ? true : false, N.Add<I, 1>>

// Aqui é um outro tipo recursivo que nos ajuda a identificar o index
// da função com erro.
type FunctionIndexError<Tests extends unknown[], I extends number = 0> = Tests[I] extends Func ? I :
  FunctionIndexError<Tests, N.Add<I, 1>>

// Por último, temos o tipo que irá agregar toda a lógica explicada
// Caso exista alguma função no nosso array de `Tests`, iremos retornar um objeto de erro.
// Se tudo estiver certo, retornamos a assinatura correta do retorno do pipe.
type CreatePipe<Fns extends Func[], Tests extends unknown[]> = OneIsFunction<Tests> extends true ? {
  message: "wrong-function";
  errorAt: FunctionIndexError<Tests>
  functions: Tests
    // Podemos ler:
    // `Retorne uma função que os parâmetros são referentes 
    // aos parâmetros da primeira função e o retorno seja
    // o tipo de retorno da última função`
} : ((...params: Parameters<Fns[0]>) => ReturnType<Fns[N.Sub<Fns["length"], 1>]>)


// Finalmente temos a nossa implementação de função pipe
const pipe = <First extends Func, Second extends Unary, Rest extends F.Narrow<Unary[]>>(first: First, second: Second, ...rest: Rest):
  CreatePipe<Pipe<First, [First, Second, ...Rest]>, ExtractInfo<[First, Second, ...Rest], Pipe<First, [First, Second, ...Rest]>>> => ([first, second, ...rest] as Func[]).reduce((acc, fn) => (...args: any[]) => fn(acc(...args))) as any;

// Aqui um pequeno teste
const sum = (a: number, b: number) => {
  console.log({ a, b })
  return a + b
}
const pow2 = (a: number) => Math.pow(a, 2)

const mutateStringToArray = pipe(
  sum, pow2
);

const result = mutateStringToArray(2, 2)
console.log(result)
```

# Conclusão

Esse tipo deu trabalho, mas conseguimos e ainda descobrimos uma técnica interessante sobre como debuggar os nossos tipos, visto que agora nossa função pipe pode nos alertar sobre o index errado e qual a assinatura da função errada. Por hoje é só isso tudão. Espero que tenham gostado e até a próxima.