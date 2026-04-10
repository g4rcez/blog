---
level: 1
title: How to study frontend?
subjects: ["react", "frontend", "typescript", "javascript"]
language: "en-US"
translations: ["pt-br", "en-us"]
date: "2023-12-21T05:30:00.000Z"
description: "How to define your study path with frontend?"
---

> I haven't been able to write about it yet, but I started doing live streams on [twitch.tv/allangarcez](https://twitch.tv/allangarcez) talking about Backend/Frontend development, focusing on NodeJS, React and Typescript.

The IT field is undeniably popular right now. What is less clear to many, however, is how to actually begin studying it. This article attempts to provide some direction for those starting their journey, along with thoughts on career paths. This is the first non-technical post on this blog.

And just a reminder, this post will focus on the frontend career. If you really like the backend part, rest assured that I'll still write about it.

# Where to start?

The first important step to define your studies is to know a little more about the field as a whole. Try to understand what a frontend, a devops, a backend or even a data engineer does. Even if you know it superficially, it's already a good tip to direct what you're looking for, according to your tastes and aptitudes.

As mentioned, this article focuses on the frontend path — specifically the web developer journey centered on the browser. It covers what to study to start building websites, landing pages, and web systems that may or may not communicate with external services.

The focus of the post is not to teach each of the technologies, but to give you a direction to start with each of the technologies, covering the most used concepts, practices and tools of each one.

# HTML, where it all begins

HTML or Hyper Text Markup Language is a markup language to signal to the browser the structure of your page. Think of HTML as the skeleton and muscles of the human body, being the base that sustains everything in the body, but don't be fooled, you still need the appearance ([CSS](#css)) and the nervous system ([Javascript](#javascript)) for everything to work as it should. HTML allows you to mark your pages with titles, texts, blocks, links to access other sites, paragraphs or even references to other sites (you'll know this guy as iframe).

HTML is essential for you to start developing your sites, without knowing HTML semantics, you won't evolve in your studies, so it's good to build the foundation in this technology and especially in the concepts around it.

## References for HTML

- [W3c Schools](https://www.w3schools.com/html/): The school of every web beginner
- [Mozilla Developer Network - MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTML): The guide you'll always search for
- [How to start with HTML?](https://www.freecodecamp.org/news/introduction-to-html): Freecodecamp, a great site for queries and tutorials about technology

## Concepts

Here I'll leave a list of concepts that are advised to be studied, remember that you don't need to be a master in the subject, your study should be gradual. Start by studying a little to know what it's about, as you evolve more with technology in general, you can improve the depth of knowledge.

- [What is the DOM?](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- [Accessibility](https://www.a11yproject.com/): For a web without barriers, no matter how you use the browser.
- [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState): If you've already filled out a form and want to make your own, this guy will help you with that

## You may need tools

- [Can I use?](https://caniuse.com/): Can you use a feature in all browsers?
- [Icon Monster](https://iconmonstr.com/): You may need custom icons for your sites.
- [W3c Validator](https://validator.w3.org/): Use this guy to know if your work is correct

# CSS

If HTML is the body structure, CSS is the appearance, defining the color of hair, eyes, skin and everything else related to appearance. CSS is an enjoyable technology, though it can be deceptive. The "Cascading" in its name is key: styles are applied from top to bottom, just as they are written. To style an element, specify its selector and the desired properties — but always be mindful of the cascade rules, as styles defined later in the file can override those defined above.

## References for CSS

- [W3c Schools](https://www.w3schools.com/css/): This is always a great starting point for web technologies
- [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS): You'll always see MDN, your new best friend for web technology studies
- [Origamid](https://www.origamid.com/): I'll leave this course here that was a course that always helped me a lot to understand CSS, and it will certainly help you too

## Concepts

- [Flexbox](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox): A simple way to visually structure your blocks on sites
- [Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/grid): Alternative to flex, being more focused on fixed layouts
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations): If you like your creative side, animations will bring life to your sites

## Frameworks

With CSS you'll be able to bring all the visual identity of a brand, animations and styled elements to your frontend. And for that, you can use various techniques and frameworks *(tools that work as a ready-made code package)* to help you

- [FCSS](https://www.htmlgoodies.com/css/brief-introduction-to-functional-css/): A solution for the CSS cascade problem
- [Bem Syntax](https://getbem.com/introduction/): Build your styles through blocks
- [RSCSS](https://ricostacruz.com/rscss/): A solution focused on components and style scopes

## Tools

- [Bootstrap](https://getbootstrap.com/): One of the most widely recognized CSS frameworks. Its pre-built components and styles can accelerate development significantly.
- [Tailwindcss](https://tailwindcss.com/): A utility-first CSS framework that enables building designs directly in markup using low-level classes.

# Javascript

JavaScript is the final element of the web development triad. Where HTML provides structure and CSS defines appearance, JavaScript serves as the logic layer — controlling actions, events, and user interactions through code. Unlike HTML and CSS, JavaScript is a programming language, so familiarity with programming logic and data structures will be necessary to use it fluently.

Being a programming language, Javascript has an absurd power to literally do anything in the browser, you just need to know the APIs *(Application Programming Interface, a way to abstract complex codes into simpler code)* and you'll be able to accomplish it.

## References for Javascript

- [W3C Schools](https://www.w3schools.com/js/): A reliable reference that has already been recommended throughout this guide
- [MDN](https://developer.mozilla.org/en-US/docs/Web/Javascript): The comprehensive JavaScript reference maintained by Mozilla

# Typescript

During your Javascript learning, you may encounter problems like `Cannot read properties of undefined`.
And this occurs because the type of your variable is undefined. Generally, this type of problem can be avoided if you
use typed languages, like Typescript, Java, C#...And speaking of Typescript, this should certainly be a
language to add to your study map.

[Typescript](https://www.typescriptlang.org/) is a superset of Javascript, adding types to the language and making your
life much simpler. Here on the blog you can find several [topics about Typescript](https://garcez.dev/?q=typescript).

## References for Typescript

- [Official documentation](https://www.typescriptlang.org/)
- [Total Typescript](https://www.totaltypescript.com/): A great course with plenty of free material to help you
- [Type level Typescript](https://type-level-typescript.com/): Another course that will certainly help you on the journey

# Frameworks

To optimize your productivity with code, you'll need to know and study some of the most used frameworks in the
market. Without extending too much, I'll leave a list of the most used for each topic.

## Javascript/Typescript - Frontend

- [ReactJS](https://react.dev/)
- [AngularJS](https://angular.io/)
- [VueJS](https://vuejs.org/)

## CSS

- [Tailwindcss](https://tailwindcss.com)
- [Bootstrap](https://getbootstrap.com/)
- [Foundation](https://get.foundation/)

## Libraries

These are interesting topics to study, but don't fall under frameworks

- [Lodash](https://lodash.com/): Utility functions for you to avoid code repetition
- [DateFNS](https://date-fns.org/): Utilities for working with dates
- [D3js](https://d3js.org/): The most famous library for working with charts
- [Axios](https://axios-http.com/docs/intro): Library for HTTP requests
- [Ant Design](https://ant.design/): A library of visual components for ReactJS

Thank you for your time, see you soon, bye bye
