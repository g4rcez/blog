---
title: Diving into Functional Programming
level: 1
subjects: ["typescript", "javascript"]
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2023-03-05T21:45:00.000Z"
description: "Trying once again to talk about functional programming, bringing a detailed introduction of the
most important concepts and diving into concepts in an explanatory way."
---

Just like object-oriented programming, functional programming is a paradigm that aims to solve problems
using a more function and composition oriented way instead of classes and inheritance.

# Main concepts

Functional programming makes use of **pure functions**, **function compositions**, treating functions as **first-order
functions**. It's important to have some concepts in mind before starting to have a challenge using functional
programming.

In this topic we'll cover

- Immutability
- Pure functions
- First-order functions
- Higher-order functions
- Recursion
- Composition

## Immutability

Maybe this is the most important principle of functional programming. As the name suggests, immutability aims at
not changing variables during the lifecycle in a function, avoiding side effects. To ensure
immutability, it's important to use functions that don't change the state of input or global system variables and
instead calculate values based on input and return new values.

## Pure functions

As said above in immutability, functions should not have side effects, that is, for an input X, there should always
be an output Y and not generate any mutation in values that were not created in the function scope

## First-order functions

It's important that you think of functions as any variables, where you can pass a function as parameters of
other functions, maybe this concept is known to you as **callback**. Simply put, functions can be
inputs of other functions.

## Higher-order functions

The name of the concept being similar to the name of the previous concept may not be a coincidence, since this concept
refers to the return of functions instead of input. Functions can also be returned in other functions, making a
chain of functions.

## Recursion

<img src="/recursive-meme.png" className="w-full block min-w-full" alt="Recursion meme" />

In a very simplified way, recursion is the ability of a function to call itself, being able to replace loops.
Besides loops, you can re-execute the function whenever you need to meet a certain execution and stop
the recursion with an **exit condition**. The exit condition is the most important point in recursion, if you forget,
you can cause an infinite execution or even get
[Stack Overflow](https://en.wikipedia.org/wiki/Stack_overflow) errors

## Composition

**Composition over inheritance**

This is a famous phrase to explain why composing functions is better than inheritance, due to its control in flow and
ease of implementation. Function composition can be understood by the notation `f(g(x))`. However, when writing
code, maybe this isn't the most readable thing in the world, so for this we have some techniques that help us
when composing functions

# Practice time

Now that the theory has been presented, let's observe some concepts in practice. Here we'll always remember
that the concepts of immutability and pure functions will always be applied, given that they are root concepts

## Recursion

A classic problem to solve using recursion is
the [Fibonacci sequence](https://en.wikipedia.org/wiki/Fibonacci_sequence).
You can play with the implementation
in the [playground](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAZgSwEbgIbGAmBeGAKMALhjAFcBbJAUwCcBKYsy2nAPhgCgYSYAeXAIwwA-D2KIUYdJgIwAtDAF0YAanjI0GBLIUAmOgG4OHUJBAAbKgDpzIAOZ4u6ydO0BmOhzpA)

```typescript
const fibonacci = (n: number): number =>
    n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);

console.log(fibonacci(3));
```

As mentioned earlier, it's always important to have an **exit condition** to avoid infinite recursion

## First-order functions

It wasn't commented earlier, but you possibly make great use of this concept in your day-to-day. Functions
like `map`, `forEach`, `filter` and `reduce` are some of the most known examples of this concept. We can observe in:

```typescript
// using map
const upper = (list: number[]) => list.map(x => x.toUpperCase());

// using reduce
const sum = (list: number[]) => list.reduce((acc, el) => acc + el, 0);
```

# Programming concepts

## Pipe

In short, this concept consists of being an aggregating function of functions. Where the output of one function is the
input of another. Through this concept it's possible to concatenate functions through their result, thus having a
pipeline of functions. Visually you can understand better

```
function(arguments)
	-> function2(returnFunction1)
	-> function3(returnFunction2)
	-> returnFunction3
```

We can see better a comparison using Typescript between a function with pipe and a function without pipe

```typescript
// implementation without pipe
const parseName = (name: string) =>
    formatBrazilianNames(capitalize(normalize(name)))


// implementation with pipe
const parseName = pipe(normalize, capitalize, formatBrazilianNames);
```

To understand a little better what our pipe function represents, let's see two implementations:

1. untyped implementation, just to understand the concept
2. fully typed utility, facilitating the use of the concept and improving bug identification

### Untyped Pipe

```typescript
type Fn = (...a: any[]) => any;

const pipe = (first: A, ...fns: Fn[]) =>
    fns.reduce(
        (f: Fn, g: Fn) =>
            (...args: unknown[]) =>
                g(f(...args)), (...args: unknown[]) => a(...args));
```

1. `Fn`: is a type that we'll use to ensure that we only have functions
2. `const pipe`: here in the creation of our pipe function, a function is required and we spread N other functions to
   concatenate
3. `fns.reduce`: we use reduce to aggregate the functions, making the input of `g` be the output
   of `f(...args)`
4. The second parameter of our reduce is the initializer, being a function that receives any arguments and passes
   these values to the `first` function

### Typed Pipe

This one won't be explained in the article due to the complexity of this typing, but you can check the explanation in
the article [pipe-type](/post/pipe-type)

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

In languages like Javascript, Java, C#, Python there are Exceptions, ways to control errors by throwing
errors up and making the upper function in the hierarchy have to handle the exceptions. If not handled, the
exceptions keep going up until they explode and break your program with the unhandled error.

Besides this problem, we have some difficulties handling these errors through `try/catch`. To handle in an
alternative way, we have Either.

Basically Either is a "wrapper" where there are two values, `left` and `right`. The `left` value represents error cases,
while the `right` value represents success cases. We can see an Either implementation.

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

This implementation is not fully faithful to the real concept — it is intentionally simplified to aid understanding while also demonstrating [Type Assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions).

Now a small exercise to learn Either. First let's see a `GET HTTP` request to exemplify the use of
utilities that will use Either.

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
            // this try/catch here is to handle Network error
            // in cases of lack of internet connection
            return Either.error({status: 0, body: null, message: "Network error"})
        }
    }
}
```

Now that we have our utility with Either, we can apply it in code to observe the real application of the concept.

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

With Either, our function is totally safe at runtime, without any Exception being thrown, without any
break flow. Just code with an object that has an error format (left) and another object with the success format
(right). It may not seem like a big gain at first, but avoiding exceptions at runtime will
bring much more prediction to your code.

# Conclusion

To summarize: there is no requirement to adopt the functional paradigm completely. The concepts presented here can be selectively applied to improve everyday programming habits.

Thank you for your time, see you soon, bye bye
