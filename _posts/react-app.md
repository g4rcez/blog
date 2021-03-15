---
useFolks: true
subjects: ["react", "typescript", "frontend", "tricks","hooks"]
title: "MultiTenants, controle de acesso e Code Splitting"
language: "pt-br"
translations: ["pt-br"]
date: "2019-11-20T20:29:59.999Z"
description: "Entendendo as técnicas para um frontend dinâmico e com controle de acesso"
---

Minha última experiência tem sido bastante peculiar. Acabei tendo de usar/desenvolver:

-   Hooks (agora é padrão)
-   Redux (de forma dinâmica)
-   Code Splitting
-   ErrorBoundary (controle de erros, React)
-   Roteamento dinâmico
-   Controle de acesso

Ficou bastante coisa, um pouco complexo e com certeza um caso de over engineering, mas foi a forma
que mais fez sentido e a que na minha cabeça ficou da melhor forma.

Vamos por parte explicando o setup, mas se quiser ver o resultado, é só [ir lá no meu github](https://github.com/g4rcez/react-app-multitenant).

### create-react-app

Como é um projeto em React, utilizaremos o `create-react-app`, a forma mais simples de começar um projeto React

**Lembrando que Typescript é opcional, então pode omitir a flag --typescript**

```bash
create-react-app react-app-multitenant --typescript
```

Como esse projeto é um _fork_ da empresa, então o exemplo no git está com `eject`, mas isso não é obrigatório e não vai interferir muito para você. Caso queira utilizar o import absoluto por dentro do seu projeto, você pode utilizar essa mesma configuração do github que já está tudo certo. Vale lembrar também que o build desse projeto está gerando os arquivos sem o hash para evitar cachê.

### Menu, Rotas e Code Splitting

A criação do menu, das rotas e a técnica de code splitting ficaram quase que atreladas ao mesmo objeto. Olhando o [menu.ts](https://github.com/g4rcez/react-app-multitenant/blob/master/src/model/menu.ts) você irá ver uma property no objeto chamada `component` que é uma função `(profile: string, tenant?: string) => Promise<any>`. Melhor observar a tipagem dos meus itens do menu:

```typescript
/*
    O menu é constituído de um item principal que pode ou não ter sub itens.
    A property component é onde iremos fazer o import() para fazer funcionar
    o code splitting. Nele dizemos o componente e a rota (property path) que
    iremos renderizar para o usuário
*/
export type MenuItem = {
	component?: (profile: string, tenant?: string) => Promise<any>;
	key: string;
	path: string;
	icon: string;
	title: string;
	tenants: string[];
	subItems: MenuSubItem[];
	tenantEnv?: string;
	allowedProfiles: string[];
};

// Um sub item não pode ter sub itens, então iremos omitir este tipo
export type MenuSubItem = Omit<MenuItem, "subItems">;
```

Bom, mas porque `component` é uma função que recebe `profile` e `tenant`? Esses parâmetros são para que nós possamos construir o path do nosso componente de acordo com o perfil logado e o tenant acessado, assim iremos conseguir acessar nosso componente no diretório referente ao tenant e o arquivo de acordo com o perfil, por exemplo `../modules/users/xpto/admin.page`.

Com isso, temos parte do nosso code splitting funcionando, agora precisamos de um pouco de código para a criação das nossas rotas e o Suspense para o lazy loading dos componentes.

Para definir as rotas de forma dinâmica, dado um tenant e um perfil logado, [foi necessário um hook](https://github.com/g4rcez/react-app-multitenant/blob/master/src/hooks/useRoutesByProfile.ts)

```typescript
// Apenas um tipo para forçar o array de rotas ter os itens necessários para o react-router
export type RouterConstruct = {
	path: string;
	component: React.LazyExoticComponent<React.ComponentType<any>>;
};

// Aplicar o tenant como um caminho
const path = (tenant: string) => `/${tenant}/`;

// Verificar se o Item ou SubItem possuem uma property component e retornar o componente + rota
const getComponentInfo = (item: MenuSubItem, aliasProfile: string) => {
	if (!!item.component) {
		const localImport = item.component(aliasProfile, path(TENANT));
		return { path: item.path, component: lazy(() => localImport) };
	}
	return null;
};

const getProfileRoutes = (filterRoutes: MenuItem[], aliasProfile: string) => {
	// Essa é a minha lista com as rotas aplicadas no react-router
	const localRoutes = [] as RouterConstruct[];
	filterRoutes.forEach((route) => {
		const component = getComponentInfo(route, aliasProfile);
		if (route.path !== "" && component !== null) {
			localRoutes.push(component);
		}
		route.subItems.forEach((subRoute) => {
			const subComponent = getComponentInfo(subRoute, aliasProfile);
			if (subComponent !== null) {
				localRoutes.push(subComponent);
			}
		});
	});
	return localRoutes;
};

const useRoutesByProfile = () => {
	const filterRoutes = useRouteFilter();
	const [routes, setRoutes] = useState([] as RouterConstruct[]);
	/* 
        Toda vez que o filtro de rotas, dado o perfil e tenant mudar,
        execute a criação de rotas novamente
    */
	useEffect(() => {
		const user = getAuthUser();
		if (!isEmpty(user)) {
			setRoutes(getProfileRoutes(MenuItems, user.perfil));
		}
	}, [filterRoutes]);
	return routes;
};

export default useRoutesByProfile;
```

Quase tudo ok, agora só dizer ao `react-router` quais são as nossas rotas, aplicar o suspense

```jsx
const createRoute = (x: RouterConstruct) => (
	<Route exact key={x.path} path={x.path} component={x.component} />
);

const AppRouter = () => {
	// Autenticação requerida em toda a aplicação
	useAuth();

	// Hook para roteamento dinâmico
	const routes = useRoutesByProfile();

	return (
		<Router history={History}>
			{/*
                Error Boundary para caso hajam erros de importação dinâmicas e outros
                relacionado ao ciclo de vida do react (mais funcional em prod)
            */}
			<ErrorBoundary>
				{/*
                    Este componente você pode ver no github, mas é basicamente um wrapper
                    para o React.Suspense com um loader customizado
                */}
				<SuspenseLoader>
					<HashRouter>
						<Switch>
							{/*
                            Mapeamento das rotas dinâmicas de acordo com os dados do nosso hook
                        */}
							{routes.map(createRoute)}
							<Route component={NotFound} />
						</Switch>
					</HashRouter>
				</SuspenseLoader>
			</ErrorBoundary>
		</Router>
	);
};
```

Feito isso, nosso controle de rotas está totalmente pronto, com as regras de Tenant e perfil aplicadas. Para fazer o funcionamento correto, você precisa fazer o `import()` para o path correto e ter uma estrutura de pastas de acordo com os tenants e perfis disponíveis.

```typescript
./src/modules
├── dashboard
│   ├── abcd
│   │   └── admin.page.tsx
│   ├── xkcb
│   │   └── admin.page.tsx
│   └── xpto
│       └── admin.page.tsx
└── users
    └── index.page.tsx
```

E como faria caso não tenha perfil ou tenant específico? Apenas troque o import para o path exato do seu arquivo. Como a chamada do componente é uma função de dois parâmetros, você pode escolher por não utilizar e apenas retornar a string exata do seu componente.

Dessa forma, o seu frontend já está apto para trabalhar com code splitting. Deixo abaixo apenas um _hack_ para caso seus assets estejam sendo servidos de um subdomínio diferente do qual o site está sendo acessado

```typescript
const isDev = process.env.NODE_ENV === "development";

/*
    URL de acesso dos assets do frontend, diferente do qual você acessa.
    site: https://app.xpto.io/
*/
export const URL_ACCESS = `https://xpto-industries.io/${TENANT}/dashboard/${VERSION}/`;

export declare let __webpack_public_path__: string;

if (!isDev) {
	/*
		Define onde o webpack irá fazer o load dos `chunks` com dynamic import
	*/
	__webpack_public_path__ = URL_ACCESS;
}
```

### Redux dinâmico

Se vamos modularizar a aplicação, a parte do redux também precisa ser modularizada. Nossa _store_ deverá ter métodos
de injetar os reducers de acordo com a tela que estão sendo acessados, e substituir o atual estado do reducer pelo novo estado com os novos reducers injetados. Tomei como base a resposta do [Dan Abramov no StackOverflow](https://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application/33044701#33044701), e fiz algumas adaptações para Typescript e utilizando hooks. Você pode observar a forma de como criar uma store com suporte a injeção de novos reducers

```typescript
type Middleware = StoreEnhancer<
	{
		dispatch: unknown;
	},
	{}
>;

export type AsyncStore = Store<unknown, AnyAction> & {
	dispatch: unknown;
	asyncReducers: {
		[key: string]: Reducer<unknown, any>;
	};
	injectReducer: (key: string, reducer: Reducer<any>) => AsyncStore;
};

const redux = (asyncReducers: any = {}) =>
	combineReducers({
		// reducer de autenticação
		[ReducersAlias.AuthReducer]: authReducer,
		...asyncReducers,
	});

/*
    Inicializar a store com os middlewares necessários sendo passados
    como parâmetro.
    Note que o `redux()` é uma função que pode receber ou não os reducers
    assíncronos.
    Após inserir-los na store, um .replaceReducer é invocado com os novos 
    reducers e o novo estado já está pronto para ser utilizado
*/
const initializeStore = (middleware: Middleware) => {
	const store = createStore(redux(), middleware) as AsyncStore;

	store.asyncReducers = {};

	store.injectReducer = (key: string, reducer: Reducer<unknown, any>) => {
		store.asyncReducers[key] = reducer;
		store.replaceReducer(redux(store.asyncReducers));
		return store;
	};

	return store;
};

// src/index.tsx - Onde iremos criar nosso wraper do estado do Redux

const sagasMiddleware = reduxSaga();
const middlewares = applyMiddleware(sagasMiddleware, logger);
const reduxStore = store(middlewares);
sagasMiddleware.run(sagasActions);

ReactDOM.render(
	<StrictMode>
		<Provider store={reduxStore}>
			<AppRouter />
		</Provider>
	</StrictMode>,
	document.getElementById("root")
);
```

Isso é o primeiro passo para a construção da store com injeção de reducers assíncronos. Agora só nos resta criar uma forma de injetar os nossos reducers logo que nosso componente for carregado e precisar fazer o acesso

```typescript
import { useEffect } from "react";
import { Reducer } from "redux";
import { useStore } from "react-redux";

// Essa é a store cujo o código foi mostrado anteriormente
import { AsyncStore } from "@/store";

/*
    Uma modificação legal a ser feita é mudar o método injectReducer
    para receber um array `key: reducer` e poder acrescentar mais de
    um reducer na nossa store
*/
const useInjectReducer = (key: string, reducer: Reducer<any>) => {
	const store = useStore() as AsyncStore;

	useEffect(() => {
		store.injectReducer(key, reducer);
	}, []);
};
```

E isso é tudo. Na hora de importar seu reducer, não esqueça de definir o estado inicial para o primeiro render não quebrar, pois nele não existirá o seu reducer ainda. E com isso os reducers serão acrescentados dinâmicamente ao nosso app.

### Planejamento futuro

1. Uma coisa que ainda estou testando é fazer a inserção de actions no sagas dinamicamente, seguindo a mesma lógica de um reducer dinâmico, com isso, removeremos todos os assets estáticos do nosso código, e apenas quando o usuário interagir com um módulo da aplicação ele será "ativado".

2. Suporte a SSR. Apesar de resolver o problema, essa solução é falha quando se trabalha com SSR pois o React Lazy/Suspense não dão suporte, então será necessário trocar a forma de fazer o code splitting para uma biblioteca que dê tal suporte

3. Realizar testes de performance na aplicação. Como estou mudando a store em alguns renders, é possível que isso apresente lentidões futuras. Será preciso testar

### Conclusão

Apesar de parecer muito código, depois que se entende o que deve fazer, tudo fica bem mais claro. A experiência de desenvolvimento com essa prática tem sido bem aceitável, apenas alguns glitches acontecem quando algum componente é atualizado e a tela fica branca, mas nada que fosse realmente impactar.

Se você precisa de uma aplicação que seja modularizada, algo próximo de um micro frontend, essa é uma prática que pode ajudar. Apesar de tudo o que foi feito aqui ter sido com React, creio que o mindset funcione para qualquer outro framework, apenas suas ferramentas serão diferentes.

O over engineering foi aceito para tal solução, infelizmente ainda não vi uma forma de reduzir a quantidade absurda de voltas e alguns boilerplates que isso requer, mas é um preço a se pagar dado a necessidade.

E é isso galerinha, espero que isso possa ajudar você a dar uma clareada na mente e fique como material de pesquisa. Quaisquer problemas, posta uma issue lá no repositório que a gente troca uma ideia xD

### Referências

-   [Dynamic Redux](https://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application/33044701#33044701)
-   [Code Splitting](https://reactjs.org/docs/code-splitting.html)
-   [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/)
