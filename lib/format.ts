export const Format = {
  date: (date: string) =>
    new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date)),
};
