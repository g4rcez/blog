"use client";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import { Input as InputBase } from "@g4rcez/components/input";

// TS2786: same cast as mask-playground.tsx — @g4rcez/components/input return type
// is Promise<ReactNode>, incompatible with JSX without this narrowing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Input = InputBase as ComponentType<any>;

const TOKEN_PLACEHOLDER: Record<string, string> = {
    d: "0",
    H: "F",
    X: "A",
    x: "a",
    A: "A",
    a: "a",
};

const derivePlaceholder = (mask: string) =>
    mask
        .split("")
        .map((ch) => TOKEN_PLACEHOLDER[ch] ?? ch)
        .join("");

const buildSnippet = (mask: string, placeholder: string) =>
    `import { Input } from "@g4rcez/components/input";

<Input
  name="custom"
  mask="${mask}"
  title="Custom"
  placeholder="${placeholder}"
/>`;

const DEFAULT_MASK = "ddd-dd-dddd";

export const CustomMaskLive = () => {
    const [mask, setMask] = useState(DEFAULT_MASK);
    const [lines, setLines] = useState<Array<Array<{ content: string; color?: string }>>>([]);
    const placeholder = derivePlaceholder(mask);
    const snippet = buildSnippet(mask, placeholder);

    useEffect(() => {
        let cancelled = false;
        Promise.all([import("shiki/bundle/web"), import("shiki/themes/catppuccin-mocha.mjs")])
            .then(([{ codeToTokensBase }, dark]) => codeToTokensBase(snippet, { lang: "tsx", theme: dark.default }))
            .then((result) => {
                if (!cancelled) setLines(result);
            });
        return () => {
            cancelled = true;
        };
    }, [snippet]);

    return (
        <div className="flex flex-col gap-4 rounded-xl bg-slate-900 p-5 ring-1 ring-slate-300/10">
            <div>
                How to use tokens?
                <ul>
                    <li>d = digit</li>
                    <li>H = hexadecimal</li>
                    <li>X = alphanumeric</li>
                    <li>x = alphabetic</li>
                    <li>A = uppercase</li>
                    <li>a = lowercase</li>
                </ul>
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="mask-editor" className="font-mono text-xs font-semibold text-slate-400">
                    mask string
                </label>
                <input
                    id="mask-editor"
                    type="text"
                    spellCheck={false}
                    value={mask}
                    onChange={(e) => setMask(e.target.value)}
                    className="w-full rounded-lg bg-slate-800 px-3 py-2 font-mono text-sm text-sky-300 outline-none ring-1 ring-slate-700 focus:ring-sky-500"
                    aria-label="Mask string"
                />
            </div>
            <Input name="custom-live" mask={mask || undefined} title="Live preview" placeholder={placeholder} />
            <pre className="overflow-x-auto rounded-xl bg-slate-800 p-4 text-xs leading-relaxed shadow-lg ring-1 ring-slate-300/10">
                <code>
                    {lines.length > 0
                        ? lines.map((line, i) => (
                              <div key={i}>
                                  {line.map((token, j) => (
                                      <span key={j} style={token.color ? { color: token.color } : undefined}>
                                          {token.content}
                                      </span>
                                  ))}
                              </div>
                          ))
                        : snippet}
                </code>
            </pre>
        </div>
    );
};
