const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.html", "./src/**/*.js", "./src/**/*.jsx", "./src/**/*.ts", "./src/**/*.tsx"],
  defaultExtractor: (content) => {
    const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
    const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
    const somethingClassName = content.match(/[ClassName ?= ?"'`\s.()]*[^"'`\s.():]/g) || [];
    return [...broadMatches, ...innerMatches, ...somethingClassName];
  }
});

const plugins = [require("postcss-import"), require("tailwindcss")];
if (process.env.NODE_ENV === "production") {
  plugins.push(purgecss);
}

module.exports = { plugins };
