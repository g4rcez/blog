/** @type {import('prettier').Options} */
module.exports = {
  singleQuote: false,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  semi: true,
  arrowParens: 'always',
  printWidth: 120,
  tabWidth: 4,
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
}
