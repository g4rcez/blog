---
useFolks: true
title: "Construindo um frontend flexível"
language: "pt-br"
translations: ["pt-br"]
subjects: ["frontend", "react", "typescript", "javascript"]
date: "2019-08-28T23:59:59.999Z"
description: "Você vai se impressionar o quão flexível vai ser essa aplicação"
---

Como havia escrito no post anterior, acabei fazendo um parser de BB code pra ter um frontend flexível. Cores, textos, ícones, imagens...Uma porrada de coisa teve que ser dinâmica pois quem controla cada um dos itens citados é o **tenant** das aplicações

Sem mais delongas, vamos para a parte técnica e junto a isso eu irei explicar o requisito ou necessidade para tal problema. A partir daqui, os sub títulos serão frases que ouvi após todo o desenho da arquitetura do frontend e começo do desenvolvimento de alguns componentes ou até mesmo páginas do frontend

## "Preciso de um site que mude de acordo com a marca"

Foi nesse ponto que toda a bagunça começou. Já havia definido junto a equipe tudo o que seria usado, alguns componentes já haviam sido escritos. Grande parte da futura stack já havia sido definida. _Calma, eu vou falar a stack_

- React - SPA (Single Page Application)
- Typescript
- Redux + Redux Saga
- Ant Design (biblioteca auxiliar para alguns dos componentes que iriam dar um trabalho maior pra fazer em uma deadline curta)
- Tachyons CSS
- RC Components (biblioteca para auxiliar em alguns componentes, mas que ainda nos dava a flexibilidade para editar o visual)
- Como o antd faz o uso do moment, tive que agregar o moment ao projeto, apesar de querer usar date-fns para este projeto
- Axios para requisições HTTP
- react-text-mask para criação de algumas máscaras como CPF, CNPJ, telefone, CEP...
- O currency input foi desenvolvido _na pata_, inspirado em algo parecido com o do NuBank (app mobile)

Uma outra decisão importante e talvez um pouco arriscada (eu não achei, apesar de usar builds Alpha sempre pode causar problemas futuros) foi a adoção prematura de ReactHooks. O fato de ter adotado bem no começo nos fez aprender mais sobre e também criar custom hooks que nos ajudaram a compartilhar código por toda a aplicação (inclusive a estratégia de rotas dinâmicas foi feita com hooks)

> "Preciso de um site que mude de acordo com a marca. Quando o usuário acessar o domínio xpto.com, ele irá ver esse site na cor preta. Quando acessar o site abcd.dev, ele irá ver o site na cor roxa. Uma coisa que eu queria que fosse possível é ao abrir o código fonte não ter a possibilidade de ver dados de outro site, mesmo o código sendo o mesmo"

Com isso, já deu pra você ter uma noção da stack. E por usar o antd, tive que pegar todo o CSS dele e modificar de acordo com o nosso modelo de código para que tudo seja dinâmico. E aqui começou o primeiro problema.

1. Em tempo de execução, como eu posso definir as variáveis do CSS? Para quem não sabe, CSS3 aceita variáveis com o método `var`, [só dar um check nesse link da MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/var). Como podemos ver, da pra definir de boa na nossa folha de estilo, mas se a nossa variável já é variável, como iremos fazer? Lembrando que a folha de CSS pode chegar até a 39k linhas, então manter mais de uma folha de estilos não era uma opção. Mas se observamos o exemplo, olha onde ele define as variáveis a serem usadas...hmmmmmmmmm...ele usa o seletor `:root` e pasme...ele é o seletor da raiz do nosso HTML, que se chama `html`. Tendo isso em mente, basta fazermos uma query no nosso documento para obter `root` e aplicar as "variáveis variáveis" ao nosso html.

```javascript
import config from "./config-site";
const root: any = document.querySelector(":root");
Object.keys(config).forEach((x: string) => root.style.setProperty(`--${x}`, `${config[x]}`));
```

Show! Problema das variáveis resolvidas, temos um arquivo de configuração (ainda está estático) que define nossas variáveis do frontend e depois podemos usar sem maiores problemas.

2. Temos um CSS agnóstico a cores, ele entende nossas variáveis de acordo com todo o objeto de configuração, mas como vou ter um arquivo de configuração dinâmico? Como vou fazer a aplicação não exibir tal arquivo sempre que eu estiver em um determinado domínio ou subdomínio? Bom, esse problema não foi resolvido no frontend e também não foi resolvido em um único lugar. Para tal situação, tivemos que incluir uma prática já existente na equipe e uma ferramenta CLI para controlar os temas. Se você leu meu post anterior, vai lembrar do roteador de UI que comentei, mas se não leu **VOCÊ DEVERIA LER, POR FAVOR**.

O roteador de UI é um webserver em F# que escuta as requisições feitas aos domínios registrados (no nosso caso, xpto.com e abcd.dev). Ao receber uma request vinda de `xpto.com` ele vai em um bucket S3 da Amazon e o path de todos os arquivos que temos (esses arquivos são os assets, js e css gerados no build do React) e monta um `index.html` customizado. Alguns valores são passados por ele para o HTML, sendo eles

- Tenant
- Versão
- Url dos assets

Como ele monta um arquivo `.html`, significa que nele eu posso injetar código javascript, certo? E que também posso fazer condicionais para entregar um arquivo e outro não? A reposta é sim para ambas as perguntas. Mas para evitar `ifs` de acordo com os tenants, a solução foi mais simples ainda.

**_Apenas customizar o build do react para gerar pastas de acordo com o nome dos tenants, assim a própria URL diz qual arquivo o roteador de UI deverá pegar_**

Simples, prático, eficiente e limpo. Mas para isso funcionar, precisávamos de N arquivos de configuração para nossos tenants, o que ainda é ruim. Mas manter arquivos `.json` ainda é bem mais fácil do que manter toneladas de código, pense nisso. Manter arquivos diferentes é ruim, podem causar inconsistências, acréscimos feitos em um e retiradas em outro, coisas de trabalho em equipe que você já deve ter visto. O famoso **A gente faz a sua parte e no final junta tudo**. E caras, git ajuda muito, sem dúvidas, mas nesse caso, toda edição gera conflito (você ainda vai entender o porquê disso, calma amiguinho). Primeiro, vamos ver o arquivo de configuração:

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

Claro que esse arquivo é muito maior, pois possuem mais cores, mais textos, mais imagens...O que importa aqui é você saber parte dessa estrutura. Mas agora fica a pergunta _"Como um browser vai ler um arquivo json e transformar em javascript?"_. Reposta: **Não vai**. E esse era o desafio do `script00`, transformar um JSON em um objeto Javascript. Sabemos que isso não é difícil, pois JSON é um objeto Javascript, então é apenas criar um arquivo `.js` e escrever uma declaração de variável. Apesar desse script ter várias outras regras de negócio, conversões de `http` para `https`, trocar nomes de tenants pelo tenant correto de acordo com o nome do arquivo, criar variações das cores...O que importa pra você aqui é `criar um script que gere javascript dado um diretório de arquivos JSON`.

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

Sim, ficou bastante código pra esse artigo, mas a ideia é documentar tudo aqui, então aconselho você ler para poder entender. Algumas coisas acabei mudando para evitar expor algumas coisas da empresa. A pasta build usada é a mesma pasta gerada pelo React. Não preciso nem falar que para integrar isso ao build do React, a forma mais fácil foi utilizar o `eject` e eu mesmo controlar configurações de webpack e scripts de build. Esse mesmo script ficou ao final de `scripts/build.js`, que é o arquivo responsável por buildar o seu frontend. Antes de passar para o tópico 3, um questionamento

> **Não era mais fácil você usar plugins do webpack para gerar esses arquivos?** Sim, era mais fácil. Porém no mundo do desenvolvimento temos a revés de "dureza" em toda facilidade que temos. Então se você precisa de flexibilidade, vai ter que meter muita mão na massa pra poder conseguir o que tanto almeja.

3. Esse é o último problema resolvido nesse questionamento de site customizável. E esse problema é o de sincronizar as alterações em arquivos de acordo com todos os textos e outras mudanças nos textos. Pra isso, tive que fazer mais um script para executar ele toda vez que eu quisesse adicionar um texto ao site

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

Mais uma vez, perdão pelo código um pouco maior. Alguns erros podem ser encontrados devido ao ato de deletar algumas linhas que contém informações que não podem ser publicadas. Vale lembrar que esse `if (file==="reference.json")` é para criar um arquivo de desenvolvimento, servindo de _esqueleto_, já que toda a configuração é feita num html do roteador de UI. Isso é apenas um _hack_ ou **gambiarra** para rodar o projeto sem erros em desenvolvimento.

## "Eu preciso que esse texto seja em negrito e aquele botão mande uma mensagem no Zap da loja"

Sem dúvidas esse foi o que me deixou mais puto na hora que ouvi. Pois o setup para textos já estava todo feito, todos os textos definidos, e mudanças visuais não eram possíveis pois como eu iria separar dentro de uma string em tempo de execução. E pior ainda, saber qual string deveria ficar em negrito, qual deveria virar um link. Eu ainda dei uma enrolada pra tentar não fazer essa mudança, mas não rolou.

A primeira solução que veio na cabeça foi "Vou usar um parser de markdown e ta tudo show". Achei bons parsers de markdown, mas eles não iam resolver o meu problema do "Zap". Então desisti dessa ideia e tive uma outra ideia super brilhante que todo programador JS tem. **Se não existe uma lib que faz exatamente que faz isso, vou criar a minha própria do zero. Com zero dependências.** Apesar de eu ver isso como um meme, eu realmente tive que fazer isso, pois mesmo com muita pesquisa, nada fazia o que eu queria.

Desde que comecei a mexer com programação, sempre curti muito a ideia dos parsers. Um dos meus primeiros desafios pessoais foi criar um parser de BBCode para HTML, usando Shellscript. _Se você é tarado por programação, faça isso, mas no intuito de apenas aprender Regex e a ideia de parsers, yacc e afins_. Eu sei que BBCode não é melhor do que Markdown para pessoas leigas usarem, mas como era o que eu já tinha feito alguma vez na vida, só precisei de umas boas doses de energético pra fazer esse código em Javascript, e o melhor [esse código ta público, e vai ser atualizado no meio de setembro](https://github.com/g4rcez/code-markup-parser). Não é a coisa mais linda do mundo, mas ele funciona bem pro meu problema e ainda cria o linkão bolado pro Zap.

Esse **code-markup-parser** gera um HTML, e como faço pra interpretar HTML puro em React?

```jsx
<span dangerouslySetInnerHTML={{ __html: codeMarkupParser(parsed) }} />
```

Aposto que você já deve estar pensando em achar onde esses sistemas estão sendo feitos e tentar um ataque de XSS, mas uma das seguranças que tomei foi limpar todo o HTML de entrada, logo, você não pode escrever HTML + JS malicioso nas strings parseadas pois as tags serão apagadas xD

Ao final de tudo, bastou criar um método pra pegar as strings do nosso objeto de configuração e transformar em uma string HTML para ser interpretada. Assim poderíamos ter um texto escrito em negrito com `[b]Isso ta em negrito no meu site[/b]`.

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

E claro, eu deveria aceitar variáveis nessas string, um outro problema que foi resolvido com as funções `remapTexts` e `parseWithParams`. A sintaxe para os meus textos que exigem variáveis e customização ficaram dessa forma: `[b]Esse texto ta em negrito[/b] e esse texto usa uma variável {{ varName }}`. Essa sintáxe nem é inspirada no template string do Rails/Laravel, imagina kkk. E usando ele dentro do JSX:

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

Após terminar isso, fiquei bastante satisfeito, tava tudo lindo. Eu tinha um arquivo de configuração que era só entregar pro design editar ou pro marketing fazer os textos, ninguém mais ia pedir nenhuma modificação exorbitante no sistema...

## "Esse link aí não pode aparecer pro usuário quando ele não tiver tantos produtos"

Esse título na real foi um pouco maior, ficou o seguinte:

> "Esse link aí não pode aparecer pro usuário quando ele não tiver tantos produtos. Tem que redirecionar ele pra página quando não tiver nenhum produto. Não esquece de validar também pra quando ele não tiver nenhum produto, aparecer sempre um menu oferecendo um novo produto. E eu tinha visto que quando cancelava um produto, o menu continuava até ele recarregar a página, isso ta feio".

Bom, isso talvez não seja tão sinistro de resolver a primeira vista. Mas pensa bem, são controle de rotas, menus, tudo isso dinâmicamente. Rotas e menus estão quase sempre ligados um ao outro, mas em React, a construção das rotas é separada da navbar, ainda mais quando a navbar muda de acordo com o perfil de um usuário logado.

Esse problema foi resolvido bem rápido, mas eu tava mega pilhado e era um problema que eu já havia pensado, mas que não queria parar pra resolver pois existem vários outros componentes a serem escritos, código refatorado, segurança...e em minha defesa, não sou um grande especialista em UX.

Como falei anteriormente, rotas e menus estão quase sempre ligados. Então a minha resolução se baseou em agrupar rotas e menus num único Array, de acordo com o perfil dos usuários.

1. Criar uma lista de objetos com os componentes, ícones utilizados no menu, título do menu e da página, perfil que pode visualizar tal rota
2. Enumerar todas as dependências (fica ligado nessa palavra, você já deve ter imaginado um `useEffect`) necessárias para as rotas
3. Separar a lógica de cada rota de forma isolada, o que inclui mais um item no nosso objeto citado no item 1
4. Configurar o React Router para não utilizar mais o <Route /> hardcode, mas sim um <Route /> que será gerado através de um array.
5. Filtrar o array de acordo com todas as informações dos itens 1, 2 e 3.

Show. Melhor eu mostrar o código logo

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

Bom, acho que não foi nada tão complicado, mas quebrou um galhão, e eu tenho o mesmo array para o meu ReactRouter e minhas Navbars. Com isso, alterando nesse hook, ambos serão alterados e já aplicando a regra. Lembrando que ao atualizar o meu item do redux `products` eu já terei a nova regra aplicada ao router e a navbar.

Tudo ótimo. Ta tudo maneiro. Mas esse tanto de mudança acabou impactando no desempenho da aplicação. O `bundle.js` está beirando os 600KB. Eu estava incomodado com isso, mas devido a estrutura do roteador de UI, eu não podia aplicar uma regra de [code-splitting](https://reactjs.org/docs/code-splitting.html), pois meu path de assets é diferente do domínio o qual eu acesso, então o Suspense/Lazy não sabe lidar com isso.

Mas se eu to falando disso...é por que eu tive que resolver. E é esse problema em específico que me motivou ainda mais a escrever esse artigo mais _deep dive_ na construção dessa UI.

## "Cara, o site ta muito lento pra abrir, preciso resolver isso urgente"

Antes de continuar, preciso desabafar e dizer que eu quase dei uma resposta do tipo

> "Jura que ta lento, talvez tenha sido o tanto de requisito não funcional que acabou aumentando o projeto consideravelmente"

Mas fazer isso custa o emprego, e eu não quero perder a equipe maravilhosa que tenho :). Apenas aceitei o desafio, mas com uma sensação de derrota, pois já fazem 3 meses que venho pesquisando sobre como fazer o code splitting numa arquitetura semelhante a minha e não consegui achar nada que me desse uma luz.

Por incrível que pareça, quando eu foquei só nesse problema, eu consegui resolver em umas 3h. Nem eu acreditei. Foram 5h de rascunho de ideias e 3h de _"Cara, se eu tentar isso aqui e mais isso, provavelmente vai funcionar"_. Seguem as ideias

1. Criar um proxy no roteador de UI que recebe as requisições e a cada pattern de chunk do webpack, ele redireciona para o bucket S3 correto do tenant. Obviamente essa solução é custosa ao extremo, ineficiente e extremamente maluca. Isso se chama desespero

2. Criar um script que força a URL dos tenants e mudar o versionamento da UI para v0.0.0-nome-do-tenant. E na hora de fazer o build, ter um script `.sh` que faz um replace no pattern dos chunks para a minha URL do bucket S3, de acordo com o `nome-do-tenant`. Essa ideia eu considerei muito, apesar de ser uma master gambiarra que iria impactar em toda a vida do software, e com um impacto negativo.

3. Orar

4. Chorar

5. Espernear

6. Reza braba

7. Ritual da placa mãe (isso pareceu engraçado na minha cabeça)

8. Estudar o webpack num nível absurdo

Bom, não preciso falar qual desses itens eu fiz. A resposta é **Todos, exceto o primeiro e segundo**.

Eu sempre odiei ter que lidar com o webpack, acho que mexer num webpack gerado pelo CRA é pior ainda. Apesar disso tudo, sempre soube do poder do webpack, mas nunca soube que ele fazia mágica, e não é sacanagem, a parada é mágica mesmo.

Antes de dar a solução, eu gostaria de falar que o `bundle.js` de quase 600KB virou vários chunks de no máximo 10KB. O maior deles, que é quem contém os arquivos de actions do redux e regras de negócio, ficou com 120KB. Surreal demais. Isso não é magia, é o poder do code-splitting com a API maravilhosa do Suspense/Lazy que o React nos dá para fazer um frontend descente.

A mágica vem agora. Procurando a documentação do webpack, eu achei [esse link que fala de public-path](https://webpack.js.org/guides/public-path/). Apesar de entender o que está escrito, isso nunca foi possível pois ao procurar a variável `__webpack_public_path__` em **TODOS OS LUGARES** do bundle.js, build.js, start.js, tudo que estivesse ligado ao runtime da aplicação, mesmo que procure, você não vai achar (se achar, me fala por favor). Então sempre ignorei isso, achando que era uma opção oculta. E como o CRA já configura `PUBLIC_PATH`, achei que fosse essa a forma de abstrair a configuração do webpack. E mesmo alterando `PUBLIC_PATH`, nada era resolvido. No meio do `e se eu fizer isso e isso`, [achei essa issue explicando a diferença entre o `PUBLIC_PATH` e o `__webpack_public_path__`](https://github.com/facebook/create-react-app/issues/6024). Então a solução veio e é isso. Acabou

```javascript
// Seta o on the fly do webpack em runtime (por isso on the fly)
/// <reference path="./definitions/definitions.d.ts" />
declare let __webpack_public_path__: string;
__webpack_public_path__ = `https://buckets.amazao/${$__OBJECT__.tenant}/sites/${$__OBJECT__.version}/`;
```

Pronto, é isso aí. Problema resolvido. Nem eu acreditei, e escrevendo isso agora eu estou rindo feito bobo que apenas isso resolveu um problema que eu queria resolver a mais de 3 meses.

Vale lembrar que a nota de performance do lighthouse saiu de 3 (no pior caso de internet lenta e celulares fracos) para 92 (no mesmo caso citado).

Bom, consegui fazer um grande relato que queria fazer a muito tempo, de forma mais explicada, com exemplos reais. E mesmo que você tenha lido isso tudo e está se perguntando

> "Mas Allan, isso não é gambiarra? Usar window como variável global pra sua aplicação poder consumir"

Eu também pensei a mesma coisa logo que comecei com tudo isso, mas cara...é Javascript. Mesmo com o boas práticas, Typescript, ReasonML, Fable, NativeScript, pensamento OO, pensamento funcional, lints rígidos que não vão deixar você fazer um código porco, testes e o que mais para garantir uma boa escrita de código. Ainda com isso tudo, é Javascript. Da uma lida na [história do Javascript](https://en.wikipedia.org/wiki/JavaScript) e talvez você se ligue mais sobre o que to falando. Sempre que tiver algo mais bizarro de performance ou compartilhar informação, você vai cair num caso parecido.

E lembre-se _"Se o Facebook controla a versão que do React fazendo um append no objeto window, por que eu não posso configurar a minha UI da mesma forma?"_

Pense nisso amiguinho, o errado é não resolver seu problema. Se a solução atende o seu negócio, sua equipe entrou em concenso sobre a adoção da técnica e a manutenção não está custosa, meus parabéns, você é um verdadeiro engenheiro da computação. E pra finalizar, aquele abraço e quaisquer dúvidas, você sabe onde me encontrar xD
