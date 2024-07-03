import { Header, HeroBanner } from "@/components/hero-banner";
import { Navigation } from "@/components/navigation";
import React, { Suspense } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full flex-col">
            <Suspense fallback={null}>
                <Header />
            </Suspense>
            <HeroBanner />
            <div className="container relative mx-auto flex w-full flex-auto justify-center sm:px-2 lg:px-8 xl:px-8">
                <div className="hidden lg:relative lg:block lg:flex-none">
                    <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
                    <div className="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
                    <div className="absolute bottom-0 right-0 top-28 hidden w-px bg-slate-800 dark:block" />
                    <div className="sticky top-[4.75rem] -ml-0.5 h-[calc(100vh-4.75rem)] w-56 overflow-y-auto overflow-x-hidden py-16 pl-0.5 pr-8 xl:w-56 xl:pr-16">
                        <Navigation />
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}
