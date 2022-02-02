export namespace Strings {
  export const toTitle = (str: string) => str.replace(/((^|[ _-])([a-z]{1}))/g, (_, char) => char.toUpperCase());

  export const random = () => Math.random().toString(36).substring(2);

  const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";

  const to = "aaaaaeeeeeiiiiooooouuuunc--------";

  export const slugify = (text: string = "") => {
    return text
      .toLowerCase()
      .split("")
      .map((letter, i) => letter.replace(new RegExp(from.charAt(i), "g"), to.charAt(i)))
      .toString()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  export const formatDate = (date: Date) =>
    date.toLocaleTimeString(undefined, {
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      hour12: false,
      second: "numeric",
      month: "long",
      year: "numeric",
      minute: "numeric",
    });
}
