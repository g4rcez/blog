---
level: 1
title: Espanso. Uma nova forma de digitar
subjects: ["tips-and-tricks"]
language: "pt-br"
translations: ["pt-br", "en-us"]
date: "2025-01-18T13:07:22.874Z"
description: "Mudando sua forma de digitar com macros e automações."
---

Você já ouviu falar do [espanso](https://espanso.org/)? É uma ferramenta que tenho usado há tempos e que é de grande utilidade para automatizar coisas simples durante sua digitação, como preencher uma data ou um CPF.

# Instalação

Para realmente começar, precisamos instalar o espanso. Basta ir até a [página de download](https://espanso.org/install/) e selecionar o seu sistema operacional. Após a instalação, abra o terminal e digite o comando

```shell
espanso status
```

Se tudo estiver certo você irá ver a mensagem `espanso is running`. Ao abrir o programa, você verá um pequeno tutorial e pedirá para que você digite `:espanso`. Isso vai resultar numa troca de `:espanso` para `Hi there`. 

Já conseguiu imaginar o que você pode fazer com as substituições? Vamos continuar para você ver o real potencial do espanso.

# Configuração

Antes de escrever nossas configurações, precisamos saber onde estão os arquivos de configuração do espanso. Para isso, basta seguir os comandos:

```shell
espanso path
```

Vão aparecer 3 linhas, `Config`, `Packages` e `Runtime`. Estamos interessados no diretório exibido em `Config`. Vamos abrir esse diretório no nosso editor de texto favorito ~~neovim~~.

```shell
cd "$(espanso path config)"
code # Usando o vscode para ser mais familiar
```

![Diretório do espanso](/public/espanso-directory.png)

Nesse diretório temos alguns arquivos `.yml`. O principal deles para nossa configuração é o arquivo `base.yml`, onde vai conter todas as regras de substituição. 

Uma dica bastante importante para sua configuração é ter um prefixo para os ativadores (triggers) do espanso. Geralmente você vai achar as configurações e pacotes configurados com `:` , mas para evitar conflitos com Slack, Notion e afins, você pode usar `;`. Isso também vai evitar de precisar apertar `Shift + ;` para virar um `:`. 
# Substituições

Agora que sabemos o arquivo que precisamos editar, vamos olhar as substituições que o espanso pode fazer. Iremos ver cada um dos tipos de substituição que o espanso oferece. 

Os blocos apresentados serão adicionados no arquivo `base.yml`, dentro da propriedade `matches`, sendo um array do formato YAML.

## Substituição estática

Essa é a mais simples de todas, mas não deixa de ser importante. Sabe aquela mensagem ou valor que você vive digitando ou salva em algum arquivo para copiar e colar? Agora ele pode virar um macro do espanso para te auxiliar nisso. 

```yaml
- trigger: ;email
  replace: meuemail@email.com
- trigger: ;cpf
  replace: 280.624.055-75 # CPF fake gerado pelo meu espanso :D
```

As substituições estáticas são bem úteis para casos não interativos, onde você precisa apenas transcrever o texto para onde está digitando. Podem ser úteis para preencher formulários comuns com email, cpf, telefone, nome completo...o céu é o limte.

Particularmente, além dos citados, utilizado pra preencher com links de redes sociais, tipo o meu [canal do youtube](https://www.youtube.com/@allangarcez), linkedin, twitter/x, emojis e afins.

## Substituição dinâmica

Por padrão o espanso fornece algumas diretivas para substituir valores e criar funcionalidades práticas como por exemplo, datas:

```yaml
- trigger: ;now
  replace: {{time}}
  vars:
    - name: time
	type: date
	params:
	  format: "%H:%M"
```

Nesse caso temos a criação da hora atual, baseado nos tokens do [chrono](https://docs.rs/chrono/latest/chrono/format/strftime/index.html) , lib Rust para datas. Você também pode usar parâmetros como o `offset` e configurar mais ativadores lógicos, como pegar a data de ontem ou amanhã. 

Ainda nas extensões dinâmicas, temos a opção `random`. Essa opção tem um comportamento bem óbvio, dada uma lista de opções, ela vai retornar uma delas de forma aleatória. Essa opção eu costumo usar para CEP, já que não tem como gerar um número de cep válido, então crio uma lista com ceps válidos e conhecidos para poder utilizar no autocompletar.

```yaml
  - label: "CEP aleatório"
    replace: '{{cep}}'
    trigger: ;cep
    vars:
      - name: cep
        type: random
        params:
          choices:
            - 04538-133
            - 04543-907
            - 21530-014
            - 22740-300
            - 25060-236
            - 28957-632
            - 30260-070
            - 70040-010

```

Com isso, aleatoriamente você terá um cep funcional sempre que digitar `;cep`. 

Neste tópico de Substituição dinâmica nós vimos as [match-extensions](https://espanso.org/docs/matches/extensions/) do espanso, e ainda vimos como podemos ter variávels, por meio da sintaxe `{{NOME_VARIAVEL}}` e como atribuir labels aos nossos ativadores, com a propriedade `- label:`.

# Integrando seus scripts

Um dos grandes poderes do espanso é poder executar comandos shell quando os ativadores forem digitados. Isso traz grande poder ao seu fluxo de trabalho, podendo simplesmente programar os resultados gerados de forma dinâmica. E quando dizemos comandos shell, isso não se limita somente ao bash/zsh/fish, mas qualquer comando que você tiver instalado no seu sistema. Simplificando, você pode criar um programa em [deno](https://deno.com) e o output dele vai ser o seu autocomplete.

Mas vamos com calma, primeiro analisando o exemplo mostrado na documentação oficial

```yaml
  - trigger: ":ip"
    replace: "{{output}}"
    vars:
      - name: output
        type: shell
        params:
          cmd: "curl 'https://api.ipify.org'"
```

Simples e efetivo. Utilizando o [curl](https://curl.se/) para fazer um GET no [ipify.org](https://api.ipify.org) e obter o seu IP externo.

É importante lembrar que, a execução pode variar entre os sistemas operacionais, mas mantendo o padrão você não deve encontrar problemas.

Como sabemos que podemos executar comandos shell, vamos explorar algumas possibilidades.

## Gerador de CPF

É muito comum para o desenvolvedor BR utilizar o [4devs](https://www.4devs.com.br/) para gerar CPF, CNPJ e outros documentos. E o processo para isso envolve:
- Abrir o navegador
- Digitar https://www.4devs.com.br/ na URL
- Navegar até a opção `Gerador de CPF`
- Clicar em `GERAR CPF`

Para quem já está acostumado, pode ser um processo comum. Mas você não precisa mais disso. Agora você pode simplesmente só digitar `;cpf` e pronto... você tem seu CPF válido bem onde estava digitando, sem precisar sair do lugar. 

Como dito anteriormente, podemos criar programas em quaisquer linguagens e executar para obter o resultado. Para facilitar o artigo, vamos utilizar o [funcoeszz](https://github.com/funcoeszz/funcoeszz), um compilado de vários aplicativos de linha de comando que possui a geração de CPF e mais alguns utilitários

```yaml
  - trigger: ";cpf"
    replace: "{{cpf}}"
    vars:
      - name: output
        type: shell
        params:
          cmd: "funcoeszz cpf"
```

Ou caso você precise de algum CNPJ
```yaml
  - trigger: ";cnpj"
    replace: "{{cnpj}}"
    vars:
      - name: output
        type: shell
        params:
          cmd: "funcoeszz cnpj"
```

Claro que você pode executar comandos com Node, exemplo, gerar um UUID
```yaml
  - trigger: ";uuid"
    replace: "{{uuid}}"
    vars:
      - name: output
        type: shell
        params:
          cmd: "node -e 'console.log(require(\"node:crypto\").randomUUID())'"
```

A partir daqui, o céu é o limite para você. Você pode transformar quaisquer tarefas em um fluxo do espanso. Para alguns amigos que já apresentei este programa, alguns deles estão usando para criar modelos de email, preencher formulários automáticos, gerar CPF/CNPJ

# Conclusão

Tenho usado o espanso há pouco mais de 1 ano e meio e não tenho o que falar, ele melhorou muito a minha forma de trabalhar com formulários, escrever e-mails, preencher dados, criar queries SQL, snippets de código e muito mais. Todas essas automações você consegue ver lá no meu [arquivo de configuração do espanso](https://github.com/g4rcez/dotfiles/blob/master/espanso.config.ts). 

O único porém é a escrita de YAML, que é um formato que eu particularmente não gosto. E por isso minha configuração é feita em Typescript + Deno, o que evita ter que lidar com problemas de espaçamento e indentação. Mas caso queira a configuração em YAML, só olhar no [gist](https://gist.github.com/g4rcez/dc52c404526753edcf4519b85854c1db). 

Obrigado pelo seu tempo, tamo junto e até a próxima
