import clsx from "clsx";
import Link from "next/link";

const variantStyles = {
    primary:
        "rounded-full bg-primary-btn py-2 px-4 text-sm font-semibold text-primary-btn-text hover:bg-primary-btn-hover focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50",
    secondary:
        "rounded-full bg-secondary-btn py-2 px-4 text-sm font-semibold text-secondary-btn-text hover:bg-secondary-btn-hover focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50",
};

type ButtonProps = {
    variant?: keyof typeof variantStyles;
} & (React.ComponentPropsWithoutRef<typeof Link> | (React.ComponentPropsWithoutRef<"button"> & { href?: undefined }));

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
    className = clsx(variantStyles[variant], className);
    return typeof props.href === "undefined" ? (
        <button className={className} {...props} />
    ) : (
        <Link className={className} {...props} />
    );
}
