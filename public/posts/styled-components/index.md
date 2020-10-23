---
useFolks: true
subjects: ["javascript", "tricks", "typescript", "frontend", "react"]
title: "Recriando o Styled Components"
language: "pt-br"
translations: ["pt-br"]
date: "2020-10-22T00:00:00.000Z"
description: "Que tal fazer o seu próprio styled-components da forma simples?"
---

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

Para podermos criar qualquer elemento HTML, sendo estes passados por parâmetros, devemos conhecer o []()
