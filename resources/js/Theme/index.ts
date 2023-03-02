import Color from "color";
const alpha = (clr: string, val: number) =>
  Color(clr).alpha(val).rgb().string();
const lighten = (clr: string, val: number) =>
  Color(clr).lighten(val).rgb().string();
const darken = (clr: string, val: number) =>
  Color(clr).darken(val).rgb().string();
const saturate = (clr: string, val: number) =>
  Color(clr)
    .desaturate(1 - val)
    .rgb()
    .string();

const purple = "#5952c1";
const green = "#29b49c";
const yellow = "#f8c444";
const pink = "#f59ab5";
const blue = "#2663D6";
const red = "#f05478";
const dark = "#4b3e63";
const light = "#fcfcfc";
const white = "#fff";
const background = "#f4f4f4";
const lightGrey = "#d0d0d0";

const themeColors = {
  purple,
  green,
  yellow,
  pink,
  blue,
  red,
  dark,
  light,
  white,
  lightGrey,
  background,
};
const colorSets = {
  set1: {
    pri: purple,
    sec: yellow,
    ter: red,
  },
  set2: {
    pri: green,
    sec: yellow,
    ter: purple,
  },
  set3: {
    pri: pink,
    sec: red,
    ter: purple,
  },
  set4: {
    pri: red,
    sec: yellow,
    ter: purple,
  },
};
const colors: typeof colorSets & { [k: string]: string } = colorSets as any;
Object.entries(themeColors).forEach(([name, value]) => {
  colors[name] = value;
  for (const i of [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90]) {
    colors[`${name}L${i}`] = lighten(value, i / 100);
    colors[`${name}D${i}`] = darken(value, i / 100);
    colors[`${name}A${i}`] = alpha(value, i / 100);
    colors[`${name}S${i}`] = saturate(value, i / 100);
  }
  colors[`${name}Border`] = lighten(value, 0.5);
});
const theme = {
  colors,
  fonts: {
    sans: [
      "Montserrat",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "'Helvetica Neue'",
      "Arial",
      "sans-serif",
    ].join(", "),
    controlBold: [
      "'Gilroy-Bold'",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "'BlinkMacSystemFont'",
      "'Segoe UI'",
      "Roboto",
      "'Helvetica Neue'",
      "Arial",
      "sans-serif",
    ].join(", "),
    controlMedium: [
      "'Gilroy-Medium'",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "'BlinkMacSystemFont'",
      "'Segoe UI'",
      "Roboto",
      "'Helvetica Neue'",
      "Arial",
      "sans-serif",
    ].join(", "),
    control: [
      "'Gilroy-Regular'",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "'Helvetica Neue'",
      "Arial",
      "sans-serif",
    ].join(", "),
  },
};
export default theme;
export type Theme = typeof theme;

// NOTE: Typescript is awesome
export type ThemeColor =
  | keyof typeof themeColors
  | `${keyof typeof themeColors}${"A" | "L" | "D" | "S"}${
      | "5"
      | "10"
      | "15"
      | "20"
      | "30"
      | "40"
      | "50"
      | "60"
      | "70"
      | "80"
      | "90"}`
  | `${keyof typeof themeColors}Border`;
export const isThemeColor = (text: string): text is ThemeColor =>
  (<any>themeColors)[text] !== undefined;
