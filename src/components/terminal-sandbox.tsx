"use client";
import { type Locale } from "@/lib/dictionary";
import { useTranslation } from "@/lib/i18n";
import { portfolioPath } from "@/lib/portfolio-routes";
import { localizedPath } from "@/lib/seo";
import { BashShell } from "@wterm/just-bash";
import { Terminal as WTermTerminal, useTerminal } from "@wterm/react";
import { defineCommand } from "just-bash";
import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from "react";
import "@wterm/react/css";
import styles from "./terminal.module.css";
import { getTerminalContent } from "./terminal-content";

const makeUrlsClickable = (content: string) =>
    content.replace(/https?:\/\/[^\s<>"'`]+/g, (match) => {
        const escapeIndex = match.indexOf("\x1b");
        const visible = escapeIndex === -1 ? match : match.slice(0, escapeIndex);
        const suffix = escapeIndex === -1 ? "" : match.slice(escapeIndex);
        const punctuation = visible.match(/[),.;!?]+$/)?.[0] ?? "";
        const url = visible.slice(0, visible.length - punctuation.length);
        return `\x1b]8;;${url}\x07${url}\x1b]8;;\x07${punctuation}${suffix}`;
    });

const createSyntaxHighlightedCat = (unavailableMessage: string) =>
    defineCommand("cat", async (args, context) => {
        const originalCat = context.origCommand;
        if (!originalCat) {
            return { stdout: "", stderr: `${unavailableMessage}\n`, exitCode: 127 };
        }

        const result = await originalCat(args);
        if (result.exitCode !== 0 || args.length === 0 || args.some((path) => path.startsWith("-"))) {
            return result;
        }

        let stdout = result.stdout;
        if (args.every((path) => path.toLowerCase().endsWith(".ts"))) {
            try {
                const { codeToTokens } = await import("shiki/bundle/web");
                const theme = document.documentElement.classList.contains("dark") ? "dark-plus" : "light-plus";
                const { tokens } = await codeToTokens(result.stdout, { lang: "typescript", theme });
                stdout = tokens
                    .map((line) =>
                        line
                            .map((token) => {
                                const hex = token.color?.match(/^#([\da-f]{6})$/i)?.[1];
                                if (!hex || token.content.length === 0 || token.content.includes("\x1b"))
                                    return token.content;
                                const red = Number.parseInt(hex.slice(0, 2), 16);
                                const green = Number.parseInt(hex.slice(2, 4), 16);
                                const blue = Number.parseInt(hex.slice(4, 6), 16);
                                return `\x1b[38;2;${red};${green};${blue}m${token.content}\x1b[39m`;
                            })
                            .join(""),
                    )
                    .join("\n");
            } catch {
                stdout = result.stdout;
            }
        }
        return { ...result, stdout: makeUrlsClickable(stdout) };
    });

const createCommandShortcut = (name: string, command: string, unavailableMessage: string) =>
    defineCommand(name, async (args, context) => {
        if (!context.exec) {
            return { stdout: "", stderr: `${unavailableMessage}\n`, exitCode: 127 };
        }
        return context.exec(command, { cwd: context.cwd, args });
    });

const createOpenCommand = (
    locale: Locale,
    messages: Pick<ReturnType<typeof getTerminalContent>, "openUsage" | "openNotFound">,
) =>
    defineCommand("open", async (args, context) => {
        const [argument] = args;
        if (args.length !== 1 || !argument) {
            return { stdout: "", stderr: `${messages.openUsage}\n`, exitCode: 2 };
        }

        const targetPath = context.fs.resolvePath(context.cwd, argument);
        const match = targetPath.match(/^\/home\/user\/(posts|projects)\/([^/]+)\.md$/);
        if (!match) {
            return { stdout: "", stderr: `${messages.openUsage}\n`, exitCode: 2 };
        }

        const [, kind, slug] = match;
        const file = await context.fs.stat(targetPath).catch(() => null);
        if (!file?.isFile) {
            return { stdout: "", stderr: `${messages.openNotFound}\n`, exitCode: 1 };
        }

        const destination =
            kind === "posts"
                ? localizedPath(locale, `/posts/${encodeURIComponent(slug)}`)
                : `${portfolioPath(locale, "openSource")}#project-${encodeURIComponent(slug)}`;

        window.location.assign(destination);
        return { stdout: "", stderr: "", exitCode: 0 };
    });

function isTerminalPayload(value: unknown): value is { files: Record<string, string> } {
    if (!value || typeof value !== "object" || !("files" in value)) return false;
    const files = value.files;
    return (
        !!files &&
        typeof files === "object" &&
        !Array.isArray(files) &&
        Object.entries(files).every(
            ([path, content]) =>
                (path.startsWith("/home/user/") || path.startsWith("/home/visitor/")) && typeof content === "string",
        )
    );
}

export function TerminalSandbox() {
    const { locale } = useTranslation();
    const instructionsId = useId();
    const copy = getTerminalContent(locale);
    const { ref, write } = useTerminal();
    const shell = useRef<BashShell | null>(null);
    const request = useRef<AbortController | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        return () => {
            request.current?.abort();
            request.current = null;
            shell.current = null;
        };
    }, []);

    const onReady = useCallback(() => {
        if (shell.current || request.current) return;

        const controller = new AbortController();
        request.current = controller;
        void fetch(`/api/terminal-posts/${locale}`, { signal: controller.signal })
            .then(async (response) => {
                if (!response.ok) throw new Error(`${copy.filesRequestFailed}: ${response.status}`);
                const payload: unknown = await response.json();
                if (!isTerminalPayload(payload)) throw new Error(copy.invalidFilesResponse);
                return Object.fromEntries(
                    Object.entries(payload.files).map(([path, content]) => [
                        path.replace(/^\/home\/visitor(?=\/)/, "/home/user"),
                        content,
                    ]),
                );
            })
            .then(async (files) => {
                if (request.current !== controller) return;
                const next = new BashShell({
                    cwd: "/home/user",
                    files,
                    prompt: (cwd) => {
                        const directory = cwd.replace(/^\/home\/user(?=\/|$)/, "~");
                        return `\x1b[38;2;0;166;244m[${directory}]\x1b[0m\x1b[38;2;0;166;244m>_\x1b[0m `;
                    },
                });
                shell.current = next;
                await next.attach((data) => {
                    if (shell.current === next) write(data);
                });
                if (shell.current !== next) return;
                const bash = next.bash;
                if (!bash) throw new Error(copy.shellUnavailable);
                bash.registerCommand(createSyntaxHighlightedCat(copy.catUnavailable));
                bash.registerCommand(createCommandShortcut("posts", "ls posts", copy.shellUnavailable));
                bash.registerCommand(createCommandShortcut("tags", "ls tags", copy.shellUnavailable));
                bash.registerCommand(createCommandShortcut("agents", "cat agents.ts", copy.shellUnavailable));
                bash.registerCommand(createCommandShortcut("skills", "cat skills.ts", copy.shellUnavailable));
                bash.registerCommand(createOpenCommand(locale, copy));
                setStatus("ready");
            })
            .catch((error: unknown) => {
                if (request.current !== controller || (error instanceof DOMException && error.name === "AbortError")) {
                    return;
                }
                setStatus("error");
            })
            .finally(() => {
                if (request.current === controller) request.current = null;
            });
    }, [copy, locale, write]);

    const onData = useCallback(
        (data: string) => {
            const activeShell = shell.current;
            if (!activeShell || status !== "ready") return;
            void activeShell.handleInput(data).catch(() => setStatus("error"));
        },
        [status],
    );

    const onTerminalClickCapture = useCallback((event: MouseEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        if (!(event.target instanceof Element)) return;

        const anchor = event.target.closest("a[href]");
        if (!(anchor instanceof HTMLAnchorElement)) return;

        let url: URL;
        try {
            url = new URL(anchor.href);
        } catch {
            return;
        }
        if (url.protocol !== "http:" && url.protocol !== "https:") return;

        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        event.stopPropagation();
    }, []);

    if (status === "error") {
        return (
            <div className={styles.fallback} role="alert">
                <p>{copy.startupError}</p>
                <button type="button" className={styles.retry} onClick={() => window.location.reload()}>
                    {copy.reload}
                </button>
            </div>
        );
    }

    return (
        <div className={styles.body} onClickCapture={onTerminalClickCapture}>
            {status === "loading" && (
                <p className={styles.status} role="status">
                    {copy.loading}
                </p>
            )}
            <WTermTerminal
                ref={ref}
                autoResize
                announceOutput
                onData={onData}
                onReady={onReady}
                aria-label={copy.label}
                className={styles.screen}
                aria-describedby={instructionsId}
                onError={() => setStatus("error")}
            />
            <p id={instructionsId} className="sr-only">
                {copy.instructions}
            </p>
        </div>
    );
}
