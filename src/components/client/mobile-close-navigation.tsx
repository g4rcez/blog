"use client";
import { type Result } from "@/markdoc/search.mjs";
import { type AutocompleteApi } from "@algolia/autocomplete-core";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export type Autocomplete = AutocompleteApi<Result, React.SyntheticEvent, React.MouseEvent, React.KeyboardEvent>;

export const CloseOnNavigation = ({ close }: { close: () => void }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => {
        close();
    }, [pathname, searchParams, close]);
    return null;
};

export const CloseOnAutoCompleteNavigation = ({
    close,
    autocomplete,
}: {
    close: (autocomplete: Autocomplete) => void;
    autocomplete: Autocomplete;
}) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        close(autocomplete);
    }, [pathname, searchParams, close, autocomplete]);

    return null;
};
