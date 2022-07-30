export enum Themes {
  Light = "light",
  Dark = "dark",
  Null = "",
}

export const validateTheme = (something: any): something is Themes =>
  something === Themes.Dark || something === Themes.Light;
