---
level: 0
subjects: ["nodejs", "javascript", "typescript"]
title: "Node CLI"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2019-08-03T03:18:00.000Z"
description: "Automating tasks through the command line"
---

# Introduction

This post was written to accompany a [presentation about NodeJS and CLIs](https://www.meetup.com/pt-BR/Node-js-Rio/events/263378339/) on 2019-07-08, serving as both a reference after the talk and a way to organize ideas beforehand.

# Motivation

For a long time, Bash and Python were the primary tools for CLI development. They served well, but maintenance became increasingly difficult — particularly due to indentation inconsistencies when switching editors.

Researching NodeJS tooling changed everything. Coming from a frontend background, JavaScript was a natural fit. Rewriting the Python scripts in NodeJS produced the same results with more concise code. **_Even more so after adding [TypeScript](https://www.typescriptlang.org) to the mix._**

# npm init

The JavaScript ecosystem offers countless boilerplates, configuration guides, and best practice frameworks. The preference here is to keep things simple, following the [KISS](https://en.wikipedia.org/wiki/KISS_principle) principle.

I'll stick to the simple of a CLI to sort git tag versions. Using bash, we could use the `sort` command, doing the following command `git tag | sort -V`. But since the focus is a NodeJS CLI, let's go:

```bash
$ mkdir my-cli
$ cd my-cli
$ npm init -y
```

The `-y` flag skips interactive prompts. This is sufficient to begin making the necessary adjustments before writing code. We have some steps to execute:

1. Insert the `main` and `bin` keys with the application entrypoint path in `package.json`
2. Create the directory for TS code
3. Configure `tsconfig.json` and a `tslint.json` to strengthen development
4. Install dependencies
5. Code!!! Code!!! Code!!!

# Main in package.json

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

Since we're going to use [Typescript](https://www.typescriptlang.org), both `main` and `bin` are the transpilation directories

> Although "compile" is commonly used in JavaScript contexts, it is technically incorrect — TypeScript *transpiles* to JavaScript rather than compiling to binary. The output is not a binary file.

![](https://media.giphy.com/media/1L5YuA6wpKkNO/source.gif)

**But how will I program with TS if NodeJS doesn't run TS?**

# Writing TS

The first step before everything is to create a `tsconfig.json`. If you don't have typescript on your PC, let's solve this now to make our CLI

```bash
$ npm i -g typescript
$ tsc --init
```

And that's it, we already have our `tsconfig.json` and let's make it look like this:

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

If you're in VsCode, I advise using `CTRL+Space` in fields to see what's available and venture with your own configurations. If you want some reference, [this is my `tsconfig.json` that I usually use at work/projects](https://gist.github.com/g4rcez/0848b503288f08e7a9592f04576c7f4a).

Since we're going to use TS, it's good to use [`TSLint`](https://palantir.github.io/tslint/) together to avoid any mess.

```bash
npm i -g tslint
tslint --init
```

And if you want [reference, this is my `tslint.json`](https://gist.github.com/g4rcez/1218bcfe10e930adf1e4f8aa0be91cf9).

# Dependencies

As with most NodeJS projects, a few dependencies are needed. Building a CLI is no exception.

> I like to use yarn whenever possible in my projects, in case one day I think about using yarn workspaces

```bash
$ yarn add typescript semver commander signale chalk
$ yarn add --dev @types/node @types/semver @types/signale
```

Except for `typescript`, the others are new, so I'll explain

- [semver](https://github.com/npm/node-semver): For semantic versioning. You can look at [semver on the official site and understand about software versioning](https://semver.org)
- [commander](https://github.com/tj/commander.js/): This is my favorite CLI argument manager. Great support for coding in the `getopt.h` style from C or programs in `git style`
- [signale](https://github.com/klaussinani/signale): An extremely useful log with several features for displaying messages
- [chalk](https://github.com/chalk/chalk): Think of CSS for your terminal, it's the simplest to explain

The types are `devDependencies` to help us with TS typing

# Wild development

With everything in place, development can begin. The code comes first, followed by an explanation:

```typescript
import cli from "commander";
import { exec } from "child_process";
import semver from "semver";
import signale from "signale";
const program = new cli.Command();

/*
    We'll use $ as it's the symbol that identifies the user shell
    in Unix, not because of Jquery
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

// Since we don't require parameters here, we don't expect to receive anything
const Tags = () => {
  try {
    const gitOutput = await $("git tag"); // Output of all tags
    const tags = gitOutput.split("\n");
    // A simple sort according to the presented versions
    // Invalid versions will stay at the top of the stack
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
  .description("Tag sorter")
  .usage("tag")
  .command("tag")
  .name("my-cli")
  .alias("t")
  .description("Sorts the tags of the current git repository")
  .action(Tags);

if (process.argv.length === 2) {
  program.help();
  process.exit();
}
program.parse(process.argv);
```

And that's it, we have our first CLI in TS. To run it as Node, just follow these steps

```bash
$ tsc # This will transpile from src directory to cli
$ node cli tag # Or
$ node cli t # alias defined in the program
```

Adding parameter support is straightforward using the commander interface:

```typescript
/*
    The same imports from before and almost the same code.
    Now we'll receive params to have access to what was received.
    I'll put the any type so it doesn't get
    too verbose (and in this specific case),
    I end up not typing because sometimes it's GoHorse

    It ends up that in the commander schema definition you annotate
    the types you'll receive with your program arguments
*/
const Tags = (params: any) => {
  try {
    // Until the next comment, everything is the same
    const gitOutput = await $("git tag"); // Output of all tags
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
    // Up to here, nothing changed, but let's put an info and style
    // with chalk to show that I showed it
    signale.info(chalk.bold.visible.underline.blue(params.msg));
    signale.success(tags.join("\n"));
  } catch (e) {}
};

program
  .version("0.0.1")
  .allowUnknownOption(false)
  .description("Tag sorter")
  .usage("tag")
  .command("tag")
  .name("my-cli")
  .alias("t")
  // Here's the new snippet in commander
  // It will deliver a "msg" property for you to use as value
  // if it doesn't exist, it will be the default value you defined
  // And if not defined, it will be undefined
  .option(
    "-m, --msg <message>",
    "Message to be displayed before showing tags",
    "Tag sorting"
  ) // "Tag sorting" is the default message if there's none
  .description("Sorts the tags of the current git repository")
  .action(Tags);

if (process.argv.length === 2) {
  program.help();
  process.exit();
}
program.parse(process.argv);
```

This covers the essentials for building CLIs with NodeJS — reason enough to consider it as the preferred language for script development. Thank you for your time, see you soon, bye bye
