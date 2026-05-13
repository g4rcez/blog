import { BlogConfig } from "@/blog.config";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: BlogConfig.name["en-US"],
        short_name: "Garcez",
        description:
            "Frontend engineering, TypeScript, React, Node.js, and developer tooling. Deep dives, patterns, and lessons from 25+ years building products.",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0a0a",
        theme_color: "#0a0a0a",
        icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
        lang: "en-US",
        scope: "/",
    };
}
