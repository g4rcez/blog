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
  slug: (str: string = "") => {
    str = str.replace(/^\s+|\s+$/g, "");
    str = str.toLowerCase();

    var from = "ãàáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    return str
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  },
};

export const toPost = (slug: string) => `/post/${slug}`;
