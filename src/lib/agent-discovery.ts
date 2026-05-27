import { BlogConfig } from "@/blog.config";
import { SITE_URL } from "@/lib/seo";
import { createHash } from "node:crypto";

export const productUiEngineerSkill = [
    "# Product UI Engineer",
    "",
    "A product-minded UI engineering agent that enforces attention to detail on every frontend task.",
    "Use it when implementing new pages or features, reviewing components, or working with designs.",
    "It produces a structured UI Review Checklist before writing code.",
    "",
    "## Canonical source",
    "",
    `- Page: ${SITE_URL}/agents/product-ui-engineer`,
    `- Raw markdown: ${SITE_URL}/agents/product-ui-engineer/raw`,
    "",
].join("\n");

export const productUiEngineerSkillDigest = `sha256:${createHash("sha256")
    .update(productUiEngineerSkill)
    .digest("hex")}`;

export const jsonHeaders = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
};

export const siteName = BlogConfig.name["en-US"];
