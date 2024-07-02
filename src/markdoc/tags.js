import { Callout } from "@/components/callout";
import { ListPosts } from "@/components/server/list-posts";
import { QuickLink, QuickLinks } from "@/components/quick-links";

const tags = {
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
    figure: {
        selfClosing: true,
        attributes: {
            src: { type: String },
            alt: { type: String },
            caption: { type: String },
        },
        render: ({ src, alt = "", caption }) => (
            <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} />
                <figcaption>{caption}</figcaption>
            </figure>
        ),
    },
    posts: { selfClosing: true, render: ListPosts },
    "quick-links": {
        render: QuickLinks,
    },
    "quick-link": {
        selfClosing: true,
        render: QuickLink,
        attributes: {
            title: { type: String },
            description: { type: String },
            href: { type: String },
        },
    },
};

export default tags;
