const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{tsx,ts,html}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addVariant }) => {
      addVariant("link", ["&:hover", "&:focus"]);
    }),
  ],
};
