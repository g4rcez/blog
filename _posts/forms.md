---
title: Como trabalhar com formulários?
useFolks: true
subjects: ["react", "frontend", "typescript", "javascript"]
language: "pt-br"
translations: ["pt-br"]
date: "2023-01-12T14:45:00.000Z"
description: "Como criar formulários sem ter milhões de dependências externas?"
---

# Introdução

Porque existem várias libs de formulários? Porque existem sempre tantas complicações quando se trata de formulários?

A maioria do tempo trabalhamos com formulários simples (que serão o foco desse artigo) e raramente encontramos casos
onde existem objetos aninhados ou listas (tópico para o próximo artigo). Se a maioria dos casos são simples, por que
utilizamos várias e várias bibliotecas?

# Os dois tipos de formulários

No mundo react você irá encontrar vários e vários artigos como este, falando sobre forms controlados (controlled forms)e
forms não controlados (uncontrolled forms). A ideia aqui não é trazer mais do mesmo, mas sim fazer uma comparação mais
profunda (ou o famoso deep dive) em ambas as formas

## Forms controlados

Como o nome diz, são forms controlados. Mas controlados por o que? Nesse caso, controlados pelo estado do React. Neste
caso você terá um [useState](https://beta.reactjs.org/apis/react/useState)
ou [useReducer](https://beta.reactjs.org/apis/react/useReducer) para sincronizar o estado do react com os seus
formulários na tela.

> Particularmente, eu costumo evitar essa forma quando os formulários são simples. Mas esse método é bem útil nas
> seguintes situações

- Dependência entre os campos
- Validações em tempo real
- Feedbacks interativos
- Formulários complexos com objetos e listas internas

Tendo em mente feito o controle de estado, podemos aplicar a lógica reativa do react ao nosso formulário de forma bem
simples

### Form + useState

Essa talvez seja a implementação mais simples para formulários controlados, talvez a única coisa complexa aqui seja o
handler para as mudanças de estado.

No exemplo a seguir iremos implementar as seguintes features:

1. Criar um estado tipado para o caso
2. Criar um onChange genérico que recebe o evento e insere o novo valor com base no nome do input que despachou o evento
3. Um onSubmit que irá previnir o comportamento padrão para que a página não seja recarregada
4. Um `<form>` com um onSubmit aplicado para a lógica da função citada acima

```typescript
type State = {
    name: string;
    country: string;
};

export default function FormPage() {
    const [state, setState] = useState({});

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.currentTarget;
        // vale lembrar que value sempre será uma string
        setState(prev => ({...prev, [name]: value}));
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        console.log(state);
    }

    return (
        <form onSubmit = {onSubmit} >
        <input name = "name"
    value = {state.name}
    />
    < input
    name = "country"
    value = {state.country}
    />
    < button
    type = "submit" >
        Submit
        < /button>
        < /form>
)
    ;
}
```

Com esse simples código, você irá conseguir fazer formulário simples com o controle de estado. Sinta-se a vontade para
acrescentar quaisquer lógicas customizadas, sejam utilizando um useEffect ou quaisquer event listeners do seu input,
tais como onBlur e onFocus.

Para casos onde você não tem uma validação customizada, esse approach é perfeito porquê:

- Lógica de estado simples
- Clareza das ações
- Tipagem conforme o estado
- Código simples

Claro que assim é simplista demais, mas você pode fazer o uso da [[#^ada748|Validity State]] para garantir algumas
consistências como valor numérico, min e max, range, checkbox ou radiobox. E o melhor de tudo, isso é nativo do
navegador. Mas daqui a pouco vamos ver melhor esses exemplo com validity State

## Forms não controlados

Como o próprio nome diz, forms não controlados não possuem controle de estado. A captura dos valores desse tipo de
formulário é toda feita no submit do formulário. A captura pode ser feita através de uma lógica de parsear todos os
inputs do formulário através de querySelectorAll ou `form.elements`, ou ainda
utilizando [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

Iremos fazer das duas formas para que fique bem claro algumas das possibilidades

### FormData

```typescript
type State = {
    name: string;
    country: string;
};

export default function App() {
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const state = Object.fromEntries([...data.entries()]) as State;
        console.log(state);
    };

    return (
        <form onSubmit = {onSubmit} >
        <input name = "name" / >
        <input name = "country" / >
        <button type = "submit" > Submit < /button>
            < /form>
    );
}
```

Bem simples, não é mesmo? E o melhor de tudo é que tudo isso é nativo do navegador, zero controle de estado durante a
interação do usuário e total controle dos dados na ação de submit.

Apesar de utilizar uma API que trata nativamente os dados do formulário, mesmo que você utilize um `type=number`, o
FormData não irá fazer a conversão automática :/

### Query Selectors

Um recurso bem famoso para selecionar elementos é o `ELEMENT.querySelector` ou `ELEMENT.querySelectorAll`. A diferença
entre os dois é que o `querySelectorAll` retorna um `NodeListOf` dos elementos HTML, e não, isso não é um array para
você utilizar métodos como ` `.filter` ou `.reduce`.

O uso do querySelector é bem simples, basta escrever
um [CSS Selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors) e você terá
um `NodeListOf` desses elementos.

Sem mais delongas, vamos para o código

```typescript
type State = {
    name: string;
    country: string;
};

export default function App() {
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const state = [...form.querySelectorAll("input")].reduce<State>((acc, el) => ({
            ...acc,
            [el.name]: el.value
        }), {})
    };

    return (
        <form onSubmit = {onSubmit} >
        <input name = "name" / >
        <input name = "country" / >
        <button type = "submit" > Submit < /button>
            < /form>
    );
}
```

Assim como o método anterior, esse método também não faz nenhum controle de estado durante as ações do usuário, apenas
na ação de submit você terá acesso a todos os valores preenchidos no formulário.

A diferença básica entre os métodos é que nesse método você irá fazer a seleção "manual" do que contemplará o estado.
Como é um CSS Selector, você pode fazer queries mais complexas baseadas
em [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset)
ou [AriaAttributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA).

Até agora já foram apresentados 3 métodos de formulário e nenhum deles foi devidamente validado. Mas isso nós vamos ver
agora...

# Validity State

Essa é uma das APIs mais subestimadas do navegador. Pouquissimo se usa ela em detrimento de bibliotecas de validação
como [Yup](https://github.com/jquense/yup) ou [Zod](https://github.com/colinhacks/zod) junto de alguma outra lib de
validação como [react-hook-form](https://react-hook-form.com/) e similares.

Esse combo de bibliotecas é até interessante, mas talvez em situações onde vc queira manter um tamanho de build menor,
eles não vão ser tão efetivos assim. E é exatamente aqui onde
a [Validity State](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) brilha. E vale lembrar que você **só
pode utilizar ela com inputs dentro da tag `<form/>`**, caso contrário, nenhuma validação será feita

Claro que em alguns casos mais complexos de formulário como:

- Lista de objetos
- Objetos aninhados
- Lista de objetos dentro de objetos
- Dependência de campos

Enfim...qualquer lógica um pouco mais complexa ela costuma não lidar bem com a Validity State. Mas nada impede seu uso,
basta pensar num fluxo amigável para o usuário que dispense a necessidade de dependência entre campos ou objetos/listas
complexas.

Com a ValidityState, podemos aplicar CSS baseado no estado do nosso elemento. Temos também algumas "razões" para os
motivos dos erros, o que nos facilita o entendimento e o controle de validação do componente. Ao total são 10 estados de
erro e 1 estado de válido, chamado `:valid`.

- valueMissing: trigga o estado de `:invalid`, aplicado para casos onde não existe valor
- typeMissmatch: trigga o estado de `:invalid`, aplicado para casos onde o atributo type(email ou url) possui um formato
  incorreto em seu valor
- tooShort: trigga o estado de `:invalid` ou `out-of-range`, aplicado para casos onde o valor não possui a quantidade de
  caracteres mínima. Controle feito através de `minLength`
- tooLong: é o oposto do tooShort, porém para casos onde o valor ultrapassa a quantidade máxima de caracteres. Controle
  feito através de `maxLength`
- stepMismatch: determina se o valor é divisível
  por [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-step). Caso não seja, trigga o
  estado de `:invalid` ou `out-of-range`.
- rangeUnderflow: corresponde ao `tooShort`, porém para `<input type=number/>`
- rangeOverflow: corresponde ao `tooLong`, porém para `<input type=number/>`
- patternMismatch: trigga o estado `:invalid` quando o valor do input não corresponde ao padrão determinado
  em [pattern](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-pattern)
- customError: erros customizáveis que você pode setar apartir do
  método [setCustomValidity](https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity)
- badInput: checa caso o browser não consiga converter o valor do input

E caso nenhum desses seja considerado como verdadeiro, significa que nosso input está indeterminado ou válido. Em casos
de válido, o estado `:valid` será triggado. O caso
de [indeterminado](https://developer.mozilla.org/en-US/docs/Web/CSS/:indeterminate) é aplicado para valores iniciais,
checkbox ou radiobox.

Conhecendo esses valores você pode criar estilos utilizando seletores CSS baseados no estado do seu input e reduzir a
quantidade de lógica no seu código Javascript

# Conclusão

Com todo o conteúdo apresentado, fica um pouco mais fácil decidir o que fazer quando esbarrar em alguma situação de
formulário. Não é preciso adicionar libs para validar alguns campos, só em situações que são realmente complexas.

Uma mentalidade legal de adotar, não só para formulários, é utilizar mais do navegador ao invés de utilizar soluções
custom. Isso reduz a quantidade de código entregue para o cliente e melhora a experiência, trazendo uma experiência mais
nativa/familiar.

É isso, espero que tenham curtido e até a próxima.