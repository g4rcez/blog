import { Callout } from "@/components/callout";
import { QuickLink, QuickLinks } from "@/components/quick-links";
import { Terminal } from "@/components/terminal";
import { comment, link, script } from "@markdoc/next.js/tags";

const Img = {
    selfClosing: true,
    attributes: {
        src: { type: String },
        alt: { type: String },
        caption: { type: String },
    },
    render: ({ src = "", alt = "", caption }) => (
        <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src.replace(/^\/public/g, "")} alt={alt} />
            <figcaption>{caption}</figcaption>
        </figure>
    ),
};

const tags = {
    img: Img,
    figure: Img,
    comment,
    link,
    script,
    terminal: { render: Terminal },
    "quick-links": { render: QuickLinks },
    "quick-link": {
        selfClosing: true,
        render: QuickLink,
        attributes: { title: { type: String }, description: { type: String }, href: { type: String } },
    },
    callout: {
        attributes: {
            title: { type: String },
            type: {
                type: String,
                default: "note",
                errorLevel: "critical",
                matches: ["note", "warning"],
            },
        },
        render: Callout,
    },
};

export default tags;
