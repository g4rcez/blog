---
useFolks: true
subjects: ["node","cli","javascript","typescript"]
title: "Node CLI"
language: "pt-br"
translations: ["pt-br"]
date: "2019-08-03T03:18:00.000Z"
description: "Automatizando tarefas pela linha de comando"
---

Como no dia 07/08 irei [apresentar sobre NodeJS e CLIs](https://www.meetup.com/pt-BR/Node-js-Rio/events/263378339/), resolvi escrever esse pequeno post para deixar como referência após a apresentação e também esclarecer as ideias antes de apresentar.

### Motivação

Durante um bom tempo eu utilizei bastante Bash e Python para fazer minhas ferramentas CLI, era um bom arsenal para realizar as tarefas, mas a manutenção começava a ficar ruim depois de um tempo, problemas de edentação quando havia migração de editores...

Um dia eu decidi começar a pesquisar sobre o ferramental de NodeJS e tudo mudou. Como eu sempre tendi mais ao lado de frontend, Javascript era uma linguagem que estava no sangue, e então comecei a fazer todos os meus scripts de Python em NodeJS e com isso obtive o mesmo resultado, porém com um código mais consiso. **_Ainda mais quando decidi colocar [Typescript](https://www.typescriptlang.org) no meio disso tudo_**.

### npm init

Como o mundo de JS é bastante vasto, existem centenas de boilerplates pra você seguir, como configurar, best practices e blábláblá...mas eu prefiro o basicão pra seguir o [KISS](https://en.wikipedia.org/wiki/KISS_principle).

Vou me ater ao simples de uma CLI pra ordenar versões de tags do git. Usando bash, poderiamos usar o comando `sort`, fazendo o seguinte comando `git tag | sort -V`. Mas como o foco é um CLI em NodeJS, vamos lá:

```bash
$ mkdir my-cli
$ cd my-cli
$ npm init -y
```

Usei `npm init -y` pra ser mais rápido. Mas isso já da pra começar a fazer os ajustes necessários pra começar a escrever código. Temos uns passos a serem executados:

1. Inserir a chave `main` e `bin` com o path de entrypoint da aplicação no `package.json`
2. Criar o diretório para código TS
3. Configurar o `tsconfig.json` e um `tslint.json` para fortalecer o desenvolvimento
4. Instalar as dependências
5. Codar!!! Codar!!! Codar!!!

#### Main no package.json

```json
{
	"name": "alfred",
	"version": "3.0.28",
	"description": "",
	"main": "./cli/index.js",
	"bin": {
		"alfred": "./cli/index.js"
	},
	"scripts": {
		"build": "tsc -p .",
		"prettier": "prettier --write \"{.,src/**}/*.{js,jsx,ts,tsx}\""
	},
	"keywords": [],
	"author": "g4rcez",
	"license": "MIT"
}
```

Como vamos usar [Typescript](https://www.typescriptlang.org), tanto `main` quanto `bin` são os diretórios de transpilação

> Apesar do mundo inteiro dizer compilar JS, esse termo é errado pois TS transpila JS e não compila. Afinal de contas, o bundle não é um arquivo binário.

<small style="margin-top:-2em">Essa é a sua cara nesse exato momento</small>
<img src="https://media.giphy.com/media/1L5YuA6wpKkNO/source.gif" style="width:100%"/>

**Mas como irei programar com TS se NodeJS não roda TS?**

#### Escrevendo TS

O primeiro passo antes de tudo é criar um `tsconfig.json`. Caso você não tenha typescript no PC, vamos resolver isso agora para fazer nossa CLI

```bash
$ npm i -g typescript
$ tsc --init
```

E pronto, já temos o nosso `tsconfig.json` e vamos deixar ele com essa cara:

```json
{
	"compilerOptions": {
		"target": "es5",
		"module": "commonjs",
		"lib": ["esnext", "es7"],
		"allowJs": false,
		"declaration": true,
		"declarationMap": true,
		"outDir": "./cli",
		"rootDir": "./src",
		"removeComments": true,
		"importHelpers": true,
		"downlevelIteration": true,
		"strict": true,
		"esModuleInterop": true
	}
}
```

Se você estiver no VsCode, aconselho usar `CTRL+Space` nos campos para ver o que há disponível e se aventurar com suas próprias configurações. Caso queira alguma referência, [esse é o meu `tsconfig.json` que costumo usar no trabalho/projetos](https://gist.github.com/g4rcez/0848b503288f08e7a9592f04576c7f4a).

Como vamos usar TS, é bom em conjunto usar o [`TSLint`](https://palantir.github.io/tslint/) pra evitar quaisquer :shit:.

```bash
npm i -g tslint
tslint --init
```

E caso queira [referência, esse é o meu `tslint.json`](https://gist.github.com/g4rcez/1218bcfe10e930adf1e4f8aa0be91cf9).

#### Dependências

Como todo bom programador em NodeJS, você deve ser dependente de diversos...pacotes. E pra fazer uma CLI não é diferente.

> Eu curto utilizar o yarn sempre que possível nos meus projetos, pra caso um dia eu pense em usar o workspaces do yarn

```bash
$ yarn add typescript semver commander signale chalk
$ yarn add --dev @types/node @types/semver @types/signale
```

Tirando `typescript`, os demais são novos, então vou explicar

-   [semver](https://github.com/npm/node-semver): Para versionamento semântico. Você pode olhar sobre o [semver no site oficial e entender sobre versionamento de software](https://semver.org)
-   [commander](https://github.com/tj/commander.js/): Esse é o meu gerenciador de argumentos da CLI favorito. Um ótimo suporte para codar no estilo `getopt.h` do C ou programas no `git style`
-   [signale](https://github.com/klaussinani/signale): Um log extremamente útil e com diversas features para exibir mensagens
-   [chalk](https://github.com/chalk/chalk): Pense num CSS para seu terminal, é o mais simples pra explicar

Os types são `devDependencies` para nos auxiliar com o typing do TS

#### Desenvolvimento selvagem

Pronto, tudo certo (eu espero que sim...) para o desenvolvimento selvagem. Primeiro o código e depois a explicação

```typescript
import cli from "commander";
import { exec } from "child_process";
import semver from "semver";
import signale from "signale";
const program = new cli.Command();

/*
    Vamos usar $ por ser o símbolo que identifica a shell usuários
    no Unix, não por causa do Jquery
*/
const $ = (command: string): Promise<string> =>
	new Promise((res, rej) =>
		exec(command, (err, stdout, stderr) => {
			if (err) {
				return rej(stderr);
			}
			return res(stdout);
		})
	);

//  Como não exigimos parâmetros aqui, então não esperamos receber nada
const Tags = () => {
	try {
		const gitOutput = await $("git tag"); // Output de todas as tags
		const tags = gitOutput.split("\n");
		// Uma ordenação simples de acordo com as versões apresentadas
		// Versões não válidas ficaram no topo da pilha
		tags.sort((v1: string, v2: string) => {
			if (semver.valid(v1) && semver.valid(v2)) {
				if (semver.eq(v1, v2)) {
					return 0;
				}
				return semver.gte(v1, v2) ? 1 : -1;
			}
			return -1;
		});
		signale.success(tags.join("\n"));
	} catch (e) {}
};

program
	.version("0.0.1")
	.allowUnknownOption(false)
	.description("Ordenador de tags")
	.usage("tag")
	.command("tag")
	.name("my-cli")
	.alias("t")
	.description("Ordena as tags do repositório git corrente")
	.action(Tags);

if (process.argv.length === 2) {
	program.help();
	process.exit();
}
program.parse(process.argv);
```

E pronto, temos nosso primeiro CLI em TS. Para você rodar ele como Node, basta realizar esses passos

```bash
$ tsc # Isso irá transpilar do diretório src para cli
$ node cli tag # Ou então
$ node cli t # alias definido no programa
```

Não vou deixar de explicar como podemos fazer para receber os parâmetros no caso de ser necessário, é bem simples usando a interface do commander, só fazer da seguinte maneira

```typescript
/*
    Os mesmos imports anteriormente e quase o mesmo código.
    Agora iremos receber params para ter acesso ao que foi recebido.
    Vou colocar o tipo any pra não ficar
    muito verboso (e nesse caso específico),
    eu acabo não tipando pois as vezes é no GoHorse

    Acaba que na própria definição no seu schema do commander vc anota
    os tipos que irá receber com os seus argumentos do programa
*/
const Tags = (params: any) => {
	try {
		// Até o próximo comentário, ta tudo igual
		const gitOutput = await $("git tag"); // Output de todas as tags
		const tags = gitOutput.split("\n");
		tags.sort((v1: string, v2: string) => {
			if (semver.valid(v1) && semver.valid(v2)) {
				if (semver.eq(v1, v2)) {
					return 0;
				}
				return semver.gte(v1, v2) ? 1 : -1;
			}
			return -1;
		});
		// Até aqui, nada mudou, mas vamos colocar um info e estilizar
		// com o chalk pra dizer que mostrei ele
		signale.info(chalk.bold.visible.underline.blue(params.msg));
		signale.success(tags.join("\n"));
	} catch (e) {}
};

program
	.version("0.0.1")
	.allowUnknownOption(false)
	.description("Ordenador de tags")
	.usage("tag")
	.command("tag")
	.name("my-cli")
	.alias("t")
	// Aqui está o novo trecho no commander
	// Ele irá entregar uma property "msg" para você usar como valor
	// caso não exista, ela será o valor padrão que definiu
	// E se não definir, será undefined
	.option(
		"-m, --msg <mensagem>",
		"Mensagem a ser exibida antes de exibir as tags",
		"Ordenação de tags"
	) // "Ordenação de tags" é a mensagem padrão caso não haja
	.description("Ordena as tags do repositório git corrente")
	.action(Tags);

if (process.argv.length === 2) {
	program.help();
	process.exit();
}
program.parse(process.argv);
```

Bom, creio que isso seja o necessário para que todos possam começar a fazer suas CLI com NodeJS
e considerar manter como sua linguagem para scripts, afinal de conta NodeJS é Java**SCRIPT**.


