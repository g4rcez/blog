---
level: 0
subjects: ["typescript"]
title: "Typescript 101 - [1]"
language: "pt-br"
translations: ["pt-br"]
date: "2020-02-20T23:29:59.999Z"
description: "Vantagens e desvantagens"
---

# Introdução

No artigo anterior eu comecei a falar de Typescript. Um amigo indicou fazer um artigo falando do por que usar, e cá estou escrevendo sobre.

> Agradecimento pela sugestão do tema.

# Prós e contras

Esta análise tem uma inclinação pessoal, já que a experiência com TypeScript foi bastante positiva. Ainda assim, o objetivo é apresentar os dois lados de forma honesta para que você possa tomar sua própria decisão.

# Contras

Os contras serão apresentados primeiro, para que você possa avaliar se algum ponto é decisivo antes de continuar a leitura.

1. Curva de aprendizado: mesmo que TS possa conviver JS sem nem atrapalhar (dependendo das suas configurações), trabalhar com uma linguagem tipada pode ser um pouco doloroso pra quem nunca trabalhou com linguagens desse tipo. Você pode usar `any` e `unknown` em tudo, mas isso mata totalmente o sentido de usar TS
2. Falta de flexibilidade: na falta de um nome melhor para "fazer gambiarras", acabei escolhendo esse. Quando se tem um sistema de tipos bem definido, você não pode fazer tão facilmente algumas tricks que o JS te permite, pois o TS irá assegurar de que não hajam leaks na implementação, travando o recebimento de tipos inesperados
3. Runtime: não há runtime. Infelizmente TS só funciona em desenvolvimento e não irá assegurar que os tipos dos valores das suas funções runtime recebam exatamente os tipos que você esperava em Dev. Apesar de ser difícil de algo quebrar por conta de tipos errados, qualquer inconsistência que você introduzir em um fluxo de dados poderá causar uma falha inesperada. Por isso é bom evitar o uso de coisas como `any` e `unknown`.
4. Um step a mais no build: embora hoje eu não veja muitos problemas em configurar a transpilação, você pode achar isso um problema por não estar acostumado.

# Prós

Um argumento comum entre defensores de linguagens tipadas é que os benefícios de uma linguagem estática tornam difícil justificar o uso de linguagens dinâmicas para projetos de médio e grande porte.

1. Você conhece seus valores: uma das melhores coisas é você poder autocompletar as properties das suas entidades, saber o tipo do argumento posicional que vai precisar passar a uma função
2. Auto documentação: não é que você não precisa documentar ou escrever um código legível, mas os tipos nos apresentam exatamente o que precisamos passar/receber das funções.
3. Adeus ao undefined: um dos problemas mais comuns ou quiçá o mais comum do mundo JS pode ser evitado em TS graças ao transpilador nos avisar todas as possibilidades de coisas nulas e indefinidas
4. JS Latest: Typescript irá garantir que você sempre estará usando a versão mais recente (com todas as features) de Javascript, sem precisar de muita configuração

# Experiência no uso

A curva para se usar Typescript é bem linear. Eu costumo dizer que aprender Typescript é fácil, mas masterizar é um pouco mais complicado (talvez pelo fato da tipagem envolver conceitos de programação funcional e orientada a objetos).

No começo, você pode se enrolar um pouco em tipar o seu ecossistema, mas enquanto você não se sente seguro, você pode não habilitar o `alwaysStrict` para tipar somente quando sentir que há necessidade. Typescript ainda permite checar arquivos `.js` e ainda poder usar `.js` e `.ts` ao mesmo tempo.

Conforme você avançar no estudo em TS, é sempre interessante voltar e refatorar seu código para garantir que não há inconsistências de tipos (algumas inconsistências podem causar alguns bugs que você talvez não tenha identificado).

Obrigado pelo seu tempo, tamo junto e até a próxima
