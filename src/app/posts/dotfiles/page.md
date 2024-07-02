---
level: 1
title: Dotfiles
subjects: ["javascript"]
language: "pt-br"
translations: ["pt-br"]
date: "2024-01-14T04:49:37.896Z"
description: "Como configurar o seu ambiente de programação?"
---
Nesse post iremos abordar algumas técnicas, ferramentas e configurações para você ter um ambiente de desenvolvimento que não te dê dor de cabeça.

Para não haver problemas de configuração, iremos adotar como base que você esteja utilizando um Linux, pode ser um Ubuntu, Arch Linux ou qualquer outra distro. E claro, para não ficar dando vários exemplos, os comandos do Ubuntu serão os utilizados aqui.

# dotfiles

Se você costuma fazer várias configurações no seu terminal, já deve ter ouvido falar sobre dotfiles. Esses dotfiles são arquivos de configuração que os programas utilizam como base para mudar comportamentos padrões e adicionar suas preferências.

Existe um repositório só sobre isso no github, você pode ler mais sobre [neste link](https://dotfiles.github.io/).

Caso queira ver um exemplo de configuração, você pode olhar os [meus dotfiles](https://github.com/g4rcez/dotfiles) como inspiração ou até mesmo instalar e usar exatamente como eu uso.

> Curiosidade: Mantenho todas as minhas configurações no github de forma pública, assim consigo restaurar de forma fácil todas as configurações em qualquer PC e ainda consigo versionar todos os meus arquivos. Comecei a adotar esse padrão desde 2019 e venho usando até a data atual do artigo, 2024

# Shell

Vamos começar pelo terminal, trazendo uma melhor interação, autocomplete, melhoria nas funcionalidades de `<TAB>`, melhoria do histórico e tudo mais.

Por padrão, os sistemas linux vem com o shell [bash](https://www.gnu.org/software/bash/), mas iremos substituir utilizando o [zsh](https://www.zsh.org/) que é um tipo de shell bem mais extensivo, graças a grande comunidade que possui.

Sem mais delongas, vamos instalar primeiro o zsh e depois iremos instalar o [oh-my-zsh](https://ohmyz.sh/). Para a configuração correta, iremos precisar ter instalado o zsh, [curl](https://curl.se/) e [git](https://git-scm.com/)

```bash
sudo apt install zsh curl git
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Após rodar esses comandos, você vai ver algumas interações acontecendo e algumas perguntas serão feitas. Basta seguir o processo e tudo será instalado corretamente. Quando toda a instalação for feita, você só precisará abrir e fechar seu terminal de novo e tudo estará funcionando.

Caso aconteça algum problema, você pode executar o comanda baixo para garantir a troca da shell (e reiniciar o terminal após isso).

```bash
chsh -s /bin/zsh
```

## Plugins - oh-my-zsh

Para melhorar ainda mais sua experiência com o terminal, aqui deixo uma lista de plugins que costumo usar

- [zsh-users/zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting): Syntax highlight para o seu terminal, marcando tokens de linguagem como parêntesis, chaves, colchetes e afins
- [zsh-users/zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions): Sugestões melhoradas para o seu terminal, num estilo de autocomplete do Vscode

Você irá conseguir fazer a instalação desses plugins sem problemas, apenas seguindo o guia de cada um dos plugins.

Com o oh-my-zsh instalado, você terá várias funcionalidades que te auxiliaram na produtividade dentro do terminal. Mais pro fim do artigo vou deixar uma lista de temas, plugins e afins que você poder utilizar.

# Node

O principal da nossa lista será o [Node](https://nodejs.org). Você pode instalar através do site oficial (o que não recomendo) ou utilizar algum gerenciador virtual. Muitos tutoriais na internet irão te falar para utilizar o [nvm](https://github.com/nvm-sh/nvm), mas por experiência própria...as vezes é bem ruim de utilizar esse cara, principalmente se você for esquecido e não lembrar de rodar os comandos corretos.

Para melhorar sua experiência com Node no terminal, aconselho utilizar o [volta.sh](https://volta.sh/). Esse cara faz a mesma coisa do nvm, mas trás automações para vc evitar dores de cabeça com versionamento. Sua instalação é muito simples, basta você rodar o seguinte comando:

```bash
curl https://get.volta.sh | bash
```

Pronto! É só isso. Agora você está apto para utilizar o NodeJS no seu terminal da forma mais simples possível. O volta é um gerenciador virtual de versões do NodeJS, ele permite que você tenha várias versões instaladas e gerenciadas por ele. Você só precisa dizer qual versão quer instalar e utilizar.

## Node + NPM

Com a instalação do volta concluída, você irá instalar agora o NodeJS na versão mais atual e estável, a famosa [LTS](https://wiki.ubuntu.com/LTS).

```bash
# Para instalar a versão LTS

volta install node@lts
# Para instalar a versão mais atual possível
volta install node@latest
```

Iremos utilizar a LTS pois é a versão mais estável, assim evitamos problemas. Não podemos esquecer também do `npm`, o gerenciador de pacotes do NodeJS

```bash
volta install npm@latest
```

## Utilitários node

Caso você esteja estudando Typescript, com certeza vai precisar do CLI do Typescript para rodar seus projetos, ou até mesmo o ts-node para rodar seus scripts. Com o setup **Node + NPM**.

```bash
npm install -g typescript ts-node
```

Com essa instalação `-g` você vai instalar globalmente os seus scripts e permitirá que você execute os comandos de qualquer lugar.
# Vscode

Com certeza essa vai ser a melhor ferramenta que você terá para fazer edição de código. Existem outros bons editores
como [WebStorm](https://www.jetbrains.com/webstorm) ou [Neovim](https://neovim.io/), mas o Vscode ganha em simplicidade
e possui uma menor curva de aprendizado.

Para fazer a instalação, basta você seguir o passo a passo do [site oficial](https://code.visualstudio.com/), de acordo
com o seu sistema operacional. Lembre-se também de instalar a [CLI ou Command Line Interface](https://code.visualstudio.com/docs/editor/command-line) do Vscode, para facilitar a instalação das extensões nesse tutorial.

## Extensões do Vscode

O grande poder do Vscode está na sua extensibilidade, e com os diversos plugins, você pode montar o seu setup para programar em qualquer linguagem e com qualquer framework.

```bash
# Extensão do tailwindcss para auxiliar no autocomplete
code --install-extension bradlc.vscode-tailwindcss

# Habilita o eslint no vscode
code --install-extension dbaeumer.vscode-eslint

# Extensão que permite customizar o electron
code --install-extension drcika.apc-extension

# Melhorias na hora de trabalhar com HTML e CSS
code --install-extension ecmel.vscode-html-css

# EditorConfig habilitado para o vscode
code --install-extension EditorConfig.EditorConfig

# Prettier no vscode para formatação
code --install-extension esbenp.prettier-vscode

# Extensão para criação de arquivos com extensões e snippets
code --install-extension g4rcez.superfile

# Syntax highlight para dotenv
code --install-extension mikestead.dotenv

# Extensão para correção de texto
code --install-extension streetsidesoftware.code-spell-checker
# Essa completamenta com correção em pt-br
code --install-extension streetsidesoftware.code-spell-checker-portuguese-brazilian

# Extensão que calcula o tamanho do import de cada dependência do arquiv
code --install-extension wix.vscode-import-cost
```

Com essas extensões, você já tem um bom setup para programar frontend com a stack React. Para as configurações, vale a
pena você explorar um pouco ao invés de copiar uma configuração pronta. Mas caso queira uma inspiração, você pode olhar
nos meus dotfiles, na pasta [`vscode`](https://github.com/g4rcez/dotfiles/tree/master/vscode).

# Conclusão

Esse é só um tutorial rápido de configuração e customização do seu ambiente de desenvolvimento. Há muito mais coisas que
você pode evoluir com o tempo, basta procurar inspirações em [awesome lists](https://github.com/topics/awesome) ou
dotfiles.

Espero que tenha gostado e até a próxima. 



