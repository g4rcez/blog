---
level: 1
title: Dotfiles
subjects: ["tips-and-tricks", "nodejs"]
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2024-01-14T04:49:37.896Z"
description: "A practical guide to setting up a productive development environment"
---

This post covers a few tools and configurations for a development environment that stays out of your way.

The examples assume Linux. They should be easy to adapt to other distributions, but the commands below use Ubuntu.

# dotfiles

If you keep customising your terminal, you have probably heard of dotfiles. They are configuration files that programs use to change their default behaviour and apply your preferences.

The [dotfiles community](https://dotfiles.github.io/) has a useful collection of examples on GitHub.

For a concrete example, see [my dotfiles](https://github.com/g4rcez/dotfiles). Use them for reference or install them as they are.

> I keep all configurations public on GitHub. That makes them easy to restore on any machine and gives me a complete history of changes. I have followed this practice since 2019.

# Shell

Start with the terminal. A better shell can improve interaction, autocomplete, `<TAB>` behaviour, history, and everyday navigation.

Linux distributions usually include [bash](https://www.gnu.org/software/bash/). This guide uses [zsh](https://www.zsh.org/) instead because its ecosystem and community provide more options for customisation.

Without further ado, let's first install zsh and then we'll install [oh-my-zsh](https://ohmyz.sh/). For the correct configuration, we'll need to have zsh, [curl](https://curl.se/), and [git](https://git-scm.com/) installed.

```bash
sudo apt install zsh curl git
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

The installer will ask a few questions. Follow its prompts, then close and reopen the terminal when it finishes.

If the shell did not change, run the command below and restart the terminal:

```bash
chsh -s /bin/zsh
```

## Plugins - oh-my-zsh

These are the plugins I usually use to improve the terminal experience:

- [zsh-users/zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting): Syntax highlighting for your terminal, marking language tokens like parentheses, braces, brackets, and so on
- [zsh-users/zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions): Improved suggestions for your terminal, in a VSCode autocomplete style

Install each plugin by following its own documentation.

Once oh-my-zsh is installed, its themes and plugins provide a productive starting point. The rest of this post lists a few tools to add to that setup.

# Node

Next is [Node](https://nodejs.org). You can install it from the official website, although I prefer a version manager. Many tutorials recommend [nvm](https://github.com/nvm-sh/nvm), but I have found it easy to forget its version-switch commands.

I use [volta.sh](https://volta.sh/) instead. It provides the same version-management role as nvm and automates some of the steps that otherwise cause versioning problems. Install it with:

```bash
curl https://get.volta.sh | bash
```

Volta is now ready. It lets you install and manage multiple Node.js versions; you only need to choose which one a project should use.

## Node + NPM

With Volta installed, add the current stable Node.js release, the familiar [LTS](https://wiki.ubuntu.com/LTS) version:

```bash
# To install the LTS version

volta install node@lts
# To install the most current version possible
volta install node@latest
```

LTS is the safest default for most projects. Install the `npm` package manager as well:

```bash
volta install npm@latest
```

## Node utilities

If you work with TypeScript, you may also need the TypeScript CLI and `ts-node` for running scripts. With the **Node + npm** setup:

```bash
npm install -g typescript ts-node
```

The `-g` flag installs these tools globally, so their commands are available from any directory.

# VSCode

For editing code, I use [VS Code](https://code.visualstudio.com/). [WebStorm](https://www.jetbrains.com/webstorm) and [Neovim](https://neovim.io/) are also good choices, but VS Code has a short learning curve and a broad extension ecosystem.

Install it using the guide on the [official website](https://code.visualstudio.com/) for your operating system. Also install the [VS Code command-line interface](https://code.visualstudio.com/docs/editor/command-line), which is used by the extension commands below.

## VSCode Extensions

VS Code's main strength is its extensibility. With the right extensions, you can adapt the editor to almost any language or framework.

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

These extensions provide a solid starting point for frontend work with React. Explore their settings instead of copying a complete configuration, but my [`vscode` dotfiles](https://github.com/g4rcez/dotfiles/tree/master/vscode) are available if you want a reference.

# Conclusion

This is a starting point for configuring a development environment. You can refine it over time by exploring [awesome lists](https://github.com/topics/awesome) and other dotfiles.

Thanks for reading.





