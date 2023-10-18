"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { createGlobalReducer, useReducer } from "use-typed-reducer";

export const UseTypedReducerExample = () => {
    const [state, dispatcher] = useReducer({ count: 0, name: "Fulano" }, (get) => ({
        decrement: () => ({ count: get.state().count - 1 }),
        increment: () => ({ count: get.state().count + 1 }),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => ({ name: e.target.value }),
        reset: () => get.initialState,
        setName: (name: string) => ({ name }),
    }));

    return (
        <section className="border flex flex-col gap-4 border-slate-400 p-8 rounded-md my-4">
            <fieldset>
                <label>
                    Name:
                    <input
                        className="ml-2 bg-transparent border border-slate-400 rounded p-2"
                        onChange={dispatcher.onChange}
                        value={state.name}
                    />
                </label>
            </fieldset>
            <div className="flex gap-2 items-center">
                <button className="px-2 text-white rounded-md bg-blue-400" onClick={dispatcher.decrement}>
                    -
                </button>
                <span className="text-lg font-medium">{state.count}</span>
                <button className="px-2 text-white rounded-md bg-blue-400" onClick={dispatcher.increment}>
                    +
                </button>
            </div>
            <button className="px-2 text-white w-fit rounded-md bg-blue-400" onClick={dispatcher.reset}>
                Reset
            </button>
            <pre className="text-lg my-4 border dark:border-transparent border-slate-200">
                <code>{JSON.stringify(state, null, 4)}</code>
            </pre>
        </section>
    );
};

export const UseTypedReducerPropsMiddleware = () => {
    const router = useRouter();
    const [state, dispatcher] = useReducer(
        { count: 0, name: "Fulano" },
        (get) => ({
            decrement: () => ({ count: get.state().count - 1 }),
            increment: () => ({ count: get.state().count + 1 }),
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => ({ name: e.target.value }),
            reset: () => get.initialState,
            setName: (name: string) => ({ name }),
        }),
        router,
        [
            (state, action) => {
                console.log("Execute:", action, state);
                return state;
            },
        ]
    );

    return (
        <section className="border flex flex-col gap-4 border-slate-400 p-8 rounded-md my-4">
            <b>Open your console</b>
            <fieldset>
                <label>
                    Name:
                    <input
                        className="ml-2 bg-transparent border border-slate-400 rounded p-2"
                        onChange={dispatcher.onChange}
                        value={state.name}
                    />
                </label>
            </fieldset>
            <div className="flex gap-2 items-center">
                <button className="px-2 text-white rounded-md bg-blue-400" onClick={dispatcher.decrement}>
                    -
                </button>
                <span className="text-lg font-medium">{state.count}</span>
                <button className="px-2 text-white rounded-md bg-blue-400" onClick={dispatcher.increment}>
                    +
                </button>
            </div>
            <button className="px-2 text-white w-fit rounded-md bg-blue-400" onClick={dispatcher.reset}>
                Reset
            </button>
            <pre className="text-lg my-4 border dark:border-transparent border-slate-200">
                <code>{JSON.stringify(state, null, 4)}</code>
            </pre>
        </section>
    );
};

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
        <section>
            <div className="flex gap-4 items-center">
                <button className="px-2 h-fit text-white w-fit rounded-md bg-blue-400" onClick={dispatch.decrement}>
                    -
                </button>
                <p>{state.count}</p>
                <button className="px-2 h-fit text-white w-fit rounded-md bg-blue-400" onClick={dispatch.increment}>
                    +
                </button>
            </div>
            <div className="flex gap-4">
                <LocalComponent />
                <LocalComponent2 />
            </div>
        </section>
    );
};
