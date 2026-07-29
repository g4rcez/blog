---
level: 1
title: De volta ao CSS
subjects: ["frontend"]
language: "pt-br"
translations: ["pt-br", "en-us"]
date: "2026-07-29T12:15:47.000Z"
description: "A transição do Tailwind CSS para CSS puro"
---

Utilizo [Tailwind CSS](tailwindcss.com) desde a v1. Foi uma excelente aposta, com muitos benefícios:

- Prototipação rápida
- CSS funcional por padrão
- Uma ótima forma de utilizar os tokens do design system
- Geração de CSS integrada ao código do projeto
- IntelliSense e LSP desde a v1

É uma ferramenta valiosa para qualquer frontend. Agora, na v4, quase seis anos após a v1, temos ainda mais recursos integrados ao Tailwind CSS. Ele se tornou um padrão frequente no desenvolvimento com IA e possui integração com ferramentas como o Vite. Mesmo com tudo isso, por que estou falando em voltar ao CSS? É esse o assunto deste artigo.

## IA e Tailwind CSS

É claro que precisamos falar sobre IA, mas sem deixar que ela domine o assunto. Desde o lançamento do [Vercel V0](https://v0.app/), o uso do Tailwind CSS cresceu ainda mais, como mostram os downloads do pacote no npm. Há muitos exemplos e sites que utilizam Tailwind CSS, além de ferramentas de IA que o escolhem como padrão ao iniciar um projeto.

Mas qual é o papel da IA nisso? Quando pensamos na geração de código, uma IA sem um bom harness, regras rigorosas e exemplos sólidos tende a criar componentes com longas listas de classes. Ela replica esse padrão e utiliza valores inconsistentes, o que dificulta bastante a manutenção da interface.

É possível trabalhar rapidamente com IA e Tailwind CSS, mas é necessário configurar boas regras e skills para garantir o resultado desejado. Também é fundamental fornecer exemplos de qualidade. Disponibilizar os componentes com ferramentas como [shadcn](https://ui.shadcn.com/) ajuda a manter esse padrão.

De forma geral, minha experiência com Tailwind CSS e IA sem as ferramentas adequadas produziu mais código inconsistente do que o resultado esperado. O comportamento padrão precisa ser direcionado, o que exige mais tempo para desenvolver as skills e regras específicas do projeto.

## O bom e velho CSS

O CSS surgiu em 1996, mas evoluiu muito em recursos e suporte desde então. Basta observar seletores como `:is` e `:where`, os [pseudoelementos](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements) e outras funcionalidades que chegaram às versões mais recentes da linguagem.

A pergunta é: por que CSS puro? Utilizar apenas CSS, em vez de um framework, oferece mais benefícios do que pode parecer:

- Controle refinado de performance
- Uso de `@layer` para controlar a cascata do CSS
- Classes semânticas
- Configuração mínima
- Redução do tamanho do HTML em SSR
- Aplicação de estilos com uma única classe CSS

É claro que existem desvantagens em utilizar CSS puro no lugar do Tailwind CSS, mas lidar com trade-offs faz parte do nosso trabalho. Para compreendê-los, vale analisar cada um dos benefícios listados.

### Controle refinado de performance

Quem se preocupa com a performance do CSS? Deveríamos prestar mais atenção a ela. Existem várias formas de melhorá-la: reduzir a complexidade dos seletores, incluir apenas os estilos necessários e controlar o carregamento das folhas de estilo com media queries, preloads e outras estratégias.

Incluí este tópico principalmente para falar sobre o seletor `:has`, que possui [considerações de performance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has#performance_considerations).

O Tailwind CSS utiliza o seletor `:has` por meio de variantes como `has-focus` e `has-checked`. É um recurso útil, mas exige alguns cuidados. Utilize-o de forma criteriosa.

## Utilizando `@layer` para controlar a cascata do CSS

Ao trabalhar com design systems, pode ser necessário garantir determinados comportamentos visuais e evitar que os consumidores sobrescrevam estilos por acidente. O `@layer` oferece mais controle sobre essa organização.

O Tailwind CSS também utiliza `@layer` para organizar suas regras de CSS funcional, como properties, theme, base, components e utilities. O mesmo recurso pode ser aplicado aos componentes do projeto, como cards e dialogs.

## Classes semânticas

Precisamos compreender o contexto dos componentes, não apenas suas classes CSS. Uma classe semântica reduz o contexto necessário para uma IA porque dispensa a interpretação individual de cada utility class do Tailwind CSS. Compare as duas implementações de um botão no HTML ou JSX:

- CSS: `button`
- Tailwindcss: `px-4 py-2 bg-slate-950 text-white hover:bg-slate-900 transition-colors transition-discrete duration-300 ease-linear`

As utility classes descrevem a aparência do botão. A classe semântica descreve o que o elemento representa. Essa diferença é relevante quando um agente de IA precisa analisar um componente: `button` oferece o contexto necessário sem exigir a interpretação de cada decisão visual presente no markup.

Isso também cria um único lugar para alterar essas decisões. Se a duração da transição ou a cor de fundo mudar, o markup do componente permanece intacto. A folha de estilos se torna a fonte da verdade, em vez de cada ocorrência da lista de classes.

Semântico não significa vago. Classes globais como `.container` ou `.item` podem gerar mais confusão do que resolver problemas. Os nomes devem representar um componente ou uma responsabilidade clara. Quando necessário, os estilos podem ser isolados com CSS Modules, uma convenção de nomenclatura ou uma cascade layer explícita.

### Configuração mínima

CSS faz parte da plataforma web. Ele não precisa de um plugin para interpretar nomes de classes, analisar arquivos do projeto ou gerar uma folha de estilos. Um bundler ainda pode processar e minificar o código, mas o navegador não depende dessas ferramentas para compreendê-lo.

Isso reduz a quantidade de conceitos envolvidos no projeto. Não há uma configuração de framework, um mapeamento entre nomes de utilities e propriedades CSS ou a necessidade de atualizar uma dependência para utilizar um recurso do navegador. Quando uma nova funcionalidade do CSS atinge o nível de suporte exigido pelo projeto, ela pode ser utilizada diretamente.

Configuração mínima não significa ausência de estrutura. O projeto ainda precisa de decisões sobre tokens, organização de arquivos, especificidade e cascata. A diferença é que essas decisões podem ser expressas com a própria linguagem.

### Redução do tamanho do HTML em SSR

Utility classes repetem informações visuais em cada elemento renderizado. Uma classe semântica substitui essa lista por um identificador pequeno:

```tsx
<button className="button">Save changes</button>
```

A diferença em um único botão é irrelevante. Em uma página extensa renderizada no servidor, ela pode se tornar mensurável, principalmente quando a mesma lista de classes aparece muitas vezes. A compressão reduz o custo da transferência, mas o navegador ainda recebe e processa o markup expandido.

Esse fator, isoladamente, não justifica reescrever uma aplicação. Ele é mais um trade-off a considerar quando o tamanho do HTML, o streaming ou a performance de renderização são relevantes.

### Aplicação de estilos com uma única classe CSS

Uma classe pode concentrar todo o contrato visual de um componente. Tokens, estados de interação, preferências de acessibilidade e comportamento responsivo permanecem juntos, em vez de distribuídos pelo markup:

```css
@layer components {
    .button {
        padding: var(--space-2) var(--space-4);
        color: var(--color-on-primary);
        background: var(--color-primary);
        border-radius: var(--radius-medium);
        transition: background-color 300ms linear;
    }

    .button:hover {
        background: var(--color-primary-hover);
    }

    @media (prefers-reduced-motion: reduce) {
        .button {
            transition: none;
        }
    }
}
```

O JSX comunica a intenção, enquanto o CSS controla a apresentação. Um agente de IA pode reutilizar a classe sem recriar as regras visuais do componente ou introduzir um valor de espaçamento ligeiramente diferente. O code review também se torna mais simples: uma alteração no design do botão aparece na folha de estilos, não em cada componente que o utiliza.

## Os trade-offs

CSS puro não elimina a complexidade. Ele devolve essa responsabilidade à equipe. Alguém precisa definir a cascata, impedir estilos globais acidentais, identificar regras sem uso e manter a consistência dos design tokens. O Tailwind CSS oferece convenções e ferramentas para vários desses problemas por padrão.

A colocalização é outra diferença. Utility classes permitem compreender quase toda a apresentação de um componente sem abrir outro arquivo. Com CSS, pode ser necessário alternar entre o componente e sua folha de estilos. CSS Modules e nomes de arquivo previsíveis reduzem esse custo, mas não o eliminam.

As variantes também exigem uma API intencional. Uma utility pode ser adicionada diretamente para atender a uma exceção, enquanto um componente semântico precisa de uma classe, um atributo ou uma custom property que represente essa variação. Considero essa restrição útil em componentes compartilhados, embora ela possa tornar a experimentação mais lenta.

O Tailwind CSS continua sendo uma excelente escolha quando a equipe já possui uma configuração consistente, uma biblioteca de componentes madura e regras claras para o código gerado. Voltar ao CSS não significa que todo projeto deve remover o Tailwind CSS. É uma decisão de priorizar os recursos nativos do navegador e uma abstração menor nos projetos em que controlo a arquitetura.

## Minha abordagem

Não estou voltando ao CSS de 1996. Utilizo CSS moderno, com custom properties para os design tokens, cascade layers para controlar a ordem, media queries e container queries para adaptação, além de estilos isolados quando o framework oferece esse recurso.

A estrutura básica é intencionalmente pequena:

1. Uma layer de tokens define cores, espaçamentos, tipografia e movimento.
2. Uma layer base define os padrões do documento e o comportamento dos elementos.
3. Uma layer de componentes contém as classes semânticas.
4. Uma layer de utilities contém apenas as poucas exceções reutilizáveis de que o projeto precisa.

Essa organização oferece aos desenvolvedores e agentes de IA um lugar claro para encontrar cada decisão. Mais importante, ela mantém o código gerado sob as mesmas restrições do código escrito manualmente. O objetivo não é evitar ferramentas, mas garantir que elas ofereçam suporte à plataforma sem se tornarem a própria plataforma.

## Conclusão

O Tailwind CSS ajudou as equipes de frontend a pensar melhor sobre restrições, tokens e regras visuais reutilizáveis. Hoje, o CSS moderno consegue expressar muitas dessas ideias diretamente, com um markup menor e uma intenção mais clara nos componentes. Para o meu trabalho atual, voltar ao CSS oferece o controle e a simplicidade que procuro, com trade-offs que estou disposto a administrar.

Obrigado pela leitura.
