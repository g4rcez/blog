import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import React from "react";

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
  icon?: React.FC<any>;
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
    { name: "HTML" },
    { name: "CSS" },
    { name: "Javascript" },
    { name: "NodeJS" },
    { name: "React" },
    { name: "Typescript" },
  ],
  about:
    "Passionate Frontend Developer with a strong background in developing responsive, user-friendly websites and web applications using ReactJS. Proficient in modern frontend technologies such as Typescript, NextJS, Remix, and TailwindCSS. \n" +
    "Skilled in working with popular frontend frameworks such as React, React Native, and VueJS. Strong understanding of web development principles, including cross-browser compatibility, SEO, and accessibility. \n" +
    "Experience with managing and maintaining large React applications and implementing best practices. Strong experience with creating reusable components and experience with using third-party libraries and APIs.",
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
