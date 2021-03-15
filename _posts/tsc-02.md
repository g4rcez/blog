---
useFolks: true
subjects: ["typescript", "tricks"]
title: "Typescript 101 - [2]"
language: "pt-br"
translations: ["pt-br"]
date: "2020-04-06T23:29:59.999Z"
description: "Não sei criar tipos pra N objetos, e agora?"
---

Fala aí galera, tranquilos? Eu demorei pra lançar esse artigo pois queria construir algo com bastante tipagem complexa para
conseguir fazer um *deep dive* em TS. Sem mais delongas, vamos lá

### Generics - Inferindo os tipos de qualquer lugar

Generics é uma técnica interessante para que possamos trabalhar com um tipo que atenda a uma todos os tipos que satisfação a
sua condição de uso. Os *generics* vão ser por padrão um tipo não estabelecido e não iterável (significa que você precisará informar
quando um tipo genérico for um Array). 

Beleza, mas quando eu vou usar isso?

```typescript
type Arrays<T> = T[]

const a: Arrays<string> = [];
```

Simples pra você começar a entender. A variável `a` será forçada a ser um array de string. No tipo `Arrays` nós recebemos um genérico através do `<T>` para que possamos operar em um tipo que não conhecemos, mas que será inferido pelo nosso tipo ao receber o seu "alvo".

*Generics* é uma poderosa forma de criar tipos com base nos nossos objetos, arrays ou até em primitivos. Vou fazer alguns exemplos do médio ao avançado para você poder conferir. Lembre-se, você pode usar o [playground](https://www.typescriptlang.org/play/index.html) para fazer testes rápidos ao invés de configurar um arquivo local.

### Utility Types - Readonly

[Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) são tipos builtin do Typescript para que você possa criar seus tipos com uma ajudinha extra. Nessa parte irei falar do tipo readonly. Iremos usa-lo para impedir reatribuição de valores numa função

```typescript
const map = <T>(a: Readonly<T[]>, newValue: T) => {
    // Index signature in type 'readonly T[]' only permits reading
    // Não podemos reatribuir valores do nosso array, graças ao Readonly
    a[0] = newValue
}
```

Você também pode usar o `Readonly` para definir o tipo dos seus objetos como imutáveis e impedir que os mesmos sejam reatribuídos.

```typescript
type User = Readonly<{
    name: string
    birthDate: Date
    skills: string[]
}>

const user: User = {
    name: "Joãozinho",
    birthDate: new Date(),
    skills: ["Contar piadas"]
}

// Error
user.name = "Fuba"
```

E antes que eu esqueça, todos os tipos builtin do *Utility Types* são tipos que fazem o uso de generics.


### Redux Action

Momento de puxar para o lado do React. Se você nunca programou, não tem problema, vou fazer um exemplo bem comum

```typescript
enum ActionsTypes {
    Open = "Action/Open",
    Close = "Action/Close"
}

// Aqui usamos o generics para concatenar com o objeto padrão das actions recebidas no reducer
// Com o `= {}` forçamos que o recebido da nossa função seja um objeto, evitando tipos errados
type Action<T = {}> = { type: ActionsTypes } & T;

const initialState = {
    loading: false,
    user: null,
    authorized: false
}
// O uso do nosso Action<T> fica transparente e facilita na tipagem das ações de nosso reducer
type AuthActions = Action<Partial<{
    login: string,
    mock: null
}>>

const authReducer = (state = initialState, action: AuthActions) => {
    switch (action.type) {
        case ActionsTypes.Close:
            return { ...state, login: "" }
        case ActionsTypes.Open:
            return { ...state, login: action.login }
        default:
            return state
    }
}
```

### Hack PromiseAll

Esse exemplo foi recente. Tive um problema com um `Promise.all` que possuia mais de 10 itens, e sua definição possui suporte somente até 10 itens. Tive que fazer uma *rataria* pra fazer funcionar no meu caso. Mas para isso, tive que obrigar algumas coisas para que a tipagem funcionasse.

> Obs: PromiseLike<T>: O meu tipo poderia ou não ser uma promise. Esse tipo foi retirado da definição oficial de Promise

1. Cada item da minha promise deveria ser readonly para que os tipos pudessem ser tratados como constantes/imutáveis.
2. O array passado para minha função `PromiseAll` deverá ser passado como `as const` para garantir o readonly.
3. Foi usado `...values: ReadonlyPromise<T>[]` e `values[0]` foram usados para "trapacear" a tipagem original, assim como o `as any` no `Promise.all` e após a invocação do método.

Para você não ficar viajando, vou explicar o que é cada tipo antes de você ler o código:

- Unwrap<T>: Esse tipo irá fazer testes no tipo para verificar se o mesmo é uma Promise e o resolve, funcionando mais ou menos como um await
- ReadonlyPromise<T>: Garantindo que o meu tipo seja *Readonly* ou seja um *Readonly* de *PromiseLike*
- Each<T>: Testa se o tipo é da natureza de Array (o ArrayLike não obriga que seja um array, só que o mesmo tenha uma interface de iterável como Array). Se o mesmo for um array, ele irá iterar nos itens e fazer um Unwrap<T[K]>, onde K é o índice no Array

```typescript
interface PromiseLike<T> {
    then<R1 = T, R2 = never>(
        resolve?: ((value: T) => R1) | undefined | null,
        reject?: ((reason: any) => R2) | undefined | null
    ): PromiseLike<R1 | R2>;
}

type Unwrap<T> =
    T extends Promise<infer U> ? U :
    T extends (...args: any) => Promise<infer U> ? U :
    T extends (...args: any) => infer U ? U :
    T

type ReadonlyPromise<T> = Readonly<T> | Readonly<PromiseLike<T>>;

type Each<T> = T extends ArrayLike<any> ? {
    [K in keyof T]: Unwrap<T[K]>
} : T

const PromiseAll = async <T>(...values: ReadonlyPromise<T>[]): Promise<Each<T>> =>
    Promise.all(values[0] as any) as any

const promise = new Promise<string>(res => res("ok"))

// experimente mexer no array para verificar os tipos de promise sendo resolvidas
const a = [promise, 1, promise, promise, promise, promise, promise, () => { }] as const;

PromiseAll([promise, promise, 1]).then(e => {
    const f = e[1] // experimente trocar o índice para verificar os tipos
    console.log(e, f)
})
```
