---
level: 1
subjects: ["react", "typescript", "javascript", "frontend"]
title: "React Hooks"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2020-02-02T00:00:00.000Z"
description: "A new (not so new) way of thinking"
---

# Introduction

This article on hooks has been overdue for a while. Many articles on the subject exist, but this one shares a personal perspective alongside some techniques that have proven most useful in practice.

# Rule of Hooks.

Before really getting into it, let's note the rules of hooks, which can be applied to your project
with eslint through the
[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. You can
do a `deep dive` in the [documentation](https://reactjs.org/docs/hooks-rules.html)

1. Only Call Hooks at the Top Level
2. Only Call Hooks from React Functions

# But in classes it was like this

The first step toward a solid understanding of hooks is to stop mapping them directly to class component patterns. Although both approaches produce components, the underlying model is fundamentally different.

If you already know class components, then forget a bit about the lifecycle to understand hooks. Sometimes
we end up making some associations in the case of `useEffect`

- "The `useEffect` with an empty dependency array is equal to `componentDidMount`"
- "The `useEffect` with a dependency array with some items that need to change is equal to `componentDidMount` and
  `componentDidUpdate`"

This is partially true, although the effect caused is the same, we can't assume they are the same thing. An
example:

```jsx
// In case of a class
componentDidMount()
{
    console.log("Component mounted")
}

// With hooks
useEffect(() => {
    console.log("Component mounted")
}, [])

useEffect(() => {
    console.log("Component mounted or updated")
}, [state])
```

In a strict sense, this component has two `componentDidMount`-equivalent behaviors:

- In one sense, yes: when the component mounts, both `useEffect` callbacks execute.
- In another sense, no: the second effect is not limited to mount — it executes whenever `state` changes. On mount, `state` receives its initial value, which constitutes a change and triggers the effect. Any subsequent update to `state` will trigger it again.

Our beloved `useEffect` hook only reacts to changes in its dependencies.

Another guy we confuse is `useState` because of the class method `this.setState()`. Let's check out the
methods:

```javascript
// updater can be an object or a function
this.setState(updater[, callback
])


// usage demonstration
class Component extends React.Component<never, { name: string }> {
    constructor(props: never) {
        super(props);
        this.state = {
            name: ""
        }
    }

    update = () => {
        this.setState({name: "Javascript"});
        this.setState(current => {
            return {name: "Typescript"};
        }, () => console.log("Updated with Typescript in this.state.name"));
    }
}

```

Important to remember that `this.setState` updates your state according to what you return to it, if you have
2 properties and your update object has only one, it won't concatenate the previous state with the new
state and nothing will be lost.

Now our friend `useState` works a bit differently from `this.setState`. Let's see:

```javascript
const [state, setState] = useState("");
// setting the value directly
setState("New string");
setState((currentState) => "New string with function");
```

In this case it's fine, but what about this case:

```typescript
const [state, setState] = useState < {name: string; age: number}({name: "", age: 0});
// setting the value directly
setState({name: "Typescript"});
```

If you do this, the `age` property will be lost and you'll get an undefined, to get around this, just do

```typescript
const [state, setState] = useState < {name: string; age: number}({name: "", age: 0});
// setting the value directly
setState(currentState => ({...currentState, name: "Typescript"}));
```

In my opinion, `useState` is only interesting to use in the following cases:

- Primitive type values
- Objects that are filled in a single action

With `useState`, we can compose our state in small isolated parts controlled in isolation.

> What if the goal is to manipulate the entire state at once, as `this.setState` allowed in class components?

Well, if you thought that, I'll introduce you to `useReducer`. I'll present two forms, the traditional form and a
custom hook I'm making _(As I take more than a day to write some articles, it might already be on
my git)_.

```typescript
import React, {useReducer} from "react";

const initialState = {
    name: "",
    age: 0,
    points: 0,
    isApproved: false,
};

type Actions =
    | {
    type: "onChangeText";
    text: string;
}
    | {
    type: "onChangeCheckbox";
    check: boolean;
}
    | {
    type: "onChangeNumber";
    value: number;
    field: "age" | "points";
};

type State = typeof initialState;

const reducer = (state: State, actions: Actions): State => {
    if (actions.type === "onChangeText") {
        return {...state, name: actions.text};
    }
    if (actions.type === "onChangeCheckbox") {
        return {...state, isApproved: actions.check};
    }
    if (actions.type === "onChangeNumber") {
        return {...state, [actions.field]: actions.value};
    }
    return state;
};

function Component() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, name, type, checked} = e.target;
        if (type === "checkbox") {
            return dispatch({type: "onChangeCheckbox", check: checked});
        }
        if (type === "number") {
            return dispatch({
                type: "onChangeNumber",
                value: Number.parseFloat(value),
                field: name as "age" | "points",
            });
        }
        return dispatch({type: "onChangeText", text: value});
    };
}
```

This pattern may look familiar to those who have used Redux. The main difference here is the absence of `switch/case`. Personally, this approach to `useReducer` has a drawback: when logic is needed for a specific dispatch type, the scope is shared with other actions, requiring a block inside an `if` or `switch/case`.

That overview covers the key differences between hooks and class components. The next sections explore custom hooks and other techniques that unlock the full power of hooks.

# Custom hooks - useReducer

As I said, this way of doing a useReducer is strange to me, I like to transform each `action` that will be dispatched
into an isolated function from the others. Below is the code for the customized `useReducer`, if the code gets too
big, [you can see the gist](https://gist.github.com/g4rcez/8274b8065e9506b33315baf05eca8645)

```tsx
import React, {useState, useMemo, Fragment} from "react";

// Reminding that there can't be reassignment
// in state because it's immutable (or should be)
type Immutable<State> = Partial<Readonly<State>>;

// Inference of types from the primary function
type Infer<
    State,
    Fn extends (...args: never) => (state: State) => Immutable<State>
> = (...args: Parameters<Fn>) => (state: State) => Immutable<State>;

// just a utils to extend in types
type ReducerChunk<Actions, State> = {
    [key in keyof Actions]: (args: any) => (state: State) => Immutable<State>;
};

export type Dispatches<State, Actions extends ReducerChunk<Actions, State>> = {
    [key in keyof Actions]: Infer<State, Actions[key]>;
};

const useReducer = <State, Actions extends ReducerChunk<Actions, State>>(
    initialState: State,
    actions: Actions
): [State, Dispatches<State, Actions>] => {
    const [state, setState] = useState(initialState);
    // memoizing actions to avoid new objects
    const dispatches = useMemo(
        () =>
            Object.entries(actions).reduce(
                (acc, [name, dispatch]: [string, any]) => ({
                    ...acc,
                    [name]: (...params: any) => {
                        const event = dispatch(...params);
                        setState((currentState) => ({
                            ...currentState,
                            ...event(...params),
                        }));
                    },
                }),
                {} as Dispatches<State, Actions>
            ),
        [actions]
    );
    return [state, dispatches];
};

type STATE = {
    name: string;
    age: number;
    points: number;
    isApproved: boolean;
};
const initialState: STATE = {
    name: "",
    age: 0,
    points: 0,
    isApproved: false,
};

const App = () => {
    const [state, reducers] = useReducer(initialState as STATE, {
        onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            // If passing the event to this next function
            // don't forget to use e.persist()
            // more info:
            // https://reactjs.org/docs/events.html#event-pooling
            return (): Partial<STATE> => ({name: value});
        },
        onChangeNumber: (e: React.ChangeEvent<HTMLInputElement>) => {
            const {name, value} = e.target;
            return (): Partial<STATE> => ({
                [name as "age" | "points"]: Number.parseFloat(value),
            });
        },
        onChangeCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => {
            const {checked} = e.target;
            return (): Partial<STATE> => ({isApproved: checked});
        },
    });
    return (
        <Fragment>
            <input name="name" onChange={reducers.onChangeName} value={state.name}/>
            <input
                type="number"
                name="age"
                onChange={reducers.onChangeNumber}
                value={state.age}
            />
            <input
                type="number"
                name="points"
                onChange={reducers.onChangeNumber}
                value={state.points}
            />
            <input
                type="checkbox"
                name="isApproved"
                onChange={reducers.onChangeCheckbox}
                checked={state.isApproved}
            />
        </Fragment>
    );
};

export default App;
```

With this `useReducer` we can create the functions of our component in the `useReducer` itself and we can infer
all types correctly. Each `type` from the original `useReducer` becomes a _property_ in our function object.

> **Note: this `useReducer` is implemented on top of `useState`. This is intentional and perfectly valid.**

As explained in the comment, `useMemo` was used so that an object is not recreated at every render,
only when our functions change. A very basic optimization is to create the function object outside the component.

This hook provides a concrete example of combining `useState` and `useMemo` effectively.

# Dealing with listeners

Something a bit common is creating an event listener, whether for an element or even for our `window` object. I'll
demonstrate an effect to observe screen size change

```typescript
const isClient = typeof window === "object";
const getSize = () => (isClient ? window.innerWidth : 0);

const useWidth = () => {
    const [windowSize, setWindowSize] = useState(getSize);
    useEffect(() => {
        if (!isClient) {
            return;
        }
        const resizeHandler = () => setWindowSize(getSize());
        window.addEventListener("resize", resizeHandler);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
};

export default useWidth;
```

The `resizeHandler` was created inside `useEffect` because `addEventListener` and `removeEventListener` need the same
reference to control the event.

One important thing to mention is the return of `useEffect`. I didn't mention earlier, but the return of `useEffect`
is executed when the component unmounts, similar effect to `componentWillUnmount`.

# What is useCallback?

useCallback is almost an `alias` for `useMemo`, but only for functions. It ensures the same function reference,
preventing functions in the body of our function components from being created at every new reRender.

# useEffect or useLayoutEffect?

Well, both are the same, but different. `useLayoutEffect` is only executed after all mutations in the DOM. The ideal
use is only when you do mutations with `refs` or things that depend on elements in our DOM (elements that
are not controlled by React, for example).

# React.forwardRef <3 useImperativeHandler

When you need to pass your component's references to whoever will consume it, your component needs to be
wrapped by a `React.forwardRef` and with `useImperativeHandler` we will assign the `ref` value of our
component. Simple as that:

```typescript
type Props = {
    ref: {
        focus(): void;
    };
};

const Input: React.FC<Props> = (props, externalRef) => {
    const internalRef = useRef();
    useImperativeHandle(externalRef, () => ({
        focus: () => {
            internalRef.current.focus();
        },
    }));
    return <input {...props}
    ref = {ref}
    />;
};

export default React.forwardRef(Input);
```

There has not been extensive personal use of these two APIs, but understanding their purpose and a practical use case is valuable.

# Conclusion: I'll owe you 2 hooks

Two hooks were not covered here: `useContext` and `useDebugValue`. `useDebugValue` has not been used in practice — `console.log` and `debugger` tend to cover most debugging needs.

`useContext` will be covered in a dedicated post, along with an experiment demonstrating how the `ContextAPI` (the modern version from React 16.3, not the legacy one) can replace Redux in certain scenarios.

Thank you for your time, see you soon, bye bye
