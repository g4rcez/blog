import React, { useEffect, useState } from "react";

const params = {
  url: "https://utteranc.es/client.js",
  theme: "preferred-color-scheme",
  issueTerm: "url",
  label: "comment",
  repo: "g4rcez/blog",
};

export const useComment = (
  ref: React.MutableRefObject<HTMLDivElement | null>
) => {
  const [status, setStatus] = useState(params.url ? "loading" : "idle");

  useEffect(() => {
    const element = ref.current;
    const existUtterences = document.querySelector("div.utterances") ?? null;
    if (existUtterences !== null) return;
    if (element === null) return;
    if (!params.url) {
      setStatus("idle");
      return;
    }

    const script = document.createElement("script");
    script.src = params.url;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("theme", params.theme);
    script.setAttribute("issue-term", params.issueTerm);
    script.setAttribute("repo", params.repo);
    element.appendChild(script);
    const setAttributeStatus = (event: any) =>
      void setStatus(event.type === "load" ? "ready" : "error");

    script.addEventListener("load", setAttributeStatus);
    script.addEventListener("error", setAttributeStatus);

    return () => {
      if (element) {
        element.removeChild(script);
      }
      if (script) {
        script.removeEventListener("load", setAttributeStatus);
        script.removeEventListener("error", setAttributeStatus);
      }
    };
  }, []);

  return status;
};
