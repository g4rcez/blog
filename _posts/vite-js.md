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

Apesar de ser do "mundo React", as vezes me aventuro um pouco com VueJS e leio bastante discussões da comunidade Vue no twitter. E foi assim que conheci o [ViteJS](http://vitejs.dev/), que se diz ser a próxima geração de ferramentas para frontend.

De começo eu fiquei um pouco receoso pela ferramenta, mas com menos de uma hora utilizando para experimentar microfrontends eu já estava gostando demais. Bom, gostando demais até [ter um problema](https://github.com/vitejs/vite/issues/2906) para buildar chunks separados por nome da biblioteca e versão. A [issue 2906](https://github.com/vitejs/vite/issues/2906) foi aberta no dia 6 de Abril de 2021 e no dia 14 de Abril de 2021 ela foi mergeada. Com menos de 12 dias a correção já estava pronta com a correção do meu problema, o que foi interessante demais.

Apesar de ter tido esse problema no primeiro uso, ele não afetou em nada minha experiência com o Vite, dado que é uma ferramenta relativamente nova, era de se esperar alguns problemas em casos bem fora do padrão.

Se você não pensa em fazer diversas configurações, é quase certeza de não ter nenhum problema com a experiência.

# Criando um projeto ViteJS para React

Assim como o CreateReactApp possui alguns templates, o Vite também possui seus templates que atendem a diversos frameworks, indo de Vue até Svelte. No nosso caso, iremos utilizar React com Typescript, que corresponde ao template `react-ts`.

Sem mais delongas, para criar um projeto:

```bash
# Utilizando npm
npm init @vitejs/app react-app --template react-ts

# Utilizando yarn
yarn create @vitejs/app react-app --template react-ts
```

Vale notar algumas diferenças do CreateReactApp.

- Ao terminar o setup, você precisará fazer `MANUALMENTE` o install com `yarn` ou `npm install`.
- O script para iniciar o desenvolvimento é `yarn dev` ou `npm run dev`

Após o install manual, você já poderá rodar `yarn dev` e começar a fazer seu projeto.

# Diferenças entre ViteJS e CRA

Como o próprio nome sugere, CRA é específico para React e por isso o suporte para o desenvolvimento utilizando o CRA será "melhor" em termos de suporte a visualização de erro e outras configurações que o CRA trás.

Por outro lado, o ViteJS trás mais rapidez no build e no reload das mudanças. É incrível ver que até suporte ao [Fast Refresh](https://reactnative.dev/docs/fast-refresh) o Vite possui. Outro ponto que achei bastante bacana foi o [arquivo de configuração](https://vitejs.dev/config/) ser em Typescript, o que nos permite saber com clareza o que podemos configurar.

Enquanto que o Create React App utiliza o Webpack+Babel para o bundle das aplicações, o ViteJS utiliza Rollup+EsBuild. E como podemos ver no repositório do [EsBuild](https://github.com/evanw/esbuild), ele é incrivelmente mais rápido. Nem preciso comentar que isso é um grande ganho né?

> No final de 2019 eu conheci o esbuild e tive certos problemas com ele. E agora ver ele sendo utilizado num tooling para frontend é algo fantástico

Algumas coisas como utilizar variáveis de ambiente acabam sendo diferentes no ViteJS, ao invés do clássico `process.env` nós temos `import.meta.env`. Isso não nenhum problema, apenas um choque pela troca de ferramenta. A estrutura inicial do projeto Vite também é diferente do CRA, trazendo o nosso `index.html` na raiz do projeto, e isso é possível alterar via `vite.config.ts`.

Um posto interessante é a ideia de trazer o build utilizando [Server Side Rendering](https://vitejs.dev/guide/ssr.html), apesar de ser experimental, isso nos mostra o quão comprometida a ferramenta está com a entrega de um frontend otimizado. Também comprova o fato de ser a ferramenta de frontend do próximo nível.

> Até quando o hype de SSR vai existir? É engraçado parar pra pensar que SSR é algo feito no PHP desde 1995 e agora estamos tratando isso como uma técnica inovadora.

Trazer o Rollup no lugar do Webpack foi uma jogada sensacional, na minha visão. Isso nos permite fazer as próprias configurações sem ter que estudar um sistema de plugins e configurações bizarras do Webpack. Como você pode ver na documentação do [Rollup](https://rollupjs.org/), a configuração é bem mais simples e o sistema de plugins não exige uma configuração muito avançada.

# Conclusão

Deu pra notar que eu curti bastante o Vite né? Haha. Sem dúvidas é uma ferramenta excelente, mas que talvez pela existência do CRA ela seja ofuscada por não ter o mesmo tooling para desenvolvimento. Em questão de build, não tem nem chance pro CRA.

Vale a pena você fazer os seus testes e tirar as próprias conclusões. Garanto que você vai curtir e se impressionar principalmente com o build ridiculamente rápido.

Sobre a issue que comentei ter tido, tive que subir o repositório para que fizessem a análise. Só conferir [no meu github](https://github.com/g4rcez/vite-testing). Lá tem um arquivo de configuração bem diferente do comum, criado justamente para separar dependências nos testes de microfrontends.

E é isso galera, um salve e espero que tenham gostado do conteúdo
