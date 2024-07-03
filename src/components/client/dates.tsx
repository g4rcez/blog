"use client";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";

export const Dates = (props: PropsWithChildren<{ date: string }>) => {
    const [state, setState] = useState<string | null>(null);

    useEffect(() => {
        const date = new Date(props.date);
        if (date) {
            setState(
                date.toLocaleString(window.navigator.language, {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }),
            );
        }
    }, []);

    return <Fragment>{state}</Fragment>;
};
