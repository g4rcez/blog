// @markdoc/next.js generates `import yaml from "js-yaml"`, but js-yaml 5 has no default export.
import * as yaml from "js-yaml-esm";

export * from "js-yaml-esm";
export default yaml;
