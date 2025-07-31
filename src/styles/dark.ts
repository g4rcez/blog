import { defaultDarkTheme } from "@g4rcez/components/themes";
import { type DesignTokens } from "@g4rcez/components";

export const darkColors: DesignTokens["colors"] = {
    ...defaultDarkTheme.colors,
    foreground: "hsla(222,10%,90%)",
    background: "hsla(221,40%,5%)",
    disabled: "hsla(213,10%,70%)",
    alert: {
        ...defaultDarkTheme.colors.alert,
        danger: {
            text: "hsla(0,82%,35%)",
            border: "hsla(0,32%,75%)",
            bg: "hsla(357,90%,96%)",
        },
        success: {
            bg: "hsla(156,22%,9%)",
            text: "hsla(162,30%,90%)",
            border: "hsla(162,50%,15%)",
        },
    },
    danger: {
        ...defaultDarkTheme.colors.danger,
        subtle: "hsla(0,69%,54%)",
        DEFAULT: "hsla(0,69%,72%)",
    },
    secondary: {
        ...defaultDarkTheme.colors.secondary,
        foreground: "hsla(225,10%,70%)",
    },
    floating: {
        ...defaultDarkTheme.colors.floating,
        background: "hsla(221,35%,8%)",
        border: "hsla(221,45%,10%)",
    },
    card: {
        ...defaultDarkTheme.colors.card,
        background: "hsla(221,35%,8%)",
        border: "hsla(221,45%,10%)",
    },
    info: {
        ...defaultDarkTheme.colors.info,
        DEFAULT: "hsla(199, 100%, 40%)",
    },
    tag: {
        ...defaultDarkTheme.colors.tag,
        success: { text: "hsla(128,100%,86%)", bg: "hsla(161,62%,17%)" },
        warn: { text: "hsla(0,0%,0%)", bg: "hsla(23,93%,66%)" },
        info: { bg: "hsla(203,38%,88%)", text: "hsla(202,40%,25%)" },
        muted: { bg: "hsla(203,40%,95%)", text: "hsla(202,35%,37%)" },
        danger: { bg: "hsla(12,100%,91%)", text: "hsla(8,80%,30%)" },
        primary: { bg: "hsla(208,100%,91%)", text: "hsla(208,32%,35%)" },
    },
    button: {
        ...defaultDarkTheme.colors.button,
        warn: { text: "hsla(23,100%,25%)", bg: "hsla(34,100%,86%)" },
        info: { bg: "hsla(203,38%,88%)", text: "hsla(202,35%,27%)" },
        danger: { bg: "hsla(12,100%,91%)", text: "hsla(10,82%,45%)" },
        muted: { text: "hsla(218,15%,95%)", bg: "hsla(211,19%,34%)" },
        primary: { bg: "hsla(202,100%,25%)", text: "hsla(255,100%,100%)" },
    },
    emphasis: {
        ...defaultDarkTheme.colors.emphasis,
        subtle: "hsla(44,100%,65%)",
        hover: "hsla(44,100%,50%)",
        DEFAULT: "hsla(39,70%,51%)",
    },
    primary: {
        ...defaultDarkTheme.colors.primary,
        subtle: "hsla(202,35%,37%)",
        hover: "hsla(202,35%,37%)",
        DEFAULT: "hsla(202,100%,33%)",
        foreground: "hsla(255,100%,100%)",
    },
    table: {
        background: "hsla(225,9%,11%)",
        header: "hsla(225,9%,13%)",
        border: "hsla(225,9%,16%)",
    },
    success: {
        DEFAULT: "hsla(160, 73%, 36%)",
        subtle: "hsla(160, 75%, 90%)",
        hover: "hsla(160, 91%, 27%)",
        foreground: "hsla(160, 91%, 90%)",
        notification: "hsla(160, 75%, 80%)",
    },
};
