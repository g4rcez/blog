export namespace Strings {
  export const onlyHex = (str: string) => str.replace(/[^a-f0-9]/g, "");

  export const fullTrim = (str: string) => str.replace(/ /g, "").trim();
}
