---
level: 0
title: Working with forms
subjects: ["react", "frontend", "typescript", "javascript"]
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2023-01-12T14:45:00.000Z"
description: "Build practical React forms with the browser APIs you already have"
---

# Introduction

Why are there so many form libraries? Forms often become complicated before the problem requires them to be.

Most forms are simple, and simple forms are the focus of this article. Nested objects and lists are less common and deserve a separate discussion. If most cases are straightforward, it is worth asking whether every form needs a library.

# The two types of forms

In the React ecosystem, controlled and uncontrolled forms are common topics. This post will not repeat every existing explanation; it compares both approaches and shows when each one is useful.

## Controlled forms

A controlled form is controlled by React state. You use [useState](https://beta.reactjs.org/apis/react/useState) or [useReducer](https://beta.reactjs.org/apis/react/useReducer) to keep that state synchronised with the fields on screen.

> For simple forms, I usually avoid this approach. It is useful when you need:

- Dependency between fields
- Real-time validations
- Interactive feedback
- Complex forms with internal objects and lists

With state in place, React's update model gives us a simple way to implement the form.

### Form + useState

This is a minimal controlled form. The only non-trivial part is the state-change handler.

The example demonstrates four things:

1. Define a typed state.
2. Create a generic `onChange` handler that uses the input's `name` to update the matching value.
3. Prevent the default submit behaviour so the page does not reload.
4. Attach the handler to a `<form>` with `onSubmit`.

```typescript
type State = {
    name: string;
    country: string;
};

export default function FormPage() {
    const [state, setState] = useState({});

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.currentTarget;
        // remember that value will always be a string
        setState(prev => ({...prev, [name]: value}));
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        console.log(state);
    }

    return (
        <form onSubmit = {onSubmit} >
        <input name = "name"
    value = {state.name}
    />
    < input
    name = "country"
    value = {state.country}
    />
    < button
    type = "submit" >
        Submit
        < /button>
        < /form>
)
    ;
}
```

This is enough for a simple form with state control. You can add custom logic with `useEffect` or field events such as `onBlur` and `onFocus`.

For forms without complex validation, this approach offers:

- Simple state logic
- Clear updates
- Types that reflect the state
- Little code

The example is intentionally simple. The browser's native [Validity State](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) can enforce numeric values, minimum and maximum ranges, and checkbox or radio constraints without an external library. We will return to it below.

## Uncontrolled forms

An uncontrolled form does not keep its field values in React state. You read the values when the form is submitted. You can inspect the controls through `querySelectorAll`, `form.elements`, or [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

The next examples show both options.

### FormData

```typescript
type State = {
    name: string;
    country: string;
};

export default function App() {
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const state = Object.fromEntries([...data.entries()]) as State;
        console.log(state);
    };

    return (
        <form onSubmit = {onSubmit} >
        <input name = "name" / >
        <input name = "country" / >
        <button type = "submit" > Submit < /button>
            < /form>
    );
}
```

This is simple and entirely native to the browser. There is no React state to update during interaction, and the submitted data is available in one place.

`FormData` does not convert values automatically, even when an input uses `type="number"`. Convert values explicitly when the application needs numbers.

### Query Selectors

Another option is `ELEMENT.querySelector` or `ELEMENT.querySelectorAll`. The latter returns a `NodeListOf` of HTML elements, not an array, so methods such as `.filter` and `.reduce` are not available until you convert it.

Write a [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors) and use it to find the fields you need. The implementation looks like this:

```typescript
type State = {
    name: string;
    country: string;
};

export default function App() {
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const state = [...form.querySelectorAll("input")].reduce<State>((acc, el) => ({
            ...acc,
            [el.name]: el.value
        }), {})
    };

    return (
        <form onSubmit = {onSubmit} >
        <input name = "name" / >
        <input name = "country" / >
        <button type = "submit" > Submit < /button>
            < /form>
    );
}
```

Like `FormData`, this approach does not update React state while the user types. You read all values when the form is submitted.

The difference is that you choose manually which controls make up the state. Because the selection uses CSS, you can build more specific queries with [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) or [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA).

We have now seen three ways to build a form, but none has added validation. That is next.

# Validity State

[Validity State](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) is an underused browser API. It is often replaced by validation libraries such as [Yup](https://github.com/jquense/yup) or [Zod](https://github.com/colinhacks/zod), together with form libraries such as [react-hook-form](https://react-hook-form.com/).

Those libraries are useful, but they add to the bundle. Native validity is a good alternative when the form is simple. Remember that it works for controls inside a `<form>` element; controls outside a form will not participate in its validation.

Native validity is not a complete solution for cases such as:

- List of objects
- Nested objects
- List of objects inside objects
- Field dependency

Logic of this kind is usually beyond what Validity State handles well. You can still use native validation for the individual fields; just do not expect it to model the whole data structure.

Validity State also lets us style an element according to its current state. The API exposes the reason a control is invalid, which makes validation easier to understand and control. There are ten invalidity states and one valid state, represented by `:valid`.

- valueMissing: triggers the `:invalid` state, applied for cases where there's no value
- typeMismatch: triggers the `:invalid` state, applied for cases where the type attribute (email or url) has an incorrect format
  in its value
- tooShort: triggers the `:invalid` or `out-of-range` state, applied for cases where the value doesn't have the minimum number of
  characters. Controlled through `minLength`
- tooLong: is the opposite of tooShort, but for cases where the value exceeds the maximum number of characters. Controlled
  through `maxLength`
- stepMismatch: determines if the value is divisible
  by [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-step). If not, triggers the
  `:invalid` or `out-of-range` state.
- rangeUnderflow: corresponds to `tooShort`, but for `<input type=number/>`
- rangeOverflow: corresponds to `tooLong`, but for `<input type=number/>`
- patternMismatch: triggers the `:invalid` state when the input value doesn't match the pattern determined
  in [pattern](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-pattern)
- customError: customizable errors that you can set from the
  [setCustomValidity](https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity) method
- badInput: checks if the browser can't convert the input value

If none of these states applies, the control is either valid or indeterminate. Valid controls match `:valid`; the [indeterminate](https://developer.mozilla.org/en-US/docs/Web/CSS/:indeterminate) state can apply to initial values and checkbox or radio controls.

Knowing these states lets you use CSS selectors to style fields and keep some validation logic out of JavaScript.

# Conclusion

The choice is now clearer: use controlled state when the UI depends on field values, and use an uncontrolled form when reading values on submit is enough. Add a library when the form is genuinely complex, not by default.

This is a useful mindset beyond forms: prefer the browser's native capabilities before adding a custom solution. Less code reaches the client, and the resulting experience is often more familiar.

Thanks for reading.
