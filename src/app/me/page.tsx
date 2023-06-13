import React from "react";
import Head from "next/head";
import { me } from "~/me";

const formatMonthYear = (date: Date) =>
  date.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });

const Title = ({ children }: any) => (
  <h2 className="text-2xl md:text-3xl text-center md:text-left font-bold border-b border-black/10 dark:border-white/10 pb-2">
    {children}
  </h2>
);

const EducationSection = () => {
  return (
    <section className="grid grid-cols-1 gap-8 w-full min-w-full leading-relaxed antialiased tracking-wide break-words">
      <section className="flex flex-col gap-4">
        <Title>Education</Title>
        <ul>
          {me.education.map((edu, i) => (
            <li key={`education-key-${edu.school}-${i}`}>
              <h3 className="text-lg">
                {edu.school}. {edu.subject}
              </h3>
              <p>
                From: {formatMonthYear(edu.from)}
                {edu.to === undefined
                  ? null
                  : typeof edu.to === "string"
                  ? edu.to
                  : formatMonthYear(edu.to)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};

const JobSection = () => {
  return (
    <section className="flex flex-col gap-4 w-full">
      <Title>Job Experiences</Title>
      <ul>
        {me.jobs.map((job, i) => {
          const roles = job.roles
            .sort((a, b) => b.from.getTime() - a.from.getTime())
            .filter(Boolean);
          return (
            <li key={`education-key-${job.company}-${i}`} className="mb-8">
              <h3 className="text-2xl font-medium">
                <b>{job.company}</b>{" "}
                {i === 0 ? <span> - {roles[0].title}</span> : null}
              </h3>
              <ul className="space-y-4">
                {roles.map((role, i) => (
                  <li key={`job-title-${role.title}-${i}`} className="my-4">
                    <h3 className="text-lg">
                      {role.title} - {formatMonthYear(role.from)} -{" "}
                      {role.to ? formatMonthYear(role.to) : "Present"}
                    </h3>
                    <ul className="list-inside list-disc">
                      {role.milestones.map((x, y) => (
                        <li className="my-2" key={`${x}-${y}`}>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const Social = ({ className }: { className: string }) => (
  <div className={`w-full ${className}`}>
    <ul className="flex flex-row gap-2 w-fit">
      {me.contacts.map((contact) => (
        <li key={contact.link}>
          <a
            href={contact.link}
            title={contact.name}
            className="aspect-square link:text-main transition-colors duration-300 ease-in-out"
          >
            {contact.icon ? (
              <contact.icon className="w-6 h-6 aspect-square" />
            ) : (
              contact.name
            )}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Header = () => (
  <header className="w-full container flex flex-col md:flex-row items-center md:items-start gap-4 min-w-full">
    <div className="min-w-fit w-fit flex flex-col gap-4">
      <img
        src={me.avatar}
        width={256}
        height={256}
        alt="My image"
        className="md:w-56 md:h-56 h-48 w-48 aspect-square rounded-full block max-w-full drop-shadow-xl shadow-xl"
      />
      <Social className="hidden md:flex justify-center" />
    </div>
    <section className="flex flex-col gap-4 flex-wrap w-full">
      <h1 className="font-bold text-center md:text-left w-full text-4xl md:text-5xl">
        {me.name}
      </h1>
      <p className="text-lg font-medium text-center md:text-left">{me.role}</p>
      <p className="text-sm whitespace-break-spaces break-words">{me.about}</p>
      <nav className="w-full space-y-4">
        {me.skills.length > 0 ? (
          <ul className="flex flex-wrap flex-row w-full gap-2 items-center">
            {me.skills.map((skill) => (
              <li
                key={`skill-${skill.name}`}
                className="px-4 py-0.5 bg-main text-white rounded-lg"
              >
                {skill.name}
              </li>
            ))}
          </ul>
        ) : null}
        <Social className="block md:hidden" />
      </nav>
    </section>
  </header>
);

export default function MePage() {
  return (
    <section className="flex flex-wrap gap-8 w-full min-w-full">
      <Head>
        <title key="title">About me - {me.name}</title>
      </Head>
      <Header />
      <EducationSection />
      <JobSection />
    </section>
  );
}
