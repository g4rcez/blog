const plugin = require("tailwindcss/plugin");
const colors = require("./src/styles/dark.json");

const getColors = (JSON_COLOR = {}) => {
  const colors = {};
  Object.entries(JSON_COLOR).forEach(([key, value]) => {
    if (typeof value === "string") {
      colors[key] = `var(--${key})`;
    } else if (typeof value === "object") {
      colors[key] = {};
      Object.entries(value).forEach(([secKey]) => {
        colors[key][secKey] = `var(--${key}-${secKey})`;
      });
    }
  });
  return colors;
};

module.exports = {
  darkMode: "class", // or 'media' or 'class'
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: getColors(colors),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addVariant }) => {
      addVariant("link", ["&:hover", "&:focus"]);
    }),
  ],
};
