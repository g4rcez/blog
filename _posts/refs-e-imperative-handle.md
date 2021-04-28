---
useFolks: true
subjects: ["javascript", "react", "hooks", "frontend"]
title: "useRef e useImperativeHandle"
language: "pt-br"
translations: ["pt-br"]
date: "2021-04-27T23:30:00.000Z"
description: "Desvendando o ref e forwardRef"
---

`useRef`, `createRef`, `forwardRef`. Tanta coisa complicada e ainda tem o `useImperativeHandle` pra complicar o que nós devemos usar. Mas a pergunta fica, _quando eu devo usar ref?_. Isso é uma pergunta que eu me faço pelo menos 2 vezes antes de querer criar uma ref em algum componente.

Antes de começar a explicar qualquer coisa, vamos listar alguns pontos:

- Pra quê serve um ref?
- Quando vou usar um ref?
- Quando devo usar forward Ref?

Antes de responder as perguntas, vou explicar cada um dos refs.

### useRef | createRef

O `useRef` serve para funções e o `createRef` funciona para classes e o funcionamento de ambos é bem parecido. Podemos fazer a associação de `useState` e `this.setState`. Hooks e estado dos componentes de classe.

> Mas o que são essas refs?

Resumidamente, refs nos dão a habilidade de criar objetos mutáveis que perduram durante todo o ciclo de vida do nosso componente. Em ambos os casos você acessará o objeto mutável por meio da property `.current`. Com isso, podemos criar um valor em uma renderização e alterar durante qualquer parte do ciclo de vida, e o melhor de tudo, a ref não vai triggar um novo render no seu componente.

Refs não triggarem um novo render é algo bem interessante, pois com isso podemos armazenar valores e fazer modificações através de eventos. Dessa forma, evitamos renderizações na árvore do React e melhorar performance em casos de lentidão, ao custo de não ter um estado reativo a mudanças, somente aos eventos

> E o que as refs tem a ver com o DOM?

Bem lembrado. Na [documentação do React](https://reactjs.org/docs/refs-and-the-dom.html) temos um tópico sobre isso e na maioria dos casos nós vemos exemplos com `useRef` + `<input />`.

Por meio da property `ref` contida nos nossos elementos HTML, podemos obter o `HtmlElement` correspondente. Se você é da web antiga ou se já usou a DOM API, deve se lembrar do `document.getElementByID`. E é exatamente o mesmo output que temos entre `<div ref={ref} id="ok" />` e `document.getElementById("ok")`. E como foi dito anteriormente, esse valor vai perdurar durante todo o ciclo de vida do nosso componente.

Pra ficar fixado na cabeça, um exemplo com hooks e outro com classes

```tsx
const Component = () => {
  const ref = useRef<HtmlDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.backgroundColor = "black";
  }, []);

  return <div ref={ref}></div>;
};
```

```tsx
class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
  }

  componentDidMount() {
    this.divRef.current.style.backgroundColor = "black";
  }

  render() {
    return <div ref={this.divRef}></div>;
  }
}
```

### React.forwardRef<Ref, Props>(props, externalRef)

De cara já temos a assinatura tipada + parâmetros do forwardRef. Mas para poder explicar o `forwardRef` de forma tranquila, vamos voltar um pouco em como chamamos o nosso JSX e como nós criamos nossos componentes de função:

```tsx
type Props = {
  name: string;
};

const Component = (props: Props) => {
  return <span>{props.name}</span>;
};

// Na hora de usarmos esse componente

<Component name="John Doe" />;
```

Como podemos ver, sempre é garantido que nosso componente vai receber um objeto via props. Logo, para usar as refs basta nós passarmos um ref para o componente e iremos capturar as refs dele.

```tsx
// Seguindo o exemplo acima

const Main = () => {
  const ref = useRef();
  <Component ref={ref} name="John Doe" />;
};
```

Tudo certo? **NÃOOOOOOOOOOOOOOOOO**. De repente, brotou um mega erro no console e nós estamos perdidos sobre como usar a ref. Se você tentar acessar a ref de um componente sem o `forwardRef`, você verá o seguinte erro:

![Erro ao usar ref sem forward ref](/ref-error.png)

```
Warning: Function components cannot be given refs.
Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
```

Bom, com isso nós podemos ir lá na [documentação do React](https://reactjs.org/docs/forwarding-refs.html) e entender como fazemos para passar as refs do nosso componente para o componente pai (o componente que o chama). Caso você não queira ir, vamos fazer isso por aqui.

```tsx
type Props = {
  name: string;
};

const Component = forwardRef<HTMLSpanElement, Props>((props: Props, ref) => {
  return <span ref={ref}>{props.name}</span>;
});
```

Agora sim. Podemos utilizar a property `ref` ao usar o nosso `Component` e não haverão mais erros. E o mais legal? Quem consumir este componente vai ter o tipo exato da ref, sem nenhum problema na hora de consumir

![Funcionamento da ref do Component <span />](/ref-image.png)

Se você fizer um `document.querySelector("span")` ou qualquer outro método de acesso ao DOM que vá retornar um span, verá que as properties são as mesmas. E ainda mais, se você fizer um `Object.is(ref.current, document.querySelector("span"))` eles serão os mesmos objetos.

> Se você não conhece o Object.is, aqui vai uma indicação da [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

Voltando um pouco a construção dos componentes, estamos habituados a componentes de função aceitarem somente um único argumento, que são nossas props. Mas com o forwardRef nós recebemos um segundo parâmetro que é a nossa ref externa, que o pai do componente irá passar para o filho.

Dessa forma apresentada, nós só conseguimos fazer um forward da ref de um elemento do HTML.

> E se eu quiser criar meu próprio objeto de ref, como eu faço?

**Ótima pergunta**

### useImperativeHandle

Aaah, os hooks...Como eles facilitam nossa vida. Este aqui eu deixei por último pois para usar o `useImperativeHandle` você precisa do `forwardRef`. Nosso array de dependências pra esse hook já está preenchido, agora só aprender

```tsx
import { useImperativeHandle, forwardRef } from "react";

type Ref = {
  changeColor: () => void;
  scrollTo: () => void;
};

type Props = {
  name: string;
};

const Component = forwardRef<Ref, Props>((props, externalRef) => {
  const ref = useRef<HtmlDivElement>(null);
  useImperativeHandle(externalRef, () => {
    return {
      changeColor: () =>
        (ref.current?.style.backgroundColor =
          // https://stackoverflow.com/questions/1484506/random-color-generator
          "#" + (((1 << 24) * Math.random()) | 0).toString(16)),
      scrollTo: () => ref.current?.scrollIntoView(),
    };
  });
  return <div ref={ref}>Hack The planet</div>;
});
```

Apesar de ser um conceito complexo, o uso é bem simples. Existem alguns tradeoffs no useImperativeHandle que são referentes a objetos, uma vez que você tem uma instância mutável, você trás todos os conceitos que já conhece nos objetos.

Com o `useImperativeHandle` você irá criar métodos ou atributos do seu componente filho que irá refletir no pai, sem gerar nenhum novo render. E essa é uma forma de passar props do filho para o pai.

### Respondendo as perguntas

Como eu tinha levantado 3 perguntas no começo do artigo, iremos respondê-las agora para chegar a conclusão

- Pra quê serve um ref?
`R: Acessar o elemento DOM ou criar valores mutáveis que irão perdurar durante todo o ciclo de vida do componente`

- Quando vou usar um ref?
`R: Quando quiser acessar o HtmlElement de um elemento ou quiser receber as refs de um componente filho`

- Quando devo usar forward Ref?
`R: Quando estiver criando um componente que será a abstração de um elemento HTML ou quando quiser fornecer métodos do filho para o pai`

### Conclusão

Refs são uma verdadeira mágica que nos permite trabalhar diretamente com o DOM, de forma imperativa. Isso pode ser muito útil em alguns casos onde você cria uma biblioteca que faça diversas mudanças diretas no DOM. 

Apesar dessa mágica toda, usar o Ref pode ser um tiro pela culatra e acabar gerando problemas, uma vez que você fará mudanças diretas no DOM e o React irá fazer mudanças no Shadow DOM para posteriormente aplicar as mudanças. Seria mais ou menos um efeito de fazer 2 setStates ao mesmo tempo. 

Espero que vocês tenham curtido e entendido como funcionam as refs e como fazer para transitar as refs entre componentes. E isso é tudo pessoal.