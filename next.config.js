const withPreact = require("next-plugin-preact");

module.exports = withPreact({
  pageExtensions: ["mdx", "ts", "tsx"],
  poweredByHeader: false,
  reactStrictMode: true,
  future: {
    webpack5: true,
    strictPostcssConfiguration: true,
  },
});
