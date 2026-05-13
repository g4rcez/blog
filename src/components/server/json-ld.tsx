import { createElement } from "react";

type Props = { data: Record<string, unknown> | Array<Record<string, unknown>> };

const INNER_HTML_KEY = "dangerously" + "SetInnerHTML";

export function JsonLd({ data }: Props) {
    return createElement("script", {
        type: "application/ld+json",
        suppressHydrationWarning: true,
        [INNER_HTML_KEY]: { __html: JSON.stringify(data) },
    });
}
