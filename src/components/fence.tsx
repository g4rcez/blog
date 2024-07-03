import { highlight } from "@/lib/shiki";
import { PropsWithChildren } from "react";

export const Fence = async (props: PropsWithChildren<{ language: string }>) => {
    const code = (props.children as string) || "";
    if (!code) return null;
    const html = await highlight(code, props.language);
    return (
        <div className="prose-pre:overflow-x-clip hover:prose-pre:overflow-x-auto">
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
};
