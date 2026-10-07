---
level: 1
title: "Construindo um frontend flexível"
language: "pt-br"
translations: ["pt-br", "en-us"]
subjects: ["frontend", "react", "typescript", "javascript"]
date: "2019-08-28T23:59:59.999Z"
description: "Como um frontend multi-tenant se tornou flexível o bastante para atender marcas diferentes"
---

Como mencionei no post anterior, criei um parser de BBCode para dar suporte a um frontend flexível. Cores, textos, ícones e imagens precisavam ser dinâmicos, pois cada um desses elementos era controlado pelo **tenant** da aplicação.

A seguir, explico as decisões técnicas por trás dessa flexibilidade. Cada subtítulo se baseia em um requisito real que surgiu durante o desenho da arquitetura e o desenvolvimento do frontend.

# "Preciso de um site que mude de acordo com a marca"

Foi nesse ponto que a complexidade do projeto começou a aparecer. A equipe já havia escolhido a maior parte da stack, e alguns componentes já estavam prontos. O restante da arquitetura também começava a tomar forma. A stack era:

- React - SPA (Single Page Application)
- Typescript
- Redux + Redux Saga
- Ant Design (uma biblioteca auxiliar para componentes que demorariam muito para ser construídos em um prazo curto)
- Tachyons CSS
- RC Components (uma biblioteca que ajudava em alguns componentes sem tirar nossa liberdade para personalizar o visual)
- `moment`, porque o Ant Design dependia dele, embora eu preferisse usar `date-fns`
- Axios para requisições HTTP
- `react-text-mask` para máscaras como CPF, CNPJ, telefone e CEP
- Um campo de moeda desenvolvido _do zero_, inspirado em um componente semelhante do aplicativo móvel NuBank

Outra decisão importante, e potencialmente arriscada, foi adotar React Hooks cedo. Versões Alpha podem trazer problemas no futuro, mas começar com Hooks nos deu tempo para entendê-los e criar custom hooks que compartilhavam lógica pela aplicação — inclusive a estratégia de rotas dinâmicas.

> "Preciso de um site que mude de acordo com a marca. Quando o usuário acessar o domínio xpto.com, ele irá ver esse site na cor preta. Quando acessar o site abcd.dev, ele irá ver o site na cor roxa. Uma coisa que eu queria que fosse possível é ao abrir o código fonte não ter a possibilidade de ver dados de outro site, mesmo o código sendo o mesmo"

Isso dá uma ideia da stack. Como usávamos o Ant Design, também precisei adaptar todo o CSS ao nosso modelo de configuração para que o sistema visual fosse dinâmico. Foi aí que surgiu o primeiro problema.

1. O primeiro desafio era definir variáveis de CSS em tempo de execução. O CSS aceita variáveis por meio da função `var` ([referência na MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/var)), e defini-las em uma folha de estilos é simples. Porém, a folha podia chegar a 39 mil linhas, então não era prático manter um arquivo separado para cada tema. A solução foi usar o seletor `:root`, que aponta para o elemento raiz do HTML. Ao consultar `:root` e definir propriedades nele, podíamos aplicar as variáveis do tema em tempo de execução:

```javascript
import config from "./config-site";
const root: any = document.querySelector(":root");
Object.keys(config).forEach((x: string) => root.style.setProperty(`--${x}`, `${config[x]}`));
```

Assim, o problema das variáveis estava resolvido. Tínhamos um arquivo de configuração estático que definia as variáveis do frontend, e o restante da aplicação podia consumi-las sem outras mudanças.

2. Tínhamos um CSS agnóstico às cores, capaz de interpretar as variáveis do objeto de configuração, mas ainda precisávamos de um arquivo de configuração dinâmico. Como fazer a aplicação carregar a configuração correta para cada domínio ou subdomínio sem expor dados de outro tenant? Esse problema não seria resolvido apenas no frontend, nem em um único lugar. Combinamos uma prática já existente na equipe com uma ferramenta de CLI para controlar os temas. Se você leu o post anterior, talvez se lembre do roteador de UI; se não, ele fornece o contexto necessário para o que vem a seguir.

O roteador de UI é um web server em F# que escuta requisições para os domínios registrados (neste caso, `xpto.com` e `abcd.dev`). Ao receber uma requisição para `xpto.com`, ele localiza em um bucket S3 da Amazon os arquivos correspondentes — JavaScript, CSS e outros assets gerados pelo build do React — e monta um `index.html` personalizado. Alguns valores são injetados nesse HTML:

- Tenant
- Versão
- Url dos assets

Como o roteador monta um arquivo `.html`, ele pode injetar JavaScript e decidir quais arquivos servir. As duas coisas são possíveis, mas encontramos uma forma ainda mais simples de evitar `ifs` específicos para cada tenant.

**_Personalizar o build do React para gerar uma pasta por tenant. Assim, a própria URL informa ao roteador de UI qual arquivo carregar._**

A solução era simples, prática e eficiente. Ela exigia manter um arquivo de configuração por tenant, o que não era ideal, mas arquivos `.json` separados ainda eram mais fáceis de manter do que uma grande quantidade de condicionais. Arquivos diferentes podem se afastar uns dos outros — um recebe uma alteração e outro não —, um problema comum em equipes. O Git ajuda, mas, nesse caso, cada edição ainda podia gerar um conflito. O motivo ficará claro mais adiante. Primeiro, veja o arquivo de configuração:

```javascript
{
    "tenant": "Xpto Industries ModaFoca",
    "colors": {
        "primary": "#000000",
        "info": "#00f"
    },
    "icon": "https://...",
    "logo": "https://...",
    "banner": "https://...",
    "text": {
        "pt-BR": {
            "tituloSite": "Hackear o planeta",
            "footerSite": "Hackear o planeta",
        },
        "en-US":{
            "tituloSite": "Hack the planet",
            "footerSite": "Hack the planet",
        }
    }
}
```

O arquivo real é bem maior, pois contém mais cores, textos e imagens. Este trecho já é suficiente para mostrar a estrutura. A pergunta seguinte é: _"Como um navegador vai ler um arquivo JSON e transformá-lo em JavaScript?"_ A resposta é: **não vai**. Essa era a função do `script00`: transformar JSON em um objeto JavaScript. A conversão em si é simples — criar um arquivo `.js` e atribuir o objeto a uma variável —, mas o script também cuidava de regras como converter `http` para `https`, substituir o nome do tenant com base no nome do arquivo e gerar variações de cores. A ideia importante é esta: `criar um script que gere JavaScript a partir de um diretório de arquivos JSON`.

```javascript
const FS = require("fs");
const PATH = require("path");
const signale = require("signale");
const { transparentize, lighten, darken } = require("polished");

const dirname = `${__dirname}/../config/`;

const alpha = (color, name) => ({
  [`${name}Alpha`]: transparentize(0.5, color)
});
const light = (color, name) => ({ [`${name}Light`]: lighten(0.2, color) });
const lightest = (color, name) => ({
  [`${name}Lightest`]: lighten(0.6, color)
});
const dark = (color, name) => ({ [`${name}Dark`]: darken(0.2, color) });
const darkest = (color, name) => ({ [`${name}Darkest`]: darken(0.6, color) });

const colorize = (theme) => (acc, x) => {
  const c = theme[x];
  if (!`${c}`.startsWith("#")) {
    return acc;
  }
  return {
    ...acc,
    [x]: c,
    ...alpha(c, x),
    ...light(c, x),
    ...dark(c, x),
    ...darkest(c, x),
    ...lightest(c, x)
  };
};

const manifestJsonGenerator = (json, colors) => {
  return {
    short_name: json.tenant,
    name: json.tenant,
    icons: [
      {
        src: json.icon,
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon"
      },
      {
        src: json.icon,
        sizes: "512x512",
        type: "image/x-icon"
      }
    ],
    start_url: ".",
    orientation: "natural",
    display: "standalone",
    theme_color: colors.primary,
    background_color: "#000"
  };
};

const replaceTenantName = (json, language) => {
  return JSON.stringify(json.lang[language])
    .replace(/XPTO/gi, json.tenant)
    .replace(/ABCD/gi, json.tenant)
    .replace(/XYZ/gi, json.tenant);
};

const createConfigFile = (contents, filename, referenceObject) => {
  const json = JSON.parse(contents);
  const { theme } = json;
  const tenant = filename.replace(/.json$/, "");
  signale.start(`Generate ${tenant} theme`);
  const colors = Object.keys(theme).reduce(colorize(theme), {});
  const ptBrTexts = JSON.parse(json.text, "pt-BR");
  const enUSTexts = JSON.parse(json.text, "pt-BR");
  return {
    ...JSON.parse(contents),
    theme: colors,
    texts: {
      ...json.texts,
      "pt-br": JSON.parse(ptBrTexts),
      "en-us": JSON.parse(enUSTexts)
    }
  };
};

const createContent = async (path, filename, referenceObject) => {
  if (filename !== "reference.json") {
    FS.readFile(`${path}${filename}`, "utf8", (err, contents) => {
      const json = JSON.parse(contents);
      const { theme } = json;
      const tenant = filename.replace(/.json$/, "");
      const prefixBuild = PATH.join(__dirname, "..", "build");
      const themeJS = PATH.join(prefixBuild, "js", `${tenant}.js`);
      const colors = Object.keys(theme).reduce(colorize(theme), {});
      const fullFile = createConfigFile(contents, filename, referenceObject);
      writeBpConfigFile(themeJS, fullFile);
      const folderName = PATH.join(prefixBuild, tenant);
      const manifestJson = PATH.join(folderName, "manifest.json");
      if (!!json.tenant) {
        FS.mkdir(folderName, () => {
          const manifest = manifestJsonGenerator(json, colors);
          FS.writeFile(manifestJson, JSON.stringify(manifest, null, 4), "utf-8", (err) => {
            signale.success(`Manifest.json for tenant: ${tenant}`);
          });
        });
      }
    });
  }
};

const prefixVar = "window.$___VARIAVEL_COM_NOME_IMPOSSIVEL_DE_SER_COPIADO___.config";

const writeJsVarInFile = (path, fullFile, format = false) => {
  if (format) {
    return FS.writeFileSync(path, `${prefixVar}=${JSON.stringify(fullFile, null, 4)}`);
  }
  return FS.writeFileSync(path, `${prefixVar}=${JSON.stringify(fullFile)}`);
};
const REFERENCE_FILE = PATH.join(dirname, "..", "config", "reference.json");
const referenceObject = FS.readFileSync(REFERENCE_FILE, { encoding: "utf-8" });
const createFiles = async () => {
  FS.readdir(dirname, (_, files) => {
    files.forEach(async (file) => {
      await createContent(dirname, file, JSON.parse(referenceObject));
    });
  });
};
module.exports = {
  REFERENCE_FILE,
  referenceObject,
  writeJsVarInFile
};
```

É bastante código, mas ele mostra o fluxo completo. Alterei alguns detalhes para não expor informações proprietárias. A pasta `build` é a mesma gerada pelo React. Para integrar esse processo ao build do React, a opção mais simples foi usar `eject` e assumir o controle da configuração do webpack e dos scripts de build. Esse script era executado ao final de `scripts/build.js`, o arquivo responsável pelo build do frontend. Antes de passar ao terceiro problema, há uma pergunta razoável:

> **Não teria sido mais fácil usar plugins do webpack para gerar esses arquivos?** Sim. Em desenvolvimento, conveniência costuma vir acompanhada de algum compromisso. Quando você precisa desse nível de flexibilidade, talvez seja necessário trabalhar mais perto do sistema de build.

3. O último problema era manter os arquivos de configuração sincronizados quando um texto ou outro conteúdo mudasse. Para resolvê-lo, escrevi mais um script, executado sempre que eu precisasse adicionar um texto ao site.

```javascript
const { REFERENCE_FILE, writeJsVarInfile, referenceObject } = require("./frontend-builder");
const FS = require("fs");
const PATH = require("path");
const signale = require("signale");
const [shell, file, key, text, language = "pt-br"] = process.argv;
const CONFIGS_DIR = PATH.join(__dirname, "..", "config");
if (!!!key || !!!text) {
  signale.fatal("Informe a chave e o texto a ser inserido");
  process.exit(1);
}
FS.readdir(CONFIGS_DIR, (_, files) => {
  files.forEach(async (file) => {
    const pathToFile = PATH.join(CONFIGS_DIR, file);
    const jsonString = FS.readFileSync(pathToFile, { encoding: "utf-8" });
    const json = JSON.parse(jsonString);
    signale.info(`Write: ${key} with value ${text}`);
    const fileContent = JSON.stringify(
      {
        ...json,
        texts: {
          "pt-br": {
            ...json.texts["pt-br"],
            [key]: text
          }
        }
      },
      null,
      4
    );
    FS.writeFileSync(pathToFile, fileContent);
    signale.complete("DONE");
    if (file === "reference.json") {
      const path = PATH.join(__dirname, "..", "public", "PLACEHOLDER.js");
      try {
        const configuration = createConfigFile(fileContent, path, JSON.parse(referenceObject));
        signale.success("Criando arquivo de configuração do placeholder", path);
      } catch (error) {
        signale.fatal(error);
      }
    }
  });
});
```

Este trecho de código é mais extenso. Alguns erros podem aparecer porque removi linhas que continham informações que não podem ser publicadas. O bloco `if (file === "reference.json")` cria um arquivo de desenvolvimento que funciona como _esqueleto_, pois o roteador de UI fornece a configuração completa pelo HTML. É um _hack_, ou uma **gambiarra**, que permite executar o projeto sem erros durante o desenvolvimento.

# "Preciso que este texto fique em negrito e que aquele botão envie uma mensagem pelo WhatsApp da loja"

Este foi o requisito mais desafiador. A configuração dos textos já estava pronta e todas as strings estavam definidas. Para oferecer formatação rica, precisávamos decidir em tempo de execução quais partes de uma string ficariam em negrito e quais se tornariam links. A princípio tentamos evitar a mudança, mas no fim não havia alternativa.

A primeira ideia foi usar um parser de Markdown. Encontrei boas opções, mas nenhuma resolvia o requisito específico do WhatsApp. Surgiu então uma decisão conhecida por muitos desenvolvedores JavaScript: **quando nenhuma biblioteca faz exatamente o que você precisa, crie uma do zero e sem dependências.** Parece um clichê, mas, depois de pesquisar as opções disponíveis, não encontrei uma solução que atendesse aos requisitos.

Gosto de parsers desde que comecei a programar. Um dos meus primeiros projetos pessoais foi um parser de BBCode para HTML escrito em Shellscript. _Se você gosta de programação, tente algo parecido para aprender expressões regulares, parsers, yacc e assuntos relacionados._ BBCode não é um formato melhor que Markdown para pessoas não técnicas, mas eu já tinha experiência com ele. Depois de alguns testes — e de mais algumas doses de energético — escrevi esta versão em JavaScript. [O código é público e será atualizado em meados de setembro](https://github.com/g4rcez/code-markup-parser). Não é o projeto mais elegante do mundo, mas resolveu o problema e também conseguiu gerar o link do WhatsApp.

Esse **code-markup-parser** gera um HTML, e como faço pra interpretar HTML puro em React?

```jsx
<span dangerouslySetInnerHTML={{ __html: codeMarkupParser(parsed) }} />
```

Uma das proteções importantes foi sanitizar todo o HTML de entrada. HTML e JavaScript potencialmente maliciosos são removidos das strings antes que elas sejam renderizadas.

O passo seguinte foi criar um método que lê as strings do objeto de configuração e as transforma em HTML. Assim, a configuração pode representar um texto em negrito como `[b]Isso está em negrito no meu site[/b]`.

```javascript
const remapTexts = (map: any) => (acc: string, x: string) => acc.replace(new RegExp(RE(x), "gi"), map[trueTrim(x)]);

const parseWithParams = (resolvedValue: string, textParams: any) =>
	Object.keys(textParams).reduce(remapTexts(textParams), resolvedValue || "");

export function resolve({ text, textParams = {} }: ResolverType) {
	const map = selectLanguage();
	const resolvedValue = map[text] as any;
	if (Array.isArray(resolvedValue)) {
		return resolvedValue;
	}
	if (isEmpty(textParams)) {
		return <span dangerouslySetInnerHTML={{ __html: BbCode(resolvedValue) }}/>
	}
	return <span dangerouslySetInnerHTML={{ __html: BbCode(parseWithParams(resolvedValue, textParams)) }}/>
}
```

As strings também precisavam aceitar variáveis. As funções `remapTexts` e `parseWithParams` resolvem esse caso. Textos que exigem formatação e interpolação usam esta sintaxe: `[b]Este texto está em negrito[/b] e este texto usa uma variável {{ varName }}`. No JSX, fica assim:

```jsx
<p>
  {resolve({
    text: "stringQueExisteNoMapaDeTraducao",
    textParams: {
      varName: props.redux.umValorDoRedux
    }
  })}
</p>
```

Depois disso, a configuração ficou muito mais fácil de manter. O design podia editar o conteúdo visual e o marketing podia escrever os textos sem exigir uma grande alteração no código a cada atualização.

# "Esse link não deve aparecer quando o usuário não tiver produtos suficientes"

O pedido completo era mais longo:

> "Esse link não deve aparecer quando o usuário não tiver produtos suficientes. Ele deve redirecionar para a página exibida quando não houver nenhum produto. Também valide que, quando não houver produtos, sempre apareça um item de menu oferecendo um novo produto. Percebi que, depois de cancelar um produto, o menu continuava visível até o recarregamento da página. Isso não parece certo."

À primeira vista, o problema pode não parecer difícil. Na prática, ele envolve o controle dinâmico de rotas e menus. Os dois estão intimamente relacionados, mas aplicações React costumam construí-los separadamente — principalmente quando a navegação muda conforme o perfil do usuário autenticado.

Resolvi o problema rapidamente porque já havia pensado nele. Eu o tinha adiado enquanto trabalhava em outros componentes, refatorava o código e cuidava de questões de segurança. Também preciso admitir que UX não é minha área mais forte.

Como mencionei, rotas e menus estão relacionados. Por isso, agrupei os dois em um único array e filtrei esse array de acordo com o perfil do usuário.

1. Criar uma lista de objetos com o componente, o ícone do menu, os títulos do menu e da página e o perfil autorizado a visualizar a rota.
2. Listar todas as dependências necessárias para avaliar a rota (a palavra "dependência" provavelmente já faz você pensar em um `useEffect`).
3. Manter isolada a lógica de validação de cada rota e adicioná-la ao objeto do primeiro passo.
4. Configurar o React Router para gerar elementos `<Route />` a partir do array, em vez de declarar cada rota manualmente.
5. Filtrar o array usando as informações dos passos 1, 2 e 3.

A implementação ficou assim:

```jsx
import resolve from "@/config/texts";
import HomeClient from "@/pages/HomeClient";
import useConnect from "@/hooks/state-manager/useConnect";
import { GlobalState } from "@/reducer";
import { useEffect, useState } from "react";
import { isEmpty } from "sidekicker/lib/comparable";
import { MdHome, MdAccountCircle, MdCreditCard, MdViewList, MdTransform } from "react-icons/md";
import { IconType } from "react-icons";

export type ClientRoute = {
	icon: IconType;
	title: string;
	route: string;
	useAuth: boolean;
	component: () => React.ReactElement;
	validate: (products: Product[]) => boolean;
};

const configRoutes: ClientRoute[] = [
	{
		icon: MdHome,
		title: resolve({text: "paginaInicial"}),
        // por costume, gosto de separar todos
        // os links da aplicação em um objeto, assim não
        // faço repetição de strings
        route: Links.client.home,
		component: HomeClient,
		useAuth: true,
		validate: (products: Product[]) => logicToEnable(products) && other(products)
    },
    // ...
];
const mapStateToProps = (_: GlobalState) => ({ products: _.ProductReducer.products });
const useClientRoutes = () => {
    const [routes, setRoutes] = useState([] as ClientRoute[]);
    // Esse useConnect foi um custom hook que vou disponibilizar no futuro
    // é basicamente o mesmo que o componente connect do react-redux
    // mas sem necessidade de fazer um wrapper e retorna os tipos corretos também
	const props = useConnect(mapStateToProps, {});
	const hasActiveCard = !isEmpty(ProductService.hasActiveItem(props.cards));
	useEffect(() => {
		const newRoutes = configRoutes.filter((x) => x.validate(props.products));
		setRoutes(newRoutes);
	}, [props.products]);
	return routes;
};

export default useClientRoutes;
```

A solução não era especialmente complexa, mas eliminou regras duplicadas. O mesmo array alimenta o React Router e as barras de navegação. Ao alterar esse hook, os dois sistemas mudam e aplicam a mesma validação. Quando o valor `products` do Redux é atualizado, o router e a navbar já usam o novo conjunto de regras.

Essa flexibilidade teve um impacto no desempenho: o `bundle.js` estava se aproximando de 600 KB. Por causa da estrutura do roteador de UI, o [code splitting](https://reactjs.org/docs/code-splitting.html) padrão não funcionava. O caminho dos assets era diferente do domínio usado para acessar a aplicação, então `Suspense` e `lazy` não conseguiam resolver os chunks corretamente.

O problema ainda precisava de uma solução e acabou se tornando a principal razão para escrever este relato mais aprofundado sobre a construção da UI.

# "O site está muito lento para abrir. Precisamos resolver isso com urgência."

O impacto no desempenho era, em grande parte, consequência dos requisitos não funcionais acumulados ao longo do projeto. Aceitei o desafio, embora não tivesse certeza do resultado: já havia passado três meses pesquisando code splitting para uma arquitetura semelhante sem encontrar uma solução viável.

Quando me concentrei apenas nesse problema, encontrei uma solução em cerca de três horas. Antes disso, passei outras cinco horas esboçando ideias e testando hipóteses. Estas foram as opções consideradas:

1. Criar um proxy no roteador de UI que redirecionasse cada padrão de chunk do webpack para o bucket S3 correto do tenant. Seria uma solução cara e ineficiente.

2. Criar um script que forçasse as URLs dos tenants e alterasse o versionamento da UI para `v0.0.0-nome-do-tenant`. No build, um script `.sh` substituiria os padrões dos chunks pela URL do bucket S3 de cada tenant. Era uma solução improvisada, com custos de manutenção de longo prazo, mas foi considerada seriamente.

3. Estudar o webpack em profundidade.

A opção correta foi a terceira.

Sempre detestei trabalhar com webpack, e alterar a configuração gerada pelo CRA é ainda menos agradável. Eu sabia que o webpack era poderoso, mas não esperava que ele resolvesse esse problema de forma tão direta.

O `bundle.js`, que tinha quase 600 KB, se transformou em vários chunks de no máximo 10 KB. O maior, que continha os arquivos de actions do Redux e as regras de negócio, ficou com 120 KB. Não foi mágica, mas o resultado do code splitting com as APIs `Suspense` e `lazy` do React.

A chave estava na documentação do webpack, especificamente [no guia sobre `public-path`](https://webpack.js.org/guides/public-path/). Eu havia procurado `__webpack_public_path__` em `bundle.js`, `build.js`, `start.js` e no restante do runtime da aplicação, mas não encontrei a variável. Achei que fosse uma opção interna. Como o CRA já configura `PUBLIC_PATH`, imaginei que essa fosse a abstração correta, mas alterá-la não resolveu o problema. Então encontrei [esta issue que explica a diferença entre `PUBLIC_PATH` e `__webpack_public_path__`](https://github.com/facebook/create-react-app/issues/6024). Isso esclareceu a solução:

```javascript
// Seta o on the fly do webpack em runtime (por isso on the fly)
/// <reference path="./definitions/definitions.d.ts" />
declare let __webpack_public_path__: string;
__webpack_public_path__ = `https://buckets.amazao/${$__OBJECT__.tenant}/sites/${$__OBJECT__.version}/`;
```

Problema resolvido. Uma pequena alteração em runtime corrigiu um problema que estava aberto havia mais de três meses.

A nota de performance do Lighthouse também subiu de 3 — em uma conexão lenta e um celular fraco — para 92 nas mesmas condições.

Este foi meu relato detalhado de um projeto real e dos compromissos por trás da arquitetura do frontend. Ainda pode restar uma pergunta:

> "Mas Allan, isso não é uma gambiarra? Usar `window` como uma variável global para a aplicação consumir."

Eu tive a mesma preocupação no início. Mas aplicações JavaScript às vezes precisam de soluções pouco convencionais, mesmo quando usam TypeScript, lint rigoroso, testes e outras boas práticas. A [história do JavaScript](https://en.wikipedia.org/wiki/JavaScript) ajuda a contextualizar: restrições de desempenho e compartilhamento de estado entre fronteiras costumam levar a padrões semelhantes.

Um bom ponto de referência é: _"Se o Facebook controla a versão do React adicionando informações ao objeto `window`, por que não posso configurar minha UI da mesma forma?"_

O problema não é escolher uma implementação pouco convencional. Se ela atende aos requisitos do negócio, a equipe entende e aceita os compromissos e a manutenção continua administrável, então é uma decisão de engenharia válida.
