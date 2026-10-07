---
level: 0
subjects: ["javascript", "typescript"]
title: "JS tricks: evitando ifs"
language: "pt-br"
translations: ["pt-br", "en-us"]
date: "2019-12-16T23:59:59.999Z"
description: "Substituindo condicionais aninhadas por dados"
---

# Introdução

_Esse pattern provavelmente tem um nome conhecido, mas o nome é menos importante do que a ideia._

Em um grupo do Telegram, um desenvolvedor perguntou:

> Preciso fazer este algoritmo sem usar if. Alguém poderia me ajudar?

O algoritmo precisava usar sexo, idade e tempo de trabalho para determinar se a pessoa poderia se aposentar. Antes que eu pudesse responder, alguém o escreveu com um ternário. Foi uma solução engenhosa, mas apenas trocou uma forma de condicional por outra.

Essa situação me fez lembrar de um algoritmo de IMC que escrevi na faculdade. Ele precisava ter baixa complexidade e ser fácil de testar, porque a disciplina era sobre testes. Todos começaram com uma implementação rápida e acabaram produzindo ninhos de **ifs**. Preferi parar para pensar antes de escrever e cheguei à seguinte abordagem:

1. Criar um enum para masculino e outro para feminino, onde havia o menor índice e o maior índice para cada categoria
2. Receber a entrada e fazer o cálculo normalmente.
3. Com o resultado, buscar nos enums o intervalo que satisfaz a condição correspondente.

Em Java, a solução ficou bem mais verbosa — cerca de seis arquivos para um problema relativamente simples —, mas atendeu a todas as condições do desafio.

O restante do artigo aplica a mesma ideia em JavaScript e TypeScript.

# Definindo nossos casos

```typescript
type Sex = "M" | "F";
type Medidas = { peso: number; altura: number };

const titles = {
    abaixoDoPeso: "Abaixo do peso",
    normal: "Peso normal",
    poucoAcimaDoPeso: "Um pouco acima do peso",
    acimaDoPeso: "Acima do peso ideal",
    obeso: "Obesidade",
};

// Os valores não condizem com o real, eu fiz TI e não medicina.
// Consulte o médico e beba água
const parametros = {
    M: [
        {title: titles.abaixoDoPeso, min: 0, max: 20.7},
        {title: titles.normal, min: 20.7, max: 26.4},
        {title: titles.poucoAcimaDoPeso, min: 26.4, max: 27.8},
        {title: titles.acimaDoPeso, min: 27.8, max: 31.1},
        // Esse caso é absurdo, mas precisamos cobrir tudo acima de 31.1
        {title: titles.obeso, min: 31.1, max: Number.MAX_SAFE_INTEGER},
    ],
    F: [
        {title: titles.abaixoDoPeso, min: 0, max: 19.1},
        {title: titles.normal, min: 19.1, max: 25.8},
        {title: titles.poucoAcimaDoPeso, min: 25.8, max: 27.3},
        {title: titles.acimaDoPeso, min: 27.3, max: 32.3},
        {title: titles.obeso, min: 32.3, max: Number.MAX_SAFE_INTEGER},
    ],
};

const calculo = ({peso, altura}: Medidas) => peso / altura ** 2;

const sexo = "M" as Sex; // o input vem do usuário
const altura = 1.8;
const peso = 77;
const imc = calculo({altura, peso});
const val = parametros[sexo].find(
    (medida) => medida.min <= imc && imc <= medida.max
);
console.log("Status", val.title);
console.log("IMC", imc);
```

Esse é o mesmo algoritmo que escrevi em Java, agora expresso em bem menos linhas de JavaScript. Veja o que cada parte faz:

1. Como ficou em TS, primeiro a definição dos tipos
2. Definição dos títulos em `titles`
3. Aqui os parâmetros de acordo com o sexo, temos uma lista de objetos contendo o título, o mínimo do IMC e o máximo do
   IMC para cada categoria.
4. `calculo` já diz tudo, é nossa função que irá fazer o cálculo do IMC
5. De `sexo` até `imc` não temos nada de diferente ou gritante. Mas fica um **bônus**, ultimamente tenho optado por usar
   parâmetros como objetos, assim posso nomear meus parâmetros recebidos na função e evita a confusão de parâmetros
   posicionais, principalmente quando você não tem tipos
6. Em `val` fazemos um `find` do objeto na nossa lista de `parametros` para identificar o título, mínimo e máximo do IMC
7. Por fim, exibimos os valores

Essa é a técnica para evitar **ifs** aninhados. Para comparação, veja como seria a implementação com condicionais:

```typescript
if (sexo === "M") {
    if (0 <= imc && imc <= 20.7) {
        return {title: titles.abaixoDoPeso, min: 0, max: 20.7};
    }
    if (20.7 <= imc && imc <= 26.4) {
        return {title: titles.normal, min: 20.7, max: 26.4};
    }
    if (26.4 <= imc && imc <= 27.8) {
        return {title: titles.poucoAcimaDoPeso, min: 26.4, max: 27.8};
    }
    if (27.8 <= imc && imc <= 31.1) {
        return {title: titles.acimaDoPeso, min: 27.8, max: 31.1};
    }
}
if (sexo === "F") {
    // o mesmo ninho de ifs
}
throw Error("Algo de errado não está certo");
```

Observe como a solução fica mais complexa. Alterar um valor ou adicionar uma regra exige mais **ifs**, aumentando o custo de manutenção.

> Uma pergunta natural é: com várias condicionais, como tratar o caso em que nenhuma condição é atendida?

Um ponto válido. É necessário proteger a entrada contra casos inválidos. Um simples guard clause resolve isso:

```typescript
if (!parametros.hasOwnProperty(sexo)) {
    throw Error("Algo certo está errado");
}
// Fluxo normal do seu programa aqui
// É legal abortar os erros primeiro
```

A guard clause completa o exemplo e mantém o fluxo principal concentrado nas entradas válidas.
