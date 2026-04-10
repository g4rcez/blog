---
level: 0
subjects: ["javascript", "typescript"]
title: "Array.prototype"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2019-08-05T00:00:00.000Z"
description: "Unmasking Array in JS"
---

# Introduction

Like most JavaScript articles, this one covers `Map`, `Filter`, and `Reduce`. The goal here, however, is to go a step further and do a deep dive into the `Array` package.

# Array

Creating an array in JavaScript is straightforward:

```javascript
const people = ["John", "Mary"]; // or
const People = Array("John", "Mary");
```

Both ways create an array, but it's more common to see the first form being used. Instantiating an array with `Array` will have some implications. Example

```javascript
const a = Array(5); // Creates an array with size 5 and undefined elements
const a = Array(5, 6, 7, 8); // Creates an array [5,6,7,8]
```

Notice how using `Array` directly can be problematic. It is preferable to always use `[]`, and that convention will be followed throughout this article. Before continuing, here are three static methods worth knowing:

## **Array.isArray**

```javascript
const isArray = Array.isArray; // type check to know if it's an array
isArray([]); // true
isArray({}); // false
isArray(null); // false
isArray("YEAH"); // false
```

## **Array.from**

```javascript
// Example taken from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Array_from_a_Set
const set = new Set(["foo", "bar", "baz", "foo"]);
Array.from(set); // ['foo', 'bar', 'baz', 'foo']
// We can use transformer functions
// too (similar to map, as you'll see later)
Array.from([1, 2, 3], (x) => x ** 2); // [1,4,9]
```

## **Array.of**

```javascript
// The difference between it and instantiating a new array
// with Array is that you have the safety of not creating
// an array with inconsistencies according to its parameters
const a = Array(5); // Creates an array with size 5 and undefined elements
const a = Array.of(5); // [5]
```

# Array.length

This property returns the number of elements in an array.

> Important to remember that array indices in Javascript start at 0, in case you come from Delphi, Lua...

# Array.concat

This method is quite interesting for you to **concat**enate elements and arrays with an existing one. But remember that it returns a new array and doesn't change the reference of your current array, requiring reassignment in case of reuse

```javascript
const zero = []; // []
const with7elements = zero.concat(1, 2, 3, 4, 5, 6, 7); // [1,2,3,4,5,6,7]
const with3elements = zero.concat([1, 2, 3]); // [1,2,3]
const with2elements = zero.concat([1], 2); // [1,2]
```

> Concat is great to use in .reduce, but if you're crazy about performance, you can take a
> [look at this article](https://dev.to/uilicious/javascript-array-push-is-945x-faster-than-array-concat-1oki) which is quite interesting showing the difference in usage and performance between push and concat

# Array.push

`push` is similar to `concat`, with one key difference: it adds all items passed as arguments to the end of the array without flattening them. Unlike `concat`, it does not convert a nested array into individual elements. Calling `array.push(elements)` where `elements` is an array may produce unexpected results:

```javascript
const a = []; // we create a constant,
// but we'll change its reference with push
a.push(1); // returns nothing, but we have a = [1]
a.push([1]); // returns nothing, but we have a = [1, [1]]
```

If you know exactly the type of elements, you can use it without fear and still have a performance gain at scale.

# Array.reverse

As the name suggests, `reverse` inverts the order of array elements. The following example also introduces the spread operator, which is covered in the next section:

```javascript
const string = "A man a plan a canal Panama";
[...string].reverse().join("");
// amanaP lanac a nalp a nam A
```

> A [palindrome](https://en.wikipedia.org/wiki/Palindrome) phrase is used here for demonstration. The capital letters make the reversal easier to observe.

# ... or SpreadOperator

"Spread syntax" as it is in [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) is our beloved _SpreadOperator_. It allows expanding iterable objects for use in functions and also destructuring iterables.

Although it's not the primary focus of this article, a few spread operator tricks are demonstrated below. Feel free to open an issue in the blog repository with any questions.

```javascript
const [first, second, ...n] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
first, second; // 1, 2
n; // [3,4,5,6,7,8,9]
const string = "The quick brown fox jumps over the lazy dog";
// [
//   'T', 'h', 'e', ' ', 'q', 'u', 'i', 'c', 'k', ' ',
//   'b', 'r', 'o', 'w', 'n', ' ', 'f', 'o', 'x', ' ',
//   'j', 'u', 'm', 'p', 's', ' ', 'o', 'v', 'e', 'r',
//   ' ', 't', 'h', 'e', ' ', 'l', 'a', 'z', 'y', ' ',
//   'd', 'o', 'g'
// ]
// Using a safer push...
const a = [];
a.push([1, 2, 3, 4, 5, 6, 7]); // Will put the array as a single element
a.push(...[1, 2, 3, 4, 5, 6, 7]); // Spreads according to each element
```

The spread syntax is a powerful tool that can replace `.call` and `.apply` in many scenarios. It also works on objects — further exploration is encouraged.

# Array.join

Since I used it in a previous example, here's the explanation. `join` concatenates all array items and transforms them into a string. The argument passed is how the `array -> string` conversion will be done. The default is comma, but if you want to transform into words, just use an empty string `("")`

```javascript
const string = "The early bird catches the worm";
const toArray = [...string];
const toStringAgain = toArray.join("");
```

# Array.find

This method searches the array for the first element that satisfies the provided callback. If no match is found, it returns `undefined`.

```javascript
const yourLoves = ["mom", "dad", "sister", "brother", "dog", "parrot"];
yourLoves.find((x) => You.loveMeByName(x)); // undefined
yourLoves.find(Boolean); // mom
```

While `find` returns the first match, the next method returns all matching occurrences.

# Array.filter

If find returns the first occurrence, filter returns **ALL** occurrences according to your callback

```javascript
const yourLoves = ["mom", "dad", "sister", "brother", "dog", "parrot"];
const whoLovesYou = yourLoves.filter(Boolean);
yourLoves.length === whoLovesYou.length; // true
```

Both `find` and `filter` share the same callback signature: `currentElement, indexInArray, iteratedArray`. It is worth noting that `map` uses this same signature as well.

# Array.map

This method transforms each element in the array according to the return value of the provided callback. It is particularly useful for converting arrays of objects to arrays of single values, or for adding and removing properties from a list of objects.

```javascript
const life = ["you", "your crush", "Brazil"];
const newLife = life.map((element) => Life.improve(x, 1000));
newLife; // ["Rich", "your crush in love", "Brazil+++"]
```

One thing `map` does not do is reduce an array to a single value. For that, `reduce` is the appropriate method.

# Array.reduce

Reduce transforms a list into a single element of any defined type. It is useful for summing items and can even emulate most of the other methods covered in this article.

> A compilation of practical tricks is included at the end of this article to reinforce the concepts presented.

```javascript
[1, 2, 3, 3, 4, 5, 6].reduce((acc, el) => `${el} + ${acc}`, "");
// 6 + 5 + 4 + 3 + 3 + 2 + 1 +
// Imagine the person object {name:"", age:0} in a list
const sumAge = personList.reduce((acc, el) => {
  return acc + el;
}, 0);
// Making an object become an object again with reduce
const person = { name: "Fu", lastName: "Ba", height: 1.8 };
const keysArray = Object.keys(person); // ["name", "lastName","height"]
const newPerson = keysArray.reduce((acc, el) => {
  return { ...acc, [el]: person[el] };
}, {}); // { name: "Fu", lastName: "Ba", height: 1.8 }
```

To clarify, `acc` and `el` are positional parameters received by the callback function:

1. Accumulator. Once an initial value is defined, it will respect that type, unless you change it out of nowhere in a wrong return (never do this or never let it happen)
2. Current value. The name says it all
3. Current value index. The name also says it all
4. Source iterable array. I don't even need to say the name says it all, right?

The `reduce` method accepts two parameters: the callback and the initial value. If the initial value is omitted, `reduce` uses the first array element as the accumulator and begins iteration from index 1. Always provide an explicit initial value to avoid subtle bugs.

# Tricks

The following tricks reinforce the concepts covered in this article. No explanation is provided — working through them independently is the best way to solidify understanding. Feel free to open an issue if you have questions.

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

Thank you for your time, see you soon, bye bye
