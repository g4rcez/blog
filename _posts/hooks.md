---
useFolks: true
subjects: ["hooks", "react", "typescript","javascript","frontend"]
title: "React Hooks"
language: "pt-br"
translations: ["pt-br"]
date: "2020-02-02T00:00:00.000Z"
description: "Uma nova forma (nem tão nova) de pensar"
---

Fala galera, beleza? Tem um tempão, mas um tempão mesmo que eu quero escrever sobre hooks e nunca consigo. Acabo lendo muitos artigos sobre e nunca escrevi um pouco da minha visão e algumas das técnicas que tenho adotado.

Sem mais delongas, vamos lá começar a escrever...

## Rule of Hooks.

Antes de começar a ir lá de verdade, vamos deixar anotado as regras dos hooks, que podem ser aplicadas ao seu projeto com eslint através do pacote [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Você poder fazer um `deep dive` na [documentação](https://pt-br.reactjs.org/docs/hooks-rules.html)

1. Use Hooks Apenas no Nível Superior
2. Use Hooks Apenas Dentro de Funções do React

## Mas em classes era assim

Não. Não. De novo, não. A primeira coisa que precisei fazer para ter um bom entendimento de hooks foi parar de pensar em como eu faria as coisas com classes, apesar de ambos os approaches nos entregarem componentes, temos uma diferença enorme entre eles.

Se você já conhece componentes de classes, então esqueça um pouco do ciclo de vida para entender sobre hooks. As vezes acabamos fazendo algumas associações no caso do `useEffect`

-   "O `useEffect` com um array de dependências vazio é igual ao `componentDidMount`"
-   "O `useEffect` com um array de dependências com alguns itens que precisam mudar é igual ao `componentDidMount` e ao `componentDidUpdate`"

Isso é parcialmente verdade, apesar do efeito causado ser o mesmo, não podemos assumir que são a mesma coisa. Um exemplo:

```jsx
// Em caso de uma classe
componentDidMount () {
    console.log("Componente montou")
}

// Com hooks
useEffect(() => {
    console.log("Componente montou")
}, [])

useEffect(() => {
    console.log("Componente montou ou atualizou")
}, [state])
```

Se formos fazer uma rápida associação a classes, nosso componente com hooks possui dois `componentDidMount`? Sim e não.

-   Sim. Pois ao ser montado, ambos efeitos do nosso `useEffect` serão executados
-   Não. Pois o nosso segundo efeito não é executado somente na hora do componente montar, ele será executado sempre que o `state` mudar. Ao montar o componente, o `state` receberá um valor inicial, logo...ele irá mudar e irá triggar nosso evento. Qualquer atualização nele irá fazer o efeito ser executado de novo.

O nosso querido hook `useEffect` apenas reage as mudanças dos seus dependentes.

---

Outro cara que confundimos é o `useState` por conta do método de classes `this.setState()`. Vamos dar uma conferida nos métodos:

```javascript
// updater pode ser um objeto ou uma função
this.setState(updater[, callback])


// demonstração de uso
class Component extends React.Component<never, { name: string }>{
    constructor(props: never) {
        super(props);
        this.state = {
            name: ""
        }
    }

    update = () => {
        this.setState({ name: "Javascript" });
        this.setState(current => {
            return { name: "Typescript" };
        }, () => console.log("Atualizou com Typescript no this.state.name"));
    }
}

```

Importante lembrar que o `this.setState` atualiza seu estado de acordo com o que você retorna para ele, se você possuir 2 propriedades e o seu objeto de atualização possuir somente uma, ele não irá concatenar o estado anterior com o novo estado e nada será perdido.

Agora no nosso amigo `useState` funciona de forma um pouco diferente do `this.setState`. Vamos ver:

```javascript
const [state, setState] = useState("");
// setando diretamente o valor
setState("Nova string");
setState((currentState) => "Nova string com função");
```

Nesse caso é de boa, mas e nesse caso:

```typescript
const [state, setState] = useState<{name:string; age:number}({name: "", age: 0});
// setando diretamente o valor
setState({ name: "Typescript" });
```

Se você fizer isso, a propriedade `age` será perdida e você irá ganhar um undefined, para contornar isso, basta você fazer

```typescript
const [state, setState] = useState<{ name: string; age: number }({ name: "", age: 0 });
// setando diretamente o valor
setState(currentState => ({ ...currentState, name: "Typescript" }));
```

Em minha opinião, o `useState` só é interessante de se utilizar nos seguintes casos:

-   Valores de tipos primários
-   Objetos que são preenchidos em uma única ação

Com o `useState`, podemos compor nosso estado em pequenas partes isoladas e controladas de forma isolada.

> Mas Allan, eu quero manipular meu estado inteiro, como era no this.setState das classes

Bom, se você pensou isso, vou apresentar a você o `useReducer`. Vou apresentar duas formas, a forma tradicional e um custom hook que estou fazendo _(Como eu levo mais de um dia pra escrever alguns artigos, pode ser que ele já esteja no meu git)_.

```typescript
import React, { useReducer } from "react";

const initialState = {
	name: "",
	age: 0,
	points: 0,
	isApproved: false,
};

type Actions =
	| {
			type: "onChangeText";
			text: string;
	  }
	| {
			type: "onChangeCheckbox";
			check: boolean;
	  }
	| {
			type: "onChangeNumber";
			value: number;
			field: "age" | "points";
	  };

type State = typeof initialState;

const reducer = (state: State, actions: Actions): State => {
	if (actions.type === "onChangeText") {
		return { ...state, name: actions.text };
	}
	if (actions.type === "onChangeCheckbox") {
		return { ...state, isApproved: actions.check };
	}
	if (actions.type === "onChangeNumber") {
		return { ...state, [actions.field]: actions.value };
	}
	return state;
};

function Component() {
	const [state, dispatch] = useReducer(reducer, initialState);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, name, type, checked } = e.target;
		if (type === "checkbox") {
			return dispatch({ type: "onChangeCheckbox", check: checked });
		}
		if (type === "number") {
			return dispatch({
				type: "onChangeNumber",
				value: Number.parseFloat(value),
				field: name as "age" | "points",
			});
		}
		return dispatch({ type: "onChangeText", text: value });
	};
}
```

Isso te lembra um pouco do redux? A diferença é que eu não usei `switch/case`. Pra ser sincero, eu não gosto de usar os reducers assim pois quando preciso de alguma lógica para um tipo de `dispatch`, eu tenho um escopo compartilhado entre as outras actions ou então tenho que criar um bloco dentro do `if` ou `switch/case`.

Bom, até aqui eu dei um leve overview de como hooks não são exatamente um `as is` de classes. Daqui pra frente é hora de extrair o poder que hooks nos dá com custom hooks e algumas outras técnicas

## Custom hooks - useReducer

Como falei, essa forma de fazer um useReducer é estranha pra mim, gosto de transformar cada `action` que será despachada em uma função isolada das outras. Abaixo o código do `useReducer` customizado, se o código ficar muito grande, [pode ver o gist](https://gist.github.com/g4rcez/8274b8065e9506b33315baf05eca8645)

```tsx
import React, { useState, useMemo, Fragment } from "react";

// Lembrando pro cara que não pode haver reatribuição
// no estado pois ele é imutável (ou deveria ser)
type Immutable<State> = Partial<Readonly<State>>;

// Inferência dos tipos da função primária
type Infer<
	State,
	Fn extends (...args: never) => (state: State) => Immutable<State>
> = (...args: Parameters<Fn>) => (state: State) => Immutable<State>;

// apenas um utils para extender nos tipos
type ReducerChunk<Actions, State> = {
	[key in keyof Actions]: (args: any) => (state: State) => Immutable<State>;
};

export type Dispatches<State, Actions extends ReducerChunk<Actions, State>> = {
	[key in keyof Actions]: Infer<State, Actions[key]>;
};

const useReducer = <State, Actions extends ReducerChunk<Actions, State>>(
	initialState: State,
	actions: Actions
): [State, Dispatches<State, Actions>] => {
	const [state, setState] = useState(initialState);
	// memoizando as actions para evitar novos objetos
	const dispatches = useMemo(
		() =>
			Object.entries(actions).reduce(
				(acc, [name, dispatch]: [string, any]) => ({
					...acc,
					[name]: (...params: any) => {
						const event = dispatch(...params);
						setState((currentState) => ({
							...currentState,
							...event(...params),
						}));
					},
				}),
				{} as Dispatches<State, Actions>
			),
		[actions]
	);
	return [state, dispatches];
};

type STATE = {
	name: string;
	age: number;
	points: number;
	isApproved: boolean;
};
const initialState: STATE = {
	name: "",
	age: 0,
	points: 0,
	isApproved: false,
};

const App = () => {
	const [state, reducers] = useReducer(initialState as STATE, {
		onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;
			// Se for passar o evento para essa próxima função
			// não se esqueça de usar e.persist()
			// mais informações:
			// https://reactjs.org/docs/events.html#event-pooling
			return (): Partial<STATE> => ({ name: value });
		},
		onChangeNumber: (e: React.ChangeEvent<HTMLInputElement>) => {
			const { name, value } = e.target;
			return (): Partial<STATE> => ({
				[name as "age" | "points"]: Number.parseFloat(value),
			});
		},
		onChangeCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => {
			const { checked } = e.target;
			return (): Partial<STATE> => ({ isApproved: checked });
		},
	});
	return (
		<Fragment>
			<input
				name="name"
				onChange={reducers.onChangeName}
				value={state.name}
			/>
			<input
				type="number"
				name="age"
				onChange={reducers.onChangeNumber}
				value={state.age}
			/>
			<input
				type="number"
				name="points"
				onChange={reducers.onChangeNumber}
				value={state.points}
			/>
			<input
				type="checkbox"
				name="isApproved"
				onChange={reducers.onChangeCheckbox}
				checked={state.isApproved}
			/>
		</Fragment>
	);
};

export default App;
```

Com esse `useReducer` nós podemos criar as funções do nosso componente no próprio `useReducer` e conseguimos inferir todos os tipos corretamente. Cada `type` do `useReducer` original vira uma _property_ no nosso objeto de funções.

> **Sim, o useReducer foi criado com o useState. Não tá errado kkkk**

Como explicado no comentário, o `useMemo` foi utilizado para que não seja recriado um objeto a toda renderização, somente quando as nossas funções mudarem. Uma otimização bem básica é criar o objeto de função fora do componente.

Com esse hook, acabei dando um exemplo bem consistente do `useState` + `useMemo`.

## Lidando com listeners

Um coisa um pouco comum é criar um event listener, seja para um elemento ou até para o nosso objeto `window`. Vou demonstrar um efeito para observar a alteração de tamanho da tela

```typescript
const isClient = typeof window === "object";
const getSize = () => (isClient ? window.innerWidth : 0);

const useWidth = () => {
	const [windowSize, setWindowSize] = useState(getSize);
	useEffect(() => {
		if (!isClient) {
			return;
		}
		const resizeHandler = () => setWindowSize(getSize());
		window.addEventListener("resize", resizeHandler);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowSize;
};

export default useWidth;
```

O `resizeHandler` foi criado dentro do `useEffect` pois o `addEventListener` e o `removeEventListener` precisam da mesma referência para controlar o evento.

Uma coisa importante a falar é o retorno do `useEffect`. Acabei não falando anteriormente, mas o retorno do `useEffect` é executado quando o componente desmonta, efeito similar ao `componentWillUnmount`.

## O que é o useCallback?

O useCallback é quase um `alias` para o `useMemo`, mas somente para funções. Ele garante a mesma referência de funções, evitando que funções no corpo dos nossos componentes de função sejam criadas a cada novo reRender.

## useEffect ou useLayoutEffect?

Bom, os dois são iguais, mas diferentes. O `useLayoutEffect` é executado somente após todas as mutações na DOM. O ideal de seu uso é somente quando você faz mutações com `refs` ou coisas que dependam de elementos no nosso DOM (elementos que não são controlados por React, por exemplo).

## React.forwardRef <3 useImperativeHandler

Quando você precisa passar as referências do seu componente para que irá consumir, o seu componente precisa estar envolvido por um `React.forwardRef` e com o `useImperativeHandler` nós iremos atribuir o valor de `ref` do nosso componente. Simples assim:

```typescript
type Props = {
	ref: {
		focus(): void;
	};
};

const Input: React.FC<Props> = (props, externalRef) => {
	const internalRef = useRef();
	useImperativeHandle(externalRef, () => ({
		focus: () => {
			internalRef.current.focus();
		},
	}));
	return <input {...props} ref={ref} />;
};

export default React.forwardRef(Input);
```

Eu ainda não fiz um uso muito absurdo desses 2 recursos, mas é assim que funciona e é importante você saber que ele existe e um caso de uso.

## Conclusão: vou ficar devendo 2 hooks

Faltou eu apresentar o `useContext` e o `useDebugValue`. O `useDebugValue` eu realmente NUNCA usei graças ao nosso vício de socar `console.log` + `debugger` em tudo. Sei que é um hook que nos ajuda, mas nunca tive necessidade de fazer o uso. 

Agora o `useContext`...Fica tranquilo que eu vou fazer uma experiência bem maneira com ele e escrever um post somente sobre esse hook. Mas já adianto que podemos usar a `ContextAPI` (não a legada, a da versão 16.3) para substituir o uso de Redux em alguns casos.

E é isso pessoal, espero que tenham gostado. Não sei concluir esse post por que ainda queria demonstrar mais alguns casos, mas vamos com calma. Até a próxima.