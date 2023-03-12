export const Format = {
  date: (date: string | Date) => {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date ?? new Date()));
  },
  slug: (str: string = "") => {
    str = str.replace(/^\s+|\s+$/g, "").toLowerCase();
    let from = "ãàáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    let to = "aaaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }
    return str
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  },
  readingTime: (content: string) => Math.ceil(content.split(" ").length / 250),
  toPost: (slug: string) => `/post/${slug}`,
};
