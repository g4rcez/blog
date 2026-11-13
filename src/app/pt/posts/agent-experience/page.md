---
level: 1
title: "Esqueça a DX, foque na AX"
subjects: ["ai", "agents", "workflow", "testing"]
language: "pt-br"
translations: ["pt-br", "en-us"]
date: "2026-11-12T12:00:00.000Z"
description: "Como projetar a experiência do agente: contexto, ferramentas, guardrails e CI para que a IA escreva o código com qualidade"
---

DX significa _Developer Experience_: o quanto é agradável e produtivo trabalhar em uma codebase. AX significa _Agent Experience_: o quanto é fácil para um agente entender a codebase, agir sobre ela e saber se acertou.

Hoje não escrevo mais código. Escrevo workflows, skills, plugins e ferramentas para o meu harness (Claude Code e [pi.dev](https://pi.dev)) validar o código. O agente escreve e o workflow decide se está correto. Este post reúne as peças desse workflow, uma por seção, com trechos que você pode adaptar ao seu projeto.

> Você pode perguntar: por que investir em AX se um modelo melhor resolve o problema? Porque o modelo é só uma variável. Um agente com contexto ruim, sem ferramentas de busca e sem testes erra com qualquer modelo, só que em ritmo diferente.

## Contexto é o novo onboarding

Um desenvolvedor novo lê o README, pergunta ao time e aprende a linguagem do domínio. O agente não tem nada disso, e a cada sessão começa do zero. O arquivo de instruções do projeto faz o papel do onboarding.

Esse arquivo se chama `CLAUDE.md` ou `AGENTS.md`, dependendo do harness. O nome importa menos que o conteúdo. Um arquivo útil responde a quatro perguntas:

```md
# AGENTS.md

## Comandos
- `npm run check`: lint, typecheck e testes. Rode antes de abrir um PR.
- `npm run test -- <arquivo>`: um arquivo de teste.

## Estrutura
- `src/domain`: regras de negócio, sem dependência de React.
- `src/ui`: componentes. Não acessam a API diretamente.

## Linguagem do domínio
- "Pedido" (`Order`) é o carrinho depois do pagamento. Antes disso é `Cart`.

## Regras
- Não adicione dependências sem perguntar.
- Todo comportamento novo precisa de um cenário em `tests/features`.
```

Duas regras mantêm esse arquivo útil. Primeira: cada linha deve evitar um erro real que o agente já cometeu. Uma linha que não evita erro custa tokens e atenção sem dar retorno. Segunda: mantenha o arquivo curto e aponte para documentos maiores quando precisar, porque contexto carregado sem necessidade atrapalha a decisão.

## Dê ferramentas de busca melhores ao agente

A maior parte do trabalho de um agente é encontrar o código certo. Um `grep` ingênuo devolve centenas de linhas, e o agente gasta o contexto lendo ruído. Estas ferramentas reduzem esse custo:

- [ripgrep](https://github.com/BurntSushi/ripgrep) (`rg`) para busca textual rápida, que respeita o `.gitignore`.
- [fzf](https://github.com/junegunn/fzf) para filtrar listas grandes de arquivos por nome.
- [ast-grep](https://ast-grep.github.io) para buscar por estrutura de código, não por texto.

A diferença aparece nas buscas estruturais. Achar todas as chamadas de `fetch` sem tratamento de erro é difícil com texto e simples com a árvore sintática:

```bash
ast-grep run --lang ts --pattern 'await fetch($$$ARGS)' src
```

Instalar a ferramenta não basta, o agente precisa saber quando usá-la. Uma instrução curta no arquivo de contexto resolve:

```md
## Busca
- Nome de símbolo ou texto: `rg`.
- Padrão de código (chamadas, imports, JSX): `ast-grep run --lang tsx --pattern '...'`.
- Nunca leia um arquivo inteiro para encontrar uma função. Busque primeiro.
```

## Regras determinísticas e não determinísticas

Existem dois tipos de regra, e cada um tem um papel.

Regras determinísticas são verificadas por uma ferramenta. O resultado é sempre o mesmo e o agente não consegue ignorá-las. Um exemplo com [oxlint](https://oxc.rs/docs/guide/usage/linter):

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "react"],
  "rules": {
    "no-console": "error",
    "typescript/no-explicit-any": "error",
    "react/exhaustive-deps": "error"
  }
}
```

Regras não determinísticas são instruções em linguagem natural, como as do `CLAUDE.md` ou do `.cursorrules`. O agente as interpreta, então elas podem falhar. "Prefira composição a herança" e "nomes de funções descrevem a intenção" não têm verificador.

Meu critério é simples. Se uma ferramenta consegue validar a regra, ela vai para o linter ou para o type checker. A linguagem natural fica com o que só o julgamento avalia. Cada regra que sai do texto e vai para uma ferramenta deixa de depender da interpretação do agente.

## Skills, plugins e hooks

Quando o mesmo procedimento se repete, ele vira uma skill. Uma skill é uma pasta com um `SKILL.md`. O frontmatter diz quando ela se aplica e o corpo diz como executar.

```md
---
name: new-feature
description: Cria uma feature nova seguindo o fluxo do projeto. Use quando o usuário pedir uma funcionalidade nova.
---

1. Escreva o cenário em `tests/features/<nome>.feature`.
2. Rode o cenário e confirme que ele falha pelo motivo certo.
3. Implemente o mínimo para passar.
4. Rode `npm run check`.
```

Skills dependem de o agente lembrar delas. Hooks não dependem, porque o harness os executa em eventos definidos. No Claude Code, este hook roda o oxlint depois de cada edição de arquivo:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx oxlint >&2 || exit 2"
          }
        ]
      }
    ]
  }
}
```

O código de saída `2` é o detalhe que importa. Ele devolve a mensagem de erro ao agente, que corrige o problema na mesma sessão. O erro chega quando o código acabou de ser escrito, e não no CI vinte minutos depois.

Plugins empacotam skills, hooks e comandos para o time inteiro usar o mesmo workflow.

## Testes como guardrail e prova de futuro

Testes têm duas funções. A primeira é verificar que o código funciona. A segunda, mais importante para AX, é permitir a mudança. Com uma suíte confiável, o agente altera várias partes da aplicação e sabe na hora se quebrou algo. Sem a suíte, cada mudança é um risco que alguém precisa revisar linha por linha.

Eu escrevo os casos de uso em [Gherkin](https://cucumber.io/docs/gherkin/). O formato funciona como uma [DSL](https://martinfowler.com/articles/llm-and-dsls.html) entre a intenção humana e o código: pessoas leem sem esforço e o agente tem precisão suficiente para implementar.

```gherkin
# language: pt
Funcionalidade: Cupom de desconto

  Cenário: Cupom válido reduz o total
    Dado um carrinho com total de R$ 100,00
    Quando o cliente aplica o cupom "PRIMEIRA10"
    Então o total do carrinho é R$ 90,00

  Cenário: Cupom expirado é recusado
    Dado um carrinho com total de R$ 100,00
    Quando o cliente aplica o cupom "NATAL2020"
    Então o cliente vê a mensagem "Cupom expirado"
    E o total do carrinho continua R$ 100,00
```

Cada cenário vira um teste. Para a regra de negócio, uso [Vitest](http://vitest.dev/):

```ts
import { describe, expect, it } from "vitest";
import { applyCoupon } from "./cart";

describe("cupom de desconto", () => {
  it("cupom válido reduz o total", () => {
    const cart = { total: 100 };
    expect(applyCoupon(cart, "PRIMEIRA10").total).toBe(90);
  });
});
```

Para o fluxo completo no navegador, uso [Playwright](https://playwright.dev/):

```ts
import { expect, test } from "@playwright/test";

test("cupom expirado é recusado", async ({ page }) => {
  await page.goto("/cart");
  await page.getByLabel("Cupom").fill("NATAL2020");
  await page.getByRole("button", { name: "Aplicar" }).click();
  await expect(page.getByText("Cupom expirado")).toBeVisible();
});
```

Uma regra prática: o agente escreve o cenário primeiro, vê o teste falhar e só depois implementa. Assim não sobram testes que passam sem verificar nada.

## Valide o comportamento em vídeo

Teste automatizado responde "passou ou falhou". Em fluxos de interface eu também quero ver o que aconteceu, então uso vídeo como evidência do trabalho do agente.

O [testing-agent](https://github.com/g4rcez/testing-agent) executa casos de uso escritos em linguagem natural em um navegador real. Cada passo é uma instrução, sem seletores, e as asserções definem o resultado final, não o modelo:

```yaml
name: Cupom expirado
url: http://localhost:3000/cart
prompt: Aplicar um cupom expirado e verificar a recusa.
steps:
  - instruction: Digite NATAL2020 no campo Cupom
    value: NATAL2020
  - instruction: Clique em Aplicar
    expect:
      text: Cupom expirado
```

A execução gera um vídeo. Em vez de ler um diff para saber se o fluxo funciona, eu assisto trinta segundos de gravação. A revisão fica sobre o comportamento, que é o que importa para quem usa o produto.

## CI rápido o suficiente para o agente

Um agente só valida o próprio trabalho se a verificação for rápida. Com um CI de vinte minutos, ele abre o PR sem ter certeza e o feedback chega tarde. A pergunta para o seu pipeline é: o agente consegue rodar tudo isso antes de publicar o PR?

O primeiro passo é um único comando local que reproduz o CI:

```json
{
  "scripts": {
    "check": "oxlint && tsc --noEmit && vitest run",
    "check:changed": "oxlint && tsc --noEmit && vitest run --changed origin/main"
  }
}
```

O `check:changed` roda só os testes afetados pela mudança, e é o que o agente usa durante o trabalho. O CI executa o `check` completo:

```yaml
name: ci
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 26
          cache: npm
      - run: npm ci
      - run: npm run check
```

Para manter o pipeline rápido, faça cache das dependências, rode só os testes afetados no ciclo local, execute lint, tipos e testes em paralelo e trate o limite de tempo como requisito. Um teste instável é pior que um teste ausente, porque o agente aprende a ignorar falhas.

## Revise o workflow, não o código

Em alguns casos, uma pessoa já não revisa o código. Mesmo assim, alguém responde pelo resultado. A responsabilidade muda de lugar: o humano passa a revisar o workflow e a validar o comportamento.

O que eu reviso:

- Regras: o linter e o arquivo de contexto cobrem os erros que já aconteceram?
- Testes: os cenários descrevem o comportamento esperado, incluindo os casos de borda?
- Evidência: o vídeo e o resultado do CI mostram que o fluxo funciona?
- Skills e hooks: o procedimento que o agente segue está correto e completo?

Quando um bug passa, a correção tem duas partes. Primeiro corrija o código. Depois pergunte por que o workflow deixou o bug passar. A resposta vira uma regra no linter, um cenário novo ou uma linha no contexto. Assim o mesmo erro não volta e o workflow melhora a cada falha.

## Times de agentes

O próximo passo da AX é fazer vários agentes trabalharem juntos. É o que estou construindo no [ZettaBot](https://zettabot.app/), um projeto open source que roda no seu próprio servidor. Você descreve um resultado e um time de bots faz o trabalho.

Cada bot é um trabalhador configurado, como um Writer ou um Reviewer. Ele roda sobre um agente que você já usa (Claude Code, Codex, Cursor, Pi, OpenCode), recebe skills, plugins e servidores MCP e tem a sua própria forma de trabalhar. Um bot principal, o Zetta, cria os outros bots, distribui as tarefas e mantém as rotinas. As tarefas passam por backlog, em andamento, bloqueada, revisão e concluída, e cada card mostra o bot responsável. Ações sensíveis, como apagar dados ou enviar e-mail, exigem a sua aprovação.

A estrutura repete o que o post descreveu para um único agente: contexto, ferramentas e guardrails. A diferença é que agora existem papéis, e o objetivo do time é entregar com qualidade e velocidade.

## Conclusão

AX é dar ao agente contexto, ferramentas e uma forma rápida de saber se acertou. Quanto melhor o workflow, menos o código precisa ser revisado linha por linha. Comece por um passo: pegue o último erro do seu agente e transforme-o em uma regra ou em um teste.

Obrigado pela leitura.
