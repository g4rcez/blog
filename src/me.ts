import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import React from "react";
import { MdEmail } from "react-icons/md";

type Contact = {
  name: string;
  link: string;
  label: string;
  icon?: React.FC<any>;
};

type Education = {
  to?: Date | "present";
  from: Date;
  school: string;
  subject: string;
  status?: "completed" | "pending" | "studying";
};

type Role = {
  to?: Date;
  from: Date;
  title: string;
  milestones: string[];
};

type Job = {
  company: string;
  startedAt: Date;
  roles: Role[];
};

type Skill = {
  name: string;
  link: string;
};

type Me = {
  about: string;
  avatar: `${"http" | "https" | "/"}://${string}`;
  contacts: Contact[];
  education: Education[];
  github: string;
  jobs: Job[];
  name: string;
  role: string;
  skills: Skill[];
};

export const me: Me = {
  name: "Allan Garcez",
  skills: [
    {
      name: "Amplitude",
      link: "https://www.vectorlogo.zone/logos/amplitude/amplitude-icon.svg",
    },
    {
      name: "Apollo",
      link: "https://www.vectorlogo.zone/logos/apollographql/apollographql-icon.svg",
    },
    {
      name: "Bash",
      link: "https://www.vectorlogo.zone/logos/gnu_bash/gnu_bash-icon.svg",
    },
    {
      name: "C# Dotnet",
      link: "https://www.vectorlogo.zone/logos/dotnet/dotnet-icon.svg",
    },
    {
      name: "CSS",
      link: "https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg",
    },
    {
      name: "Docker",
      link: "https://www.vectorlogo.zone/logos/docker/docker-icon.svg",
    },
    {
      name: "ExpressJS",
      link: "https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg",
    },
    {
      name: "Firebase",
      link: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
    },
    {
      name: "Git",
      link: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg",
    },
    {
      name: "GitHub",
      link: "https://www.vectorlogo.zone/logos/github/github-icon.svg",
    },
    {
      name: "GraphQL",
      link: "https://www.vectorlogo.zone/logos/graphql/graphql-icon.svg",
    },
    {
      name: "HTML5",
      link: "https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg",
    },
    {
      name: "Java",
      link: "https://www.vectorlogo.zone/logos/java/java-icon.svg",
    },
    {
      name: "Javascript",
      link: "https://www.vectorlogo.zone/logos/javascript/javascript-icon.svg",
    },
    {
      name: "Kotlin",
      link: "https://www.vectorlogo.zone/logos/kotlinlang/kotlinlang-icon.svg",
    },
    {
      name: "Linux",
      link: "https://www.vectorlogo.zone/logos/linux/linux-icon.svg",
    },
    {
      name: "NodeJS",
      link: "https://www.vectorlogo.zone/logos/nodejs/nodejs-horizontal.svg",
    },
    {
      name: "React",
      link: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg",
    },
    {
      name: "Spring",
      link: "https://www.vectorlogo.zone/logos/springio/springio-icon.svg",
    },
    {
      name: "Typescript",
      link: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg",
    },
  ],
  about:
    "Passionate Frontend Developer with a strong background in developing responsive, user-friendly websites and web applications using ReactJS. Proficient in modern frontend technologies such as Typescript, NextJS, Remix, and TailwindCSS. \n" +
    "Skilled in working with popular frontend frameworks such as React, React Native, and VueJS. Strong understanding of web development principles, including cross-browser compatibility, SEO, and accessibility.\n",
  role: "Senior Engineer at Stone",
  avatar: "https://avatars.githubusercontent.com/u/22946697",
  github: "g4rcez",
  contacts: [
    {
      name: "Github",
      label: "g4rcez",
      icon: GitHubLogoIcon,
      link: "https://github.com/g4rcez",
    },
    {
      name: "Twitter",
      label: "garcez_allan",
      icon: TwitterLogoIcon,
      link: "https://twitter.com/garcez_allan",
    },
    {
      name: "Email",
      label: "allan.f.garcez",
      icon: MdEmail,
      link: "mailto:allan.f.garcez@gmail.com",
    },
  ] as Contact[],
  education: [
    {
      school: "IF Sudeste MG - Juiz de Fora",
      status: "pending",
      subject: "Bachelor Degree Information Technology",
      from: new Date("2016-05-04"),
    },
  ] as Education[],
  jobs: [
    {
      company: "Stone",
      startedAt: new Date("2020-05-18"),
      roles: [
        {
          title: "Frontend Software Engineer - Entry level",
          from: new Date("2020-05-18"),
          to: new Date("2020-11-05"),
          milestones: [
            "Work using ReactJS, TailwindCSS, Typescript, NodeJS and Postgres",
            "Responsible to create administrative dashboard for financial consultants",
            "Responsible to create pricing systems to define the price of all products in the company",
          ],
        },
        {
          title: "Frontend Software Engineer",
          from: new Date("2020-11-05"),
          to: new Date("2021-12-01"),
          milestones: [
            "Stated a micro frontend architecture to deploy different websites in different repositories",
            "Responsible to create a authentication system for internal users",
            "Work using ReactJS, TailwindCSS, Typescript, NodeJS and Postgres",
            "Responsible to create administrative dashboard for financial consultants",
            "Responsible to create pricing systems to define the price of all products in the company",
            "Responsible to create billing systems to charge clients at company",
          ],
        },
        {
          title: "Senior Software Engineer",
          from: new Date("2021-12-01"),
          to: "present",
          milestones: [
            "Stated a micro frontend architecture to deploy different websites in different repositories",
            "Responsible to create a authentication system for internal users",
            "Work using ReactJS, TailwindCSS, Typescript, NodeJS and Postgres",
            "Responsible to create administrative dashboard for financial consultants",
            "Responsible to create pricing systems to define the price of all products in the company",
            "Responsible to create billing systems to charge clients at company",
          ],
        },
      ],
    },
  ] as Job[],
};
