---
title: "Estado global, local ou no navegador?"
level: 2
subjects: [ "typescript", "javascript", "react" ]
language: "pt-br"
translations: [ "pt-br", "en-us" ]
date: "2023-09-05T01:00:00.000Z"
description: "O estado é responsabilidade do componente local, global ou do browser? Conheça as diversas formas de armazenamento de estado"
---

O controle de estado é um debate bem comum no meio frontend. Tendo tantas formas de se controlar, você pode acabar
caindo em armadilhas de ter muitas opções, afinal de contas é para ser um estado local, global ou delegar a
responsabilidade para o navegador?

A resposta é bem simples...**depende**.

# Tipos de estado

Para evitar confusões, vamos dar nomes aos estados e definir o escopo. Nesse post iremos abordar os estados dentro de
aplicações React, onde podemos ter estados sendo manipulados de diversas fontes.

## Estado local

O estado local é a forma mais simples de controle de estado no universo React. Com ele é possível manter uma lógica
simples, prática e bem próxima do seu componente.

Seja um componente de classe utilizando o `this.setState` ou então os hooks de controle de estado `useState`
e `useReducer`. Como os componentes de classes estão quase que em total esquecimento, vamos focar nos componentes
funcionais que possuem controle de estado através dos hooks.

### useState

O estado local é uma forma bem efetiva e clara de manipular seu estado. Utilizando o hook `useState` você tem uma tupla
muito bem definida, `[estado, controladorDoEstado]`. Podendo manipular quaisquer valores, o `useState` é a forma mais
simples com os hooks, dando a você o poder de atualizar diretamente o seu valor, seja ele um primitivo como `string`
ou `number`, ou então algum objeto mais complexo como uma lista de usuários ou um objeto que virá de um request na API.

Mas não se engane, nem tudo são flores. O `useState` pode pregar peças com você caso faça uma atualização de estado
incorreta ou comece a usar vários `useState` no seu componente. Se liga nessas situações

1. ***Atualização de estado com base no estado atual***. Essa é uma prática bem comum, mas não se engane...você pode
   acabar caindo numa armadilha e reproduzir o seguinte cenário:

```typescript jsx
// 🚨 Não faça dessa forma...
function App() {
    const [count, setCount] = useState(0)
    return (
        <button onClick={() => setCount(count + 1)}>{count}</button>
    );
}
```

Para um cenário simples isso com certeza irá funcionar. Em casos mais complexos como formulários e listas isso pode não
funcionar corretamente e ocasionar em bugs. Para auxiliar essas atualizações com base no estado anterior, o useState
entrega uma função que pode receber tanto o seu valor puro ou uma função que precisa retornar o novo valor.

```typescript jsx
// ✅ Faça dessa forma
function App() {
    const [count, setCount] = useState(0)
    return (
        <button onClick={() => setCount((p) => p + 1)}>{count}</button>
    );
}
```

Seja o valor puro ou uma função que retorne esse valor, a função que atualiza o estado saberá interpretar corretamente e
atualizar o estado com o novo valor passado. A forma de função serve exatamente para te auxiliar na atualização do
estado com base no valor anterior, isso é bem útil para situações como a seguinte:

```typescript jsx
const [count, setCount] = useState(0)
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

O resultado será 1 devido
às [atualizações em lote ou batch updates](https://react.dev/learn/queueing-a-series-of-state-updates#react-batches-state-updates).
Este é o comportamento esperado do React em relação à atualização do estado. E exatamente por isso que é importante utilizar a
atualização de estado da forma de função e não pegando diretamente o valor do estado atual.

2. ***Referências e referências***

Como tudo no React é a base de referências, para controle de estado não poderia ser diferente. Você tem que lembrar que
as atualizações de estado são baseadas na seguinte lógica:

- *Valor do tipo primitivo*: números, strings, booleanos, undefined, null...
- *Referência do objeto*: Date, object, Array, File...

Mas por que para tipos primitivos o React utiliza valores e para objetos ele utiliza a referência? A base de comparação
do React é um método bem conhecido,
o [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Seu
funcionamento é semelhante ao funcionamento do operador strict
equal `===`. Abaixo podemos observar como ele funciona

```typescript
Object.is(1, 1) // true
Object.is("1", 1) // false
Object.is([], []) // false
Object.is({}, {}) // false
const object = {}
const other = object
Object.is(object, other) // true
```

Como foi falado...tudo são **referências**. O algoritmo do `Object.is` olha para a referência dos objetos, e somente
quando ela é diferente que o React vai causar a atualização de estado. Devido a essa regra, o exemplo abaixo não causa
atualização de estado

```typescript jsx
// 🚨  Não faça isso
const [user, setUser] = useState({name: ""});
user.name = "Fulano";
```

Como a referência de `user` permanece a mesma, não será realizada nenhuma atualização de estado. Caso você realmente
queira atualizar o estado, você pode fazer das seguintes formas:

```typescript jsx
// ✅  Faça dessa forma
const [user, setUser] = useState({name: ""});
// Quando você possui apenas uma chave no objeto
setUser({name: "Fulano"});
// Quando você possui um objeto com várias chaves
setUser((prev) => ({...prev, name: "Fulano"}));
```

Olhando para a segunda opção você pode estar se perguntando:
> Assim eu vou estar recriando os objetos dentro do meu estado anterior, certo?

É uma ótima pergunta e a resposta é não.
O [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) faz
um [shallow copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy) e isso preserva a referência dos
objetos e listas que existirem no seu estado.

### useReducer

O `useState` é bem efetivo na manipulação, mas em alguns casos pode não trazer a clareza de código desejada ou a forma
mais efetiva de atualizar os estados. E é nessa hora que você pode recorrer ao `useReducer`, uma forma sofisticada de
atualizar o seu estado com base na lógica
do [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce), onde você
possui apenas uma função de atualização do estado e
essa função recebe o estado anterior e os novos valores para retornar o estado atualizado. Meio complexo? Vamos
exemplificar com código

```typescript jsx
type State = { name: string; age: number };
type Action = { type: "cadastro", name: string } | { type: "aniversario" }
const reducer = (state: State, action: Action) => {
    if (action.type === "cadastro") return {...state, name: action.name}
    if (action.type === "aniversario") return {...state, age: state.age + 1}
    return state;
}
const [state, dispatch] = useReducer();
dispatch({type: "cadastro", name: "Fulano"});
dispatch({type: "aniversario"});
```

Agora ficou mais claro a forma de utilizar o `useReducer`. E vale lembrar que a sua função reducer deve ser uma função
pura, ou seja, ela não pode ter efeitos colaterais fora do seu escopo, coisas como alteração do DOM, salvar em
localStorage ou afins.

Olhando assim o `useReducer` parece ter mais problemas do que o `useState`, mas seu ganho é a organização via
atualizações baseadas em ações/eventos e o fato de concentrar todas as lógicas de atualização num único setor do código.

> Também não sou muito fã de utilizar o `useReducer`, por isso criei a
> biblioteca [use-typed-reducer](https://github.com/g4rcez/use-typed-reducer) com o intuito de ter uma forma mais
> simples
> e fortemente tipada para os dispatchers. Com a adição de algumas funcionalidades como middlewares e formas de obter as
> props atualizadas a cada dispatch.

## Estado global

Esse é possivelmente o tipo de estado que mais gera discussões e diferentes implementações. Apenas para você ter noção,
temos as seguintes formas de ter estado global numa aplicação

- [ContextAPI](https://react.dev/reference/react/createContext): funcionalidade nativa do React para estado global
- [React-Redux](https://redux.js.org/): uma das maiores e mais antigas bibliotecas para controle de estado do React
- [Zustand](https://github.com/pmndrs/zustand): forma simples e efetiva de trabalhar com estados via funções seletoras
  para evitar rerender
- [Valtio](https://github.com/pmndrs/valtio): atualizações de estado via atualização granular, procurando otimizar as
  propriedades do objeto
- [Recoil](https://recoiljs.org/): biblioteca do Facebook/Meta para controle de estado via átomos, ou seja, pequenas
  peças de estado
- [Jotai](https://github.com/pmndrs/jotai): similar ao recoil, porém com muito mais funcionalidades para trabalhar com
  os átomos
- [Preact-react-signals](https://github.com/preactjs/signals/tree/main/packages/react): uma forma de controle de estado
  bem antiga (apresentada no BackboneJS) que foi ressuscitada
  pelo SolidJS e Preact

> Zustand, valtio e jotai são mantidos pela mesma equipe de desenvolvedores

O tema principal de debate do estado global é a forma que as atualizações de estado impactam suas aplicações. Muitas
pessoas não gostam da ContextAPI por ela forçar a re-renderização de todos os componentes filhos, não havendo otimização
do estado. Algumas outras pessoas não gostam do redux devido ao grande volume de código produzido para fazer ações
simples (o que não é mais tão verdade, dadas as novas versões do redux). Bibliotecas como zustand, valtio, jotai e
signals estão bastante em alta devido a sua simplicidade em gerenciar o estado. Signals estão ainda mais em alta devido
as suas otimizações para atualizar o
estado, [embora você não precise de signals](https://blog.axlight.com/posts/why-you-dont-need-signals-in-react/).

Como temos diversas bibliotecas que fazem o controle de estado, não vamos focar em todas. Primeiro iremos abordar a
ContextAPI e seus efeitos colaterais, depois falaremos um pouco de como as demais bibliotecas fazem para evitar
renderizações desnecessárias.

### ContextAPI

A canônica de estado global do React, como dito anteriormente. Ao criar um contexto, você tem dois valores para
lidar, `consumer` e `provider`.

Como o nome diz, `consumer` será sua forma de consumir o estado global via componentes, já o `provider` será sua forma
de distribuir o estado global ou até mesmo de forma mais localizada. Você pode ter um contexto que provê estado em
diversos locais, de forma separada. É uma técnica bem comum em componentes da
biblioteca [radix-ui](https://www.radix-ui.com/), sendo um
excelente exemplo para se observar o funcionamento.

Com os hooks é ainda mais fácil consumir contextos, através do hook `useContext`. Para prover o estado global com a
context, você pode utilizar os seus conhecimentos com o `useState`, `useReducer` ou até mesmo com
o [use-typed-reducer](https://github.com/g4rcez/use-typed-reducer):

```typescript jsx
import {createContext, PropsWithChildren, useContext, useState} from "react"

export type State = { name: string }
const context = createContext<State>({name: ""});

export const Provider = (props: PropsWithChildren) => {
    const [state, setState] = useState<State>({name: ""});
    return <context.Provider>{props.children}</context.Provider>;
}

export const useMyContext = () => useContext(context)
```

Esse é um pequeno snippet para inicializar sua context de forma segura. Em alguns tutoriais você irá encontrar a context
sendo criada sem um valor inicial. Essa técnica também é comum para obrigar as pessoas a passarem um valor inicial no
Provider e ocultar o uso do retorno de `createContext`. Como esse exemplo é algo voltado para um código dentro do
projeto, você não precisa utilizar as mesmas técnicas utilizadas por bibliotecas, mas para fins de curiosidade o
resultado seria o seguinte:

```typescript jsx
import {createContext, PropsWithChildren, useContext, useState} from "react"

export type State = { name: string }
const context = createContext<State | null>(null);

export const Provider = (props: PropsWithChildren<{ initialValue: State }>) => {
    const [state, setState] = useState<State>(props.initialValue);
    return <context.Provider>{props.children}</context.Provider>;
}

export const useMyContext = () => {
    const ctx = useContext(context)
    if (ctx === null) throw new Error("Informe um valor inicial no Provider");
    return ctx;
}
```

O teste condicional em `useMyContext` garante que o seu retorno seja sempre do tipo `State` e não um `State | null`.
Como a context não possui mecanismos para realizar seletores no estado, ela acaba não sendo a queridinha do público.

### Seletores de estado

Essa expressão já foi utilizada algumas vezes e ainda não teve uma explicação do que realmente é, então aqui será
abordado o que é. Seletores de estado ou `selectors` é uma técnica que ajuda bibliotecas como redux e zustand a
re-renderizarem parcialmente sua árvore de componentes. Isso porque com os seletores você pode dizer exatamente o que
você quer do seu estado global, permitindo que as bibliotecas façam seu componente re-renderizar somente quando a parte
específica do estado for atualizada, ou melhor, quando a parte selecionada do estado for atualizada.

É bem comum nas bibliotecas você ter parâmetros de função com um `selector` e um `comparator`.

O selector é responsável por dizer qual parte do estado você quer usar e como será a representação do seu estado global
no seu componente. Com ele você poderá particionar o seu estado em objetos menores, mesmo que o seu estado possua vários
objetos aninhados, como você pode conferir no exemplo abaixo

```typescript jsx
const state = useStore(state => ({name: state.user.name, products: state.cart.products}))
```

Já o comparator fica a cargo de comparar o estado anterior com o atual e definir se haverá mudança. É praticamente uma
função que dita o comportamento da memorização, similar ao [`React.memo`](https://react.dev/reference/react/memo).
Raramente você precisará escrever essa função (mas é importante saber), pois as bibliotecas já possuem sua função de
shallow compare. Apenas em um caso muito específico você vai precisar, mas se chegar nesse estágio, talvez você tenha
que repensar seus estados.

### zustand

Por ser uma das queridinhas atualmente (no dia 06 de setembro de 2023), vou falar dela em específico. Creio que um dos
motivos que faz com que essa lib seja tão adotada recentemente é o fato da sua simplicidade no uso, se liga...

```typescript jsx
import {create} from 'zustand'

const useStore = create((set) => ({
    count: 1,
    inc: () => set((state) => ({count: state.count + 1})),
}))

function Counter() {
    const {count, inc} = useStore()
    return (
        <div>
            <span>{count}</span>
            <button onClick={inc}>one up</button>
        </div>
    )
}
```

Um fato bem curioso é que o zustand trabalha de uma forma muito semelhante ou até mesmo idêntica ao redux no que diz a
respeito de otimização de re-render. Ambos usam selectors para a otimização, ambos se baseam no modelo de estado
imutável. O ganho do zustand é não depender de providers, não tendo um boilerplate como existe no redux.

Outro fator interessante é que o zustand permite você adicionar as ações ao state, tendo todo o controle em um só lugar,
seja estado, ou ação que manipula o estado. Diferente do redux, você não irá precisar de bibliotecas de terceiros para
melhorar a experiência de desenvolvimento com o zustand.

Se você busca uma boa biblioteca para manipular seu estado global, o zustand é uma ótima opção.

### valtio, signals e afins...

Como são muitas libs, vou apenas abordar alguns pontos positivos e negativos de cada uma delas

- [Recoil](https://recoiljs.org/) e [Jotai](https://github.com/pmndrs/jotai): controle de estado ao nível atômico, onde você faz o uso dos atoms de forma composicional, incentivando modelos mais funcionais. O recoil foi a primeira lib com esse modelo e logo em seguida veio o Jotai como alternativa ao recoil, tendo features bastante interessantes e focando numa experiência de desenvolvimento sem igual. 
- [Preact-react-signals](https://github.com/preactjs/signals/tree/main/packages/react): recentemente signals tem sido
  bastante comentados pela comunidade frontend, tivemos VueSignals, Angular Signals, QwikSignals... É um conceito de
  otimização ao nível granular, sendo uma forma bem efetiva de evitar re-renderizações indesejáveis. O ponto não tão
  negativo é a forma de consumo dos signals, que é um pouco fora do padrão do react, incentivando técnicas de mutação
- [Valtio](https://github.com/pmndrs/valtio): Similar aos signals, o valtio possui um modelo de estado mutável, onde faz o uso de [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) para identificar as mutações e atualizar o estado. O ponto negativo é o mesmo dos signals, incentivando um modelo um pouco diferente do React.

## Estado no browser

> Se tudo roda no browser, significa que todos os estados são estados de browser?
 
Com essa pergunta podemos começar a apresentar o estado do browser. Quando digo estado do browser, significa que iremos utilizar features e API's do browser para guardar o estado, independente da tecnologia. 

### URL

Sim, a URL é uma forma muito efetiva de guardar estado e além de guardar o estado ela possui uma feature que nenhuma outra lib poderá trazer para você ***histórico do browser***. Guardando o estado na URL você conseguirá:

- Permitir que o seu usuário possa caminhar nos estados passados da aplicação
- Permitir a navegação fluída e restaurar ações realizadas anteriormente, tal como buscas via query-string
- Seu usuário poderá compartilhar o estado com outros usuários. Sabe quando você vê um produto com um bom preço num ecommerce? Então, graças a URL você consegue compartilhar com outras pessoas.

Parece muito mágico, não é mesmo? Além de mágico é uma tarefa que você facilmente pode implementar, seja na mão ou utilizando bibliotecas de roteamento, tais como [react-router](https://reactrouter.com/en/main), [tanstack-router](https://tanstack.com/router/v1) ou até mesmo o [brouther](https://brouther.vercel.app/).

Utilizando bibliotecas de roteamento em React, basta que você utilize hooks que forneçam acesso e modificação a query-string da sua URL. Tendo isso, você não precisará controlar os estados da sua aplicação e poderá delegar o estado para a URL, ganhando de brinde todos os pontos citados anteriormente.

### Local Storage e Session Storage

Esses são dois caras bem conhecidos. São formas bem simples de armazenar o estado no browser e persistir mesmo que o browser seja fechado. Caso você queira armazenar os dados sem expiração, opte pelo [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Mas se você optar por uma sessão curta (até o usuário fechar a aba), então o [Session Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

O funcionamento de ambos é bem similar, com uma interface idêntica, permitindo que você troque um pelo outro sem nenhuma dificuldade, apenas tendo que lidar com as consequências de expiração.

Não existe uma maneira simples de fazer um estado reativo utilizando esses storages, mas eles são ótimos para salvar os estados de formulário entre um passo e outro, salvar as atualizações de estado dos componentes para você fornecer opções de "Continue de onde parou". Outra forma bastante efetiva é para salvar preferências do usuário, como o tema, página inicial, filtros mais buscados (isso é apenas aconselhável caso você não tenha uma API de preferências e queira manter as preferências atreladas ao browser do usuário).

```typescript jsx
window.localStorage.setItem("prefer-theme","dark")
window.localStorage.get("prefer-theme") === "dark" // true
```

Caso você precise de uma biblioteca que faça algumas abstrações, como parsear JSON para salvar no Local Storage ou Session Storage, você pode olhar o [storage-manager-js](https://www.npmjs.com/package/storage-manager-js). Além de Local e Session Storage, ele contempla manipulações de cookies.

### Cookies

Aceitas biscoitos? Os clássicos da web que vivem sendo pedidos para armazenar suas informações em prol de rastreamento. Cookies também armazenam informações, mas são mais aconselháveis de serem manipulados do lado da API e não no frontend. Por isso irei abordar menos sobre eles. A única dica que posso deixar é para utilizar os seus JWT nos cookies, com secure habilitado, http-only setado (para evitar roubos em casos de ataque de XSS) e com um tempo de expiração não muito longo.

# Quando usar qual?

Agora que foram apresentados diversos tipos de estado, podemos comparar cada um deles e tirar conclusões de uso de cada um deles. A forma mais efetiva vai ser apresentar um problema e a solução de estado mais adequada para cada um dos problemas citados. Lembre-se que mais de uma solução pode existir para o problema, aqui apresentarei apenas soluções que julgo serem mais adequadas.

## Formulário com múltiplos passos

Formulários sempre foram e possivelmente sempre vão ser uma dor de cabeça para todo mundo, devido à quantidade de requisitos pedidos para cada um. Quando um formulário não possui interações de estado, eu prefiro não fazer o controle de estado local, apenas salvo o estado de cada passo na hora do submit no Local Storage. Dessa forma, consigo fazer o formulário de forma mais rápida, com menos lógica e ainda consigo extrair a feature de ter um valor default caso o usuário volte em algum passo, utilizando as properties `defaultValue` dos inputs e o valor obtido do Local Storage durante a primeira renderização.

## Filtros de tabela/buscas por formulário

Esse é um caso bem similar ao formulário com múltiplos passos, a diferença é que nesse caso eu opto por salvar as informações na URL, assim o usuário pode ter um histórico com suas buscas e compartilhar buscas através da URL. É um caso bem simples. Assim como no caso anterior, opto por não controlar o estado dos formulários e apenas carregar os valores padrões conforme o estado da URL.

## Formulários de multi interações ou interdependência

Esses são os formulários são os mais chatos, onde o campo X depende do valor do campo Y e Z. Nesses casos não tem muito para onde correr...você precisa ter um estado local para controlar o seu formulário. Nada que um [use-typed-reducer](https://github.com/g4rcez/use-typed-reducer) ou um [react-hook-form](https://www.react-hook-form.com/) para resolver o problema de manipulação do estado global. Assim como todo formulário, costumo salvar o estado para que o usuário possa recuperar a sessão caso aconteça algum acidente com o formulário (fechar a aba ou o navegador, dar um F5 sem querer).

## Informações do usuário

Esse é um caso clássico de estado global, seja utilizando redux, zustand, jotai ou qualquer outro. Este estado em específico é importante estar no estado global para que seja possível reagir às informações do perfil, seja para ocultar ou exibir componentes, evidenciar a conta logada, trocar perfil...são muitas coisas que fazem sentido.

# Conclusão

São diversas formas de manipular estado, para não se confundir, conheça bem cada uma delas e principalmente conhecer bem o seu problema. Nem sempre é necessário um estado global só porque a informação é utilizada em duas telas diferentes, às vezes um hook com a lógica implementada pode fazer bem o trabalho. Tente não otimizar as coisas antes de realmente precisar, e assim, você conseguirá conviver bem com os estados e suas múltiplas fontes. 

Obrigado pelo seu tempo, tamo junto e até a próxima