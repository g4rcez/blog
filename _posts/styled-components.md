---
useFolks: true
subjects: ["javascript", "tricks", "typescript", "frontend", "react"]
title: "Recriando o Styled Components"
language: "pt-br"
translations: ["pt-br"]
date: "2020-10-22T00:00:00.000Z"
description: "Que tal fazer o seu próprio styled-components da forma simples?"
---

#### Se você só quiser código: [Link do Gist](https://gist.github.com/g4rcez/743ac98956f47ec7c58ad1149f5dc02e)

Você conhece o [styled-components](https://styled-components.com/)? Se não, te apresento agora a famosa biblioteca de CSS-in-JS mais utilizada no mundo React. 

> Particularmente, prefiro trabalhar com CSS e JS em arquivos separados, mas isso fica pra próxima

Se você nunca utilizou styled-components, observe um exemplo que peguei da documentação oficial:

```tsx
import styled, { css } from 'styled-components'

const Button = styled.a`
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: transparent;
  color: white;
  border: 2px solid white;
  ${props => props.primary && css`
    background: white;
    color: black;
  `}
`;
const App = () => (
  <div>
    <Button
      href="https://github.com/styled-components/styled-components"
      target="_blank"
      rel="noopener noreferrer"
      primary
    >
      GitHub
    </Button>
    <Button as="a" href="/docs">Documentation</Button>
  </div>
);
```

Incrível né? Você escreveu CSS dentro do JS e isso funcionou. Parece até magia. E é exatamente por parecer magia que estou escrevendo esse post. 

Até o momento ainda não consegui entender o código todo do styled-components, mas analisando seu funcionamento em algumas páginas, é possível perceber que:

1. Ao carregar a página, o styled-components insere no `<head>` da aplicação uma tag `<style>` com alguns atributos para identificação
2. Insere os estilos passados no CSS-in-JS nos elementos que são filhos de styled-components
3. O CSS gerado é inserido no HTML. Em algumas versões ele era inserido no `head>style` com todo o CSS necessário, nas versões novas parece ser um texto encodado e transformado em estilo CSS

### Talk is cheap, show me the code

Para podermos criar qualquer elemento HTML, sendo estes passados por parâmetros, devemos conhecer o [React.createElement](https://reactjs.org/docs/react-api.html#createelement) para criar nossos elementos de forma dinâmica, não utilizando JSX. 

Como vamos simular o styled-components. Nem tudo será exatamente igual a biblioteca. Nossa função principal precisará:

- Receber a string referente ao elemento que utilizar. `Styled("div")`, por exemplo.
- Receber um `TemplateStringsArray`, que é o template literal que utilizamos para escrever o estilo do nosso componente.
- Receber as props como qualquer componente React irá receber

```tsx
/*
  Recebemos as props como `Props` (simulando o .attrs()) e o elemento HTML
  que nosso componente irá representar
*/ 
function Styled<Props = unknown, Element = Html>(tag: string) {
  /*
    Retornamos uma função que interpreta o nosso template literal string,
    as strings passadas entre crases (template string)
  */
  return ([first, ...placeholders]: TemplateStringsArray, ...a: StyledArgs<Element, Props>[]) => {
    /*
      Retornamos uma função que de fato será nosso componente JSX, recebendo as props do elemento HTML
      e as props adicionais
    */
    return ({ children, ...props }: Html & Props) => {
    }
  }
}
```

Agora precisamos fazer toda a criação do elemento, inserção do CSS no header, adição de classes, concatenação de props e renderização.

- Concatenar o template literals de acordo com as funções utilizadas dentro da string. Quando utilizamos um styled-components, fazemos algo parecido com:

```tsx
const Paragraph = styled.p`
  color: ${props => props.color ?? "white"}
`
```

Utilizando nosso styled-components customizado, seria o equivalente a:

```tsx
const Paragraph = Styled("p")`
  color: ${props => props.color ?? "white"}
`
```

Para conseguirmos "executar" a concatenação de string + função, precisamos do nosso seguinte snippet abaixo:

```typescript
// Reutilizando os nomes apresentados acima
const template = (placeholders: StyledArgs<Element, Props>[]) => {
  const final = placeholders.reduce((acc, el, i) => {
  const curr = a[i];
  if (typeof curr === "function") {
    // as props recebidas pelo componente.
    return acc + curr(props as never) + el;
  }
  return acc + a[i] + el;
  }, first);
  return final.trim();
}
```

- Inserir os estilos no header para utilizar as classes. Que outra maneira de inserir elementos HTML no nosso documento se não utilizar a DOM API? Nesse ponto, iremos utilizar o React apenas para observar as mudanças ocorridas na nossa `string` e então, executar nosso efeito novamente.

```typescript
useEffect(() => {
  const sheet = document.createElement("style");
  sheet.innerHTML = `.${className} { ${string} }`;
  sheet.id = className;
  const el = document.getElementById(className);
  if (!el) {
    document.head.insertBefore(sheet, document.head.firstElementChild);
    return;
  }
  el?.replaceWith(sheet);
}, [string]);
```

- Assim como o styled-components, nós precisamos simular também a eliminação de atributos não pertencentes ao HTML, para assim passarmos para nosso componente HTML de fato. Para isso, criaremos um `computedProps` para limpar as props do nosso componente customizado.

```typescript
const computedProps = useMemo(() => {
  const el = document.createElement(tag);
  const newProps = {};
  for (const prop in el) {
    if (prop in props) {
      newProps[prop] = props[prop];
    }
  }
  el.remove();
  return newProps;
}, [props, str]);
```

> Pera um pouco. Tem um hook de brinde para você utilizar na hora de compor seu `className`

```typescript
import React, { useState, DependencyList, useMemo } from "react";

type ClassArray = ClassValue[];

type ClassDictionary = { [id: string]: any };

export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;

export const useClassNames = (dependency: DependencyList, ...classes: ClassValue[]) =>
  useMemo(() => classNamesDedupe(...classes), dependency);
```

Pronto. Agora temos tudo necessário para a construção do nosso `joked-components`.

```tsx
import classNamesDedupe from "classnames/dedupe";
import React, { useState, DependencyList, useMemo } from "react";

type ClassArray = ClassValue[];
type ClassDictionary = { [id: string]: any };
export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;

export const useClassNames = (dependency: DependencyList, ...classes: ClassValue[]) =>
  useMemo(() => classNamesDedupe(...classes), dependency);

type Html = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

type StyledArgs<E, T> = ((args: E & T) => string | number) | string | number;

function Styled<ExtraProps = unknown, Element = Html>(tag: string) {
  return ([first, ...placeholders]: TemplateStringsArray, ...a: StyledArgs<Element, ExtraProps>[]) => {
    return ({ children, ...props }: Html & ExtraProps) => {
      const className = useMemo(() => `${tag}-${Date.now()}`, []);

      // aplicando a demonstração do método template, citado anteriormente
      const str = useMemo(() => {
        const final = placeholders.reduce((acc, el, i) => {
          const curr = a[i];
          if (typeof curr === "function") {
            return acc + curr(props as never) + el;
          }
          return acc + a[i] + el;
        }, first);
        return final.trim();
      }, [props]);

      // utilizando a DOM API para inserir o <style>
      useEffect(() => {
        const sheet = document.createElement("style");
        sheet.innerHTML = `.${className} { ${str} }`;
        sheet.id = className;
        const el = document.getElementById(className);
        if (!el) {
          document.head.insertBefore(sheet, document.head.firstElementChild);
          return;
        }
        el?.replaceWith(sheet);
      }, [str]);

      // composição dos classNames
      const classNames = useClassNames([props.className, str], props.className, className);

      // limpando as props que não pertencem ao HTML
      const computedProps = useMemo(() => {
        const div = document.createElement(tag);
        const newProps = {};
        for (const prop in div) {
          if (prop in props) {
            newProps[prop] = props[prop];
          }
        }
        div.remove();
        return newProps;
      }, [props, str]);
      return React.createElement(tag, { ...computedProps, className: classNames }, children);
    };
  };
}
```

Olhando assim, não parece tão difícil né? E pra utilizar fica bem parecido com o styled-components original:

```tsx
type DIV = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

type GridProps = { gap: number; rows: number };

// Dizendo as props customizadas do nosso componente e qual o tipo do elemento HTML que o mesmo será
const GridRow = Styled<GridProps, DIV>("div")`
  display: grid;
  grid-template-rows: repeat(${(props) => props.rows}, minmax(0, 1fr));
  grid-auto-flow: column dense;
  grid-gap: ${(props) => props.gap}rem;
  gap: ${(props) => props.gap}rem;
`;

const App = () => {
  const [zero, setZero] = useState(0);
  return (
    <GridRow gap={zero} rows={4}>
      <button onClick={() => setZero((p) => p + 1)}>Add + {zero}</button>{" "}
      <button onClick={() => setZero((p) => p + 1)}>Add + {zero}</button>
      <button onClick={() => setZero((p) => p + 1)}>Add + {zero}</button>
      <button onClick={() => setZero((p) => p + 1)}>Add + {zero}</button>
      <button onClick={() => setZero((p) => p + 1)}>Add + {zero}</button>
    </GridRow>
  );
};
```

### Conclusão

E então, o que achou? Claro que o styled-components faz algumas melhorias de performance durante a compilação do projeto, através das `macros`. Mas em projetos pequenos ou para fins de estudo, vale a pena você utilizar essa versão para observar o comportamento do React de forma mais *profunda*. 

É isso aí amiguinhos, até a próxima