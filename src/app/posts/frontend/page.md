---
level: 1
subjects: ["react", "frontend", "typescript", "javascript"]
title: "What if I need to change just this here?"
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2019-08-08T03:18:00.000Z"
description: "Creating customizable frontends with setup files"
---

Anyone who has worked in frontend development has likely received requests like "Change that color from green to magenta red" or "Just change this one word here". Those who have never encountered such requests are fortunate.

# Stories

The motivation for this post was to document a tool developed for a company project, part of which was presented at the first NodeJS Meetup in Rio de Janeiro. The talk focused on CLI creation, but the concept of using a CLI to **generate frontend configurations** proved more interesting to the audience than the CLI topic itself.

This CLI was made to create configuration parameters for my frontend that needs to change appearance according to the tenant being accessed.

> Suppose you have client XPTO and ABCD, both have the same site and the theme needs to be different. Having to do it in React, how would you solve this problem? I'll report my solution

## Step by Step

Before starting, there are some rules I need to make clear and explain the scenario.

- A backend `UI router` delivers assets according to the tenant. Assets are in an S3 bucket, separated according to the tenant. On each request, this router identifies the called tenant and goes to the respective bucket to get a `versions.json` file that says the following _Router, XPTO's UI is on version 0.0.5 and ABCD is on version 0.0.6. For each of them, deliver the assets with these versions_. For this to happen, just concatenate strings according to the `directory + version` to get the path to the file.

- The `UI router` delivers the assets. First, look at the `index.html` structure

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link
      rel="shortcut icon"
      href="https://MYCOMPANY.COM/assets/xpto/0.0.5/favicon.ico"
    />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,shrink-to-fit=no"
    />
    <link
      rel="manifest"
      href="https://MYCOMPANY.COM/assets/xpto/0.0.5/xpto/manifest.json"
    />
    <meta name="theme-color" content="#000000" />
    <!-- This is important -->
    <script>
      window.$__CONFIG__ = { tenant: "xpto", version: "0.0.5" };
    </script>
    <!-- This is also important -->
    <script src="https://MYCOMPANY.COM/assets/xpto/0.0.5/js/xpto.js"></script>
    <title>Dev</title>
    <link
      href="https://MYCOMPANY.COM/assets/xpto/0.0.5/css/main.css"
      rel="stylesheet"
    />
    <script src="https://MYCOMPANY.COM/assets/xpto/js/analytics.js"></script>
  </head>
  <body>
    <noscript>You need to enable Javascript to use this site.</noscript>
    <main id="root"></main>
    <script src="https://MYCOMPANY.COM/assets/xpto/0.0.5/js/_runtime.js"></script>
    <script src="https://MYCOMPANY.COM/assets/xpto/0.0.5/js/main.js"></script>
  </body>
</html>
```

This is the HTML that `Create React App` generates, with some notable modifications. These modifications could be made in the `public/index.html` file of your React project, but as they require versions and such, we opted to generate the `index.html` in the `UI router` (which is in F#)

The two script tags in the `head` are the ones that start making the magic happen. In them I tell the version and the tenant being used **_(the tenant name for alt tags and value substitution in case of magic reference, the version just to put this data in the application footer + copyright)_**. The `xpto.js` file is the main file for the frontend to work, because in it are all the colors, images and texts that I should reference for each tenant.

These two marked files were placed in the `<head>` and above the CSS declaration with the purpose of being executed first so that when the application loads, all frontend variables are set so it can work with the values without them being null when used.

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
      welcomeTitle: "Hello world",
    },
    enUs: {
      welcomeTitle: "Hello world",
    },
  },
  logo: "https://...",
  banner: "https://...",
};
```

Well, with that you can already start getting an idea. This file is generated from a [script that creates configuration files for each tenant](https://gist.github.com/g4rcez/c6bb44e9dca7d2b401dc4c46467b0cc2). _Don't forget to take a look at that script, it will show how I create each configuration_.

# Access in the Frontend

Let's start from scratch on how I created this strategy for the front.

```bash
npm i -g create-react-app
create-react-app awesome-project
cd awesome-project
yarn add --dev polished signale npm-run-all
```

These two packages are for the script I sent the link before, in case you try to run it. Still before running the build script, you'll need to create a `.json` file in `awesome-project/themes` with the tenant name. The JSON structure should be as follows:

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
			"welcomeTitle": "Hello world"
		},
		"enUs": {
			"welcomeTitle": "Hello world"
		}
	},
	"logo": "https://...",
	"banner": "https://...",
}
```

As in this version of the script I haven't created parameters yet, you can copy my structure or edit the script according to your need.

Now, in the `package.json` we need to add the script execution after our React build. In my case, I had to do a `yarn eject` for some configurations beyond what CRA provides me, and I also embedded my script call inside the `build.js` it generates. If you don't want to do an `eject`, you can do it as follows:

```json
"scripts": {
	"react-build": "react-scripts build",
	"themes": "node my-themes-script.js",
	"build": "npm-run-all -s build themes"
}
```

With this, the script will be invoked after the React build generation and you'll have inside your `js` folder the tenant files for the `UI router` to access and call each one according to the tenant invoked by the user.

In the React code, a few acceptable workarounds were needed to allow the server to communicate with the frontend without a second request for the configuration file. All configuration was abstracted into a single file for clarity. The TypeScript type files are omitted here, as they would distract from the main focus.

```javascript
const CONFIG = window.$__CONFIG__.config;

export const COLORS = CONFIG.colors;
export const TEXT = CONFIG.texts;
export const LOGO = CONFIG.logo;
export const BANNER = CONFIG.banner;


// I'll explain this magic shortly
const root: any = document.querySelector(":root");
Object.keys(colors).forEach((x =>
	root.style.setProperty(`--${x}`, `${colors[x]}`));
```

[As you can see in W3C Schools](https://www.w3schools.com/cssref/sel_root.asp), the `:root` tag references the root of our document, that is, the `<html>` tag itself. This was done because not all frontend components are with [styled-components](https://www.styled-components.com), some are with CSS, and thanks to the `:root` element and the CSS `var()` function, I was able to export my colors not only in JS, but also in CSS. To use it is very simple

```css
.primary {
  color: var(--primary);
}
```

As I said before, all this will already be set when loading the two configuration files and so you can work with variables in CSS without problems.

When it's the case of using any values inside your React code, just import as if it were an object from any file

```jsx
import COLORS from "./config";
import React from "react;";

export default () => (
  <div style={{ backgroundColor: COLORS.primary }}>
    <p style={{ color: COLORS.secondary }}>Hack the planet</p>
  </div>
);
```

The result is simple to use, though the process was complex. Ready-made solutions exist, but using third-party libraries for visual styling reduces flexibility and ultimately creates more problems than it solves.

> This case of using third-party library was so critical that I had to rewrite the entire part used from [antd](https://ant.design) to the standard with `var()`, so there would be no problems using the component without breaking my frontend's color rules

I still want to write a small project with an example of this application, using this concept of themes from a configuration file that can come from a server that delivers the assets or even have a request getting this file from some CDN and only then start rendering React components...the possibilities to do this are as great as your creativity.

**Remember that** this was a report of how I solved this problem where I work, and even if it seems a bit complex or laborious, it solved our problem perfectly. Now any necessary changes in the UI, the person responsible for design or marketing can edit a JSON and they'll have their change live in seconds.

> An additional requirement emerged: supporting rich text formatting with bold, italic, color changes, dynamic values, and links to social platforms. Work on this continues in [this repository](https://github.com/g4rcez/code-markup-parser), which outlines the parser approach based on [BBCode](https://www.bbcode.org).

Thank you for your time, see you soon, bye bye
