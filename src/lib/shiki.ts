import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import { codeToHtml } from "shiki/bundle/web";
import light from "shiki/themes/catppuccin-latte.mjs";
import dark from "shiki/themes/catppuccin-mocha.mjs";

export const highlight = async (code: string, lang: string) => {
    const html = await codeToHtml(code, {
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
    return html;
};
