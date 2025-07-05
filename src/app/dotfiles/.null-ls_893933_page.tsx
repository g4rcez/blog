"use client";
import { BlogConfig } from "@/blog.config";
import React, { useState, useEffect, useRef, useMemo } from "react";

type Command = (args: string[]) => string[];

type Commands = Record<string, Command>;

const Terminal = () => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([{ type: "output", content: 'Digite "help" para listar os comandos.' }]);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    const commands = useMemo(() => {
        const bin = [
            { name: "clear", exec: () => (setHistory([]), []), description: "Limpar tela" },
            { name: "whoami", exec: () => [BlogConfig.author], description: "Nome do usuário" },
            {
                name: "ls",
                exec: () => BlogConfig.terminal.map((x) => `${x.title}: ${x.description}`),
                description: "Listar diretório",
            },
        ];
        const map = bin.reduce<Commands>(
            (acc, el) => ({
                ...acc,
                [el.name]: el.exec,
            }),
            {},
        );
        const help = bin.map(x => `\t${x.name}: ${x.description}`)
        map.help = () => help
        return map;
    }, []);

    const executeCommand = (cmd: string) => {
        const parts = cmd.trim().split(" ");
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (commands[command]) {
            return commands[command](args);
        } else if (cmd.trim() === "") {
            return [];
        } else {
            return [`${command}: command not found`];
        }
    };

    const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (input.trim()) {
            const output = executeCommand(input);
            const newHistory = output.map((line) => ({ type: "output", content: line }));
            setHistory((prev) => {
                const clone = Array.from(prev);
                if (input !== "clear") {
                    clone.push({ type: "input", content: `>_ ${input}` });
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
        if (inputRef.current) {
            inputRef.current.focus();
        }
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
                                <div className="text-blue-400">{entry.content}</div>
                            ) : (
                                <div className="text-gray-300 whitespace-pre-line">{entry.content}</div>
                            )}
                        </div>
                    ))}
                    <div className="flex items-center">
                        <span className="mr-2 text-blue-400">{">_"}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "l" && e.ctrlKey) return setHistory([]);
                                if (e.key === "Enter") return handleSubmit(e);
                            }}
                            className="flex-1 text-gray-300 bg-transparent outline-none caret-blue-400"
                            autoComplete="off"
                            spellCheck="false"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function DotfilesPage() {
    return (
        <div className="flex-auto py-16 min-w-0 max-w-7xl lg:pr-0 lg:max-w-none">
            <Terminal />
        </div>
    );
}
