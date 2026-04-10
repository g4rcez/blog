---
level: 0
subjects: ["javascript", "typescript"]
title: "JS Tricks, avoiding ifs"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2019-12-16T23:59:59.999Z"
description: "Strategy to replace nested ifs"
---

# Introduction

_There is probably a well-known name for this type of pattern, but the specific term escapes me. Rather than delay the post, I'll proceed without it — apologies for the missing reference._

I was in a telegram group and saw a guy saying:

> I need to make this algorithm without using if. Could someone help me?

The algorithm was basically to get the sex, age and work time to tell if the person could retire or not.
Before I could respond, someone wrote the algorithm using a ternary expression — quite clever, but ultimately a workaround.

This situation reminded me of a BMI algorithm I had to do in college, using Java and it needed to have
low complexity and be easily testable (the subject was about tests). Everyone began writing in a quick, unprincipled manner and produced deeply nested **ifs** to perform the calculations. Taking a step back to think before writing led to the following approach:

1. Create an enum for male and another for female, each containing the minimum and maximum index for that category.
2. Receive the input and perform the calculation normally.
3. With the result, search the enums for the range that satisfies the condition based on the calculated value.

Of course, in Java this becomes quite complex — it ended up spanning about six files for something relatively simple — but all the challenge conditions were met.

Since the title of this post is to avoid **ifs**, let's get to this trick now in JS/TS.

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

This is essentially the same algorithm originally written in Java, now translated to JavaScript in far fewer lines. Let's review it part by part:

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

> But Allan, in that case with multiple ifs, we have an "else" for when it's not met and in your object example there's
> no such thing

A valid point. The input does need to be guarded against invalid cases. A simple guard clause handles this cleanly:

```typescript
if (!parameters.hasOwnProperty(sex)) {
    throw Error("Something right is wrong");
}
// Normal flow of your program here
// It's nice to abort errors first
```

That covers everything. Thank you for your time, see you soon, bye bye
