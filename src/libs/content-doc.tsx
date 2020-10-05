import React, { Fragment } from "react";
import { Button } from "../components/button/button";
import { Paragraph, SubTitle } from "../components/typography";
import { Markdown } from "../lib/markdown";

export type ContentDocProps = {
  id: string;
  method: string;
  input: string;
  output: string;
  desc: string;
  code?: string;
};

const writeCode = (str: string) => "```\n" + str + "\n```";

type Props = {
  docs: ContentDocProps[];
  onClick: (c: string | undefined) => void;
};
export const ContentDoc = ({ docs, onClick }: Props) => {
  return (
    <Fragment>
      {docs.map((doc) => {
        const subTitleClassName = doc.code ? "font-extrabold hover:underline hover:text-info-light" : "font-extrabold";
        return (
          <div key={doc.id} className="flex-wrap w-full my-6 border-b border-base-light">
            <SubTitle id={doc.id} className={subTitleClassName}>
              {doc.method}
              {doc.code && <Button onClick={() => onClick(doc.code)}>View Demo</Button>}
            </SubTitle>
            <SubTitle tag="h4" size="text-default" className="my-2 mt-4">
              Signature
            </SubTitle>
            <div dangerouslySetInnerHTML={{ __html: Markdown(writeCode(`(${doc.input}) => ${doc.output}`)) }} />
            <Paragraph className="text-default">{doc.desc}</Paragraph>
          </div>
        );
      })}
    </Fragment>
  );
};
