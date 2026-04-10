---
level: 0
subjects: ["typescript", "nodejs"]
title: "GraphQL"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2021-06-07T23:20:20.492Z"
description: "The REST 'killer' or just another hype?"
---

# Introduction

[GraphQL](https://graphql.org/) is a technology that has generated considerable hype. It proposes to solve data centralization problems, empowers clients to request only the data they need, and ships with a [_schema_](https://graphql.org/learn/schema/) that serves as built-in documentation for delivered types.

> Personal note: GraphQL was discovered in 2017, and it has yet to be implemented at scale in a widely-used production system — but the pursuit continues.

# What is graphql?

GraphQL is a query language that allows data consumers to make queries with the data they want to receive. The server creates _schemas_ that define the queries made. Each _schema_ provides means for you to access data from objects delivered by the server.

Check out this schema example:

```graphql
query {
  hero {
    name
    appearsIn
  }
}
```

An example directly from the graphql site, with the small change of adding `query`. This query above is really a `query`, similar to `GET` from `REST`, an option to get resources given the information of specified objects. In this example, we have the `hero` object with attributes `name` and `appearsIn`. However, what are these object properties? How can we define or investigate what type will be returned?

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

With that context, the query becomes clearer. Let's break it down:

- `enum Episode`: This is a special type that defines possible values for a given field. You've probably heard of [enum in Typescript](https://www.typescriptlang.org/docs/handbook/enums.html)
- `type Character`: Definition of our object's type, in this case, we'll call it **Character**
- `name: String`: definition of the name property of type _String_, belonging to the group of _scalar types_. Which are the primary types for building other types
- `name: String!`: The `!` in GraphQL — known as the **bang operator** — means NonNullable, i.e., the value cannot be null.
- `appearsIn: [Episode!]!`: The `[]` notation means an array/list of `Episode` types. The `!` appearing twice refers to a non-null array and a non-null `Episode`.

# [Scalar Types](https://graphql.org/learn/schema/#scalar-types)

As mentioned above, [scalar types](https://graphql.org/learn/schema/#scalar-types) can be classified as "primitives" for you to write other types. In total, there are 4 scalar types:

- Int: 32-bit integers
- Float: double precision floating point numbers. Javascript's `number`. [IEEE_754](https://en.wikipedia.org/wiki/IEEE_754) definition
- String: Character sequence in [UTF-8](https://datatracker.ietf.org/doc/html/rfc3629) encoding
- Boolean: `true` or `false`.

You can also extend the possibility of scalar types with the `scalar` keyword. But that's a topic for a specific post on graphql implementation.

# [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) killer

**The short answer is: no.**

GraphQL and REST shouldn't be considered "adversaries", in my opinion. GraphQL is a very cool technology, that brings several gains to your life as a dev, but brings many other problems. Maybe even more problems than benefits. Here are some viewpoints to consider:

- **One more layer of abstraction**: That's right, graphql adds another layer between your data and your application logic. This may not be taken into account much because we use frameworks that abstract this, but don't forget, the abstraction is in the framework.
- **Implementation quality**: Still about adding a layer, we have the problem of graphql implementation in the language you use. It's necessary to apply a parser to the string you receive as a query, transform the string into a *parseable schema* by the algorithm so that this algorithm transforms all of this into objects in your target language.
- **Data consistency**: The principle of graphql is to create a language between APIs, so that you can aggregate and centralize information searches for your clients to consume more easily. But what if one of the APIs updates and you don't update your *schema* or your way of getting this data? There will be problems, right?!
- **Authorization and authentication**: Despite being on the server, graphql only aggregates data from other places and formats them in the *schema*. But what if the client tries to access a resource they shouldn't? Who will say they shouldn't? The graphql or the API that will be consumed? And the error return for this client? These questions are a bit cloudy and can cause doubts in implementation
- **Backward compatibility**: This is almost a universal problem, but in REST we can solve it with API versioning, but in graphql it can be a bit laborious to version *schemas*. Although there's `@deprecated`, it can still be a problem if you cut some points of your schema

# Conclusion

GraphQL is undoubtedly a great technology that we can use in our daily lives. No matter the language, you'll have a graphql implementation. [Just look at this list](https://graphql.org/code/). As I said before, it doesn't make sense to compare Rest and GraphQL because both propose to solve the data delivery problem with different *approaches*, bringing their own benefits and problems.

It is well worth studying this technology, running proofs of concept, and evaluating whether it is the right fit for a given architecture. Thank you for your time, see you soon, bye bye
