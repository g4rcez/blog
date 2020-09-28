import Linq from "linq-arrays";
import React from "react";
import { TextEditor } from "./text-editor";

const onMount = () => {
  (window as any).Linq = Linq;
};

const code = `const a = [1,1,1,1,1,2,3,4,5,6,7,8,9,10]
const result = Linq.Where(a, undefined, '!==', 1)
console.log(result)`;

const LinqView = () => <TextEditor onMount={onMount} code={code} />;

export default LinqView;
