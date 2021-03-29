---
useFolks: true
subjects: ["javascript", "tricks", "typescript", "react", "hooks"]
title: "Controle de estado"
language: "pt-br"
translations: ["pt-br"]
date: "2021-03-23T23:00:00.000Z"
description: "Indo além do useState"
---

Há tempos temos os hooks e ainda assim estamos aprendendo e melhorando o approach de "estado funcional" dentro do React. E hoje venho trazer duas formas de tratar estado com hooks.

O primeiro approach é uma tentativa de utilizar somente um custom hook para manipular o seu componente, sendo o hook o responsável por controlar todo o estado do componente. Neste approach teríamos `useState`, `useMemo`, `useEffect` e `useCallback`. Além dos hooks customizados se você precisar manipular DOM, history ou qualquer outro objeto necessário.

Já o segundo approach é uma abordagem criando um hook que recebe um estado inicial e funções para atualização do estado. Neste caso, passaríamos apenas o estado inicial, as funções e as props do componente. Para este approach eu irei usar o hook [use-typed-reducer](https://www.npmjs.com/package/use-typed-reducer).

### useHook

Nosso primeiro caso consiste em passar hooks como props para nossos componentes. Isso mesmo, props com hooks. Mas para isso, precisamos seguir as regras dos hooks, logo, nossas variáveis precisarão ter o prefixo `use` e o resto do nome em `camelCase`.

```tsx
type State = {
  id: string;
};

type Props = {
  useStateManager: () => State;
};
```

O código acima é um pequeno exemplo da declaração dos tipos do nosso componente. Como comentado anteriormente, devemos seguir a regra dos hooks para conseguir utilizar esse pattern. Respeitando essa regra, todo o fluxo do código pode ser seguido normalmente, como é o caso do exemplo abaixo:

```tsx
import React, { useEffect, useState } from "react";
import "./App.css";

const Counter = ({ useHook }: { useHook: () => number }) => {
  const [count, actions] = useHook();

  return (
    <button onClick={actions.reset} style={{ fontWeight: "bolder" }}>
      {count}
    </button>
  );
};

const useCounterPlus = () => {
  const [state, setState] = useState(0);
  useEffect(() => {
    setInterval(() => setState((p) => p + 1), 2000);
  }, []);

  const actions = useMemo(
    () => ({
      reset: () => setState(0),
      set: setState,
    }),
    []
  );

  return [state];
};

function App() {
  return (
    <div className="App">
      <Counter useHook={useCounterPlus} />
      <br />
      <Counter useHook={useCounterPlusPlus} />
    </div>
  );
}
```

Para manter tudo familiar, fiz um pequeno exemplo do `useCounterPlus` retornando uma tupla (ou array de dois valores), assim como é no `useReducer`. Para simplificar código e evitar o _destruct_ de parâmetros, optei por usar o `useMemo`. Algumas considerações para esse approach:

- Sempre que possível, deve-se utilizar o `useState` como função para obter sempre o último valor do estado. Utilizando como função você irá evitar observar a variável state, matando a necessidade de haver várias execuções do `useEffect` e várias recriações do nosso `useMemo`.
- O formato de tupla + `useMemo` só foi utilizado para trazer mais clareza no uso
- Também pode-se utilizar o approach de múltiplos useCallback para as funções, e na hora do uso, fazer o destruct do objeto de ações. _O que deixa o código mais sujo na minha opinião_

```tsx
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import "./App.css";

type UseHook = () => [
  number,
  { set: Dispatch<SetStateAction<S>>; reset: () => void }
];

const Counter = ({ useHook }: { useHook: () => number }) => {
  const [count, actions] = useHook();

  return (
    <button onClick={actions.reset} style={{ fontWeight: "bolder" }}>
      {count}
    </button>
  );
};

const useCounterPlus = () => {
  const [state, setState] = useState(0);
  useEffect(() => {
    setInterval(() => setState((p) => p + 1), 2000);
  }, []);

  const actions = useMemo(
    () => ({
      reset: () => setState(0),
      set: setState,
    }),
    []
  );

  return [state, actions];
};

function App() {
  return (
    <div className="App">
      <Counter useHook={useCounterPlus} />
    </div>
  );
}
```

Esse padrão é bastante interessante, mas pode gerar alguns problemas com os `useCallbacks` e as dependências do estado e props.

Para evitar esses problemas, temos o segundo padrão que foi uma adaptação da primeira sugestão, utilizando o [use-typed-reducer](https://www.npmjs.com/package/use-typed-reducer).

### [use-typed-reducer](https://www.npmjs.com/package/use-typed-reducer).

Esse projeto foi uma adaptação com tipos para usar o `useReducer`, mas ao invés de ter usar `switch-case` com o `type` das `actions` despachadas, utilizamos funções como `dispatch` e assim garantimos o uso correto com todos os tipos de entrada da função.

Para o problemas das props, o `use-typed-reducer` tem uma segunda função chamada `useReducerWithProps` que recebe 3 argumentos:

- Estado inicial
- As props do componente
- O objeto com os reducers

Para evitar alguns problemas com as props que podem mudar N vezes, o `useReducerWithProps` possui uma função que retorna as props atuais. Vamos conferir um caso de como ficaria o nosso código:

```tsx
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useTypedReducer } from "use-typed-reducer";

const initialState = {
  counter: 0,
};

type State = typeof State;

type Reducers = {
  // o any nesse caso é por que não importa o retorno
  // já que o useTypedReducer vai converter para o esquema de função 
  reset: UseReducer.Reducer<State, () => any>; 
  onChange: UseReducer.Reducer<
    State,
    (e: React.ChangeEvent<HTMLInputElement>) => any
  >;
  increment: UseReducer.Reducer<State, () => any>;
};

const reducers: Reducers = {
  reset: () => (state) => ({ ...state, counter: 0 }),
  increment: () => (state) => ({ ...state, counter: state.counter + 1 }),
};

const Counter = ({ dispatch, count }: { dispatch: Reducers; count: number }) => {
  return (
    <button onClick={dispatch.reset} style={{ fontWeight: "bolder" }}>
      {count}
    </button>
  );
};

function App() {
  const [state, dispatch] = useTypedReducer(initialState, reducers);

  useEffect(() => {
    setInterval(dispatch.increment, 2000);
  }, []);

  return (
    <div className="App">
      <Counter useHook={dispatch} count={state.counter} />
    </div>
  );
}
```

Com o `useTypedReducer` conseguimos trazer um código mais conciso e nos permitindo passa o `initialState` e os nossos `reducers` de forma dinâmica, assim também permitindo flexibilidade de comportamento.


### Conclusão

Não há um melhor jeito de se abordar estados complexos, certos casos onde existem estados globais, você poderá optar por ContextAPI, Redux, Jotai, Mobx e vários outros, mas para estados locais, é sempre bom optar pela simplicidade e flexibilidade para ajudar na hora da manutenção ou quando existir uma nova feature a ser criada.

Atualmente tenho adotado a abordagem do use-typed-reducer por trazer um ecossistema forte de tipos e uma flexibilidade maior. E a partir de agora, qual será a sua abordagem na hora de controlar o estado local?