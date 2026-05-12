---
level: 0
subjects: ["nodejs", "javascript", "typescript"]
title: "Node CLI"
language: "pt-br"
translations: ["pt-br", "en-us"]
date: "2019-08-03T03:18:00.000Z"
description: "Automatizando tarefas pela linha de comando"
---

# Introdução

Como no dia 07/08/2019 irei [apresentar sobre NodeJS e CLIs](https://www.meetup.com/pt-BR/Node-js-Rio/events/263378339/), resolvi escrever esse pequeno post para deixar como referência após a apresentação e também esclarecer as ideias antes de apresentar.

# Motivação

Durante um bom tempo, Bash e Python foram as ferramentas utilizadas para construir CLIs. Eram soluções funcionais, mas a manutenção se tornava custosa com o tempo — especialmente com problemas de indentação ao migrar entre editores.

Ao começar a pesquisar sobre o ferramental de NodeJS, a perspectiva mudou. Com maior familiaridade com frontend e JavaScript, foi possível reescrever os scripts em NodeJS e obter os mesmos resultados com um código mais conciso. **_Ainda mais quando decidi colocar [Typescript](https://www.typescriptlang.org) no meio disso tudo_**.

# npm init

Como o ecossistema de JavaScript é bastante vasto, existem centenas de boilerplates disponíveis, cada um com suas configurações e boas práticas. Neste post, a preferência é pelo mínimo necessário, seguindo o princípio [KISS](https://en.wikipedia.org/wiki/KISS_principle).

Vou me ater ao simples de uma CLI pra ordenar versões de tags do git. Usando bash, poderiamos usar o comando `sort`, fazendo o seguinte comando `git tag | sort -V`. Mas como o foco é um CLI em NodeJS, vamos lá:

```bash
$ mkdir my-cli
$ cd my-cli
$ npm init -y
```

O flag `-y` aceita os valores padrão do `npm init` automaticamente. A partir daí, os ajustes necessários para começar a escrever código são os seguintes:

1. Inserir a chave `main` e `bin` com o path de entrypoint da aplicação no `package.json`
2. Criar o diretório para código TS
3. Configurar o `tsconfig.json` e um `tslint.json` para fortalecer o desenvolvimento
4. Instalar as dependências
5. Implementar o código

# Main no package.json

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

> Apesar do mundo inteiro dizer compilar JS, esse termo é errado, pois TS transpila JS e não compila. Afinal de contas, o bundle não é um arquivo binário.

**Mas como programar em TS se NodeJS não executa TypeScript diretamente?**

# Escrevendo TS

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

Para manter a qualidade do código TypeScript, recomenda-se utilizar o [`TSLint`](https://palantir.github.io/tslint/).

```bash
npm i -g tslint
tslint --init
```

E caso queira [referência, esse é o meu `tslint.json`](https://gist.github.com/g4rcez/1218bcfe10e930adf1e4f8aa0be91cf9).

# Dependências

Como é comum em projetos NodeJS, algumas dependências são necessárias para o desenvolvimento de uma CLI.

```bash
$ yarn add typescript semver commander signale chalk
$ yarn add --dev @types/node @types/semver @types/signale
```

Tirando `typescript`, os demais são novos, então vou explicar

- [semver](https://github.com/npm/node-semver): Para versionamento semântico. Você pode olhar sobre o [semver no site oficial e entender sobre versionamento de software](https://semver.org)
- [commander](https://github.com/tj/commander.js/): Esse é o meu gerenciador de argumentos da CLI favorito. Um ótimo suporte para codar no estilo `getopt.h` do C ou programas no `git style`
- [signale](https://github.com/klaussinani/signale): Um log extremamente útil e com diversas features para exibir mensagens
- [chalk](https://github.com/chalk/chalk): Pense num CSS para seu terminal, é o mais simples pra explicar

Os types são `devDependencies` para nos auxiliar com o typing do TS

# Desenvolvimento selvagem

Com as dependências instaladas, é possível começar a implementação. O código completo vem primeiro, seguido da explicação.

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
    a tipagem explícita não é obrigatória neste contexto específico

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

Com isso, é possível começar a construir CLIs com NodeJS e considerá-lo como alternativa viável para scripts. Obrigado pelo seu tempo, tamo junto e até a próxima
