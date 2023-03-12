---
level: 0
subjects: ["typescript", "tricks"]
title: "Graphql"
language: "pt-br"
translations: ["pt-br"]
date: "2021-06-07T23:20:20.492Z"
description: "O 'matador' do REST ou só mais um hype?"
---

# Introdução

[Graphql](https://graphql.org/) é uma tecnologia muito com um hype absurdo, que propõe a resolver problemas de centralização dos dados, trazer o poder do cliente escolher quais dados julga necessários receber, trás um [_schema_](https://graphql.org/learn/schema/) que já possui uma documentação dos tipos entregues...só coisa boa né?

> PS: quando conheci graphql em 2017, fiquei num hype absurdo e até hoje ainda não consegui subir um sistema em produção que fosse amplamente usado. Triste...mas continuo na luta de implementar um graphql em larga escala

# O que é o graphql?

Graphql é uma query language que permite que o consumidor dos dados possam fazer queries com os dados que desejam receber. O servidor cria _schemas_ que definem as queries feitas. Cada _schema_ fornece meios para que você possa acessar dados dos objetos entregues pelo servidor.

Se liga nesse exemplo de schema:

```graphql
query {
  hero {
    name
    appearsIn
  }
}
```

Um exemplo direto do site do graphql, com a pequena mudança da adição do `query`. Essa query acima é realmente uma `query`, semelhante ao `GET` do `REST`, uma opção para pegar recursos dada as informações dos objetos especificados. Nesse exemplo, temos o objeto `hero` com os atributos `name`e `appearsIn`. Porém, o que são essas propriedades do objeto? Como podemos definir ou investigar qual o tipo a ser retornado?

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

Agora ficou fácil saber né? Mais ou menos. Vamos desmembrar essa query:

- `enum Episode`: Esse é um tipo especial que define os possíveis valores para um determinado campo. Você já deve ter ouvido falar de [enum em Typescript](https://www.typescriptlang.org/docs/handbook/enums.html)
- `type Character`: Definição do tipo do nosso objeto, neste caso, iremos chamar de **Character**
- `name: String`: definição da property name do tipo _String_, pertencente ao grupo de _scalar types_ ou em tradução literal, tipos escalares. Que são os tipos primários para a construção de outros tipos
- `name: String!`: Ainda sobre name, temos um `!`. Em graphql, o `!` (se você viu o meu [vídeo no YouTube](https://www.youtube.com/watch?v=EUJ5vWBT2iA&) vai saber que o nome certo é **brabo operator**) significa o NonNullable, ou não nulo.
- `appearsIn: [Episode!]!`: A notação `[]` significa um array/lista de types `Episode`. O `!` aparecendo duas vezes remete a um array não nulo e um `Episode` não nulo.

# [Scalar Types](https://graphql.org/learn/schema/#scalar-types)

Como citado acima, os [scalar types](https://graphql.org/learn/schema/#scalar-types) podem ser classificados como "primitivos" para que você possa escrever os outros tipos. Ao total, são 4 scalar types:

- Int: Números inteiros de 32 bits
- Float: números com ponto flutuante de dupla precisão. O `number` do [Javascript](https://www.w3schools.com/js/js_numbers.asp). Definição [IEEE_754](https://en.wikipedia.org/wiki/IEEE_754)
- String: Sequência de caracteres na codificação [UTF-8](https://datatracker.ietf.org/doc/html/rfc3629)
- Boolean: `true` ou `false`.

Você também pode estender a possibilidade de scalar types com a keyword `scalar`. Mas isso é um assunto pra um post específico de implementação do graphql.

# Matador do [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)

**Apenas não...é isso.**

Graphql e REST não deveriam ser considerados "adversários", na minha opinião. Graphql é uma tecnologia muito maneira, que trás diversos ganhos para sua vida como dev, mas trás muitos outros diversos problemas. Talvez até mais problemas do que benefícios. Eis alguns pontos de vistas a se considerar:

- **Mais uma camada de abstração**: É isso, o graphql acrescenta mais uma camada entre os seus dados e a lógica da sua aplicação. Isso pode não ser muito levado em conta por que utilizamos frameworks que abstraem isso, mas não se esqueça, a abstração está no framework.
- **Qualidade da implementação**: Ainda sobre acrescentar uma camada, temos o problema de implementação do graphql na linguagem que você utiliza. É preciso aplicar um parser na string que você recebe como query, transformar a string em um *schema parseavel* pelo algoritmo para que esse algoritmo transforme tudo isso em objetos da sua linguagem alvo.
- **Consistência dos dados**: O princípio do graphql é criar uma linguagem entre as APIs, de forma que você consiga agregar e centralizar buscas de informações para seus clientes consumirem de maneira mais fácil. Mas e se uma das APIs atualizarem e você não atualizar o seu *schema* ou a sua forma de pegar esses dados? Vai dar problema né?!
- **Autorização e autorização**: Apesar de estar no server, o graphql apenas agrega dados de outros lugares e os formata no *schema*. Mas e se o cliente tentar acessar um recurso que não deveria? Quem vai dizer que não deveria? O graphql ou a API que será consumida? E o retorno de erros para esse cliente? Essas perguntas são um pouco nebulosas e podem causar dúvidas na implementação
- **Retrocompatibilidade**: Esse é um problema quase que universal, mas em REST conseguimos resolver com o versionamento da API, mas no graphql pode ser um pouco trabalhoso versionar *schemas*. Apesar de existir `@deprecated`, ainda pode ser um problema caso você corte alguns pontos do seu schema

# Conclusão

Graphql é sem dúvidas uma grande tecnologia que podemos utilizar no nosso dia a dia. Não import a linguagem, você vai ter uma implementação em graphql. [Só olhar essa lista](https://graphql.org/code/). Como disse anteriormente, não faz sentido compararmos Rest e Graphql pois ambos se propõe a resolver o problema da entrega de dados com *approaches* diferentes, trazendo seus próprios benefícios e problemas.

Vale super a pena estudar essa tecnologia, fazer suas provas de conceitos e ver se faz sentido ou não implementar na arquitetura. 