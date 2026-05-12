---
title: "Global, local or browser state?"
level: 2
subjects: [ "typescript", "javascript", "react" ]
language: "en-US"
translations: [ "pt-br", "en-us" ]
date: "2023-09-05T01:00:00.000Z"
description: "Is state the responsibility of the local component, global or the browser? Learn about the various forms of state storage"
---

State control is a very common debate in the frontend world. With so many ways to control, you can end up
falling into traps of having too many options, after all is it supposed to be local, global state or delegate the
responsibility to the browser?

The answer is quite simple...**it depends**.

# Types of state

To avoid confusion, let's name the states and define the scope. In this post we'll cover states within
React applications, where we can have states being manipulated from various sources.

## Local state

Local state is the simplest form of state control in the React universe. With it it's possible to maintain simple,
practical logic very close to your component.

Whether a class component using `this.setState` or the state control hooks `useState`
and `useReducer`. Since class components are almost completely forgotten, let's focus on functional components
that have state control through hooks.

### useState

Local state is a very effective and clear way to manipulate your state. Using the `useState` hook you have a
well-defined tuple, `[state, stateController]`. Being able to manipulate any values, `useState` is the simplest
form with hooks, giving you the power to directly update your value, whether it's a primitive like `string`
or `number`, or some more complex object like a list of users or an object that will come from an API request.

However, `useState` has some pitfalls worth knowing about — particularly when state updates are incorrect or when many `useState` calls accumulate in a component. Check out these situations

1. ***State update based on current state***. This is a very common practice, but don't be fooled...you can
   end up falling into a trap and reproduce the following scenario:

```typescript jsx
// 🚨 Don't do it this way...
function App() {
    const [count, setCount] = useState(0)
    return (
        <button onClick={() => setCount(count + 1)}>{count}</button>
    );
}
```

For a simple scenario this will certainly work. In more complex cases like forms and lists this may not
work correctly and cause bugs. To help these updates based on previous state, useState
delivers a function that can receive either your pure value or a function that needs to return the new value.

```typescript jsx
// ✅ Do it this way
function App() {
    const [count, setCount] = useState(0)
    return (
        <button onClick={() => setCount((p) => p + 1)}>{count}</button>
    );
}
```

Whether the pure value or a function that returns that value, the function that updates the state will know how to correctly interpret and
update the state with the new value passed. The function form serves exactly to help you update
state based on the previous value, this is very useful for situations like the following:

```typescript jsx
const [count, setCount] = useState(0)
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

The result will be 1 due to
[batch updates](https://react.dev/learn/queueing-a-series-of-state-updates#react-batches-state-updates).
This behavior may seem surprising, but it is the expected result given how React handles state updates. And that's exactly why it's important to use
state updating in the function form and not directly getting the current state value.

2. ***References and references***

As everything in React is based on references, for state control it couldn't be different. You have to remember that
state updates are based on the following logic:

- *Primitive type value*: numbers, strings, booleans, undefined, null...
- *Object reference*: Date, object, Array, File...

But why does React use values for primitive types and reference for objects? The comparison base
of React is a well-known method,
[Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Its
operation is similar to the strict equal operator `===`. Below we can observe how it works

```typescript
Object.is(1, 1) // true
Object.is("1", 1) // false
Object.is([], []) // false
Object.is({}, {}) // false
const object = {}
const other = object
Object.is(object, other) // true
```

As stated...everything is **references**. The `Object.is` algorithm looks at the reference of objects, and only
when it's different React will cause the state update. Due to this rule, the example below doesn't cause
state update

```typescript jsx
// 🚨 Don't do this
const [user, setUser] = useState({name: ""});
user.name = "John";
```

Since the reference of `user` remains the same, no state update will be performed. If you really
want to update the state, you can do it as follows:

```typescript jsx
// ✅ Do it this way
const [user, setUser] = useState({name: ""});
// When you have only one key in the object
setUser({name: "John"});
// When you have an object with several keys
setUser((prev) => ({...prev, name: "John"}));
```

Looking at the second option you might be asking:
> This way I'll be recreating the objects inside my previous state, right?

It's a great question and the answer is no.
The [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) does
a [shallow copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy) and this preserves the reference of
objects and lists that exist in your state.

### useReducer

`useState` is very effective in manipulation, but in some cases it may not bring the desired code clarity or the most
effective way to update states. And this is when you can resort to `useReducer`, a sophisticated way to
update your state based on the
[reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) logic, where you
have only one state update function and
this function receives the previous state and the new values to return the updated state. Kind of complex? Let's
exemplify with code

```typescript jsx
type State = { name: string; age: number };
type Action = { type: "register", name: string } | { type: "birthday" }
const reducer = (state: State, action: Action) => {
    if (action.type === "register") return {...state, name: action.name}
    if (action.type === "birthday") return {...state, age: state.age + 1}
    return state;
}
const [state, dispatch] = useReducer();
dispatch({type: "register", name: "John"});
dispatch({type: "birthday"});
```

Now it's clearer how to use `useReducer`. And it's worth remembering that your reducer function must be a pure
function, that is, it can't have side effects outside its scope, things like DOM changes, saving to
localStorage or similar.

Looking at it this way `useReducer` seems to have more problems than `useState`, but its gain is the organization via
updates based on actions/events and the fact of concentrating all update logic in a single sector of the code.

> I'm also not a big fan of using `useReducer`, so I created the
> library [use-typed-reducer](https://github.com/g4rcez/use-typed-reducer) with the intention of having a simpler
> and strongly typed form for dispatchers. With the addition of some features like middlewares and ways to get
> updated props at each dispatch.

## Global state

This is possibly the type of state that generates the most discussions and different implementations. Just to give you an idea,
we have the following ways to have global state in an application

- [ContextAPI](https://react.dev/reference/react/createContext): native React functionality for global state
- [React-Redux](https://redux.js.org/): one of the largest and oldest libraries for React state control
- [Zustand](https://github.com/pmndrs/zustand): simple and effective way to work with states via selector functions
  to avoid rerender
- [Valtio](https://github.com/pmndrs/valtio): state updates via granular update, seeking to optimize
  object properties
- [Recoil](https://recoiljs.org/): Facebook/Meta library for state control via atoms, that is, small
  pieces of state
- [Jotai](https://github.com/pmndrs/jotai): similar to recoil, but with many more features for working with
  atoms
- [Preact-react-signals](https://github.com/preactjs/signals/tree/main/packages/react): a very old form of state control
  (presented in BackboneJS) that was resurrected by SolidJS and Preact

> Zustand, valtio and jotai are maintained by the same team of developers

The main topic of debate about global state is how state updates impact your applications. Many
people don't like ContextAPI because it forces re-rendering of all child components, with no state
optimization. Some other people don't like redux due to the large volume of code produced to do simple
actions (which is no longer so true, given the new versions of redux). Libraries like zustand, valtio, jotai and
signals are quite popular due to their simplicity in managing state. Signals are even more popular due
to their optimizations for updating state,
[although you don't need signals](https://blog.axlight.com/posts/why-you-dont-need-signals-in-react/).

Since we have several libraries that do state control, we won't focus on all of them. First we'll cover
ContextAPI and its side effects, then we'll talk a little about how the other libraries do to avoid
unnecessary renders.

### ContextAPI

The canonical global state of React, as mentioned earlier. When creating a context, you have two values to
deal with, `consumer` and `provider`.

As the name says, `consumer` will be your way to consume global state via components, while `provider` will be your way
to distribute global state or even in a more localized way. You can have a context that provides state in
various places, separately. It's a very common technique in components of the
[radix-ui](https://www.radix-ui.com/) library, being an excellent example to observe how it works.

With hooks it's even easier to consume contexts, through the `useContext` hook. To provide global state with
context, you can use your knowledge with `useState`, `useReducer` or even with
[use-typed-reducer](https://github.com/g4rcez/use-typed-reducer):

```typescript jsx
import {createContext, PropsWithChildren, useContext, useState} from "react"

export type State = { name: string }
const context = createContext<State>({name: ""});

export const Provider = (props: PropsWithChildren) => {
    const [state, setState] = useState<State>({name: ""});
    return <context.Provider>{props.children}</context.Provider>;
}

export const useMyContext = () => useContext(context)
```

This is a small snippet to safely initialize your context. In some tutorials you'll find the context
being created without an initial value. This technique is also common to force people to pass an initial value in the
Provider and hide the use of the return from `createContext`. Since this example is something aimed at code within the
project, you don't need to use the same techniques used by libraries, but for curiosity purposes the
result would be the following:

```typescript jsx
import {createContext, PropsWithChildren, useContext, useState} from "react"

export type State = { name: string }
const context = createContext<State | null>(null);

export const Provider = (props: PropsWithChildren<{ initialValue: State }>) => {
    const [state, setState] = useState<State>(props.initialValue);
    return <context.Provider>{props.children}</context.Provider>;
}

export const useMyContext = () => {
    const ctx = useContext(context)
    if (ctx === null) throw new Error("Provide an initial value in the Provider");
    return ctx;
}
```

The conditional test in `useMyContext` ensures that your return is always of type `State` and not a `State | null`.
Since context doesn't have mechanisms to perform selectors on state, it ends up not being the audience's favorite.

### State selectors

This expression has already been used a few times and still hasn't had an explanation of what it really is, so here it will be
addressed. State selectors or `selectors` is a technique that helps libraries like redux and zustand
partially re-render your component tree. This is because with selectors you can say exactly what
you want from your global state, allowing libraries to make your component re-render only when the specific
part of state is updated, or better, when the selected part of state is updated.

It's very common in libraries for you to have function parameters with a `selector` and a `comparator`.

The selector is responsible for saying which part of state you want to use and how your global state will be represented
in your component. With it you can partition your state into smaller objects, even if your state has several
nested objects, as you can see in the example below

```typescript jsx
const state = useStore(state => ({name: state.user.name, products: state.cart.products}))
```

The comparator is responsible for comparing the previous state with the current one and defining if there will be change. It's practically a
function that dictates the behavior of memoization, similar to [`React.memo`](https://react.dev/reference/react/memo).
Rarely will you need to write this function (but it's important to know), because libraries already have their shallow
compare function. Only in a very specific case will you need it, but if you reach this stage, maybe you have
to rethink your states.

### zustand

Since it's one of the darlings currently (on September 6, 2023), I'll talk about it specifically. I believe one of the
reasons that makes this lib so adopted recently is the fact of its simplicity in use, check it out...

```typescript jsx
import {create} from 'zustand'

const useStore = create((set) => ({
    count: 1,
    inc: () => set((state) => ({count: state.count + 1})),
}))

function Counter() {
    const {count, inc} = useStore()
    return (
        <div>
            <span>{count}</span>
            <button onClick={inc}>one up</button>
        </div>
    )
}
```

A very curious fact is that zustand works in a very similar or even identical way to redux regarding
re-render optimization. Both use selectors for optimization, both are based on the immutable state model.
The gain of zustand is not depending on providers, not having boilerplate like there is in redux.

Another interesting factor is that zustand allows you to add actions to state, having all control in one place,
whether state, or action that manipulates state. Unlike redux, you won't need third-party libraries to
improve the development experience with zustand.

If you're looking for a good library to manipulate your global state, zustand is a great option.

### valtio, signals and similar...

Since there are many libs, I'll only address some positive and negative points of each

- [Recoil](https://recoiljs.org/) and [Jotai](https://github.com/pmndrs/jotai): state control at the atomic level, where you use atoms in a compositional way, encouraging more functional models. Recoil was the first lib with this model and soon after came Jotai as an alternative to recoil, having quite interesting features and focusing on an unmatched development experience.
- [Preact-react-signals](https://github.com/preactjs/signals/tree/main/packages/react): recently signals have been
  widely commented by the frontend community, we had VueSignals, Angular Signals, QwikSignals... It's a concept of
  optimization at the granular level, being a very effective way to avoid unwanted re-renders. The not so
  negative point is the way of consuming signals, which is a bit out of the react standard, encouraging mutation techniques
- [Valtio](https://github.com/pmndrs/valtio): Similar to signals, valtio has a mutable state model, where it uses [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to identify mutations and update state. The negative point is the same as signals, encouraging a model a bit different from React.

## Browser state

> If everything runs in the browser, does that mean all states are browser states?

With this question we can start presenting browser state. When I say browser state, it means we'll use browser features and APIs to store state, regardless of technology.

### URL

Yes, the URL is a very effective way to store state and besides storing state it has a feature that no other lib can bring you ***browser history***. Storing state in the URL you'll be able to:

- Allow your user to walk through past application states
- Allow fluid navigation and restore previously performed actions, such as searches via query-string
- Your user can share the state with other users. You know when you see a product with a good price in an ecommerce? Well, thanks to the URL you can share it with other people.

This may seem complex at first, but it is straightforward to implement — either manually or using routing libraries, such as [react-router](https://reactrouter.com/en/main), [tanstack-router](https://tanstack.com/router/v1) or even [brouther](https://brouther.vercel.app/).

Using routing libraries in React, you just need to use hooks that provide access and modification to your URL's query-string. Having that, you won't need to control your application states and can delegate state to the URL, getting for free all the points mentioned earlier.

### Local Storage and Session Storage

These are two well-known browser storage APIs. They provide simple ways to persist state even after the browser is closed. If you want to store data without expiration, opt for [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). But if you opt for a short session (until the user closes the tab), then [Session Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

The operation of both is very similar, with an identical interface, allowing you to swap one for another without any difficulty, only having to deal with expiration consequences.

There's no simple way to make reactive state using these storages, but they're great for saving form states between one step and another, saving component state updates so you can provide "Continue where you left off" options. Another very effective way is to save user preferences, like theme, home page, most searched filters (this is only advisable if you don't have a preferences API and want to keep preferences tied to the user's browser).

```typescript jsx
window.localStorage.setItem("prefer-theme","dark")
window.localStorage.get("prefer-theme") === "dark" // true
```

If you need a library that does some abstractions, like parsing JSON to save in Local Storage or Session Storage, you can look at [storage-manager-js](https://www.npmjs.com/package/storage-manager-js). Besides Local and Session Storage, it covers cookie manipulations.

### Cookies

Accept cookies? The web classics that are always being asked to store your information for tracking. Cookies also store information, but are more advisable to be manipulated on the API side and not on the frontend. So I'll cover less about them. The only tip I can leave is to use your JWTs in cookies, with secure enabled, http-only set (to avoid theft in case of XSS attack) and with a not too long expiration time.

# When to use which?

Now that several types of state have been presented, we can compare each of them and draw conclusions about the use of each. The most effective way will be to present a problem and the most appropriate state solution for each of the problems mentioned. Remember that more than one solution can exist for the problem, here I'll only present solutions that I consider most appropriate.

## Multi-step form

Forms have always been and will possibly always be a headache for everyone, due to the amount of requirements asked for each one. When a form doesn't have state interactions, I prefer not to do local state control, I just save the state of each step at submit time in Local Storage. This way, I can make the form faster, with less logic and I can still extract the feature of having a default value if the user goes back to some step, using the inputs' `defaultValue` properties and the value obtained from Local Storage during the first render.

## Table filters/form searches

This is a case very similar to the multi-step form, the difference is that in this case I opt to save the information in the URL, so the user can have a history with their searches and share searches through the URL. It's a very simple case. Like the previous case, I opt not to control form state and only load default values according to URL state.

## Multi-interaction or interdependency forms

These are the most annoying forms, where field X depends on the value of field Y and Z. In these cases there's not much to run from...you need to have a local state to control your form. Nothing that a [use-typed-reducer](https://github.com/g4rcez/use-typed-reducer) or a [react-hook-form](https://www.react-hook-form.com/) can't solve the global state manipulation problem. Like every form, I usually save the state so the user can recover the session if something happens to the form (closing the tab or browser, accidentally hitting F5).

## User information

This is a classic case of global state, whether using redux, zustand, jotai or any other. This guy specifically is important to be in global state so you can react to profile information, whether to hide or show components, highlight the logged account, switch profile...there are many things that make sense.

# Conclusion

There are several ways to manipulate state, to not get confused, know each one well and mainly know your problem well. It's not always necessary to have global state just because the information is used in two different screens, sometimes a hook with implemented logic can do the job well. Avoid premature optimization, and the various state sources will be manageable.

Thank you for your time, see you soon, bye bye
