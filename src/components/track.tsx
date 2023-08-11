"use client";
import * as amplitude from "@amplitude/analytics-browser";
import { Fragment, useEffect } from "react";

export const Track = ({ event, title }: { event: string; title?: string }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    amplitude.track("posts", title ? { title } : undefined);
  }, [event, title]);
  return <Fragment />;
};
