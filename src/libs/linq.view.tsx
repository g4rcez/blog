import Linq from "linq-arrays";
import React, { useCallback, useMemo, useState } from "react";
import { Container } from "../components/container";
import { SubTitle } from "../components/typography";
import { ContentDoc, ContentDocProps } from "./content-doc";
import { TextEditor } from "./text-editor";

const onMount = () => ((window as any).Linq = Linq);

const slug = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, "");
  str = str.toLowerCase();
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }
  return str
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const LinqView = () => {
  const [code, setCode] = useState(
    () => `const a = [1,1,1,1,1,2,3,4,5,6,7,8,9,10]
  const result = Linq.Where(a, undefined, '!==', 1)
  console.log(result)`
  );

  const onChangeCode = useCallback((c: string | undefined) => {
    if (c) {
      setCode(c);
      window.scrollTo({ behavior: "auto", top: 0 });
    }
  }, []);

  const methods: ContentDocProps[] = useMemo(
    () =>
      [
        {
          method: "All",
          input: "item: T, index: number, array: T[]",
          output: "boolean",
          desc: "Similar to .every in Array.prototype.every"
        },
        {
          method: "Random",
          input: "array: T[]",
          output: "T",
          desc: "Return a random item from list"
        },
        {
          method: "Reverse",
          input: "array: T[]",
          output: "T[]",
          desc: "Return the same array in reverse order"
        },
        {
          method: "Clone",
          input: "array: T[]",
          output: "T[]",
          desc: "Deep clone array",
          code: `const a = [{a:1},{a:2},{a:3},{a:4},{a:5},{a:6}];
const b = Linq.Clone(a);
console.log(a === b)
a[0].a = 9
console.log(a[0].a, b[0].a)
console.log(a[0].a  === b[0].a)
        `
        },
        {
          method: "Where (with symbols and object array)",
          input: `array: T[], args: keyof T, symbol: "==" | "===" | ">" | ">=" | "<" | "<=" | "eq" | "like" | "is" | "!==" | "!=", v: any`,
          output: "T[]",
          desc: "Filter array with symbols, using key as index to get values in objects"
        },
        {
          method: "Where (with symbols and primitive array)",
          input: `array: T[], args: undefined, symbol: "==" | "===" | ">" | ">=" | "<" | "<=" | "eq" | "like" | "is" | "!==" | "!=", v: any`,
          output: "T[]",
          desc: "Filter array with primitive types",
          code: "console.log(Linq.Where([1,2,3,4,5,6], undefined, '>', 2))"
        },
        {
          method: "Where (as function)",
          input: `array: T[], (item: T, index: number, array: T[]) => boolean`,
          output: "T[]",
          desc: "The same of Array.prototype.filter"
        },
        {
          method: "First",
          input: `array: T[]`,
          output: "T[] | undefined",
          desc: "Return the first element of array"
        },
        {
          method: "Last",
          input: `array: T[]`,
          output: "T[] | undefined",
          desc: "Return the last element of array"
        },
        {
          method: "Min (primitive array)",
          input: `array: T[]`,
          output: "number",
          desc: "Return the minimum value in array"
        },
        {
          method: "Min (object array)",
          input: `array: T[], keyof T`,
          output: "number",
          desc: "Return the minimum value in array (get values from objects)"
        },
        {
          method: "Max (primitive array)",
          input: `array: T[]`,
          output: "number",
          desc: "Return the maximum value in array"
        },
        {
          method: "Max (object array)",
          input: `array: T[], keyof T`,
          output: "number",
          desc: "Return the maximum value in array (get values from objects)"
        },
        {
          method: "Repeat",
          input: `element: T | () => T, X: number`,
          output: "number",
          desc: "Repeat element X times",
          code: "console.log(Linq.Repeat('Repeat String', 10))"
        }
      ].map((x) => ({ ...x, id: slug(x.method) })),
    []
  );

  return (
    <TextEditor onMount={onMount} code={code}>
      <Container className="my-8">
        <SubTitle>
          Linq - <small>Inspired by C# Linq</small>
        </SubTitle>
        <Container className="my-4">
          <span className="text-lg font-bold w-full">Install</span>
          <div className="mt-4 bg-base-light p-2 w-full">
            <div className="w-full">npm install linq-arrays</div>
            <div className="text-base-dark w-full"># or</div>
            <div className="w-full">yarn add linq-arrays</div>
          </div>
        </Container>
        <Container className="my-8">
          <span className="text-lg font-bold w-full">Static methods</span>
          <ContentDoc onClick={onChangeCode} docs={methods} />
        </Container>
      </Container>
    </TextEditor>
  );
};

export default LinqView;
