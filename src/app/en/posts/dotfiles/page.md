---
level: 1
title: Dotfiles
subjects: ["tips-and-tricks", "nodejs"]
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2024-01-14T04:49:37.896Z"
description: "How to set up your programming environment?"
---

In this post, we'll cover some techniques, tools, and configurations so you can have a development environment that doesn't give you headaches.

To avoid configuration problems, we'll assume you're using Linux - it could be Ubuntu, Arch Linux, or any other distro. And of course, to avoid giving multiple examples, Ubuntu commands will be used here.

# dotfiles

If you're used to making various configurations in your terminal, you've probably heard about dotfiles. These dotfiles are configuration files that programs use as a base to change default behaviors and add your preferences.

There's a repository dedicated to this on GitHub, you can read more about it at [this link](https://dotfiles.github.io/).

If you want to see a configuration example, you can look at [my dotfiles](https://github.com/g4rcez/dotfiles) for inspiration or even install and use exactly as I do.

> Fun fact: I keep all my configurations on GitHub publicly, so I can easily restore all configurations on any PC and still version all my files. I started adopting this pattern since 2019 and have been using it until the current date of this article, 2024

# Shell

Let's start with the terminal, bringing better interaction, autocomplete, improvements to `<TAB>` functionality, history improvements, and everything else.

By default, Linux systems come with the [bash](https://www.gnu.org/software/bash/) shell, but we'll replace it using [zsh](https://www.zsh.org/) which is a much more extensive type of shell, thanks to the large community it has.

Without further ado, let's first install zsh and then we'll install [oh-my-zsh](https://ohmyz.sh/). For the correct configuration, we'll need to have zsh, [curl](https://curl.se/), and [git](https://git-scm.com/) installed.

```bash
sudo apt install zsh curl git
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

After running these commands, you'll see some interactions happening and some questions will be asked. Just follow the process and everything will be installed correctly. When the entire installation is done, you'll just need to open and close your terminal again and everything will be working.

If any problem occurs, you can run the command below to ensure the shell change (and restart the terminal after that).

```bash
chsh -s /bin/zsh
```

## Plugins - oh-my-zsh

To further improve your terminal experience, here's a list of plugins I usually use:

- [zsh-users/zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting): Syntax highlighting for your terminal, marking language tokens like parentheses, braces, brackets, and so on
- [zsh-users/zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions): Improved suggestions for your terminal, in a VSCode autocomplete style

You'll be able to install these plugins without problems, just following the guide for each plugin.

With oh-my-zsh installed, you'll have various features that will help you with productivity within the terminal. Towards the end of the article, I'll leave a list of themes, plugins, and such that you can use.

# Node

The main item on our list will be [Node](https://nodejs.org). You can install it through the official website (which I don't recommend) or use some virtual manager. Many tutorials on the internet will tell you to use [nvm](https://github.com/nvm-sh/nvm), but from personal experience... sometimes it's quite bad to use it, especially if you're forgetful and don't remember to run the correct commands.

To improve your Node experience in the terminal, I advise using [volta.sh](https://volta.sh/). This tool does the same thing as nvm, but brings automations so you can avoid versioning headaches. Its installation is very simple, just run the following command:

```bash
curl https://get.volta.sh | bash
```

Done! That's it. Now you're ready to use NodeJS in your terminal in the simplest way possible. Volta is a virtual version manager for NodeJS, it allows you to have multiple versions installed and managed by it. You just need to tell it which version you want to install and use.

## Node + NPM

With the volta installation completed, you'll now install NodeJS in the most current and stable version, the famous [LTS](https://wiki.ubuntu.com/LTS).

```bash
# To install the LTS version

volta install node@lts
# To install the most current version possible
volta install node@latest
```

We'll use LTS because it's the most stable version, thus avoiding problems. We also can't forget about `npm`, the NodeJS package manager.

```bash
volta install npm@latest
```

## Node utilities

If you're studying TypeScript, you'll definitely need the TypeScript CLI to run your projects, or even ts-node to run your scripts. With the **Node + NPM** setup:

```bash
npm install -g typescript ts-node
```

With this `-g` installation, you'll install your scripts globally and allow you to execute commands from anywhere.

# VSCode

This will definitely be the best tool you'll have for code editing. There are other good editors like [WebStorm](https://www.jetbrains.com/webstorm) or [Neovim](https://neovim.io/), but VSCode wins in simplicity and has a lower learning curve.

To install it, just follow the step-by-step guide from the [official website](https://code.visualstudio.com/), according to your operating system. Also remember to install the [CLI or Command Line Interface](https://code.visualstudio.com/docs/editor/command-line) for VSCode, to facilitate the installation of extensions in this tutorial.

## VSCode Extensions

The great power of VSCode lies in its extensibility, and with various plugins, you can set up your environment to program in any language and with any framework.

```bash
# TailwindCSS extension to help with autocomplete
code --install-extension bradlc.vscode-tailwindcss

# Enables eslint in VSCode
code --install-extension dbaeumer.vscode-eslint

# Extension that allows customizing electron
code --install-extension drcika.apc-extension

# Improvements when working with HTML and CSS
code --install-extension ecmel.vscode-html-css

# EditorConfig enabled for VSCode
code --install-extension EditorConfig.EditorConfig

# Prettier in VSCode for formatting
code --install-extension esbenp.prettier-vscode

# Extension for creating files with extensions and snippets
code --install-extension g4rcez.superfile

# Syntax highlight for dotenv
code --install-extension mikestead.dotenv

# Extension for text correction
code --install-extension streetsidesoftware.code-spell-checker
# This complements with pt-br correction
code --install-extension streetsidesoftware.code-spell-checker-portuguese-brazilian

# Extension that calculates the import size of each file dependency
code --install-extension wix.vscode-import-cost
```

With these extensions, you already have a good setup for frontend programming with the React stack. For configurations, it's worth exploring a bit instead of copying a ready-made configuration. But if you want inspiration, you can look at my dotfiles, in the [`vscode`](https://github.com/g4rcez/dotfiles/tree/master/vscode) folder.

# Conclusion

This is just a quick tutorial for configuring and customizing your development environment. There are many more things you can evolve over time, just look for inspiration in [awesome lists](https://github.com/topics/awesome) or dotfiles.

I hope you enjoyed it and see you next time. 





