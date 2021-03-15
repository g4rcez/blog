---
useFolks: true
subjects: ["react","frontend","typescript","javascript"]
title: "E se eu precisar mudar só isso aqui?"
language: "pt-br"
translations: ["pt-br"]
date: "2019-08-08T03:18:00.000Z"
description: "Criando frontends customizaveis com arquivos de setup"
---

Quem nunca teve que parar o desenvolvimento pra ter que ouvir "Muda aquela corzinha ali de verde pra vermelho magenta?" ou então "Tem que trocar uma palavrinha só em tal lugar". Se você nunca ouviu, você têm muita sorte.

### Historinhas

A motivação desse post foi pra explicar um pouco da ferramenta que eu desenvolvi num projeto da empresa, projeto esse que eu apresentei no primeiro Meetup de NodeJS do Rio de Janeiro (somente uma parte dele). Eu fui falar de criação de CLIs, mas acabou que a ideia dessa minha CLI pra **gerar configurações do frontend** intrigou mais uma galera do que o próprio assunto de CLI em si.

Esse CLI foi feito para criar parâmetros de configuração do meu frontend que precisa mudar de cara de acordo com o tenant que está sendo acessado.

> Suponha que você tenha cliente XPTO e ABCD, ambos têm o mesmo site e o tema precisa ser diferente. Tendo que fazer em React, como você faria pra resolver esse problema? Eu vou relatar a minha solução

### Step by Step

Antes de começar, temos umas regrinhas que preciso deixar claro e explicar o cenário.

-   Um backend `roteador de UI` entrega os assets de acordo com o tenant. Os assets ficam em um bucket S3, separados de acordo com o tenant. A cada requisição, esse roteador identifica o tenant chamado e vai no respectivo bucket pegar um arquivo `versions.json` que diz o seguinte para ele _Roteador, a UI do XPTO está na versão 0.0.5 e o ABCD está na versão 0.0.6. Para cada um deles, entregue os assets com essas versões_. Para isso acontecer, basta concatenar strings de acordo com o `diretório + versão` para ter o caminho até o arquivo.

-   O `roteador de UI` entrega os assets. Primeiro, olhe a estrutura do `index.html`

```html
<!DOCTYPE html>
<html lang="pt-br">
	<head>
		<meta charset="utf-8" />
		<link
			rel="shortcut icon"
			href="https://MINHAEMPRESA.COM.BR/assets/xpto/0.0.5/favicon.ico"
		/>
		<meta
			name="viewport"
			content="width=device-width,initial-scale=1,shrink-to-fit=no"
		/>
		<link
			rel="manifest"
			href="https://MINHAEMPRESA.COM.BR/assets/xpto/0.0.5/xpto/manifest.json"
		/>
		<meta name="theme-color" content="#000000" />
		<!-- Isso é importante -->
		<script>
			window.$__CONFIG__ = { tenant: "xpto", version: "0.0.5" };
		</script>
		<!-- Isso também é importante -->
		<script src="https://MINHAEMPRESA.COM.BR/assets/xpto/0.0.5/js/xpto.js"></script>
		<title>Dev</title>
		<link
			href="https://MINHAEMPRESA.COM.BR/assets/xpto/0.0.5/css/main.css"
			rel="stylesheet"
		/>
		<script src="https://MINHAEMPRESA.COM.BR/assets/xpto/js/analytics.js"></script>
	</head>
	<body>
		<noscript
			>Você precisa ativar o Javascript para usar esse site.</noscript
		>
		<main id="root"></main>
		<script src="https://MINHAEMPRESA.COM.BR/assets/xpto/0.0.5/js/_runtime.js"></script>
		<script src="https://MINHAEMPRESA.COM.BR/assets/xpto/0.0.5/js/main.js"></script>
	</body>
</html>
```

Se você prestar atenção, esse é o HTML que o `CreateReactApp` gera, mas com algumas modificações. Essas modificações podiam ser feitas no arquivo `public/index.html` do seu projeto React, mas como exigem versões e afins, optamos por gerar o `index.html` no `roteador de UI` (este que está em F#)

As duas tags de script no `head` são as que começam a fazer a mágica acontecer. Nelas eu digo a versão e o tenant que está sendo usado **_(o nome do tenant para tags de alt e substituição de valores em caso de referência a mágica, a versão apenas para colocar esse dado no footer da aplicação + copyright)_**. O arquivo `xpto.js` é o arquivo principal para o frontend funcionar, pois nele estão todas as cores, imagens e textos que eu devo fazer referência para cada tenant.

Esses dois arquivos marcados foram colocados no `<head>` e acima da declaração do CSS com o propósito de serem executados primeiro para que quando houver o carregamento da aplicação, todas as variáveis do frontend estejam setadas para que ele possa trabalhar com os valores sem que os mesmos não sejam nulos quando forem usados.

```javascript
// xpto.js
window.$__CONFIG__.config = {
	colors: {
		primary: "black",
		secondary: "white",
		danger: "red",
		warn: "orange",
	},
	texts: {
		ptBr: {
			tituloBoasVindas: "Olá mundo",
		},
		enUs: {
			tituloBoasVindas: "Hello world",
		},
	},
	logo: "https://...",
	banner: "https://...",
};
```

Bom, com isso aí já da pra começar a ter uma ideia. Esse arquivo é gerado de um [script que cria os arquivos de configuração pra cada tenant](https://gist.github.com/g4rcez/c6bb44e9dca7d2b401dc4c46467b0cc2). _Não esquece de dar uma olhada nesse script aí, ele vai mostrar como eu crio cada configuração_.

### Acesso no Frontend

Vamos começar do zero sobre como eu criei essa estratégia para o front.

```bash
npm i -g create-react-app
create-react-app awesome-project
cd awesome-project
yarn add --dev polished signale npm-run-all
```

Esses dois pacotes são para o script que mandei o link antes, caso você tente executar. Ainda antes de executar o script de build, você precisará criar um arquivo `.json` em `awesome-project/themes` com o nome do tenant. A estrutura do JSON deve ser a seguinte:

```javascript
{
	"colors": {
		"primary": "black",
		"secondary": "white",
		"danger": "red",
		"warn": "orange",
	},
	"texts": {
		"ptBr": {
			"tituloBoasVindas": "Olá mundo"
		},
		"enUs": {
			"tituloBoasVindas": "Hello world"
		}
	},
	"logo": "https://...",
	"banner": "https://...",
}
```

Como nessa versão do script ainda não fiz a criação de parâmetros, então você pode copiar essa minha estrutura ou editar o script de acordo com a sua necessidade.

Agora, no `package.json` precisamos adicionar a execução do script após o nosso build do React. No meu caso, eu tive que fazer um `yarn eject` para algumas configurações além do que o CRA me fornece, e também embuti a chamada do meu script dentro do `build.js` que ele gera. Caso você não queira fazer um `eject`, pode fazer da seguinte forma:

```json
"scripts": {
	"react-build": "react-scripts build",
	"themes": "node meu-script-de-temas.js",
	"build": "npm-run-all -s build themes"
}
```

Com isso, o script será invocado após a geração do build do React e você terá dentro da sua pasta `js` os arquivos dos tenants para o `roteador de UI` ter acesso e chamar cada um de acordo com o tenant invocado pelo usuário.

Já no nosso código React, eu tive que fazer algumas poucas _gambiarras_ que nesse caso se tornam aceitáveis para que eu possa fazer meu servidor comunicar com meu frontend sem a necessidade de uma segunda requisição para pegar o arquivo de configuração. Eu abstrai em um único arquivo toda a configuração para simplificar a visualização, até porque no meu projeto como o front está em TS, ainda tenho os arquivos de tipos e isso iria fugir um pouco do foco aqui.

```javascript
const CONFIG = window.$__CONFIG__.config;

export const COLORS = CONFIG.colors;
export const TEXT = CONFIG.texts;
export const LOGO = CONFIG.logo;
export const BANNER = CONFIG.banner;


// Já vou explicar essa mágica
const root: any = document.querySelector(":root");
Object.keys(colors).forEach((x => 
	root.style.setProperty(`--${x}`, `${colors[x]}`));
```

[Como você pode ver no W3C Schools](https://www.w3schools.com/cssref/sel_root.asp), a tag `:root` faz referência a raiz do nosso documento, ou seja, a própria tag `<html>`. Isso foi feito pois nem todos os componentes do frontend estão com [styled-components](https://www.styled-components.com), existem alguns com CSS, e graças ao elemento `:root` e a função `var()` do CSS, eu consegui exportar minhas cores não somente no JS, mas também no CSS. Para eu usar é bem simples

```css
.primary {
	color: var(--primary);
}
```

Como disse anteriormente, isso tudo já vai estar setado quando carregar os dois arquivos de configuração e assim você poderá trabalhar com as variáveis no CSS sem problemas.

Quando for o caso de usar quaisquer valores dentro do seu código React, basta importar como se fosse um objeto de um arquivo qualquer

```jsx
import COLORS from "./config";
import React from "react;"

export default () => (
	<div style={{ backgroundColor: COLORS.primary}}>
		<p style={{ color: COLORS.secondary }}>
			Hack the planet
		</p>
	</div>
)
```

Bem simples né? O processo para a criação disso foi complexo, até existiam soluções prontas, mas todo e qualquer uso de bibliotecas de terceiros para estilização visual nos tiram a flexibilidade e aí acaba que mais ajuda do que atrapalha.

> Esse caso de usar bibliotecas de terceiro foi tão crítico que tive que reescrever toda a parte usada do [antd](https://ant.design) para o padrão com `var()`, assim não teria problemas em fazer o uso do componente sem quebrar as regras de cor do meu frontend

Ainda quero escrever um pequeno projeto com o exemplo dessa aplicação, usando esse conceito de temas a partir de um arquivo de configuração que pode vir de um servidor que entrega os assets ou até mesmo ter uma requisição pegando esse arquivo em alguma CDN e só depois começar a renderizar os componentes React...as possibilidades de fazer isso são tão grandes quanto a sua criatividade.

**Lembrando que** esse foi um relato de como resolvi esse problema onde trabalho, e mesmo que pareça meio complexo ou trabalhoso, resolveu nosso problema perfeitamente. Agora quaisquer mudanças necessárias na UI, a responsavel por design ou marketing pode editar um JSON e ela terá a mudança dela no ar em questão de segundos. 

> Como nem tudo são flores, criaram a necessidade de customizar os textos com negrito, itálico, mudar de cor, aceitar valores dinâmicos de acordo com a ação do usuário e até mesmo criar links para instagram, facebook e whatsapp. Essa parada toda eu tenho tentado resolver [nesse repositório](https://github.com/g4rcez/code-markup-parser), porém não está tão atualizado ainda, mas ele esboça a ideia do parser baseado em [BBCode](https://www.bbcode.org)

É isso aí leitor, espero que você tenha entendido o funcionamento. Qualquer dúvida, você sabe como me achar...até a próxima