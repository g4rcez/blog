const withPreact = require("next-plugin-preact");

module.exports = withPreact({
  pageExtensions: ["mdx", "ts", "tsx"],
  poweredByHeader: false,
  reactStrictMode: true,
  webpack5: true,
  future: {
    strictPostcssConfiguration: true,
  },
});
