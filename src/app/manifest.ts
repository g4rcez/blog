import { BlogConfig } from "@/blog.config";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: BlogConfig.name["en-US"],
        short_name: "Garcez",
        description:
            "Frontend engineering, TypeScript, React, Node.js, and developer tooling. Deep dives, patterns, and lessons from 10+ years building products.",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0a0a",
        theme_color: "#0a0a0a",
        icons: [
            { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
            { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        lang: "en-US",
        scope: "/",
    };
}
