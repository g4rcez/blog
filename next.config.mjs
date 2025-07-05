import withMarkdoc from "@markdoc/next.js";
import withSearch from "./src/markdoc/search.mjs";
import * as path from "path-browserify";

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    serverExternalPackages: ["shiki", "vscode-oniguruma", "@shikijs/twoslash"],
};

export default withSearch(
    withMarkdoc({
        schemaPath: "./src/markdoc",
        mode: "static",
        options: { slots: true, allowComments: true },
    })(nextConfig),
);
