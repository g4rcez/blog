const { POSTS } = require("./defaults");
const path = require("path");
const fs = require("fs");
const { Linq } = require("linq-arrays");

const isBool = (x) => x === "true" || x === "false";

const isDatePattern = (x) => /\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z/i.test(x);

const parseValue = (x) => {
  if (isBool(x)) {
    return JSON.parse(x);
  }
  if (isDatePattern(x)) {
    const removeTicks = x.replace(/"/g, "");
    return new Date(removeTicks);
  }
  return JSON.parse(x);
};

const readingTime = (text = "") => Math.ceil(text.split(" ").length / 250);
const exec = async (name) => {
  const post = path.join(POSTS, name, "index.md");

  const file = fs.readFileSync(post, "utf-8");
  const lines = file.split("\n");
  const headers = [];
  lines.forEach((line, i) => {
    if (line.startsWith("---") && headers.length < 2) {
      headers.push(i);
    }
  });
  const [first, second] = headers;
  const aroundLines = Linq.Range(first + 1, second - 1);

  const output = {
    headerInit: first,
    headerEnd: second,
    readingTime: readingTime(file)
  };

  aroundLines.forEach((x) => {
    const line = lines[x];
    const [key] = [...line.match(/([a-z]+: )/i)];
    const [, value] = [...line.match(/[a-z]+: (.*$)/i)];
    const fixKey = key.replace(/^'/, "").replace(/'$/, "").replace(/:/, "").trim();
    output[fixKey] = parseValue(value);
  });
  return output;
};

module.exports = exec;
