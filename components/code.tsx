import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useDarkMode } from "./use-dark-mode";

type Props = {
  language: string;
};

const commonStyle = {
  code: {
    fontFamily: "'Fira Code', monospace",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
  },
  language: {
    fontFamily: "'Fira Code', monospace",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
    padding: "1em",
    margin: ".5em 0",
    overflow: "auto",
    borderRadius: "0.3em",
  },
};

const darkTheme = {
  'code[class*="language-"]': {
    color: "#f8f8f2",
    background: "none",
    textShadow: "0 1px rgba(0, 0, 0, 0.3)",
    ...commonStyle.code,
  },
  'pre[class*="language-"]': {
    color: "#f8f8f2",
    background: "#282a36",
    textShadow: "0 1px rgba(0, 0, 0, 0.3)",
    ...commonStyle.language,
  },
  ':not(pre) > code[class*="language-"]': {
    background: "#282a36",
    padding: ".1em",
    borderRadius: ".3em",
    whiteSpace: "normal",
  },
  comment: {
    color: "#6272a4",
  },
  prolog: {
    color: "#6272a4",
  },
  doctype: {
    color: "#6272a4",
  },
  cdata: {
    color: "#6272a4",
  },
  punctuation: {
    color: "#f8f8f2",
  },
  ".namespace": {
    Opacity: ".7",
  },
  property: {
    color: "#ff79c6",
  },
  tag: {
    color: "#ff79c6",
  },
  constant: {
    color: "#ff79c6",
  },
  symbol: {
    color: "#ff79c6",
  },
  deleted: {
    color: "#ff79c6",
  },
  boolean: {
    color: "#bd93f9",
  },
  number: {
    color: "#bd93f9",
  },
  selector: {
    color: "#50fa7b",
  },
  "attr-name": {
    color: "#50fa7b",
  },
  string: {
    color: "#50fa7b",
  },
  char: {
    color: "#50fa7b",
  },
  builtin: {
    color: "#50fa7b",
  },
  inserted: {
    color: "#50fa7b",
  },
  operator: {
    color: "#f8f8f2",
  },
  entity: {
    color: "#f8f8f2",
    cursor: "help",
  },
  url: {
    color: "#f8f8f2",
  },
  ".language-css .token.string": {
    color: "#f8f8f2",
  },
  ".style .token.string": {
    color: "#f8f8f2",
  },
  variable: {
    color: "#f8f8f2",
  },
  atrule: {
    color: "#f1fa8c",
  },
  "attr-value": {
    color: "#f1fa8c",
  },
  function: {
    color: "#f1fa8c",
  },
  "class-name": {
    color: "#f1fa8c",
  },
  keyword: {
    color: "#8be9fd",
  },
  regex: {
    color: "#ffb86c",
  },
  important: {
    color: "#ffb86c",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
};

const lightTheme = {
  'code[class*="language-"]': {
    color: "#393A34",
    background: "none",
    ...commonStyle.code,
  },
  'pre[class*="language-"]': {
    color: "#393A34",
    background: "#f8f8f2",
    ...commonStyle.language,
  },
  'pre > code[class*="language-"]': {
    fontSize: "1em",
  },
  'pre[class*="language-"]::-moz-selection': {
    background: "#C1DEF1",
  },
  'pre[class*="language-"] ::-moz-selection': {
    background: "#C1DEF1",
  },
  'code[class*="language-"]::-moz-selection': {
    background: "#C1DEF1",
  },
  'code[class*="language-"] ::-moz-selection': {
    background: "#C1DEF1",
  },
  'pre[class*="language-"]::selection': {
    background: "#C1DEF1",
  },
  'pre[class*="language-"] ::selection': {
    background: "#C1DEF1",
  },
  'code[class*="language-"]::selection': {
    background: "#C1DEF1",
  },
  'code[class*="language-"] ::selection': {
    background: "#C1DEF1",
  },
  ':not(pre) > code[class*="language-"]': {
    padding: ".2em",
    paddingTop: "1px",
    paddingBottom: "1px",
    background: "#f8f8f8",
    border: "1px solid #dddddd",
  },
  comment: {
    color: "#008000",
    fontStyle: "italic",
  },
  prolog: {
    color: "#008000",
    fontStyle: "italic",
  },
  doctype: {
    color: "#008000",
    fontStyle: "italic",
  },
  cdata: {
    color: "#008000",
  },
  namespace: {
    Opacity: ".7",
  },
  string: {
    color: "#A31515",
  },
  punctuation: {
    color: "#393A34",
  },
  operator: {
    color: "#393A34",
  },
  url: {
    color: "#36acaa",
  },
  symbol: {
    color: "#36acaa",
  },
  number: {
    color: "#36acaa",
  },
  boolean: {
    color: "#36acaa",
  },
  variable: {
    color: "#36acaa",
  },
  constant: {
    color: "#36acaa",
  },
  inserted: {
    color: "#36acaa",
  },
  atrule: {
    color: "#0000ff",
  },
  keyword: {
    color: "#0000ff",
  },
  "attr-value": {
    color: "#0000ff",
  },
  ".language-autohotkey .token.selector": {
    color: "#0000ff",
  },
  ".language-json .token.boolean": {
    color: "#0000ff",
  },
  ".language-json .token.number": {
    color: "#0000ff",
  },
  'code[class*="language-css"]': {
    color: "#0000ff",
  },
  function: {
    color: "#393A34",
  },
  deleted: {
    color: "#9a050f",
  },
  ".language-autohotkey .token.tag": {
    color: "#9a050f",
  },
  selector: {
    color: "#800000",
  },
  ".language-autohotkey .token.keyword": {
    color: "#00009f",
  },
  important: {
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "normal",
  },
  "class-name": {
    color: "#2B91AF",
  },
  ".language-json .token.property": {
    color: "#2B91AF",
  },
  tag: {
    color: "#800000",
  },
  "attr-name": {
    color: "#ff0000",
  },
  property: {
    color: "#ff0000",
  },
  regex: {
    color: "#ff0000",
  },
  entity: {
    color: "#ff0000",
  },
  "directive.tag.tag": {
    background: "#ffff00",
    color: "#393A34",
  },
  ".line-numbers .line-numbers-rows": {
    borderRightColor: "#a5a5a5",
  },
  ".line-numbers-rows > span:before": {
    color: "#2B91AF",
  },
  ".line-highlight": {
    background:
      "linear-gradient(to right, rgba(193, 222, 241, 0.2) 70%, rgba(221, 222, 241, 0))",
  },
};

export const Code: React.FC<Props> = ({ children, language = "tsx" }) => {
  const { theme } = useDarkMode();
  return (
    <SyntaxHighlighter
      showLineNumbers
      useInlineStyles
      style={theme.name === "dark" ? darkTheme : lightTheme}
      language={language}
    >
      {children}
    </SyntaxHighlighter>
  );
};
