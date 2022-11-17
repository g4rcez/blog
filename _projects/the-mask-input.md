---
title: The Mask Input
description: "A simple way to create inputs with masked values. Works like <input />, but apply mask for your values."
date: 2022-11-14T12:58:51.317Z
slug: the-mask-input
keywords: ["input","react", "mask", "mask-input"]
npmName: the-mask-input
npmLink: https://www.npmjs.com/package/the-mask-input
---

# How to Install?

```shell
npm install the-mask-input
```

# How can I use it?

You can import the component `<Input />` from `the-mask-input` and start to use

```typescript jsx
import Input from "the-mask-input";

<Input mask="cpf" placeholder="CPF" />
```

<Input mask="cpf" placeholder="CPF" />

# Write your own mask

Using the-mask-input, you can write your own regex, use default tokens or use the default custom masks for brazilian
values.

## Using tokens

- H: accept only hexadecimals - abcdef(upper case and lower case) or 0123456789
- d: only digits - 0123456789
- X: digits and all alphabetical letters(upper case and lower case) - `A-Z`, `a-z` and 0123456789
- x: digits and all alphabetical letters(lower case) - `a-z` and 0123456789
- A: all alphabetical letters(upper case) - `A-Z` and 0123456789
- a: all alphabetical letters(lower case) - `a-z` and 0123456789

```typescript jsx
import Input from "the-mask-input";

const mask = "ddd-AA-HHH";
<Input mask={mask} placeholder="CPF" />
```

<Input mask="ddd-AA-HHH" placeholder="Custom mask" />

Values like `012-AA-af9` and `911-SO-5f3` are okay for this pattern.

## Brazilian values

- cpf: 000.000.000-00
- cnpj: 00.000.000/0000-00
- cpfCnpj: 000.000.000-00 and 00.000.000/0000-00
- cep: 000000-000
- cellphone: (00) 90000-0000
- telephone: (00) 0000-0000
- cellTelephone: (00) 0000-0000 and (00) 90000-0000
- int: accept only integer numbers
- color: #000 and #000000
- creditCard: 0000 0000 0000 0000 0000
- date: dd/MM/yyyy - Default date is brazillian pattern
- isoDate: yyyy/MM/dd
- time: 00:00 - Accept only 0-23 in yours
- uuid: default uuid format

```typescript jsx
import Input from "the-mask-input";

<Input mask="cpf" placeholder="cpf" />;
<Input mask="cnpj" placeholder="cnpj" />;
<Input mask="cpfCnpj" placeholder="cpfCnpj" />;
<Input mask="cep" placeholder="cep" />;
<Input mask="cellphone" placeholder="cellphone" />;
<Input mask="telephone" placeholder="telephone" />;
<Input mask="cellTelephone" placeholder="cellTelephone" />;
<Input mask="int" placeholder="int" />;
<Input mask="color" placeholder="color" />;
<Input mask="creditCard" placeholder="creditCard" />;
<Input mask="date" placeholder="date" />;
<Input mask="isoDate" placeholder="isoDate" />;
<Input mask="time" placeholder="time" />;
<Input mask="uuid" placeholder="uuid" />;
```

<Input mask="cpf" placeholder="cpf"/>
<Input mask="cnpj" placeholder="cnpj"/>
<Input mask="cpfCnpj" placeholder="cpfCnpj"/>
<Input mask="cep" placeholder="cep"/>
<Input mask="cellphone" placeholder="cellphone"/>
<Input mask="telephone" placeholder="telephone"/>
<Input mask="cellTelephone" placeholder="cellTelephone"/>
<Input mask="int" placeholder="int"/>
<Input mask="color" placeholder="color"/>
<Input mask="creditCard" placeholder="creditCard"/>
<Input mask="date" placeholder="date"/>
<Input mask="isoDate" placeholder="isoDate"/>
<Input mask="time" placeholder="time"/>
<Input mask="uuid" placeholder="uuid"/>
