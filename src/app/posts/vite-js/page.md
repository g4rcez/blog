---
level: 0
title: "ViteJS"
language: "pt-br"
translations: ["pt-br"]
subjects: ["frontend", "react"]
date: "2021-05-21T04:25:51.999Z"
description: "Uma alternativa ao create-react-app"
---

# Introdução

Durante algumas experimentações com microfrontends eu busquei tentar fugir do webpack, devido a forma de build gerado. Talvez por falta de pesquisa ou conhecimento sobre o webpack, mas o build gerado pelo webpack gera chunks de Javascript que são referenciados como Arrays ao invés de referenciar a URL ou importar o módulo.

Infelizmente, o Create-React-App utiliza o webpack e isso não encaixava bem no que eu queria fazer. Uns 2 anos atrás eu conheci uma ferramenta que venho utilizando bastante para o build de bibliotecas, o [Rollup](https://rollupjs.org/). O Rollup é bem mais simples do que o webpack, e sua configuração permitia fazer exatamente o que eu precisava para os microfrontends. Mas ainda tinha um problema...

# Hello [ViteJS](http://vitejs.dev/)

O [ViteJS](http://vitejs.dev/) se apresenta como a próxima geração de ferramentas para frontend e tem ganhado espaço significativo na comunidade.

De começo eu fiquei um pouco receoso pela ferramenta, mas com menos de uma hora utilizando para experimentar microfrontends eu já estava gostando demais. Bom, gostando demais até [ter um problema](https://github.com/vitejs/vite/issues/2906) para buildar chunks separados por nome da biblioteca e versão. A [issue 2906](https://github.com/vitejs/vite/issues/2906) foi aberta no dia 6 de Abril de 2021 e no dia 14 de Abril de 2021 ela foi mergeada. Com menos de 12 dias a correção já estava pronta com a correção do meu problema, o que foi interessante demais.

Apesar de ter tido esse problema no primeiro uso, ele não afetou em nada minha experiência com o Vite, dado que é uma ferramenta relativamente nova, era de se esperar alguns problemas em casos bem fora do padrão.

Se você não pensa em fazer diversas configurações, é quase certeza de não ter nenhum problema com a experiência.

# Criando um projeto ViteJS para React

Assim como o CreateReactApp possui alguns templates, o Vite também possui seus templates que atendem a diversos frameworks, indo de Vue até Svelte. No nosso caso, iremos utilizar React com Typescript, que corresponde ao template `react-ts`.

Para criar um projeto:

```bash
# Utilizando npm
npm init @vitejs/app react-app --template react-ts

# Utilizando yarn
yarn create @vitejs/app react-app --template react-ts
```

Vale notar algumas diferenças do CreateReactApp.

- Ao terminar o setup, é necessário executar manualmente o `yarn` ou `npm install`.
- O script para iniciar o desenvolvimento é `yarn dev` ou `npm run dev`

Após o install manual, você já poderá rodar `yarn dev` e começar a fazer seu projeto.

# Diferenças entre ViteJS e CRA

Como o próprio nome sugere, CRA é específico para React e por isso o suporte para o desenvolvimento utilizando o CRA será "melhor" em termos de suporte a visualização de erro e outras configurações que o CRA trás.

Por outro lado, o ViteJS trás mais rapidez no build e no reload das mudanças. É incrível ver que até suporte ao [Fast Refresh](https://reactnative.dev/docs/fast-refresh) o Vite possui. Outro ponto que achei bastante bacana foi o [arquivo de configuração](https://vitejs.dev/config/) ser em Typescript, o que nos permite saber com clareza o que podemos configurar.

Enquanto o Create React App utiliza Webpack+Babel, o ViteJS utiliza Rollup+EsBuild. O [EsBuild](https://github.com/evanw/esbuild) é consideravelmente mais rápido, o que se traduz em ganhos visíveis no tempo de build.

Algumas coisas como utilizar variáveis de ambiente acabam sendo diferentes no ViteJS, ao invés do clássico `process.env` nós temos `import.meta.env`. Isso não nenhum problema, apenas um choque pela troca de ferramenta. A estrutura inicial do projeto Vite também é diferente do CRA, trazendo o nosso `index.html` na raiz do projeto, e isso é possível alterar via `vite.config.ts`.

Um posto interessante é a ideia de trazer o build utilizando [Server Side Rendering](https://vitejs.dev/guide/ssr.html), apesar de ser experimental, isso nos mostra o quão comprometida a ferramenta está com a entrega de um frontend otimizado. Também comprova o fato de ser a ferramenta de frontend do próximo nível.

> Vale notar que SSR é um conceito antigo, presente no PHP desde 1995. O que é novo é a integração com ferramentas modernas de frontend.

A adoção do Rollup no lugar do Webpack simplifica a configuração consideravelmente, dispensando o estudo de um sistema de plugins mais complexo. Como você pode ver na documentação do [Rollup](https://rollupjs.org/), a configuração é bem mais simples e o sistema de plugins não exige uma configuração muito avançada.

# Conclusão

Sem dúvidas é uma ferramenta excelente, mas que talvez pela existência do CRA ela seja ofuscada por não ter o mesmo tooling para desenvolvimento. Em questão de build, o desempenho do ViteJS é consideravelmente superior.

Sobre a issue mencionada, o repositório utilizado para análise está disponível [no GitHub](https://github.com/g4rcez/vite-testing), com um arquivo de configuração específico para separar dependências nos testes de microfrontends.

Obrigado pelo seu tempo, tamo junto e até a próxima
