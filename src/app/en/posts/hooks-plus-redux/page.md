---
level: 1
subjects: ["react", "redux", "frontend", "typescript", "javascript"]
title: "Hooks + Redux"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2019-09-29T11:33:00.000Z"
description: "Uniting hooks with global state"
---

# Introduction

Since the stable release of Hooks for React, many articles have promoted the idea of **using Hooks to eliminate Redux from your application**. Some of these contain interesting ideas, but that is not the purpose of Hooks. If the goal is to replace Redux, ContextAPI is the right area to study.

Hooks have been in use since the Alpha version, alongside Redux Hooks — both in production.

# Hands on

At the start, there was difficulty in migrating the usage pattern. The goal was to combine Hooks with Redux without needing `connect`, while preserving the convenience it offered. Although Redux Hooks provide `useSelector` and `useDispatch`, some optimizations were missing. Redux's documentation covers these optimizations, but the approach feels incomplete. A more robust solution can be built. Here is the first optimization idea:

```javascript
// useReselect.js
import { useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

const state = (fn) =>
  createSelector(
    (_: GlobalState) => fn(_),
    (state) => state
  );

const useReselect = (states, dispatches, comparator = shallowEqual) => {
  const dispatch = useDispatch();
  const memoDispatch = Object.keys(dispatches).reduce((acc, fn) => {
    return {
      ...acc,
      [fn]: useMemo(
        () =>
          (...params) =>
            dispatch(dispatches[fn](...params)),
        [fn]
      ),
    };
  }, {});
  return [useSelector(state(states), comparator), memoDispatch];
};

export default useReselect;

// Usage demonstration

const mapStateToProps = (state) => ({
  clients: state.ClientReducer.clients,
});

const mapDispatchToProps = { getClients };

const Component = () => {
  const [globalState, dispatches] = useReselect();
  useEffect(() => {
    dispatches.getClients();
  }, []);
};
```

This addressed many issues, but the goal was to provide something closer to the class component approach for a team transitioning to functional components with Hooks. The array return was transformed into an object:

```javascript
// useConnect.js - The code above will be reused
import useReselect from "./useReselect";
import { shallowEqual } from "react-redux";

const useConnect = (
  state,
  dispatches,
  props = {},
  comparator = shallowEqual
) => {
  const [globalState, globalDispatches] = useReselect(
    state,
    dispatches,
    comparator
  );
  return { ...globalState, ...globalDispatches, ...props };
};

// Usage demonstration

const mapStateToProps = (state) => ({
  clients: state.ClientReducer.clients,
});

const mapDispatchToProps = { getClients };

const Component = (externalProps) => {
  const props = useConnect(mapStateToProps, mapDispatchToProps, externalProps);
  useEffect(() => {
    props.getClients();
  }, []);
};
```

The result is a hook that delivers something familiar to those accustomed to class components, without the wrapper component overhead. `useConnect` behaves similarly to `connect`, but does not create a wrapper component to pass props from the store.

# Is that all?

Using the basic hooks `useState` and `useEffect`, it is possible to create abstractions that expose values in a more digestible form to consumers. Two examples follow: `Filter lists` (with Redux usage) and `Display loading` (without Redux usage).

```javascript
// useClientFilter.js - Filter a client list, given a key and value
import { useState, useEffect } from "react";
import useConnect from "./";

const stateToProps = (state) => ({ clients: state.ClientReducer.clients });
const useClientFilter = (key, value) => {
  const props = useConnect(stateToProps, {});
  const [list, setList] = useState(props.clients);

  /* This effect will execute every time:
        - The list changes size
        - The key property changes
        - The value property changes
    */
  useEffect(() => {
    const filterList = props.clients.filter((client) => {
      const clientValue = client[key];
      return !!clientValue.match(new RegExp(value, "gi"));
    });
    setList(filterList);
  }, [key, value, props.clients.length]);

  return list;
};

export default useClientFilter;
```

With this small hook, instead of creating the filter in the component, we can use it to abstract the work and replicate its use in several components, without repeating code.

```jsx
import React, { useState } from "react";
import useClientFilter from "./hooks";

const ClientList = () => {
  const [input, setInput] = useState("");
  const clients = useClientFilter("name", input);
  const onChange = (e) => setInput(e.target.value);
  return (
    <Page>
      <Input onChange={onChange} value={input} />
      {clients.map((client) => (
        <Row key={client.name}>
          <Text>{client.name}</Text>
          <Text>- Status: {client.status}</Text>
        </Row>
      ))}
    </Page>
  );
};
```

![Demonstrating the filter hook for clients](/static/hooks-demo.gif) Cropped example :(

In this component, we'll have the filtered list whenever the onChange method is executed, because our `useClientFilter` rule says that if our `value` changes, it will execute the `useEffect` callback;

The second example I'll show is for cases where your action won't have an impact on your redux store, except setting attributes like `loading`. From now on, you can handle these actions in a new way, using them in a hook. This way, each action will have its own loading and there won't be problems of the user executing an action that triggers `loading` in the same reducer.

Let's make an example to inactivate clients and update the list after delete is done successfully.

```javascript
import useConnect from "./hooks";
import { useState } from "react";
const mapStateToProps = () => ({}); // objects you need
const mapDispatchToProps = {}; // actions you need

const useDeleteClient = () => {
	const [state, setState] = useState({ loading: false, success: false });
	const callback = (id) => {
		setState({ loading: true, success: false });
		fetch("https://api.awesomeurl.dev/client/" + id, { method: "DELETE" })
			.then((e) => {
				if (e.ok) {
                    setState({ loading: false, success: true });
                    // redux actions will be performed here
                    // in case of success
				} else {
                    setState({ loading: false, success: false });
                    // redux actions will be performed here
                    // in case of request failure
				}
			})
			.catch((e) => {
                setState({ loading: false, success: false });
                // Some other error like connection, for example
			});
	};
	return [state, callback];
};
export default useDeleteClient;

// Demonstration

const DeleteClient42Button = () => {
    const [state,callback] = useDeleteClient();
    const delete = () => callback(42);
    if(state.success){
        // Any notification component
        Notification.show("Client 42 was deleted")
    }
	return (
            <Button
                disabled={state.loading}
                onClick={delete}>
                Delete Client 42
            </Button>
    )
};
```

And thus we can have an action with its own state, without the need to create redux actions for flow control, just using Hooks.

# That's all for today

The next time an article titled **Using hooks to kill Redux** appears, consider how both technologies can be used together. They are not competitors — they are complementary tools that, combined, provide greater productivity for the entire team. Thank you for your time, see you soon, bye bye
