const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");
const blogConfig = require("./src/config.json");

module.exports = {
  content: ["./src/**/*.{tsx,ts,html}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        main: { ...colors.indigo, ...blogConfig.colors.main, DEFAULT: blogConfig.colors.main.default },
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
