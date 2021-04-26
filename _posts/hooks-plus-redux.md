---
useFolks: true
subjects: ["react", "redux", "frontend","typescript","javascript","hooks"]
title: "Hooks + Redux"
language: "pt-br"
translations: ["pt-br"]
date: "2019-09-29T11:33:00.000Z"
description: "Unido os hooks ao estado global"
---

Desde que saiu a versão estável de Hooks para React, eu vejo muitos artigos com a ideia de **Usando Hooks para eliminar o Redux da sua aplicação**. Alguns desses têm até umas ideias interessantes, mas não é esse o propósito de Hooks, se você quer criar uma biblioteca que substitua o Redux, você deverá estudar ContextAPI e não Hooks.

Estou usando Hooks desde a versão Alpha, e também comecei a usar Redux Hooks em Alpha. **AMBOS EM PRODUÇÃO, PORQUE AQUI É VIDA LOUCA.**

Logo no começo, tive alguma dificuldade em migrar a forma de uso e acabei parando para analisar `Como juntar Hooks com Redux? O ideal seria não precisar do connect, mas também ter a mesma facilidade que ele oferece`. Esse foi o primeiro tradeoff que encarei no uso. Apesar dos Hooks do Redux oferecerem bons Hooks com o `useSelector` e o `useDispatch`, eu não tinha algumas otimizações. A própria documentação do Redux nos dá formas de fazer essas otimizações, porém considero algo um pouco cru, podemos fazer algo mais robusto para trabalhar nas nossas aplicações. Vamos começar com a minha primeira ideia para otimizar isso:

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
				() => (...params) => dispatch(dispatches[fn](...params)),
				[fn]
			),
		};
	}, {});
	return [useSelector(state(states), comparator), memoDispatch];
};

export default useReselect;

// Demonstração de uso

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

Isso quebrou um galhão, mas eu queria entregar algo mais parecido com o approach de classes para um time que estava mais habituado, e iniciando em componentes funcionais + Hooks. Então eu apenas transformei em um objeto o que era um array

```javascript
// useConnect.js - O código acima será reutilizado
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

// Demonstração de uso

const mapStateToProps = (state) => ({
	clients: state.ClientReducer.clients,
});

const mapDispatchToProps = { getClients };

const Component = (externalProps) => {
	const props = useConnect(
		mapStateToProps,
		mapDispatchToProps,
		externalProps
	);
	useEffect(() => {
		props.getClients();
	}, []);
};
```

Agora sim eu tenho um hook que entrega algo mais semelhante a quem está acostumado com classes, porém sem o this. O `useConnect` faz um comportamento bem similar ao do `connect` mas não cria um componente wrapper para passar props da sua store. Show.

## Tá, mas só isso?

Não...

Com os hooks básicos: `useState` e `useEffect`, podemos criar ações que iram abstrair bastante do código e ao invés de entregar um valor de forma mais "mastigada" pra quem consumir os hooks. Dois exemplos que vou mostrar aqui são `Filtrar listas` (com o uso do Redux) e `Exibir o um loading` (sem o uso do Redux).

```javascript
// useClientFilter.js - Filtrar uma lista de clientes, dado uma chave e valor
import { useState, useEffect } from "react";
import useConnect from "./";

const stateToProps = (state) => ({ clients: state.ClientReducer.clients });
const useClientFilter = (key, value) => {
	const props = useConnect(stateToProps, {});
	const [list, setList] = useState(props.clients);

	/* Esse efeito vai executar toda vez que:
        - A lista mudar de tamanho
        - A propriedade key mudar
        - A propriedade value mudar
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

Com esse pequeno hook, ao invés de criar o filtro no componente, podemos usa-lo para abstrair o trabalho e replicar seu uso em diversos componentes, sem repetir código.

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

![Demonstrando o hook de filtro para clientes](/static/hooks-demo.gif) Exemplo cortado :(

Nesse componente, teremos a lista filtrada sempre que o método onChange for executado, pois a regra do nosso `useClientFilter` diz que se o nosso `value` mudar, ele irá executar o callback do `useEffect`;

O segundo exemplo que irei mostrar é para casos onde sua ação não terá impacto na store do seu redux, exceto setar atributos como `loading`. A partir de agora, essas ações você poderá tratar de uma nova forma, usando-as num hook. Dessa forma, cada ação terá um loading próprio e não irá acontecer problemas de o usuário executar uma ação que faça um trigger de `loading` no mesmo reducer.

Vamos fazer um exemplo para inativar clientes e atualizar a lista após o deletar ser efetuado com sucesso.

```javascript
import useConnect from "./hooks";
import { useState } from "react";
const mapStateToProps = () => ({}); //objetos que precisar
const mapDispatchToProps = {}; //ações que precisar

const useDeleteClient = () => {
	const [state, setState] = useState({ loading: false, success: false });
	const callback = (id) => {
		setState({ loading: true, success: false });
		fetch("https://api.awesomeurl.dev/client/" + id, { method: "DELETE" })
			.then((e) => {
				if (e.ok) {
                    setState({ loading: false, success: true });
                    // ações do redux serão realizadas aqui
                    // em caso de sucesso
				} else {
                    setState({ loading: false, success: false });
                    // ações do redux serão realizadas aqui
                    // em caso de falha da requisição
				}
			})
			.catch((e) => {
                setState({ loading: false, success: false });
                // Algum outro erro como de conexão, por exemplo
			});
	};
	return [state, callback];
};
export default useDeleteClient;

// Demonstração

const DeleteClient42Button = () => {
    const [state,callback] = useDeleteClient();
    const delete = () => callback(42);
    if(state.success){
        // Um componente de notificação qualquer
        Notification.show("O cliente 42 foi deletado")
    }
	return (
            <Button
                disabled={state.loading}
                onClick={delete}>
                Deletar o Cliente 42
            </Button>
    )
};
```

E assim podemos ter uma ação com estado próprio, sem a necessidade de criar actions do redux para o controle de fluxo, apenas usando o Hooks.

## Por hoje é só

Era isso que eu queria demonstrar hoje, da próxima vez que ver um artigo **Usando hooks para matar o Redux**, pense bem em como vc pode utilizar as duas tecnologias para os seu próprio bem e que elas não são concorrentes, e sim tecnologias complementares que juntas irão proporcionar uma produtividade maior a você e sua equipe.
