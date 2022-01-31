const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{tsx,ts,html}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        main: { ...colors.indigo, DEFAULT: colors.indigo["500"], light: colors.indigo["200"], dark: colors.indigo["800"]},
      },
    },
    fontFamily: {
      sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    plugin(({ addVariant }) => {
      addVariant("link", ["&:hover", "&:focus"]);
    }),
  ],
};
