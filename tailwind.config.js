const colors = require("./styles/dark.json");

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
  purge: ["./public/**/*.html", "./{pages,styles,components,lib}/**/*.{js,jsx,ts,tsx,vue}"],
  mode: "jit",
  darkMode: "class", // or 'media' or 'class'
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
  plugins: [],
};
