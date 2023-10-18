import { BackpackIcon, BookmarkFilledIcon, LaptopIcon } from "@radix-ui/react-icons";
import React, { Fragment } from "react";
import { Track } from "~/components/track";
import { me } from "~/me";

const formatMonthYear = (date: Date) => date.toLocaleDateString(undefined, { month: "short", year: "numeric" });

const FromTo = ({ from, to }: { from: Date; to: Date | "present" | undefined | null }) => (
    <p className="text-xs">
        From {formatMonthYear(from)}
        {to instanceof Date ? <Fragment>{` to ${formatMonthYear(to!)}`}</Fragment> : null}
        {to === "present" ? " to present" : null}
    </p>
);

const SectionTitle = ({ Icon, title }: { Icon: any; title: string }) => (
    <h2 className="flex items-center font-medium text-3xl print:text-2xl gap-2">
        <Icon className="text-indigo-500 w-6 h-6" /> {title}
    </h2>
);

const MyTechnologies = () => (
    <section className="grid grid-cols-1 gap-8 w-full min-w-full leading-relaxed antialiased tracking-wide break-words">
        <section className="flex flex-col gap-4">
            <SectionTitle Icon={BackpackIcon} title="Languages and Tools" />
            <ul className="flex dark:bg-white p-4 rounded-md gap-6 items-center justify-between flex-wrap">
                {me.skills.map((tech, i) => (
                    <li
                        aria-label={tech.name}
                        data-balloon-pos="up"
                        className="w-10"
                        key={`education-key-${tech.name}-${i}`}
                    >
                        <img alt={tech.name} src={tech.link} />
                    </li>
                ))}
            </ul>
        </section>
    </section>
);

const EducationSection = () => (
    <section className="grid grid-cols-1 gap-8 w-full min-w-full leading-relaxed antialiased tracking-wide break-words">
        <section className="flex flex-col gap-4">
            <SectionTitle Icon={BookmarkFilledIcon} title="My education" />
            <ul>
                {me.education.map((edu, i) => (
                    <li key={`education-key-${edu.school}-${i}`}>
                        <FromTo from={edu.from} to={edu.to} />
                        <h3 className="text-lg font-medium">
                            {edu.school}. {edu.subject}
                        </h3>
                    </li>
                ))}
            </ul>
        </section>
    </section>
);

const JobSection = () => (
    <section className="flex flex-col gap-4 w-full">
        <SectionTitle Icon={LaptopIcon} title="My career" />
        <ul>
            {me.jobs.map((job, i) => {
                const roles = job.roles.sort((a, b) => b.from.getTime() - a.from.getTime()).filter(Boolean);
                const first = roles.at(0);
                return (
                    <li
                        key={`education-key-${job.company}-${i}`}
                        className="mb-8 first:border-t-0 first:pt-0 pt-8 border-t last:border-b-0 border-zinc-300"
                    >
                        <FromTo from={job.startedAt} to={first?.to} />
                        <h3 className="text-2xl print:text-xl font-medium mt-2 mb-3">{job.company}</h3>
                        <ul className="space-y-4">
                            {roles.map((role, i) => (
                                <li key={`job-title-${role.title}-${i}`} className="mb-6 mt-2 text-sm">
                                    <h4 className="font-medium text-lg">
                                        {role.title} - {formatMonthYear(role.from)} -{" "}
                                        {role.to instanceof Date ? formatMonthYear(role.to) : "Present"}
                                    </h4>
                                    <ul className="list-inside mb-4 space-y-4">
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

const Social = () => (
    <ul className="space-y-2">
        {me.contacts.map((contact) => (
            <li key={contact.link}>
                <a
                    href={contact.link}
                    title={contact.name}
                    className="flex gap-1 flex-row items-center link:text-indigo-400 transition-colors duration-300 ease-in-out"
                >
                    {contact.icon ? (
                        <Fragment>
                            <contact.icon className="w-5 h-5 aspect-square" />
                            {contact.name}
                        </Fragment>
                    ) : (
                        contact.name
                    )}
                </a>
            </li>
        ))}
    </ul>
);

export default function MePage() {
    return (
        <section className="flex gap-8 w-full print:flex-row md:flex-row flex-col flex-nowrap min-w-full px-4 md:px-0">
            <Track event="my-profile" />
            <div className="w-full lg:w-1/4 print:w-1/3 space-y-3">
                <img
                    src={me.avatar}
                    width={256}
                    height={256}
                    alt="My image"
                    className="w-full rounded-lg aspect-square block max-w-full shadow-md"
                />
                <h1 className="font-bold text-3xl">Allan Garcez</h1>
                <p>{me.role}</p>
                <h2 className="text-md opacity-80 gap-2 text-indigo-500 dark:text-indigo-300">About</h2>
                <p className="text-sm">{me.about}</p>
                <h2 className="text-md flex items-center opacity-80 gap-1 text-indigo-500 dark:text-indigo-300">
                    My links
                </h2>
                <Social />
            </div>
            <main className="w-full lg:w-3/4 print:w-2/3 flex flex-col gap-8">
                <MyTechnologies />
                <EducationSection />
                <JobSection />
            </main>
        </section>
    );
}
