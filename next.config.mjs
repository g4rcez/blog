import withMarkdoc from "@markdoc/next.js";
import withSearch from "./src/markdoc/search.mjs";
import * as path from "path-browserify";

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    serverExternalPackages: ["shiki", "vscode-oniguruma", "@shikijs/twoslash", "just-bash"],
    transpilePackages: ["@wterm/dom", "@wterm/react", "@wterm/just-bash"],
    webpack(config, { isServer, webpack }) {
        if (!isServer) {
            // just-bash's browser bundle statically imports Node's zlib for gzip commands.
            config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^node:zlib$/, "browserify-zlib"));
        }
        return config;
    },
};

export default withSearch(
    withMarkdoc({
        schemaPath: "./src/markdoc",
        mode: "static",
        nextjsExports: [],
        options: { slots: true, allowComments: true },
    })(nextConfig),
);
