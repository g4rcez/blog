import { DocsHeader } from "@/components/docs-header";
import { Fence } from "@/components/fence";
import { CustomMaskLive } from "@/components/client/custom-mask-live";
import { MaskPlayground } from "@/components/client/mask-playground";
import { Prose } from "@/components/prose";
import { TableOfContents } from "@/components/table-of-contents";
import { type Section } from "@/lib/sections";
import { BlogConfig } from "@/blog.config";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { Fragment, Suspense } from "react";

const DESCRIPTION =
    "A 3.9kB input masking library for React. Drop-in <Input /> with built-in masks for CPF, CNPJ, phone, date, currency, and more.";

const PROJECT_PATH = "/projects/the-mask-input";
const PROJECT_URL = absoluteUrl(PROJECT_PATH);

export const metadata: Metadata = {
    title: "the-mask-input",
    description: DESCRIPTION,
    keywords: ["react", "input mask", "typescript", "forms", "cpf", "cnpj", "the-mask-input"],
    alternates: {
        canonical: PROJECT_PATH,
        languages: { "en-US": PROJECT_URL, "x-default": PROJECT_URL },
    },
    openGraph: {
        type: "website",
        url: PROJECT_URL,
        siteName: BlogConfig.name["en-US"],
        title: "the-mask-input",
        description: DESCRIPTION,
        locale: "en_US",
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "the-mask-input" }],
    },
    twitter: {
        card: "summary_large_image",
        site: "@garcez_allan",
        creator: "@garcez_allan",
        title: "the-mask-input",
        description: DESCRIPTION,
        images: [DEFAULT_OG_IMAGE],
    },
};

type TocEntry = { id: string; title: string; level: number; children: [] };
const tableOfContents = [
    { id: "installation", title: "Installation", level: 2, children: [] as [] },
    { id: "built-in-masks", title: "Built-in masks", level: 2, children: [] as [] },
    { id: "custom-masks", title: "Custom masks", level: 2, children: [] as [] },
] satisfies TocEntry[] as unknown as Array<Section>;

const INSTALL_SNIPPET = `pnpm add the-mask-input`;

const QUICKSTART_SNIPPET = `import { Input } from "@g4rcez/components/input";

export default function App() {
  return (
    <form>
      <Input name="cpf" mask="cpf" title="CPF" placeholder="000.000.000-00" />
    </form>
  );
}`;

const TOKEN_SNIPPET = `// Tokens: d = digit, H = hex, X = alphanumeric, x = alpha, A = uppercase, a = lowercase
import { Input } from "@g4rcez/components/input";

<Input name="doc" mask="ddd.ddd.ddd-dd" title="Custom document" placeholder="000.000.000-00" />`;

const REGEX_SNIPPET = `// Brazilian license plate: ABC-1234
import { Input } from "@g4rcez/components/input";

<Input
  name="plate"
  title="License plate"
  mask={[/[A-Z]/, /[A-Z]/, /[A-Z]/, "-", /\\d/, /\\d/, /\\d/, /\\d/]}
  placeholder="ABC-1234"
/>`;

const FUNCTION_SNIPPET = `// Validates hours 00–23 by switching the pattern when the first digit is "2"
import { Input } from "@g4rcez/components/input";

const hourMask = (value: string) => {
  const startsWithTwo = ["2", /[0-3]/, ":", /[0-5]/, /\\d/];
  const defaultHour  = [/[01]/, /\\d/, ":", /[0-5]/, /\\d/];
  return value.startsWith("2") ? startsWithTwo : defaultHour;
};

<Input name="hour" title="Hour" mask={hourMask} placeholder="00:00" />`;

export default function TheMaskInputPage() {
    return (
        <Fragment>
            <div className="min-w-0 max-w-7xl flex-auto px-2 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
                <article>
                    <DocsHeader
                        title="the-mask-input"
                        description={DESCRIPTION}
                        tags={["react", "typescript", "forms"]}
                    />
                    <div className="mb-8 flex gap-4 text-sm">
                        <a
                            href="https://github.com/g4rcez/the-mask-input"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-sky-400 hover:text-sky-300"
                        >
                            GitHub ↗
                        </a>
                        <a
                            href="https://www.npmjs.com/package/the-mask-input"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-sky-400 hover:text-sky-300"
                        >
                            npm ↗
                        </a>
                    </div>

                    <MaskPlayground />

                    <Prose>
                        <h2 id="installation">Installation</h2>
                        <Fence language="bash">{INSTALL_SNIPPET}</Fence>
                        <Fence language="tsx">{QUICKSTART_SNIPPET}</Fence>
                        <p>
                            <code>@g4rcez/components</code> wraps <code>the-mask-input</code> — all named masks and
                            custom mask features are available through it.
                        </p>

                        <h2 id="built-in-masks">Built-in masks</h2>
                        <ul>
                            <li>
                                <code>cpf</code> — 000.000.000-00
                            </li>
                            <li>
                                <code>cnpj</code> — 00.000.000/0000-00
                            </li>
                            <li>
                                <code>cpfCnpj</code> — CPF or CNPJ (auto-detects by length)
                            </li>
                            <li>
                                <code>cep</code> — 000000-000
                            </li>
                            <li>
                                <code>cellphone</code> — (00) 90000-0000
                            </li>
                            <li>
                                <code>telephone</code> — (00) 0000-0000
                            </li>
                            <li>
                                <code>cellTelephone</code> — cellphone or telephone (auto-detects)
                            </li>
                            <li>
                                <code>int</code> — integers only
                            </li>
                            <li>
                                <code>color</code> — #000 or #000000
                            </li>
                            <li>
                                <code>creditCard</code> — 0000 0000 0000 0000
                            </li>
                            <li>
                                <code>date</code> — dd/MM/yyyy
                            </li>
                            <li>
                                <code>isoDate</code> — yyyy/MM/dd
                            </li>
                            <li>
                                <code>time</code> — 00:00
                            </li>
                            <li>
                                <code>uuid</code> — UUID format
                            </li>
                        </ul>

                        <h2 id="custom-masks">Custom masks</h2>
                        <h3>Token-based</h3>
                        <p>
                            Pass a string where each character is a token. Useful for fixed-length formats that match a
                            single character class per position.
                        </p>
                        <Fence language="tsx">{TOKEN_SNIPPET}</Fence>
                        <p>
                            The same token string works for any fixed-length format. Try it live — edit the mask below
                            and the input updates instantly. The US Social Security Number is a good starting point:
                        </p>
                        <CustomMaskLive />
                        <h3>Regex array</h3>
                        <p>
                            Pass an array where each element is either a literal string (fixed character) or a{" "}
                            <code>RegExp</code> (validated position). Useful for formats with mixed literals and
                            character classes.
                        </p>
                        <Fence language="tsx">{REGEX_SNIPPET}</Fence>

                        <h3>Function-based</h3>
                        <p>
                            Pass a function that receives the current value and returns a mask. Useful when the mask
                            pattern depends on what the user has typed so far.
                        </p>
                        <Fence language="tsx">{FUNCTION_SNIPPET}</Fence>
                    </Prose>
                </article>
            </div>
            <Suspense fallback={null}>
                <TableOfContents tableOfContents={tableOfContents} />
            </Suspense>
        </Fragment>
    );
}
