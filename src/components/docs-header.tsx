"use client";
import { navigation } from "@/lib/navigation";
import { usePathname } from "next/navigation";

type Props = { title: string; description: string };

export function DocsHeader({ title, description }: Props) {
    const pathname = usePathname();
    const section = navigation.find((section) => section.links.find((link) => link.href === pathname));
    if (!title && !section) {
        return null;
    }
    return (
        <header className="mb-9 space-y-1">
            {section && <p className="font-display text-sm font-medium">{section.title}</p>}
            {title && <h1 className="font-display text-3xl tracking-tight text-foreground">{title}</h1>}
            {description && <p className="font-display text-secondary-foreground">{description}</p>}
        </header>
    );
}
