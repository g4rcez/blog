---
title: Mergulhando em Programação Funcional
useFolks: true
subjects: ["typescript", "javascript", "fp"]
language: "pt-br"
translations: ["pt-br"]
date: "2023-03-05T21:45:00.000Z"
description: "Tentando mais uma vez falar sobre programação funcional, trazendo uma introdução detalhada dos conceitos
mais importantes e fazendo um mergulho em conceitos de forma explicativa."
---

Assim como programação orientada a objetos, programação funcional é um paradigma que visa resolver os problemas
utilizando uma forma mais orientada a funções e composição ao invés de classes e heranças.

# Conceitos principais

Programação funcional faz o uso de **funções puras**, **composições de função**, tratando as funções como uma **função
de primeira ordem**. É importante ter em mente alguns conceitos antes de começar a ter um desafio utilizando programação
funcional.

Nesse tópico iremos abordar sobre

- Imutabilidade
- Funções puras
- Funções de primeira ordem
- Funções de alta ordem
- Recursão
- Composição

## Imutabilidade

Talvez esse seja o princípio mais importante de programação funcional. Como o próprio nome sugere, imutabilidade visa a
não alteração de variáveis durante o ciclo de vida numa função, evitando efeitos colaterais. Para garantir a
imutabilidade, é importante utilizar funções que não alteram o estado das variáveis de entrada ou globais do sistema e
sim calcular os valores com base na entrada e retornar novos valores.

## Funções puras

Como dito acima em imutabilidade, as funções não devem ter efeitos colaterais, ou seja, para uma entrada X, sempre deve
haver uma saída Y e não gerar nenhuma mutação em valores que não foram criados no escopo da função

## Funções de primeira ordem

É importante que você pense em funções como variáveis quaisquer, onde você pode passar uma função como parâmetros de
outras funções, talvez esse conceito seja conhecido por você como **callback**. Simplificando, funções podem ser
entradas de outras funções.

## Funções de alta ordem

O nome do conceito ser parecido com o nome do conceito anterior talvez não seja coincidência, já que esse conceito
remete ao retorno de funções ao invés da entrada. Funções também podem ser retornadas em outras funções, fazendo uma
cadeia de funções.

## Recursão

<img src="/recursive-meme.png" className="w-full block min-w-full" alt="Meme recursão" />

De forma bem simplificada, recursão é a habilidade de uma função chamar ela mesmo, podendo substituir laços de
repetição. Além dos laços, você pode reexecutar a função sempre que precisar atender a uma determinada execução e parar
a recursão com uma **condição de saída**. A condição de saída é o ponto mais importante na recursão, caso você esqueça,
você poderá causar uma execução infinita ou até tomar erros
de [Stack Overflow](https://pt.wikipedia.org/wiki/Stack_overflow)

## Composição

**Composição ao invés de herança**

Essa é uma frase famosa para explicar o motivo de compor funções é melhor que herança, devido ao seu controle no fluxo e
facilidade na implementação. A composição de função pode ser entendida pela notação `f(g(x))`. Porém, ao escrever um
código, talvez isso não seja a coisa mais legível do mundo, então para isso temos algumas técnicas que nos facilitam na
hora de compor funções

# Hora da prática

Agora que a teoria já foi apresentada, vamos observar alguns conceitos na prática, na prática. Aqui vamos sempre lembrar
que os conceitos de imutabilidade e funções puras serão sempre aplicadas, dado que são conceitos raíz

## Recursão

Um problema clássico para se resolver utilizando recursão é
a [sequência de Fibonacci](https://pt.wikipedia.org/wiki/Sequ%C3%AAncia_de_Fibonacci).
Você pode brincar com a implementação
no [playground](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAZgSwEbgIbGAmBeGAKMALhjAFcBbJAUwCcBKYsy2nAPhgCgYSYAeXAIwwA-D2KIUYdJgIwAtDAF0YAanjI0GBLIUAmOgG4OHUJBAAbKgDpzIAOZ4u6ydO0BmOhzpA)

```typescript
const fibonacci = (n: number): number =>
    n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);

console.log(fibonacci(3));
```

Como foi comentado anteriormente, é sempre importante ter uma **condição de saída** para evitar a recursão infinita

## Funções de primeira ordem

Não foi comentado anteriormente, mas possivelmente você faz bastante o uso desse conceito no seu dia-a-dia. Funções
como `map`, `forEach`, `filter` e `reduce` são um dos exemplos mais conhecidos desse conceito. Podemos observar em:

```typescript
// utilizando map
const upper = (list: number[]) => list.map(x => x.toUpperCase());

// utilizando reducez1x
const sum = (list: number[]) => list.reduce((acc, el) => acc + el, 0);
```

# Conceitos de programação

## Pipe

De forma resumida, este conceito consiste em ser uma função agregadora de funções. Onde a saída de uma função é a
entrada de outra. Por meio desse conceito é possível concatenar funções através de seu resultado, tendo assim uma
pipeline de funções. Visualmente você pode entender melhor

```
função(argumentos) 
	-> função2(retornoFunção1)
	-> função3(retornoFunção2)
	-> retornoFunção3
```

Podemos ver melhor uma comparação utilizando Typescript entre uma função com pipe e uma função sem o pipe

```typescript
// implementação sem pipe
const parseName = (name: string) =>
    formatBrazilianNames(capitalize(normalize(name)))


// implementação com pipe
const parseName = pipe(normalize, capitalize, formatBrazilianNames);
```

Para entender um pouco melhor o que nossa função pipe representa, vamos duas implementações:

1. implementação não tipada, apenas para entender o conceito
2. utilitário totalmente tipado, facilitando o uso do conceito e melhoria na identificação de bugs

### Pipe não tipado

```typescript
type Fn = (...a: any[]) => any;

const pipe = (first: A, ...fns: Fn[]) =>
    fns.reduce(
        (f: Fn, g: Fn) =>
            (...args: unknown[]) =>
                g(f(...args)), (...args: unknown[]) => a(...args));
```

1. `Fn`: é um tipo que utilizaremos para garantir que temos apenas funções
2. `const pipe`: aqui na criação da nossa função pipe, é exigido uma função e fazemos um spread de outras N funções para
   concatenar
3. `fns.reduce`: utilizamos o reduce para agregar as funções, fazendo com que a entrada de `g` seja a saída
   de `f(...args)`
4. O segundo parâmetro do nosso reduce é o inicializador, sendo esse uma função que recebe quaisquer argumentos e passa
   esses valores para a função `first`

### Pipe tipado

Esse cara não vai ser explicado no artigo devido à complexidade dessa tipagem, mas você pode conferir a explicação no
artigo [pipe-type](/post/pipe-type)

```typescript
import {L, N} from "ts-toolbelt";

type Fn = (...a: any[]) => any;

type PipeArgs<Fns extends readonly Fn[], Func extends Fn, Acc extends readonly Fn[] = [], C extends number = 0> = Fns["length"] extends C
    ? Acc
    : PipeArgs<Fns, Fns[C], L.Merge<Acc, [(p: ReturnType<Func>) => ReturnType<Fns[C]>]>, N.Add<C, 1>>;

type PipeReturn<First extends Fn, Last extends Fn> = (...params: Parameters<First>) => ReturnType<Last>;

export const pipe = <A extends Fn, T extends readonly Fn[]>(a: A, ...fns: PipeArgs<T, A>): PipeReturn<A, L.Last<T>> =>
    (fns as Fn[]).reduce(
        (f: Fn, g: Fn) =>
            (...args: unknown[]) =>
                g(f(...args)), (...args: unknown[]) => a(...args));

const add = (a: number, b: number) => a + b;
const multiplyByTwo = (a: number) => a * 2;

const itsMath = pipe(add, multiplyByTwo);
const r = itsMath(5, 2)
console.log(r); // 14
```

## Either

Em linguagens como Javascript, Java, C#, Python existem as Exceptions, formas de fazer o controle de erro lançando os
erros para cima e fazendo com que a função de cima na hierarquia deva tratar as exceções. Caso não seja tratada, as
exceções vão subindo até elas explodirem e quebrem o seu programa com o erro não tratado.

Além desse problema, temos algumas dificuldades para tratar esses erros através de `try/catch`. Para tratar de uma
maneira alternativa, temos o Either.

Basicamente o Either é um "empacotador" onde existem dois valores, `left` e `right`. O valor `left` representa os casos
de erro, já o valor `right` os casos de sucesso. Podemos ver uma implementação do Either.

```typescript
export namespace Either {
    export type Left<E> = { error: E; success?: undefined };

    export type Right<S> = { error?: undefined; success: S };

    type Either<L, R> = Left<L> | Right<R>;

    export type Create<L, R> = Either<L, R>;

    class EitherNoValueError extends Error {
        public constructor() {
            super();
            this.message = "EitherError";
        }
    }

    const create = <E, S>(error: E, success: S) => {
        if (error !== undefined) {
            return {error, success: undefined};
        }
        if (success !== undefined) {
            return {success, error: undefined};
        }
        throw new EitherNoValueError();
    };

    export const isLeft = <E, S>(e: Either<E, S>): e is Left<E> => e.error !== undefined;

    export const isRight = <E, S>(e: Either<E, S>): e is Right<S> => e.success !== undefined;

    export const left = <E extends unknown>(e: E): Left<E> => create<E, undefined>(e, undefined) as Left<E>;

    export const right = <S extends unknown>(s: S): Right<S> => create<undefined, S>(undefined, s) as Right<S>;
}
```

Essa implementação não é totalmente fiel ao conceito real, tentei trazer uma forma um pouco simplificada para podermos
entender o conceito e apresentar um pouco
de [Type Assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions).

Agora um pequeno exercício para aprender o Either. Primeiro vamos um request `GET HTTP` para exemplificar o uso de
utilitários que utilizarão o Either.

```typescript
type ResponseError = {
    status: number;
    message: string;
    body: unknown;
};

type ResponseSuccess<T extends unknown = unknown> = {
    body: T;
    headers: Headers;
};

export namespace Request {

    const get = async <T>(url: string, body?: unknown):
        Promise<Either.Create<ResponseError, ResponseSuccess<T>>> => {
        try {
            const response = await fetch(url, {body: JSON.stringify(body), method: "GET"});
            if (!response.ok) {
                const body = await response.json();
                return Either.error({status: response.status, message: "Error", body});
            }
            const body = await response.json();
            return Either.success({body, headers: response.headers});
        } catch (e) {
            // esse trycatch aqui é para tratar Network error
            // em casos de falta de conexão com a internet
            return Either.error({status: 0, body: null, message: "Network error"})
        }
    }
}
```

Agora que temos o nosso utilitário com Either, podemos aplicar em um código para observar a aplicação real do conceito.

```typescript
namespace Users {
    type User = {
        id: string;
        name: string;
    };

    export const getAll = async () => {
        const response = await Response.get<Users[]>("/api/users");
        if (Either.isError(response)) {
            return [];
        }
        const users = response.right.body;
        return users;
    }
}
```

Com o Either, nossa função fica totalmente segura em tempo de execução, sem nenhuma Exception sendo lançada, sem nenhum
fluxo de quebra. Apenas um código com um objeto que possui um formato de erro (left) e outro objeto com o formato de
sucesso (right). Pode não parecer um grande ganho no primeiro momento, mas evitar as exceptions em tempo de execução vai
trazer muito mais predição para o seu código.

# Conclusão

Com tudo o que observamos no artigo hoje, podemos fazer um `.reduce` do conteúdo e assimilar melhor. Não necessariamente
você precisa adotar o paradigma funcional por completo, você pode utilizar o conceito para melhorar seus hábitos de
programação.

E isso é tudo, pessoal, espero que tenham gostado.