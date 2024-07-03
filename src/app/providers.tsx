"use client";
import { ThemeProvider } from "next-themes";
import React from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
    </ThemeProvider>
);
