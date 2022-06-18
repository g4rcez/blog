import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import { defaultKeymap } from "@codemirror/commands";
import { commentKeymap } from "@codemirror/comment";
import { foldGutter, foldKeymap } from "@codemirror/fold";
import { defaultHighlightStyle } from "@codemirror/highlight";
import { history, historyKeymap } from "@codemirror/history";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import {
  indentOnInput,
  LanguageDescription,
  LanguageSupport,
} from "@codemirror/language";
import { lintKeymap } from "@codemirror/lint";
import { bracketMatching } from "@codemirror/matchbrackets";
import { searchKeymap } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  highlightSpecialChars,
  keymap,
} from "@codemirror/view";
import { useEffect, useRef } from "react";
import { Container } from "~/components/container";

const markdownSupport = markdown({
  codeLanguages: [
    LanguageDescription.of({
      name: "ts",
      alias: ["ts", "tsx"],
      async load() {
        const lang = await import("@codemirror/lang-javascript");
        return new LanguageSupport(lang.typescriptLanguage);
      },
    }),
    LanguageDescription.of({
      name: "sql",
      alias: ["sql"],
      async load() {
        const sql = await import("@codemirror/lang-sql");
        return new LanguageSupport(sql.StandardSQL.language);
      },
    }),
    LanguageDescription.of({
      name: "javascript",
      alias: ["js", "jsx"],
      async load() {
        const { javascriptLanguage } = await import(
          "@codemirror/lang-javascript"
        );
        return new LanguageSupport(javascriptLanguage);
      },
    }),
    LanguageDescription.of({
      name: "css",
      async load() {
        const { cssLanguage } = await import("@codemirror/lang-css");
        return new LanguageSupport(cssLanguage);
      },
    }),
    LanguageDescription.of({
      name: "json",
      async load() {
        const { jsonLanguage } = await import("@codemirror/lang-json");
        return new LanguageSupport(jsonLanguage);
      },
    }),
    LanguageDescription.of({
      name: "html",
      alias: ["htm"],
      async load() {
        const { jsxLanguage } = await import("@codemirror/lang-javascript");
        const javascript = new LanguageSupport(jsxLanguage);
        const { cssLanguage } = await import("@codemirror/lang-css");
        const css = new LanguageSupport(cssLanguage);
        const { htmlLanguage } = await import("@codemirror/lang-html");
        return new LanguageSupport(htmlLanguage, [css, javascript]);
      },
    }),
  ],
});

type Props = Partial<{
  text: string;
}>;

export const Textarea: React.VFC<Props> = ({ text }) => {
  const view = useRef<EditorView | null>(null);
  const parent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parent.current === null) return;
    const editorCreated = EditorState.create({
      doc: text ?? "# Hello World",
      extensions: [
        history(),
        foldGutter(),
        drawSelection(),
        markdownSupport,
        closeBrackets(),
        indentOnInput(),
        autocompletion(),
        markdownLanguage,
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...commentKeymap,
          ...completionKeymap,
          ...lintKeymap,
        ]),
        bracketMatching(),
        // cm-activeLine
        // highlightActiveLine(),
        defaultHighlightStyle,
        highlightSpecialChars(),
        keymap.of(defaultKeymap),
        EditorState.tabSize.of(4),
      ],
    });
    const editor = new EditorView({
      state: editorCreated,
      parent: parent.current,
    });
    view.current = editor;
  }, [text]);

  return (
    <Container className="w-full border border-slate-200 rounded">
      <div ref={parent} />
    </Container>
  );
};
