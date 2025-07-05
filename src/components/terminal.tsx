"use client";
import { BlogConfig } from "@/blog.config";
import React, { useState, useEffect, useRef, useMemo } from "react";

type Command = (args: string[]) => Array<string | React.ReactElement>;

type Commands = Record<string, Command>;

type HistoryItem = { type: string; content: string | React.ReactElement; cmd: string };

export const Terminal = () => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([
        { type: "output", content: "Type 'help' to see all available commands", cmd: "help" },
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    const commands = useMemo(() => {
        const bin = [
            { name: "clear", exec: () => (setHistory([]), []), description: "Clear history" },
            { name: "whoami", exec: () => [BlogConfig.author], description: "User name" },
            {
                name: "ls",
                exec: () =>
                    BlogConfig.terminal.map((x) => (
                        <span>
                            <a
                                href={x.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline transition duration-300 ease-linear hover:text-primary"
                            >
                                {x.title}
                            </a>
                            : {x.description}
                        </span>
                    )),
                description: "List my projects",
            },
        ];
        const map = bin.reduce<Commands>(
            (acc, el) => ({
                ...acc,
                [el.name]: el.exec,
            }),
            {},
        );
        const help = [
            "Available commands:",
            <ul>
                {bin.map((x) => (
                    <li className="ml-4" key={`cmd-${x.name}`}>
                        {x.name}: {x.description}
                    </li>
                ))}
            </ul>,
        ];
        map.help = () => help;
        return map;
    }, []);

    const executeCommand = (cmd: string) => {
        const parts = cmd.trim().split(" ");
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        if (commands[command]) return commands[command](args);
        if (cmd.trim() === "") return [];
        return [`${command}: command not found`];
    };

    const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (input.trim()) {
            const output = executeCommand(input);
            const cmd = input.split(" ")[0] ?? "";
            const newHistory = output.map((line) => ({ type: "output", content: line, cmd }));
            setHistory((prev) => {
                const clone = Array.from(prev);
                if (input !== "clear") {
                    clone.push({ type: "input", content: `>_ ${input}`, cmd });
                }
                return [...clone, ...newHistory];
            });
            setInput("");
        }
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    return (
        <div className="mx-auto max-w-4xl font-mono">
            <div className="overflow-hidden bg-gray-800 rounded-lg border border-gray-700 shadow-2xl">
                <div className="flex items-center py-3 px-4 space-x-2 bg-gray-700">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                        <span className="text-sm text-gray-300">
                            {BlogConfig.author}@{BlogConfig.domain}: ~
                        </span>
                    </div>
                </div>
                <div
                    ref={terminalRef}
                    className="overflow-y-auto p-4 h-96 text-sm bg-gray-900"
                    onClick={() => inputRef.current?.focus()}
                >
                    {history.map((entry, index) => (
                        <div key={index} className="mb-1">
                            {entry.type === "input" ? (
                                <div className="text-primary">{entry.content}</div>
                            ) : (
                                <div className="text-gray-300 whitespace-pre-line">{entry.content}</div>
                            )}
                        </div>
                    ))}
                    <div className="flex items-center">
                        <span className="mr-2 text-primary">{">_"}</span>
                        <input
                            type="text"
                            value={input}
                            ref={inputRef}
                            autoComplete="off"
                            spellCheck="false"
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={history.at(0)?.cmd || "help"}
                            className="flex-1 text-gray-300 bg-transparent outline-none caret-primary"
                            onKeyDown={(e) => {
                                if (e.key === "l" && e.ctrlKey) return setHistory([]);
                                if (e.key === "Enter") return handleSubmit(e);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
