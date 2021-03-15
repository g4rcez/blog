---
useFolks: true
subjects: ["javascript","tricks"]
title: "JS Tricks, evitando ifs"
language: "pt-br"
translations: ["pt-br"]
date: "2019-12-16T23:59:59.999Z"
description: "Estratégia para substituir ninhos de if"
---

_Antes de mais nada, provavelmente existe um nome muito maneiro para este tipo de pattern, mas eu não lembro. E pra não perder a ideia do post, vou escrever sem pesquisar o nome, foi mal :cry:_

Estava num grupo do telegram e vi um cara falando:

> Preciso fazer este algoritmo sem usar if. Alguém poderia me ajudar?

O algoritmo era basicamente pegar o sexo, idade e tempo de trabalho para dizer se a pessoa poderia se aposentar ou não. Antes que eu pudesse responder, alguém escrever o algoritmo com um ternário, fucking gênio :sunglasses:. Mas isso é um hack.

Essa situação me fez lembrar um algoritmo de IMC que tive que fazer na faculdade, utilizando Java e ele precisava ter uma complexidade baixa e ser facilmente testável (a matéria era sobre testes). Todo mundo começou a escrever no melhor estilo GoHorse e fizeram **ifs** e **ifs** para realizar os cálculos. Eu já achei melhor parar pra pensar antes de escrever e acabei fazendo o seguinte:

1. Criar um enum para masculino e outro para feminino, onde havia o menor índice e o maior índice para cada categoria
2. Receber a entrada e fazer o cálculo normalmente.
   3 Com o resultado, buscar nos enums o intervalo que satisfaça a condição do resultado obtido no cálculo

Claro que em Java isso fica complexo, acabou dando uns 6 arquivos para uma coisa simples, mas atendi a todas as condições do desafio hehehe

Como o título deste post é evitar os **ifs**, vamos pra essa trick agora em JS/TS.

### Definindo nossos casos

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
		{ title: titles.abaixoDoPeso, min: 0, max: 20.7 },
		{ title: titles.normal, min: 20.7, max: 26.4 },
		{ title: titles.poucoAcimaDoPeso, min: 26.4, max: 27.8 },
		{ title: titles.acimaDoPeso, min: 27.8, max: 31.1 },
		// Esse caso é absurdo, mas precisamos cobrir tudo acima de 31.1
		{ title: titles.obeso, min: 31.1, max: Number.MAX_SAFE_INTEGER },
	],
	F: [
		{ title: titles.abaixoDoPeso, min: 0, max: 19.1 },
		{ title: titles.normal, min: 19.1, max: 25.8 },
		{ title: titles.poucoAcimaDoPeso, min: 25.8, max: 27.3 },
		{ title: titles.acimaDoPeso, min: 27.3, max: 32.3 },
		{ title: titles.obeso, min: 32.3, max: Number.MAX_SAFE_INTEGER },
	],
};

const calculo = ({ peso, altura }: Medidas) => peso / altura ** 2;

const sexo = "M" as Sex; // o input vem do usuário
const altura = 1.8;
const peso = 77;
const imc = calculo({ altura, peso });
const val = parametros[sexo].find(
	(medida) => medida.min <= imc && imc <= medida.max
);
console.log("Status", val.title);
console.log("IMC", imc);
```

Bom, esse é exatamente o algoritmo que fiz em Java, porém traduzido para Javascript, e em bem menos linhas. Vamos rever por partes

1. Como ficou em TS, primeiro a definição dos tipos
2. Definição dos títulos em `titles`
3. Aqui os parâmetros de acordo com o sexo, temos uma lista de objetos contendo o título, o mínimo do IMC e o máximo do IMC para cada categoria.
4. `calculo` já diz tudo, é nossa função que irá fazer o cálculo do IMC
5. De `sexo` até `imc` não temos nada de diferente ou gritante. Mas fica um **bônus**, ultimamente tenho optado por usar parâmetros como objetos, assim posso nomear meus parâmetros recebidos na função e evita a confusão de parâmetros posicionais, principalmente quando você não tem tipos
6. Em `val` fazemos um `find` do objeto na nossa lista de `parametros` para identificar o título, mínimo e máximo do IMC
7. Por fim, exibimos os valores

É isso, esse foi bem rápido, apenas para mostrar essa trick e fazer com que você evite **ifs** aninhados. Consegue imaginar como seria o código utilizando ifs? Bom, eu faço aqui pra você

```typescript
if(sexo === "M"){
    if(0 <= imc && imc <= 20.7 ){
       return { title: titles.abaixoDoPeso, min: 0, max: 20.7 }
    }
    if(20.7 <= imc && imc <= 26.4 ){
        return { title: titles.normal, min: 20.7, max: 26.4 }
    }
    if(26.4 <= imc && imc <= 27.8){
        return 	{ title: titles.poucoAcimaDoPeso, min: 26.4, max: 27.8 }
    }
    if(27.8 <= imc && imc <= 31.1){
        return { title: titles.acimaDoPeso, min: 27.8, max: 31.1 }
    }
}
if(sexo === "F"){
    // o mesmo ninho de ifs
}
throw Error("Algo de errado não está certo")
```

Viu como fica bem mais complicado? E se você precisar mudar algum valor? E se houverem novas regras? Resposta: vão haver mais e mais **ifs**

> Mas Allan, nesse caso com vários ifs, nós temos um "else" para caso não seja atendido e no seu exemplo de objetos não tem isso

Muito perspicaz, caro leitor. Onde eu estava com a cabeça? Precisamos proteger a entrada de casos absurdos. Não é nada absurdo, apenas um if e tá "safe":

```typescript
if (!parametros.hasOwnProperty(sexo)) {
    throw Error("Algo certo está errado")
}
// Fluxo normal do seu programa aqui
// É legal abortar os erros primeiro
```

Bom, agora sim ficou tudo esclarecido, assim espero. Qualquer coisa você sabe onde me encontrar :joy: