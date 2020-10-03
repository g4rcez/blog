import React, { Fragment } from "react";
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
      <div className="w-full flex flex-row flex-wrap justify-between my-4 text-default">
        {docs
          .filter((x) => !!x.code)
          .map((x) => (
            <a key={`anchor-${x.id}`} href={`#${x.id}`} className="text-info-light hover:text-info hover:underline">
              {x.method}
            </a>
          ))}
      </div>
      {docs.map((x) => (
        <div key={x.id} className="flex-wrap w-full my-6 border-b border-base-light">
          <SubTitle
            id={x.id}
            role={x.code ? "button" : undefined}
            onClick={() => onClick(x.code)}
            className={x.code ? "font-extrabold hover:underline hover:text-info-light" : "font-extrabold"}
          >
            {x.method}
          </SubTitle>
          <SubTitle tag="h4" size="text-default" className="my-2 mt-4">
            Signature
          </SubTitle>
          <div dangerouslySetInnerHTML={{ __html: Markdown(writeCode(`(${x.input}) => ${x.output}`)) }} />
          <Paragraph className="text-default">{x.desc}</Paragraph>
        </div>
      ))}
    </Fragment>
  );
};
