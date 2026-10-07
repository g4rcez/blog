import { Terminal } from "@/components/terminal";

export function Hero() {
    return (
        <section className="border-border w-full border-b" aria-labelledby="home-title">
            <div className="max-w-8xl mx-auto w-full px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
                <div className="terminal-arrive min-w-0">
                    <Terminal />
                </div>
            </div>
        </section>
    );
}
