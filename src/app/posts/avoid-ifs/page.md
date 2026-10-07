---
level: 0
subjects: ["javascript", "typescript"]
title: "JS tricks: avoiding if statements"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2019-12-16T23:59:59.999Z"
description: "Replacing nested conditionals with data"
---

# Introduction

_This pattern probably has a well-known name, but the name is less important than the idea._

In a Telegram group, I saw someone ask:

> I need to make this algorithm without using if. Could someone help me?

The algorithm needed to use sex, age, and employment time to determine whether someone could retire. Before I could respond, someone wrote it with a ternary expression. It was clever, but it only replaced one conditional form with another.

The situation reminded me of a BMI algorithm I wrote in college. It had to have low complexity and be easy to test because the course focused on testing. Everyone began with a quick implementation and ended up with deeply nested **ifs**. Stepping back before writing led to this approach:

1. Create an enum for male and another for female, each containing the minimum and maximum index for that category.
2. Receive the input and perform the calculation normally.
3. With the result, search the enums for the range that satisfies the condition based on the calculated value.

In Java, this became fairly verbose—about six files for a relatively simple problem—but it met all the constraints.

The rest of this article applies the same idea in JavaScript and TypeScript.

# Defining our cases

```typescript
type Sex = "M" | "F";
type Measurements = { weight: number; height: number };

const titles = {
    underweight: "Underweight",
    normal: "Normal weight",
    slightlyOverweight: "Slightly overweight",
    overweight: "Above ideal weight",
    obese: "Obesity",
};

// The values don't match reality, I studied IT not medicine.
// Consult your doctor and drink water
const parameters = {
    M: [
        {title: titles.underweight, min: 0, max: 20.7},
        {title: titles.normal, min: 20.7, max: 26.4},
        {title: titles.slightlyOverweight, min: 26.4, max: 27.8},
        {title: titles.overweight, min: 27.8, max: 31.1},
        // This case is absurd, but we need to cover everything above 31.1
        {title: titles.obese, min: 31.1, max: Number.MAX_SAFE_INTEGER},
    ],
    F: [
        {title: titles.underweight, min: 0, max: 19.1},
        {title: titles.normal, min: 19.1, max: 25.8},
        {title: titles.slightlyOverweight, min: 25.8, max: 27.3},
        {title: titles.overweight, min: 27.3, max: 32.3},
        {title: titles.obese, min: 32.3, max: Number.MAX_SAFE_INTEGER},
    ],
};

const calculate = ({weight, height}: Measurements) => weight / height ** 2;

const sex = "M" as Sex; // input comes from user
const height = 1.8;
const weight = 77;
const bmi = calculate({height, weight});
const val = parameters[sex].find(
    (measurement) => measurement.min <= bmi && bmi <= measurement.max
);
console.log("Status", val.title);
console.log("BMI", bmi);
```

This is the same algorithm I first wrote in Java, expressed in far fewer lines of JavaScript. Here is what each part does:

1. Since it's in TS, first the type definitions
2. Definition of titles in `titles`
3. Here the parameters according to sex, we have a list of objects containing the title, the minimum BMI and the maximum
   BMI for each category.
4. `calculate` says it all, it's our function that will calculate the BMI
5. From `sex` to `bmi` there's nothing different or striking. But here's a **bonus**, lately I've been opting to use
   parameters as objects, so I can name my received parameters in the function and avoid the confusion of positional
   parameters, especially when you don't have types
6. In `val` we do a `find` of the object in our `parameters` list to identify the title, minimum and maximum BMI
7. Finally, we display the values

That covers the core technique for avoiding nested **ifs**. For comparison, here is the equivalent implementation using conditional statements:

```typescript
if (sex === "M") {
    if (0 <= bmi && bmi <= 20.7) {
        return {title: titles.underweight, min: 0, max: 20.7};
    }
    if (20.7 <= bmi && bmi <= 26.4) {
        return {title: titles.normal, min: 20.7, max: 26.4};
    }
    if (26.4 <= bmi && bmi <= 27.8) {
        return {title: titles.slightlyOverweight, min: 26.4, max: 27.8};
    }
    if (27.8 <= bmi && bmi <= 31.1) {
        return {title: titles.overweight, min: 27.8, max: 31.1};
    }
}
if (sex === "F") {
    // the same nest of ifs
}
throw Error("Something wrong is not right");
```

Notice how much more complex this becomes. Adding new values or rules means adding more nested **ifs**, making the code increasingly difficult to maintain.

> A natural question is: with multiple conditionals, how do we handle the case where no condition matches?

A valid point. The input does need to be guarded against invalid cases. A simple guard clause handles this cleanly:

```typescript
if (!parameters.hasOwnProperty(sex)) {
    throw Error("Something right is wrong");
}
// Normal flow of your program here
// It's nice to abort errors first
```

The guard clause completes the example and keeps the main flow focused on valid input.
