import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import { codeToHtml } from "shiki";
import light from "shiki/themes/light-plus.mjs";
import dark from "shiki/themes/dark-plus.mjs";

export const highlight = async (code: string, lang: string) => {
    return codeToHtml(code, {
        lang,
        themes: { light, dark },
        transformers: [
            transformerTwoslash({
                throws: false,
                twoslashOptions: {},
                explicitTrigger: false,
                renderer: rendererRich(),
            }),
        ],
    });
}
