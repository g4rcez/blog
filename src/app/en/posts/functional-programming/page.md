---
level: 1
subjects: ["typescript", "javascript"]
title: "Functional Typescript"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2020-04-06T23:29:59.999Z"
description: "FP beyond .reduce"
---

# Introduction

Functional programming concepts are widely used, often without developers realizing it. If you have ever used `Array.forEach`, `Array.map`, `Array.reduce`, `Array.filter`, or the spread syntax `[...array1, ...array2]`, you have already applied functional programming.

So what exactly are these concepts?

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

In the first case, we have an impure function that receives a value and increments our initial variable.

In the second case, we have a pure function that receives two values, performs the sum and returns the total, not touching any variable outside the function's own scope.

With this, you can understand that pure functions **DO NOT GENERATE SIDE EFFECTS**, that is, they don't produce change effects outside their own scope, they only receive values and return values, always ensuring that for the same input, the output is the same. This doesn't happen in an impure function, because it **GENERATES SIDE EFFECTS**, that is, it makes changes that bring unpredictability to the code, not ensuring that given an input, the output is the same.

A classic case for this is when we want to sum values from a list of objects. Some would do it like this

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

It's not a bad solution, but we can create a solution that avoids constantly changing the value of a variable. Simply using reduce

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

It's even simpler, right? These examples may not fully convey the concept, but consider a situation involving arrays and objects:

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

First-class functions is the concept that states:

> Functions can be treated as simple values, being manipulated and returned (just as we do with integers and strings). It means we can pass a function to a function and operate with it as a simple value

You've certainly used this at some point, after all, you've heard of callback, right? This introduces another concept: a `higher-order function`, which is a function that receives or returns another function.

These two concepts were already used in the previous example, when we did a `.reduce`. Check out the `Array.reduce` signature

```typescript
Array.reduce(
  (accumulator: ACC, currentElement: T, index: number, array: T[]) => T
);
```

We can read it as follows: _Array.reduce is a function that receives a function. The function passed to Array.reduce receives as parameters: accumulator which is of type T, a current element which is of the list item type, an index which is the numerical position of the item in the list and the array itself that is being operated_. Consider all the JavaScript methods you already know that meet these requirements:

1. Receives a function as a parameter
2. Iterates a list or object applying the received function
3. Processes a value without changing its own variable

Once this pattern is recognized, it becomes clear that functional programming was already being applied — just without the formal terminology.

# Immutability

This is an important concept that, despite being simple in theory, can feel counterintuitive when coming from a structural or object-oriented programming background. The `const` keyword provides a gentle introduction, but applying immutability correctly to arrays and objects often requires a shift in mindset.

To understand immutability, we need to pay attention to two things, `variable reassignment` and `operations on variables`.

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

Then you ask the following question

> If I'm using const, why does it let me change the value of my object?

The `const` keyword only prevents variable reassignment — it does not prevent mutation of the object it references. **So how can an object be updated without mutating its reference?** The answer is to create a copy, manipulate it, and return a new object.

Our friend `spread operator` helps us a lot with this, despite only doing a `shallow copy`, which is a copy only of values with primitive type (string, number, boolean). In cases where there are objects with arrays or other objects, it's necessary to use methods like `deepClone`.

In the example given above, we could do it as follows:

```typescript
const mutate = (obj) => ({ ...obj, c: 2 });
const b = { a: 1 };
console.log(b); // {a: 1}
a(b);
console.log(b); // {a: 1}
```

And thus we would ensure the immutability of our object received in the function.

# More to come

The next article covers more advanced concepts. This one introduces the foundational ideas needed to start thinking functionally. Thank you for your time, see you soon, bye bye
