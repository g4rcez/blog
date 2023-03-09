---
title: Tipando uma cadeia de funções
useFolks: true
subjects: ["typescript", "javascript", "fp"]
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

Caso você só queira somente olhar o resultado, você pode observar abaixo. Não se esqueça de instalar a dependência [ts-toolbelt](https://github.com/millsp/ts-toolbelt). Mas vale avisar que existe um limite para a tipagem desse modo, já que não é possível fazer uma extensa inferência. Isso é comentado nas implementações abaixo sobre o ramda e o lodash.

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

Se você leu o artigo de [type reduce](/post/type-reduce), você terá um pouco mais de contexto de como funciona a lógica desse tipo.

```typescript
import { F, N } from "ts-toolbelt";

type Unary = (a: any) => any;

type Func = (...a: any[]) => any;

type Pipe<First extends Func, Fns extends Array<Func | Unary>, Acc extends Func[] = [], I extends number = 0> = Fns["length"] extends I
  ? Acc
  : (
    I extends 0 ?
    Pipe<Fns[I], Fns, [...Acc, (...params: Parameters<First>) => ReturnType<First>], N.Add<I, 1>>
    : Pipe<Fns[I], Fns, [...Acc, (param: ReturnType<Fns[N.Sub<I, 1>]>) => ReturnType<Fns[I]>], N.Add<I, 1>>
  )

type ExtractInfo<Fns extends Func[], Transform extends Func[], Acc extends any[] = [], I extends number = 0> = Fns["length"] extends I
  ? Acc
  : ExtractInfo<Fns, Transform, [
    ...Acc,
    (
      Parameters<Fns[I]> extends Parameters<Transform[I]> ? unknown : Fns[I]
    )
  ], N.Add<I, 1>>

type OneIsFunction<Tests extends unknown[], Result extends boolean = false, I extends number = 0> = Result extends true ? true :
  Tests["length"] extends I ? false
  : OneIsFunction<Tests, Tests[I] extends Func ? true : false, N.Add<I, 1>>

type FunctionIndexError<Tests extends unknown[], I extends number = 0> = Tests[I] extends Func ? I :
  FunctionIndexError<Tests, N.Add<I, 1>>

type CreatePipe<Fns extends Func[], Tests extends unknown[]> = OneIsFunction<Tests> extends true ? {
  message: "wrong-function";
  errorAt: FunctionIndexError<Tests>
  functions: Tests
} : ((...params: Parameters<Fns[0]>) => ReturnType<Fns[N.Sub<Fns["length"], 1>]>)


const pipe = <First extends Func, Second extends Unary, Rest extends F.Narrow<Unary[]>>(first: First, second: Second, ...rest: Rest):
  CreatePipe<Pipe<First, [First, Second, ...Rest]>, ExtractInfo<[First, Second, ...Rest], Pipe<First, [First, Second, ...Rest]>>> => ([first, second, ...rest] as Func[]).reduce((f, g) => (...args: any[]) => g(f(...args))) as any;

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
