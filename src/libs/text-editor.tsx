import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/hint/anyword-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/keymap/sublime";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml.js";
import "codemirror/theme/dracula.css";
import "codemirror/theme/neat.css";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { Body } from "../components/body";
import { Button } from "../components/button/button";

type Template = { title: string; code: string };

type Props = {
  code: string;
  onMount: () => void;
  templates?: Template[];
  children?: React.ReactNode;
};
export const TextEditor = ({ onMount, ...props }: Props) => {
  const [code, setCode] = useState(() => props.code || "");
  const [clearEachExec, setClearEachExec] = useState(true);
  const codeMirror = useRef<any>(null);

  useEffect(() => {
    onMount();
  }, [onMount]);

  useEffect(() => {
    setCode(props.code);
  }, [props.code]);

  useLayoutEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === " ") {
        codeMirror.current.showHint();
      } else if (e.key === "Escape") {
        codeMirror.current.closeHint();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const exec = () => {
    if (clearEachExec) {
      console.clear();
    }
    try {
      eval(code);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Body className="w-full flex-col">
      {props.templates && (
        <div className="w-full">
          {props.templates.map((x) => (
            <Button className="ml-2" onClick={() => setCode(x.code)}>
              {x.title}
            </Button>
          ))}
        </div>
      )}
      <div className="w-full my-4">
        <label htmlFor="checkbox" className="cursor-pointer">
          <input
            id="checkbox"
            type="checkbox"
            checked={clearEachExec}
            onChange={(e) => setClearEachExec(e.target.checked)}
          />
          <span className="ml-2">Clear console on Run</span>
        </label>
      </div>
      <div className="w-full h-full justify-between flex flex-col">
        <CodeMirror
          autoScroll
          autoCursor
          editorDidMount={(e) => (codeMirror.current = e)}
          value={code}
          options={{ lineNumbers: true, theme: "dracula" }}
          onBeforeChange={(_, __, value) => setCode(value)}
        />
      </div>
      <div className="text-right mt-4">
        <Button onClick={exec}>Run</Button>
      </div>
      {props.children}
    </Body>
  );
};
