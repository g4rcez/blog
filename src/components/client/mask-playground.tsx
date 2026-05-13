"use client";
import { Input as InputBase } from "@g4rcez/components/input";
import type { ComponentType, ReactNode } from "react";

// TS2786: @g4rcez/components/input returns Promise<ReactNode> in its type signature,
// which is incompatible with JSX element constraints. Narrowing to ComponentType<any>
// preserves JSX call-site checking while suppressing the return-type error.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Input = InputBase as ComponentType<any>;

const cpfOrCnpj = (value: string) => (value.replace(/\D/g, "").length <= 11 ? ("cpf" as const) : ("cnpj" as const));

const SNIPPETS = {
    cpf: `import { Input } from "@g4rcez/components/input";

<Input name="cpf" mask="cpf" title="CPF" placeholder="000.000.000-00" />`,

    cnpj: `import { Input } from "@g4rcez/components/input";

<Input name="cnpj" mask="cnpj" title="CNPJ" placeholder="00.000.000/0000-00" />`,

    cellphone: `import { Input } from "@g4rcez/components/input";

<Input name="phone" mask="cellphone" title="Phone" placeholder="(00) 90000-0000" />`,

    date: `import { Input } from "@g4rcez/components/input";

<Input name="date" mask="date" title="Date" placeholder="dd/MM/yyyy" />`,

    currency: `import { Input } from "@g4rcez/components/input";

<Input
  name="price"
  mask="currency"
  locale="pt-BR"
  currency="BRL"
  title="Price"
  placeholder="R$ 0,00"
/>`,

    creditCard: `import { Input } from "@g4rcez/components/input";

<Input name="card" mask="creditCard" title="Credit card" placeholder="0000 0000 0000 0000" />`,

    uuid: `import { Input } from "@g4rcez/components/input";

<Input name="uuid" mask="uuid" title="UUID" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />`,

    cpfCnpjFn: `import { Input } from "@g4rcez/components/input";

const docMask = (value: string) =>
  value.replace(/\\D/g, "").length <= 11 ? "cpf" : "cnpj";

<Input name="doc" mask={docMask} title="CPF or CNPJ" placeholder="000.000.000-00" />`,
} as const;

type CellProps = {
    input: ReactNode;
    chip: string;
    snippet: string;
};

const MaskCell = ({ input, chip, snippet }: CellProps) => (
    <div className="flex flex-col gap-3">
        {input}
        <code className="self-start rounded bg-slate-800 px-2 py-1 font-mono text-xs text-sky-400">{chip}</code>
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-300 shadow-lg ring-1 ring-slate-300/10">
            <code>{snippet}</code>
        </pre>
    </div>
);

export const MaskPlayground = () => (
    <section className="mb-12" aria-labelledby="live-playground">
        <h2 id="live-playground" className="mb-6 font-display text-2xl font-semibold tracking-tight text-foreground">
            Live playground
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <MaskCell
                input={<Input name="cpf" mask="cpf" title="CPF" placeholder="000.000.000-00" />}
                chip='mask="cpf"'
                snippet={SNIPPETS.cpf}
            />
            <MaskCell
                input={<Input name="cnpj" mask="cnpj" title="CNPJ" placeholder="00.000.000/0000-00" />}
                chip='mask="cnpj"'
                snippet={SNIPPETS.cnpj}
            />
            <MaskCell
                input={<Input name="phone" mask="cellphone" title="Phone" placeholder="(00) 90000-0000" />}
                chip='mask="cellphone"'
                snippet={SNIPPETS.cellphone}
            />
            <MaskCell
                input={<Input name="date" mask="date" title="Date" placeholder="dd/MM/yyyy" />}
                chip='mask="date"'
                snippet={SNIPPETS.date}
            />
            <MaskCell
                input={
                    <Input
                        name="price"
                        mask="currency"
                        locale="pt-BR"
                        currency="BRL"
                        title="Price"
                        placeholder="R$ 0,00"
                    />
                }
                chip='mask="currency" locale="pt-BR" currency="BRL"'
                snippet={SNIPPETS.currency}
            />
            <MaskCell
                input={<Input name="card" mask="creditCard" title="Credit card" placeholder="0000 0000 0000 0000" />}
                chip='mask="creditCard"'
                snippet={SNIPPETS.creditCard}
            />
            <MaskCell
                input={
                    <Input name="uuid" mask="uuid" title="UUID" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                }
                chip='mask="uuid"'
                snippet={SNIPPETS.uuid}
            />
            <MaskCell
                input={<Input name="doc" mask={cpfOrCnpj} title="CPF or CNPJ" placeholder="000.000.000-00" />}
                chip="mask={fn} — auto-detects CPF / CNPJ"
                snippet={SNIPPETS.cpfCnpjFn}
            />
        </div>
    </section>
);
