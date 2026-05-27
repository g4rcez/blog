"use client";

import { useEffect } from "react";

type ToolDefinition = {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (input: Record<string, unknown>) => Promise<unknown> | unknown;
};

type ModelContext = {
    registerTool?: (tool: ToolDefinition, options?: { signal?: AbortSignal }) => unknown;
    provideContext?: (context: { tools: ToolDefinition[] }, options?: { signal?: AbortSignal }) => unknown;
};

declare global {
    interface Navigator {
        modelContext?: ModelContext;
    }
}

const searchPosts = async (input: Record<string, unknown>) => {
    const query = typeof input.query === "string" ? input.query : "";
    const limit = typeof input.limit === "number" ? input.limit : 5;
    const { search } = await import("@/markdoc/search.mjs");
    return search(query, { limit }).map((result) => ({
        title: result.title,
        pageTitle: result.pageTitle,
        url: new URL(result.url, window.location.origin).toString(),
    }));
};

const readAgentSkill = async () => {
    const response = await fetch("/.well-known/agent-skills/product-ui-engineer/SKILL.md", {
        headers: { accept: "text/markdown" },
    });

    return { content: await response.text() };
};

const tools: ToolDefinition[] = [
    {
        name: "search_posts",
        description: "Search Garcez's Blog posts and pages.",
        inputSchema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Search query." },
                limit: { type: "number", minimum: 1, maximum: 20, default: 5 },
            },
            required: ["query"],
        },
        execute: searchPosts,
    },
    {
        name: "read_agent_skill",
        description: "Read the Product UI Engineer agent skill markdown.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
        },
        execute: readAgentSkill,
    },
];

export function WebMcp() {
    useEffect(() => {
        const modelContext = navigator.modelContext;
        if (!modelContext) return;

        const controller = new AbortController();

        if (typeof modelContext.registerTool === "function") {
            tools.forEach((tool) => modelContext.registerTool?.(tool, { signal: controller.signal }));
        } else if (typeof modelContext.provideContext === "function") {
            modelContext.provideContext({ tools }, { signal: controller.signal });
        }

        return () => controller.abort();
    }, []);

    return null;
}
