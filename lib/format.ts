export const Format = {
  date: (date: string) =>
    new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date)),
};
