import { BlogConfig } from "@/blog.config";
import React from "react";

export const Logomark = (props: React.ComponentPropsWithoutRef<"span">) => <span {...props}>{BlogConfig.name}</span>;

export const Logo = (props: React.ComponentPropsWithoutRef<"span">) => <span {...props}>{BlogConfig.name}</span>;
