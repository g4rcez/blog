---
useFolks: true
subjects: ["javascript", "tricks", "typescript"]
title: "Criando seu próprio Router"
language: "pt-br"
translations: ["pt-br"]
date: "2021-03-03T18:33:00.000Z"
description: "Desmistificando o conceito por trás do React Router"
---

Fala aí galera, tudo tranquilo? Nesse post eu gostaria de trazer pra vocês uma experiência que tive recriando o [React Router](https://reactrouter.com/).

Como todos sabemos, React Router é quase que a biblioteca oficial para roteamento em React, e quase ninguém conhece alguma alternativa. Durante algumas criações de telas, utilizando [Query String](https://en.wikipedia.org/wiki/Query_string), acabei enfrentando alguns problemas com isso, principalmente em como recuperar meu objeto dado a minha query string.

## TL;DR

[Repositório com o resultado da brincadeira](https://github.com/g4rcez/brouther)

## Definindo o escopo

Eu tive problemas com o meu query string, mas para um router client side, eu precisava de algo que manipulasse o path da URL, controle de histórico e que renderizasse meus componentes de acordo com o path da URL (recebendo IDs, ou parâmetros que compõe a rota). Logo, vamos precisar

- Controle de parâmetros
- Renderização por path
- Controle de query string
- Controle de parâmetros
- Acesso ao history
- Controle de navegação do browser

Agora que temos o que precisamos fazer, vamos analisar o que queremos ter como código final

```jsx
const history = History();
const App = () => (
  <Router history={history}>
    <Route path="/" component={Root} />
    <Route path="/orders/:id" component={ViewOrders} />
    <Route path="/orders/:id/:operation" component={CrudOrders} />
  </Route>
);
```

Esse é o resultado final, agora é só fazer acontecer haha

### <Router />

O Router costuma estar no top level da nossa aplicação, abraçando todos os componentes para que possamos criar `<Route />` diferentes. O `<Router />` é quem entrega a context para nossas rotas e é o responsável por comandar a renderização de cada rota.

Para que possamos fazer o nosso Router, devemos seguir os seguintes passos:

- Criar uma context de [history](https://github.com/ReactTraining/history)\*
- Controlar todos os paths com as rotas recebidas
- Registrar as rotas de acordo com a renderização dos filhos de router

> O pacote history foi utilizado para garantir a consistência entre browsers

Para a nossa context, temos:

```typescript
import { createBrowserHistory } from "history";
import React, { createContext } from "react";

export const History = createBrowserHistory();
export const HistoryContext = createContext({ ...History, params: {} });
```

Com isso, podemos construir de fato o nosso componente `<Router />` que irá entregar nossa context para cada elemento a ser renderizado na tela.

```tsx
import { pathToRegexp } from "path-to-regexp";

// Definição dos tipos para que possamos trabalhar 
type MatchRoute = {
  regex: RegExp;
  path: string;
  component: FC;
  params: Array<{
    name: string;
    prefix: string;
    suffix: string;
    pattern: string;
    modifier: string;
  }>;
};

type RouterProps = {
  notFound: FC;
};

type Render = {
  Component: FC<any>;
  params: { [k: string]: any };
};

export const Router: FC<RouterProps> = ({ children, notFound: NotFound }) => {
  const [location, setLocation] = useState(() => History.location);
  const [pathName, setPathName] = useState(History.location.pathname);


  /* 
  	Esse é o callback que constrói o nosso estado, pegando o children
	e montando as rotas com base no "path" de cada <Route />
  */
  const init = useCallback(() => {
	// Utilizando o Children.toArray, pegamos todos os filhos de nosso <Router/>
	// o .sort() que fazemos é para que as rotas que nâo possuem parâmetros
	// sejam colocadas como prioridade para não atrapalhar a regex dos paths
    const routes = Children.toArray(children).sort((a: any, b: any) => {
      const x: RouteProps = a.props;
      const y: RouteProps = b.props;
      const xHas = x.path.includes(":");
      const yHas = y.path.includes(":");
      if (!xHas || x.path === "/") return -1;
      if (yHas) return 1;
      return 0;
    });

	// Com esse map, nós criamos cada regex para os paths especificados nos
	// componente de rota
    const rules = routes.map((x: any) => {
      const params: any[] = [];
      const regex = pathToRegexp(x.props.path, params);
      return { ...x.props, regex, params };
    });
    return { routes, rules };
  }, [children]);

  // Inicialização do estado através de função
  const controller = useMemo<{
    rules: MatchRoute[];
    routes: any[];
  }>(init, [init]);

  useEffect(() => {
    History.listen((e) => {
      setLocation(e.location);
      setPathName(e.location.pathname);
    });
  }, []);

  /*
	Um memo que cuidará dá renderização e dá obtenção do `params` dado o nosso path atual
	Nele faremos as comparações de rota e definiremos se tal rota existe ou não
  */
  const render = useMemo((): Render => {
    const params: any = {};
	// Early return para a raiz
    if (pathName === "/") {
      const current = controller.routes.find((x) => x.props.path === "/");
      if (current) return { Component: current.props.component, params };
	  // Rota / não foi registrada e será redirecionado para NotFound
      return { Component: NotFound, params };
    }
    const index = controller.rules.findIndex((x) => {
      const exec = x.regex.exec(pathName);
	  // Caso o regex da rota atual não case, retorne false
      if (exec === null) return false;
	  // objeto regex group retornado, podemos capturar os valores num array usando a destrução,
	  // pegando do item 1 em diante.
      const [, ...groups] = exec;
	  // Atribuindo os valores ao params
      groups.forEach((val, i) => {
        const regex = x.params[i].name;
		// um leve roubo para parsear os valores de forma segura
        try {
          params[regex] = JSON.parse(val);
        } catch (error) {
          params[regex] = val;
        }
      });
      return true;
    });
    const current = controller.routes[index];
	// Se o meu current for undefined, a rota não existe e redirecionado para NotFound
    if (current === undefined) {
      return { Component: NotFound, params };
    }
    return { Component: current.props.component, params };
  }, [controller, NotFound, pathName]);

  // history props
  const historyComponent = useMemo(() => ({ ...History, location }), [
    location,
  ]);

  // Nossa context entregue e o router renderizando somente o nosso componente alvo do path
  return (
    <HistoryContext.Provider value={{ ...History, params: render.params }}>
      <render.Component history={historyComponent} />
    </HistoryContext.Provider>
  );
};
```

### <Route />

E com isso temos nosso router, mas ainda falta a nossa forma de criar nosso `<Route/>`

```tsx
type RouteProps = {
  path: string;
  component: FC;
};

export const Route = (props: RouteProps) => {
  const router = useContext(HistoryContext);
  // o any é para que possamos ignorar e injetar as props de history em nossos componentes
  return <props.component {...(router as any)} />;
};
```

### <Link />

Mas também faltou a forma de criar nossos links para caminhar entre as páginas. Para isso, podemos fazer uma componente utilizando o `<a/>` e aproveitar o próprio atributo href, assim temos uma forma acessível e semântica de criar nossos Links.

```jsx
export const Link: React.FC<A> = ({ onClick, state, href, ...props }) => {
  // o callback de click que previne o default do elemento
  const click = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
	  onClick?.(e);
      if (!href.startsWith("http")) {
      	e.preventDefault();
		return History.push(href, state);
	  }
    },
    [onClick, href, state]
  );
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...props} href={href} onClick={click} />;
};
```

E com isso temos nossos elementos necessários para o básico do router. O que nos leva a real motivação do nosso router


### useQS (QueryString)

Nesse ponto, já temos tudo necessário menos a nossa forma de conseguir obter o queryString como objeto. Para isso, vamos utilizar a biblioteca [`query-string`](https://github.com/sindresorhus/query-string#readme). 

> Neste artigo irei usar essa lib para facilitar o código. Mas no código do github eu acabei optando por tentar reproduzir os meus próprios métodos de parse e stringify de query string

Então antes de começar o nosso useQs, devemos instalar a `query-string`:

```bash
yarn add qs
```

*Você pode conferir no [github](https://github.com/g4rcez/brouther/blob/main/src/brouther/use-qs.ts) a implementação do query string.*

Pós instalação, é só partir pro código do nosso hook



```tsx
import { useEffect, useRef, useState } from "react";
import qs from "query-string";
import { History } from "./router";

// Basicamente essa é a função chave que vai pegar o path atual de window.location.href
// e retornar o objeto que está em formato de string após o `?`
const getQs = <T,>(): T => qs.parse<T>(window.location.href);

export const useQueryString = <T extends object>(): T => {
  const qs = useRef(History.location.search);
  const [queryString, setQueryString] = useState<T>(getQs);
  useEffect(() => {
    History.listen((e) => {
      if (e.location.search !== qs.current) {
        qs.current = e.location.search;
        setQueryString(getQs);
      }
    });
  }, []);
  return queryString;
};
```

E assim o nosso `useQs` e `<Router />` estão prontos para serem usados (mas tome cuidado, ainda não vi o comportamento desse router). Mas o que vale aqui é o aprendizado sobre como criar o seu router e ver como os hooks podem ser nossos amigos se bem utilizados.

É isso galera, vou ficando por aqui, e caso você tenha perdido, o [link desse repositório](https://github.com/g4rcez/brouther) para que você possa se aventurar pelo código.