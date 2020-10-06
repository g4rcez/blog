import marked from "marked";
import "./code.css";
import "./prism";

const heading = ["text-5xl", "text-3xl", "text-2xl", "text-lg"];

marked.setOptions({
  highlight: (code, language) => {
    try {
      const prism = (window as any).Prism;
      const lang = language in prism.languages ? language : "typescript";
      return prism.highlight(code, prism.languages[lang], language);
    } catch (error) {
      return code;
    }
  }
});

marked.use({
  gfm: true,
  xhtml: true,
  smartypants: true,
  smartLists: true,
  renderer: {
    listitem: (body: string) => `<li class='my-4 text-lg items-center text-left w-full'>${body}</li>`,
    paragraph: (text: string) =>
      `<p class="mb-4 whitespace-pre-line font-normal leading-relaxed break-words text-lg">${text}</p>`,
    heading(text: string, level: number) {
      const className = heading[level - 1] ?? "text-default";
      return `
            <h${level} class="${className} font-bold my-8">
              ${text}
            </h${level}>`;
    },
    image: (href: string, title: string) => `<img src="${href}" title="${title}" class="w-full inline-block" />`,
    link: (href: string, title: string, text: string) => `<a target="_blank" rel="noopener noreferrer" href="${href}" class="text-info hover:underline hover:text-info-light text-animate" title="${title ?? text}">${text}</a>`,
    blockquote: (body: string) =>
      `<blockquote class="p-2 ml-3 pl-3 border-l-4 py-4 border-info-light my-8 italic font-thin text-lg">${body}</blockquote>`,
    list: (body: string, order: boolean) =>
      `<${order ? "ol" : "ul"} class='list-inside my-8 ${order ? "list-decimal" : "list-disc"}'>${body}</$>`
  } as any
});

export const Markdown = marked;
