---
level: 1
subjects: ["typescript", "javascript"]
title: "Functional Typescript"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2020-04-06T23:29:59.999Z"
description: "The functional programming ideas behind everyday JavaScript"
---

# Introduction

Functional programming ideas appear in everyday JavaScript, often without being named. If you have used `Array.forEach`, `Array.map`, `Array.reduce`, `Array.filter`, or spread syntax such as `[...array1, ...array2]`, you have already used them.

What do these concepts mean, and why are they useful?

# Pure and impure functions

What would a pure function be? And what would an impure function be? Let's see two simple examples to understand the difference between one and the other...

```typescript
// a case of impure function
let total = 0;
const sumTotal = (x: number) => {
  total += x; // same as total = total + x
};
sumTotal(1); // total === 1
sumTotal(2); // total === 3
sumTotal(4); // total === 7

// a case of pure function
const sum = (x: number, y: number) => y + x;
const total = sum(1, 2); // total === 3
const newTotal = sum(total, 4); // total === 7
```

The first function is impure: it receives a value and changes a variable outside its own scope.

The second function is pure: it receives two values, calculates their sum, and returns the result without touching external state.

A pure function **does not produce side effects**. It receives values and returns a value, producing the same output for the same input. An impure function may change external state, which makes its result harder to reason about.

Summing values from a list of objects is a common example. One implementation might look like this:

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
  total += x.value; // or total = total + x.value
});
```

This is not a bad solution, but `reduce` can express the same operation without repeatedly mutating a variable:

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

The difference is small in this example. With arrays and objects, the effect of mutation becomes more significant:

```typescript
// When executing this function, you'll change your original array and won't have consistency in the information
const unsafeConcatToArray = <T>(array: T[], newItem: T) => {
  array.push(item);
  return array;
};

// When executing this function, you'll ensure your original array wasn't changed
const safeConcatToArray = <T>(array: T[], newItem: T) => [...array, newItem];
```

# First-class functions

First-class functions are functions that can be treated like values:

> Functions can be assigned to variables, passed as arguments, returned from other functions, and manipulated like numbers or strings.

You have probably used this through callbacks. A `higher-order function` is a function that receives another function, returns one, or does both.

The previous `reduce` example uses both ideas. Consider a simplified `Array.reduce` signature:

```typescript
Array.reduce(
  (accumulator: ACC, currentElement: T, index: number, array: T[]) => T
);
```

Read it this way: `Array.reduce` receives a function. That callback receives the accumulator, the current element, the element's index, and the array being processed. Many JavaScript methods follow a similar pattern:

1. Receive a function as an argument.
2. Iterate over a list or object and apply that function.
3. Produce a value without changing the collection itself.

Once you recognise this pattern, it becomes clear that you were already using functional programming — you may simply not have used the formal terminology.

# Immutability

Immutability is simple in theory but can feel unfamiliar when you come from imperative or object-oriented programming. `const` is a useful introduction, but applying immutability to arrays and objects requires a different way of thinking.

Pay attention to two separate operations: `variable reassignment` and `operations on variables`.

```typescript
const mutate = (obj) => {
  obj.c = 2;
  return obj;
};
const b = { a: 1 };
console.log(b); // {a: 1}
a(b);
console.log(b); // {a: 1, c: 2}
```

This raises a common question:

> If I am using `const`, why can I still change the object?

`const` prevents reassignment of the variable; it does not prevent mutation of the object referenced by that variable. **To update an object without mutating its reference, create a copy, change the copy, and return it.**

The `spread` operator helps, although it only creates a `shallow copy` of the top-level values. When nested arrays or objects are involved, use an appropriate deep-copy strategy such as `deepClone`.

In the example given above, we could do it as follows:

```typescript
const mutate = (obj) => ({ ...obj, c: 2 });
const b = { a: 1 };
console.log(b); // {a: 1}
a(b);
console.log(b); // {a: 1}
```

This version leaves the original object unchanged.

# More to come

The next article covers more advanced concepts. This one introduces the foundations for thinking in a functional style.

Thanks for reading.
