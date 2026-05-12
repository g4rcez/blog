---
level: 1
title: Como estudar frontend?
subjects: ["react", "frontend", "typescript", "javascript"]
language: "pt-br"
translations: ["pt-br", "en-us"]
date: "2023-12-21T05:30:00.000Z"
description: "Como definir sua trilha de estudos com frontend?"
---

> Ainda não pude escrever sobre, mas comecei a fazer lives na [twitch.tv/allangarcez](https://twitch.tv/allangarcez) falando sobre desenvolvimento Backend/Frontend, com foco em NodeJS, React e Typescript.

A área de TI é bastante comentada, mas nem sempre é claro como começar a estudar. Este artigo tem como objetivo orientar quem está iniciando a trilha de estudos em frontend e dar uma visão sobre carreira.

Este post terá foco na carreira de frontend. Conteúdo sobre backend será abordado em artigos futuros.

# Por onde começar?

O primeiro passo importante para definir seus estudos é conhecer um pouco mais da área como um todo. Busque entender o que faz um frontend, um devops, um backend ou até mesmo um engenheiro de dados. Mesmo que superficialmente você conheça, já é uma boa dica para direcionar o que você busca, de acordo com seus gostos e aptidões.

Como dito anteriormente, aqui falarei de frontend, então iremos explorar toda a trilha do desenvolvedor web, voltado para o navegador. Aqui você entenderá o que é necessário estudar para começar a criar seus sites, landing pages (páginas iniciais de sites super bonitos) e sistemas web que podem ou não se comunicar com serviços externos.

Não é o foco do post ensinar cada uma das tecnologias, mas te dar um direcionamento para começar com cada uma das tecnologias, abordando os conceitos, práticas e ferramentas mais utilizadas de cada um.

# HTML, onde tudo começa

HTML ou Hyper Text Markup Language é uma linguagem de marcação para sinalizar ao navegador a estrutura da sua página. Pense no HTML como o esqueleto e músculos do corpo humano, sendo a base que sustenta tudo no corpo, mas não se engane, você ainda precisa ter a aparência ([CSS](#css)) e o sistema nervoso ([Javascript](#javascript)) para tudo funcionar como deveria. O HTML permite marcar páginas com títulos, textos, blocos, links e parágrafos — ou até mesmo referências para outros sites através do elemento `iframe`.

O HTML é essencial para você começar a desenvolver seus sites, sem saber a semântica do HTML, você não irá evoluir nos seus estudos, então é bom fundamentar a base nessa tecnologia e principalmente nos conceitos ao redor dela.

## Referências para HTML

- [W3c Schools](https://www.w3schools.com/html/): A escola de todo iniciante na web
- [Mozilla Developer Network - MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTML): O guia que você sempre irá buscar
- [Como iniciar com HTML?](https://www.freecodecamp.org/news/introduction-to-html): Freecodecamp, um site ótimo para consultas e tutoriais sobre tecnologia

## Conceitos

Aqui vou deixar uma lista de conceitos que são aconselhados a serem estudados, lembre-se que você não precisa ser um mestre no assunto, seu estudo deve ser gradual. Comece estudando um pouco para saber do que se trata, conforme você evoluir mais com tecnologia num geral, você pode ir aperfeiçoando a profundidade de conhecimento.

- [O que é o DOM?](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- [Acessibilidade](https://www.a11yproject.com/): Por uma web sem barreiras, não importa como você usa o browser.
- [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState): API nativa do navegador para validação de formulários

## Você pode precisar de ferramentas

- [Can I use?](https://caniuse.com/): Será que você pode usar um recurso em todos os browsers?
- [Icon Monster](https://iconmonstr.com/): Você pode precisar de ícones customizados para seus sites.
- [W3c Validator](https://validator.w3.org/): Ferramenta para verificar se o HTML está correto conforme os padrões

# CSS

Se o HTML é a estrutura do corpo, o CSS é a aparência, definindo a cor dos cabelos, olhos, pele e tudo mais o que for relacionado a aparência. CSS é uma tecnologia bem divertida, mas não se deixe enganar pois também é traiçoeira. Digo isso porque CSS significa Cascading Style Sheets, ou folha de estilos em cascata. Se você sabe o que é uma cascata, sabe que a água cai de cima para baixo, assim como os estilos do CSS. São definidos de cima para baixo, assim como você escreve numa folha. 

Basta dizer o nome do que deseja estilizar, as propriedades que quer estilizar e você terá um elemento bonito na tela, simples assim. Mas nunca se esqueça das regras de cascata, pois o estilo definido abaixo pode sobrescrever o estilo de cima.

## Referências para CSS

- [W3c Schools](https://www.w3schools.com/css/): Aqui sempre é um ótimo ponto de partida para tecnologias da web
- [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS): Você sempre vai ver o MDN, seu novo melhor amigo para estudos de tecnologias web
- [Orgamid](https://www.origamid.com/): Vou deixar esse curso aqui que foi um curso que sempre me ajudou muito a entender sobre CSS, e com certeza vai ajudar você também

## Conceitos

- [Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox): Uma forma simples de estruturar visualmente os seus blocos nos sites
- [Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/grid): Alternativa ao flex, sendo mais voltado para layouts fixos
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations): Se você gosta do seu lado criativo, as animações vão trazer vida aos seus sites

## Frameworks 

Com CSS é possível trazer toda a identidade visual de uma marca, animações e elementos estilizados ao frontend. Para isso, existem diversas técnicas e frameworks (ferramentas que oferecem um conjunto de código pronto) disponíveis:

- [FCSS](https://www.htmlgoodies.com/css/brief-introduction-to-functional-css/): Uma solução para o problema de cascata do CSS
- [Bem Syntax](https://getbem.com/introduction/): Monte os seus estilos através de blocos
- [RSCSS](https://ricostacruz.com/rscss/): Uma solução voltada para componentes e escopos de estilo

## Ferramentas

- [Bootstrap](https://getbootstrap.com/): Um dos frameworks CSS mais conhecidos e utilizados no mundo. Oferece componentes e estilos prontos para uso.
- [Tailwindcss](https://tailwindcss.com/): Framework utility-first que permite estilizar diretamente no HTML com classes utilitárias.

# Javascript

A parte final do corpo humano, o sistema nervoso. E o Javascript é quem vai fazer o trabalho de ser a central e o cérebro do nosso site, controlando as ações, eventos e interagindo com o usuário através de código. Importante lembrar que Javascript é uma linguagem de programação, diferente de HTML e CSS. Isso significa que você precisará ter conceitos de lógica de programação e estrutura de dados para poder se aventurar com Javascript de forma mais fluída.

Por ser uma linguagem de programação, Javascript tem um poder absurdo de fazer literalmente qualquer coisa no browser, basta você saber as APIs *(Application Programming Interface ou Interface de programação para aplicações, uma forma de abstrair códigos complexos em um código mais simples)* e será possível você realizar.

## Referências para Javascript

- [W3c Schools](https://www.w3schools.com/js/): Ponto de partida para aprender os fundamentos do JavaScript
- [MDN](https://developer.mozilla.org/en-US/docs/Web/Javascript): Referência completa sobre JavaScript e APIs do navegador
- [The Algorithms](https://github.com/TheAlgorithms/JavaScript): Implementações de algoritmos em JavaScript

# Typescript

Durante seu aprendizado de Javascript, você pode se deparar com problemas do tipo `Cannot read properties of undefined`.
E isso ocorre devido ao tipo da sua variável ser undefined. Geralmente, esse tipo de problema pode ser evitado caso você
utilize linguagens tipadas, como Typescript, Java, C#...E por falar em Typescript, essa com certeza deve ser uma
linguagem para adicionar no seu mapa de estudos.

[Typescript](https://www.typescriptlang.org/) é um superset de Javascript, adicionando tipos a linguagem e tornando sua
vida muito mais simples. Por aqui no blog você pode achar vários [tópicos sobre Typescript](https://garcez.dev/?q=typescript).

## Referências para Typescript

- [Documentação oficial](https://www.typescriptlang.org/)
- [Total Typescript](https://www.totaltypescript.com/): Um ótimo curso com bastante material gratuito para te ajudar
- [Type level Typescript](https://type-level-typescript.com/): Outro curso que com certeza vai te ajudar na caminhada

# Frameworks

Para otimizar sua produtividade com código, você vai precisar conhecer e estudar alguns frameworks mais utilizados do
mercado. Sem extender muito, deixarei uma lista dos mais utilizados de cada tópico.

## Javascript/Typescript - Frontend

- [ReactJS](https://react.dev/)
- [AngularJS](https://angular.io/)
- [VueJS](https://vuejs.org/)

## CSS

- [Tailwindcss](https://tailwindcss.com)
- [Bootstrap](https://getbootstrap.com/)
- [Foundation](https://get.foundation/)

## Bibliotecas

Esses daqui são tópicos interessantes a se estudarem, mas que não se englobam como frameworks

- [Lodash](https://lodash.com/): Funções utilitárias para você evitar repetição de código
- [DateFNS](https://date-fns.org/): Utilitários para trabalhar com datas
- [D3js](https://d3js.org/): A mais famosa biblioteca para se trabalhar com gráficos
- [Axios](https://axios-http.com/docs/intro): Biblioteca para requests HTTP
- [Ant Design](https://ant.design/): Uma biblioteca de componentes visuais para ReactJS

Obrigado pelo seu tempo, tamo junto e até a próxima