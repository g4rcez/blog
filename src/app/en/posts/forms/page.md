---
level: 0
title: How to work with forms?
subjects: ["react", "frontend", "typescript", "javascript"]
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2023-01-12T14:45:00.000Z"
description: "How to create forms without having millions of external dependencies?"
---

# Introduction

Why are there so many form libraries? Why are there always so many complications when it comes to forms?

Most of the time we work with simple forms (which will be the focus of this article) and rarely find cases
where there are nested objects or lists (topic for the next article). If most cases are simple, why
do we use so many libraries?

# The two types of forms

In the react world you'll find many articles like this, talking about controlled forms and
uncontrolled forms. The goal here is not to repeat what has been covered elsewhere, but to offer a more thorough comparison — a genuine deep dive — into both approaches.

## Controlled forms

As the name says, they are controlled forms. But controlled by what? In this case, controlled by React state. In this
case you'll have a [useState](https://beta.reactjs.org/apis/react/useState)
or [useReducer](https://beta.reactjs.org/apis/react/useReducer) to synchronize the react state with your
forms on screen.

> Personally, this approach is best avoided for simple forms. It is, however, very useful in the following situations:

- Dependency between fields
- Real-time validations
- Interactive feedback
- Complex forms with internal objects and lists

Having state control in mind, we can apply react's reactive logic to our form in a very
simple way

### Form + useState

This is perhaps the simplest implementation for controlled forms, maybe the only complex thing here is the
handler for state changes.

In the following example we'll implement the following features:

1. Create a typed state for the case
2. Create a generic onChange that receives the event and inserts the new value based on the input name that dispatched the event
3. An onSubmit that will prevent the default behavior so the page is not reloaded
4. A `<form>` with an onSubmit applied for the logic of the function mentioned above

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

With this simple code, you'll be able to make simple forms with state control. Feel free to
add any custom logic, whether using a useEffect or any event listeners from your input,
such as onBlur and onFocus.

For cases where you don't have custom validation, this approach is perfect because:

- Simple state logic
- Clarity of actions
- Typing according to state
- Simple code

This example is intentionally simple, but the native [Validity State](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) can be used to enforce constraints such as numeric values, min/max ranges, and checkbox or radio state — all without any external libraries. This will be covered in more detail shortly.

## Uncontrolled forms

As the name says, uncontrolled forms don't have state control. The capture of values from this type of
form is all done on form submit. The capture can be done through a logic of parsing all
form inputs through querySelectorAll or `form.elements`, or using
[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

Both approaches will be demonstrated to illustrate the available options:

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

Pretty simple, isn't it? And best of all, this is all native to the browser, zero state control during
user interaction and total control of data on submit action.

Although using an API that natively handles form data, even if you use a `type=number`,
FormData won't do automatic conversion :/

### Query Selectors

A well-known feature for selecting elements is `ELEMENT.querySelector` or `ELEMENT.querySelectorAll`. The difference
between the two is that `querySelectorAll` returns a `NodeListOf` of HTML elements, and no, this is not an array for
you to use methods like `.filter` or `.reduce`.

Using querySelector is quite simple, just write
a [CSS Selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors) and you'll have
a `NodeListOf` of those elements.

Without further ado, let's go to the code

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

Like the previous method, this method also doesn't do any state control during user actions, only
on the submit action you'll have access to all values filled in the form.

The basic difference between the methods is that in this method you'll do the "manual" selection of what will compose the state.
As it's a CSS Selector, you can make more complex queries based
on [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)
or [AriaAttributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA).

So far 3 form methods have been presented and none of them have been properly validated. But we'll see that
now...

# Validity State

This is one of the most underrated browser APIs, frequently overlooked in favor of validation libraries such as [Yup](https://github.com/jquense/yup) or [Zod](https://github.com/colinhacks/zod) combined with form libraries like [react-hook-form](https://react-hook-form.com/).

This combo of libraries is interesting, but maybe in situations where you want to keep a smaller build size,
they won't be as effective. And this is exactly where
the [Validity State](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) shines. And it's worth remembering that you **can
only use it with inputs inside the `<form/>` tag**, otherwise no validation will be done

Of course in some more complex form cases like:

- List of objects
- Nested objects
- List of objects inside objects
- Field dependency

Any slightly more complex logic is typically beyond what Validity State handles well. That said, nothing prevents its use — the key is designing a user-friendly flow that avoids field dependencies and complex nested structures.

With ValidityState, we can apply CSS based on our element's state. We also have some "reasons" for
error motives, which makes it easier for us to understand and control component validation. In total there are 10 error states
and 1 valid state, called `:valid`.

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

And if none of these are considered true, it means our input is indeterminate or valid. In valid cases,
the `:valid` state will be triggered. The
[indeterminate](https://developer.mozilla.org/en-US/docs/Web/CSS/:indeterminate) case is applied for initial values,
checkbox or radiobox.

Knowing these values you can create styles using CSS selectors based on your input's state and reduce
the amount of logic in your Javascript code

# Conclusion

With all the content presented, it's a bit easier to decide what to do when you encounter some form situation.
There is no need to add libraries to validate fields unless the situation is genuinely complex.

A cool mindset to adopt, not just for forms, is to use more of the browser instead of using custom
solutions. This reduces the amount of code delivered to the client and improves the experience, bringing a more
native/familiar experience.

Thank you for your time, see you soon, bye bye
