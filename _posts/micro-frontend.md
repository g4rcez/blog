---
useFolks: true
subjects: ["javascript","tricks","typescript","frontend"]
title: "Micro frontend ou NextJS"
language: "pt-br"
translations: ["pt-br"]
date: "2020-12-24T00:00:00.000Z"
description: "Tecnologia nova, conceito velho. Nada muda"
---

[NextJS](https://nextjs.org/) é um dos projetos da atualidade mais sinistros que tem. O conceito de SSR que ele trouxe (que não é nada inovador) junto de todo o tooling + ecossistema React, realmente, é impressionante. 

Mas nada disso é novo, na verdade, o conceito de SSR é bem antigo. Se você programou em PHP, Dotnet, Java, talvez você já tenha se deparado com técnicas para escrever um código backend dentro do seu frontend e a cada request, o seu server iria processar aquela página e retornar o conteúdo dinâmico.

Na real, o grande diferencial do Next está na geração estática do conteúdo em build-time, no cache incremental e possibilitar tudo isso usando um dos melhores frameworks (ou bibliotecas, se você preferir) que é o [ReactJS](https://reactjs.org/). Com tudo isso, talvez nem faça sentido nós exportarmos a responsabilidade de renderizar nossas aplicações pro cliente. Afinal de contas, SPA são renderizadas no cliente e ainda prejudicam o [SEO](https://developers.google.com/search/docs/beginner/seo-starter-guide) da sua página.

Mesmo com todos esses benefícios, o NextJS não é a bala de prata que estamos vendo por aí. Talvez seu problema não necessite de um SEO (aplicações internas) e renderizar a página no cliente não é problema, dado que hoje em dia os browsers estão cada vez mais rápidos (e mais comedores de RAM). Antes de continuar, gostaria de te perguntar... **Você já ouviu falar sobre micro frontends?**

### Micro Frontends

Se existem micro serviços, por que não podemos modularizar nosso frontend? Precisa realmente o frontend ser uma aplicação monolítica com centenas de milhares de linhas? Você pode buscar uma referência técnica no [micro-frontends](https://micro-frontends.org/) e o [artigo do Martin Fowler](https://martinfowler.com/articles/micro-frontends.html).

Confesso que quando comecei a estudar, achava um conceito bastante utópico, pois a ideia de separar nosso frontend em vários repositórios...Como ficaria o compartilhamento de dependências? Como poderia agregar múltiplas SPAs em uma SPA maior? Como compartilhar estados entre as minhas SPAs? E o CSS que pode atrapalhar os estilos de outras páginas?

São diversos problemas realmente, olhando assim, até parece mais interessante não separar, já que você cria vários problemas. Mas ter um frontend monolítico também tem seus problemas, tais eles:

- Código gigante e várias pessoas trabalhando no mesmo (mesmo com Git, sempre vai ter alguma cagada)
- Código gigante[2], porque códigos com milhares de linhas se tornam confusos
- Build demorado
- Lentidão no desenvolvimento
- Grande probabilidade de dead code (código não utilizado)
- Refatorações de códigos gigantes tendem a ser mais complicadas do que gostaríamos

Dados estes pontos, adotar uma estratégia de microfrontend talvez não seja algo tão doloroso assim. 

**Mas o que seria necessário para adotarmos um microfrontend?**

### NextJS vs Render

Antes de falar do Render, vamos analisar o ponto do NextJS. Com NextJS, podemos adotar uma estratégia de SSR e páginas que são cacheadas com valores preestabelecidos em tempo de build, isso realmente é incrível, performático e não nos dá nenhum trabalho adicional. Mas...ele ainda não resolve o nosso problema de ter múltiplos frontends conectados, mesmo sendo de repositórios diferentes.

Agora podemos falar do Render. Esse conceito de *Render* não é exatamente um conceito que você encontrará com esse nome, foi um nome dado por um grande amigo e mentor que desenvolveu uma aplicação que entregava frontends versionados. Ao conhecer esse conceito, tentei entender e adaptar para uma situação de microfrontends. Antes, vamos entender as funcionalidades do render.

- Http Server
- Ser um *proxy* para onde os frontends estão armazenados [1]
- Ser um *proxy* para as APIs chamadas pelos nossos frontends [2]
- Cachear os assets do nosso frontend
- Separar aplicações
- Versionar aplicações [3]

Explicando os 3 pontos em evidência.

1. Na estratégia do render, nossos frontends ficarão salvos em um cloud storage (AKA S3). Nesse cloud storage, teremos os builds do nosso frontend, cada build irá gerar uma versão, qual você poderá acessar como `/app/v0.0.1/`. Esse será o path da nossa aplicação
2. Esse é um caso opcional, dependerá da sua arquitetura, caso você não tenha um BFF (Backend for Frontend). No caso de chamadas para a nossa API, o Render irá resolver as URLs, chamando a ou as APIs que o nosso front fizer request, fazendo assim um proxy para que você tenha somente um entry point.
3. Um problema muito comum desde sempre é o cache. Se você builda seu front usando CRA (Create React App), por exemplo, ele irá gerar um hash para cada arquivo e assim poderá evitar o cache. Mas e se os seus assets forem versionados na URL? Sendo assim, mesmo que o conteúdo do arquivo seja o mesmo, o próprio browser não irá reconhecer como o mesmo arquivo e irá fazer um novo request para a nova versão. Como citado, `/app/v0.0.1/` é uma versão do front que irá ser usada até que `/app/v0.0.2/` seja lançada.

Talvez esse trecho fique um pouco abstrato, mas fica tranquilo que vou fazer mais um post sobre trazendo toda a parte de como o código funciona, primeiro vamos focar no conceito.

### Primeiras impressões

De começo, trabalhar com microfrontend não foi tão simples. Tive que entender como fazer o compartilhamento de dependência, gastar um pouco do tempo em configurações de webpack, e principalmente, compartilhar estado entre aplicações React que estão em árvores diferentes.

Compartilhar dependências ainda é o maior problema de todos, por que uma aplicação não conhece o build da outra, então não descobri uma forma decente de compartilhar dependências entre os frontends, a não ser fazendo um append em `window` da biblioteca que você quer, algo do tipo `window.React = React`.

A configuração do webpack precisou um pouco de boilerplate para JSX e Typescript, além do CSS Loader e Image Loader. Talvez o image loader não faça tanto sentido, já que imagens podem ser hospedadas em CDNs e assim, não estarem versionadas no projeto.

Compartilhar estado foi um desafio bem interessante, apenas com um useEffect + useState foi possível compartilhar o estado entre aplicações. Para isso, foi necessário utilizar `window.addEventListener` para notificar os subscribers do estado compartilhado.


### Conclusão

Sem dúvida, microfrontends são um desafio totalmente diferente daquilo que a maioria dos frontends estão habituados, é approach diferente para resolver problemas que talvez seriam complexos mantendo milhares de linhas de código. Em breve, eu irei escrever sobre a parte de código do render e sobre um pequeno Hello World usando um microfrontend. 

Isso é tudo, pessoal.