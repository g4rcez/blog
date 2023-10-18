---
title: Use Typed Reducer
description: "A fully typed way to control your local or global state"
date: 2023-10-17T19:58:51.317Z
slug: use-typed-reducer
keywords: [ "react", "global", "state", "local", "state-management" ]
npmName: use-typed-reducer
npmLink: https://www.npmjs.com/package/use-typed-reducer
---

# Why use use-typed-reducer

The original useReducer forces you to use the well-known redux pattern. We need to pass the parameters in an object and
a mandatory "type" to identify the action being performed.

With useTypedReducer, you can use your function the way you prefer, it will infer the parameters and return a new
function with the current state so that you can make the changes you want to the new state.

There are some benefits on using `use-typed-reducer`:

- Typescript out of the box
- Better DX to manipulate state
- Same API to manipulate global and local state
- Separate your state from your actions
- An easy way to center your entire logic of your component/state
- Easy API to update your state, just return what you need to update

# How to Install?

```shell
# using npm
npm install use-typed-reducer
# using yarn
yarn add use-typed-reducer
# using pnpm
pnpm add use-typed-reducer
# using bun
bun add use-typed-reducer
```

# How can I use it?

`use-typed-reducer` focus in typed way to control your state. The API provide way to access your state, external props
and apply middleware (to avoid useState logic on your component).

## Basic example

```typescript jsx
import React from "react";
import {useReducer} from "use-typed-reducer";

export const UseTypedReducerExample = () => {
    const [state, dispatcher] = useReducer({count: 0, name: "Fulano"}, (get) => ({
        decrement: () => ({count: get.state().count - 1}),
        increment: () => ({count: get.state().count + 1}),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => ({name: e.target.value}),
        reset: () => get.initialState,
        setName: (name: string) => ({name}),
    }));

    return (
        <main>
            <fieldset>
                <label>
                    Name:
                    <input onChange={dispatcher.onChange} value={state.name}/>
                </label>
            </fieldset>
            <div>
                <button onClick={dispatcher.decrement}>
                    -
                </button>
                <span>{state.count}</span>
                <button onClick={dispatcher.increment}>
                    +
                </button>
            </div>
            <button onClick={dispatcher.reset}>
                Reset
            </button>
            <pre>
                <code>{JSON.stringify(state, null, 4)}</code>
            </pre>
        </main>
    );
};
```

<UseTypedReducerExample />

## Using Middleware + Props

Using this approach you're able to apply any logic between state updates (with middlewares) and you can receive props

```typescript jsx
import {useRouter} from "next/router";
import React from "react";
import {useReducer} from "use-typed-reducer";

export const UseTypedReducerPropsMiddleware = () => {
    const router = useRouter();
    const [state, dispatcher] = useReducer(
        {count: 0, name: "Fulano"},
        (get) => ({
            decrement: () => ({count: get.state().count - 1}),
            increment: () => ({count: get.state().count + 1}),
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => ({name: e.target.value}),
            reset: () => get.initialState,
            setName: (name?: string) => ({name: name || props.query.name}),
        }),
        router, // your dynamic props here
        [
            (state, props) => {
                console.log(state, props);
                return state;
            },
        ]
    );

    return (
        <main>
            <b>Open your console</b>
            <fieldset>
                <label>
                    <input onChange={dispatcher.onChange} value={state.name}/>
                </label>
            </fieldset>
            <div>
                <button onClick={dispatcher.decrement}>-</button>
                <span>{state.count}</span>
                <button onClick={dispatcher.increment}>+</button>
            </div>
            <button onClick={dispatcher.reset}>
                Reset
            </button>
            <pre>
                <code>{JSON.stringify(state, null, 4)}</code>
            </pre>
        </main>
    );
};
```

<UseTypedReducerPropsMiddleware />

## Global state

If you need to change your local state to a global state or just create a global state, you can use `createGlobalReducer`. This function takes your state and actions and return a hook for your global state and global updates.

```typescript jsx
const useStore = createGlobalReducer({ count: 0 }, (arg) => ({
    increment: () => ({ count: arg.state().count + 1 }),
    decrement: () => ({ count: arg.state().count - 1 }),
}));

const LocalComponent = () => {
    const [state, dispatch] = useStore();
    return <p>Global count(component 1): {state.count}</p>;
};

const LocalComponent2 = () => {
    const [state, dispatch] = useStore();
    return <p>Global count(component 2): {state.count}</p>;
};

export const ExampleWithGlobalState = () => {
    const [state, dispatch] = useStore();
    return (
        <div>
            <button onClick={dispatch.decrement}>-</button>
            <button onClick={dispatch.increment}>+</button>
            <p>{state.count}</p>
            <LocalComponent />
            <LocalComponent2 />
        </div>
    );
};
```

<ExampleWithGlobalState />