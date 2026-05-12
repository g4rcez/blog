---
level: 1
title: "Building a flexible frontend"
language: "en-US"
translations: ["pt-br", "en-us"]
subjects: ["frontend", "react", "typescript", "javascript"]
date: "2019-08-28T23:59:59.999Z"
description: "You'll be impressed how flexible this application will be"
---

As described in the previous post, a BBCode parser was developed to enable a flexible frontend. Colors, texts, icons, and images all had to be dynamic because each of these items is controlled by the **tenant** of the application.

The technical details follow below. Each section heading corresponds to a real requirement that emerged during the frontend architecture design and development phases.

# "I need a site that changes according to the brand"

This is where the complexity began. I had already defined with the team everything that would be used, some components had already been written. Much of the future stack had already been defined. _Calm down, I'll tell you the stack_

- React - SPA (Single Page Application)
- Typescript
- Redux + Redux Saga
- Ant Design (auxiliary library for some components that would take longer to make in a short deadline)
- Tachyons CSS
- RC Components (library to help with some components, but that still gave us the flexibility to edit the visual)
- Since antd uses moment, I had to add moment to the project, although I wanted to use date-fns for this project
- Axios for HTTP requests
- react-text-mask for creating some masks like CPF, CNPJ, phone, ZIP code...
- The currency input was developed _from scratch_, inspired by something similar to NuBank (mobile app)

Another important — and admittedly risky — decision was the early adoption of React Hooks. While using Alpha builds can introduce future problems, adopting it early provided an opportunity to learn deeply and create custom hooks that helped share code throughout the application, including the dynamic routing strategy.

> "I need a site that changes according to the brand. When the user accesses the domain xpto.com, they'll see this site in black. When they access the site abcd.dev, they'll see the site in purple. One thing I wanted to be possible is when opening the source code not having the possibility to see data from another site, even though the code is the same"

With this, you've already got a sense of the stack. And by using antd, I had to take all its CSS and modify it according to our code model so that everything is dynamic. And here the first problem began.

1. The first challenge was defining CSS variables at runtime. CSS3 supports variables via the `var()` function ([MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/var)), which is straightforward to define in a stylesheet. However, with a CSS file potentially reaching 39,000 lines, maintaining multiple stylesheets was not an option. The solution lies in the `:root` selector, which targets the root HTML element. By querying the document for `:root` and setting properties on it, dynamic "variable variables" can be applied at runtime:

```javascript
import config from "./config-site";
const root: any = document.querySelector(":root");
Object.keys(config).forEach((x: string) => root.style.setProperty(`--${x}`, `${config[x]}`));
```

Great! Variables problem solved, we have a configuration file (still static) that defines our frontend variables and then we can use without further problems.

2. We have a color-agnostic CSS, it understands our variables according to the entire configuration object, but how do I have a dynamic configuration file? How do I make the application not display such file whenever I'm on a certain domain or subdomain? Well, this problem wasn't solved in the frontend and also wasn't solved in one place. For this situation, we had to include an already existing practice in the team and a CLI tool to control the themes. If you read my previous post, you'll remember the UI router I mentioned, but if you didn't **YOU SHOULD READ IT, PLEASE**.

The UI router is a webserver in F# that listens to requests made to registered domains (in our case, xpto.com and abcd.dev). Upon receiving a request from `xpto.com` it goes to an Amazon S3 bucket and the path of all files we have (these files are the assets, js and css generated in the React build) and mounts a customized `index.html`. Some values are passed by it to the HTML, being them

- Tenant
- Version
- Assets URL

Since it mounts an `.html` file, it means I can inject javascript code into it, right? And I can also do conditionals to deliver one file and not another? The answer is yes to both questions. But to avoid `ifs` according to tenants, the solution was even simpler.

**_Just customize the react build to generate folders according to tenant names, so the URL itself tells which file the UI router should get_**

Simple, practical, efficient and clean. But for this to work, we needed N configuration files for our tenants, which is still bad. But maintaining `.json` files is still much easier than maintaining tons of code, think about it. Maintaining different files is bad, can cause inconsistencies, additions made in one and removals in another, team work things you've probably seen. The famous **We each do our part and in the end we put it all together**. And guys, git helps a lot, no doubt, but in this case, every edit generates conflict (you'll still understand why, calm down buddy). First, let's see the configuration file:

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
            "siteTitle": "Hack the planet",
            "siteFooter": "Hack the planet",
        },
        "en-US":{
            "siteTitle": "Hack the planet",
            "siteFooter": "Hack the planet",
        }
    }
}
```

Of course this file is much bigger, because there are more colors, more texts, more images...What matters here is that you know part of this structure. But now the question arises _"How will a browser read a json file and transform it into javascript?"_. Answer: **It won't**. And that was the challenge of `script00`, transforming a JSON into a Javascript object. We know this isn't hard, since JSON is a Javascript object, so it's just creating a `.js` file and writing a variable declaration. Although this script has several other business rules, conversions from `http` to `https`, replacing tenant names with the correct tenant according to the file name, creating color variations...What matters to you here is `create a script that generates javascript given a directory of JSON files`.

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

const prefixVar = "window.$___VARIABLE_WITH_IMPOSSIBLE_TO_COPY_NAME___.config";

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

That is a significant amount of code, but it documents the full picture. Some details were modified to avoid exposing proprietary information. The build folder used is the same folder generated by React. I don't even need to say that to integrate this into the React build, the easiest way was to use `eject` and control webpack configurations and build scripts myself. This same script was at the end of `scripts/build.js`, which is the file responsible for building your frontend. Before moving on to topic 3, a question

> **Wasn't it easier to use webpack plugins to generate these files?** Yes, it was easier. However in the development world we have the trade-off of "hardship" in every ease we have. So if you need flexibility, you'll have to get your hands very dirty to get what you want.

3. This is the last problem solved in this customizable site question. And this problem is synchronizing changes in files according to all texts and other changes in texts. For this, I had to make another script to run every time I wanted to add text to the site

```javascript
const { REFERENCE_FILE, writeJsVarInfile, referenceObject } = require("./frontend-builder");
const FS = require("fs");
const PATH = require("path");
const signale = require("signale");
const [shell, file, key, text, language = "pt-br"] = process.argv;
const CONFIGS_DIR = PATH.join(__dirname, "..", "config");
if (!!!key || !!!text) {
  signale.fatal("Provide the key and the text to be inserted");
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
        signale.success("Creating placeholder configuration file", path);
      } catch (error) {
        signale.fatal(error);
      }
    }
  });
});
```

Once again, sorry for the slightly longer code. Some errors may be found due to deleting some lines that contain information that cannot be published. It's worth remembering that this `if (file==="reference.json")` is to create a development file, serving as a _skeleton_, since all configuration is done in an html of the UI router. This is just a _hack_ or **workaround** to run the project without errors in development.

# "I need this text to be bold and that button to send a message on the store's WhatsApp"

Without a doubt, this was the most challenging requirement to receive. The text setup was already complete, all strings were defined, and supporting rich formatting meant determining at runtime which parts of a string should be bold or become a link. There was significant resistance to making this change, but ultimately it became unavoidable.

The first solution that came to mind was "I'll use a markdown parser and everything's fine". I found good markdown parsers, but they weren't going to solve my "WhatsApp" problem. That idea was abandoned in favor of another approach familiar to many JavaScript developers: **if no library does exactly what is needed, build one from scratch with zero dependencies.** Despite the cliché, extensive research confirmed that no existing solution fit the requirements.

Since I started messing with programming, I've always really liked the idea of parsers. One of my first personal challenges was to create a BBCode to HTML parser, using Shellscript. _If you're crazy about programming, do this, but with the intention of just learning Regex and the idea of parsers, yacc and the like_. I know BBCode isn't better than Markdown for laypeople to use, but since it was what I had already done sometime in my life, I just needed a few good doses of energy drink to make this code in Javascript, and the best [this code is public, and will be updated in mid-September](https://github.com/g4rcez/code-markup-parser). It's not the most beautiful thing in the world, but it works well for my problem and still creates the cool link for WhatsApp.

This **code-markup-parser** generates HTML, and how do I interpret raw HTML in React?

```jsx
<span dangerouslySetInnerHTML={{ __html: codeMarkupParser(parsed) }} />
```

One important security measure was sanitizing all input HTML, preventing malicious HTML and JavaScript from being injected into parsed strings — any such tags are stripped before rendering.

At the end of everything, I just had to create a method to get the strings from our configuration object and transform them into an HTML string to be interpreted. This way we could have text written in bold with `[b]This is bold on my site[/b]`.

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

And of course, I should accept variables in these strings, another problem that was solved with the `remapTexts` and `parseWithParams` functions. The syntax for my texts that require variables and customization became like this: `[b]This text is bold[/b] and this text uses a variable {{ varName }}`. This syntax isn't even inspired by the Rails/Laravel template string, imagine lol. And using it inside JSX:

```jsx
<p>
  {resolve({
    text: "stringThatExistsInTheTranslationMap",
    textParams: {
      varName: props.redux.aReduxValue
    }
  })}
</p>
```

After finishing this, I was very satisfied, everything was beautiful. I had a configuration file that was just to deliver to design to edit or for marketing to write the texts, no one would ask for any exorbitant modification in the system anymore...

# "This link here can't appear for the user when they don't have that many products"

This title was actually a bit longer, it was the following:

> "This link here can't appear for the user when they don't have that many products. It has to redirect them to the page when they don't have any product. Don't forget to also validate so that when they don't have any product, a menu always appears offering a new product. And I had seen that when canceling a product, the menu continued until they reloaded the page, that's ugly".

Well, this might not be so sinister to solve at first glance. But think about it, it's route control, menus, all dynamically. Routes and menus are almost always linked to each other, but in React, route construction is separate from the navbar, even more so when the navbar changes according to a logged-in user's profile.

This problem was solved very quickly, but I was mega pumped and it was a problem I had already thought about, but didn't want to stop to solve because there are several other components to be written, refactored code, security...and in my defense, I'm not a great UX specialist.

As I said earlier, routes and menus are almost always linked. So my resolution was based on grouping routes and menus in a single Array, according to user profiles.

1. Create a list of objects with components, icons used in the menu, menu and page title, profile that can view such route
2. List all dependencies (pay attention to this word, you've probably already imagined a `useEffect`) necessary for the routes
3. Separate the logic of each route in isolation, which includes one more item in our object mentioned in item 1
4. Configure React Router to no longer use hardcoded `<Route />`, but rather a `<Route />` that will be generated through an array.
5. Filter the array according to all information from items 1, 2 and 3.

Great. Better to show the code now

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
		title: resolve({text: "homePage"}),
        // by habit, I like to separate all
        // application links into an object, so I don't
        // repeat strings
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
    // This useConnect was a custom hook that I'll make available in the future
    // it's basically the same as the connect component from react-redux
    // but without needing to make a wrapper and returns the correct types too
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

Well, I think it wasn't anything too complicated, but it saved a lot, and I have the same array for my ReactRouter and my Navbars. With this, changing in this hook, both will be changed and already applying the rule. Remember that when updating my redux item `products` I'll already have the new rule applied to the router and navbar.

However, all these changes had an impact on performance — the `bundle.js` was approaching 600KB. Due to the UI router structure, standard [code-splitting](https://reactjs.org/docs/code-splitting.html) could not be applied, because the assets path differs from the access domain, which prevents Suspense/Lazy from resolving correctly.

But if I'm talking about it...it's because I had to solve it. And it's this specific problem that motivated me even more to write this more _deep dive_ article on building this UI.

# "Dude, the site is very slow to open, I need to fix this urgently"

It is worth acknowledging that the performance impact was largely a consequence of the accumulation of non-functional requirements that had grown throughout the project. The challenge was accepted, though with some uncertainty, given that three months of research into code splitting for this architecture had yielded no viable leads.

Surprisingly, once focused exclusively on this problem, a solution emerged in approximately three hours — after five hours of sketching ideas and three hours of iterative experimentation. The approaches considered were:

1. Create a proxy in the UI router that redirects each webpack chunk pattern to the correct tenant S3 bucket. This was clearly too costly and inefficient.

2. Create a script that forces tenant URLs and modifies the UI versioning to `v0.0.0-tenant-name`, with a build-time `.sh` script replacing chunk patterns with the S3 bucket URL per tenant. Despite being a significant workaround with long-term maintenance implications, this option was seriously considered.

3. Study webpack in depth.

Ultimately, option 3 was the right path.

I've always hated having to deal with webpack, I think messing with a webpack generated by CRA is even worse. Despite all this, I've always known the power of webpack, but I never knew it did magic, and I'm not kidding, it's really magic.

Before giving the solution, I'd like to say that the `bundle.js` of almost 600KB became several chunks of at most 10KB. The largest of them, which contains the redux actions files and business rules, was 120KB. Too surreal. This isn't magic, it's the power of code-splitting with the wonderful Suspense/Lazy API that React gives us to make a decent frontend.

The magic comes now. Searching the webpack documentation, I found [this link that talks about public-path](https://webpack.js.org/guides/public-path/). Although I understand what's written, this was never possible because when searching for the variable `__webpack_public_path__` in **ALL PLACES** of bundle.js, build.js, start.js, everything that was linked to the application runtime, even if you search, you won't find it (if you find it, please tell me). So I always ignored this, thinking it was a hidden option. And since CRA already configures `PUBLIC_PATH`, I thought this was the way to abstract the webpack configuration. And even changing `PUBLIC_PATH`, nothing was solved. In the middle of `what if I do this and this`, [I found this issue explaining the difference between `PUBLIC_PATH` and `__webpack_public_path__`](https://github.com/facebook/create-react-app/issues/6024). So the solution came and that's it. Done

```javascript
// Sets the webpack on the fly at runtime (hence on the fly)
/// <reference path="./definitions/definitions.d.ts" />
declare let __webpack_public_path__: string;
__webpack_public_path__ = `https://buckets.amazon/${$__OBJECT__.tenant}/sites/${$__OBJECT__.version}/`;
```

Problem solved. It is remarkable that such a small change resolved an issue that had persisted for over three months.

It's worth remembering that the lighthouse performance score went from 3 (in the worst case of slow internet and weak phones) to 92 (in the same case mentioned).

This has been a detailed account of a real-world project, with concrete examples throughout. Even after reading all of this, there may still be a question:

> "But Allan, isn't this a hack? Using window as a global variable for your application to consume"

The same concern arose at the start, but given the nature of JavaScript — even with TypeScript, strict linting, tests, and every other best practice — unconventional solutions sometimes become necessary. The [history of JavaScript](https://en.wikipedia.org/wiki/JavaScript) provides useful context. Performance and cross-boundary state sharing often lead to similar patterns.

As a useful frame of reference: _"If Facebook controls its React version by appending to the window object, why can't a UI be configured the same way?"_

The wrong thing is not solving the problem. If the solution meets business requirements, the team has reached consensus, and maintenance is manageable — that is sound engineering. Thank you for your time, see you soon, bye bye
